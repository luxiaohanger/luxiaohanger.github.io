# share_memory
## union
union的所有成员共享同一块内存空间，其大小以最大成员的大小为准。这意味着同时只能有一个成员包含有效值。

```cpp
union Data {
    int i;
    float f;
    char c;
};


union Data data;
data.i = 42;
cout << data.i; // 输出 42
data.f = 3.14;
cout << data.i; // 值无意义（内存被覆盖）
```
`使用 variant 代替 union`

## variant
std::variant是 C++17 引入的类型安全的联合体，定义在 <variant>头文件中。它可以在编译时确定的类型集合中存储一个值，并提供类型安全的访问机制。