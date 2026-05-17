## 📚 C++ 类依赖组织核心笔记

### 1. 核心法则：为什么要区分 .h 和 .cpp？

* **`.h` 文件（预告片）**：仅告知编译器“有什么”。它应该尽可能的轻量，只写声明。
* **`.cpp` 文件（正片）**：具体实现逻辑。在这里你可以包含任何需要的头文件，因为此时类结构已经确定。

---

### 2. 三种依赖关系及处理方案

当你发现 A 类和 B 类互相需要对方时，请根据以下表格对号入座：

| 依赖程度 | 场景描述 | 解决方案 |
| --- | --- | --- |
| **弱依赖** | 只需要知道类名（如作为参数、返回类型、或指针成员）。 | **前向声明** (`class B;`) |
| **强依赖** | 需要知道类的大小（实体变量成员）或调用其成员函数。 | **#include "B.h"** |
| **循环依赖** | A 包含 B，且 B 也包含 A（你的 Server 和 Epoll 情况）。 | **前向声明 + 指针 + .cpp 包含** |

---

### 3. 黄金模板：解决循环依赖的“标准姿势”

假设 `Server` 拥有 `Epoll`（实体或指针），且 `Epoll` 是 `Server` 的友元（需要访问私有成员）。

#### 第一步：Server.h (打破循环的关键)

不要在 `.h` 里包含对方，用“前向声明”占位。

```cpp
#pragma once

class Epoll; // 前向声明：告诉编译器“Epoll是一个类，别问我它长啥样”

class Server {
public:
    Server();
    void mylisten(int fd);
    
private:
    Epoll* ep;  // 必须用指针！编译器知道指针占8字节，不需要看Epoll的定义
    int server_fd;

    friend class Epoll; // 友元声明
};

```

#### 第二步：Epoll.h (单向包含)

`Epoll` 需要知道 `Server` 的成员，所以这里可以包含。

```cpp
#pragma once
#include "Server.h" // 包含它，因为我们要访问 Server 的私有成员

class Epoll {
public:
    void addEvent(int fd);
    void solveEvent(Server& s); // 传入引用
};

```

#### 第三步：Server.cpp (合并所有信息)

这里是“真相大白”的地方，必须包含两个头文件。

```cpp
#include "Server.h"
#include "Epoll.h" // 在这里包含，编译器才知道 ep->addEvent() 是什么

Server::Server() {
    ep = new Epoll(); 
}

void Server::mylisten(int fd) {
    ep->addEvent(fd); // 此时编译器已经读了 Epoll.h，知道 addEvent 的存在
}

```

---

### 4. 为什么不能在 .h 里直接写 `Epoll ep;`？

这是初学者最容易犯的错。如果你在 `Server.h` 写 `Epoll ep;`（实体对象）：

1. 编译器需要计算 `Server` 类占多少字节。
2. 要计算 `Server` 的大小，必须先知道 `Epoll` 有多大。
3. 于是去读 `Epoll.h`，如果 `Epoll.h` 又反过来包含 `Server.h`……
4. **死循环发生**：编译器像追逐自己尾巴的猫，最后崩溃报错。

**结论**：在头文件中使用**指针 (`Epoll*`)** 或 **引用 (`Epoll&`)**，配合**前向声明**，是解决耦合的唯一出路。

---

### 5. 避坑总结（避雷指南）

1. **能用前向声明，就不要 `#include**`。
2. **头文件只声明指针或引用**，实体对象的创建（`new`）和函数调用统统移到 `.cpp`。
3. **友元声明不影响包含逻辑**：`friend class X;` 不需要 `#include "X.h"`，只需前向声明。
4. **每个 `.cpp` 必须包含对应的 `.h**`，以及它代码中实际调用的所有类型的 `.h`。

