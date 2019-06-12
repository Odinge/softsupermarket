import axios from "axios";
import {
  getToken,
  setCookie,
  getCookie,
  delCookie,
  proxyUrl,
  roles
} from "./../utils/auth";

const baseURL = "http://www.ghjhhyuyuy.xin:8080";

// 设置默认服务器地址
axios.defaults.withCredentials = true; //让ajax携带cookie

// setCookie("JSESSIONID", "F09E7B1D2FD0FDA5378CCFB94626CD2B", { path: "/" });

// axios.defaults.baseURL = baseURL;

// 请求拦截器
// request拦截器
axios.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 在这里统一的拦截结果，把结果处理成res.data,相应拦截
axios.interceptors.response.use(res => res.data);

// 根据id获取信息
export const getMessageById = messageId =>
  axios.get("/v1/nonpub/supervise/getMessageByMessageId", {
    params: { messageId }
  });

// 根据消息状态获取信息
export const getMessageByState = messageState =>
  axios.get("/v1/nonpub/supervise/getMessageByState", {
    params: { messageState }
  });

// 根据接收方获取信息
export const getMessageByUserGet = userGet =>
  axios.get("/v1/nonpub/supervise/getMessageByUserGet", {
    params: { userGet }
  });

// 改变消息状态
export const changeMessageState = messageId =>
  axios.post("/v1/nonpub/supervise/changeMessageState", { messageId });

// 获取学号
export const getStudentIdByRequest = () =>
  axios.post("/v1/nonpub/publish/getStudentIdByRequest");

// 获取用户id
export const getUserId = studentId =>
  axios.get("/v1/nonpub/supervise/getUserId", { params: { studentId } });

// 获取角色
export const getRole = userId =>
  axios.get("/v1/nonpub/examine/getRole", {
    params: { userId }
  });

// 改变角色
export const changeRole = data =>
  axios.post("/v1/nonpub/examine/changeRole", data);

// 根据userId获取团队id及其身份
export const getOnesTeamMessage = userId =>
  axios.post("/v1/nonpub/transform/getOnesTeamMessage", userId);
