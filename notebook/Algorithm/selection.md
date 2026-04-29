# 选择
`Selection Problem`:

given a set A of n distinct numbers and an integer 
i, find the i_th order statistic of A
## 最值选择
两两比较，在较大者组找最大值，较小者组找最小值  `O(3/2n)`
## 随机选择
```cpp
// 划分函数：将数组分为小于主元和大于主元的两部分
int partition(vector<int>& nums, int low, int high) {
    // 选取最后一个元素作为主元（实际主元已在调用前随机选择并交换至此）
    int pivot = nums[high];
    int i = low - 1;  // i指向小于主元的最后一个元素

    // 遍历区间 [low, high-1]
    for (int j = low; j < high; j++) {
        if (nums[j] < pivot) {
            i++;
            swap(nums[i], nums[j]);  // 将小于主元的元素移到左侧
        }
    }
    // 将主元放到正确位置（i+1）
    swap(nums[i + 1], nums[high]);
    return i + 1;  // 返回主元最终位置
}

// 随机选择算法核心实现（迭代版）
int quickSelect(vector<int>& nums, int low, int high, int k) {
    while (true) {
        if (low == high) return nums[low];  // 区间只剩一个元素时直接返回

        // 随机选择主元索引并交换到末尾
        int pivot_index = low + rand() % (high - low + 1);
        swap(nums[pivot_index], nums[high]);

        // 划分数组并获取主元位置
        pivot_index = partition(nums, low, high);

        // 根据k与主元位置的关系缩小搜索范围
        if (k == pivot_index) return nums[k];        // 找到目标元素
        else if (k < pivot_index) high = pivot_index - 1;  // 在左半部分继续搜索
        else low = pivot_index + 1;                 // 在右半部分继续搜索
    }
}

// 用户接口：查找第k小元素（1-based）
int findKthSmallest(vector<int>& nums, int k) {
    int n = nums.size();
    // 检查k的有效性
    if (k < 1 || k > n) {
        cerr << "Error: k must be between 1 and " << n << endl;
        return INT_MIN;
    }

    srand(time(0));  // 初始化随机数种子
    // 调用核心算法（k转换为0-based索引）
    return quickSelect(nums, 0, n - 1, k - 1);
}
```
## 标准库实现
```cpp
void nth_element(
    RandomAccessIterator first, //起始迭代器
    RandomAccessIterator nth,   //目标位置迭代器 
    // nth = first + 3表示查找第4小的元素  (0 - base)
    RandomAccessIterator last,  //尾迭代器  --> 不包含在内
    Compare comp                // 自定义比较函数(类实例)
);
```
效果:  
所有在 `[first, nth)` 范围内的元素 ≤ *nth,所有在 `[nth + 1, last)` 范围内的元素 ≥ *nth
## 复杂度
平均 `O(n)`