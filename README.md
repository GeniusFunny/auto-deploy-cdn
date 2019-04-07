### Auto-Deploy-CDN

#### 自动化部署资源到CDN（CSS/JS走SVN的情况）

**webpack build完成时，触发这个过程**

- [x] 首先新建一个临时文件夹 temp
- [x] 将资源svn checkout到临时文件夹
- [x] 将build文件夹里的静态资源移到临时文件夹
- [x] 在临时文件夹下执行svn更新/新增/提交等操作
- [ ] 完成svn更新和提交后，轮询触发刷新CDN的操作，直到新资源生效(有必要吗)
- [x] 清除临时文件夹
- [x] 将build内剩余文件移入dist目录
- [x] 删除build文件夹
- [x] 触发git操作，更新远程仓库
- [x] 完成自动化部署资源到CDN

#### 自动化上传图片到CDN

**webpack build开始前，触发这个过程**

- [ ] 项目首先将图片地址集中管理，一个单独的js文件
- [ ] 进行build前，读取这个文件，对文件中所有url进行检测，如果为CDN地址忽略，直接写入新文件；如果是本地地址，进行文件上传的操作，然后将得到的CDN地址写入新文件
- [ ] 用新文件替换旧文件

#### 集成方案

- [ ] npm script hooks
- [ ] webpack plugin hooks

