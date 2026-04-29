# srting 类
```cpp
//获取子字符串
//从引索 pos 开始截取 len 个字符，没有第二个参数时截取到末尾
string substr(size_t pos = 0, size_t len = npos) const;
//成员函数使用实例调用
string substr1 = original.substr(7, 5);

//string TO integer
//stol：string to long
int stoi (const string& str, size_t* idx = 0, int base = 10);
//参数idx可为 nullptr ,参数 base 是目标进制
int num = stoi(str);

//数字变量转字符串
s += to_string(num);

//减少字符串末尾的长度
std::string str = "Hello World!";
str.resize(5);  // 现在 str = "Hello"

std::string str = "Hello World!";
str.resize(str.length() - 6);  // 删除最后6个字符
```