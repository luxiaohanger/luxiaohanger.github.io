# 贪心策略
分步解决问题，只考虑当前的最优选择

不保证是最优解

感觉局部最优是推出全局最优，并且想不出反例，那么就试一试贪心
## 正确性
贪心策略适用于符合以下条件的问题：

### 贪心选择性质 (Greedy Choice Property)

我们可以通过做出局部最优选择（贪心选择）来构造一个全局最优解。也就是说，贪心策略所做的选择，总是某个最优解的一部分。

`对于全局而言，当前的贪心选择一定是最优解的一部分`，一般可以用“如果不选择 a，那最优解中一定有部分可以用 a 替换”证明

贪心选择一般是多个选择中具有某个极端性质的，这个性质可能不是已有的，需要构造

### 最优子结构 (Optimal Substructure)

一个问题的最优解包含其子问题的最优解。也就是说，在做出贪心选择后，剩下的问题（子问题）的最优解，与之前的贪心选择合并，就能得到原问题的最优解。

`做出贪心选择后，剩下的问题和全局结构相同，可以递归解决`


## Huffman Codes
霍夫曼编码是一种贪心算法，用于为字符集生成最优的前缀无关编码，以最小化编码后的总比特长度。前缀无关性意味着任何字符的编码都不是其他字符编码的前缀，这确保了解码时的唯一性和效率。

核心思想是基于字符频率构建一棵二叉树（霍夫曼树），其中频率较低的字符获得较长的编码，频率较高的字符获得较短的编码，从而使平均编码长度最小化。

初始时每个字符是一个节点，每次选取频率较小的两个节点生成其父节点加入优先队列，父节点频率为二者之和，循环 n - 1 次得到根节点

`O(nlogn)`
```cpp
struct node{
    double fre;
    char c;
    node* left;
    node* right;

    node(double f):fre(f){}
}


vector<node*> nodes(n);//所有字符节点
//构建Huffman tree
priority_queue<node*> pq;
for(auto it:fre){
    pq.push(it);
}


for(int i = 0;i<n - 1;++i){
    auto n1 = pq.top();
    pq.pop();
    auto n2 = pq.top();
    pq.pop();
    node* pa = new node(n1->fre + n2->fre);
    pa -> left = n1;
    pa -> right = n2;
    pq.push(pa);
}

node* root = pq.top();

//获取编码:使用回溯算法
unordered_map<char,string> code;
string s;
void dfs(node* root){
    if(root -> char != 0){
        code[root -> char] = s;
        return;
    }

    if(root -> left){
        s += '0';
        dfs(root -> left);
        s.pop_back();
    }

    if(root -> right){
        s += '1';
        dfs(root -> right);
        s.pop_back();
    }
}
```

## 技巧
1.关于出现两个维度一起考虑的情况，一般是确定一边（排序等）然后贪心另一边，两边一起考虑，就会顾此失彼。

2.有关区间的问题，按某端排序后处理（遍历）是常用的贪心思路