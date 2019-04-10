### Auto-Deploy-CDN

### ⛰️背景

#### 常规流程

1. 前端开发完后通过Git将最新的代码更新到远程仓库中，后端git pull下来后，执行build操作，然后将静态资源部署到CDN上，部署到CDN上的资源可能需要进行刷新才能生效，最后将除去静态资源的文件部署到应用服务器上。
2. 前端直接在本地进行build，将build后的东西打包发给后端，让其进行部署到CDN、发布应用的操作。

#### 痛点及为什么要这么做

首先，build之后的操作是后端负责，后端一般会写一些shell脚本来自动化执行，但是每个项目都写一个shell脚本不符合DRY原则。

其次，打包后的资源引用位置是由前端决定的（webpack里的publicPath），所以我们部署CDN的操作完全可以让我们来做，一旦我们build并上传资源到CDN后，打开index.html就可以做【预测试】（上线测试服前的测试）。

最后，后端的职责在整个链路中被简化了，我们只要提供一个包含index.html和其他非静态资源给后端就OK了，后端负责部署就完事。

最最最后，静态资源应该使用contentHash或者chunkHash，当我们迭代时，用户不需要再重新下载所有的js或css文件，而是增量下载，更好的利用了缓存。

### ✨流程

#### Deploy-CSS-JS

**webpack build完成后就触发这个过程，通过npm script hooks完成**

1. 在项目根目录下新建一个temp目录，作为后续操作的工作目录。
2. 在temp目录下拉取SVN上已存在的静态资源。（例如：temp/test）
3. 将build目录下中的静态资源移动到temp/test目录下。
4. 在temp/test目录下执行SVN更新的操作，这个时候完成了静态资源的部署。
5. 如果新部署的资源需要刷新后才能生效，那么执行刷新操作（这个过程存在差异性，可以覆写refreshCDN.js）【可选】
6. 删除temp目录，将build目录下剩余的文件移入dist目录并删除build目录
7. 这个时候执行Git操作，更新到远程仓库【可选】
8. 后端人员git pull，获取到dist目录，将其部署到服务器，大功告成！【后端操作】

#### Deploy-Images

**webpack build开始前触发这个过程，通过npm script hooks完成**

1. 项目中对图片的引用需要中心化管理到一个js文件中，例如images.js（里面包含了所有页面/组件引用的图片地址）
2. 进行build前，导出所有变量，对这些变量进行判断：如果是本地地址，则上传该图片到CDN后并用url替换
3. 执行webpack build

### 📦 安装 

#### npm

```bash
npm i auto-deploy2cdn
```

#### yarn

```bash
yarn add auto-deploy2cdn
```

### 🔨使用方法

#### Deploy-CSS/JS（用于部署静态资源，例如CSS、JS）

##### 1. 编写一个deploy.js

```javascript
const { deployAssets } = require('auto-deploy2cdn')
deployAssets({
  svnDir: 'work',	// svn的二级目录
  svnProjectName: 'test', // 项目的名称
  svnRemote: 'https://yh.geniusfunny.com/svn/xxstatic/work/test/', // svn仓库的远程地址
  autoGit: false, // 是否自动Git同步到远程仓库
  autoRefresh: true, // 如果CDN部署后需要刷新，请设置为true，这会自动刷新CDN
  distDir: 'dist', // 剔除静态资源后，用于后端部署应用的文件目录
  buildDir: 'build', // 构建工具打包后的build目录，如在根目录下的build，则buildDir为'build'
  assetsDir: 'build/assets', // 静态资源位置，如'build/assets'
  includes: ['css', 'js'], // 如果未制定assetsDir，则默认在buildDir中进行exclude操作，非includes包含的文件类型的文件将不会被上传到CDN
  refreshHost: 'yh.geniusfunny.com', // 触发CDN刷新的地址的域名
  refreshPath: '/IT/updateshared/' // 触发CDN刷新的地址的路径
})
```

##### 2. 利用npm scripts hooks 触发

```json
  "scripts": {
    "start": "node scripts/start.js",
    "postbuild": "node scripts/deploy.js", // build完成后触发
    "build": "node scripts/build.js",
  },
```

#### Deploy-Images

##### 1. 编写一个upload.js

```js

```

##### 2. 利用npm scripts hooks 触发

```json
 "scripts": {
    "start": "node scripts/start.js",
    "prebuild": "node scripts/upload.js", // build开始前触发
    "postbuild": "node scripts/deploy.js", 
    "build": "node scripts/build.js",
  },
```