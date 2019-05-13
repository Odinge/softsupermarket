export const getToken = () => sessionStorage.getItem('token');

export const setToken = () => {
  let token = randomString(32);
  sessionStorage.setItem("token", token);
}

// 获取cookie
export const getCookie = name => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
// 设置cookie
export const setCookie = (name, value, options) => {

  options = options || {};

  var cookie = name + "=" + escape(value);

  // 设置有效时间
  if (options.expires == undefined) {
    options.expires = "30d"
  }
  var strsec = getsec(options.expires);
  var exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  cookie += ";expires=" + exp.toGMTString();
  // 路径
  if (typeof options.path !== "undefined")
    cookie += ";path=" + options.path;
  // 域名
  if (typeof options.domain !== "undefined")
    cookie += ";domain=" + options.domain;
  // 安全连接
  if (options.secure)
    cookie += ";secure";

  document.cookie = cookie;
}

// 删除cookie
export const delCookie = name => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

function getsec(str) {
  var str1 = str.slice(0, -1) * 1;
  var str2 = str.slice(-1);
  if (str2 == "s") {
    return str1 * 1000;
  }
  else if (str2 == "h") {
    return str1 * 60 * 60 * 1000;
  }
  else if (str2 == "d") {
    return str1 * 24 * 60 * 60 * 1000;
  }
}

export const proxyUrl = "/api";
// export const proxyUrl = "";


const verify = 1614885167927;

export const getTokenRole = () => {
  let token = sessionStorage.getItem('xxx');
  let role = token / verify;
  return role + "";
};

export const setRole = role => {
  let token = verify * role;
  sessionStorage.setItem("xxx", token);
}

export const delRole = () =>
  sessionStorage.removeItem("xxx");

function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export const $roles = {
  root: "1",// 1 超级管理员
  admin: "2",// 2 管理员
  team: "3",// 3 团队管理员
  demander: "4", // 4 单位负责人
  common: "5",// 5 普通用户
  manager: ["1", "2"]
}