// 权限控制
// store/permission.js
import { asyncRouterMap, constantRouterMap } from '../router';

function hasPermission(role, route) {
    if (route.meta && route.meta.roles) {
        const roles = route.meta.roles;
        return roles.includes(role);
    } else {
        return true
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
        GenerateRoutes({ commit }, { role }) {
            return new Promise(resolve => {
                const accessedRouters = asyncRouterMap.filter(route => hasPermission(role, route));
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            })
        }
    }
};

export default permission;

