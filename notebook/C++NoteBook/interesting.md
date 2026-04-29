# 那些有趣的问题（杂碎的问题）
## for_each 循环
```cpp
for(int x : check[0]) x = 1;//无法改变值，x是拷贝值
for (int &x : check[0]) x = 1;//正确写法
```
## 迭代器初始化
Cpp 容器允许使用迭代器进行初始化，只要元素类型兼容，可以跨容器初始化
```cpp
Container2 new_container(old_container.begin(), old_container.end());
```
## 解引用顺序
```cpp
(*ref_cnt)--;//先解引用
 *ref_cnt--;//先递减指针
```
## 数组声明
```cpp
vector<node> tree(n + 1);
```
结构体 `node` 如果没有显式指明成员变量初始值或者构造函数，则成员变量的值是随机的

### C++ 初始化
在C++中，变量初始化为0的情况取决于其**存储类别**和**初始化方式**。以下是详细的规则：

#### 一、自动初始化为0的情况
1. **静态存储期变量（零初始化）**
   - 全局变量（文件作用域）
   - `static`修饰的局部变量
   - `static`修饰的类成员变量
   ```cpp
   int globalVar;         // 自动初始化为0
   void func() {
       static int localStatic; // 首次调用时初始化为0
   }
   ```

2. **线程局部存储变量**
   ```cpp
   thread_local int tlsVar; // 每个线程初始化为0
   ```

3. **值初始化（Value Initialization）**
   - 使用空括号`()`或花括号`{}`初始化：
   ```cpp
   int* p = new int();    // 初始化为0
   int arr[5] = {};       // 所有元素初始化为0
   std::vector<int> v(5); // 5个0（调用int()）
   ```

4. **类/结构体的默认成员初始化**
   ```cpp
   struct S {
       int a = 0;         // 显式默认值
       int b{};           // 值初始化→0
   };
   ```

#### 二、不会自动初始化为0的情况
1. **局部变量（自动存储期）**
   ```cpp
   void func() {
       int x;             // 未初始化（随机值）
       int y[3];          // 未初始化
   }
   ```

2. **动态分配（不带初始化器）**
   ```cpp
   int* p = new int;      // 未初始化
   int* arr = new int[5]; // 未初始化
   ```

3. **类/结构体成员（无默认值）**
   ```cpp
   struct S {
       int a;             // 取决于对象创建方式
   };
   S localS;              // a未初始化（局部对象）
   ```

#### 三、特殊场景
1. **数组部分初始化**
   ```cpp
   int arr[5] = {1, 2};   // [1, 2, 0, 0, 0]
   ```

2. **聚合初始化**
   ```cpp
   struct Point { int x, y; };
   Point p = {};          // x=0, y=0
   ```

3. **标准容器**
   ```cpp
   std::vector<int> v(5); // 5个0（值初始化）
   std::array<int, 3> a;  // 未初始化（与内置数组相同）
   ```
## 三目运算符
`bool ? expression1 : expression2;`

1.可以单独出现

2.expression 必须是表达式，有返回值，不能是一般语句
（赋值语句的返回值是左边被赋予的新值）

3.注意运算符优先级
```cpp
dp[i][0].first = dp[i - 1][0].first + grid[i][0] == 'X' ? 1 : 0;
// + 的优先级比三目运算符高，因此要写成
dp[i][0].first = dp[i - 1][0].first + （grid[i][0] == 'X' ? 1 : 0）;
```



## 指针的类型
C++ 的声明语法中，*是修饰符，它作用于单个变量名，而非整个类型声明
```cpp
int* p1,p2;
//p1是 int* 
//p2是 int

int *p1, *p2;//都是指针
```
