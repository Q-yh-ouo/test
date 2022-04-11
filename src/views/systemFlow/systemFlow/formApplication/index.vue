<!--
 * @author: 郭湛良-景兴
 * @since: 2021-05-25
-->
<template>
  <div class="m-window m-formApplication">
    <el-tabs type="border-card" tab-position="bottom">
      <el-tab-pane label="流程表单">
        <workFlowForm :btnPermissions="btnPermissions" />
      </el-tab-pane>
      <el-tab-pane label="流程图">流程图</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import workFlowForm from "./form";

export default {
  name: "formApplication",
  // 依赖组件
  components: {
    workFlowForm,
  },
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "formApplication",
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        add: true, // 新增
        edit: true, // 编辑
        delete: true, // 删除
        import: true, // 导入
        export: true, // 导出
      },
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  created() {
    // 初始化操作按钮权限
    this.initAuthBtn();
  },
  // 实例挂载前
  beforeMount() {},
  // 实例挂载完成
  mounted() {},
  // 实例销毁前
  beforeDestroy() {},
  // 实例内函数
  methods: {
    /**
     * @vuese
     * 初始化按钮权限
     */
    initAuthBtn() {
      authorize.getBtnAuth(this.name, this.btnPermissions);
    },
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-window {
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  &.m-formApplication {
    /deep/ .el-tabs__header.is-bottom {
      margin-top: 0;
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
    }
    /deep/ .el-tabs__content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 39px;
      left: 0;
      padding: 0;
      overflow: hidden;
    }
    /deep/ .el-tabs__nav-scroll {
      background-color: transparent;
    }
    /deep/ .el-tabs__item {
      background-color: transparent;
      &.is-active {
        background-color: #fff;
      }
    }
    /deep/ .el-tabs--border-card {
      border: none;
    }
  }
}
</style>
