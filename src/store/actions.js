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
  SET_TEMPROLE
} from "./types";
import {
  toLogin,
  login,
  getUserInfor,
  getStudentIdByRequest,
  getUserId,
  getRole
} from "../api/login.js";
import {
  getMessageById,
  getMessageByState,
  getMessageByUserGet,
  changeMessageState
} from "./../api/login";
import {
  getExamineProject,
  getDelays,
  getModificationProject,
  getAllocation,
  getProjectByProgress,
  getProjectByState
} from "./../api/project";
import { getAllTeamDirection } from "./../api/team";
import { setToken, getTokenRole, setRole } from "../utils/auth";
import { Message } from "element-ui";

export default {
  // 获取请求信息
  getRequest({ commit }) {
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
                  getRole(studentId)
                    .then(res => {
                      if (res.status == 0) {
                        let roles = res.data;
                        // 权限组
                        let info = {
                          roles,
                          userId,
                          username: studentId,
                          teamId: ""
                        };
                        commit(SET_USER_INFO, info);

                        resolve(roles);
                      }
                      throw res.msg;
                    })
                    .catch(err =>
                      reject({
                        err,
                        msg: "权限获取失败",
                        code: 3
                      })
                    );
                } else throw res.msg;
              })
              .catch(err => reject({ err, msg: "您没有权限访问", code: 2 }));
          } else throw res.msg;
        })
        .catch(err => {
          reject({ err, msg: "无效登录", code: 1 });
        });
    });
  },
  // 获取角色改变显示
  async getUserInfor({ commit }) {
    let studentId = (await getStudentIdByRequest()).data;
    let userId = (await getUserId(studentId)).data;
    let roles = (await getRole(studentId)).data;
    let rolesMap = roles.map(item => item.identityId).sort((a, b) => a > b);
    let info = {
      roles,
      userId,
      username: studentId,
      teamId: ""
    };
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
  setRole({ commit }, role) {
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
    // 刷新浏览器
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
    if (result.status == 0) {
      result = result.data;
      //下面仅供测试
      commit(SET_MESSAGE, result);
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
  async initMsgNum({ commit }) {
    let msgNum = {
      publishExamine: 0,
      delayExamine: 0,
      alterExamine: 0,
      undertakeExamine: 0,
      projectExamine: 0,
      projectUndertake: 0,
      porjectRun: 0,
      projectCheck: 0,
      projectFinish: 0,
      projectManage: 0,
      message: 0
    };
    let data = [];

    // 未完成项目数
    data = (await getProjectByProgress("未完成")).data || [];
    msgNum.porjectRun = data.filter(item => item.state == 1).length;

    // 已完成项目数
    data = (await getProjectByProgress("已完成")).data || [];
    msgNum.projectFinish = data.filter(item => item.score == -1).length;

    commit(SET_MSG_NUM, msgNum);
  }
  //
};
