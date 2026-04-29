# 基本数据结构
## stack queue deque list linked_list
stack: LIFO  

queue: FIFO  

deque(Double-Ended Queue): 只操作头尾  

list: size,set,get,add,remove

linked_list: singly/doubly linked
## 封装数据类型和基本数据类型
以string类和char* 为例  
string类自己维护了一个变量表示长度 调用.length()即可在O(1)时间返回长度  
而char* 原始字符串没有这样一个内部变量，strlen()函数返回时消耗O(n)时间

## resize the array
**一般的动态数组扩容是以2为指数级扩容，均摊复杂度仅为O(1):**  
数组扩容实际上仍然是开一个新数组，而每次拷贝元素的开销是O(n)--当前元素总数  
这样的总开销为一个等比数列，结果为O(n)，也就是说我们总拷贝次数和n同数量级  
非扩容时O(1),扩容时O(n)，对于总次数n,均摊为O(1)!
## 均摊复杂度 (Amortized Complexity)​​ 和 ​​平均复杂度 (Average-case Complexity)​​ 
平均复杂度​​：考虑所有可能的输入，并计算其期望时间（依赖于概率假设）


​​均摊复杂度​​：考虑一个操作序列在最坏情况下的平均性能（不依赖概率假设）
## LinkedList 和 Stack
对于单向链表，可以把head作为栈顶，增删都ok，但不能是tail，因为pop以后tail无法返回上一个元素  
*使用链表时要考虑单向性*
## 哨兵节点 Sentinel Node/Dummy Node
在doubly linked_list中加入一个没有实际数据的哨兵sentinel  
**可以完全避免对于空指针的判定，减少branch，优化性能**
```cpp
Node* sentinel=new Node();
sentinel->next = sentinel;//head 第一个实际节点
sentinel->prev = sentinel;//tail 最后一个实际节点


// 标准双向链表插入逻辑（适用于任何位置，包括头尾）
newNode->prev = node;
newNode->next = node->next;
node->next->prev = newNode; // 这行代码永远不会出错，因为node.next不会是null（至少是哨兵）
node->next = newNode;

// 标准双向链表删除逻辑（适用于任何位置，包括头尾）
node->prev->next = node->next;
node->next->prev = node->prev;
```
## Pair
轻量级的数据结构，用于打包两个其他数据类型，有first和second两个成员变量
```cpp
pair<int,string> p(1, "hello");
cout << p.first << " " << p.second << "\n";  // 1 hello

//使用大括号表示
{first，second}
```
支持运算符重载，例如 == != >   (先比第一个，如果一样比第二个)
## vector
注意push_back总作用于末尾，也即新加一位，所以初始化是否设定长度需要考虑
```cpp
//声明 3行 x 4列 的二维vector，所有元素初始化为0
vector<mydata> arr(n,newdata);
vector<vector<int>> matrix(3, vector<int>(4));
//内存布局：不连续。因为每个内层vector是独立分配内存的

//用[first, last)范围内的元素构造
vector(InputIt first, InputIt last); 

//拷贝构造  使用已有数组名为参数 O(n)
vector(const vector& other); 

//翻转数组
//多维数组只交换指针，依然是 O(n)
reverse(result.begin(), result.end());
```
