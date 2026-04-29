# Git 常用指令速查表

## 配置与初始化
1.设置全局用户名和邮箱  
git config --global user.name "Your Name"  
git config --global user.email "your.email@example.com"

2.初始化新仓库  
git init

3.克隆现有仓库  
git clone <repository-url>


## 基本工作流程

1.查看仓库状态  
git status

2.添加文件到暂存区  
git add <filename>    # 添加特定文件  
git add .            # 添加所有更改

3.提交更改  
git commit -m "Commit message"

4.推送更改到远程  
git push origin <branch-name>


## 分支管理
1.查看分支  
git branch           # 本地分支  
git branch -r        # 远程分支  
git branch -a        # 所有分支

2.创建和切换分支  
git branch <new-branch>  
git checkout <branch-name>  
git checkout -b <new-branch>  # 创建并切换

3.合并分支  
git merge <branch-name>

4.删除分支  
git branch -d <branch-name>


## 远程仓库操作
1.查看远程仓库  
git remote -v

2.添加远程仓库  
git remote add name <url>

3.从远程获取更新  
git fetch origin  
git pull origin <branch-name>

4.修改仓库  
git remote rename oldname newname  
git remote set-url name <url>


## 查看与比较
1.查看提交历史  
git log  
git log --oneline --graph --all  # 紧凑视图

2.比较更改  
git diff              # 工作区与暂存区  
git diff --staged     # 暂存区与最后一次提交


## 撤销操作
1.撤销工作区修改  
git restore <file>

2.撤销暂存区修改  
git restore --staged <file>

3.修改最后一次提交  
git commit --amend


## 标签管理

1.创建标签  
git tag <tag-name>  
git tag -a <tag-name> -m "Message"

2.推送标签  
git push origin <tag-name>  
git push origin --tags


## 实用技巧
1.暂存当前修改  
git stash  
git stash pop

2.检查特定文件的修改历史  
git blame <file>

3.优化仓库空间  
git gc


## 配置别名（可选）
git config --global alias.co checkout  
git config --global alias.br branch  
git config --global alias.ci commit  
git config --global alias.st status


*提示：将 `< >` 中的内容替换为实际的值*  
*使用 `--global` 标志设置的配置适用于系统上的所有仓库*

## 其他
1.git bash 要在有.git文件的根目录右键使用


## 添加.gitignore后
git rm -rf --cached .
