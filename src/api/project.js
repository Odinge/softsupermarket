import axios from "axios";
import { proxyUrl } from "./../utils/auth";
// 获取项目信息
// const baseUrl = "http://www.ghjhhyuyuy.xin:8080";
// axios.defaults.baseURL = baseUrl;

// ===================================获取项目信息api==============================
// 发布项目
export const publish = data => axios.post("/v1/nonpub/collect/need", data);

// 获取项目信息
export const getProject = (projectId = 0) =>
  axios.get("/v1/nonpub/publish/project", { params: { projectId } });

// 根据状态获取项目
export const getProjectByState = state =>
  axios.get("/v1/nonpub/publish/projectbystate", { params: { state } });

// 项目根据状态分类
// export const projectsClassifyByState = state =>
//   axios.get("/v1/nonpub/examine/projectsClassifyByState", {
//     params: { state }
//   });

// 根据项目进度获取项目
export const getProjectByProgress = progress =>
  axios.get("/v1/nonpub/supervise/getProjectByProgress", {
    params: { progress }
  });

// 获取已完成项目的团队被评分情况
export const getEvaluatedRunProjects = () =>
  axios.get("/v1/nonpub/examine/getEvaluatedRunProjects");

// ======================================项目审核api=================================
// 获取待审核的项目
export const getExamineProject = () =>
  axios.get("/v1/nonpub/examine/get/project");

// 审核项目
export const examineProject = (projectId, state) =>
  axios.post("/v1/nonpub/examine/project", { projectId, state });

// =====================================项目修改api===================================
// 发起项目修改
export const modificationProject = data =>
  axios.post("/v1/nonpub/examine/modificationProject", data);

// 发起项目修改 (信推办)
export const modificationProjectX = data =>
  axios.post("/v1/nonpub/examine/modificationProjectX", data);

// 项目修改审核
export const examineModificationProject = (modificationId, state) =>
  axios.post("/v1/nonpub/examine/modificationProjectJudge", {
    modificationId,
    state
  });

// 获取项目信息修改请求
export const getModificationProject = () =>
  axios.get("/v1/nonpub/examine/get/modificationProject");

// 查看項目修改审核信息
export const getModificationProjectById = modificationId =>
  axios.get("/v1/nonpub/supervise/projectModificationState", {
    params: { modificationId }
  });

// ===============================项目承接api==============================
// 获取待审核项目分配（哪些团队接哪些项目）
export const getAllocation = () =>
  axios.get("/v1/nonpub/examine/get/allocation");

// 审核项目分配
export const examineAllocation = (undertakeId, state) =>
  axios.post("/v1/nonpub/examine/allocation", { undertakeId, state });

// ==============================查看项目进度api==============================
// 查看项目进度
export const getProgress = runId =>
  axios.get("/v1/nonpub/supervise/progress", { params: { runId } });

// 生成运行时项目并创建时刻表
// export const timetable = timeNode =>
//   axios.post("/v1/nonpub/supervise/timetable", { timeNode });

// 获取项目节点信息
export const getAllTimeNodes = runId =>
  axios.get("/v1/nonpub/supervise/allTimeNodes", { params: { runId } });

// 更改当前进度节点(进入下一节点)
export const changeProcess = runId =>
  axios.post("/v1/nonpub/supervise/changeProcess", { runId });

// ================================项目延期api==============================
// 延期申请
export const delayApply = (runId, delayTime) =>
  axios.post("/v1/nonpub/supervise/delay", { runId, delayTime });

// 延期审核
export const examineDelay = (delayId, state) =>
  axios.post("/v1/nonpub/examine/delay", { delayId, state });

// 获取延时时间
export const getDelayTime = delayId =>
  axios.get("/v1/nonpub/supervise/delayTime", { params: { delayId } });

// 获取延期审核列表
export const getDelays = () => axios.get("/v1/nonpub/examine/get/delay");

// ===============================项目打分api======================================
// 打分
export const scoring = (runId, score, evaluate) =>
  axios.post("/v1/nonpub/supervise/scoring", { runId, score, evaluate });

export const getEvaluate = runId =>
  axios.get("/v1/nonpub/examine/evaluate", { params: { runId } });

// ===============================下载文件api=======================================
// 下载项目成果文件
export const downloadAchievement = (runId, timeNode) =>
  axios.get("/v1/nonpub/supervise/downloadAchievement", {
    params: { runId, timeNode }
  });

// 下载项目计划文档
export const downloadProjectDocument = (projectId, teamId) =>
  axios.get("/v1/nonpub/supervise/downloadProjectDocument", {
    params: { projectId, teamId }
  });

// 上传项目成果
export const uploadAchievements = data =>
  axios.post("/v1/nonpub/supervise/achievements", data);

// ===========================获取成果提交api======================================
// 获取审核得全部历史记录
export const getAchievementHistory = (runId, timeNode) =>
  axios.get("/v1/nonpub/supervise/achievementHistory", {
    params: { runId, timeNode }
  });

// =========================获取项目各状态信息api=================================
// 查看项目发布审核状态
export const getPublishState = projectId =>
  axios.get("/v1/nonpub/supervise/projectState", { params: { projectId } });

// 查看承接审核状态
export const getUndertakeState = undertakeId =>
  axios.get("/v1/nonpub/supervise/state", { params: { undertakeId } });

// 查看项目修改状态
export const getModificationState = modificationId =>
  axios.get("/v1/nonpub/supervise/projectModificationState", {
    params: { modificationId }
  });

// 查看延期审核状态
export const getDelayState = delayId =>
  axios.get("/v1/nonpub/supervise/delayState", { params: { delayId } });

// 超时判断
export const timeoutJudgement = runId =>
  axios.post("/v1/nonpub/supervise/timeoutJudgement", { runId });

// 成果审核
export const examineAchievements = (achievementsId, state) =>
  axios.post("/v1/nonpub/examine/updateAchievementsState", {
    achievementsId,
    state
  });

// 上传成果审核状态
export const getAchievementState = achievementsId =>
  axios.get("/v1/nonpub/supervise/achievementCommitState", {
    params: { achievementsId }
  });

// ============================获取id==================================
// 根据runId查询delayId和achievementsId
export const getDelayAndAchievementsByRunId = runId =>
  axios.get("/v1/nonpub/supervise/getDelayAndAchievementsByRunId", {
    params: { runId }
  });

// 根据projectId查询undertakeId和modificationId
export const getModificationAndUndertake = projectId =>
  axios.get("/v1/nonpub/supervise/getModificationAndUndertake", {
    params: { projectId }
  });

// ============================取消接口=================================
// 取消项目发布申请
export const cancelPublish = projectId =>
  axios.post("/v1/nonpub/supervise/cancel/project", { projectId });

// 取消修改项目申请
export const cancelModificationProject = modificationId =>
  axios.post("/v1/nonpub/supervise/cancel/modificationProject", {
    modificationId
  });

// 取消项目承接申请
export const cancelUndertake = undertakeId =>
  axios.post("/v1/nonpub/supervise/undertake", { undertakeId });

// 取消延期申请
export const cancelDelay = delayId =>
  axios.post("/v1/nonpub/supervise/cancel/delay", { delayId });

// 取消成果提交申请
export const cancelAchievement = achievementsId =>
  axios.post("/v1/nonpub/supervise/cancel/achievement", { achievementsId });

// 开发团队参与项目征集
export const collectProject = data =>
  axios.post("/v1/nonpub/collect/project", data);

// 获取延期总天数
export const getAllDelayTime = runId =>
  axios.get("/v1/nonpub/supervise/delayTimeByTeam", { params: { runId } });

// 导入已完成项目
export const addFinishedProjectByExcel = file =>
  axios.post("/v1/nonpub/examine/addFinishedProjectByExcel", file);

// 导出已完成项目
export const exportProjectCompleted = () =>
  axios.post("/v1/nonpub/supervise/exportProjectCompleted");

// =====================================获取项目================================
// 获取审核未通过的项目
export const getNotPassProjectByUserId = userId =>
  axios.get("/v1/nonpub/examine/getNotPassProjectByUserId", {
    params: { userId }
  });

// 单位负责人获取项目情况
export const getProjectByProgressLimit = (teacherId, progress) =>
  axios.get("/v1/nonpub/supervise/getProjectByProgressLimit", {
    params: { progress, teacherId }
  });

/**
 * 根据团队id获取项目
 * */
export const getProjectByTeamId = teamId =>
  axios.get("/v1/nonpub/publish/getProjectByTeamId", { params: { teamId } });

/**
 * 根据团队id来获取审核未通过和未审核项目
 */
export const getFailedAndUnauditedProjectByTeamId = teamId =>
  axios.get("/v1/nonpub/publish/getFailedAndUnauditedProjectByTeamId", {
    params: { teamId }
  });

/**
 * 根据团队id获取正在进行的项目
 */
export const getRunProjectByTeamId = teamId =>
  axios.get("/v1/nonpub/publish/getRunProjectByTeamId", {
    params: { teamId }
  });

/**
 * 获取团队已完成项目
 */
export const getTeamFinishProject = teamId =>
  axios.get("/v1/nonpub/publish/teamFinishProject", {
    params: { teamId }
  });
