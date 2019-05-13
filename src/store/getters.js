// 读取状态，计算
export default {
    // 获取令牌
    token(state) {
        return state.token;
    },
    // 获取用户信息
    role(state) {
        return state.role;
    },
    // 获取动态路由
    addRouter(state) {
        return state.permission.addRouters;
    },
    // 获取动态路由
    teamDirection(state) {
        return state.teamDirection;
    }
}