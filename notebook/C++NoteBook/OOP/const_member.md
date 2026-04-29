##  `const` 成员函数

它允许你声明一个成员函数不会修改对象的状态。通过在成员函数声明末尾添加 `const` 关键字来定义。

### 核心特性

1.**不可修改对象状态**：
   - `const` 成员函数不能修改类的任何非静态成员变量（除非成员被声明为 `mutable`）
   - 不能调用非 `const` 成员函数（因为这些函数可能修改对象状态）

2.**常量对象支持**：
   - `const` 对象（通过 `const` 引用或指针访问的对象）只能调用 `const` 成员函数
   - 非 `const` 对象可以调用 `const` 和非 `const` 成员函数

```cpp
class MyClass {
public:
    // 非 const 成员函数
    void nonConstFunc() {
        // 可以修改成员变量
    }
    
    // const 成员函数
    void constFunc() const {
        // 不能修改成员变量
    }
};
```

### `mutable` 成员

`mutable` 是 C++ 中一个特殊的存储类说明符，用于修饰类的数据成员。它的核心作用是：​​允许在 const 成员函数中修改被声明为 mutable 的成员变量​​。

不能用于静态数据成员​​,不能用于 const 成员​

```cpp
class Logger {
    mutable int logCount; // mutable 成员可以在 const 函数中修改
    std::string message;
public:
    void log() const {
        logCount++; // 允许修改 mutable 成员
        // message = "new"; // 错误！不能修改非 mutable 成员
    }
};
```

### 函数重载
```cpp
class Display {
public:
    // 非 const 版本
    void show() {
        std::cout << "Non-const show\n";
    }
    
    // const 版本（重载）
    void show() const {
        std::cout << "Const show\n";
    }
};

int main() {
    Display d1;
    const Display d2; //const 对象
    
    d1.show(); // 调用非 const 版本
    d2.show(); // 调用 const 版本
}
```

### 返回类型
```cpp
class Data {
    std::vector<int> values;
public:
    // 返回 const 引用，防止外部修改
    const std::vector<int>& getValues() const {
        return values;
    }
};
```

1.**构造函数和析构函数**不能是 `const` 成员函数  
2.**静态成员函数**不能是 `const`（因为它们不操作特定对象实例）  
3.**成员指针**在 `const` 函数中表现为 `T* const`（指针常量），而不是 `const T*`


### 更多const
```cpp
const void func(const A* const this) const {

}
```

#### 1. 第一个`const`（在返回类型前）
```cpp
const void
```
- **含义**：修饰函数的返回类型为`const void`
- **作用**：在C++中，`const void`作为返回类型实际上**没有实际意义**，因为`void`表示没有返回值，加上`const`并不会改变什么


#### 2. 第二个`const`（在参数`A*`前）
```cpp
const A*
```
- **含义**：指针指向的内容是常量
- **作用**：通过这个指针**不能修改**所指向的`A`对象的数据成员
- **示例理解**：
```cpp
const A* ptr;  // ptr指向的A对象是const
ptr->member = 10;  // 错误：不能通过ptr修改A对象
```

#### 3. 第三个`const`（在`this`前）
```cpp
* const this
```
- **含义**：指针本身是常量
- **作用**：`this`指针本身的值（即它指向的地址）**不能改变**
- **示例理解**：
```cpp
A* const ptr;  // ptr本身是const
ptr = otherPtr;  // 错误：不能改变ptr指向的地址
```

#### 4. 第四个`const`（在函数末尾）
```cpp
) const
```
- **含义**：成员函数是常量成员函数
- **作用**：
  1. 这个函数**不能修改**类的任何非`mutable`数据成员
  2. 只能调用其他`const`成员函数
  3. 在函数内部，`this`指针的类型变为`const A* const`

#### 综合理解

这个函数声明实际上在展示C++成员函数的隐式`this`参数。在C++中，每个非静态成员函数都有一个隐式的`this`指针参数。对于：

```cpp
class A {
    void show() const;  // 正常的const成员函数声明
};
```

实际上编译器会理解为：
```cpp
void show(const A* const this);  // 等价形式
```

