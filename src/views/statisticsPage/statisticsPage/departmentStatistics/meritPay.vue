<!--
 * 集团统计页面-绩效工资
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-departmentStatisticsMeritPay">
    <div class="m-agTable">
      <div class="m-titleBar no-padding">
        <div class="m-title">
          <div class="m-icon">
            <i class="iconfont icon-gaikuang" />
          </div>
          <h2 class="title-text">
            {{ searchParams.departmentName }}月度绩效考核结果汇总表
          </h2>
        </div>
      </div>
      <div class="m-content resize-top">
        <ag-grid-vue
          v-loading="deductTableLoading"
          :gridOptions="deductTableOptions"
          :columnDefs="deductTableColumns"
          :rowData="deductTableData"
          class="m-agTableContent ag-theme-balham"
        />
      </div>
    </div>
    <div class="m-agTable">
      <div class="m-titleBar">
        <div class="m-title">
          <div class="m-icon">
            <i class="iconfont icon-gaikuang" />
          </div>
          <h2 class="title-text">
            {{ searchParams.departmentName }}月度绩效工资结果
          </h2>
        </div>
      </div>
      <div class="m-content">
        <ag-grid-vue
          v-loading="bonusTableLoading"
          :gridOptions="bonusTableOptions"
          :columnDefs="bonusTableColumns"
          :rowData="bonusTableData"
          class="m-agTableContent ag-theme-balham"
        />
      </div>
    </div>
  </div>
</template>
<script>
import gridOptions from "lesso-common/public/gridOptions";
import dateDay from "@/date";
export default {
  name: "departmentStatisticsMeritPay",
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
       * 月度绩效考核结果表格 ag-grid 相关数据
       */
      deductTableLoading: false, // 加载状态
      deductTableOptions: {}, // ag-grid配置
      deductTableColumns: [], // 列属性
      deductTableData: [], // 表格数据
      deductTableCurrentPage: 1, // 当前页码
      deductTablePageSize: 30, // 当前分页大小
      deductTableTotal: 0, // 总记录数量
      /**
       * @vuese
       * 月度绩效工资结果表格 ag-grid 相关数据
       */
      bonusTableLoading: false, // 加载状态
      bonusTableOptions: {}, // ag-grid配置
      bonusTableColumns: [], // 列属性
      bonusTableData: [], // 表格数据
      bonusTableCurrentPage: 1, // 当前页码
      bonusTablePageSize: 30, // 当前分页大小
      bonusTableTotal: 0, // 总记录数量
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
      this.deductTableOptions = gridOptions();
      this.deductTableColumns = [
        {
          headerName: "员工姓名",
          field: "employee",
          width: 150,
        },
        {
          headerName: "员工工号",
          field: "appEmployeeSAP",
          width: 150,
        },
        {
          headerName: "员工类型",
          field: "type",
          width: 150,
        },
        {
          headerName: "职位",
          field: "post",
          width: 150,
        },
        {
          headerName: "部门",
          field: "department",
          width: 150,
        },
        {
          headerName: "考核分数",
          field: "score",
          width: 150,
        },
        {
          headerName: "评分人",
          field: "appraiser",
          width: 150,
        },
        {
          headerName: "备注",
          field: "memo",
          width: 150,
        },
      ];

      this.bonusTableOptions = gridOptions();
      this.bonusTableColumns = [
        {
          headerName: "员工姓名",
          field: "employeeName",
          width: 200,
        },
        {
          headerName: "部门",
          field: "department",
          width: 200,
        },
        {
          headerName: "职位",
          field: "post",
          width: 200,
        },
        {
          headerName: "实发工资",
          field: "realWage",
          width: 200,
        },
        {
          headerName: "标准工资",
          field: "standardWage",
          width: 200,
        },
      ];
    },
    /**
     * @vuese
     * 获取月度绩效考核结果数据
     */
    getMonthlyPerformanceAppraisal(data) {
      this.$http
        .GetDepartMonthlyPerformanceAppraisal(data)
        .then((res) => {
          console.log(res, "res");
          if (res.data.code == 200 || res.data.code == 1) {
            this.deductTableData = res.data.rows;
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
    /**
     * @vuese
     * 获取月度绩效工资数据
     */
    getMonthlyPerformancePay(data) {
      this.$http
        .GetDepartMonthlyPerformancePay(data)
        .then((res) => {
          console.log(res, "res");
          if (res.data.code == 200 || res.data.code == 1) {
            this.bonusTableData = res.data.rows;
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
    /**
     * @vuese
     * 获取数据
     */
    getData() {
      console.log("搜索参数:", this.searchParams);
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
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
      this.getMonthlyPerformanceAppraisal(data);
      this.getMonthlyPerformancePay(data);
    },
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-departmentStatisticsMeritPay {
  height: 100%;
  padding: 0 5px;
  .m-agTable {
    position: relative;
    height: 50%;
    .m-titleBar {
      padding: 14px 0;
      .m-title {
        font-size: 0;
        .m-icon {
          display: inline-block;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: #8a8f99;
          color: #fff;
          text-align: center;
          line-height: 22px;
          .iconfont {
            font-size: 15px;
          }
        }
        .title-text {
          display: inline-block;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
    .m-content {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .no-padding {
    padding: 0 !important;
  }
  .resize-top {
    top: 35px !important;
  }
}
</style>
