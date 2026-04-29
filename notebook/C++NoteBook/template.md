# 模板
C++ 模板是一种支持泛型编程的机制，允许编写与具体类型无关的代码。

模板分为函数模板和类模板两种，通过参数化类型来实现代码复用。模板参数可以是类型参数、非类型参数或模板参数。

```cpp
template <template-parameter-list>
declaration
```

template是模板声明的关键字

后面是模板参数列表，用尖括号 <>包裹

declaration 是函数、类或其他实体的声明

## 模板参数
模板参数是“可变部分的声明”，模板参数的核心目的是实现泛型


1.类型参数
```cpp
// 使用 typename
template <typename T>
class Container { /*...*/ };

// 使用 class（两者等价）
template <class T>
class Container { /*...*/ };

// 多个类型参数
template <typename T, typename U>
class Pair { /*...*/ };
```

2.非类型参数

3.模板模板参数
```cpp
// 模板作为参数
template <template <typename> class Container, typename T>
class Adapter {
    Container<T> data;
};
```

## 函数模板
1.基本函数模板
```cpp
template <typename T>
T add(T a, T b) {
    return a + b;
}
```

2.多参数函数模板
```cpp
template <typename T, typename U>
auto multiply(T a, U b) -> decltype(a * b) {
    return a * b;
}
//-> decltype(a * b)：尾返回类型语法
//函数返回类型通过 decltype(a * b) 确定
```

3.带有一般参数的函数模板
必须列在类型参数之后，调用时需显式模板实参指定
```cpp
template <class T, int size>
void f(T a){...}

f<int,10>(1);   //显式模板实参指定
```

### 万能引用、完美转发
当左右值参数需要中转函数转发时，左右值信息编码在 `T` 中，而不是 `arg` 中
```cpp
void process(const std::string& s) {
    std::cout << "处理左值：由于copy，比较慢" << std::endl;
}
void process(std::string&& s) {
    std::cout << "处理右值：直接Move，非常快" << std::endl;
}

template <typename T>
void perfectTransfer(T&& arg) {
    //如果直接用 T arg,则一直是值传递
    //T被推导为值的类型，原始参数的左右值信息完全丢失
    //在函数内部，arg 总是左值表达式，此时 process 一直是左值调用
    //万能引用T&& ：记住参数的原始值类别
    //此时发生引用折叠，T 被推导为参数的实际类型
    //std::forward<T>(arg)：传递实际类型
    process(std::forward<T>(arg));
}

int main() {
    std::string s = "hello";
    perfectTransfer(s);                    // 调用1：传递左值
    perfectTransfer(std::string("world"));  // 调用2：传递右值
}
```

`引用折叠`：引用折叠是C++中处理“引用的引用”的规则。在C++中，不能直接声明引用的引用，但在模板推导、类型别名等场景中，编译器可能会间接产生引用的引用。为了解决这个问题，C++标准规定了引用折叠规则。
```
T&  &   -> T&    // 左值引用的左值引用 → 左值引用
T&  &&  -> T&    // 左值引用的右值引用 → 左值引用
T&& &   -> T&    // 右值引用的左值引用 → 左值引用
T&& &&  -> T&&   // 右值引用的右值引用 → 右值引用
```

## 类模板

模板的声明定义都放在头文件中

1.基本类模板
```cpp
// Vector.h 
template <typename T>
class Vector {
    T* data;
    size_t size;
    size_t capacity;
    
public:
    Vector(size_t n);                    // 声明
    ~Vector();                           // 声明
    void push_back(const T& value);      // 声明
    T& operator[](size_t index);         // 声明
};

// 构造函数定义
template <typename T>                 //再次指明模板
Vector<T>::Vector(size_t n)           //解析时带上类型 Vector<T>::
    : size(0), capacity(n) {           
    data = new T[capacity];
}

// 析构函数定义
template <typename T>
Vector<T>::~Vector() {
    delete[] data;
}

// 普通成员函数定义
template <typename T>
void Vector<T>::push_back(const T& value) {
    if (size >= capacity) {
        // 重新分配内存的逻辑...
    }
    data[size++] = value;
}

// 运算符重载定义
template <typename T>
T& Vector<T>::operator[](size_t index) {
    return data[index];
}
```

2.含普通参数的类模板
和函数模板一样，需要显示指定普通参数
## 全特化
又称显式具体化​ 是模板的一个特殊版本，它为模板的某个特定类型提供了独立的、完全定制的实现。当编译器遇到这个特定类型时，将不再使用通用模板，而是使用这个具体化版本。

在模板声明前使用 template <>，并在函数名后通过尖括号 <...>指定要具体化的类型。

`使用函数重载单独处理更好`
```cpp
// 通用模板
template <typename T>
bool isEqual(T a, T b) { ... }

// 针对 const char* 类型的显式具体化
template <> 
bool isEqual<const char*>(const char* a, const char* b){
    return std::strcmp(a, b) == 0; // 比较字符串内容
}
```

`std::vector<bool>` 就是模板全特化的例子

## 模板调用
含普通参数时，必须显示指定
### 函数模板调用
1.隐式实例化（类型推导）

2.显式指定模板参数类型

```cpp
auto result2 = add(3.14, 2.5); 
auto result1 = multiply<double>(x, y);
```
### 类模板调用
类模板必须显式指定模板参数（和调用STL库一致）
```cpp
Box<int> intBox(42);
```