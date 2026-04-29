# set
直接使用set 不仅占用空间比数组大，而且速度要比数组慢，set把数值映射到key上都要做hash计算的。

不要小瞧这个耗时，在数据量大的情况，差距是很明显的。

## 1. `set`

* 头文件：`#include <set>`
* 底层实现：通常是 **红黑树（平衡二叉搜索树）**
* 特点：

  * **有序**：元素会按照 `<` 运算符自动排序（默认升序），可以自定义比较器。
  * **唯一性**：不会存储重复元素。
  * **查找 / 插入 / 删除复杂度**：O(log n)。
  * **迭代器遍历**：得到的是升序序列（有序）。
   * **迭代器返回值**：解引用运算符  `*` 。






## 2. `unordered_set` (类似 HashSet)

* 头文件：`#include <unordered_set>`
* 底层实现：**哈希表**
* 特点：

  * **无序**：元素存储没有固定顺序。
  * **唯一性**：同样不会存储重复元素。
  * **查找 / 插入 / 删除复杂度**：平均 O(1)，最坏 O(n)。
  * **迭代器遍历**：顺序不可预测。


## 3. `multi_set`
相比于 `set` ，他允许元素重复



## 函数
### 常用成员类型（typedef / using）

* `set<T>::iterator` / `unordered_set<T>::iterator`
  → 普通迭代器
* `set<T>::const_iterator`
  → 常量迭代器，只能读
* `set<T>::size_type`
  → 用于表示元素个数的类型（通常是 `size_t`）

---

### 构造函数

```cpp
set<int> s;                         // 空集合
set<int> s2 = {1, 2, 3};            // 列表初始化
unordered_set<int> us(100);         // 预留桶大小的哈希集合
```

---

###  容量相关

* `size()` → 元素个数
* `empty()` → 是否为空
* `max_size()` → 最大可容纳的元素数

---

###  修改操作

* `insert(val)` → 插入元素，返回 pair<iterator, bool>
* `erase(val)` → 按值删除
* `erase(it)` → 按迭代器删除
* `erase(first, last)` → 范围删除
* `clear()` → 清空集合
* `swap(other)` → 交换两个集合

---

###  查找与访问
**利用 unorderedset 的访问 `O(1)`**

* `find(val)` → 返回指向该元素的迭代器，找不到返回 `end()`
* `count(val)` → 返回某元素出现次数（`set` / `unordered_set` 中要么 0 要么 1）
* `contains(val)`（C++20 起）→ 是否包含该元素

---

### 迭代器

* `begin()` / `end()` → 正向迭代器
* `cbegin()` / `cend()` → 常量迭代器
* `rbegin()` / `rend()`（仅 `set` 有序容器有）→ 反向迭代器
* `next(it)` 返回下一个迭代器

---

###  `set` 专有的有序操作

* `lower_bound(val)` → 返回第一个 **不小于 val** 的迭代器

//可以理解为找一个位置给 val ，因此是第一个不小于的
* `upper_bound(val)` → 返回第一个 **大于 val** 的迭代器
* `equal_range(val)` → 返回一对迭代器，表示等于 val 的范围（在 `set` 中要么一个元素，要么空）

没有找到则返回end

---

### `unordered_set` 专有操作

* `bucket_count()` → 当前桶的数量
* `bucket_size(n)` → 第 n 个桶里有多少元素
* `bucket(val)` → 指定元素所在的桶编号
* `load_factor()` → 平均每个桶的元素数
* `rehash(n)` → 设置桶数量（大于等于 n）
* `reserve(n)` → 预留至少能存放 n 个元素的桶

---
## others
1. `contains` 的性能可能比 `find(x) != set.end()` 慢一点

2.不是所有数据都能放入哈希结构，必须是基本数据类型，不能是自定义的  
但如果是非哈希结构，例如一般的 set,可以支持容器，数组等





