# 图
## 图的稀疏稠密
### 稀疏图 (Sparse Graph)
- 边数 \( E \) 远小于顶点数 \( V \) 的平方，即 \( E \ll V^2 \)
- 实际经验：通常认为 \( E \sim O(V) \) 或 \( E < V \log V \)
- 特点：大部分顶点之间没有边连接

稀疏图适合邻接表
```cpp
// 适合稀疏图
vector<vector<int>> adjList(V);  // 每个顶点维护邻居列表
// 同时使用更高效的 unordered_set 判断存在性
vector<unordered_set<int>> adjSet(V);
//邻接表 + 哈希集合 同时兼顾遍历和查找
```

### 稠密图 (Dense Graph)  
- 边数 \( E \) 接近顶点数 \( V \) 的平方，即 \( E \approx O(V^2) \)
- 实际经验：通常认为 \( E > \frac{V^2}{\log V} \) 或 \( E > \frac{V^2}{4} \)
- 特点：大部分顶点之间都有边连接


稠密图适合邻接矩阵
```cpp
// 适合稠密图
vector<vector<int>> adjMatrix(V, vector<int>(V, 0));
// 或对于无权图，可以用 bool 矩阵节省空间
vector<vector<bool>> adjMatrix(V, vector<bool>(V, false));
```

在实际编程中，通常默认使用邻接表，除非已知图非常稠密或需要频繁的邻接查询。
```cpp
//无向无权图
struct G {
    vector<vector<int>> adj;
    vector<unordered_set<int>> adjset;

    G(int n) {
        adj.resize(n + 1);
        adjset.resize(n + 1);
    }

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
        adjset[u].insert(v);
        adjset[v].insert(u);
    }

    bool findEdge(int u, int v) {
        return adjset[u].contains(v);
    }
};

//无向有权图
struct G {
    vector<vector<pii>> adj;
    vector<unordered_map<int,int>> adjset;

    G(int n) {
        adj.resize(n + 1);
        adjset.resize(n + 1);
    }

    void addEdge(int u, int v,int w) {
        adj[u].push_back({v,w});
        adj[v].push_back({u,w});
        adjset[u].insert({v,w});
        adjset[v].insert({u,w});
    }

    bool findEdge(int u, int v) {
        return adjset[u].contains(v);
    }

    int getW(int u,int v){
      return adjset[u][v];
    }
};
```


---

## 邻接矩阵
假设图 \( G \) 有 \( n \) 个顶点，用 \( n \times n \) 的邻接矩阵 \( A \) 表示：
- \( A[i][j] = 1 \) 如果存在从顶点 \( i \) 到顶点 \( j \) 的边（无权图）
- 对于有权图，\( A[i][j] \) 可以是边的权重（无边时通常用 0 或一个特殊值表示，如无穷大）。

---

### 邻接矩阵的乘积含义

#### 情况 1：无权图
设 \( A \) 是邻接矩阵，计算 \( B = A \times A \)（矩阵乘法，元素乘积累加）：
\[
B[i][j] = \sum_{k=0}^{n-1} A[i][k] \times A[k][j]
\]
- 在无权图中，\( A[i][k] \times A[k][j] \) 非零（即为 1）当且仅当存在边 \( i \to k \) 和 \( k \to j \)。
- 所以 \( B[i][j] \) 的值等于从 \( i \) 到 \( j \) **长度为 2 的路径的数量**。

类似地：
- \( A^m[i][j] \) 表示从顶点 \( i \) 到顶点 \( j \) 的长度为 \( m \) 的路径的数量。

---

#### 情况 2：有权图
如果矩阵元素存储的是边的权重（并且无边 = 0），则矩阵乘法时：
\[
(A^2)[i][j] = \sum_{k} A[i][k] \cdot A[k][j]
\]
这表示**所有两步路径的权重乘积之和**。  
但通常在图算法中，我们更关心最短路径，此时会用 **min-plus 代数**（或 max-product）下的矩阵“乘法”，而不是普通乘法：
- 用 \( \oplus \) 代替加法（取 min）
- 用 \( \otimes \) 代替乘法（取普通加法）
这样 \( A^2 \) 在 min-plus 代数下就得到最短路径长度（两步以内）。

---


#### 应用
- 判断图的连通性：如果计算 \( A + A^2 + \dots + A^{n-1} \)（布尔或算术和），非零项表示顶点间可达。
- 计算固定长度的路径数。
- 通过矩阵快速幂（用结合律）可高效计算 \( A^k \)，用于求解长度较大的路径问题。

## 邻接表
数组`adj` 的每个元素都是一个可动态维护数组， `adj[u]` 表示从点 `u` 出发的所有边及其性质
```cpp
vector<vector<int>> adj;
// 声明数组时不指定固定容量，节省空间，使用resize指定第一层容量，第二层按实际添加
adj.resize(n + 1);
for (int i = 1; i <= m; ++i) {
  int u, v;
  cin >> u >> v;
  adj[u].push_back(v);
}
```
