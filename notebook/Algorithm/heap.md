# heap
## binary heap
用数组arr可以维护一个二分堆，因为父子节点的下标有O(1)复杂度的访问关系


| 关系       | 下标从 1 开始 | 下标从 0 开始 |
|------------|---------------|----------------|
| 父节点     | `i / 2`       | `(i - 1) / 2`  |
| 左子节点   | `2*i`         | `2*i + 1`      |
| 右子节点   | `2*i + 1`     | `2*i + 2`      |

---
### 最大堆
保证父节点 `>=` 子节点,根节点是最大元素
```cpp
//从A[idx]开始进行最大堆化 --> O(logn)
//注意此处的前提是 idx 的子节点已经是最大堆
void maxheapify(int idx,vector<int>& A){
    int left = idx * 2;
    int right = left + 1；
    int n = A.size() - 1;
    if(A[idx] < A[left]&&left <= n){
        swap(A[idx],A[left]);
        maxheapify(left,A);
    }
     if(A[idx] < A[right]&&right <= n){
        swap(A[idx],A[right]);
        maxheapify(left,A);
    }
    return ;
};

//从数组构建最大堆 ：从最下层（更优地，从倒数第二层）向上最大堆化即可
```
堆排序: 取走并返回堆顶元素，把堆尾元素调到堆顶，并重新最大化
### 优先队列
为每个元素赋予权重，优先执行权重高的元素  
利用最大堆实现： 加入新元素后 `maxheapify` 即可

## C++优先队列
C++有自带的优先队列数据类型可以使用
```cpp
// 比较函数对象
struct CompareAge {
    bool operator()(const Person& p1, const Person& p2) {
        return p1.age < p2.age;  // 最大堆
        // return p1.age > p2.age;  // 最小堆
    }
};

priority_queue<Person, vector<Person>, CompareAge> pq;
//优先队列的三个模板参数分别是：元素类型、底层容器类型（通常是vector）和比较器类型
```
**当希望改变卫星数据的值而不破坏队列时，可以在队列中存放指向数据的指针，因为对列中存放的是数据副本**

```cpp
struct CompareAge {
    bool operator()(const Person* p1, const Person* p2) {
        return p1->age < p2->age;  // 最大堆
    }
};
```
### 可变最值模型
我们往往希望维护一组数据的最值，并且在关键数据关键数据更改后依旧能获取最值/维护元素相对关系，这就是可变最值模型，我们使用 **优先队列“延迟删除法”** 解决

*当希望改变关键数据时，可以考虑 `push` 一个新的版本，并维护一个结构体成员 `version` ,在 `pop`/`top`  时检验当前版本和数组中维护的最新版本是否一致，如果不一致则 `pop`*

注意，延迟删除法比自己构造堆并进行 `shift_up`/`shift_down` 要慢，特别是废弃元素过多时

### 前 x 个较大元素/第 x 个较大元素
如何维护前x个较大元素？我们可以维护一个大小为 x 的最小堆，当新元素插入时 `push`,接下来移除最小元素（堆顶）即可

当 x 变化时，只用一个堆就难以解决了，此时使用对顶堆，剩余元素存放在一个最大堆中，x 变化时把堆顶元素转移到另一个堆即可
```cpp
priority_queue<int> maxheap;
priority_queue<int,vector<int>,cmp> minheap;
//加入新元素 newnum
maxheap.push(newnum);
//候选最大元素加入 minheap
minheap.push(maxheap.top());
maxheap.pop();
//淘汰最小元素进入 maxheap
maxheap.push(minheap.top());
minheap.pop();
```
变式：维护中位数
## 堆/优先队列 应用
1.合并 K 个有序数组  
数组头入堆，弹出后push新的

2.反复取最值

3.维护前K个

4.滑动窗口 / 区间动态最大最小值  
数据区间在移动，需要随时知道区间极值

5.动态最优选择（贪心）

## 堆的实现
```cpp
class MaxHeap {
private:
    std::vector<int> heap;  

    //上浮和下沉维护堆性质的前提条件是除了待调整元素，其余元素符合堆性质，例如其子树、兄弟树均为合法堆

    //上浮
    void siftUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;  // 计算父节点位置
            if (heap[parent] >= heap[index]) {
                break;  // 已满足大顶堆性质
            }
            std::swap(heap[parent], heap[index]);  // 交换父子
            index = parent;  // 继续向上检查
        }
    }


    //下沉：主要要求左右子树是合法堆
    void siftDown(int index) {
        int size = heap.size();
        while (true) {
            int leftChild = 2 * index + 1;  // 左孩子位置
            int rightChild = 2 * index + 2; // 右孩子位置
            int largest = index;            // 假设当前节点最大

            // 复习关注点：堆满足的结论
            // 比较左孩子和当前节点
            if (leftChild < size && heap[leftChild] > heap[largest]) {
                largest = leftChild;
            }
            // 比较右孩子和当前最大节点
            if (rightChild < size && heap[rightChild] > heap[largest]) {
                largest = rightChild;
            }
            
            // 如果当前节点不是最大，需要交换并继续下沉
            if (largest != index) {
                std::swap(heap[index], heap[largest]);
                index = largest;  // 继续向下检查
            } else {
                break;  // 已满足堆性质
            }
        }
    }

public:
    
    void push(int value) {
        heap.push_back(value);          // 添加到末尾
        siftUp(heap.size() - 1);        // 上浮调整
    }

    int pop() {
        if (isEmpty()) {
            throw std::out_of_range("Heap is empty");
        }
        
        int maxValue = heap[0];         // 堆顶元素（最大值）
        heap[0] = heap.back();         // 末尾元素移到堆顶
        heap.pop_back();               // 删除末尾元素
        
        if (!heap.empty()) {
            siftDown(0);               // 下沉调整
        }
        
        return maxValue;
    }

    int top() const {
        if (isEmpty()) {
            throw std::out_of_range("Heap is empty");
        }
        return heap[0];
    }

    void buildHeap(const std::vector<int>& array) {
        // O(n) 的建堆方法
        heap = array;
        // 从最后一个非叶子节点开始，是为了保证其左右子树均为合法堆
        for (int i = heap.size() / 2 - 1; i >= 0; i--) {
            siftDown(i);
        }
    }

    //修改某个元素的值，根据情况选择上浮或下沉
    void change(int idx,int val){
        int prev = heap[idx];
        heap[idx] = val;
        if(val > prev)shiftUp(idx);
        if(val < prev)shiftDown(idx);
    }

    // ---------- 辅助方法 ----------
    
    bool isEmpty() const {
        return heap.empty();
    }
    
    size_t size() const {
        return heap.size();
    }
}
```

