### 常用指令及其缩写
touch/cat/more 创建/在终端中查看文件，cat命令的全称concatenate，意为“连接”。more翻页查看：空格翻页，q退出

which 查找命令存放文件

find 起始路径 -name "文件名"（支持通配符）
find 起始路径 -size +/-文件大小k/M/G （查找某大小上下的文件）
#### 通配符 *
通配符 * 模糊匹配：`test*` 以test开头 ；`*test` 以test结尾；`*test*` 包含test
#### 管道符 |
将左边的结果作为右边的输入
#### ls list
- -l --format=long​ 或 --long
- -a --all
- -h --human-readable
#### cd change directory
- . 当前目录
- .. 上级目录 ../.. 上两级目录
- ~ home目录（/home/yourname）
#### pwd print work directory
#### mkdir make directory
- -p --parents
#### cp copy
- -r 复制文件夹
#### mv move
#### rm remove
- -r 删除文件夹
- -f force强制删除
支持通配符 * 模糊匹配
#### su - root
进入超级管理员root用户
注意exit退出
#### grep
查找带有目标关键字的行
grep [-n] 关键字 文件路径（可以是管道输入端口）
-n ：显示行号
#### wc
统计文件内容
wc [-c -m -w -l] 文件（可以是管道输入端口）
-c : bytes
-m ：字符
-l ：行数
-w : 单词数
### shortcut
ctrl + L 清屏terminal
ctrl + C 停止输出