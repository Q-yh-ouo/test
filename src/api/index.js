import req from "./req";

let api = {
  userLogout: (data) =>
    req({
      //用户退出登录
      baseUrl: "authLogin",
      method: "post",
      url: "account/exit",
      params: data,
      timeout: 2000,
    }),
  login: (data) =>
    req({
      baseUrl: "authLogin",
      method: "post",
      url: "account/login",
      params: data,
      isLogin: 1,
    }),
  getToken: (data) =>
    req({
      //获取登录token
      baseUrl: "authLogin",
      method: "get",
      url: "account/register",
      params: data,
      isOriginalGET: 1,
      isLogin: 1,
    }),
  getTimestamp: (data) =>
    req({
      //获取服务器时间戳
      baseUrl: "authLogin",
      method: "post",
      url: "account/getTimeStamp",
      params: data,
    }),
  modifyIDMPassword: (data) =>
    req({
      //idm接口
      baseUrl: "authLogin",
      method: "get",
      url: "account/modifypwd",
      params: data,
      isLogin: 1,
    }),
  resetPwdIdm: (data) =>
    req({
      // idm 重设密码
      baseUrl: "authLogin",
      method: "get",
      url: "account/retrieve",
      params: data,
      isLogin: 1,
    }),
  getUserAuthMenu: (data) =>
    req({
      // 获取用户菜单权限
      baseUrl: "authLogin",
      method: "post",
      url: "authMenu/getUserAuthMenu",
      params: data,
    }),
};
let map = [];
const ctx = require.context("@/views/", true, /\.api.js$/);
ctx.keys().forEach((key) => {
  map = map.concat(ctx(key).default);
});
map.forEach((val) => {
  api = Object.assign(api, val);
});

export default api;
