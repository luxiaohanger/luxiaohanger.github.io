# 间隔取数DP
给定有序元素列表，相邻元素不能同时取，求最优解

一种思路是不陷入某一个到底取不取的讨论，让dp自动去判断
```cpp
for(int i = 2;i<n;++i){
    dp[i] = max(dp[i - 1],dp[i - 2] + nums[i]);
    //在状态转移中限定间隔的性质即可
}
```

另一种做法是在dp数组中记录元素是否取，一般需要双倍空间
```cpp
//dp[i][0]no  dp[i][1] yes
for(int i = 1;i<n;++i){
    dp[i][0] = max(dp[i - 1][0],dp[i - 1][1]);
    dp[i][1] = dp[i - 1][0] + nums[i];
}

return max(dp[n - 1][0],dp[n - 1][1]);
```