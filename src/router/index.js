import Vue from "vue";
import Router from "vue-router";
import constant from "@/public/constant";
import utils from "@/public/utils";
import { getStorage } from "lesso-common/public/utils";

Vue.use(Router);

let resultDir = [
  {
    path: "/home/mine",
    name: "mine",
    component: () => import("../views/mine"),
  },
];
let routerMap = utils.dynRoutesImport();
resultDir = resultDir.concat(routerMap);

let router = new Router({
  routes: [
    {
      path: "/",
      redirect: constant.isElectron ? "/home" : "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/index2"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/home"),
      // 先重定向到空白路由页，
      // 再基于权限跳转到第一个权限路由
      redirect: "/home/mine",
      children: resultDir,
    },
    {
      path: "*",
      redirect: constant.isElectron ? "/home" : "/login",
    },
  ],
});

if (!constant.isElectron) {
  // 路由拦截器
  router.beforeEach((to, from, next) => {
    let { jwt } = getStorage("userData");
    // 未登录跳到登录页，已登录刷新保存当前路由
    if (!jwt && to.name !== "login") {
      next({
        name: "login",
      });
    } else if (!jwt && to.name == "login") {
      next();
    } else {
      next();
    }
  });
}

export default router;
