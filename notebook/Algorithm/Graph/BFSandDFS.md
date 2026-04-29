## 图的 BFS
利用队列，从起点开始，未访问节点访问标记后入队，取队首节点的邻接节点入队，队首出队，循环至队列为空
```cpp
void BFS(int u){
  queue<int> q;
  vis[u] = true;
  q.push(u);
  while(!q.empty()){
    int cur = q.front();
    q.pop();
    for(int x : adj[cur]){
      if(!vis[x]){
        vis[x] = true;
        q.push(x);
      }
    }
  }
}
```
## 图的 DFS
使用递归或者栈
```cpp
//递归
void DFS(int u){
  if(vis[u])return;
  vis[u] = true;
  for(int x : adj[u]){
    DFS(x);
  }
}

//栈
//严格深度优先
void DFS(int u){
  stack<int> st;
  vis[u] = true;
  st.push(u);
  while(!st.empty()){
    int cur = st.top();
    for(int x : adj[cur]){
      bool find = false;
      if(!vis[x]){
        vis[x] = true;
        st.push(x);
        find = true;
        break;
      }
    }
    if(!find)st.pop();
  }
}

//伪深度优先
//减少对邻接表重复访问
void DFS(int u){
  stack<int> st;
  vis[u] = true;
  st.push(u);
  while(!st.empty()){
    int cur = st.top();
    st.pop();
    for(int x : adj[cur]){
      if(!vis[x]){
        vis[x] = true;
        st.push(x);
      }
    }
  }
}

```