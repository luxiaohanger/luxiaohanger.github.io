### 核心作用

Lambda 表达式的本质是**创建一个匿名函数对象**。它的主要作用是**就地定义和使用一个轻量级的、临时的函数逻辑**，而无需在外部显式定义一个命名函数或函数对象类。

这带来了以下主要好处：
1.  **简洁性**： 无需编写单独的函数或仿函数类，代码逻辑更紧凑。
2.  **可读性**： 逻辑在使用它的地方直接定义，上下文更清晰。
3.  **闭包**： 能够“捕获”其所在作用域的变量，形成闭包，使得函数可以“记住”并操作外部环境。

---

### 语法结构

Lambda 表达式的基本语法如下：

```cpp
[捕获列表] (参数列表) -> 返回类型 {
    // 函数体
}
```

让我们分解每个部分：

#### 1. 捕获列表 `[capture]`
这部分定义了**如何从外围作用域“捕获”变量**，使其在 Lambda 函数体内可用。这是 Lambda 能形成“闭包”的关键。

*   **`[]` 空捕获**： 不捕获任何外部变量。Lambda 只能使用其参数和局部变量。
*   **`[=]` 值捕获**： 以**值**的方式捕获所有外部变量（在 Lambda 定义时复制一份）。捕获的变量在 Lambda 体内是**只读的**（除非使用 `mutable`，见后文）。
*   **`[&]` 引用捕获**： 以**引用**的方式捕获所有外部变量。在 Lambda 体内修改这些变量会影响外部原始变量。
*   **`[var]` 捕获特定变量**： 仅以**值**的方式捕获变量 `var`。
*   **`[&var]` 引用捕获特定变量**： 仅以**引用**的方式捕获变量 `var`。
*   **混合捕获**：
    *   `[=, &x]`： 默认以值捕获所有变量，但变量 `x` 以引用捕获。
    *   `[&, y]`： 默认以引用捕获所有变量，但变量 `y` 以值捕获。
*   **`[this]`**： 捕获当前类对象（`this` 指针），使得可以在 Lambda 内访问类的成员变量和函数。

#### 2. 参数列表 `(parameters)`
与普通函数的参数列表完全相同。可以为空 `()`。
*   **`auto` 参数（C++14起）**： 可以使用 `auto` 来定义泛型 Lambda，使其成为模板函数。
    ```cpp
    auto add = auto a, auto b { return a + b; };
    std::cout << add(1, 2) << std::endl; // 3
    std::cout << add(1.1, 2.2) << std::endl; // 3.3
    ```

#### 3. 返回类型 `-> return-type`
尾置返回类型声明，可以省略。当编译器可以从函数体的 `return` 语句推断出类型时，可以省略 `-> return-type`。如果函数体包含多条 `return` 语句且类型不一致，或者没有返回语句（返回 `void`），则通常需要显式指定。

#### 4. 函数体 `{ body }`
包含 Lambda 要执行的代码。


```cpp
int k,m,n; //环境变量
...[](int x)->int { return x*x; }...//不能使用k、m、n
...[&](int x)->int { k++; m++; n++; return x+k+m+n; }...//k、m、n可以被修改
...[=](int x)->int { return x+k+m+n; }...//k、m、n不能被修改
...[&,n](int x)->int { k++; m++; return x+k+m+n; }...//n不能被修改
...[=,&n](int x)->int { n++; return x+k+m+n; }... //n可以被修改
...[&k,m](int x)->int { k++; return x+k+m; }...//只能使用k和m，k可以被修改
...[=]{ return k+m+n; }... //没有参数，返回值类型为int 
```
#### 5. 特殊说明符 `mutable`、`constexpr`、`noexcept`
这些位于参数列表和返回类型之间（如果存在）。
*   **`mutable`**： 当 Lambda 以值方式（`[=]` 或 `[var]`）捕获变量时，默认其函数调用运算符是 `const` 的，捕获的值不可修改。添加 `mutable` 关键字后，可以修改这些值捕获的变量副本（注意，这不会影响外部原始变量）。
    ```cpp
    int x = 0;
    auto f =  mutable { x = 42; }; // 修改的是内部的副本
    f();
    std::cout << x << std::endl; // 输出 0， 外部 x 未改变
    ```
*   **`constexpr`（C++17起）**： 表明该 Lambda 可以在编译时求值。
*   **`noexcept`**： 表明该 Lambda 不会抛出异常。

---

### 核心特性与使用

1.  **它是一个对象**： Lambda 表达式会生成一个**编译器生成的、具有唯一类型的匿名类对象**。这个类重载了 `operator()`。
2.  **与 `std::function` 配合**： 由于其类型唯一且匿名，我们通常用 `auto` 来存储它，或者用 `std::function` 来包装它，以便传递和存储。
    ```cpp
    auto lambda1 = []{ return 1; }; // auto 推导
    std::function<int()> func = lambda1; // 用 std::function 包装
    ```
3.  **立即调用**： Lambda 可以像普通函数一样被调用，也可以被立即调用。
    ```cpp
    int result = int a, int b { return a + b; }(5, 3); // 结果是 8
    ```

---

### 经典应用场景

#### 1. 与 STL 算法配合（最常见）
这是 Lambda 的“主战场”，用于提供自定义的比较、操作或谓词。

```cpp
#include <algorithm>
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v = {4, 1, 3, 5, 2};

    // 场景1： 排序（传递比较逻辑）
    std::sort(v.begin(), v.end(), int a, int b { return a > b; }); // 降序排列
    // v 现在是 {5, 4, 3, 2, 1}

    // 场景2： 查找（传递条件谓词）
    auto it = std::find_if(v.begin(), v.end(), int x { return x % 2 == 0; });
    if (it != v.end()) {
        std::cout << "第一个偶数是: " << *it << std::endl;
    }

    // 场景3： 遍历并操作（捕获外部变量）
    int threshold = 3;
    int count = 0;
    std::for_each(v.begin(), v.end(), int x {
        if (x > threshold) {
            ++count; // 引用捕获，修改外部 count
        }
    });
    std::cout << "大于 " << threshold << " 的数有 " << count << " 个" << std::endl;
    return 0;
}
```

#### 2. 异步编程与回调
在线程、异步任务中封装要执行的代码块。

```cpp
#include <future>
#include <iostream>
#include <thread>

std::future<int> async_task() {
    int input_data = 10;
    // 启动一个异步任务，Lambda 捕获 input_data
    return std::async(std::launch::async,  {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        return input_data * 2;
    });
}
```

#### 3. 替代小型函数对象
在以前需要定义一个单独的结构体或类并重载 `operator()` 的地方，现在可以用 Lambda 轻松替代，代码更集中。

### 总结

| 特性 | 描述 |
| :--- | :--- |
| **本质** | 一个可调用的、编译器生成的匿名类对象（闭包）。 |
| **核心优势** | **就地定义**，**简洁**，可**捕获上下文**变量。 |
| **核心语法** | `参数 -> 返回类型 { 函数体 }` |
| **关键部分** | **捕获列表** (`=`, `&`, `[var]`, `[&var]`, `[this]`) 决定了如何访问外部变量。 |
| **主要用途** | 1. **STL算法的谓词/比较器/操作** <br> 2. **异步回调函数** <br> 3. **替代简单的函数对象** |

简单来说，**Lambda 让你在需要一个小函数的地方，可以直接写它的逻辑，而不用给它起名或单独定义它**，极大地提升了 C++ 函数式编程的便利性和代码的表达力。