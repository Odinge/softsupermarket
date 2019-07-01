// vue全局配置
import Vue from "vue";
import axios from "axios";
import store from "../store";
import { $roles } from "../utils/auth";

Vue.prototype.$http = axios;
Vue.prototype.$baseUrl = "http://www.ghjhhyuyuy.xin:8080";
// 注册一个全局权限判定方法
Vue.prototype.ROLES = ["admin", "developer", "demander"];
Vue.prototype.$roles = $roles;

Vue.prototype.getMsgNum = async function() {
  try {
    const msgNum = await this.$store.dispatch("initMsgNum");
    return msgNum;
  } catch (err) {
    console.error(err);
  }
};

Vue.prototype.tags = [
  { text: "未审核", value: "1" },
  { text: "已审核", value: "2" },
  { text: "不通过", value: "3" }
];

(Vue.prototype.filterTag = (value, row) => {
  return row.state === value;
}),
  // 注册过滤器
  Vue.filter("filterState", value => {
    const stateMap = [
      "未提交",
      "未审核",
      "已审核",
      "不通过",
      "黑名单",
      "已作废",
      "已删除"
    ];
    return stateMap[value];
  });
Vue.filter("filterStateSub", value => {
  const stateMap = [
    "未提交",
    "未审核",
    "已审核",
    "不通过",
    "黑名单",
    "已作废",
    "未提交"
  ];
  return stateMap[value];
});

Vue.filter("filterStateTxt", value => {
  const stateMap = new Map([
    ["未提交", "未提交"],
    ["未审核", "未审核"],
    ["已审核", "已审核"],
    ["条件不满足", "不通过"],
    ["黑名单", "黑名单"],
    ["已作废", "已作废"],
    ["已删除", "未提交"]
  ]);
  return stateMap.get(value);
});

// 注册字段过滤器
Vue.filter("filterField", value => {
  const fieldMap = new Map([
    ["projectName", "项目名"],
    ["projectTime", "项目时间"],
    ["projectPrice", "项目资金"],
    ["projectDescribe", "项目描述"],
    ["projectRequirement", "项目需求"]
  ]);
  return fieldMap.get(value);
});

// 注册团队方向过滤器
Vue.filter("filterTeamDirection", value => {
  if (!value) return "";
  const td = store.getters.teamDirection;
  return td[value - 1].directionName;
});

Vue.prototype.stateColor = state => {
  const color = ["", "danger", "success", "warning", "info"];
  return color[state];
};

Vue.prototype.stateColorTxt = state => {
  const stateMap = new Map([
    ["未提交", ""],
    ["未审核", "danger"],
    ["已审核", "success"],
    ["条件不满足", "warning"],
    ["黑名单", "info"]
  ]);
  return stateMap.get(state);
  // const color = ["", "danger", "success", "warning", "info"];
  // return color[state];
};

Vue.prototype.permission = (...roles) => {
  const role = store.getters.role;
  return roles.includes(role);
};
Vue.prototype.$permission = (...roles) => {
  return new Promise((resolve, reject) => {
    const role = store.getters.role;
    if (roles.includes(role)) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};
// 注册一个全局自定义指令 `v-permission`
Vue.directive("permission", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(node, { value }, vnode) {
    // 聚焦元素
    // console.log(node, vnode.elm);
    const role = store.getters.role;
    if (role !== value) {
      node.parentNode.removeChild(node);
    }
  }
});

// 超出隐藏。。。
Vue.directive("overflow-e", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(node, { value }, vnode) {
    node.title = value;
    node.classList.add("overflow-e");
  }
});
// 直接执行命令
Vue.directive("exec", (node, { value }) => {});

import {
  getProjectByProgressLimit,
  getProjectByProgress
} from "../api/project";
// 进度函数
Vue.prototype.progressFun = function(progress) {
  const funMap = {};
  funMap[this.$roles.root] = funMap[
    this.$roles.admin
  ] = getProjectByProgress.bind(this);

  funMap[this.$roles.demander] = funMap[
    this.$roles.team
  ] = getProjectByProgressLimit.bind(this, this.$store.state.username);

  const role = this.$store.state.role;

  return funMap[role](progress);
};
