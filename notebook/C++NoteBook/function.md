
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