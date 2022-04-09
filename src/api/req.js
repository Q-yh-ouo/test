import { http } from "@lesso/common-http";
import {
  getStorage,
  saveStorage,
  removeStorage,
} from "lesso-common/public/utils";
import env from "./env";
import constant from "@/public/constant";
import router from "@/router";
import sendMain from "lesso-common/event/ipcRenderer";
import { aes } from "lesso-common-crypto";

/**
 * url: 地址
 * method: 请求方法
 * params: 参数
 * timeout: 超时时间
 * isOriginalGET: 是否传统get传参
 */

const logoutCallback = () => {
  // 清除用户数据
  removeStorage("userData");

  if (constant.isElectron) {
    // 返回 Electorn 窗口
    sendMain("openLoginWin");
  } else {
    // 跳转登录页
    router.push("/login");
  }
};

const changeJwtCallback = (jwt) => {
  let userData = getStorage("userData");
  userData.jwt = jwt;
  saveStorage("userData", userData);
};

const getEncodeToken = () => {
  let userData = getStorage("userData");
  return userData.encodeToken;
};

// 参数加密处理器
const paramsHandler = (params) => {
  // 针对 a 参数进行加密处理
  if (params && params.a) {
    params.a = aes.encrypt(JSON.stringify(params.a), getEncodeToken());
  }
  return params;
};

// 返回值解密处理器
const responseDataHandler = (response) => {
  let configData;
  if (response.config.data) {
    configData = JSON.parse(response.config.data);
  }
  if (configData && configData.a) {
    response.data.rows = JSON.parse(
      aes.decrypt(response.data.rows, getEncodeToken())
    );
  }
  return response;
};

const req = ({
  baseUrl,
  method,
  url,
  params,
  timeout,
  isOriginalGET,
  isLogin,
}) => {
  // 参数加密处理
  params = paramsHandler(params);

  let options = {
    url: env[baseUrl] + url,
    method: method,
    params: params,
    timeout: timeout,
    isOriginalGET: isOriginalGET,
    logoutCallback: logoutCallback,
    changeJwtCallback: changeJwtCallback,
    deviceId: window.fingerprint,
    // responseDataHandler 主要是用于返回值解密回调，http 加密时需要使用此回调
    responseDataHandler: responseDataHandler,
    authCode: constant.authCode,
    errorHandler: errorHandler,
    extraHeaders: {
      version: constant.version,
    },
  };

  // 非登录接口加鉴权
  if (!isLogin) {
    let userData = getStorage("userData");
    options.jwt = userData.jwt;
    options.userId = userData.user.id;
  }
  return http(options);
};

const errorHandler = (error) => {
  // 使用 sentry 上报 http 请求错误
  // window.$sentry &&
  //   window.$sentry.withScope((scope) => {
  //     if (error.response) {
  //       scope.setExtra("response", error.response);
  //     }
  //     window.$sentry.captureException(error);
  //   });
};

export default req;
