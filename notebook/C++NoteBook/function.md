
# std::function
`std::function` 是 C++11 标准引入的一个**函数包装器模板**，它定义在 `<functional>` 头文件中。它是一个**多态的函数对象包装器**，可以存储、复制和调用任何可调用对象。

### 核心特性

1.  **通用性**：它可以包装几乎任何可调用的实体，为它们提供一个统一的调用接口。
2.  **类型擦除**：它通过类型擦除技术实现，因此其类型（如 `std::function<int(int, int)>`）独立于其内部包装的具体可调用对象的类型。
3.  **值语义**：它像普通对象一样可以被拷贝、移动和赋值。

### 基本形式
它的基本声明形式如下：
```cpp
std::function<返回值类型(参数类型列表)> 对象名;
```
例如：
```cpp
std::function<int(int, int)> func; // 一个包装“返回int，接受两个int参数”的可调用对象的空包装器
```

### 可以包装什么
`std::function` 可以包装以下任何符合其签名的可调用对象：
*   **普通函数（函数指针）**
*   **函数对象（仿函数）**：重载了 `operator()` 的类
*   **Lambda 表达式**
*   **类的成员函数**（需要结合 `std::bind` 或使用 lambda 捕获对象）
*   **类的数据成员**（同样需要结合 `std::bind`）

### 主要操作
*   **构造/赋值**：用可调用对象初始化或赋值。
*   **调用**：使用 `operator()` 调用其包装的可调用对象，就像调用普通函数一样。
*   **检查是否为空**：通过 `operator bool()` 或与 `nullptr` 比较来判断其是否包装了一个有效的可调用目标。
*   **清空**：通过 `=` 赋值为 `nullptr` 或调用 `reset()` 方法。

### 一个简单的示例
```cpp
#include <iostream>
#include <functional>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

int main() {
    // 1. 包装普通函数
    std::function<int(int, int)> func = add;
    std::cout << func(2, 3) << std::endl; // 输出 5

    // 2. 重新赋值，包装另一个函数
    func = multiply;
    std::cout << func(2, 3) << std::endl; // 输出 6

    // 3. 包装 Lambda 表达式
    func = int a, int b { return a - b; };
    std::cout << func(5, 3) << std::endl; // 输出 2

    // 4. 包装函数对象
    struct Divider {
        int operator()(int a, int b) const { return a / b; }
    };
    func = Divider();
    std::cout << func(10, 2) << std::endl; // 输出 5

    // 5. 检查是否为空
    std::function<void()> empty_func;
    if (!empty_func) {
        std::cout << "func is empty!" << std::endl;
    }

    return 0;
}
```

### 与其它方式的对比和优势
*   **相比于函数指针**：`std::function` 更强大、更安全。函数指针无法直接捕获状态（如lambda的捕获列表、带状态的函数对象），而 `std::function` 可以。
*   **相比于模板**：使用模板（如 `template <typename F> void foo(F callback)`）虽然效率最高（内联、无开销），但会导致代码膨胀，且回调函数的类型必须在编译时确定。`std::function` 是运行时的多态，类型固定，更利于接口的统一（例如，作为类的成员变量或标准容器的元素类型）。

### 性能考虑
`std::function` 的实现通常使用**小对象优化**：
*   如果包装的可调用对象很小（例如一个无捕获的lambda或函数指针），它会将其直接存储在 `std::function` 对象内部的缓冲区中，避免堆内存分配。
*   如果对象较大（例如捕获了很多变量的大lambda），则会在堆上分配内存来存储它。
因此，它的调用开销通常略高于直接调用（多一次间接调用），但对于大多数应用场景来说，这个开销是可以接受的。

### 典型应用场景
1.  **回调函数**：在事件驱动、异步编程或GUI库中，用于注册用户定义的回调。
2.  **策略模式**：将算法或策略作为参数传递给函数或对象。
3.  **延迟计算**：将计算过程包装起来，在需要时才执行。
4.  **标准库算法**：虽然很多算法直接接受可调用对象，但当你需要存储或传递这些“调用策略”时，`std::function` 就很有用。

### 注意事项
*   调用一个空的 `std::function` 会抛出 `std::bad_function_call` 异常，因此调用前最好检查。
*   与所有基于虚函数或动态多态的技术一样，它比直接调用或静态多态（模板）有额外的运行时开销。在对性能极其敏感的代码段中需谨慎使用。

**总结来说，`std::function` 是 C++ 中实现“函数作为一等公民”和“类型安全的回调”的关键工具，它极大地增强了代码的灵活性和表现力。**


------

## C++ 回调函数深度解析：从函数指针到 `std::function`

在 C++ 中，**回调函数（Callback Function）** 是一种通过函数指针或对象调用的机制。简单来说，你将函数 A 的“引用”传递给函数 B，当特定的事件发生时，函数 B 就会调用函数 A。


### 1. 传统回调：函数指针

在 C 语言和早期 C++ 中，回调主要依靠函数指针实现。

* **定义与语法**：`return_type (*pointer_name)(parameter_types)`
* **局限性**：
* 语法晦涩，难以阅读。
* **无法捕获状态**：它只能指向全局或静态函数，无法直接绑定类的非静态成员函数（因为缺少 `this` 指针）。



### 2. 现代核心：`std::function`

`std::function` 是 C++11 引入的一个通用的、多态的**函数封装器**。

#### **基本细节**

* **头文件**：`#include <functional>`
* **语法**：`std::function<返回值类型(参数类型列表)>`
* **作用**：它可以存储、复制和调用任何可调用对象（Callable Target），包括普通函数、Lambda 表达式、函数对象（Functors）以及绑定后的成员函数。

#### **原理与抽象目的**

* **类型擦除（Type Erasure）**：这是 `std::function` 的核心原理。它隐藏了可调用对象的具体类型，只保留了签名（输入输出）。
* **目的**：解耦。调用者不需要知道目标是一个函数指针还是一个复杂的 Lambda，只需要知道它符合特定的签名即可。


### 3. 灵活绑定：`std::bind`

`std::bind` 是一个函数适配器，它接受一个可调用对象，并生成一个新的可调用对象来“适应”原对象的参数列表。

#### **参数含义**

* **第一个参数**：目标函数名或函数指针。
* **后续参数**：传递给目标的参数。
* **占位符 (`std::placeholders::_1, _2...)**`：表示新生成的函数对象在调用时，对应的参数应该放在原函数的什么位置。

#### **核心逻辑：绑定成员函数**

这是 `bind` 最常用的场景。要调用类的非静态成员函数，必须指定该函数属于哪个实例。

```cpp
class Printer {
public:
    void printSum(int a, int b) { std::cout << a + b; }
};

Printer myPrinter;
// 绑定成员函数，必须取地址 &Printer::printSum，并传入实例地址 &myPrinter
auto boundFunc = std::bind(&Printer::printSum, &myPrinter, std::placeholders::_1, 100);

boundFunc(5); // 等同于 myPrinter.printSum(5, 100); 输出 105

```

### 4. `std::function` 与 `std::bind` 的协作

#### **使用场景对照表**

| 特性 | `std::bind` | Lambda 表达式 (推荐) |
| --- | --- | --- |
| **可读性** | 较差，占位符容易混乱 | 极佳，直观 |
| **性能** | 略有开销（包装层） | 编译器优化更好 |
| **成员函数** | 擅长绑定已有实例 | 需要显式捕获 `this` |
| **参数重排** | 灵活（通过 `_1`, `_2` 重排） | 需要手动编写逻辑 |


### 5. 常用逻辑与最佳实践

#### **A. 异步通知（观察者模式）**

在 GUI 开发或网络库（如 Boost.Asio）中，当数据到达时，通过回调通知业务逻辑。

```cpp
struct HttpDownloader {
    std::function<void(int)> onProgress; // 回调接口

    void download() {
        for(int i=0; i<=100; i+=10) {
            if(onProgress) onProgress(i); // 执行回调
        }
    }
};

```

#### **B. 抽象参数类型**

* **参数类型**：通常建议将 `std::function` 作为参数传递时使用**值传递**或 **`const` 引用**。
* **检查有效性**：在调用前，可以使用 `if (func)` 检查 `std::function` 是否包装了目标，防止空指针异常。

#### **C. 现代搭配建议**

虽然 `std::bind` 依然有效，但在现代 C++（C++14/17/20）中，**Lambda 表达式** 几乎可以替代 `std::bind` 的所有功能，且性能和可读性更优：

```cpp
// 使用 Lambda 替代 bind
auto callback = [&myPrinter](int val) { myPrinter.printSum(val, 100); };

```

