## Single-Source Shortest Path (SSSP)
对于无权图，使用BFS即可，访问节点 `v` 时记录距离为 `dist[u] + 1` 即可




对边 `u v` **松弛** ：
```cpp
if(dist[u] != inf && dist[u] + w < dist[v]){
    dist[v] = dist[u] + w;
}
```

设置 `inf` 的意义:当 `dist[u] == inf` 时，不进行操作，意思是这个距离是理论上不可以达到的，当前节点 `u` 是从源点 `s` 出发不会达到的节点：
第一个 `dist[v]` 被改变是遇见了 `dist[s] == 0` ,此时 `dist[v]` 是一个合理的距离，也即，每一个 `dist[u] != inf` , `dist[u]` 是一个合理的距离,
不会出现 `dist[u] + w` 溢出 `inf` 的情况,因此 `inf` 可以说越大越好


### 正权值单源最短路 -- Dijkstra算法
计算到源 s 的最短距离，由于权值为正值，因此未被连接的节点的最短路只能出现在已经连接的较近节点之后，因此我们从源点开始 `仿照BFS以扩散的方式计算最短路` ，`已经被连接的节点中，距离最近的节点不可能再优化`,其他节点仍有优化的可能，因此队列中可以弹出的节点是有最小 dist 的，可以使用优先队列弹出队首节点


用 dist 数组记录每个顶点到源的距离，初始化为INF，每次更新时比较当前 `dist[v]` 和 `dist[u] + w`，使用贪心策略，用最小堆存储距离，每次更新当前最近顶点 `u` 的邻接顶点 `v`，处理前弹出 `u`
```cpp
int n;
priority_queue<pii> q;
vector<int> dist;
vector<vector<pii>> adj;
void sssp_dijkstra(int s){
    //initialize
    for(int i = 1;i <= n;++i){
        dist[i] = INT_MAX;
    }
    dist[s] = 0;

     for(int i = 1;i <= n;++i){
        q.push({i,dist[i]});
    }

    while(!q.empty()){
        int u = q.top().first;
        int d = q.top().second;
        q.pop();//不可能再优化
        if(d != dist[u])continue;//过时节点 
        for(auto it:adj[u]){
            int v = it.first;
            int w = it.second;
            if(dist[u] != INT_MAX && dist[v] > dist[u] + w){
                //dist[u] != INT_MAX 节点u被优化过/可达
                //dist[v] > dist[u] + w 可优化
                dist[v] = dist[u] + w;
                q.push({v,dist[v]});
            }
        }
    }
}
```
### 含负权值单源最短路 -- Bellman-Ford算法
由于负权边的存在，使用简单的BFS思路就不可行了，此时我们使用的是 `动态规划` 的思想：

考虑求 `从源点出发，最多经过 k 条边的最短路`，那么在此基础上对所有边再进行一轮松弛就可以得到 `从源点出发，最多经过 k + 1 条边的最短路`，这样就可以归纳证明：遍历松弛所有边 k 轮，就得到了 `从源点出发，最多经过 k 条边的最短路`


而对于没有负权环的图，最短路的最大边数为 V - 1,因此, V - 1 次遍历所有边优化最短路，如果第 V 次还能优化，则说明有负权环

`注意，此处的理论证明依赖于每轮更新只依赖上一轮的结果`，也即使用两个`dist` 数组分别记录，如果只使用一个 `dist` 数组，在同一轮中可能会用到刚更新的数据，造成提前更新，虽然不影响  n - 1 次的严格上界，但不适用于考虑经过边数的情景

此时松弛应当是
```cpp
 if (dist[u] != inf && dist[u] + w < newdist[v]){
     newdist[v] = dist[u] + w;
 } 
```

一般情景用一个数组即可：

```cpp
int n;
vector<int> dist;
vector<vector<pii>> adj;
bool negativecircle = false;
void sssp_bellman(int s){
    //initialize
    for(int i = 1;i <= n;++i){
        dist[i] = INT_MAX;
    }
    dist[s] = 0;

    for(int t=0;t<n-1;++t){
        bool update = false;//记录是否更新
        for(int i=1;i<=n;++i){
            int u = i;
            for(auto it:adj[i]){
                int v = it.first;
                int w = it.second;
                if(dist[u] != INT_MAX && dist[v] > dist[u] + w){
                    dist[v] = dist[u] + w;
                    update = true;
                }
            }
        }
        if(!update)break;//没有更新则提前终止
    }

    //第 n 次  检测负权环
    for(int i=1;i<=n;++i){
        int u = i;
        for(auto it:adj[i]){
            int v = it.first;
            int w = it.second;
            if(dist[u] != INT_MAX && dist[v] > dist[u] + w){
                negativecircle = true;
            }
        }
    }
}
```

#### SPFA 
Shortest Path Faster Algorithm ,也即 Bellman-Ford 队列优化算法，在对边松弛的过程中，可以发现，只有上一次松弛过边 `(u,v)`,也即 `dist[v]` 更新了，下一轮中 以 `v` 为起点的边才可能更新，因此，我们使用队列记录每轮更新的节点，下一轮只需更新此节点的出边即可

显然，队列不是必须的，使用容器记录更新节点即可，但使用队列方便一些，可以显式保留动态规划分层处理的过程，用变量 `num` 和 `next` 标记数量实现在单队列中分层处理

也可以隐式处理，以队列为空为终止标识，入队时标记节点，出队时解除标记，也可以防止重复入队，额外记录入队次数，以检测负环

队列优化版Bellman_ford 的时间复杂度 并不稳定，效率高低依赖于图的结构,注意实际选择
```cpp
queue<int> q;//记录容器
vector<bool> inQueue(n + 1,false);//标记是否在队列中
vector<int> nums(n + 1);//标记入队次数
bool flag = false;//负环
dist[s] = 0;
inQueue[s] = true;
nums[s]++;
q.push(s);
while(!q.empty()){
    int u = q.front();
    q.pop();
    inQueue[u] = false;
    for(auto e:g[u]){
        int v = e.first;
        int w = e.second;
        if(dist[u] != inf && dist[u] + w < dist[v]){
            dist[v] = dist[u] + w;
            if(!inQueue[v]){
                inQueue[v] = true;
                q.push(v);
                nums[v]++;
                if(nums[v] == n){
                    flag = true;
                    return;
                }
            }
        }
    }
}
```

### 含负权值的DAG
有向无环图的SSSP可以用toposort优化，按排序顺序处理节点，确保每次处理的节点都不会被后续节点干扰
```cpp
int n;
vector<int> dist;
vector<vector<pii>> adj;
vector<int> toposort;
void sssp_DAG(int s){
    //initialize
    for(int i = 1;i <= n;++i){
        dist[i] = INT_MAX;
    }
    dist[s] = 0;

    for(int u:toposort){
        if(dist[u] == INT_MAX)continue;//不可达顶点
        for(auto edge:adj[u]){
            int v = edge.first;
            int w = edge.second;
            if(dist[u] + w < dist[v])dist[v] = dist[u] + w;
        }
    }
}
```

## All-Pair Shortest Path (APSP)
### FloydWarshall 算法
`动态规划` ，考虑第 k 次开放节点 k 作为最短路的节点，遍历所有节点对`i j`,当 `i -> k` 可达且 `k -> j` 可达时，`dist[i][j] = min(dist[i][j],dist[i][k] + dist[k][j])` ，遍历 k 从 1 到 n 即可

适合稠密图
```cpp
int n;
vector<vector<int>> dist;//初始化为INT_MAX
vector<vector<pii>> g;
void floydWarshall(){
    //initialize
    for(int i = 1;i<=n;++i){
        dist[i][i] = 0;
    }

    //读取图并存入dist
    
    for(int k = 1;k<=n;++k){
        //允许1~k作为中转
        for(int i=1;i<=n;++i){
            for(int j=1;j<=n;++j){
                if(dist[i][k] == inf || dist[k][j] == inf)continue;
                dist[i][j] = min(dist[i][j],dist[i][k] + dist[k][j]);
            }
        }
    }
}
```

这一算法也可用于求有向图的传递闭包，也即任意两个节点的可达性，常用邻接矩阵表示，本质上是中转站动态规划

### Johnson算法 引入势能化负为正
考虑使用重复dijkstra算法，但不适用于负路径值，因此考虑进行路径转换，只需保证转换后路径的权值差一致即可

考虑加入虚拟节点s,s到所有节点权值规定为0，s到所有节点最短路使用Bellman-Ford计算为 h[i],由于 `h[v] <= h[u] + w(u,v)`,`w_ = w(u,v) + h[u] - h[v] >= 0`,新权值非负，且可以证明满足路径的权值差一致

最后结果减去 `h[u] - h[v]`

### 如何选择？
```
图类型判断
├── 单源最短路径 (SSSP)
│   ├── 非负权重 → Dijkstra算法
│   ├── 有负权重
│   │   ├── 无环图 (DAG) → 拓扑排序 + 动态规划
│   │   ├── 有环图 → Bellman-Ford算法
│   │   └── 多次查询 → 考虑Johnson预处理
│   └── 无权图 → BFS
│
├── 全源最短路径 (APSP)
│   ├── 稠密图 (E ≈ V²) → Floyd-Warshall算法
│   ├── 稀疏图 (E << V²)
│   │   ├── 无负权重 → 重复Dijkstra算法
│   │   └── 有负权重 → Johnson算法
│   └── 特殊结构图 → 考虑专用算法
│
└── 实时/动态图 → 增量算法或近似算法
```