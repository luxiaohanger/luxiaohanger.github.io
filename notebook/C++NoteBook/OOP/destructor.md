## 析构函数
类成员被销毁时，自动调用析构函数  

*但何时销毁是个需要理解的问题！*  

1.在栈空间分配的类对象，栈销毁时调用析构函数  

2.堆空间分配的类对象，程序运行期间不会被销毁，因此需要手动调用`delete`，进而调用析构函数

3.类作为其他类成员变量时遵循析构链执行  

4.类指针作为类成员变量时，销毁的是指针本身，而非其指向的类实例，需要在调用者析构函数中手动销毁  

5.`delete` 会调用析构函数，`free` 不会

### delete函数
1.必须和 `new` 函数配对使用  

2.注意指针重复（同一个对象被多个指针指向），此时不能多次 delete

3.delete操作​​不会​​改变指针变量本身的值。指针在 delete之后仍然指向原来的内存地址（那块内存现在已被释放，是无效的）。  
--> *在 delete之后，立即将指针设置为 nullptr！*  
--> 将指针置为 nullptr后，delete nullptr 是安全的,避免多次 delete 的问题

4.对于分配的数组 / STL 内存：
```cpp
//使用 delete[]当且仅当内存是通过 new[]分配的数组
//会依次调用数组中每个元素的析构函数（如果是类对象数组）
//按​​逆序​​（从最后一个元素到第一个）调用每个元素的析构函数
classT* pointer = new classT[n]; 
-->
delete[] pointer;

//对于此类STL指针数组，需要在析构函数中手动遍历管理内存
vector<classA*> arr;
-->
for(auto& p:arr){
    delete p;
    p = nullptr;
}
``` 
5.二维数组分配与释放
```cpp
const int ROWS = 3; 
const int COLUMNS = 4;
 
char **chArray2; 

// allocate the rows 
chArray2 = new char* [ ROWS ]; 

// allocate the (pointer) elements for each row 
for (int row = 0; row < ROWS; row++ ) 
	chArray2[ row ] = new char[ COLUMNS ]; 

//delete
for (int row = 0; row < ROWS; row++) 
{ 
	delete [ ] chArray2[ row ]; 
	chArray2[ row ] = NULL; 
} 

delete [ ] chArray2; 
chArray2 = NULL; 
```
## Constructor Chaining & Destructor Chaining
当一个对象被创建时，C++ 会按照一定的规则去调用构造函数，这个过程叫做 构造链。 

它遵循 ***“先父后子，先成员后自己”*** 的原则。  

1.*基类构造函数*

如果有继承关系，会先调用基类的构造函数。
如果有多个基类，按照 继承列表中的声明顺序 来构造。

2.*成员对象构造函数*

然后调用类中 成员对象（类类型成员） 的构造函数。
调用顺序是 成员变量在类中定义的顺序，而不是初始化列表的书写顺序。

3.*当前类自身的构造函数*

最后才调用派生类本身的构造函数体

**析构链与之相反**
