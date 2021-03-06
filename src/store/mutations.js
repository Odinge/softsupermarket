/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-01 10:11:57
 * @LastEditors: Please set LastEditors
 */
// 更新状态
import {
  SET_TOKEN,
  SET_ROLE,
  CLEAR_STATE,
  SET_MESSAGE,
  SET_TEAM_DIRECTION,
  SET_MSG_NUM,
  SET_USER_INFO,
  SET_USERNAME,
  SET_TEMPROLE,
  SET_TEAMID,
  SET_TEAMS,
  SET_TEAM,
  SET_PAGE_ENTER_STATE,
  SET_PROJECTRUN_MSG_NUM
} from "./types";
import { constantRouterMap } from "../router";
import { getMessageByUserGet } from "./../api/login";
import {
  getExamineProject,
  getDelays,
  getModificationProject,
  getAllocation,
  getProjectByProgress,
  getProjectByState
} from "./../api/project";

export default {
  // 设置token
  [SET_TOKEN](state, { token }) {
    state.token = token;
  },
  //   设置角色
  [SET_ROLE](state, { role }) {
    state.role = role;
  },
  //   清除状态
  [CLEAR_STATE](state) {
    state.token = "";
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
  [SET_MSG_NUM](state, msgNum) {
    state.msgNum = msgNum;
  },

  // 设置用户信息
  [SET_USER_INFO](state, info) {
    // state.teamId = info.teamId;
    state.userId = info.userId;
    state.username = info.username;
    state.roles = info.roles;
  },
  // 设置用户名
  [SET_USERNAME](state, username) {
    state.username = username;
  },
  [SET_TEAMID](state, teamId) {
    state.teamId = teamId;
  },
  [SET_TEAMS](state, teams) {
    state.teams = teams;
  },
  [SET_TEAM](state, team) {
    state.team = team;
  },
  [SET_PAGE_ENTER_STATE](state, pageEnterState) {
    state.pageEnterState = pageEnterState;
  },
  [SET_PROJECTRUN_MSG_NUM](state, msgNum) {
    let num = state.msgNum.projectRun;
    state.msgNum.projectRun = msgNum;
    state.msgNum.projectManage = state.msgNum.projectManage - num + msgNum;
  }
};
