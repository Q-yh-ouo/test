<template>
  <div class="m-view-login" :style="bgStyle">
    <div class="m-nav">
      <div class="nav-right">
        <!-- <div class="nav-item">帮助手册
                </div>
                <div class="nav-item">意见反映</div>
                <div class="nav-item">联系我们</div> -->
        <!-- <div class="nav-item">语言Language</div>
        <div class="nav-item">
          <el-dropdown>
            <span class="el-dropdown-link nav-drop">
              中文<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
      </div>
    </div>
    <div class="m-content">
      <div class="m-leftImg">
        <div class="m-form">
          <div class="m-form-header">
            <img src="@/assets/ls_logo.png" />
            <!-- <p>LESSO DEMO</p> -->
          </div>
          <el-autocomplete
            v-model="user"
            :fetch-suggestions="querySearch"
            placeholder="用户名"
            :trigger-on-focus="false"
          ></el-autocomplete>
          <el-input
            v-model="pwd"
            type="password"
            placeholder="密码"
            @keyup.enter.native="login"
          ></el-input>
          <div class="m-text" @click="forgetPwd()">忘记密码？去找回</div>
          <el-button class="login-btn" @click="login">登录</el-button>
          <p class="m-tips">为保障使用流畅，推荐谷歌(Google)</p>
        </div>
      </div>
      <div class="m-rightFrom">
        <img :src="bannerUrl" alt="" />
      </div>
      <div class="m-footer">©联塑 粤ICP备13023480号</div>
    </div>
  </div>
</template>

<script>
import aes from "lesso-common/public/aes";
import waterfall from "async-es/waterfall";
import constant from "@/public/constant";
import {
  getStorage,
  saveStorage,
  openExternalUrl,
} from "lesso-common/public/utils";
/**
 * @group Login
 * 登录页面
 */
export default {
  name: "login",
  data() {
    return {
      dialogVisible: false,
      // @vuese
      // 用户名
      user: "",
      // @vuese
      // 密码
      pwd: "",
      // @vuese
      // 历史用户名列表
      sourceArr: [],
      loading: false,
      appenvZH: "",
      isIdm: "",
      bannerUrl: require("@/assets/swiper2.png"),
      bgStyle: {
        background: "url(" + require("@/assets/login_bg2.png") + ") no-repeat",
      },
    };
  },
  created() {
    this.getUserList();
    this.getAppenvZH();
  },
  mounted() {},
  methods: {
    /**
     * @vuese
     * 获取保存在 localStorage 的账号历史
     */
    getUserList() {
      if (localStorage.loginAccount == undefined) {
        saveStorage("loginAccount", []);
      }
      this.sourceArr = JSON.parse(JSON.stringify(getStorage("loginAccount")));
      if (this.sourceArr[0] != undefined) {
        this.user = this.sourceArr[0]["value"];
      }
    },
    /**
     * @vuese
     * 调用 idm 重置密码
     */
    forgetPwd() {
      this.$http.resetPwdIdm().then((res) => {
        openExternalUrl(res.data);
      });
    },

    /**
     * @vuese
     * 权限系统登录方法，默认走 idm 登录。
     * 执行顺序 getToken -> login -> getTimestamp
     */
    login() {
      if (this.user == "") {
        this.$alert("请输入用户名", {
          confirmButtonText: "确定",
        });
        return;
      }
      if (this.pwd == "") {
        this.$alert("请输入密码", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.loading = true;
      // 获取 Token
      const getToken = (callback) => {
        this.$http
          .getToken({
            tokenkey: "get",
          })
          .then((res) => {
            console.log("getToken:", res);
            let data = res.data;
            if (data.meta.code == 200) {
              //加密
              callback(null, data);
            } else {
              callback(res, 1);
            }
          })
          .catch((err) => {
            callback(err, 0);
          });
      };

      // 保存用户账号
      const saveUsername = (username) => {
        let duplicate = false;
        //登录成功时，把帐号写入 localStorage
        let obj = username;
        let sourceArr = getStorage("loginAccount");
        for (let i = 0; i < sourceArr.length; i++) {
          if (obj == sourceArr[i]["value"]) {
            sourceArr.splice(i, 1);
            i = i - 1;
            sourceArr.unshift({ value: obj });
            saveStorage("loginAccount", sourceArr);
            duplicate = true;
            break;
          }
        }
        if (!duplicate) {
          let list = [];
          if (sourceArr.length >= 5) {
            for (let j = 0; j < 4; j++) {
              list.push(sourceArr[j]);
            }
          } else {
            for (let k = 0; k < sourceArr.length; k++) {
              list.push(sourceArr[k]);
            }
          }
          list.unshift({ value: obj });
          saveStorage("loginAccount", list);
        }
      };

      // 登录
      const login = (tokenData, callback) => {
        this.$http
          .login({
            password: aes.encrypt(this.pwd, tokenData.data.tokenKey),
            methodName: "login",
            userName: this.user,
            userKey: tokenData.data.userKey,
            timestamp: tokenData.meta.timestamp,
            deviceInfo: "PC",
            isIdm: 1,
          })
          .then((res) => {
            console.log("login:", res);
            let data = res.data;
            if (data.meta.code == 200) {
              //登录成功时，把帐号写入内存
              saveUsername(this.user);
              // 字段映射，兼容旧代码使用字段
              data.data.user.userId = data.data.user.id;
              data.data.user.loginName = data.data.user.employeeName;
              console.log("userData:", data);
              //全局变量保存用户信息
              saveStorage("userData", data.data);
              Object.assign(this.$constant, data.data);
              callback(null, data.data);
            } else if (data.meta.code == 301 || data.meta.code == 302) {
              this.loading = false;
              let msg = data.meta.code == 301 ? "首次登录" : "密码已过期";
              this.$alert(`${msg}，请先去IDM网页修改密码`, {
                showClose: false,
                customClass: "alertPrompt",
              }).then(() => {
                let url = `${data.meta.msg}?userid=${this.user}`;
                openExternalUrl(url);
              });
            } else {
              callback(res, 1);
            }
          })
          .catch((err) => {
            callback(err, 0);
          });
      };

      const getTimestamp = (userData, callback) => {
        this.$http
          .getTimestamp()
          .then((res) => {
            userData.timestamp = res.data;
            //全局变量保存用户信息
            saveStorage("userData", userData);
            Object.assign(this.$constant, userData);
            this.loading = false;
            this.$router.push("/home"); //路由跳转
          })
          .catch((err) => {
            callback(err, 0);
          });
      };

      //jwt登录方法
      waterfall([getToken, login, getTimestamp], (err, result) => {
        this.loading = false;
        console.log("waterfall err:", err, result);
        let errMsg;
        if (result == 0) {
          errMsg = "登陆失败,请检查网络";
        } else if (result == 1) {
          errMsg = err.data.meta.msg;
        }
        this.$alert(errMsg, {
          confirmButtonText: "确定",
        });
      });
    },

    /**
     * @vuese
     * el-autocomplete 的返回输入建议查询方法。
     * 在输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。
     *
     * @arg queryString: 输入查询数据
     * @arg cb: autocomplete回调
     */
    querySearch(queryString, cb) {
      // 创建过滤器
      const createFilter = (queryString) => {
        return (item) => {
          return (
            item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          );
        };
      };
      let sourceArr = this.sourceArr;
      let results = queryString
        ? sourceArr.filter(createFilter(queryString))
        : sourceArr;
      cb(results);
    },

    /**
     * @vuese
     * 基于当前 constant.appenv 显示当前程序环境
     */
    getAppenvZH() {
      if (constant.appenv == "dev") {
        this.appenvZH = "(开发环境)";
      } else if (constant.appenv == "qas") {
        this.appenvZH = "(测试环境)";
      } else if (constant.appenv == "app") {
        this.appenvZH = "(正式环境)";
      }
      // console.log(this.appenvZH)
    },
  },
};
</script>

<style lang="less">
.m-view-login {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  padding-bottom: 137px;
  //   background: url('../../assets/login_bg1.png') no-repeat;
  .m-header {
    height: 26px;
    padding: 40px 0 0 40px;
    -webkit-app-region: drag;
    .m-function {
      position: absolute;
      right: 0;
      top: 0;
      margin: 15px;
      margin-left: 0;
      -webkit-app-region: no-drag;
      span {
        float: left;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        cursor: pointer;
        &:hover {
          background: #ddd;
        }
      }
    }
  }
  .m-nav {
    position: relative;
    width: 100%;
    padding: 36px 0px;
    .nav-right {
      width: 1160px;
      margin: 0 auto;
      display: flex;
      justify-content: flex-end;
      .nav-item {
        color: #222222;
        font-size: 18px;
        cursor: pointer;
        margin-left: 20px;
        .nav-drop {
          color: #222222;
          font-size: 18px;
        }
      }
    }
  }
  .m-content {
    // position: absolute;
    top: 60px;
    bottom: 137px;
    left: 0;
    right: 0;
    padding-left: 10px;
    // margin-top: 100px;
    display: flex;
    padding-right: 15px;
    justify-content: center;
    // flex-wrap: wrap-reverse;
    .el-autocomplete {
      width: 100%;
      // padding: 23px 0;
    }
    .m-rightFrom {
      position: relative;
      //   float: left;
      width: 800px;
      //   flex: 1;
      height: 480px;
      .el-carousel {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .el-carousel__container {
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: fill;
          }
        }
      }
    }
    .m-leftImg {
      position: relative;
      //   float: right;
      //   width: 40%;
      //   flex: 1;
      border: 1px solid #ebebeb;
      padding-right: 40px;
      //   height: 100%;
      //   padding-top: 40px;
      box-shadow: 0px 6px 20px 0px rgba(153, 162, 157, 0.32);
      background: #fff;
      .m-form {
        width: 280px;
        // height: 256px;
        // position: absolute;
        // // left: 50px;
        // top: 40px;
        margin: 40px 0 0 50px;
        .login-btn {
          color: #fff;
          border: none;
          background: #0c82d7;
        }
        .m-form-header {
          text-align: center;
          margin-bottom: 17px;
          p:nth-of-type(1) {
            font-size: 25px;
            font-weight: bold;
            color: #8a8f99;
            margin-top: 20px;
          }
          p:nth-of-type(2) {
            font-size: 14px;
            color: #8a8f99;
            margin-top: 5px;
          }
        }
        .m-text {
          margin-top: 10px;
          font-size: 12px;
          color: #999999;
          cursor: pointer;
          text-align: right;
        }
        input {
          margin-top: 23px;
        }
        button {
          width: 100%;
          margin-top: 10px;
        }
        .m-tips {
          font-size: 13px;
          color: #24b36b;
          margin-top: 20px;
          text-align: center;
        }
      }
    }
  }
  .m-footer {
    //   height: 137px;
    //   line-height: 137px;
    width: 100%;
    color: #cccccc;
    font-size: 13px;
    text-align: center;
    position: absolute;
    bottom: 30px;
  }
}
@media screen and (max-width: 960px) {
  .m-content {
    justify-content: center;
    .m-rightFrom {
      display: none;
    }
    .m-leftImg {
      width: 480px;
      padding: 40px 0 20px 0;
      justify-content: center;
      border: 1px solid #ebebeb;
      .m-form {
        margin: auto !important;
      }
    }
  }
  .m-view-login {
    background-image: none !important;
  }
}
</style>
