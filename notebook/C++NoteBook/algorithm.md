# Algorithm
## 二分查找
### binary_search
```cpp
// 使用默认 < 比较
bool binary_search(RandomAccessIterator first, RandomAccessIterator last,const T& value);

// 使用自定义比较器
bool binary_search(RandomAccessIterator first, RandomAccessIterator last,const T& value, Compare comp);
```
其他扩展
```cpp
//以函数都可以添加自定义cmp函数

//返回 第一个 >= value 的元素位置（迭代器）。如果所有元素都比 value 小，返回 last。
RandomAccessIterator lower_bound(RandomAccessIterator first,RandomAccessIterator last,const T& value);
//返回 第一个 > value 的元素位置（迭代器）。如果所有元素都 <= value，返回 last。
RandomAccessIterator upper_bound(RandomAccessIterator first,RandomAccessIterator last,const T& value);
//返回一对迭代器 (lower_bound, upper_bound)，表示所有等于 value 的范围。
pair<RandomAccessIterator, RandomAccessIterator>
equal_range(RandomAccessIterator first,RandomAccessIterator last,const T& value);
```



## 排序
**对于复杂度较高的算法，先进行复杂度较低的排序可能是个好选择**
```cpp
//参数为 随机访问迭代器 .begin()/.end()，不能是 list(双向迭代器)
//范围左闭右开 [first,last)
//无cmp函数，默认升序
void sort (RandomAccessIterator first, RandomAccessIterator last);
```
```cpp
//自定义 cmp 函数，一般用于对自定义数据类型排序
void sort (RandomAccessIterator first, RandomAccessIterator last, Compare comp);
//cmp(a, b) 返回 true → 表示 a 应该排在 b 前面
struct Person {
    std::string name;
    int age;
};

bool cmp(const Person &a, const Person &b) {
    return a.age < b.age; // 年龄小的排前面
}
```
**把相关数据封装在一起，用某个数据对 结构体vector 排序,可以保持卫星数据的相关性，便于比较或者反向访问**  
反向访问：由 a 成员检索 b --> 由 b 成员检索 a;

### 比较函数类
1.优先队列和排序的 `cmp` 都可以是类，但有些是类本身，有些是类实例（调用构造函数）
```cpp
struct cmp {
    bool operator()(const mydata& a, const mydata& b) const {
        return a.age < b.age;
    }
    //const 有必要加
};

//类实例
//这些算法函数通常接受一个比较函数对象（实例）作为参数，因此可以直接传入Lambda表达式（Lambda表达式实际上是一个匿名函数对象）
//把 cmp() 直接替换为 [](const auto& a,const auto& b){return a.age < b.age;}
sort(arr.begin(), arr.end(), cmp());

auto it = lower_bound(arr.begin(), arr.end(), target, cmp());

nth_element(arr.begin(), arr.begin() + 2, arr.end(), cmp());

mylist.sort(cmp());
//类本身
priority_queue<mydata,vector<mydata>, cmp> pq;

set<mydata, cmp> peopleSet;

map<Person, string, CompareAgeAsc> personMap;
```
2.优先队列的排序逻辑特殊，其他排序是默认升序，优先队列表示的是优先级（降序）