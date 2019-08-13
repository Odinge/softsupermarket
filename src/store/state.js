/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-08-13 07:37:09
 * @LastEditors: Please set LastEditors
 */
// 状态对象
export default {
  role: "",
  roles: [],
  token: "",
  message: [],
  teamDirection: [],
  msgNum: {
    publishExamine: 0,
    delayExamine: 0,
    alterExamine: 0,
    undertakeExamine: 0,
    projectExamine: 0,
    porjectRun: 0,
    projectCheck: 0,
    projectFinish: 0,
    projectManage: 0
  },
  teams: [],
  teamId: "",
  get teams() {
    let vlaue = sessionStorage.getItem("teams");
    return typeof vlaue === "string" ? JSON.parse(vlaue) : [];
  },
  set teams(vlaue) {
    sessionStorage.setItem("teams", JSON.stringify(vlaue));
  },
  get teamId() {
    return sessionStorage.getItem("teamId");
  },
  set teamId(vlaue) {
    sessionStorage.setItem("teamId", vlaue);
  },
  team: {},
  userId: "",
  username: "",
  pageEnterState: false
};
