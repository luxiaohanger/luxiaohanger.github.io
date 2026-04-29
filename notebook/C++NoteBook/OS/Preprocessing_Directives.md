## 🚀 C++ 预处理指令工程实战笔记

### 1. 头文件防重包含 (The Standard Guard)
在大型工程中，同一个头文件可能被不同的文件引用几十次。为了避免“重复定义”错误，这是每个 `.h` 文件的标配：

* **传统做法（最兼容）：**
    ```cpp
    #ifndef MY_PROJECT_USER_MGR_H
    #define MY_PROJECT_USER_MGR_H
    // 类定义和声明
    #endif 
    ```
* **现代做法（最简洁）：**
    ```cpp
    #pragma once // 现代编译器通用，效率略高，一行搞定
    ```

### 2. 调试日志开关 (Debug Toggles)
你一定不希望在发布正式版程序时，屏幕上还疯狂弹调试日志。

* **用法示例：**
    ```cpp
    #ifdef DEBUG
        #define LOG(msg) std::cout << "[DEBUG]: " << msg << std::endl
    #else
        #define LOG(msg) // 发布版中 LOG 会被替换为空白，完全不占运行内存
    #endif
    ```
    > **工程技巧**：在编译器设置（如 CMake 或 VS 属性）里定义 `DEBUG` 宏，无需修改代码即可切换版本。

### 3. 跨平台适配 (Platform Abstraction)
同一份代码要在 Windows 和 Linux 上跑，预处理器是唯一的“协调员”。

* **用法示例：**
    ```cpp
    #if defined(_WIN32)
        #include <windows.h>
        #define SLEEP(ms) Sleep(ms)
    #elif defined(__linux__)
        #include <unistd.h>
        #define SLEEP(ms) usleep(ms * 1000)
    #endif
    ```


### 4. 强制环境检查 (Sanity Checks)
如果你的项目必须在特定条件下运行（例如必须使用 C++17），可以用 `#error` 提早“炸毁”编译过程，防止后续产生莫名其妙的 Bug。

* **用法示例：**
    ```cpp
    #if __cplusplus < 201703L
        #error "本工程使用了 std::filesystem，请开启 C++17 编译选项！"
    #endif
    ```

### 5. 简单的版本管理 (Versioning)
在代码中记录版本号，方便在程序运行过程中打印版本信息。

* **用法示例：**
    ```cpp
    #define VERSION_MAJOR 2
    #define VERSION_MINOR 5
    
    // 使用 # 将宏转换为字符串
    #define STRINGIFY(x) #x
    #define TOSTRING(x) STRINGIFY(x)
    
    std::cout << "Version: " << TOSTRING(VERSION_MAJOR) << "." << TOSTRING(VERSION_MINOR);
    ```

---

### ⚠️ 工程避坑指南 (The "Don'ts")

1.  **别用宏定义常量**：
    * ❌ `#define PI 3.14`
    * ✅ `constexpr double PI = 3.14;` (宏没有类型，出错了极难调试)
2.  **宏的参数要加括号**：
    * ❌ `#define SQUARE(x) x * x` —— 如果调用 `SQUARE(1+1)`，会变成 `1+1*1+1 = 3`。
    * ✅ `#define SQUARE(x) ((x) * (x))` —— 确保运算顺序正确。
3.  **谨慎使用 `#undef`**：除非你是在写非常底层的库，否则随意撤销宏会增加代码的阅读难度。

---

**学习建议**：
初学者最先掌握 **`#include`** 和 **`#pragma once`** 即可保证代码正常运行。当你开始接触多平台开发或者需要优化发布版本时，再回来翻阅 **`#ifdef`** 的用法。

你现在的练习项目中，有尝试过把代码拆分成多个 `.h` 和 `.cpp` 文件吗？