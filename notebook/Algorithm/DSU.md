# Disjoint Set Union 并查集
并查集是一种用于管理元素所属集合的数据结构

所有元素的数量（size）、实际值已知，分别对应下标 `0 ~ size - 1`, DSU 用于管理其集合关系

支持合并、查询操作

注意：只管理"哪些元素属于同一个集合"这一关系；运行时不能增加或删除元素

## 标准实现
```cpp
struct DSU {
    //pa: parent array 表示当前下标元素的父元素下标
    // size ：当前元素为根节点时才有效，表示集合元素数量
  std::vector<size_t> pa, size;

    //用固定数量初始化DSU
    //每个元素父节点初始化为自己
  explicit DSU(size_t size_) : pa(size_), size(size_, 1) {
    //给迭代器填充连续递增值
    std::iota(pa.begin(), pa.end(), 0);
  }

    //查询元素根节点，用于判断是否属于同一集合
    //路径压缩：让根节点做此集合所有元素父节点
  size_t find(size_t x) { return pa[x] == x ? x : pa[x] = find(pa[x]); }

    //合并当前元素所在的集合
  void unite(size_t x, size_t y) {
    x = find(x), y = find(y);
    if (x == y) return;
    //让x = 较大集合根节点，不会产生副作用
    if (size[x] < size[y]) std::swap(x, y);
    pa[y] = x;
    //只需更新根节点数量数组
    size[x] += size[y];
  }
};
```

## 细节
1.DSU 相关操作时间消耗和 size 大小有关，因此设置大小时注意不要浪费，注意利用哈希结构优化

## 理论意义
1.DSU 能够维护元素的集合关系，在图论中可以用于维护连通分量，被连接的点属于一个集合，也即一个连通分量，当两元素已经在同一连通分量中时，再连接就会形成环 --- 常用于寻找第一次成环的边