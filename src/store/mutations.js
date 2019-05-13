// 更新状态
import { SET_TOKEN, SET_ROLE, CLEAR_STATE, SET_MESSAGE, SET_TEAM_DIRECTION, SET_MSG_NUM, SET_USER_INFO, SET_USERNAME, SET_TEMPROLE } from './types'
import { constantRouterMap } from '../router';
import { getMessageByUserGet } from './../api/login';
import { getExamineProject, getDelays, getModificationProject, getAllocation, getProjectByProgress, getProjectByState } from "./../api/project";
import { $roles } from "../utils/auth";
export default {
    [SET_TOKEN](state, { token }) {
        state.token = token;
    },
    [SET_ROLE](state, { role }) {
        state.role = role;
    },
    [CLEAR_STATE](state) {
        state.token = '';
        state.roles = [];
        state.permission.addRouters = [];
        state.permission.routers = constantRouterMap;
    },
    //获取消息
    // 这里是数组应该是{message}
    [SET_MESSAGE](state, message) {
        //数组接收所有是一个数组
        state.message = message;
    },
    [SET_TEAM_DIRECTION](state, teamDirection) {
        state.teamDirection = teamDirection;
    },

    // 设置消息数量
    async [SET_MSG_NUM](state, msgNum) {
        let data = [];
        let { role } = state;

        if ($roles.manager.includes(role)) {
            // 审核项目数
            data = (await getExamineProject()).data || [];
            msgNum.publishExamine = data.filter(item => item.state == 1).length;

            // 承接项目数
            data = (await getAllocation()).data || [];
            msgNum.undertakeExamine = data.length;

            // 延期项目数
            data = (await getDelays()).data || [];
            msgNum.delayExamine = data.filter(item => item.state == 1).length;

            // 修改项目数
            data = (await getModificationProject()).data;
            data = data ? data.modificationProject : [];
            msgNum.alterExamine = data.filter(item => item.state == "未审核").length;

            // 审核总数
            msgNum.projectExamine = msgNum.undertakeExamine + msgNum.alterExamine + msgNum.delayExamine + msgNum.publishExamine;
        } else if (role === $roles.demander) {
            // 未完成项目数
            data = (await getProjectByProgress("未承接")).data || [];
            msgNum.projectUndertake = data.filter(item => item.undertakeNum == 0).length;
        }

        if (!$roles.manager.includes(role)) {
            data = (await getProjectByState("1,3")).data || [];
            msgNum.projectCheck = data.length;
        }

        // 消息数量
        data = (await getMessageByUserGet(state.userId)).data || [];
        msgNum.message = data.filter(item => item.state == "未查看").length;
        state.msgNum = msgNum;


        let count = msgNum.porjectRun + msgNum.projectFinish;
        // 总项目数
        if ($roles.manager.includes(role)) {
            msgNum.projectManage = msgNum.projectExamine + count;
        } else if (role === $roles.demander) {
            msgNum.projectManage = msgNum.projectCheck + count + msgNum.projectUndertake;
        } else {
            msgNum.projectManage = msgNum.projectCheck + count;
        }

    },

    // 设置用户信息
    [SET_USER_INFO](state, info) {
        state.teamId = info.teamId;
        state.userId = info.userId;
        state.username = info.username;
        state.roles = info.roles;
    },
    [SET_USERNAME](state, username) {
        state.username = username;
    },

}