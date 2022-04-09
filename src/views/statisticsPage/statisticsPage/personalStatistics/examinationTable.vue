<!--
 * 集团统计页面-考核表
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-personalStatisticsExaminationTable">
    <!-- <div class="m-titleBar">
      <div class="m-title">
        <div class="m-icon">
          <i class="iconfont icon-gaikuang" />
        </div>
        <h2 class="title-text">考核表</h2>
      </div>
    </div> -->
    <!-- 主表格 当表格有页码时，m-agTable 后面应加上 m-bottom -->
    <div class="m-agTable">
      <ag-grid-vue
        v-loading="mainTableLoading"
        :gridOptions="mainTableOptions"
        :columnDefs="mainTableColumns"
        :rowData="mainTableData"
        class="m-agTableContent ag-theme-balham"
      />
    </div>
    <!-- /主表格 -->
  </div>
</template>
<script>
import Vue from "vue";
import gridOptions from "lesso-common/public/gridOptions";
import dateDay from "@/date";
const tooltipForCell = Vue.extend({
  template: `<el-tooltip 
    class="item" 
    effect="dark" 
    :content="params.value" 
    placement="top-start">
    <span>{{params.value}}</span>
  </el-tooltip>`,
});

export default {
  name: "personalStatisticsExaminationTable",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {
    searchParams: {
      type: Object,
      default: () => {},
    },
  },
  // 响应式数据
  data() {
    return {
      /**
       * @vuese
       * 表格分页大小选项
       */
      tableSizeList: [30, 50, 100, 150, 200],
      /**
       * @vuese
       * 页面表格 ag-grid 相关数据
       */
      mainTableLoading: false, // 加载状态
      mainTableOptions: {}, // ag-grid配置
      mainTableColumns: [], // 列属性
      mainTableData: [], // 表格数据
      mainTableCurrentPage: 1, // 当前页码
      mainTablePageSize: 30, // 当前分页大小
      mainTableTotal: 0, // 总记录数量
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  created() {},
  // 实例挂载前
  beforeMount() {
    // 初始化ag-grid表格配置
    this.initGrid();
  },
  // 实例挂载完成
  mounted() {},
  // 实例销毁前
  beforeDestroy() {},
  // 实例内函数
  methods: {
    /**
     * @vuese
     * 初始化ag-grid表格配置
     */
    initGrid() {
      this.mainTableOptions = gridOptions();
      let thisMonth = dateDay.dateHandle(this.searchParams.date);
      let lastMonth = dateDay.lastdate(this.searchParams.date);
      let data = {
        sapnum: this.$constant.user.sapNum,
        company: this.searchParams.companyId,
        department: this.searchParams.departmentId,
        departmentName: this.searchParams.departmentName,
        month: thisMonth.month,
        beginDate: thisMonth.startDay,
        endDate: thisMonth.endDay,
        lastMonth: lastMonth.month,
        lastBeginDate: lastMonth.startDay,
        lastEndDate: lastMonth.endDay,
        subdivisionsDepartment: this.searchParams.subdivisionsDeptId,
      };
      this.$http
        .GetDefaultProgressReviewHeader(data)
        .then((res) => {
          console.log(res, "res");
          if (res.data.code == 200 || res.data.code == 1) {
            res.data.rows.map((item) => {
              if (
                item.field == "companyName" ||
                item.field == "companyFullName"
              ) {
                item.cellRendererFramework = tooltipForCell;
                return item;
              }
            });
            this.mainTableColumns = res.data.rows;
          } else {
            this.$Msg.warning(res.data.info);
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$Msg.error(err.response.data.info);
          }
        });
      // this.mainTableColumns = [
      //   {
      //     headerName: "指标名称",
      //     field: "companyCode",
      //   },
      //   {
      //     headerName: "二级指标",
      //     field: "companyName",
      //     cellRendererFramework: tooltipForCell,
      //   },
      //   {
      //     headerName: "指标定义",
      //     field: "companyFullName",
      //     cellRendererFramework: tooltipForCell,
      //   },
      //   {
      //     headerName: "目标",
      //     field: "creator",
      //   },
      //   {
      //     headerName: "权重%",
      //     field: "createTime",
      //   },
      //   {
      //     headerName: "评分细则",
      //     field: "updator",
      //   },
      //   {
      //     headerName: "考核周期",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "协助人",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "考核目的",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "完成情况",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "考核得分",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "评定理由",
      //     field: "updateTime",
      //   },
      //   {
      //     headerName: "备注",
      //     field: "updateTime",
      //   },
      // ];
    },
    /**
     * @vuese
     * 获取数据
     */
    getData() {
      console.log("搜索参数:", this.searchParams);
      let thisMonth = dateDay.dateHandle(this.searchParams.date);
      let lastMonth = dateDay.lastdate(this.searchParams.date);
      let data = {
        sapnum: this.$constant.user.sapNum,
        company: this.searchParams.companyId,
        department: this.searchParams.departmentId,
        departmentName: this.searchParams.departmentName,
        month: thisMonth.month,
        beginDate: thisMonth.startDay,
        endDate: thisMonth.endDay,
        lastMonth: lastMonth.month,
        lastBeginDate: lastMonth.startDay,
        lastEndDate: lastMonth.endDay,
        subdivisionsDepartment: this.searchParams.subdivisionsDeptId,
      };
      this.$http
        .GetDefaultProgressReviewDetail(data)
        .then((res) => {
          if (res.data.code == 200 || res.data.code == 1) {
            this.mainTableData = res.data.rows;
          } else {
            this.$Msg.warning(res.data.info);
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$Msg.error(err.response.data.info);
          }
        });
    },
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-personalStatisticsExaminationTable {
  height: 100%;
  padding: 0 5px;
  // .m-titleBar {
  //   .m-title {
  //     font-size: 0;
  //     .m-icon {
  //       display: inline-block;
  //       width: 22px;
  //       height: 22px;
  //       border-radius: 50%;
  //       background-color: #8a8f99;
  //       color: #fff;
  //       text-align: center;
  //       line-height: 22px;
  //       .iconfont {
  //         font-size: 15px;
  //       }
  //     }
  //     .title-text {
  //       display: inline-block;
  //       height: 22px;
  //       line-height: 22px;
  //       font-size: 14px;
  //       margin-left: 5px;
  //     }
  //   }
  // }
  .m-agTable {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
