/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-06 19:21:37
 * @LastEditors: Please set LastEditors
 */
// 通过commit间接更新state，异步回调ajax
import {
  ADDROUTER,
  SET_TOKEN,
  SET_ROLE,
  CLEAR_STATE,
  SET_TEAM_DIRECTION,
  SET_MESSAGE,
  SET_MSG_NUM,
  SET_USER_INFO,
  SET_USERNAME,
  SET_TEMPROLE,
  SET_TEAM
} from "./types";
import {
  toLogin,
  login,
  getUserInfor,
  getStudentIdByRequest,
  getUserId,
  getRole,
  loginout
} from "../api/login.js";
import {
  getMessageById,
  getMessageByState,
  getMessageByUserGet,
  changeMessageState
} from "./../api/login";
import {
  getModifyAppliction,
  getNewApplication,
  getBlackTeamList,
  getMyTeam
} from "./../api/team";
import {
  getExamineProject,
  getDelays,
  getModificationProject,
  getAllocation,
  getProjectByProgress,
  getProjectByState,
  getProjectByProgressLimit,
  getFailedAndUnauditedProjectByTeamId, // 未承接
  getRunProjectByTeamId, // 正在进行
  getTeamFinishProject // 已完成
} from "./../api/project";
import { getAllTeamDirection } from "./../api/team";
import {
  setToken,
  getTokenRole,
  setRole,
  $roles,
  getUserInfoOfStorage,
  setUserInfoOfStorage
} from "../utils/auth";
import { Message } from "element-ui";

export default {
  // 获取请求信息
  getRequest({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      // 根据请求获取学号
      getStudentIdByRequest()
        .then(res => {
          if (res.status == 0) {
            // 获取用户id
            let studentId = res.data;
            getUserId(studentId)
              .then(res => {
                if (res.status == 0) {
                  // 获取权限
                  let userId = res.data;
                  // 获取信息
                  dispatch("qesMessage", { userGet: userId })
                    .then(() => {
                      getRole(studentId)
                        .then(res => {
                          if (res.status == 0) {
                            let roles = res.data;

                            // 权限组
                            let info = {
                              roles,
                              userId,
                              username: studentId
                              // teamId: ""
                            };
                            setUserInfoOfStorage(info);
                            commit(SET_USER_INFO, info);

                            resolve(roles);
                          }
                          throw res.msg;
                        })
                        .catch(err =>
                          reject({
                            err,
                            msg: "无访问权限",
                            code: 2
                          })
                        );
                    })
                    .catch(err => {});
                } else throw res.msg;
              })
              .catch(err => reject({ err, msg: "无访问权限", code: 2 }));
          } else throw res.msg;
        })
        .catch(err => {
          reject({ err, msg: "无效登录", code: 1 });
        });
    });
  },
  // 获取角色改变显示
  async getUserInfor({ commit, dispatch }) {
    // let studentId = (await getStudentIdByRequest()).data;
    // let userId = (await getUserId(studentId)).data;
    // let roles = (await getRole(studentId)).data;
    // let rolesMap = roles.map(item => item.identityId).sort((a, b) => a > b);
    // let info = {
    //   roles,
    //   userId,
    //   username: studentId,
    //   teamId: ""
    // };

    let info = getUserInfoOfStorage();
    let rolesMap = info.roles
      .map(item => item.identityId)
      .sort((a, b) => a > b);

    commit(SET_USER_INFO, info);

    let role = getTokenRole();
    if (rolesMap.includes(role)) {
      commit(SET_ROLE, { role });
      return role;
    } else throw "权限验证失败";
  },
  // 设置token
  setToken({ commit }, token) {
    commit(SET_TOKEN, { token });
  },
  // 设置token
  async setRole({ commit, dispatch }, role) {
    if (role === $roles.team) await dispatch("getTeamInfo");
    setRole(role);
    setToken();
  },
  // 清除登录状态
  // clearState({ commit }) {
  //     commit(CLEAR_STATE);
  // },
  // 退出
  async Logout() {
    // 退出清除缓存和登录
    await sessionStorage.removeItem("token");
    await sessionStorage.removeItem("xxx");
    await sessionStorage.removeItem("teams");
    await sessionStorage.removeItem("teamId");
    // 刷新浏览器
    location.reload();
  },
  async loginout({ dispatch }) {
    // 退出清除缓存和登录
    await loginout();
    // await dispatch("Logout");
    location.reload();
  },
  // 获取信息
  async qesMessage({ commit }, param) {
    // 根据请求获取对应的消息
    let result = null;
    if (param.messageId) {
      result = await getMessageById(param.messageId);
    }
    if (param.state) {
      result = await getMessageByState(param.state);
    }
    if (param.userGet) {
      result = await getMessageByUserGet(param.userGet);
    }
    if (result.status === 0) {
      result = result.data;
      //下面仅供测试
      commit(SET_MESSAGE, result);
      return result;
    }
  },
  // 改变id
  async changeId({ commit }, param) {
    await changeMessageState(param);
  },
  async GetAllTeamDirection({ commit }) {
    let result = null;
    result = await getAllTeamDirection();
    if (result && result.status == 0) {
      result = result.data;
      //下面仅供测试
      commit(SET_TEAM_DIRECTION, result);
    }
  },
  // 初始化查看信息数量.用于显示为处理消息数量
  async initMsgNum({ commit, state }) {
    let msgNum = {
      publishExamine: 0,
      delayExamine: 0,
      alterExamine: 0,
      undertakeExamine: 0,
      projectExamine: 0,
      projectUndertake: 0,
      projectRun: 0,
      projectCheck: 0,
      projectFinish: 0,
      projectManage: 0,
      message: 0,
      teamManage: 0
    };

    let data = [];
    let { role, username, teamId } = state;

    // 团队信息
    if ($roles.manager.includes(role)) {
      // 增加团队
      data = (await getNewApplication()).data || [];
      let newTeam = data.length;
      // // 黑名单
      // data = (await getBlackTeamList()).data.blackTeamList || [];
      // let blackList = data.length;
      // 修改团队
      data = (await getBlackTeamList()).data.modificationTeam || [];
      let modifyTeam = data.length;
      // msgNum.teamManage = blackList + modifyTeam + newTeam;
      msgNum.teamManage = modifyTeam + newTeam;
    }

    if ($roles.manager.includes(role)) {
      // 未完成项目数
      data = (await getProjectByProgress("未完成")).data || [];
      msgNum.projectRun = data.length;

      // 已完成项目数
      data = (await getProjectByProgress("已完成")).data || [];
      msgNum.projectFinish = data.filter(item => item.score == -1).length;
    } else if (role === $roles.demander) {
      // 未完成项目数
      data = (await getProjectByProgressLimit(username, "未完成")).data || [];
      msgNum.projectRun = data.length;

      // 已完成项目数
      data = (await getProjectByProgressLimit(username, "已完成")).data || [];
      msgNum.projectFinish = data.filter(item => item.score == -1).length;
    } else {
      // 未完成项目数
      data = (await getRunProjectByTeamId(teamId)).data || [];
      msgNum.projectRun = data.length;

      // 已完成项目数
      data = (await getTeamFinishProject(teamId)).data || [];
      msgNum.projectFinish = data.filter(item => item.score == -1).length;
    }

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
      msgNum.projectExamine =
        msgNum.undertakeExamine +
        msgNum.alterExamine +
        msgNum.delayExamine +
        msgNum.publishExamine;
    } else if (role === $roles.demander) {
      // 未承接项目数
      data = (await getProjectByProgressLimit(username, "未承接")).data || [];
      msgNum.projectUndertake = data.filter(
        item => item.undertakeNum == 0
      ).length;
    }

    // 项目审核
    if (role === $roles.demander) {
      data = (await getProjectByProgressLimit(username, "未审核")).data || [];
      msgNum.projectCheck = data.length;
    } else if (role === $roles.team) {
      let temp = (await getFailedAndUnauditedProjectByTeamId(teamId)).data;
      data = [...temp.Failed, ...temp.Unaudited];
      msgNum.projectCheck = data.length;
    }

    // 消息数量
    data = (await getMessageByUserGet(state.userId)).data || [];
    msgNum.message = data.filter(item => item.state == "未查看").length;

    let count = msgNum.projectRun + msgNum.projectFinish;
    // 总项目数
    if ($roles.manager.includes(role)) {
      msgNum.projectManage = msgNum.projectExamine + count;
    } else if (role === $roles.demander) {
      msgNum.projectManage =
        msgNum.projectCheck + count + msgNum.projectUndertake;
    } else {
      msgNum.projectManage = msgNum.projectCheck + count;
    }

    commit(SET_MSG_NUM, msgNum);
    return msgNum;
  },
  // 获取团队信息
  async getTeamInfo({ state, commit }) {
    const res = await getMyTeam(state.username);
    if (res.status) throw "团队获取失败";
    let { data } = res;
    // console.log(data);

    for (let i = 0; i < data.length; i++) {
      let teams = data[i];
      if (teams instanceof Array) {
        try {
          let teamId = teams[0]["团队id"];
          commit("SET_TEAMS", teams);
          commit("SET_TEAMID", teamId);
        } catch (err) {
          throw "抱歉，您不是队长没有权限访问！！！";
        }
      }
    }
    return data;
  }
};
