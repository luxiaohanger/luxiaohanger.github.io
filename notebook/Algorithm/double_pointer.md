# 双指针
## 1. 快慢指针
对于一维列表，如数组，链表，在 O(n) 时间内遍历并操作
### 特点
**如果题目对空间有要求** 两个指针分别负责不同的工作，并原址操作，往往空间 O(1)

典型：链表判环、原地删除元素、交换链表元素、翻转链表
### 例题1
删除链表倒数第n个节点，并返回头节点
```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    //使用快慢指针，让快指针先出发 n 次，二者再同时出发，当快指针为空时慢指针即为要删除的节点
    ListNode* front=head;
    ListNode* back=head;
    //使用哨兵节点让头节点的删除更易处理
    ListNode* dummy=new ListNode;
    dummy->next=head;
    //prev 记录慢指针上一个节点，用于删除
    ListNode* prev=dummy;
    while(n--) {
        front=front->next;
    }
    while(front) {
        front=front->next;
        back=back->next;
        prev=prev->next;
    }
    prev->next=back->next;
    ListNode* ans=dummy->next;
    delete dummy;
    return ans;
}
```
### Floyd 判环法
```cpp
ListNode *detectCycle(ListNode *head) {
    if (!head || !head->next) return nullptr;

    ListNode* slow = head;
    ListNode* fast = head;

    // 第一步：判断是否有环
    while (fast && fast->next) {
        //fast 走的距离一定是 slow 的2倍，这个关系要保证
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {  // 相遇，说明有环
            break;
        }
    }

    if (!fast || !fast->next) return nullptr; // 无环

    // 第二步：寻找环的入口
    slow = head;  // 把 slow 放回头节点
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }

    return slow;  // slow 和 fast 相遇点就是入口
}
```

假设链表结构如下：

```
[头节点] --a--> [环起点] --b--> ... --c--> [回到环起点]
```

* `a` = 从链表头到环入口的距离
* `b` = 从环入口到 **相遇点** 的距离
* `c` = 从相遇点再走到环入口的距离（所以环的长度是 `b + c`）


* 慢指针（`slow`）走的步数：

  $$
  d_{slow} = a + b
  $$
* 快指针（`fast`）走的步数：

  $$
  d_{fast} = 2(a + b)
  $$
* 快指针比慢指针多走的路，必然是 **环的整数倍**：

  $$
  d_{fast} - d_{slow} = k(b+c) \quad (k \ge 1)
  $$

代入：

$$
2(a+b) - (a+b) = a+b = k(b+c)
$$

所以：

$$
a = k(b+c) - b
$$


把上式拆解：

$$
a = (k-1)(b+c) + c
$$

意思是：

* 从head出发的指针经过 a 到达入口时，从相遇点出发的指针经过了 c + (k-1)(b + c) 也到达入口，二者在入口相遇

### 寻找链表中点
可以使用快慢指针的做法，快指针每次移动 2 步，慢指针每次移动 1 步，当快指针到达链表末尾时，慢指针指向的链表节点即为链表的中点。

---



## 2. 双向指针
从列表两头向中间操作/从列表中间向两边操作

注意指针初始时最好不要在一起，否则可能多算一次
### 特点
已排序、找一个区间、反转回文
## 3. 滑动窗口
常用方式 先动右指针（扩大），满足条件时，移动左指针（缩小）
```cpp
int l=0,r=0;
while(r<n){
while(!check){
    r++;
 }
while(check){
    l++;
 }
 l--;
}
```
### 特点
**连续** 数组/字符问题（子数组/子字符串）