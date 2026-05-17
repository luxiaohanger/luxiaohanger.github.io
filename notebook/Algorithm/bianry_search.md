# 二分查找
问题必须具有某种单调性质，即随着某个参数的增大，条件从满足变为不满足（或反之），对于给定的候选解，必须能够快速判断它是否满足条件。将许多看似复杂的问题转化为简单的决策问题（"这个值是否满足条件？"），从而以对数时间复杂度高效解决

这里的有序是广义的有序，如果一个数组中的左侧或者右侧都满足某一种条件，而另一侧都不满足这种条件，也可以看作是一种有序
## 适用类型
### 1. 在list中寻找满足某条件的最值  
*list可能是自己构造的*（例如计算整数的平方根，就是找满足条件的最大整数）,二分答案并验证，往往是最大值最小化/最小值最大化问题   

**注意，这类情形要保证答案在list内**  

把答案维护在 [left,right] 区间内，直到 left==right  

**如何保证区间一定缩小至1？**  
```cpp
while(left!=right){    //l==r时退出并返回l  
   if(check)left=mid; 
   else right=mid-1;
   mid=left+(right-left+1)/2;  //由于分支有left=mid,为了避免死循环，我们向上取整
}

while(left!=right){   
   if(check)right=mid; 
   else left=mid+1;
   mid=left+(right-left)/2;  //反之向下取整
}
```
### 2. 查找并返回
经典的二分查找，一般要求有序list,和第一类不同的是，**target可能不在list内**，因此，我们需要不存在target的退出机制，一般为left>right  
```cpp
while(left<=right){    //答案可能在 [l,r] ,没有找到时退出  注意此处不能写为 < ,不能让l==r直接退出
   if(check1)return mid; 
   else if(check2)right=mid-1;
   else left=mid+1;
   mid=left+(right-left+1)/2;  //此时mid向哪取整都可以，因为left和right都不会赋值为mid
}
return -1;
```

## 二维查找
搜索 m x n 矩阵 matrix 中的一个目标值 target。每行的元素从左到右升序排列。每列的元素从上到下升序排列。

注意到每次查询都能排除区域为被查询元素的左上角或右下角。如果查询元素位于区域中心，剩余区域就是不规则的；如果查询元素位于区域边缘，那么剩余区域仍是矩形。

利用这一特点，从矩阵左上角开始查询，每次查询都能排除一行或一列元素，时间复杂度为 O(n + m)

# 三分查找
适用于探索元素排列单调性变化

比较区间端点值判断单调性


- 在传递给函数之前，`nums` 在预先未知的某个下标 `k（0 <= k < nums.length）`上进行了 `向左旋转`，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 从 0 开始 计数）。例如， `[0,1,2,4,5,6,7]` 下标 `3` 上向左旋转后可能变为 `[4,5,6,7,0,1,2]` 。

- 给你 `旋转后` 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 -1 


```cpp
// 先三分查找旋转位置
int search(vector<int>& nums, int target) {
    int n = nums.size();
    int l = 0;
    int r = n - 1;
    int begin = 0;
    if (nums[l] > nums[r]) {
      // 提前退出，否则 l m1 m2 r的值会重叠
        while (l < r - 2) {
            int m1 = l + (r - l) / 3;
            int m2 = l + 2 * (r - l) / 3;
            if (nums[l] < nums[m1] && nums[m1] < nums[m2]) {
                l = m2;
            } else if (nums[l] < nums[m1] && nums[m1] > nums[m2]) {
                l = m1;
                r = m2;
            } else {
                r = m1;
            }
        }

        if (l == r - 1)
            begin = r;
        else if (l == r - 2) {
            if (nums[l] < nums[l + 1])
                begin = r;
            else
                begin = l + 1;
        }
    }

    //映射到新数组二分
    int left = 0;
    int right = n - 1;
    while (left <= right) {
        int m = (left + right) / 2;
        int mid = (begin + m) % n;
        if (nums[mid] == target)
            return mid;
        else if (nums[mid] > target)
            right = m - 1;
        else
            left = m + 1;
    }
    return -1;
}```