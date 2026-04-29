# Python 数据结构

## 1. 列表（List）

### 基本初始化
```python
# 空列表
empty_list = []
empty_list = list()

# 有初始值的列表
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4], [5, 6]]
```

### 高级初始化方法
```python
# 使用 range() 创建数字序列
nums = list(range(10))              # [0, 1, 2, ..., 9]
even_nums = list(range(0, 20, 2))   # [0, 2, 4, ..., 18]

# 列表推导式（最常用）
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
filtered = [x for x in range(10) if x % 2 == 0]  # 偶数：[0, 2, 4, 6, 8]

# 重复元素
zeros = [0] * 5                     # [0, 0, 0, 0, 0]
pattern = [1, 2] * 3                # [1, 2, 1, 2, 1, 2]

# 从字符串、元组、集合等转换
chars = list("hello")              # ['h', 'e', 'l', 'l', 'o']
tuple_to_list = list((1, 2, 3))     # [1, 2, 3]
set_to_list = list({1, 2, 3})      # 注意：集合无序，可能返回 [1, 2, 3] 或 [1, 3, 2]
```

## 2. 元组（Tuple）

### 基本初始化
```python
# 空元组
empty_tuple = ()
empty_tuple = tuple()

# 有初始值的元组
numbers = (1, 2, 3, 4, 5)           # 标准写法
numbers = 1, 2, 3, 4, 5            # 括号可省略，但不推荐
mixed = (1, "hello", 3.14, True)
nested = ((1, 2), (3, 4), (5, 6))

# 单元素元组（必须有逗号）
single = (42,)                      # 正确
single = 42,                        # 也可以
not_a_tuple = (42)                  # 错误！这是一个整数
```

### 高级初始化
```python
# 从可迭代对象转换
from_list = tuple([1, 2, 3])       # (1, 2, 3)
from_string = tuple("abc")          # ('a', 'b', 'c')
from_range = tuple(range(5))       # (0, 1, 2, 3, 4)

# 元组推导式（实际上是生成器推导式）
gen = (x**2 for x in range(5))     # 这是一个生成器，不是元组！
tuple_from_gen = tuple(x**2 for x in range(5))  # (0, 1, 4, 9, 16)
```

## 3. 集合（Set）

### 基本初始化
```python
# 空集合（注意：不能用 {}，那是空字典）
empty_set = set()

# 有初始值的集合
unique_nums = {1, 2, 3, 4, 5}
mixed_set = {1, "hello", 3.14, True}
empty_set_literal = set()           # 唯一正确方式
```

### 高级初始化
```python
# 从列表转换（自动去重）
numbers = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}
chars = set("banana")              # {'b', 'a', 'n'}

# 集合推导式
unique_squares = {x**2 for x in range(5)}  # {0, 1, 4, 9, 16}
filtered = {x for x in range(10) if x % 2 == 1}  # 奇数：{1, 3, 5, 7, 9}

# 从元组、字符串等转换
from_tuple = set((1, 2, 2, 3))     # {1, 2, 3}
from_range = set(range(5))        # {0, 1, 2, 3, 4}
```

## 4. 字典（Dict）

### 基本初始化
```python
# 空字典
empty_dict = {}
empty_dict = dict()

# 有初始值的字典
person = {"name": "Alice", "age": 25, "city": "Beijing"}
mixed_keys = {1: "one", "two": 2, 3.0: 3.0}  # 键可以是不可变类型
nested_dict = {
    "person1": {"name": "Alice", "age": 25},
    "person2": {"name": "Bob", "age": 30}
}
```

### 高级初始化
```python
# 使用 dict() 构造函数
dict1 = dict(name="Alice", age=25)  # 键必须是合法标识符字符串
dict2 = dict([("name", "Alice"), ("age", 25)])  # 可迭代键值对
dict3 = dict(zip(["name", "age"], ["Alice", 25]))  # 从两个列表组合

# 字典推导式（最强大）
squares = {x: x**2 for x in range(5)}  # {0:0, 1:1, 2:4, 3:9, 4:16}
swapped = {value: key for key, value in {"a": 1, "b": 2}.items()}  # 交换键值
filtered = {k: v for k, v in {"a":1, "b":2, "c":3}.items() if v > 1}  # {'b':2, 'c':3}

# 使用 fromkeys() 创建具有相同默认值的字典
default_vals = dict.fromkeys(["name", "age", "city"], "unknown")
# {'name': 'unknown', 'age': 'unknown', 'city': 'unknown'}
default_none = dict.fromkeys(["name", "age", "city"])
# {'name': None, 'age': None, 'city': None}
```

## 5. 特殊初始化技巧

### 5.1 列表/字典的复制
```python
# 浅复制
original_list = [[1, 2], [3, 4]]
shallow_copy = original_list.copy()  # 或 list(original_list)
shallow_copy[0][0] = 99  # 会影响 original_list[0][0]！

# 深复制
import copy
deep_copy = copy.deepcopy(original_list)
deep_copy[0][0] = 99  # 不会影响 original_list
```

### 5.2 初始化多维结构
```python
# 错误方式（所有行是同一个对象）
wrong_matrix = [[0] * 3] * 3
wrong_matrix[0][0] = 1  # 会修改所有行的第一列！

# 正确方式
matrix = [[0] * 3 for _ in range(3)]  # 创建独立的行
matrix[0][0] = 1  # 只修改第一行第一列
```

### 5.3 合并数据结构
```python
# 列表合并
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2  # [1, 2, 3, 4, 5, 6]
extended = [*list1, *list2]  # 解包操作（Python 3.5+）

# 集合运算
set1 = {1, 2, 3}
set2 = {3, 4, 5}
union = set1 | set2  # 并集: {1, 2, 3, 4, 5}
intersection = set1 & set2  # 交集: {3}
difference = set1 - set2  # 差集: {1, 2}

# 字典合并（Python 3.9+）
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}
merged = dict1 | dict2  # {'a': 1, 'b': 3, 'c': 4}，dict2的值覆盖dict1
```

## 6. 性能考虑
```python
# 创建大列表时，推荐使用推导式而不是append
# 慢
result = []
for i in range(1000000):
    result.append(i**2)

# 快
result = [i**2 for i in range(1000000)]

# 创建大字典时同理
# 慢
result = {}
for i in range(1000000):
    result[i] = i**2

# 快
result = {i: i**2 for i in range(1000000)}
```

**总结**：Python 提供了灵活多样的初始化方式，选择合适的初始化方法可以使代码更简洁、高效。核心原则是：
1. 简单初始化用字面量语法
2. 复杂初始化用推导式
3. 类型转换用构造函数
4. 注意可变对象的引用问题