<!--
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="quarter-picker">
    <mark class="mark" v-show="showSeason" @click.stop="showSeason = false" />
    <el-input
      v-model="showValue"
      :disabled="disabled"
      readonly
      placeholder="请选择季度"
      @focus="showSeason = true"
    >
      <i
        slot="prefix"
        class="el-input__icon el-icon-date"
        style="cursor: pointer"
        @click="showSeason = true"
      />
    </el-input>
    <el-card class="box-card" v-show="showSeason">
      <div
        slot="header"
        class="clearfix"
        style="text-align: center; padding: 0"
      >
        <button
          type="button"
          aria-label="前一年"
          class="
            el-picker-panel__icon-btn
            el-date-picker__prev-btn
            el-icon-d-arrow-left
          "
          @click="prev"
        />
        <span role="button" class="el-date-picker__header-label">
          {{ year }}年
        </span>
        <button
          type="button"
          aria-label="后一年"
          @click="next"
          class="
            el-picker-panel__icon-btn
            el-date-picker__next-btn
            el-icon-d-arrow-right
          "
        />
      </div>
      <div>
        <el-button
          class="quarter-btn"
          style="float: left; width: 40%"
          plain
          @click="selectSeason(0)"
        >
          第一季度
        </el-button>
        <el-button
          class="quarter-btn"
          style="float: right; width: 40%"
          plain
          @click="selectSeason(1)"
        >
          第二季度
        </el-button>
      </div>
      <div>
        <el-button
          class="quarter-btn"
          style="float: left; width: 40%"
          plain
          @click="selectSeason(2)"
        >
          第三季度
        </el-button>
        <el-button
          class="quarter-btn"
          style="float: right; width: 40%"
          plain
          @click="selectSeason(3)"
        >
          第四季度
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "quarterPicker",
  // 依赖组件
  components: {},
  model: {
    prop: "value",
    event: "change",
  },
  // 接口（组件的接口）
  props: {
    valueArr: {
      type: Array,
      default: () => ["01-03", "04-06", "07-09", "10-12"],
    },
    value: {
      type: Array,
      default: () => [],
    },
    defaultValue: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  // 响应式数据
  data() {
    return {
      name: "quarterPicker",
      showSeason: false,
      season: "",
      year: new Date().getFullYear(),
      showValue: "",
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  created() {
    if (this.value && this.value.length > 1) {
      const value = this.value;
      this.year = new Date(value[0]).getFullYear();
      const startMonth = new Date(value[0]).getMonth() + 1;
      const endMonth = new Date(value[1]).getMonth() + 1;
      const str = `${startMonth < 10 ? `0${startMonth}` : startMonth}-${
        endMonth < 10 ? `0${endMonth}` : endMonth
      }`;
      this.showValue = `${this.year}年${this.valueArr.indexOf(str) + 1}季度`;
    }
  },
  // 实例挂载前
  beforeMount() {},
  // 实例挂载完成
  mounted() {},
  // 实例销毁前
  beforeDestroy() {},
  // 实例内函数
  methods: {
    one() {
      this.showSeason = false;
    },
    prev() {
      this.year = this.year * 1 - 1;
    },
    next() {
      this.year = this.year * 1 + 1;
    },
    selectSeason(i) {
      this.season = i + 1;
      const arr = this.valueArr[i].split("-");
      this.$emit("change", [
        new Date(this.year, Number(arr[0]) - 1, 1),
        new Date(this.year, Number(arr[1]), 0),
      ]);
      this.showSeason = false;
      this.showValue = `${this.year}年${this.season}季度`;
    },
  },
  // 侦听器
  watch: {
    value(val) {
      this.year = new Date(val[0]).getFullYear();
      const startMonth = new Date(val[0]).getMonth() + 1;
      const endMonth = new Date(val[1]).getMonth() + 1;
      const str = `${startMonth < 10 ? `0${startMonth}` : startMonth}-${
        endMonth < 10 ? `0${endMonth}` : endMonth
      }`;
      this.showValue = `${this.year}年${this.valueArr.indexOf(str) + 1}季度`;
    },
  },
};
</script>
<style lang="less" scoped>
.quarter-picker {
  /deep/ .el-input {
    input {
      cursor: pointer;
    }
  }
  .mark {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
  }
  .box-card {
    width: 322px;
    padding: 0 3px 20px;
    margin-top: 10px;
    position: fixed;
    z-index: 9999;
  }
  /deep/ .el-card__header {
    padding: 12px;
    & > div {
      height: 30px;
      line-height: 30px;
    }
  }
  .quarter-btn {
    color: #606266;
    border: none;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
