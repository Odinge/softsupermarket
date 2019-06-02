// 路由模块
import Vue from "vue";
import Router from "vue-router";
import { $roles } from "../utils/auth";
// 导入组件
import Login from "../views/login/Login";
// 布局
const Layout = () => import("../views/Manage");

// 挂载全局组件
Vue.use(Router);

// 默认路由
export const constantRouterMap = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    name: "首页",
    children: [{ path: "dashboard", redirect: "/message" }]
  }
];

//异步挂载的路由
//动态需要根据权限加载的路由表

// 团队管理
const team = {
  path: {
    path: "/teamManage",
    name: "teamManage",
    component: Layout
  },
  meta: {
    title: "团队管理",
    icon: "tuandui"
  },
  detail: [
    {
      path: "detail/:id",
      name: "teamDetail",
      component: () => import("../views/teamManage/adminDetail")
    }
  ]
};

// 项目管理
const project = {
  path: {
    path: "/projectManage",
    name: "projectManage",
    component: Layout
  },
  meta: {
    title: "项目管理",
    icon: "xiangmu"
  },
  detail: [
    // { path: 'detail/:id', name: 'projectDetail', component: () => import('../views/projectManage/ProjectDetail'), },
    {
      path: "progress/:id",
      name: "projectProgress",
      component: () => import("../views/projectManage/ProjectProgress"),
      props: true
    }
  ],
  check: [
    {
      path: "check",
      name: "projectCheck",
      component: () => import("../views/projectManage/components/ProjectCheck")
    },
    {
      path: "run",
      name: "projectRun",
      component: () => import("../views/projectManage/components/ProjectRun")
    },
    {
      path: "finish",
      name: "projectFinish",
      component: () => import("../views/projectManage/components/ProjectFinish")
    }
  ],
  undertake: {
    path: "undertake",
    name: "projectUndertake",
    component: () => import("../views/projectManage/components/ProjectCheck"),
    props: { state: 1 }
  }
};
// 管理员项目管理路由
const adminProjectManage = [
  {
    path: "examine",
    name: "projectExamine",
    redirect: "/projectManage/examine/publish",
    component: () =>
      import("../views/projectManage/projectExamine/ProjectExamine"),
    children: [
      {
        path: "publish",
        name: "publishExamine",
        component: () =>
          import("../views/projectManage/projectExamine/PublishExamine")
      },
      {
        path: "undertake",
        name: "undertakeExamine",
        component: () =>
          import("../views/projectManage/projectExamine/UndertakeExamine")
      },
      {
        path: "delay",
        name: "delayExamine",
        component: () =>
          import("../views/projectManage/projectExamine/DelayExamine")
      },
      {
        path: "alter",
        name: "alterExamine",
        component: () =>
          import("../views/projectManage/projectExamine/AlterExamine")
      }
    ]
  },
  project.check[1],
  project.check[2]
];

// 异步路由
export const asyncRouterMap = [
  {
    ...team.path,
    meta: {
      roles: [...$roles.manager],
      ...team.meta
    },
    children: [
      {
        path: "/teamManage",
        component: () => import("../views/teamManage/TeamAdmin")
      },
      ...team.detail
    ]
  },
  {
    ...team.path,
    meta: {
      roles: [$roles.team],
      ...team.meta
    },
    children: [
      {
        path: "/teamManage",
        component: () => import("../views/teamManage/TeamDeveloper")
      },
      {
        path: "noticeDetail:announcementId",
        name: "teamNoticeDetail",
        component: () =>
          import("../views/teamManage/components/teamNoticeDetail.vue")
      },
      ...team.detail
    ]
  },
  {
    ...project.path,
    meta: {
      roles: [...$roles.manager],
      ...project.meta
    },
    children: [
      {
        path: "/projectManage",
        redirect: "/projectManage/examine",
        component: () => import("../views/projectManage/ProjectAdmin"),
        children: [...adminProjectManage]
      },
      ...project.detail
    ]
  },
  {
    ...project.path,
    meta: {
      roles: [$roles.team],
      ...project.meta
    },
    children: [
      {
        path: "/projectManage",
        redirect: "/projectManage/check",
        component: () => import("../views/projectManage/ProjectDeveloper"),
        children: [...project.check]
      },
      ...project.detail
    ]
  },
  {
    ...project.path,
    meta: {
      roles: [$roles.demander],
      ...project.meta
    },
    children: [
      {
        path: "/projectManage",
        redirect: "/projectManage/check",
        component: () => import("../views/projectManage/ProjectDemander"),
        children: [...project.check, project.undertake]
      },
      ...project.detail
    ]
  },
  {
    path: "/publish",
    name: "publish",
    meta: {
      roles: [$roles.demander],
      title: "发布项目",
      icon: "fabu"
    },
    component: Layout,
    children: [
      {
        path: "/publish",
        component: () => import("../views/publish/Publish")
      }
    ]
  },
  {
    path: "/permission",
    name: "permission",
    meta: {
      roles: [$roles.root],
      title: "权限管理",
      icon: "quanxian"
    },
    component: Layout,
    children: [
      {
        path: "/permission",
        component: () => import("../views/permission/Permission")
      }
    ]
  },
  {
    path: "/notice",
    name: "notice",
    meta: {
      roles: [...$roles.manager],
      title: "发布公告",
      icon: "gonggao"
    },
    component: Layout,
    children: [
      {
        path: "/notice",
        redirect: { name: "publish" },
        component: () => import("../views/notice/Notice"),
        children: [
          {
            path: "detail:/id",
            name: "noticeDetail",
            component: () =>
              import("../views/notice/components/theNoticeDetail.vue")
          },
          {
            path: "publish",
            name: "publish",
            component: () => import("../views/notice/components/thePublish.vue")
          },
          {
            path: "dustbin",
            component: () => import("../views/notice/components/theDustbin.vue")
          },
          {
            path: "allNotice",
            component: () =>
              import("../views/notice/components/theAllNotice.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/message",
    name: "message",
    component: Layout,
    meta: {
      roles: [...$roles.manager, $roles.team, $roles.demander],
      title: "消息通知",
      icon: "xiaoxi"
    },
    children: [
      {
        path: "/message",
        component: () => import("../views/message/Message")
      }
    ]
  },
  {
    path: "/404",
    name: "page404",
    component: () => import("../views/pages/page404")
  },
  {
    path: "*",
    redirect: "/404"
  }
];

export default new Router({
  mode: "history",
  routes: constantRouterMap
  // routes: asyncRouterMap
});
