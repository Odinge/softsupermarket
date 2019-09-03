/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-01 09:20:16
 * @LastEditors: Please set LastEditors
 */
// 权限控制
// store/permission.js
import { asyncRouterMap, constantRouterMap } from "../router";

function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    const roles = route.meta.roles;
    return roles.includes(role);
  } else {
    return true;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    async GenerateRoutes({ commit }, { role }) {
      //   return new Promise(resolve => {
      const accessedRouters = await asyncRouterMap.filter(route =>
        hasPermission(role, route)
      );
      commit("SET_ROUTERS", accessedRouters);
      return accessedRouters;
      // resolve(accessedRouters);
      //   });
    }
  }
};

export default permission;
