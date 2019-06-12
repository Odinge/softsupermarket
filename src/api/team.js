import axios from "axios";


//根据userId获取team信息
export const getMyTeam=(userId)=>axios.get('/v1/nonpub/transform/getOnesTeamMessage',{params:{userId}});

// 获取全部团队方向列表
export const getAllTeamDirection = () =>
  axios.get("/v1/nonpub/collect/selectAllTeamDirection");

//获取个人用户方向列表
export const getAllUserDirection = () =>
  axios.get("/v1/nonpub/collect/selectAllUserDirection");

// 获取团队信息
export const getTeam = (teamId = 0) =>
  axios.get("/v1/nonpub/publish/team", { params: { teamId } });

//解散团队
export const deleteTeam = (teamId) =>
  axios.post("/v1/nonpub/examine/deleteTeam", { teamId });

//删除团队成员
export const deleteTeamMate = (userId,teamId) =>
  axios.post("/v1/nonpub/examine/deleteTeammate", { userId,teamId});

//新增团队成员
export const addTeamMate = (teamId,name,studentId) =>
  axios.post("/v1/nonpub/examine/addTeammate", {teamId,name,studentId});

//提交修改团队信息请求
export const modifyApplicaiton = (teamId,modificationType,modificationPlace,modificationContent,originalData) =>
  axios.post("/v1/nonpub/examine/modificationTeam", { teamId,modificationType,modificationPlace,modificationContent,originalData});
//.................................以上为队长后台接口,下面是管理员后台接口
//获取所有修改团队申请
export const getModifyAppliction = () =>
  axios.get("/v1/nonpub/examine/get/modificationTeam");

//审核团队修改信息申请
export const agreeModify= (modificationId,state) =>
  axios.post("/v1/nonpub/examine/modificationTeamJudge", {modificationId,state});

//获取新建团队申请
export const getNewApplication = () =>
  axios.get("/v1/nonpub/examine/get/team");

//从黑名单中撤销
export const cancelBlackList = (teamId) =>
  axios.post("/v1/nonpub/supervise/cancelBlackList", {teamId});

//获取黑名单列表
export const getBlackTeamList = () =>
  axios.get("/v1/nonpub/supervise/getBlackTeamList",);

//从Excel导入团队
export const importTeam = (file) =>
  axios.post("/v1/nonpub/examine/addTeamByExcel",file);

//从excel导入黑名单（方便）
export const importBlack= (file) =>
  axios.post("/v1/nonpub/examine/addBlackListByExcel",file);

