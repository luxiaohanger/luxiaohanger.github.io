# 序列DP
子序列是指从原序列内挑选一系列元素，并按原始相对顺序形成的序列,子序列问题往往不考虑结尾是否选，同时要对于所有情况都要状态转移，不能遗漏不增加答案的情况

连续序列是指原序列中一段连续的元素

序列元素仅考虑相等关系的问题（编辑距离相关）往往定义 dp[i][j] 为直到ij位的答案，此时讨论ij位是否相等并转移状态

### 最长严格递增子序列
定义 dp[i] 为以 i 结尾的最长严格递增子序列，这是子序列问题的常用定义,状态来源一般有两个：自己作为开头/自己接在之前的后面

### 最长重复子数组
给定两个数组，求最长的重复部分
定义 dp[i][j] 为：nums1 以 i 结尾，nums2 以 j 结尾的最长重复部分
```cpp
if (nums1[i] == nums2[j]) {
    if (i > 0 && j > 0)dp[i][j] = dp[i - 1][j - 1] + 1;
    else dp[i][j] = 1;
}
```

### 最长重复子序列
给定两个数组，求最长的重复子序列
仿照最长递增子序列的模式，我们定义 dp[i][j] 为：以 i 和 j 位结尾的最长重复子序列，对于一维问题，我们可以遍历之前的所有解确定一个符合条件的最大值，此时如果使用遍历复杂度就会爆炸（二重循环内部嵌套二重循环），我们需要优化一种方法，快速查询 位置[i][j]之前的最大dp值，可以使用记忆化方法，并且使用动态规划实现，findmax[i][j]可以从三部分转移而来
```cpp
for (int i = 0; i < n1; ++i) {
        for (int j = 0; j < n2; ++j) {
            if (i > 0 && j > 0)
            findmax[i][j] = max(dp[i - 1][j - 1],max(findmax[i][j - 1],findmax[i - 1][j]));
            if (text1[i] == text2[j]) {
                dp[i][j] = findmax[i][j] + 1;
                ans = max(ans,dp[i][j]);
            }
        }
    }
```

也可以考虑定义不含结尾的 dp[i][j] : 直到 i 和 j 位的最长子序列，此时状态转移由结尾是否相同决定，同时要注意初始化的特殊性，一旦某个位置相同了，后面也要设为1

```cpp
for (int i = 0; i < n1; ++i) {
        if (text1[i] == text2[0]) {
            for (int k = i; k < n1; ++k)dp[k][0] = 1;
            break;
        }
    }

    for (int j = 0; j < n2; ++j) {
        if (text2[j] == text1[0]) {
            for (int k = j; k < n2; ++k)dp[0][k] = 1;
            break;
        }
    }

    for (int i = 1; i < n1; ++i) {
        for (int j = 1; j < n2; ++j) {
            if (text1[i] == text2[j])dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n1 - 1][n2 - 1];
```

### 子序列个数
给定长短两个序列，求短序列在长序列的子序列中出现的次数。同理当 i 位和 j 位相同时，dp[i][j] 从两个状态转移而来，要么用 i 对应 j 要么不用
```cpp
for (int i = 1; i < n1; ++i) {
        for (int j = 1; j < n2; ++j) {
            if (s[i] == t[j])dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
            else dp[i][j] = dp[i - 1][j];
        }
    }
```

### 编辑距离
给定序列 w1 w2，允许使用三种编辑方式：插入、替换、删除，求从 w1 到 w2 的最小编辑步骤数，也即编辑距离

考虑定义 dp[i][j] 为：w1[0:i] -> w2[0:j] 的编辑距离，一共三种方式，如果用删除，则从 w1[0:i-1] -> w2[0:j] 转移；如果用插入，则从 w1[0:i] -> w2[0:j-1] 转移；如果用替换，则从 w1[0:i-1] -> w2[0:j-1] 转移，此时额外步数取决于当前位是否相等

```cpp
for (int i = 1; i < n1; ++i) {
    for (int j = 1; j < n2; ++j) {
        int del_dis = dp[i - 1][j] + 1;
        int insert_dis = dp[i][j - 1] + 1;
        int eq = word1[i] == word2[j] ? 0 : 1;
        int subti_dis = dp[i - 1][j - 1] + eq;
        dp[i][j] = min(del_dis,min(insert_dis,subti_dis));
    }
}
```

### 统计回文子串的个数
考虑回文字符串的递归定义方式：如果s是回文字符串，那么在s两侧添加相同字符也形成回文字符串，因此定义bool数组 dp[i][j] : s[i:j] 是回文字符串，由dp[i + 1][j - 1] 转移而来，那么遍历顺序就值得关注了，一种方式是注意到转移后的长度更长，因此可以按字符串长度顺序遍历
```cpp
for (int l = 0; l < n; ++l) {
    for (int i = 0; i + l < n; ++i) {
        if (s[i] == s[i + l] && (i + 1 > i + l - 1 || dp[i + 1][i + l -1])) {
            dp[i][i + l] = true;
            cnt++;
        }
    }
}
```
另一种方式就是关注维度的大小关系，第一维度从大到小遍历，第二维度从小到大遍历
```cpp
int countSubstrings(string s) {
    int n = s.size();
    vector<vector<bool> > dp(n, vector<bool>(n));
    int cnt = 0;
    for (int i = n - 1; i >= 0; --i) {
        for (int j = i; j < n; ++j) {
            if (s[i] == s[j] && (i + 1 > j - 1 || dp[i + 1][j - 1])) {
                dp[i][j] = true;
                cnt++;
            }
        }
    }
    return cnt;
}
```

### 回文子序列的最大长度
子序列问题，使用范围定义dp，状态转移时注意else分支也要转移
```cpp
int longestPalindromeSubseq(string s) {
    int n = s.size();
    vector<vector<int>> dp(n,vector<int>(n));
    int ans = 0;
    for (int i = 0;i<n;++i)dp[i][i] = 1;
    for (int i = n - 1; i >= 0; --i) {
        for (int j = i + 1; j < n; ++j) {
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
                ans = max(ans,dp[i][j]);
            }else {
                dp[i][j] = max(dp[i + 1][j],dp[i][j - 1]);
            }
        }
    }
    return ans;
}
```
