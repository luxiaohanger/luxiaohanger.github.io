# 回溯
回溯算法本质上是利用递归进行穷举，适用于求所有可能解的情形

狭义上，回溯也是DFS的一种，只不过是加了一些处理（加入节点、删除节点）和判断终止

## 模板
```cpp
void backtracking(){
    if( 符合条件 ){
        存储答案
        return;
    }

    for(遍历可能分支){
        加入分支到预存储的答案
        backtracking(进入分支)
        回溯（删除此分支）
    }
}
```

对于路径寻找类型的递归，可以使用标识位标记是否寻找结束
```cpp
void save_path(T* now,T* target,vector<T*>& path,bool& find){
    if(find || !now)return;
    path.push_back(now);
    if(now == target){
        find = true;
        return;
    }
    for(auto x : next){
        save_path(x,target,path,find);
    }
    if(!find)path.pop_back();
}
```

对于不能重复的组合问题，可以标记当前元素位置，递归时从标记位置向后遍历
```cpp
// 和全排列不同之处在于不能有重复序列，因此可以考虑用顺序排除重复序列
// 增加枚举起始下标，确保每次枚举的数字都比之前大
void back_track_78(int n, vector<int>& nums, vector<int>& temp,
                   vector<vector<int>>& ans, vector<bool>& vis, int start) {
    if (temp.size() == n) {
        ans.push_back(temp);
        return;
    }
    for (int i = start; i < nums.size(); ++i) {
        if (!vis[i]) {
            temp.push_back(nums[i]);
            vis[i] = true;
            back_track_78(n, nums, temp, ans, vis, i + 1);
            temp.pop_back();
            vis[i] = false;
        }
    }
}
```

## N 皇后
给定 n * n 棋盘，放置 n 个皇后，要求没有皇后在同一行，同一列，同一斜列，求所有合法方法

枚举所有可能情况并判断是否成立，我们在枚举的时候就要尽量减少枚举情况数，最一般的枚举是在 n^2 格子中任意选 n 个，考虑到合法情况，我们得知所有皇后各占一行一列，因此可以令每行一个皇后，枚举他们所在列的可能，此时就是一个全排列

对于合法情况的监测，只需监测斜向方向，考虑两个斜向，左上右下和左下右上，分别用 2*n - 1 个flag标识是否占用

> 同一斜线的坐标满足规律：横纵坐标之和/之差相同

```cpp
void back_track_51(int x, vector<int>& temp, vector<bool>& vis,
                   unordered_set<int>& l1, unordered_set<int>& l2,
                   vector<vector<string>>& ans, int n) {
    if (x == n - 1) {
        vector<string> s;
        string ss;
        for (int i = 0; i < n; ++i) ss += '.';
        for (int i = 0; i < n; ++i) {
            ss[temp[i]] = 'Q';
            s.push_back(ss);
            ss[temp[i]] = '.';
        }
        ans.push_back(s);
        return;
    }

    //[x + 1][tobeselect]
    for (int i = 0; i < n; ++i) {
        if (!vis[i] && !l1.contains(x + 1 + i) && !l2.contains(x + 1 - i)) {
            vis[i] = true;
            l1.insert(x + 1 + i);
            l2.insert(x + 1 - i);
            temp[x + 1] = i;
            back_track_51(x + 1, temp, vis, l1, l2, ans, n);
            vis[i] = false;
            l1.erase(x + 1 + i);
            l2.erase(x + 1 - i);
            temp[x + 1] = -1;
        }
    }
}

vector<vector<string>> solveNQueens(int n) {
    unordered_set<int> l1;
    unordered_set<int> l2;
    vector<int> temp(n, -1);
    vector<bool> vis(n);
    vector<vector<string>> ans;
    int x = -1;
    for (int i = 0; i < n; ++i) {
        vis[i] = true;
        l1.insert(x + 1 + i);
        l2.insert(x + 1 - i);
        temp[x + 1] = i;
        back_track_51(x + 1, temp, vis, l1, l2, ans, n);
        vis[i] = false;
        l1.erase(x + 1 + i);
        l2.erase(x + 1 - i);
        temp[x + 1] = -1;
    }
    return ans;
}
```

