## 🛠️ C++ 高并发核心语法笔记

### 1. 线程的创建与生命周期：`std::thread`

C++11 引入了官方的 `std::thread`，彻底告别了过去 Linux 复杂的 `pthread_create`。

* **基本语法**：
创建 `std::thread` 对象时，只要传入一个**可调用对象**（比如普通函数、Lambda 表达式、或者类成员函数），线程就会**立即在后台启动运行**。
* **资源回收（`join` vs `detach`）**：
一个线程对象在销毁前，你必须显式决定它的命运，否则程序会直接崩溃（`std::terminate`）：
* `join()`：主线程**阻塞等待**子线程执行完毕，然后回收其资源（通常用于线程池析构）。
* `detach()`：将子线程分离，任其在后台自生自灭（不推荐用于需要精确控制生命周期的服务器组件）。



```cpp
#include <thread>
#include <iostream>

void print_hello(int id) {
    std::cout << "子线程 " << id << " 正在运行" << std::endl;
}

int main() {
    // 创建并立即启动线程，传入函数名和参数
    std::thread t1(print_hello, 1); 
    
    t1.join(); // 主线程等待 t1 结束后再继续往下走
    return 0;
}

```

---

### 2. 现代 C++ 的灵魂：Lambda 表达式（匿名函数）

> `emplace_back()` 用于原地构造，支持传入对象的构造函数参数，直接在内存调用构造函数，避免了栈空间的移动、拷贝
> 在这里，`std::thread` 的构造函数参数就是一个可执行对象，例如函数、`lambda`、`function`

在编写线程池的工作线程死循环时，使用 Lambda 表达式是最优雅、最标准的写法。

* **语法结构**：`[捕获列表](参数列表) { 函数体 };`
* **捕获列表 `[this]**`：在类（如 `ThreadPool`）的内部创建线程时，子线程的 Lambda 必须捕获 `this` 指针，这样子线程才有权限访问类的私有成员变量（如任务队列 `tasks_` 和互斥锁）。

```cpp
// 线程池构造函数内部的常见写法
workers_.emplace_back([this]() {
    // 子线程的死循环逻辑
    while(true) {
        // 访问 ThreadPool 的私有成员
        if (this->stop_) return; 
    }
});

```

---

### 3. 数据安全保护锁：`std::mutex` 与 `std::unique_lock`

多线程同时访问同一个任务队列 `std::queue` 时会发生数据竞争（Data Race），必须加锁保护。

* **`std::mutex`（互斥锁）**：提供最基础的锁机制。
* **`std::unique_lock`（管家锁）**：
* 它采用了 **RAII 思想**：在构造时自动调用 `lock()` 加锁，在离开当前花括号 `{}` 作用域析构时，自动调用 `unlock()` 解锁，绝对防止死锁。
* **核心细节**：在线程池中，我们**必须**使用 `std::unique_lock`，而不能用轻量级的 `std::lock_guard`。因为接下来的“条件变量”在休眠时需要手动开锁、唤醒时自动抢锁，这种高级操作只有 `std::unique_lock` 支持。



```cpp
#include <mutex>
#include <queue>

std::mutex mtx;
std::queue<int> q;

void push_data(int val) {
    // 花括号定义了一个“临界区”作用域
    {
        std::unique_lock<std::mutex> lock(mtx); // 自动加锁
        q.push(val);
    } // 出了花括号，lock 析构，自动解锁！
}

```

---

### 4. 线程间的红绿灯：`std::condition_variable`（条件变量）

如果任务队列为空，子线程池如果不做处理，就会疯狂执行 `while(true)` 空转，把 CPU 打满到 100%。条件变量专门用来解决这个“通知-唤醒”问题。

* **`wait(lock, predicate)`（休眠等待）**：
子线程调用它。它接收一个锁和一个返回布尔值的条件（谓词）。
* 如果条件为 `false`，它会**释放锁**并让线程进入**休眠状态**（不占 CPU）。
* 如果条件为 `true`，直接放行。

> `wait()` 通常配合 `unique_lock()` 使用，当线程被唤醒时，`wait` 会先抢锁，只有拿到锁以后才进行实时的条件推导，由此保证线程安全

> 这里的谓词一般是 `lambda` 表达式，而不能使用 `bool` 表达式，因为 `bool` 表达式是静态推导，提前复制，从传递完成到 `wait` 判断可能已经失效；而 `lambda` 是实时推导，此时已经获取到 `mutex` ，此时进行判断是线程安全的

* **`notify_one()` / `notify_all()`（唤醒信号）**：
主线程（生产者）往队列丢了任务后，调用它来精准唤醒正在休眠的子线程起来干活。

```cpp
#include <condition_variable>
#include <mutex>

std::mutex mtx;
std::condition_variable cv;
bool ready = false;

// 子线程等待信号
void worker() {
    std::unique_lock<std::mutex> lock(mtx);
    // 只有当 ready 为 true 时才会醒来往下走，否则一直安全休眠
    cv.wait(lock, [](){ return ready; }); 
    // 醒来后自动重新持有锁，开始干活...
}

// 主线程改变条件并发出通知
void ship_data() {
    {
        std::unique_lock<std::mutex> lock(mtx);
        ready = true;
    }
    cv.notify_one(); // 唤醒一个等待的线程
}

```

---

