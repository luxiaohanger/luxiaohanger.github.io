
# 二叉树

满二叉树：所有非叶子节点均有两个孩子

完全二叉树：除了最后一层其余层均填满，并且最后一层节点都在左侧

完美二叉树：除了最后一层叶子节点，所有节点均有两个孩子
## 树高 （从上向下递归深度） 
二叉树的树高复杂度是 `O(logn) --> O(n)` 之间，取决于是否接近完美二叉树，因此不能默认树高是对数级别，极端情况下退化为链时就是 `O(n)`
## 树的重心
可以证明树上一定存在节点使得删除该节点形成的所有新树的节点数都不大于原来节点总数的一半，这个点称之为二叉树的重心
### 重心的寻找
利用 `后序遍历可以记录子树 节点数/权值和` 的特点，
先记录每个节点作为根节点时的节点总数，再使用任意顺序遍历树即可
```cpp
//后序遍历记录子树 节点数/权值和
int countNode(const vector<node> &tree, vector<int> &nNode, int root) {
    if (root == 0)return 0;
    int nleft = countNode(tree, nNode, tree[root].left);
    int nright = countNode(tree, nNode, tree[root].right);
    int ans = nleft + nright + 1;
    nNode[root] = ans;
    return ans;
}

int findG(const vector<node> &tree, const vector<int> &nNode, int root, int size) {
    int nleft = nNode[tree[root].left];
    int nright = nNode[tree[root].right];
    int nparent = size - nNode[root];
    if (nleft <= size / 2 && nright <= size / 2 && nparent <= size / 2) {
        return root;
    }
    //由于我们从根节点向下遍历，因此重心不会在父树中
    //重心在子树中节点更多的一边
    if (nleft > size / 2)return findG(tree, nNode, tree[root].left, size);
    return findG(tree, nNode, tree[root].right, size);
}
```
## 由 中序遍历 + X 推导 Y
只要给定二叉树的中序遍历和前/后序遍历之一，就可以推导出另一序列：（前提：保证各节点值不重复）

以中 + 后为例：后序遍历的最后一个元素就是二叉树的根节点，由此可以在中序遍历中找到根节点的位置，从而确定 **左右子树的大小和各自的中序遍历**，从而在原后序遍历中确定左右子树的后序遍历，接下来 *递归得出左右子树的前序遍历*，最后合并后返回即可

`tips:由数组构建二叉树的常见思路就是找当前节点划分数组，左右子树各自递归到相应区间即可` 
## DFS 深度优先搜索
**实际解题时，首先思考选择什么顺序，是否迭代是优化的事**

当到达叶子节点（没有子节点的节点）或者无法继续前进时，算法会​​回溯​​到最近的一个分叉点，然后选择另一条路径继续深入。

在深度 h 非常大的场景下，迭代写法具有显著优势，避免了栈溢出风险

使用栈模拟递归调用的过程，用状态参数控制执行的顺序，使三种遍历方式写法有机统一

注意栈顶元素要引用访问，以便修改状态

```cpp
void preOrder(const vector<node> &tree, int root) {
    stack<pair<int, int>> st;
    st.push({root, 0});
    while (!st.empty()) {
        auto &cur = st.top();
        int state = cur.second;
        if (state == 0) {
            cout << tree[cur.first].val << ' '; // 前序访问
            cur.second = 1;
            if (tree[cur.first].left) {
                st.push({tree[cur.first].left, 0});
            }
        } else if (state == 1) {
            cur.second = 2;
            if (tree[cur.first].right) {
                st.push({tree[cur.first].right, 0});
            }
        } else {
            st.pop();
        }
    }
}

void inOrder(const vector<node> &tree, int root) {
    stack<pair<int, int>> st;
    st.push({root, 0});
    while (!st.empty()) {
        auto &cur = st.top();
        int state = cur.second;
        if (state == 0) {
            cur.second = 1;
            if (tree[cur.first].left) {
                st.push({tree[cur.first].left, 0});
            }
        } else if (state == 1) {
            cout << tree[cur.first].val << ' '; // 中序访问
            cur.second = 2;
            if (tree[cur.first].right) {
                st.push({tree[cur.first].right, 0});
            }
        } else {
            st.pop();
        }
    }
}

void postOrder(const vector<node> &tree, int root) {
    stack<pair<int, int>> st;
    st.push({root, 0});
    while (!st.empty()) {
        auto &cur = st.top();
        int state = cur.second;
        if (state == 0) {
            cur.second = 1;
            if (tree[cur.first].left) {
                st.push({tree[cur.first].left, 0});
            }
        } else if (state == 1) {
            cur.second = 2;
            if (tree[cur.first].right) {
                st.push({tree[cur.first].right, 0});
            }
        } else {
            cout << tree[cur.first].val << ' '; // 后序访问
            st.pop();
        }
    }
}
```
## BFS 广度优先搜索​
使用队列（FIFO）结构模拟广度优先的遍历

当分析涉及每层元素的性质时，可以考虑层序遍历
```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    if(!root)return ans;
    queue<TreeNode*> q;
    q.push(root);
    while(!q.empty()) {
        int n = q.size();
        //对于队列中当前的n个元素，也即一层节点，依次出队列时完成记录和子节点入队
        vector<int> temp;
        while(n--) {
            int num = q.front()->val;
            temp.push_back(num);
            if(q.front()->left)q.push(q.front()->left);
            if(q.front()->right)q.push(q.front()->right);
            q.pop();
        }
        ans.push_back(temp);
    }
    return ans;
}
```
## 后序遍历与回溯
后序遍历的先子后父顺序天然符合回溯的逻辑，在需要回到上一层的回溯算法中，选择后序遍历很合适

后序遍历也能模拟向上查找的回溯过程

# BST
二叉搜索树：左孩子值小于根节点，右孩子值大于根节点
## 特征
BST的中序遍历得到的是排序数组

可以通过大小关系判断待搜索节点位于左子树还是右子树


## Catalan 数
对于一棵有 n 个节点的二叉树，可以将其分解为：1个根节点 + 左子树（i个节点） + 右子树（n-1-i个节点）。其中 i 可以从 0 取到 n-1。不同结构的二叉树总数 f(n) 满足递归关系：
```
f(n) = Σ [f(i) * f(n-1-i)]  //对 i 从 0 到 n-1 求和，且 f(0) = 1

C(n) = (1/(n+1)) * C(2n, n) //其中 C(2n, n)是组合数
```

上述递归关系的解就是著名的 Catalan 数。这建立了二叉树计数与组合数学的桥梁。

## 二叉树节点的度
指的是节点的子节点数，因此有 n0 ， n1 ，n2 三种取值
```
二叉树总边数 = 节点数 - 1 = n0 + n1 + n2 - 1 = 2 * n2 + n1

==> n0 = n2 + 1
```
## 其他
1.搜索树的函数有多种操作方式，对于传入节点 `root`，可以考虑操作本身 / 孩子节点，操作本身时，会丢失父节点信息，但不会遗漏根节点；操作孩子节点时，可以处理父节点信息，但注意特殊操作根节点

优雅的使用返回值、参数引用、空指针判断可以避免很多问题；使用额外的safe头节点可以避免特殊操作root

2.二叉树问题大多可以递归到其左右子树，往往采用分治的做法


