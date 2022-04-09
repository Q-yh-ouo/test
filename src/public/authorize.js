import constant from "@/public/constant";
import api from "@/api";

import {
  getNavAuthItem,
  getMenuAuthItem,
  getBtnAuthItem,
} from "lesso-common/public/authorize2";

let baseParams = {
  systemCode: constant.systemCode,
  authClientCode: constant.authCode.code,
  authTenantCode: constant.authCode.tcode,
  api: api.getUserAuthMenu,
};

// 获取左侧导航栏权限
const getNavAuth = () => {
  let params = Object.assign({}, baseParams);
  return getNavAuthItem(params);
};

// 获取按钮权限
const getBtnAuth = (pageCode, btnStatus) => {
  let params = Object.assign({}, baseParams, { pageCode, btnStatus });
  return getBtnAuthItem(params);
};
// 获取菜单权限
const getMenuAuth = (parentId) => {
  let params = Object.assign({}, baseParams, { parentId });
  return getMenuAuthItem(params);
};

export default {
  getNavAuth,
  getMenuAuth,
  getBtnAuth,
};
