# list 双向链表类
## splice函数
```c++
//splice 是操作list元素转移的高效函数，几乎都是O(1)
//如果能作为一个整体一次性转移是最高效的，不要一个一个转移

//调用者是转移目标链表
//将 other的所有元素转移到当前链表的pos位置前
//因此如果想转移到链表末尾要用 end
void splice(const_iterator pos, list& other);

//转移单个元素
void splice(const_iterator pos, list& other, const_iterator it);

//将 other中 [first, last)范围内的元素转移到当前链表的 pos位置之前
//O(n)  C++ 标准对链表大小维护的要求
void splice(const_iterator pos, list& other, const_iterator first, const_iterator last);
```

## 迭代器
在 C++ 中，所有容器的迭代器范围都遵循 ​​左闭右开​​ 原则：  
begin()指向第一个元素，end()指向​​最后一个元素的下一个位置
```cpp
for (auto it = container.begin(); it != container.end(); ++it) {
    // 处理 *it
    //用解引用操作迭代器指向元素
}

//迭代器移动
void advance(InputIt& it, Distance n);
//对随机访问迭代器 O(1)
//对双向迭代器 O(|n|)
//支持负向移动
```

**注意不要和 front/back 混淆**
## erase 函数
```cpp
//删除单个元素
iterator erase (iterator position);
//删除[first,end)  左闭右开
iterator erase (iterator first, iterator last);

//返回值 返回迭代器，指向（最后一个）被删除元素的下一个元素
 for(auto it = arr.begin();i <= k; ) {
        if(i % 2 == 1)it = arr.erase(it);
        else it ++;
    }
```
由于erase函数会更新迭代器，因此循环条件要注意返回值要不要更新

## 常用函数

### 元素访问
| 函数 | 说明 | 时间复杂度 |
|------|------|-----------|
| `front()` | 返回第一个元素的引用 | O(1) |
| `back()` | 返回最后一个元素的引用 | O(1) |


### 修改操作
1.插入元素

| 函数 | 说明 | 时间复杂度 |
|------|------|-----------|
| `push_front(value)` | 头部插入元素 | O(1) |
| `emplace_front(args...)` | 头部直接构造元素 | O(1) |
| `push_back(value)` | 尾部插入元素 | O(1) |
| `emplace_back(args...)` | 尾部直接构造元素 | O(1) |
| `insert(pos, value)` | 指定位置插入 | O(1) |
| `emplace(pos, args...)` | 指定位置直接构造 | O(1) |

*insert:新元素会被插入到pos所指向的元素​​之前，也即作为这个位置新的元素*​​

*emplace :当自定义类有构造函数时直接传递参数，无构造函数时使用聚合初始化：dataList.emplace_back(SimpleData{1, "Alice", 99.5});*


2.删除元素

| 函数 | 说明 | 时间复杂度 |
|------|------|-----------|
| `pop_front()` | 删除头部元素 | O(1) |
| `pop_back()` | 删除尾部元素 | O(1) |
| `erase(pos)` | 删除指定位置元素 | O(1) |
| `erase(first, last)` | 删除范围元素 | O(n) |
| `clear()` | 清空所有元素 | O(n) |


3.特殊链表操作

| 函数 | 说明 | 时间复杂度 |
|------|------|-----------|
| `splice(pos, other)` | 移动整个链表 | O(1) |
| `splice(pos, other, it)` | 移动单个节点 | O(1) |
| `splice(pos, other, first, last)` | 移动节点范围 | O(n) |
| `remove(value)` | 删除所有等于值的元素 | O(n) |
| `remove_if(pred)` | 删除满足条件的元素 | O(n) |
| `unique()` | 删除连续重复元素 | O(n) |
| `merge(other)` | 合并有序链表 | O(n) |
| `sort()` | 排序链表 | O(n log n) |
| `reverse()` | 反转链表 | O(n) |

例子：
```c++
list<int> temp;
// 移除前n个元素到临时链表
auto it = arr.begin();
//使用自动类型匹配 auto声明节点，it++/--即可切换节点

for (int i = 0; i < k; ++i) {
//splice 是操作list元素转移的高效函数，几乎都是O(1)
    temp.splice(temp.end(), arr, it++);
    //it++的自增操作发生在 ​​splice函数被调用之前​​，因此 it安全指向原来 arr链表元素
    //如果 it++ 写在splice函数外，则 it 变为temp链表的迭代器！
}

// 反转临时链表
temp.reverse();
// 将反转后的元素插回原位置
arr.splice(arr.begin(), temp);
```
## 使用技巧
1.**优先使用emplace**：避免不必要的拷贝
   ```cpp
   // 优于 push_back(MyClass(1,2))
   lst.emplace_back(1, 2);
   ```

2.list类的排序用的是自己的 sort成员函数，不能和一般排序混淆
```cpp
mylist.sort(cmp());
```

