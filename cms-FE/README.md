# vue-cms-note

vue cms note 是一个基于 vue 的后台管理开发脚手架。

## 本地开发及打包部署

首先，在项目根目录打开命令行工具，安装相关开发依赖包（如果已安装，忽略该步骤）：

```shell
npm install
```

注： `npm install` 可能会出现安装速度过慢的问题，可考虑使用国内镜像 [cnpm](https://npm.taobao.org/) 进行安装。

待依赖包安装完成。可通过以下命令启动本地开发服务或者发布：

本地开发，浏览器会自动打开相关界面（若未打开，需手动在浏览器里输入 `http://localhost:9529`）：

```bash
npm run serve
```

开发环境打包：

```bash
npm run build:dev
```

测试环境打包：

```bash
npm run build:test
```

生产环境打包：

```bash
npm run build:prod
```

打包完成后，会在根目录新生成 `dist`（打包目录名根据项目配置规则而定）文件夹，即为发布上线的内容。

## 页面

- 登录： /login
- 注册： /register
- 主页：/dashboard
- 列表：/note/list

## 其他

这套 cms 是基于 vuejs 开发的，采用了 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) ui 框架，它提供了搭建后台管理必要的内容。
