# Read-Write Lock
如果在并发场景中，**“读”的操作远多于“写”的操作**（例如：一个高频查询的路由表或配置信息），那么 POSIX **读写锁（Read-Write Lock）** 就是比互斥锁（Mutex）更高效的选择。

它的核心哲学是：**读读共享，读写互斥，写写互斥。**

---
## 概览
### 1. 读写锁的原理：三条核心规则

读写锁（`pthread_rwlock_t`）维护了一个内部状态，其行为遵循以下规则：

1.  **无锁状态：** 任何线程都可以获得读锁或写锁。
2.  **读锁保护下（Shared）：** * 其他线程可以继续获得**读锁**（支持并发读）。
    * 尝试获取**写锁**的线程必须阻塞等待。
3.  **写锁保护下（Exclusive）：** * 任何其他线程（无论是想读还是想写）都必须阻塞等待。

**性能优势：** 互斥锁（Mutex）在任何时候都只允许一个线程进入。而读写锁在没有写者时，允许成百上千个线程同时读取数据，这极大地提高了多核 CPU 的并行效率。



### 2. 使用语法 (API)

读写锁的操作函数前缀为 `pthread_rwlock_`。

#### A. 初始化与销毁
```c
pthread_rwlock_t rwlock;

// 动态初始化
pthread_rwlock_init(&rwlock, NULL);

// 销毁
pthread_rwlock_destroy(&rwlock);
```

#### B. 加锁操作
* **申请读锁（共享）：**
    ```c
    pthread_rwlock_rdlock(&rwlock);    // 阻塞直到获得读权限
    pthread_rwlock_tryrdlock(&rwlock); // 非阻塞版本
    ```
* **申请写锁（独占）：**
    ```c
    pthread_rwlock_wrlock(&rwlock);    // 阻塞直到获得写权限
    pthread_rwlock_trywrlock(&rwlock); // 非阻塞版本
    ```

#### C. 解锁操作
读锁和写锁都使用同一个解锁函数：
```c
pthread_rwlock_unlock(&rwlock);
```


### 3. 一个关键的问题：写者饥饿（Writer Starvation）

这是读写锁最经典的技术挑战。

* **现象：** 如果读者非常活跃，源源不断地有新线程申请读锁。由于读锁是共享的，信号量/状态可能永远不会回到 0，导致申请写锁的线程被“饿死”，永远拿不到执行权。
* **POSIX 的对策：** 大多数现代 POSIX 实现（如 Linux 的 `glibc`）默认采用**写者优先**策略。当一个线程请求写锁时，后续新来的读者会被阻塞，直到当前的读者全部退出且写者完成任务。


### 4. 总结：什么时候选读写锁？

读写锁并不是万能的，因为它内部维护状态的开销比简单的 Mutex 更高。

| 评估维度 | 建议方案 |
| :--- | :--- |
| **读多写少 (读占 90% 以上)** | **读写锁**。性能提升非常显著。 |
| **读写频率差不多** | **互斥锁 (Mutex)**。Mutex 更轻量，逻辑更简单。 |
| **临界区极短** | **自旋锁 (Spinlock)** 或 **原子操作**。 |
| **需要递归加锁** | **递归 Mutex**。读写锁通常不支持同一个线程重复加锁。 |

------

## RCU
**RCU (Read-Copy-Update)** 是 Linux 内核中一种极其精妙的同步机制。它专门为**“读极多、写极少”**的场景设计，其核心目标是让**读取者（Reader）几乎零开销**，甚至在读取时完全不需要任何锁或原子操作。

如果说读写锁（RWLock）是“读读并行”，那么 RCU 实现了更高级的**“读写并行”**。

### 1. RCU 的核心哲学
RCU 的名字就解释了它的工作原理：
1.  **Read（读取）：** 读者直接访问数据，不需要获取任何锁。
2.  **Copy（复制）：** 当需要修改数据时，写者先复制一份数据的副本。
3.  **Update（更新）：** 写者在副本上完成修改，然后原子的（通过替换指针）将旧数据指向新数据。

**最关键的问题：** 旧数据什么时候能销毁？
因为读取者没有加锁，当指针被替换时，可能仍有旧的读者在访问老数据。RCU 会等待所有可能访问旧数据的读者都退出后，再回收旧内存。

### 2. RCU 的生命周期（三个阶段）

#### A. 宽限期（Grace Period）
这是 RCU 最核心的概念。当写者移除一个指向旧数据的指针后，系统进入“宽限期”。
* **什么是宽限期？** 是指所有在“指针替换”发生前就已经存在的读取者，全部都退出的那段时间。
* **静止状态（Quiescent State）：** 当一个 CPU 发生了上下文切换（对于非抢占内核）或进入了空闲状态，说明该 CPU 上的读者已经退出了临界区。

#### B. 读取端临界区 (Reader Section)
```c
rcu_read_lock();   // 仅仅是禁止抢占，没有任何开销
p = rcu_dereference(ptr); 
if (p) {
    // 访问 p 指向的内容
}
rcu_read_unlock(); // 恢复抢占
```
在 RCU 看来，读操作就是读取一个指针。即使写者此刻正在替换指针，读者要么读到旧的，要么读到新的，**永远不会读到半新半旧的崩溃数据**。

#### C. 更新端 (Updater)
```c
new_p = kmalloc(...);
*new_p = *old_p;      // 1. Copy
new_p->value = 99;    // 2. Update (in copy)
rcu_assign_pointer(ptr, new_p); // 3. 原子切换指针
synchronize_rcu();    // 4. 等待宽限期结束（阻塞直到所有旧读者退出）
kfree(old_p);         // 5. 销毁旧内存
```

### 3. RCU 的优缺点

#### 优点（为什么内核开发者痴迷它）
* **读者零开销：** 在非抢占内核中，`rcu_read_lock()` 几乎不产生指令。没有锁竞争，没有缓存行失效（Cache line bouncing），性能极高。
* **读写并行：** 写者在修改数据时，读者可以继续无阻碍地读取旧数据。
* **无死锁：** 读者不拿锁，所以不存在死锁问题。

#### 缺点（天下没有免费的午餐）
* **写者开销巨大：** 写者需要复制数据，还需要调用 `synchronize_rcu()` 阻塞等待，或者使用异步回调 `call_rcu()`。
* **内存延迟回收：** 旧内存不能立即释放，会增加内存压力。
* **逻辑复杂：** 开发者必须确保数据是通过指针访问的，且能容忍“短暂的旧数据一致性”。


### 4. RCU vs 读写锁 (RWLock)

| 特性 | 读写锁 (RWLock) | RCU |
| :--- | :--- | :--- |
| **读者开销** | 必须原子修改锁计数值（有开销） | 几乎为零（极高性能） |
| **读写关系** | 互斥（写者必须等所有读者走） | **并行**（写者改写时读者读旧数据） |
| **写者开销** | 中等 | 高（需等待宽限期） |
| **确定性** | 读者总能读到最新的 | 读者在宽限期内可能读到旧数据 |


---
## Userspace RCU
首先需要澄清一个重要的技术背景：POSIX 标准本身并不包含 RCU（Read-Copy-Update）。

RCU 最初是 Linux 内核的核心特性。由于它在多核并行上的极致性能，后来出现了 Userspace RCU (liburcu) 库，它为用户态程序（遵循 POSIX 标准的系统）提供了类似内核 RCU 的功能


Userspace RCU 最常用的变体是 `QSBR`（Quiescent-State-Based Reclamation，基于静止状态的回收），性能最高。


### 1. 完整代码示例 (`main.c`)

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <urcu-qsbr.h> // 核心头文件

// 1. 定义我们要保护的数据结构
struct Config {
    int version;
    int data_array[3]; // 模拟复杂数据
};

// 全局受保护的指针
struct Config *global_config = NULL;

// --- 读线程函数 ---
void* reader_func(void* arg) {
    long id = (long)arg;
    
    // 【必须】每个线程使用 RCU 前必须注册
    rcu_register_thread();

    while (1) {
        // 【必须】进入读临界区
        rcu_read_lock();

        // 安全地获取当前指针
        struct Config *p = rcu_dereference(global_config);

        if (p) {
            printf("[Reader %ld] 正在读取版本: %d, 数据: [%d, %d, %d]\n", 
                   id, p->version, p->data_array[0], p->data_array[1], p->data_array[2]);
        }

        // 【必须】退出读临界区
        rcu_read_unlock();

        // 【关键】对于 QSBR 模式，必须显式声明“静止状态”
        // 这告诉写者：我这一轮读完了，你可以回收旧内存了
        rcu_quiescent_state();

        usleep(500000); // 读间隔 0.5s
    }

    rcu_unregister_thread();
    return NULL;
}

// --- 写线程函数 ---
void* writer_func(void* arg) {
    rcu_register_thread();
    int count = 1;

    while (count <= 5) {
        sleep(2); // 每 2 秒更新一次

        // A. Copy: 申请新内存并拷贝旧数据
        struct Config *new_cfg = malloc(sizeof(struct Config));
        struct Config *old_cfg = global_config;

        // B. Update: 修改新副本
        new_cfg->version = count;
        for(int i=0; i<3; i++) new_cfg->data_array[i] = count * 10 + i;

        printf("\n[Writer] ======= 准备发布新版本: %d =======\n", count);

        // C. Publish: 原子替换指针
        rcu_assign_pointer(global_config, new_cfg);

        // D. Wait: 等待所有老读者离开（宽限期）
        // 只有所有读线程都调用了 rcu_quiescent_state()，此函数才会返回
        synchronize_rcu();

        // E. Free: 安全销毁旧内存
        if (old_cfg) {
            free(old_cfg);
            printf("[Writer] 旧版本内存已安全回收\n\n");
        }

        count++;
    }

    rcu_unregister_thread();
    return NULL;
}

int main() {
    pthread_t readers[3], writer;

    // 初始化全局数据
    global_config = malloc(sizeof(struct Config));
    global_config->version = 0;
    for(int i=0; i<3; i++) global_config->data_array[i] = 0;

    // 创建线程
    pthread_create(&writer, NULL, writer_func, NULL);
    for (long i = 0; i < 3; i++) {
        pthread_create(&readers[i], NULL, reader_func, (void*)i);
    }

    // 等待写线程结束（演示用）
    pthread_join(writer, NULL);
    
    return 0;
}
```

### 2. 编译说明

在 Linux 系统上，你需要先安装开发库：
```bash
sudo apt-get install liburcu-dev
```

编译时必须链接 `urcu-qsbr` 库和 `pthread` 库：
```bash
gcc main.c -lurcu-qsbr -lpthread -o rcu_demo
```
