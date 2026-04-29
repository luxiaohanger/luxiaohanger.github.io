在 Python 的世界里，**模块 (Module)** 就是一份存放代码的 **`.py` 文件**。



## 模块的导入语法

Python 提供了几种不同的方式来“搬运”模块里的内容：

### A. 搬运整个仓库 (`import`)
这种方式最安全，因为它保留了模块的名字作为前缀。
```python
import math

print(math.sqrt(16)) # 必须带上 math. 前缀
```

### B. 搬运特定零件 (`from ... import ...`)
如果你只需要模块里的某一个函数，可以用这种方式。
```python
from math import sqrt

print(sqrt(16)) # 直接使用，不需要前缀
```

### C. 给模块起外号 (`import ... as ...`)
有些模块名字太长（比如 `pandas`），大家习惯给它起个简短的别名。
```python
import numpy as np

arr = np.array([1, 2, 3])
```

