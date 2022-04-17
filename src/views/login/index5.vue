<template>
    <div class="m-view-home">
      <!-- 头部 -->
      <div class="m-top">
        <!-- logo -->
        <div class="m-logo">
          <img src="@/assets/ls_logo.png" v-if="!$constant.isElectron" />
          <span class="u-goback" @click="goBack" v-else
            >&lt;返回&nbsp;&nbsp;应用平台</span
          >
          <span>{{ systemTitle }}{{ appenvZH }}</span>
        </div>
        <!-- 用户头像 -->
        <div class="m-topRight">
          <div class="m-user">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="@/assets/user.png" />
                <span>{{ $constant.user.employeeName }}</span>
                <i class="iconfont icon-xialasanjiao"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">修改密码</el-dropdown-item>
                <el-dropdown-item command="2">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="m-function" v-if="$constant.isElectron">
            <span @click="winCtrl('min')">
              <i class="iconfont icon-minimize"></i>
            </span>
            <span @click="winCtrl('max')">
              <i class="iconfont icon-maximize"></i>
            </span>
            <span @click="winCtrl('close')">
              <i class="iconfont icon-closeWin"></i>
            </span>
          </div>
        </div>
      </div>
      <!-- 左侧菜单 -->
      <div class="m-left">
        <ul>
          <li
            v-for="(item, index) in activeMenu"
            :key="index"
            @click="goMenu(item)"
            :class="{ active: item.name == titleName }"
          >
            <i :class="'iconfont icon-' + item.code"></i>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <!-- 内容主体 -->
      <div class="m-right">
        <!-- tabs标签页 -->
        <!-- v-model:选中选项卡的 name -->
        <el-tabs
          v-model="editableTabsValue"
          @tab-remove="removeTab"
          @tab-add="addTab"
          type="card"
        >
          <!-- 第一个tab标签页 -->
          <el-tab-pane :label="titleName" name="1">
            <router-view :addTab="addTab"></router-view>
          </el-tab-pane>
          <!-- 第二个标签页及以上 -->
          <el-tab-pane
            v-for="item in editableTabs"
            :label="item.title"
            :name="item.name"
            :key="item.name"
            closable
          >
            <component
              :is="item.content"
              :query="item.query"
              :addTab="addTab"
              :removeTabByCode="removeTabByCode"
            ></component>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 底部 -->
      <div class="m-statusBar">
        <span>版本号：{{ version }}{{ appenv }}</span>
      </div>
    </div>
  </template>
  
  <script>
  // 引入API相关方法(退出登录,获取token,校验密码)
  import _APIS from "@/api";
  import sendMain from "lesso-common/event/ipcRenderer";
  // 引入全局常量文件,用于显示单前程序环境
  import constant from "@/public/constant";
  import authorize from "@/public/authorize";
  import components from "./components";
  // import websocketClient from "lesso-common/public/websocketClient";
  import websocketClient from "@lesso/common-websocket";
  import EvenBus from "@/public/evenBus";
  import { TABS_CHANGE } from "@/public/evenbusConstant";
  import {
    getStorage,
    saveStorage,
    removeStorage,
    openExternalUrl,
  } from "lesso-common/public/utils";
  
  /**
   * @group Home
   * 主页面
   */
  export default {
    name: "home",
    components: components,
    data() {
      return {
        // @vuese
        // 激活的菜单列表
        activeMenu: [
          // {
          //   name: "基础数据",
          //   code: "masterData",
          //   id: 1,
          // },
          // {
          //   name: "表格示例",
          //   code: "gridExample",
          //   id: 2,
          // },
          // {
          //   name: "窗格拆分",
          //   code: "splitResizeExample",
          //   id: 3,
          // },
          // {
          //   name: "在线文档",
          //   code: "onlyOfficeExample",
          //   id: 4,
          // },
        ],
        changePassword: false,
        // @vuese
        // 当前激活的标签页
        editableTabsValue: "1",
        // @vuese
        // 当前生成的标签页组
        editableTabs: [],
        // @vuese
        // 当前激活的标签页索引
        tabIndex: 1,
        // @vuese
        // 路由标签页的标题
        titleName: "基础数据",
        // @vuese
        // 权限数据
        authData: [],
  
        // 版本号
        version: constant.appVersion,
        appenv: `(${constant.appenv})`,
        appenvZH: "",
  
        // @vuese
        // websocket实例
        wsClient: "",
        systemTitle: "绩效管理系统",
      };
    },
    created() {
      //this.getUserData();
      // 需要使用权限配置时，使用以下方法
      //this.getAuthResource();
      // 显示当前程序环境
      //this.getAppenvZH();
      // 需要使用Websocket通知时，使用以下方法
      // this.initWebsocket()
    },
    // 实例挂载前
    beforeMount() {
      EvenBus.$on(TABS_CHANGE, () => {});
    },
    // 实例销毁前
    
    beforeDestroy() {
      EvenBus.$off(TABS_CHANGE);
    },
    methods: {
      /**
       * @vuese
       * 添加用户数据到 $constant，
       * 判断从 electron/ web 方案获取用户数据
       */
      getUserData() {
        //   if (this.$constant.isElectron) {
        //     saveStorage("userData", remote.getGlobal("userData"));
        //   }
        this.$constant = Object.assign(this.$constant, getStorage("userData"));
  
        //设置sentry上报用户信息
        // this.$sentry &&
        //   this.$sentry.setUser({
        //     id: this.$constant.user.userId,
        //     name: this.$constant.user.employeeName,
        //     sapNum: this.$constant.user.sapNum,
        //   });
      },
      /**
       * @vuese
       * 返回主菜单窗口，
       * 在 electron 环境下生效
       */
      goBack() {
        sendMain("openMenuWin");
      },
      /**
       * @vuese
       * 窗口控制，
       * 在 electron 环境下生效
       *
       * @arg type:窗口按钮类型
       */
      winCtrl(type) {
        console.log(type);
        switch (type) {
          case "min":
            sendMain("minWin");
            break;
          case "max":
            sendMain("maxWin");
            break;
          case "close":
            this.$confirm("是否确定退出程序？", "消息提示", {
              distinguishCancelAndClose: true,
              showClose: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              customClass: "confirmAsk",
            })
              .then(() => {
                this.$http
                  .userLogout({
                    uid: this.$constant.user.id,
                  })
                  .then(() => {
                    sendMain("closeWin", "lis");
                  })
                  .catch(() => {
                    sendMain("closeWin", "lis");
                  });
              })
              .catch(() => {});
            break;
        }
      },
  
      /**
       * @vuese
       * 关闭标签页方法，
       *
       * 如果当前显示的tab和删除的tab是同一个tab，那删除后显示后一个tab。
       * 如果tabs的长度为1,则显示第一个tab。
       *
       * @arg targetName: 目标的tab的name
       */
      removeTab(targetName) {
        // 保存从第二个tab开始的所有tabs
        let tabs = this.editableTabs;
        // 保存选中tab的name
        let activeName = this.editableTabsValue;
        // 如果当前显示的tab和删除的tab是同一个tab，那删除后显示后一个tab
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        // 如果tabs的长度为1,则显示第一个tab
        if (tabs.length <= 1) {
          this.editableTabsValue = "1";
          // 过滤掉目标tab
          this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
          return;
        }
        this.editableTabsValue = activeName;
        // 过滤掉目标tab
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      },
  
      add(){
              
      },
      /**
       * @vuese
       * 根据页面编码关闭标签页的方法
       *
       * 如果当前显示的tab和删除的tab是同一个tab，那删除后显示后一个tab。
       * 如果tabs的长度为1,则显示第一个tab。
       *
       * @arg code: 目标的tab的code
       */
      removeTabByCode(code) {
        // 保存从第二个tab开始的所有tabs
        let tabs = this.editableTabs;
        // 保存选中tab的name
        let activeName = this.editableTabsValue;
        // 找到目标 tab
        const findTarget = tabs.find((item) => item.content === code);
        if (!findTarget) {
          return;
        }
        const targetName = findTarget.name;
        // 如果当前显示的tab和删除的tab是同一个tab，那删除后显示后一个tab
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        // 如果tabs的长度为1,则显示第一个tab
        if (tabs.length <= 1) {
          this.editableTabsValue = "1";
          // 过滤掉目标tab
          this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
          return;
        }
        this.editableTabsValue = activeName;
        // 过滤掉目标tab
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      },
  
      /**
       * @vuese
       * 新建标签页方法
       *
       * 当editableTabs有数据的时候,分两种情况:
       * 1.新建的标签已经存在在editableTabs中, 遍历editableTabs后直接切换到该tab。
       * 2.新建的标签不在editableTabs中,新建一个tab
       * @arg data: 入口按钮绑定的数据值
       * @arg query: 页面传参
       */
      addTab(data, query) {
        if (this.editableTabs.length > 0) {
          // 当editableTabs有数据的时候,分两种情况
          // 1.新建的标签已经存在在editableTabs中
          // 2.新建的标签不在editableTabs中
          var flag = false;
          var item;
          var index;
          // 遍历editableTabs
          for (var i = 0; i < this.editableTabs.length; i++) {
            // 当data中的name等于editableTabs中某一个值得title
            // 第一种情况
            if (data.name == this.editableTabs[i].title) {
              flag = true;
              item = this.editableTabs[i];
              index = i;
              break;
            }
          }
          if (flag) {
            // 直接切换到该tab
            this.editableTabsValue = item.name;
            this.$set(this.editableTabs[index], "query", query || {});
          } else {
            // 第二种情况,新建一个tab
            let newTabName = ++this.tabIndex + "";
            this.editableTabs.push({
              title: data.name,
              name: newTabName,
              content: data.code,
              query: query || {},
            });
            this.editableTabsValue = newTabName;
          }
        } else {
          let newTabName = ++this.tabIndex + "";
          this.editableTabs.push({
            title: data.name,
            name: newTabName,
            content: data.code,
            query: query || {},
          });
          this.editableTabsValue = newTabName;
        }
      },
  
      /**
       * @vuese
       * 左侧菜单切换
       *
       * @arg data: 菜单按钮绑定的数据值
       */
      goMenu(data) {
        this.editableTabsValue = "1";
        let routePath = `/home/${data.code}/${data.id}`;
        this.$router.push({
          path: routePath,
        });
        // console.log(routePath);
        this.titleName = data.name;
      },
  
      /**
       * @vuese
       * 获取左侧导航菜单用户权限
       */
      getAuthResource() {
        authorize
          .getNavAuth()
          .then((res) => {
            this.activeMenu = res;
            this.goMenu(this.activeMenu[0]);
          })
          .catch((err) => {
            this.$alert(err, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          });
      },
  
      /**
       * @vuese
       * 用户图标下拉按钮回调方法，
       * 功能：1.修改密码；2.退出登录
       *
       * @arg command: 下拉选项标记
       */
      handleCommand(command) {
        switch (command) {
          case "1":
            this.$http.modifyIDMPassword(null).then((res) => {
              let username = getStorage("userData").user.sapNum;
              let url = `${res.data}?userid=${username}`;
              openExternalUrl(url);
            });
            break;
          case "2":
            this.$confirm("是否确定退出登录？", "消息提示", {
              distinguishCancelAndClose: true,
              showClose: false,
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              customClass: "confirmAsk",
            })
              .then(() => {
                _APIS
                  .userLogout({
                    uid: this.$constant.user.id,
                  })
                  .then(() => {
                    this.goLogin();
                  })
                  .catch(() => {
                    this.goLogin();
                  });
              })
              .catch(() => {});
            break;
        }
      },
  
      /**
       * @vuese
       * 返回登录页方法，
       * 判断从 electron/ web 方案返回不同页面
       */
      goLogin() {
        // 清除用户数据
        removeStorage("userData");
  
        if (this.$constant.isElectron) {
          // 返回 Electorn 窗口
          sendMain("openLoginWin");
        } else {
          // 跳转登录页
          this.$router.push("/login");
        }
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
      },
  
      /**
       * @vuese
       * 创建websocket
       */
      initWebsocket() {
        const goLogin = () => {
          if (this.$constant.isElectron) {
            sendMain("openLoginWin");
          } else {
            this.$router.push("/login");
          }
        };
  
        // 广播通知回调
        const fanoutCallback = (msg) => {
          let res = JSON.parse(msg.body);
          console.log("ws res:", msg);
  
          // 版本号不正确广播踢线
          if (res.code == -200) {
            goLogin();
            return;
          }
          this.$notify({
            title: `系统通知`,
            message: res.message,
            type: "warning",
            duration: 0,
            position: "bottom-right",
          });
        };
  
        // 定向通知回调
        const topicCallback = (msg) => {
          let res = JSON.parse(msg.body);
          console.log("ws res:", msg);
          this.$notify({
            title: `来自${res.userName}的通知`,
            message: res.message,
            type: "warning",
            duration: 0,
            position: "bottom-right",
          });
        };
  
        // 踢线通知回调
        const logoutCallback = (forceOffline) => {
          if (forceOffline) {
            this.$alert("帐号已被强制下线", {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertPrompt",
            }).then(() => {
              this.$http
                .userLogout({
                  uid: constant.userId,
                })
                .then(() => {
                  goLogin();
                })
                .catch(() => {
                  goLogin();
                });
            });
          } else {
            this.$alert("帐号已在别处登录", {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertPrompt",
            }).then(() => {
              goLogin();
            });
          }
        };
  
        this.wsClient = new websocketClient({
          systemEnv: constant.appenv,
          userId: this.$constant.user.id,
          systemCode: this.$constant.authCode.code,
          loginTimestamp: this.$constant.timestamp,
          fanoutCallback: fanoutCallback,
          topicCallback: topicCallback,
          logoutCallback: logoutCallback,
        });
  
        this.wsClient.connect();
        // 创建Websocket实例后需要需要在销毁前断开连接
        this.$on("hook:beforeDestroy", () => {
          this.wsClient.disconnect();
        });
      },
    },
    
    // 侦听器
    watch: {
      editableTabsValue(val) {
        const findTab = this.editableTabs.find((item) => item.name === val);
        if (findTab) {
          EvenBus.$emit(TABS_CHANGE, findTab);
        }
      },
    },
  };
  </script>
  