import Vue from 'vue';
import Vuex from 'vuex';
// 对象状态
import state from './state';
import getters from './getters';
// 调用commit间接修改状态
import actions from './actions';
// 直接修改状态
import mutations from './mutations';
import permission from "./permission";

// 插件使用
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        permission
    },
    state,
    getters,
    actions,
    mutations
});

