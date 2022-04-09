<template>
  <div class="m-view-masterMenu m-window">
    <div class="m-module">
      <el-collapse v-model="activeName" accordion :loading="loading">
        <el-collapse-item
          v-for="(item, index) in activeMenu"
          :key="item.id"
          :title="item.name"
          :name="index"
        >
          <ul>
            <li
              v-for="child in item.children"
              :key="child.id"
              @click="addTab(child)"
            >
              <i :class="'iconfont icon-' + child.code"></i>
              <span>{{ child.name }}</span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import authorize from "@/public/authorize";
/**
 * @group gridExample
 * 表格示例 入口页面
 */
export default {
  name: "gridExample",
  data() {
    return {
      // 激活的菜单列表
      activeMenu: [],
      activeName: 0,
      loading: false,
    };
  },
  props: {
    addTab: {
      type: Function,
    },
  },
  beforeMount() {
    this.getAuth();
  },
  methods: {
    /**
     * @vuese
     * 获取权限，使用路由传入的 parentId
     */
    getAuth() {
      this.loading = true;
      let parentId = this.$route.params.pid;
      authorize.getMenuAuth(parentId).then((res) => {
        this.activeMenu = res;
        this.loading = false;
      });
    },
  },
};
</script>
