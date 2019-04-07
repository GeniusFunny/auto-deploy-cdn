### Auto-Deploy-CDN

#### 自动化部署资源到CDN

**webpack build完成时，触发这个过程**

- [x] 新建临时目录
- [x] 拉取SVN远程资源到临时目录
- [x] 将build文件夹里的静态资源移到临时目录
- [x] 更新SVN远程资源
- [x] 自动化部署资源到CDN完成
- [x] 删除临时目录，将build内剩余文件移入dist目录，删除build文件夹
- [x] 触发git操作，更新远程仓库(可选)

#### 自动化上传图片到CDN

**webpack build开始前，触发这个过程**

- [ ] 项目首先将图片地址集中管理，一个单独的js文件
- [ ] 进行build前，读取这个文件，对文件中所有url进行检测，如果为CDN地址忽略，直接写入新文件；如果是本地地址，进行文件上传的操作，然后将得到的CDN地址写入新文件
- [ ] 用新文件替换旧文件

#### 集成方案

- [ ] npm script hooks
- [ ] webpack plugin hooks

