# Monotonic Stack 单调栈
## 特点
栈中元素严格递增/递减  

在每次入栈一个新元素时，为了维护栈的单调性，需要先将破坏单调性的元素弹出栈​​
## 适用类型
一维序列，从一端扫描，判断相邻或可见关系，关系只跟“最近的更高/更矮元素”有关

*关键词：下/上一个更大/小的元素 / 可见性 / 遮挡*  
左边/右边最近的满足某个条件的元素  
我是不是在不停地“淘汰掉一些候选人”？我是不是只关心“离我最近的更高/更矮”？

**一维已经很能说明问题了，尽量使用单调栈这类O(n)做法**  
一次扫描，如果更大就出栈（淘汰）  
找“更大”用​​递减栈​​；找“更小”用​​递增栈​​。
## 模板
寻找数组中 `每个元素 i` 某侧第一个满足关系 `p` 的元素 `x` ( `i p x` )

注意此处关系 `p` 需满足严格偏序：  
传递性：`a p b && b p c ==> a p c`  
反自反性：`a !p a`  
反对称性： `a p b ==> b !p a`
```cpp
//以右侧为例，左侧反向遍历即可
vector<T> arr(n);
vector<int> ans(n,n);//初始化为n
stack<int> st;//栈中存放下标
for(int i = 0;i < n;++i){
    while(!st.empty() && arr[st.top()] p arr[i]){
        ans[st.top()] = i;
        st.pop();
    }
    st.push(i);
}
//没找到就是 n
```
在找满足条件的区间端点时，思路类似，就是找两侧第一个不满条件的元素，此时注意初始化的大小和找到以后的答案记录方式和模板有所区别

找区间时，避免子区间重复计算的一种思路是左右寻找条件不一样，一次含等于，一次不含

## 例题
### 最大二叉树
给定一个不重复的整数数组 `nums` , `最大二叉树` 可以用下面的算法从 `nums` 递归地构建:

创建一个根节点，其值为 `nums` 中的最大值。
递归地在最大值左边的子数组构建左子树。
递归地在最大值右边的子数组构建右子树。
返回 `nums` 构建的最大二叉树 。

#### 思路分析
一般方法使用递归 dfs O(n^2)

考虑 *某节点的父节点就是其 左边/右边下一个更大值*，符合单调栈模型

细节：左右都不存在，即为根节点；左右存一，即为父节点；左右都存在，则较小者为父节点

# 单调队列
用 `O(1)` 时间维护区间最值

核心思想是：**提前丢弃不可能成为最值的元素**
```cpp
struct monoqueue {
    //用双端队列做底层容器
    deque<int> dq;

    void pushval(int val) {
        //和单调栈类似，把小于新元素的队尾元素出队
        while (!dq.empty() && val > dq.back()) {
            dq.pop_back();
        }
        dq.push_back(val);
    }

    void popval(int val) {
        //出队时，只有待出队元素是队首元素时需要出队
        //不会是最值的元素已经被提前丢弃
        if (!dq.empty() && val == dq.front())dq.pop_front();
    }

    void pushidx(int idx, const vector<int> &arr) {
        while (!dq.empty() && arr[idx] > arr[dq.back()]) {
            dq.pop_back();
        }
        dq.push_back(idx);
    }

    void popidx(int idx) {
        if (!dq.empty() && idx == dq.front())dq.pop_front();
    }

    int getExtremval() {
        return dq.front();
    }

    int getExtremidx() {
        return dq.front();
    }
};
```
注意：出队操作时，相等关系依据题意而定，如果是需要位置关系的，要在队列中存放元素引索，以确保唯一对应