import { checkIsElectron } from "lesso-common/public/utils";
const { APP_ENV, VERSION } = process.env;

let constant = {
  // 程序环境(app|qas|dev)
  appenv: APP_ENV ? APP_ENV : "dev",

  isElectron: checkIsElectron(),

  authCode: { code: "pms-admin", tcode: "hcm-group" },

  systemCode: "pms",

  version: VERSION, //package.json版本号
};

export default constant;
