# 命名空间namespace
## 1. 避免命名冲突​​
当多个库或代码模块定义了相同名称的函数、类或变量时，命名空间将它们隔离在不同的作用域中，避免编译时的重定义错误。
```cpp
namespace LibraryA {
    void print() { std::cout << "LibraryA\n"; }
}

namespace LibraryB {
    void print() { std::cout << "LibraryB\n"; }
}

int main() {
    LibraryA::print(); // 输出：LibraryA
    LibraryB::print(); // 输出：LibraryB
    return 0;
}
```
## 2.简化访问方式
1.用  *命名空间：：成员* 直接访问  
2.using声明
```cpp
using LibraryA::print; // 仅引入 print
print(); // 调用 LibraryA::print

//引入整个命名空间（谨慎使用，可能导致冲突）
using namespace LibraryA;
print(); // 调用 LibraryA::print
```

**最常用**
```cpp
using namespace std;
// 不使用 using namespace std;
std::cout << "Hello";
std::vector<int> v;

// 使用 using namespace std;
cout << "Hello";
vector<int> v;

 //注意其他自定义名称不可以和std库名一致
```