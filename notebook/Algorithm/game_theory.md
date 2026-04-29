# 博弈论
## 极大极小模型 minimax
### 例题
两位资深的审题专家，小蓝和小桥，各自收到了 N 道题目。

为了准备即将举行的竞赛，他们需要从各自收到的题目中选出一道，用于竞赛。通过商量，两人决定通过一种特殊的方式来选择题目：两人轮流删除一道自己手中的题目，直到各自只剩下一道题目。小蓝先删除，然后小桥删除，依此交替进行，直到最后两人手中都只剩下一道题目。

小蓝希望最终两人剩下的两道题目的难度差尽可能大，而小桥则希望难度差尽可能小。假设两人都采取最优策略，请问最终两人剩下的两道题目的难度差的绝对值是多少？

#### 输入格式
第一行包含一个整数 N(1≤N≤1000)，表示每人初始的题目数量；
第二，三行各包含 N 个整数，表示小蓝和小桥收到题目数量 

#### 输出格式
输出一个整数，表示在双方均采取最优策略下，最终两道题目的难度差的绝对值。
#### 分析
这是一道无信息差的博弈，双方都知道对方的题目和想法，由于小桥是后手，因此，对小蓝的所有题目，他都可以在自己的题目中预选一个最近值，假设为 `b[i]`,`b[j]`...`b[k]`,他只需要根据先手的剩余题目，判断自己要留下哪道题  
**最终一定可以做到：对于先手所留下的最终题，后手一定可以留下与之对应的最近题**  
而先手也可以考虑到这一点，因此他被迫在所有最近距离中挑选一个最大差值。即为答案
```cpp
int game(const vector<int>& a,const vector<int>& b){
    int n=a.size();
    int maxdet=0;
    for(int i=0;i<n;i++){
        int mindet=1001;
        for(int j=0;j<n;j++){
        mindet=min(mindet,abs(a[i]-b[j]));
        }
        maxdet=max(mindet,maxdet);
    }
    return maxdet;
}
```
当前时间复杂度为 `O(n^2)`,如果我们考虑用 `排序+二分查找` 优化，可以做到
`O(nlogn)`
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];

    sort(b.begin(), b.end()); // 为了二分找最近值

    int ans = 0;
    for (int i = 0; i < n; i++) {
        // 小桥会选离 a[i] 最近的 b[j]
        auto it = lower_bound(b.begin(), b.end(), a[i]);
        int d = INT_MAX;
        if (it != b.end()) d = min(d, abs(a[i] - *it));
        if (it != b.begin()) d = min(d, abs(a[i] - *prev(it)));
        // 小蓝希望最大化这个最小值
        ans = max(ans, d);
    }
    cout << ans << "\n";
    return 0;
}

```
