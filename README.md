# softsupermarket

> 软件超市 --- 一个发布任务管理任务的平台

## 项目安装

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 软件超市项目后台管理开发流程

## 一. 构建项目框架

- 安装 vue

  ```bash
  npm install vue
  ```

- 安装全局 vue-cli 脚手架,用于帮助搭建所需的模板框架

  ```bash
  npm install vue-cli -g
  ```

- 搭建基于 webpack 的 vue 项目

  ```bash
  vue init webpack softsupermarket
  ```

- 安装项目依赖

  ```bash
  npm install
  ```

- 安装项目必须包

  ```bash
  npm install vuex axios mock --save
  ```

## 二. 目录结构

```shell
├── build                     	// webpack构建相关  
├── config                    	// 项目主要配置
├── src                       	// 源代码
│   ├── api                   	// 所有请求
│   ├── assets                 	// 主题 字体等静态资源
│   ├── components             	// 全局公用组件
|		├── header               	// 头部组件
│   	└── sidebar         		// 侧边栏组件
│   ├── directive              	// 全局指令
│   ├── filtres                	// 全局 filter
│   ├── icons                  	// 项目所有 svg icons
│   ├── mock                   	// 项目mock 模拟数据
│   ├── router                 	// 路由
│   ├── store                  	// 全局 store管理
|		├── type.js             	// 功能常量
|		├── action.js               // 执行命令
|		├── index.js               	// vuex-store
|		├── mutations.js
|		├── state.js               	// vuex-状态
|		├── getters.js               // 获取状态方法
│   	└── permission.js          	// 权限管理
│   ├── styles                 	// 全局样式
│   ├── views                  	// 页面组件、
|		├── login             		// 登录组件
|		├── message               	// 消息组件
|		├── pages               	// 错误页面
|		├── projectManage			// 项目管理组件
|			├── ProjectAdmin.vue            		// 项目管理-管理员
|			├── ProjectDeveloper.vue               	// 项目管理-开发团队
│   		└── ProjectDemander.vue         		// 项目管理-需求方
|		├── teamManage               // 团队管理组件
|			├── TeamAdmin.vue            			// 团队管理-管理员
|			├── TeamDeveloper.vue               	// 团队管理-开发团队
│   		└── TeamtDemander.vue         			// 团队管理-需求方
|		├── publish               	// 项目发布组件
│   	└── Manage.vue         			// 页面管理组件
│   ├── App.vue                	// 入口页面
│   ├── main.js                	// 入口 加载组件 初始化等
├── static                     	// 第三方不打包资源
│   └── css                	   	// 公用css样式文件
|		└── reset.css
├── .babelrc                  	// babel-loader 配置
├── .editorconfig               // 通过编辑器的编码/风格进行一定的配置
├── .gitignore                 	// git版本管理忽略配置
├── .postcssrc.js
├── index.html                 	// 默认的主渲染页面文件
├── package-lock.json
├── package.json               	// 应用包配置文件
└── README.md                  	// 应用描述说明的readme文件
```

## 三. 编写页面

### 1. 样式重置

- 存放目录： static/css/reset.css

- 作用：清除浏览器默认样式

- 引入方式：在入口 js 文件**main.js**中引入

  ```js
  import "../static/css/reset.css";
  ```

### 2. 后台路由

#### 分析

- 第一页面 -- 登录页面
- 第二页面 -- 内容页面分为两部分： 第一部分顶端用户信息，第二部分左边导航，右边显示具体内容
  - 用户有三种类型： 开发团队、管理员、需求方

#### 导航

- 开发团队（developer）
  - 团队管理
  - 项目管理
  - 消息通知
- 管理员（admin）
  - 团队管理
  - 项目管理
  - 消息通知
- 需求方（demander）
  - 发布项目
  - 项目管理
  - 消息通知

#### 实施

- 建立理由表：采用两级路由，上级路由定向到下级路由，Manger.vue -- Layout 为容器

  - constantRouterMap -- 默认路由，存储不需要权限就可以访问的路由，登录路由，首页路由等

    > 首先登录页面，登录成功跳转到首页，根据登录用户的权限生成可访问的路由表，访问网页

    ```js
    const Layout = () => import("../views/Manage");
    export const constantRouterMap = [
      { path: "/login", component: Login },
      {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        name: "首页",
        children: [{ path: "dashboard" }]
      }
    ];
    ```

  - asyncRouterMap -- 权限路由，根据登录的用户访问后台获取权限生成对应的路由表

    ```js
    export const asyncRouterMap = [
      //    ...
      {
        path: "/publish", // 发布项目
        name: "publish",
        redirect: "/publish/index", // 定向到子项
        meta: {
          roles: ["demander"], // 访问页面所需要的权限
          title: "发布项目", // 页面标题
          icon: "fabu" // 页面图标
        },
        component: Layout, // 首页组件
        children: [
          {
            path: "index",
            component: () => import("../views/publish/Publish")
          }
        ]
      }
      // ...
    ];
    ```

- 拦截路由

  - 白名单 whiteList，存储不需要权限的路由

  - 使用路由钩子函数 `beforeEach` 拦截路由

    - 判断是否在本地存储登录所获取的 token 和是否已经登录了本获取了 token，如有则存在管理页面中

      ```js
      let token = sessionStorage.getItem("token");
      if (token && !store.getters.token) {
        store.dispatch("setToken", token);
      }
      ```

    - 判断 vuex-state-token 是否记录了 token 以此来确定是否登录，访问那个页面。

      ```js
      if (store.getters.token) {
        // 判断是否有token
        // 如果登录了，要转到登录页面，全部转到首页，作用防止 页面刷新到登录页，后退到登录页
        if (to.path === "/login") {
          next({ path: "/" });
        } else {
          // 如果不转到登录页面
          // 判断当前用户是否已拉取完user_info信息
          if (store.getters.roles.length === 0) {
            store
              .dispatch("GetUserInfor")
              .then(res => {
                // 拉取用户信息
                const role = res.role; // 获取用户权限信息
                store.dispatch("GenerateRoutes", { role }).then(data => {
                  // 生成可访问的路由表
                  router.addRoutes(data); // 动态添加可访问路由表
                  next({ ...to, replace: true });
                });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
            next();
          }
        }
      } else {
        // 如果没登录统统跳的登录页面
      }
      ```

### 3. vuex 状态管理

#### state

- `roles` -- 用户权限信息
- `token` -- 用户登录令牌
- `permission` -- 权限状态
  - `routers` -- 页面的全部路由
  - `addRouters` -- 根据用户权限动态生成的路由

#### action

- `ToLogin` -- 用户登录
- `GetUserInfor` -- 获取用户数据
- `setToken` -- 存储用户登录 token
- `clearState` -- 清除登录状态
- `GenerateRoutes` -- 根据权限生成路由表

#### getters

- `token` -- 读取用户 token
- `roles` -- 读取用户权限
- `addRoutes` --读取生成的权限路由表

#### mutations

- `SET_TOKEN` -- 设置用户登录 token
- `SET_ROLES` -- 设置权限
- `CLEAR_STATE` -- 清空状态
- `SET_ROUTERS` --设置路由表，添加路由

### 4. 根据 vuex-addRouters 生成侧边栏

```js
// Sliderbar.vue
routers() {
    return this.$store.getters.addRouter.filter(r => r.meta);
}
```
