## 虚基类
当继承链中多个直接基类的共享一个基类时，会发生菱形继承，初始基类会有多个副本，导致语义冲突，我们使用对初始基类虚继承解决这个问题

此时 `最派生类` 要在构造函数参数列表中显式指定虚基类的构造函数，这是虚基类唯一有效实现，并且在构造链中最先调用，中间的直接基类对A的构造被忽略，因为此时A已经被构造了，中间基类使用A的值时也是使用最派生类的实现
```cpp
class A {
public:
    A(int x) : value(x) {
        cout << "A constructed with value: " << value << endl;
    }
    int value;
};

class B : virtual public A {
public:
    B() : A(100) {  // 这个调用会被D的初始化覆盖
        cout << "B constructor" << endl;
    }
};

class C : virtual public A {
public:
    C() : A(200) {  // 这个调用会被D的初始化覆盖
        cout << "C constructor" << endl;
    }
};

class D : public B, public C {
public:
    D() : A(42) {  // 只有这个A的初始化有效
        cout << "D constructor, A::value = " << value << endl;
    }
};

int main() {
    D d;
    // 输出：
    // A constructed with value: 42  (来自D的显式初始化)
    // B constructor
    // C constructor  
    // D constructor, A::value = 42
    return 0;
}
```
### 终极构造链
包含虚基类和多继承的复杂构造链中，遵循以下构造顺序：

1.虚基类优先级最高，按深度、多继承声明顺序排序
2.非虚基类按多继承声明顺序依次进行（一个基类的构造链结束后才进行另一个）
3.成员变量  
4.本身  