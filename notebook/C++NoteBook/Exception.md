# 异常处理
throw 抛出异常  
try 可能异常的代码块  
catch 捕获异常并处理

一个try 语句块的后面可以跟多个catch 语句块, 用于捕获不同类型的异常进行处理
  
```cpp
double division(int a, int b)
{
   if( b == 0 )
   {
      throw "Division by zero condition!";//throw
   }
   return (a/b);
}
 
int main ()
{
   int x = 50;
   int y = 0;
   double z = 0;
 
   try {
    //可能异常
     z = division(x, y);
     cout << z << endl;
   }catch (const char* msg) {//异常类型为 const char*
   //处理异常
     cerr << msg << endl;
   }
 
   return 0;
}
```
## 异常传播
异常首先在当前函数内查找匹配的 catch块。若当前函数未捕获，沿调用链向上回溯，逐层检查调用方的 try-catch块。直到找到匹配的 catch块，或到达 main()函数仍无匹配（程序终止）。

如果异常传播到 main()函数仍未被捕获，C++ 标准库会调用 std::terminate()，默认行为是 abort()​ 终止程序。这可能导致资源未释放等问题，因此应确保关键异常被捕获。

catch (...)可捕获任意异常，通常放在最后作为“兜底”

## 异常捕获
捕获的匹配是按照catch块的先后顺序进行的，基类异常可以捕获派生类异常，因此如果希望捕获派生类异常，要将其放在基类异常之前

## 常见运行错误



### **1. 访问冲突（Access Violation）**
- **错误代码**：`0xC0000005` (Windows) / `SIGSEGV` (Linux/macOS)
- **触发场景**：
  ```c
  int *ptr = nullptr;
  *ptr = 42;  // 解引用空指针

  int arr[5] = {0};
  arr[10] = 1;  // 数组越界

  int *p = (int*)malloc(sizeof(int));
  free(p);
  *p = 10;      // 使用已释放内存
  ```
- **本质原因**：访问了进程无权操作的内存地址（空指针、已释放内存、只读内存等）
---

### **2. 堆损坏（Heap Corruption）**
- **错误代码**：`0xC0000374` (STATUS_HEAP_CORRUPTION)
- **触发场景**：
  ```c
  char *buffer = (char*)malloc(10);
  strcpy(buffer, "This string is too long!");  // 缓冲区溢出
  free(buffer);  // 触发堆损坏

  int *p = new int[10];
  delete p;      // 错误：应使用 delete[]
  ```
- **根本原因**：
  - 缓冲区溢出覆盖堆管理结构
  - 错误的内存释放方式（`new[]`/`delete` 不匹配）
  - 双重释放（Double Free）


---

### **3. 整数除零（Integer Divide by Zero）**
- **错误代码**：`0xC0000094` (STATUS_INTEGER_DIVIDE_BY_ZERO)
- **示例**：
  ```c
  int a = 10, b = 0;
  int c = a / b;  // 触发异常
  ```
- **特殊注意**：浮点数除零不会崩溃，而是产生 `INF` 或 `NaN`

---

### **4. 未处理异常（Unhandled Exception）**
- **错误代码**：`0xC0000005` (通用异常代码)
- **常见类型**：
  - **C++ 异常**：未被捕获的 `std::exception`
  ```cpp
  throw std::runtime_error("Critical failure");
  ```
  - **系统异常**：如非法指令（`SIGILL`）、浮点异常（`SIGFPE`）

---

### **5. 断言失败（Assertion Failure）**
- **错误代码**：非系统级错误（程序主动终止）
- **示例**：
  ```c
  #include <cassert>
  void critical_function(int x) {
      assert(x > 0 && "x must be positive");  // 断言
      // ...
  }
  ```


---

### **6. 资源耗尽错误**
| 错误类型          | 错误代码/表现               | 触发原因                  |
|-------------------|---------------------------|--------------------------|
| **内存不足**      | `bad_alloc` (C++)         | `new` 分配失败            |
| **句柄泄漏**      | `ERROR_TOO_MANY_HANDLES`   | 未关闭文件/内核对象       |
| **线程创建失败**  | `STATUS_WORKING_SET_QUOTA` | 线程栈空间或数量超限      |

---

### **7. 多线程相关错误**
- **数据竞争（Data Race）**：
  ```cpp
  // 未加锁的共享变量访问
  int counter = 0;
  void increment() { counter++; }  // 多线程调用导致未定义行为
  ```
- **死锁（Deadlock）**：
  ```cpp
  std::mutex m1, m2;
  // 线程1：锁定 m1 后尝试锁 m2
  // 线程2：锁定 m2 后尝试锁 m1
  ```

### **8. 栈溢出 0xC00000FD**
