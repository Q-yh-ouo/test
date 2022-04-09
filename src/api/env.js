import constant from "@/public/constant";

const env = {
  dev: {
    // 开发服务器
    pms: "http://pms-server.pms-server-web.172.16.90.27.xip.io/",
    // pms: "http://192.169.1.188:8090/",
    file: "http://dev.lesso-fdfs-server.fdfs-web.172.16.90.27.xip.io/",
    auth: "http://dev.auth.authority-web-v2.172.16.90.27.xip.io/", // 2.0权限
    authLogin: "http://dev.auth.authority-account.172.16.90.27.xip.io/", // 2.0登录
  },
  qas: {
    // 测试服务器
    pms: "http://pms-server.pms-server-web.172.16.90.28.xip.io/",
    file: "http://dev.lesso-fdfs-server.fdfs-web.172.16.90.27.xip.io/",
    auth: "http://uat.auth.authority-web-v2.172.16.90.28.xip.io/", // 2.0权限
    authLogin: "http://uat.auth.authority-account.172.16.90.28.xip.io/", // 2.0登录
  },
  app: {
    // 正式服务器
    pms: "http://172.16.100.28:49269/",
    file: "http://192.168.3.197:49299/",
    auth: "http://v2.authapi.lesso.com/", // 2.0权限
    authLogin: "http://act.authapi.lesso.com/", // 2.0登录
  },
};

export default env[constant.appenv];
