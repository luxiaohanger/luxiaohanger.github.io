# 一些函数
## swap
在 C++ 中，交换容器内的元素可以使用以下几种方式，具体取决于需求和容器类型：

---

### **自定义交换逻辑（适用于复杂对象）**
如果容器存储的是自定义类型，可以定义 `swap` 方法以提高效率：
```cpp
#include <vector>

class MyClass {
public:
    int* data;
    size_t size;

    // 自定义 swap 以提高效率
    friend void swap(MyClass& a, MyClass& b) noexcept {
        std::swap(a.data, b.data);
        std::swap(a.size, b.size);
    }
};

int main() {
    std::vector<MyClass> vec(10);
    swap(vec[0], vec[1]); // 调用自定义 swap
}
```

---

## **总结**
| 需求 | 推荐方式 | 适用容器 | 时间复杂度 |
|------|----------|----------|------------|
| **交换两个元素** | `swap(vec[i], vec[j])` | `vector`, `array`, `deque` | O(1) |
| **交换迭代器指向的元素** | `iter_swap(it1, it2)` | `list`, `forward_list` | O(1) |
| **交换两个区间** | `swap_ranges(begin1, end1, begin2)` | `vector`, `array`, `deque` | O(n) |
| **交换整个容器** | `vec1.swap(vec2)` | 所有 STL 容器 | O(1) |
| **高效交换大型对象** | `swap` + 移动语义 | 所有容器 | O(1) |
| **自定义类型交换** | 定义 `friend void swap(T& a, T& b)` | 自定义类 | 取决于实现 |

