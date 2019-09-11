/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-06 20:12:47
 * @LastEditors: Please set LastEditors
 */
// 入口文件
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
// 重置css文件
import "../static/css/reset.css";

// 图标文件
import "./assets/iconfont/iconfont.css";
import "./assets/iconfont1/iconfont.css";
// 引入UI组件
import ElementUI from "element-ui";
import { Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// vue全局属性方法
import "./global";
import { delRole } from "./utils/auth";

// import "../static/tinymce/tinymce.min.js";

import qs from "qs";
Vue.prototype.qs = qs;

// 注册UI插件
Vue.use(ElementUI);

// 创建白名单
const whiteList = ["/login", "/"];

// 路由钩子函数，拦截路由更新路由
router.beforeEach((to, from, next) => {
  // 从本地存储中取得数据，本地存储中存的数据是字符串类型的，需要转换成json
  // 当本地存储中没有数据时返回null ，保证数据使用默认值
  let token = sessionStorage.getItem("token");
  // if (token && !store.getters.token) {
  //   store.dispatch("setToken", token);
  // }

  if (token) {
    // 判断是否有token
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (!store.getters.role) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch("getUserInfor")
          .then(role => {
            store
              .dispatch("GenerateRoutes", { role })
              .then(data => {
                // 生成可访问的路由表
                router.addRoutes(data); // 动态添加可访问路由表
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record

                next({ ...to, replace: true });
              })
              .catch(err => {});
          })
          .catch(err => {
            delRole();
            store
              .dispatch("Logout")
              .then(() => {
                //登录成功之后重定向到登录页
                next("/login");
              })
              .catch(err => {});
          });
      } else {
        //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        next();
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next("/login"); // 否则全部重定向到登录页
    }
  }
});

new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store
  // components: { App },
  // template: '<App/>',
});
