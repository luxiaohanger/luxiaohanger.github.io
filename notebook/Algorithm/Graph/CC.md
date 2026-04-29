## 强连通分量
对于有向图，我们把各节点相互连通的极大子图称为强连通分量

对于dfs生成树，到达未被访问子节点的边称为 `树边` ，到达祖先的边称为 `回边`，到达已经被访问但不是祖先的边称为 `横向边` ， 到达被访问的子节点的边称为 `前向边`

用栈记录dfs过程

用 `low[u]` 记录此节点通过有向边能到达的最早被访问的节点（已经被划分好的节点除外，即已经出栈的节点），因此我们要用其孩子节点的low值以及本身连接节点的dfn值更新 low[u]

`dfn[u] == low[u]` 时，此节点为一个分量最先入栈的节点，由深度优先的性质可知，其后入栈的其他分量已经被弹出，因此当前栈中在其之后入栈的节点同属一个分量，弹出这个分量

栈中不会有剩余节点
```cpp
vector<int> dfn(10005,-1);
vector<int> low(10005);
int cnt = 0;
stack<int> st;
vector<bool> in_stack(10005,false);
vector<vector<int>> g(10005);
vector<vector<int>> ans;


void dfs(int u) {
    dfn[u] = low[u] = ++cnt;
    st.push(u);
    in_stack[u] = true;

    for (auto v:g[u]) {
        if (dfn[v] < 0) {
          //树边到达的子节点，用 low[v] 更新
          //其所有可以到达的节点通过 low[v] 传递
            dfs(v);
            low[u] = min(low[u],low[v]);
        }
        if (in_stack[v]) {
          //可能属于一个分量的其他节点，用 dfn[v] 更新
            low[u] = min(low[u],dfn[v]);
        }
    }

    if (dfn[u] == low[u]) {
        vector<int> t;
        while (st.top() != u) {
            t.push_back(st.top());
            in_stack[st.top()] = false;
            st.pop();
        }
        //弹出 u 本身
        t.push_back(st.top());
        in_stack[st.top()] = false;
        st.pop();
        ans.push_back(t);
    }
}

// 遍历未访问的节点求分量
// dfs 结束时所有被访问/入栈节点一定被弹出，不会残留节点
    for (int i = 1;i<=n;++i) {
        if (dfn[i] < 0)dfs(i);
    }

```

## 边双连通分量
对于无向图，两个点 𝑢 和 𝑣，如果无论删去哪条边（只能删去一条）都不能使它们不连通，我们就说 𝑢 和 𝑣 边双连通。一个极大的边双连通子图，称之为一个边双连通分量

如果删除一条边后连通分量增加了，就称之为割边/桥（没有桥的极大连通子图就是一个边双连通分量）

对于一张连通的无向图，我们可以从任意一点开始 DFS，得到原图的一棵 DFS 生成树（以开始 DFS 的那个点为根），这棵生成树上的边称作 `树边`，不在生成树上的边称作 `非树边/回边`。

由于 DFS 的性质，我们可以保证`所有非树边连接的两个点在生成树上都满足其中一个是另一个的祖先`，也即dfs不会遇到已经被访问的祖先节点。(反证：由于节点之间有连接，在dfs其中一个时一定会访问另一个)

我们的求解思路就是标记所有的桥，再dfs遍历一次图时跳过桥，这样每次dfs经过的节点就是一个分量

如何判定桥？我们给每条无向边编号，在tarjan遍历时判定每条边是否是桥，对于边 `u v id`,我们递归节点 v ，在遍历出边时限制其不能经过边id，如果 v 不能到达更先的节点，就说明  `u v id` 是桥 (判定边的编号而非父节点可以应对重边)
```cpp
int maxn = 500005;
int cnt = 0;
vector<int> dfn(maxn,-1);
vector<int> low(maxn,-1);
vector<vector<int>> ans;
vector<vector<pii>> g(maxn);
vector<bool> isbridge(2000005,false);
vector<bool> vis(maxn,false);

void tarjan(int u,int edge) {
    dfn[u] = low[u] = ++cnt;
    for (auto x:g[u]) {
        int v = x.first;
        int eidx = x.second;
        if (eidx == edge)continue; //不经过边 edge
        if (dfn[v] < 0) {
            tarjan(v,eidx);
            if (low[v] > dfn[u]) {
                isbridge[eidx] = true;
            }
            low[u] = min(low[u],low[v]);
        }else {
            //回边 或 前向边
            low[u] = min(low[u],dfn[v]);
        }
    }
}

void dfs(int u,vector<int>& ebcc) {
    ebcc.push_back(u);
    vis[u] = true;
    for (auto x:g[u]) {
        int v = x.first;
        int eidx = x.second;
        if (isbridge[eidx] || vis[v])continue;
        dfs(v,ebcc);
    }
}


//判桥
for (int i = 1;i<=n;++i) {
        if (dfn[i] < 0)tarjan(i,-1);
    }

//dfs收集ebcc
    for (int i = 1;i<=n;++i) {
        if (!vis[i]) {
            vector<int> ebcc;
            dfs(i,ebcc);
            ans.push_back(ebcc);
        }
    }
```
## 点双连通分量
在一张连通的无向图中，对于两个点 𝑢 和 𝑣，如果无论删去哪个点（只能删去一个，且不能删 𝑢 和 𝑣 自己）都不能使它们不连通，我们就说 𝑢 和 𝑣 点双连通

对于一个无向图，如果把一个点删除后这个图的极大连通分量数增加了，那么这个点就是这个图的割点（又称割顶）。

一个没有割点的极大连通点集我们称之为一个点双连通分量

分量中任意两点存在没有交集的路径相互到达

只需求出割点即可得到分量，和求桥的思路类似，只不过这时要判断的是点是否是连接不同分量的必经之路，也即对于 `u v` , 要判断 `v` 能否不通过 `u` 到达更早的节点，因此判定条件是 `low[v] >= dfn[u]`(可以到达 `u`)

但是根节点需要特别判断，根节点是割点的充要条件是 `在dfs树上有至少2个孩子`

```cpp
vector<vector<int>> g(maxn);
vector<bool> ans(maxn,false);
vector<int> dfn(maxn,-1);
vector<int> low(maxn);
int cnt = 0;
int res = 0;

void tarjan(int u,int pa) {
    dfn[u] = low[u] = ++cnt;
    int child = 0;
    for (const auto& v:g[u]) {
        if (v == pa)continue;
        if (dfn[v] < 0) {
            child++;
            tarjan(v,u);
            if (u != pa && low[v] >= dfn[u] && !ans[u]) {
                ans[u] = true;
                res++;
            }
            low[u] = min(low[u],low[v]);
        }else {
            low[u] = min(low[u],dfn[v]);
        }
    }

    if (u == pa && child >= 2 && !ans[u]) {
        ans[u] = true;
        res++;
    }
}
```

但实际上求分量和求割点应当同时进行，我们把点入栈，遇到条件 `low[v] >= dfn[u]` 时意味着`栈顶直到 v u 是一个分量`，此时无需判断割点

注意孤立自环（读入时忽略自环）、孤立节点情况

```cpp
vector<vector<int>> g(maxn);
vector<int> dfn(maxn,-1);
vector<int> low(maxn);
vector<vector<int>> bccs;
int cnt = 0;
stack<int> st;

void tarjan(int u,int pa) {
    dfn[u] = low[u] = ++cnt;
    //最终栈可能非空但不影响我们判断点双
    st.push(u);

    if (pa == u && g[u].empty()) {
        bccs.push_back({u});
        return;
    }

    for (const auto& v:g[u]) {
        if (v == pa)continue;
        if (dfn[v] < 0) {
            tarjan(v,u);
            if (low[v] >= dfn[u]) {
                //栈顶直到v是一个点双
               vector<int> temp;
                while (true) {
                    int t = st.top();
                    temp.push_back(t);
                    st.pop();
                    if (t == v)break;
                }
                temp.push_back(u);
                bccs.push_back(temp);
            }
            low[u] = min(low[u],low[v]);
        }else {
            low[u] = min(low[u],dfn[v]);
        }
    }
}
```

## 应用
1.缩点：

ebcc缩点，得到树，桥作为树边

scc缩点得到 DAG，便于 toposort 和 动态规划

2.ebcc删除任意一条边仍然连通，因为任意两点间存在边不重合的两条路径连接；bcc删除任意一个点仍然连通，因为任意两点间存在点不重合的两条路径连接