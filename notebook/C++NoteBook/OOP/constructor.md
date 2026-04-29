## 构造函数
类成员创建时调用构造函数

### 无构造函数
1.编译器添加默认构造函数，此时如果类成员变量没有默认值，则值是随机值

2.如果类满足聚合类型条件：无构造函数、无私有/受保护非静态数据成员、无基类或虚函数，则可以聚合初始化 ---> 用 `{ }`初始化

3.类成员变量有显式的默认值，则初始化为默认值

4.用空 `{ }`初始化，则赋值 0 / nullptr

```cpp
class MyClass {
public:
    int value;
    std::string name;
};

// 在堆上分配（默认初始化）
MyClass* obj1 = new MyClass; 
// value未初始化（随机值），name调用默认构造函数（空字符串）

// 在堆上分配（值初始化）
MyClass* obj2 = new MyClass(); 
MyClass* obj2 = new MyClass{}; 
// value被零初始化为0，name调用默认构造函数

// 在堆上分配（聚合初始化 - C++11起）
MyClass* obj3 = new MyClass{42, "Alice"};
// value=42, name="Alice"
```
### 含参数的构造函数
```cpp
//冒号开始初始化列表 
//逗号隔开
Myclass (int a,string s):value(a),name(s){

}

//构造函数可以有默认参数，优先使用传入值，当参数不够时使用默认值
//注意：默认参数后不能有非默认参数，也即默认参数要在右边
Myclass (int a = 0,string s = “aaa”):value(a),name(s){

}

// 头文件 widget.h
class Widget {
public:
    Widget(int w = 1280, int h = 720); // 声明处指定默认参数
};

// 源文件 widget.cpp
Widget::Widget(int w, int h) : width(w), height(h) {} 
// 定义中不能再重复默认参数
```
### 拷贝构造函数
```cpp
Myclass(const Myclass& a){
    //把新对象的成员值赋为和 a 一样
}
```
### 移动构造函数  
1.移动构造函数的参数是一个**右值引用** (`ClassName&&`)。这个参数类型就像一个信号灯，告诉编译器：“这个函数专门用来处理那些即将消亡的临时对象（右值）”。

2.当用一个**右值**（例如函数返回的临时对象、`std::move` 转换后的对象）来初始化一个新对象时，编译器会优先选择移动构造函数（如果存在），而不是拷贝构造函数。

3.在移动构造函数内部，因为你知道传入的 `other` 是一个即将消亡的临时对象（通过右值引用标识），所以你可以安全地“窃取”它的资源（如动态内存指针、文件句柄等），而不是进行深拷贝。

```cpp
class MyVector {
private:
    int* m_data;
    size_t m_size;

public:
    MyVector(MyVector&& other) noexcept // 右值引用参数
        : m_data(other.m_data), m_size(other.m_size) { 
        // 初始化列表直接接管指针和大小
        // 关键步骤：将源对象置于安全状态
        other.m_data = nullptr; // 使源对象可安全析构
        other.m_size = 0;
    }

    ~MyVector(){
        delete[] m_data;
        m_data = nullptr;
    }
}

int* data = new int[3]{1, 2, 3};  // 正确分配数组
MyVector v1{data, 3};
MyVector v2(move(v1));//栈分配
MyVector* v2 = new MyVector(move(v1));//堆分配
 ```
 ### 构造链调用
 派生类构造函数会调用基类构造函数，可以用初始化列表显式指定调用哪个构造函数，否则调用默认构造函数
 ```cpp
 Child_class(int a):base_class(a){
    //
 }
 ```
 派生类只负责调用直接基类的构造函数，保证构造链上所有类只调用了一次

 ### 特殊成员变量初始化
 const成员变量和引用成员变量必须在创建时绑定到一个值，构造函数的函数体内的赋值属于赋值而非创建，必须在初始化列表中初始化特殊成员