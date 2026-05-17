# Condition Variables
在多线程编程中，**条件变量（Condition Variables）** 是一种同步机制，允许线程在特定条件未满足时挂起，直到另一个线程发出信号唤醒它。它通常与**互斥锁（Mutex）** 配合使用，以避免“忙等”（Busy-waiting）。

可以将整个过程分为四个关键动作：

#### A. 检查与预判 (Checking)
线程首先通过 `pthread_mutex_lock` 进入临界区。此时，它是唯一能访问“控制条件”（如食物剩余量 `food_count`）的线程。
* **逻辑体现：** `while (food_count == 0)`。
* **安全保障：** 必须加锁，否则多个线程同时判断 `food_count` 可能会导致逻辑冲突。

#### B. 释放锁并进入“小黑屋” (Wait)
当发现条件不满足时，调用 `pthread_cond_wait`。这个函数内部执行了**原子操作**：
1.  把当前线程放入 `pthread_cond_t` 的等待队列。
2.  **释放 `mutex`。**（这一步是关键，否则生产者进不来临界区修改条件）。

#### C. 被唤醒并“排队取号” (Wakeup & Relock)
当另一个线程调用 `pthread_cond_signal` 时：
1.  原本在 `cond` 队列里的线程被唤醒。
2.  **关键点：** 唤醒后的线程**并不立刻执行**下一步代码，而是先去重新竞争那把 `mutex` 锁。
3.  只有抢到了锁，`pthread_cond_wait` 才会返回 `0`，线程继续往下走。

#### D. 二次确认 (Re-checking)
此时线程必须回到 `while` 循环开头再次检查条件。
* **原因：** 在你抢到锁之前的微小间隙，可能另一个消费者线程捷足先登把刚生产的食物吃掉了。

---

##  API 
以下是 Linux 中 POSIX 线程库（`pthread`）提供的条件变量 API。


在使用这些函数之前，需要包含头文件 `<pthread.h>`。

### 1. 初始化 API

#### `pthread_cond_init`
```c
int pthread_cond_init(pthread_cond_t *restrict cond, const pthread_condattr_t *restrict attr);
```
* **`cond` (参数)**: 指向需要初始化的 `pthread_cond_t` 结构体的指针。
* **`attr` (参数)**: 条件变量属性。通常传入 `NULL` 使用默认属性（如：进程内私有）。如果需要跨进程同步，则需配置属性对象。
* **返回值**: 
    * 成功返回 `0`。
    * 失败返回错误码（如 `EAGAIN` 系统资源不足，`ENOMEM` 内存不足）。


### 2. 等待 API

#### `pthread_cond_wait`
这是最容易出错的地方，它的内部逻辑其实包含了“解锁 -> 挂起 -> 被唤醒 -> 加锁”四个步骤。
```c
int pthread_cond_wait(pthread_cond_t *restrict cond, pthread_mutex_t *restrict mutex);
```
* **`cond` (参数)**: 线程要加入的等待队列。
* **`mutex` (参数)**: 已锁定的互斥锁。
    * **函数内部逻辑**：函数执行时，会**自动释放** `mutex` 并使线程进入休眠。这两个步骤是原子的。当线程被唤醒并准备返回时，它会**重新锁定** `mutex`。
* **返回值**:
    * 成功返回 `0`。
    * **注意**：如果返回非零，通常表示发生了灾难性错误（如无效的参数）。

### `pthread_cond_timedwait`
带有超时的阻塞等待。
```c
int pthread_cond_timedwait(pthread_cond_t *restrict cond, pthread_mutex_t *restrict mutex, const struct timespec *abstime);
```
* **`abstime` (参数)**: **绝对时间**（不是相对时间）。例如，“等到 2026年4月10日 15:30:00”，而不是“等 5 秒”。
    * 通常通过 `clock_gettime(CLOCK_REALTIME, &ts)` 获取当前时间再累加。
* **返回值**:
    * 成功返回 `0`。
    * **`ETIMEDOUT`**: 时间到了但条件仍未满足（这是最常见的非零返回值）。

### 3. 通知 API

#### `pthread_cond_signal`
```c
int pthread_cond_signal(pthread_cond_t *cond);
```
* **功能**: 唤醒等待该条件变量的**至少一个**线程。
* **返回值**: 成功返回 `0`。

### `pthread_cond_broadcast`
```c
int pthread_cond_broadcast(pthread_cond_t *cond);
```
* **功能**: 唤醒等待该条件变量的**所有**线程。常用于多个消费者或复杂的资源竞争场景。
* **返回值**: 成功返回 `0`。


### 常见返回错误码总结

在 C 语言开发中，判断返回值是良好的编程习惯：

* **`EINVAL`**: 提供的条件变量、互斥锁或时间参数无效。
* **`EPERM`**: 当前线程不持有指定的互斥锁（通常发生在尝试 wait 但之前没 lock）。
* **`EBUSY`**: 尝试销毁（`destroy`）一个尚有线程在等待的条件变量。

在使用 `pthread_cond_timedwait` 时，代码结构通常如下：
```c
struct timespec ts;
clock_gettime(CLOCK_REALTIME, &ts);
ts.tv_sec += 5; // 设置 5 秒超时

pthread_mutex_lock(&lock);
int rc = 0;
while (!condition && rc == 0) {
    rc = pthread_cond_timedwait(&cond, &lock, &ts);
}

if (rc == ETIMEDOUT) {
    // 处理超时逻辑
} else {
    // 处理条件满足逻辑
}
pthread_mutex_unlock(&lock);
```
---
## wait signal 详解

### 线程理解
当你调用 `pthread_cond_wait` 时，线程经历了一次完美的“华尔兹”：

1.  **Running $\rightarrow$ Blocked (挂起)**：
    * 线程执行 `wait`，OS 将该线程的 TCB（线程控制块）从 **就绪队列** 移出，放入 `pthread_cond_t` 维护的 **等待队列** 中。
    * 此时 CPU 寄存器里的上下文（PC指针、栈顶指针等）被保存到内存，CPU 被切走去跑别的线程。
2.  **Blocked $\rightarrow$ Ready (被唤醒)**：
    * 当另一个线程调用 `signal`，OS 将你的线程从 `cond` 等待队列移回 **就绪队列**。
    * **注意**：此时你虽然是 `Ready` 状态，但 `wait` 函数还不能返回，因为你手里还没锁！
3.  **Ready $\rightarrow$ Running (获取锁并返回)**：
    * OS 调度器选中你的线程，加载上下文，恢复执行。
    * `wait` 函数内部立刻发起 `pthread_mutex_lock` 请求。
    * **一旦抢锁成功**，`wait` 函数才算真正执行完毕，代码继续执行下一行。


* **Wait** = 释放锁 + 挂起 + 保存上下文。
* **Signal** = 标记为 Ready。
* **Wait 返回前** = 加载上下文 + 重新 Lock 请求。

### api理解

在 `pthread_cond_wait(cond, mutex)` 的实现中，虽然它不是直接简单地调用 `pthread_mutex_lock(mutex)` 函数，但它包含了一段**功能等价的代码逻辑**。

整个 `wait` 的底层逻辑伪代码如下：

```c
int pthread_cond_wait(cond, mutex) {
    // 1. 准备阶段：将自己加入等待队列 (CAS 操作 cond 内部的计数器/链表)
    
    // 2. 释放锁：内部执行 unlock 逻辑
    pthread_mutex_unlock(mutex); 
    
    // 3. 阻塞：调用系统调用让线程休眠
    futex_wait(&cond->futex_word, expected_val); 
    
    // --- 线程在此处挂起 --- 
    // --- 被 signal 唤醒后继续执行 ---

    // 4. 重新拿锁：这里执行的是和 pthread_mutex_lock 相同的逻辑
    // 必须抢到这把锁，函数才能返回
    return __pthread_mutex_lock_full(mutex); 
}
```

| 动作 | 涉及的技术 | 是否包含 `mutex_lock` 逻辑？ |
| :--- | :--- | :--- |
| **`pthread_cond_wait`** | CAS + `futex_wait` + **`mutex_lock` 逻辑** | **是**。唤醒后必须重新争夺传入的锁。 |
| **`pthread_cond_signal`** | CAS + `futex_wake` | **否**。它只负责叫醒，不负责拿锁。 |

---

## 标准使用范式

条件变量的使用必须遵循特定的模板，否则会产生**竞态条件**或**虚假唤醒**。

### 消费者（等待端）
消费者必须在锁定互斥锁的情况下检查条件，并使用 `while` 循环（而非 `if`）来调用 `wait`。

```c
pthread_mutex_lock(&lock);
while (condition_is_false) { 
    pthread_cond_wait(&cond, &lock); 
}
// 此时条件已满足，且已重新获得锁
// 执行后续逻辑...
pthread_mutex_unlock(&lock);
```

### 生产者（通知端）
生产者改变条件后，发送信号。

```c
pthread_mutex_lock(&lock);
// 改变条件变量关联的全局状态
condition_is_false = false; 
pthread_cond_signal(&cond); // 或 pthread_cond_broadcast
pthread_mutex_unlock(&lock);
```

### 使用 `while` 循环
这主要是为了应对 **虚假唤醒（Spurious Wakeups）**。在某些操作系统底层实现或多核环境下，线程可能会在没有收到明确信号的情况下从 `wait` 中返回。
> **原则：** 永远不要假设 `wait` 返回就意味着条件一定成立，必须再次检查。

---

## 完整的代码示例

这是一个简单的“生产者-消费者”模型，演示了 API 的配合使用。

```c
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

//宏 PTHREAD_MUTEX_INITIALIZER 本质上是一个大的花括号常量（如 { {0, 0, 0, 0, 0, 0, {0, 0}} }）。
//这样的锁位于静态区，堆栈区的锁需要 init 和 destroy
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
int ready = 0; // 共享资源/条件

void* consumer(void* arg) {
    pthread_mutex_lock(&lock);
    while (ready == 0) { // 使用 while 防止虚假唤醒
        printf("消费者：条件不满足，等待中...\n");
        pthread_cond_wait(&cond, &lock);
    }
    printf("消费者：条件满足，开始执行！\n");
    pthread_mutex_unlock(&lock);
    return NULL;
}

void* producer(void* arg) {
    sleep(2); // 模拟耗时操作
    pthread_mutex_lock(&lock);
    ready = 1; // 改变条件
    printf("生产者：准备就绪，发出信号...\n");
    pthread_cond_signal(&cond);
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, consumer, NULL);
    pthread_create(&t2, NULL, producer, NULL);
    
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    return 0;
}
```

## 实际使用经验
1.注意并发竞争下所有可能的情况（极端情况、偶发情况），例如使用一个CV承载生产者和消费者时，signal唤醒CV中某一个线程时，可能多次都没有唤醒生产者，此时所有线程陷入沉睡

2.在多线程世界里，“等待”必须对应一个“唤醒”。如果循环次数不匹配，就会导致某个线程在“等待”时，原本该“唤醒”它的那个人已经下班回家了，这便是并发编程中最常见的死锁诱因。使用**哨兵值 (Poison Pill)**： 当生产者完成所有任务后，向队列里放入一个特殊的“停止信号”。消费者看到这个信号就自动退出。