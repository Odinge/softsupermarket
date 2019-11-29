/*
 * @Author: your name
 * @Date: 2019-11-11 19:23:51
 * @LastEditTime: 2019-11-11 19:26:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \softsupermarket - v2\src\utils\goto.js
 */

const HOME_URL = "https://software.sicau.edu.cn/";
const LOGIN_URL = "http://software.sicau.edu.cn:8080/";

export const goto = url => {
  const link = document.createElement("a");
  link.href = url;
  link.click();
};
goto.home = () => goto(HOME_URL);
goto.login = () => goto(LOGIN_URL);
