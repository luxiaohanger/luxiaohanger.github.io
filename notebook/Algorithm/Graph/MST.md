## 最小生成树 MST
生成树（Spanning Tree）：一个连通无向图的生成树是包含图中所有顶点的连通无环子图

最小生成树：所有生成树中，边权重总和最小的那棵生成树



### Kruskal算法（边扩展法）

1. **排序所有边**：将图中所有边按权重从小到大排序
2. **初始化并查集**：每个顶点自成一个连通分量
3. **贪心选择**：按权重从小到大遍历每条边
   - 如果边的两个端点不在同一连通分量（不会形成环）
   - 则将这条边加入生成树，并合并两个连通分量
4. **终止条件**：当生成树有 n-1 条边时停止（n为顶点数）

`复杂度 : O( 边log(边) )`

### Prim算法（点扩展法）


1. **初始化**：任选一个顶点加入生成树，其余顶点标记为未访问
2. **维护优先队列**：存储所有连接"已选集"和"未选集"的边（按权重排序）
3. **贪心选择**：每次从队列中取出最小权重的边
   - 如果该边连接的顶点未被访问，将其加入生成树
   - 更新优先队列，加入新顶点的所有出边
4. **重复**直到所有顶点都被访问

`复杂度 : O( 点^2 )`

```cpp
vector<int> Prim() {
    vector<int> ans;
    priority_queue<edge,vector<edge>,cmp> pq;//以边权为比较

    //将0作为起始节点
    vis[0] = true;
    int visisted = 1; //记录已访问数量，用于终止
    for (const auto& e : adj[0]) {
        pq.push(e);
    }

    while (!pq.empty()) {
         //如果不保证有MST要加退出判断
        if (visisted == n)break;
        auto e = pq.top();
        pq.pop();
        int cnt = 0;
        if (vis[e.u])cnt++;
        if (vis[e.v])cnt++;
        if (cnt == 1) {
         //符合连接已访问和未访问节点的边
            ans.push_back(e.idx);
            int id = vis[e.u] ? e.v : e.u;
            vis[id] = true;
            visisted++;
            for (const auto& x : adj[id]) {
                pq.push(x);
            }
        }
    }

    return ans;
}
```



### 选择建议
- **边数E << 顶点数V²**：用Kruskal（排序边成本低）
- **边数E ≈ 顶点数V²**：用Prim（避免排序所有边）
- **需要特定起点**：用Prim
- **图边动态变化**：Kruskal更容易处理

### 难点
实际情景中边的条数可能非常多，此时要筛选合理的侯选边，降低复杂度


