# map
常用于捆绑数据的访问优化，例如从值返回数组下标
## 容器概览

| 容器                          | 特点    | 底层结构 | 键唯一性 | 有序性        | 平均时间复杂度                        |
| --------------------------- | ----- | ---- | ---- | ---------- | ------------------------------ |
| `map<Key,T>`                | 关联容器  | 红黑树  | 唯一键  | 升序排序（可自定义） | 查找/插入/删除 O(log n)              |
| `multimap<Key,T>`           | 允许重复键 | 红黑树  | 可重复  | 升序排序（可自定义） | 查找 O(log n + k)，插入/删除 O(log n) |
| `unordered_map<Key,T>`      | 哈希表   | 哈希表  | 唯一键  | 无序         | 平均 O(1)，最坏 O(n)                |
| `unordered_multimap<Key,T>` | 哈希表   | 哈希表  | 可重复  | 无序         | 平均 O(1)，最坏 O(n)                |

---



## 构造函数

```cpp
map<int, string> m1;                         // 默认构造
map<int, string> m2{{1,"a"},{2,"b"}};       // 初始化列表
map<int, string> m3(m2);                     // 拷贝构造
map<int, string> m4(m2.begin(), m2.end());   // 迭代器区间构造
```

---

## 常用操作函数

### 插入

```cpp
m.insert({3,"c"});                  // 返回 pair<iterator,bool>
m[4] = "d";                         // operator[] 插入或修改
//无需判断 key 是否存在，m[4]调用时如果不存在则初始化一个并插入
m.emplace(5, "e");                   // 原地构造
```

### 访问
注意 multimap 不支持下标访问

```cpp
m.at(3);                             // 返回值，key 不存在抛异常
m[3];                                // 返回值引用，key 不存在插入默认值
```

### 查找

```cpp
m.find(3);                           // 返回迭代器，找不到返回 end()
m.count(3);                          // 返回键出现次数（map 为0或1，multimap >=0）
m.lower_bound(3);                    // >= key 的第一个迭代器
m.upper_bound(3);                    // > key 的第一个迭代器
m.equal_range(3);                    // pair<lower_bound, upper_bound>
```

### 删除

```cpp
m.erase(3);                          // 按 key 删除
m.erase(it);                         // 按迭代器删除
m.erase(m.begin(), m.end());         // 按区间删除
```

### 大小和状态

```cpp
m.empty();                            // 是否为空
m.size();                             // 元素个数
m.clear();                            // 清空
```
### 遍历和正确删除
```cpp
for (auto it = umap.begin(); it != umap.end(); /* 不在这里递增 */) {
    if (should_delete(it->first)) {
        // erase返回下一个有效迭代器
        it = umap.erase(it);
    } else {
        ++it; // 只有不删除时才递增
    }
}
// 使用迭代器遍历键为1的所有元素
//当 equal_range返回的两个迭代器相等时，表示没有找到匹配的元素
    auto range = multiMap.equal_range(1);
    for (auto it = range.first; it != range.second; ++it) {
        
    }
```
**注意，插入操作会导致重新哈希，从而导致迭代器失效**


---


## 注意事项

1. `map`、`multimap` 默认按 **key 升序** 排序，可用自定义比较函数或 `greater<>`
2. `unordered_map` 内部是 **哈希表**，需要 key 可哈希
3. `map` 的 key 是 **const 类型**，不能修改
4. `multimap` / `unordered_multimap` 允许重复 key
5. `operator[]` 只能用于 `map` / `unordered_map`，不能用于 multimap

---

## 总结使用场景

| 场景                   | 选择容器                 |
| -------------------- | -------------------- |
| 唯一键，需要按 key 排序       | `map`                |
| 唯一键，不关心顺序，需要快查找      | `unordered_map`      |
| 允许重复 key，需要按 key 排序  | `multimap`           |
| 允许重复 key，不关心顺序，需要快查找 | `unordered_multimap` |

## 利用map对捆绑数据hash
可以自定义结构体以实现数据捆绑，用成员变量（必须是已有的数据类型）作为 `key`,用结构体作为 `value`

而 `set` 只能对单一对象hash，不支持自定义数据，这是 `map`的优点  
**区别就在于：是仅查询还是查询并返回相关信息**
## hash 结构
桶计数法是哈希结构的一个特例或一种极端简化的实现，数组本身就是一种hash结构--从 `key` 到 `value` 的映射  
桶计数法就是让 `hash_function` 为恒等函数 `f(x) = x`

