/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-11-15 18:03:17
 * @LastEditors: Please set LastEditors
 */
import axios from "axios";
import { MessageBox } from "element-ui";
import { goto } from "./../utils/goto";
// import {
//   getToken,
//   setCookie,
//   getCookie,
//   delCookie,
//   proxyUrl,
//   roles
// } from "./../utils/auth";

// 设置默认服务器地址
axios.defaults.withCredentials = true; //让ajax携带cookie

// setCookie("JSESSIONID", "F6F0DA47E40CFEDF7C55B82F9C5CD7D2", { path: "/" });

// const baseURL = "http://www.ghjhhyuyuy.xin:8080";
// const baseURL = "http://software.sicau.edu.cn:8082";
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
axios.interceptors.response.use(
  res => {
    const { data } = res;

    if (typeof data === "string" && data.includes("authserver")) {
      MessageBox.alert("请重新登录！", "权限过期", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        roundButton: true,
        type: "error",
        callback: () => {
          location.reload(); // 刷新浏览器
          // window.location.href = "http://www.ghjhhyuyuy.xin:8080/";
          // goto("https://software.sicau.edu.cn:8080/");
          goto.login();
        }
      });
      data.status = 0;
      data.data = [];
    }

    switch (data.status) {
      case undefined:
      case 0:
      case 1:
        return data;
      default:
        break;
    }
    throw data;
  },
  err => {
    console.log(err);

    return Promise.reject(err);
  }
);

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

// 退出登录
export const loginout = () => axios.post("/v1/pub/loginout");
