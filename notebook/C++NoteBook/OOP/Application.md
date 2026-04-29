# OOP 的文件级应用
简单介绍 `.h`（头文件）和 `.cpp`（源文件）的经典配合方式

**核心思想：接口与实现分离**

1.  **`.h` 文件 (头文件)：**
    *   **职责：声明接口 (Interface Declaration)**
    *   **包含内容：**
        *   **类定义 (Class Definition)：** 这是头文件的核心。
            *   **成员变量 (Member Variables)：** 声明类的数据成员（通常是 `private` 或 `protected`）。
            *   **成员函数声明 (Member Function Declarations)：** 声明类的所有成员函数（`public`, `protected`, `private`），**但不包含函数体（定义）**。例如：
                ```cpp
                // MyClass.h
                class MyClass {
                public:
                    MyClass(int value); // 构造函数声明
                    int getValue() const; // 成员函数声明
                    void setValue(int newValue); // 成员函数声明
                    void doSomethingComplex(); // 成员函数声明 (假设实现复杂)

                private:
                    int secretData_; // 成员变量声明
                };
                ```
            *   **友元声明 (Friend Declarations)：** 声明友元函数或友元类。
        *   **内联函数定义 (Inline Function Definitions)：** 对于**非常小、简单**的函数（如 `getter`/`setter`），可以直接在类定义内部**声明并定义**（隐式内联）。例如：
            ```cpp
            // MyClass.h (续)
            class MyClass {
                // ... 其他声明 ...
            public:
                // 小函数直接在类内定义 (隐式 inline)
                int getValue() const { return secretData_; }
                void setValue(int newValue) { secretData_ = newValue; }
            };
            ```
        *   **必要的类型定义和前置声明：** `typedef`, `using`, `enum class`, 其他类的 `class SomeOtherClass;`（前置声明）等。
        *   **包含必要的其他头文件：** 如果类声明中使用了其他类型（如 `std::string`, 自定义类等），需要包含对应的头文件 (`#include <string>`, `#include "OtherClass.h"`)。**目标是只包含绝对必要的头文件，以最小化依赖。**
    

2.  **`.cpp` 文件 (源文件)：**
    *   **职责：实现细节 (Implementation Details)**
    *   **包含内容：**
        *   **包含对应的 `.h` 文件：** `#include "MyClass.h"`。这是必须的，因为实现需要知道类的完整定义（包括私有成员）。
        *   **成员函数定义 (Member Function Definitions)：** 使用作用域解析运算符 (`::`) 定义在 `.h` 文件中**声明但未在类内定义**的成员函数。例如：
            ```cpp
            // MyClass.cpp
            #include "MyClass.h"

            // 构造函数定义
            MyClass::MyClass(int value) : secretData_(value) {}

            // 复杂成员函数定义 (在 .h 中只有声明)
            void MyClass::doSomethingComplex() {
                // ... 复杂的实现逻辑 ...
                // 可以自由使用 secretData_ 和其他私有成员
            }

            // 注意：getValue 和 setValue 已经在 .h 的类内定义了，这里不需要再定义！
            ```
        *   **静态成员变量定义 (Static Member Variable Definitions)：** 如果类中有 `static` 成员变量，其声明在 `.h` 中，但定义（分配存储空间）通常在 `.cpp` 文件中（除非是 `constexpr` 或 `inline` 变量）。
        *   **友元函数定义 (Friend Function Definitions)：** 如果友元函数不是在类内定义的（即不是内联友元），通常也定义在 `.cpp` 文件中。
        *   **其他辅助函数或局部实现细节。**
    *   **目的：**
        *   隐藏具体的实现逻辑。
        *   可以自由包含实现所需的额外头文件（如 `<algorithm>`, `<fstream>` 等），而不会将这些依赖“传染”给所有包含 `.h` 文件的代码。
        *   修改 `.cpp` 文件中的实现（只要不改变 `.h` 文件中的接口）通常只需要重新编译该 `.cpp` 文件本身，大大缩短大型项目的编译时间（**编译防火墙**）。

**OOP 中的配合流程 (以 `MyClass` 为例)**

1.  **设计接口 (`MyClass.h`):**
    ```cpp
    // MyClass.h
    #pragma once // 或 #ifndef MYCLASS_H ... 防止重复包含

    class MyClass {
    public:
        // 构造函数声明
        MyClass(int value);
        // 小函数直接在类内定义 (接口的一部分)
        int getValue() const { return secretData_; }
        void setValue(int newValue) { secretData_ = newValue; }
        // 复杂函数只声明
        void doSomethingComplex();

    private:
        int secretData_; // 数据封装
    };
    ```

2.  **实现细节 (`MyClass.cpp`):**
    ```cpp
    // MyClass.cpp
    #include "MyClass.h" // 必须包含自己的头文件
    #include <iostream>  // 实现可能需要额外头文件 (不影响 MyClass.h 的使用者)

    // 构造函数定义
    MyClass::MyClass(int value) : secretData_(value) {}

    // 复杂成员函数实现
    void MyClass::doSomethingComplex() {
        std::cout << "Secret data is: " << secretData_ << std::endl;
        // ... 其他复杂操作 ...
    }
    ```

3.  **使用类 (`main.cpp` 或其他模块):**
    ```cpp
    // main.cpp
    #include "MyClass.h" // 只需要包含头文件，了解接口

    int main() {
        MyClass obj(42);       // 创建对象 (编译器知道构造函数签名)
        obj.setValue(100);     // 调用小函数 (定义在头文件里)
        int val = obj.getValue(); // 调用小函数
        obj.doSomethingComplex(); // 调用函数 (实现在 .cpp, 链接器负责连接)
        return 0;
    }
    ```

## 声明和定义
    

| **特征**                | **声明 (Declaration)**                          | **定义 (Definition)**                          | **必须一致** | **特殊规则**                                                                 |
|-------------------------|------------------------------------------------|------------------------------------------------|--------------|-----------------------------------------------------------------------------|
| **非静态成员变量**      | `int value;`                                   | 类内初始化：`int value = 10;` (C++11+)         | 是           | 1. 类型必须完全匹配<br>2. 类外不能重新定义                                  |
| **静态成员变量**        | `static int count;`                            | 类外定义：`int Class::count = 0;`              | 是           | 1. C++17支持`inline static`类内定义<br>2. 类外定义不带`static`关键字        |
| **普通成员函数**        | `void func(int param);`                        | `void Class::func(int param) { ... }`          | 签名必须一致 | 1. 定义需类名限定<br>2. `const`/`volatile`限定符必须一致                   |
| **虚函数**              | `virtual void vfunc() const;`                  | `void Class::vfunc() const { ... }`            | 签名必须一致 | 1. 派生类声明可用`override`<br>2. 定义处禁止`virtual`/`override`           |
| **纯虚函数**            | `virtual void pure() = 0;`                     | 可选类外定义：`void Class::pure() { ... }`     | 签名必须一致 | 1. 声明必须有`=0`<br>2. 定义不能有`=0`                                     |
| **构造函数**            | `ClassName(params);`                           | `ClassName::ClassName(params) : init{...} {...}` | 名称必须一致 | 1. 无返回类型<br>2. 初始化列表仅在定义处                                   |
| **析构函数**            | `~ClassName();`                                | `ClassName::~ClassName() { ... }`              | 名称必须一致 | 1. 无返回类型<br>2. 虚析构函数在派生类定义中不需`virtual`                  |
| **模板成员函数**        | `template<typename T> void tfunc(T param);`    | `template<typename T> void Class::tfunc(T param) {...}` | 是           | 1. 通常声明定义在一起<br>2. 类外定义需完整模板前缀                         |
| **静态成员函数**        | `static void sfunc();`                         | `void Class::sfunc() { ... }`                  | 签名必须一致 | 1. 定义不带`static`<br>2. 不能使用`const`/`volatile`                       |
| **默认参数**            | 声明处指定：`void f(int x = 0);`               | 定义处禁止指定默认参数                         | -            | 只能在**一处**指定（通常在声明处）                                         |
| **constexpr成员**       | `constexpr int size = 10;` (C++11+)            | 类内直接初始化                                 | 是           | 1. 必须是字面值类型<br>2. C++14起可在类外定义                              |
| **友元函数**            | `friend void friendFunc();`                    | 类外独立定义：`void friendFunc() { ... }`      | 不适用       | 1. 声明在类内<br>2. 定义在类外全局作用域                                   |

