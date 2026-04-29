## DAG
Directed Acyclic Graphs 有向无环图
### 拓扑排序 topological sort
如果图中存在有向边 (u , v)，则认为 u 要排序在 v 之前

拓扑排序可以判断图中是否有环，还可以用来判断图是否是一条链。拓扑排序可以用来求 AOE 网中的关键路径，估算工程完成的最短时间。
#### Kahn 算法
节点的入度标志了必须排在其之前的节点，注意到，入度为 0 的节点可以直接加入结果，他们之前没有节点。同理，如果一个节点 a 已经加入了结果，那么 a 的下一节点 b 不再受其限制，由 a 带来的入度限制可以消除
```cpp
vector<int> toposort(vector<int>& in){
  vector<int> ans;
  //等待处理的入度为 0 节点
  queue<int> q;

  for(int i = 0;i < in.size();++i){
      if(in[i] == 0)q.push(i);
  }

  while(!q.empty()){
    int x = q.front();
    q.pop();
    ans.push_back(x);
    for(int m : adj[x]){
      in[m]--;
      if(in[m] == 0)q.push(m);
    }
  }

  if(ans.size() != in.size())return vector<int>(); //当前图不是DAG
  return ans;
}
```

