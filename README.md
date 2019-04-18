### Auto-Deploy-CDN

### ⛰️背景

#### 常规流程

方式一：前端开发完后通过Git将最新的代码更新到远程仓库中，后端git pull下来后，执行build操作，然后将静态资源部署到CDN上，部署到CDN上的资源可能需要进行刷新才能生效，最后将除去静态资源的文件部署到应用服务器上。

方式二：前端直接在本地进行build，将build后的东西打包发给后端，让其进行部署到CDN、发布应用的操作。

#### 痛点及为什么要这么做

首先，build之后的操作是后端负责，后端一般会写一些shell脚本来自动化执行，但是每个项目都写一个shell脚本不符合DRY原则。

其次，打包后的资源引用位置是由前端决定的（webpack里的publicPath），所以我们部署CDN的操作完全可以让我们来做，一旦我们build并上传资源到CDN后，打开index.html就可以做【预测试】（上线测试服前的测试）。

最后，后端的职责在整个部署发布链路中被简化了，我们只要提供一个包含index.html和其他非静态资源给后端就可以了，后端拿到这些资源部署到应用 服务器。

最最最后，静态资源应该使用contentHash或者chunkHash，当我们迭代时，用户不需要再重新下载所有的js或css文件，而是增量下载，更好的利用了缓存。

### 🏠项目结构

```md
|── README.md
├── index.js // 包出口
├── utils // 工具函数
├── templates // 模版
├── operations // 操作集
├── node_modules // 依赖
```

#### Operations

Operations目前提供了git、svn、刷新CDN的操作集，可以将operation理解为**积木**。

##### Git

**Operations.gitAdd()** ————>【git add .】

**Operations.gitcommit(*commitMessage*)**————>【git commit -m ${commitMessage}】

**Operations.gitPush(*branch*)**————>【git push -u origin ${branch}】

**Operations.gitOps(*branch*, *commitMessage*)** ————>上述opeation的整合

##### Svn

**Operations.svnCoResource(*remote*, *tempDir*)**————> 在tempDir下执行svn checkout remote

**Operations.svnAddOrUpdate(*project*, *tempDir*)**————> 在tempDir下执行svn add or svn update，project是仓库的名称

**Operations.svnCommit(*project*, *commitMessage*, *tempDir*)** ————> 在tempDir下执行svn commit -m ${commitMessage}

**Operations.svnUpdateRemote(*project*, *commitMessage*, *tempDir*) **————> svnAddOrUpdate 与 svnCommit的整合

##### refreshCDN

**Operations.refreshCDN({ *svnDir* = '', *commitMessage* = '', *refreshHost* = '', *refreshPath* = '' })**————> 刷新CDN，svnDir指需要刷新的svn二级目录如ke，commitMessage为本次刷新填写的信息，*refreshHost*和refreshPath组合后就是执行刷新时的请求的url。

#### Templates

Templates是用各种operation组装完成的流程，例如自动化部署CDN资源，可以将templates理解为**用积木搭好的建筑物**

##### deploy_css_js

```javascript
/**
 *
 * @param svnRemote  svn远程仓库地址
 * @param svnProjectName svn远程仓库名字
 * @param refreshHost 刷新CDN的域名
 * @param refreshPath 刷新CDN的路径
 * @param svnDir svn二级目录
 * @param autoGit 是否自动执行Git更新操作
 * @param autoRefresh 是否自动触发CDN生效操作
 * @param buildDir 打包后的构建目录
 * @param assetsDir 静态资源目录,若未指明则为buildDir
 * @param distDir 除去静态资源的资源存放的目录
 * @param includes 需要部署到CDN的资源类型，默认['css', 'js']
 */
function deploy_css_js({
    svnRemote,
    svnProjectName,
    autoGit = true,
    autoRefresh = true,
    includes = ['css', 'js'],
    buildDir = 'build',
    distDir = 'dist',
    assetsDir = buildDir,
    refreshHost,
    refreshPath,
    svnDir
  }) {/**/}
```

##### deploy_images

```javascript
/**
 * 
 * @param {sourcePath} 集中化管理images的js文件地址
 * @param {uploadOptions} 上传图片的配置，参见node http.reqeust(options)
 * @param {successCode} 表示上传成功的HTTP状态码，例如302、200
 */
function deploy_images({sourcePath, uploadOptions, successCode}){/**/}
```

#### 思路

Operation + Template的模式：开发者可以通过提供的Operations组装自定义的template，也可以使用仓库提供的Templates（template契合需求时）。所以这个项目的核心是Operations，而不只是对外输出的templates（当然，templates很重要

### ✨Templates示例

#### Deploy_CSS_JS

**webpack build完成后就触发这个过程，通过npm script hooks完成**

1. 在项目根目录下新建一个temp目录，作为后续操作的工作目录。
2. 在temp目录下拉取SVN上已存在的静态资源。（例如：temp/test）
3. 将build目录下中的静态资源移动到temp/test目录下。
4. 在temp/test目录下执行SVN更新的操作，这个时候完成了静态资源的部署。
5. 如果新部署的资源需要刷新后才能生效，那么执行刷新操作（这个过程存在差异性，可以覆写refreshCDN.js）【可选】
6. 删除temp目录，将build目录下剩余的文件移入dist目录并删除build目录
7. 这个时候执行Git操作，更新到远程仓库【可选】
8. 后端人员git pull，获取到dist目录，将其部署到服务器，大功告成！【后端操作】

#### Deploy-Images（暂不使用）

**webpack build开始前触发这个过程，通过npm script hooks完成**

1. **项目中对图片的引用需要中心化管理到一个js文件中**，例如images.js（里面包含了所有页面/组件引用的图片地址）
2. 进行build前，导出所有变量，对这些变量进行判断：如果是本地地址，则上传该图片到CDN后并用url替换
3. 执行webpack build

**ps: 由于Node使用的为CommonJS，而在这里Node需要获取通过ES6module导出的变量，所以务必启用experimental-modules，启用方式见使用方法 **

### 📦 安装 

#### npm

```bash
npm i auto-deploy2cdn --save-dev
```

#### yarn

```bash
yarn add auto-deploy2cdn --save-dev
```

### 🔨使用方法

#### Deploy-CSS-JS（用于部署静态资源，例如CSS、JS）

##### 1. 编写一个deploy.js

```javascript
const { templates } = require('auto-deploy2cdn')
templates.deploy_css_js({
  svnDir: 'ke',
  svnProjectName: 'yoj',
  svnRemote: 'https://xxx.yyy.com/svn/ydstatic/ke/yoj/',
  autoGit: false,
  autoRefresh: true,
  distDir: 'v-1.2',
  buildDir: 'build',
  assetsDir: 'build/assets',
  includes: ['css', 'js'],
  refreshHost: 'xxx.yyy.com',
  refreshPath: '/IT/updateshared/',
})
```

##### 2. 利用npm scripts hooks 触发

```json
  "scripts": {
    "start": "node scripts/start.js",
    "postbuild": "node scripts/deploy.js", // build完成后触发
    "build": "node scripts/build.js",
  }
```

#### Deploy-Images

##### 1. 编写一个upload.js

```js
const { templates } = require('auto-deploy2cdn')
templates.deploy_images({
  uploadOptions: {
    host: 'xxx.ydstatic.com',
    path: '/upload?method=uploadImage&product=xue&tourl=',
    method: 'POST'
  },
  sourcePath: 'test/constants/images.js',
  successCode: 302
})
```

##### 2. 利用npm scripts hooks 触发

```json
 "scripts": {
    "start": "node scripts/start.js",
    "prebuild": "node --experimental-modules scripts/upload.js", // build开始前触发，⚠️ ES6module
    "postbuild": "node scripts/deploy.js", 
    "build": "node scripts/build.js",
  }
```
#### Custom-Templates

##### 1.编写一个custom_template

```javascript
const { operations } = require('auto-deploy2cdn')
function custom_template() {
  operations.gitAdd()
	operations.gitCommit()
	operations.gitPush()
}
```

##### 2. 在合适的场景下触发，例如npm scripts