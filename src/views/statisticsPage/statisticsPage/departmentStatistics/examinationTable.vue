<!--
 * 集团统计页面-考核表
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-departmentStatisticsExaminationTable">
    <div class="m-agTable">
      <div class="m-titleBar">
        <div class="m-title">
          <div class="m-icon">
            <i class="iconfont icon-gaikuang" />
          </div>
          <h2 class="title-text">
            {{
              searchParams.departmentName +
              date +
              "年月度考核结果统计表（原始分）"
            }}
          </h2>
        </div>
      </div>
      <div class="m-content">
        <ag-grid-vue
          v-loading="deductTableLoading"
          :gridOptions="deductTableOptions"
          :columnDefs="deductTableColumns"
          :rowData="deductTableData"
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
  name: "departmentStatisticsExaminationTable",
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
       * 部门月度考核结果统计表表格 ag-grid 相关数据
       */
      deductTableLoading: false, // 加载状态
      deductTableOptions: {}, // ag-grid配置
      deductTableColumns: [], // 列属性
      deductTableData: [], // 表格数据
      deductTableCurrentPage: 1, // 当前页码
      deductTablePageSize: 30, // 当前分页大小
      deductTableTotal: 0, // 总记录数量

      date: "",
      month: [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ],
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
          headerName: "被考核员工名称",
          field: "name",
          width: 140,
        },
        {
          headerName: "被考核员工部门",
          field: "department",
          width: 140,
        },
        {
          headerName: "被考核员工职位",
          field: "post",
          width: 140,
        },
        {
          headerName: "被考核员工是否试用",
          field: "probation",
          width: 150,
        },
        {
          headerName: "1月得分",
          field: "jan",
          width: 100,
        },
        {
          headerName: "2月得分",
          field: "feb",
          width: 100,
        },
        {
          headerName: "3月得分",
          field: "mar",
          width: 100,
        },
        {
          headerName: "4月得分",
          field: "apr",
          width: 100,
        },
        {
          headerName: "5月得分",
          field: "may",
          width: 100,
        },
        {
          headerName: "6月得分",
          field: "jun",
          width: 100,
        },
        {
          headerName: "7月得分",
          field: "jul",
          width: 100,
        },
        {
          headerName: "8月得分",
          field: "aug",
          width: 100,
        },
        {
          headerName: "9月得分",
          field: "sep",
          width: 100,
        },
        {
          headerName: "10月得分",
          field: "oct",
          width: 100,
        },
        {
          headerName: "11月得分",
          field: "nov",
          width: 100,
        },
        {
          headerName: "12月得分",
          field: "dec",
          width: 100,
        },
        {
          headerName: "年度平均分",
          field: "average",
          width: 100,
        },
      ];
    },
    /**
     * @vuese
     * 获取数据
     */
    getData() {
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
      this.$http
        .GetDepartYearlyPerformanceAppraisal(data)
        .then((res) => {
          if (res.data.code == 200 || res.data.code == 1) {
            // this.deductTableData = res.data.rows;
            this.date = thisMonth.startDay.substr(0, 4);
            this.deductTableData = res.data.rows.slice(0, res.data.total - 1);
            let countList = res.data.rows.slice(-1)[0];
            let countValue = [
              {
                name: "最高分",
                header: "t",
              },
              {
                name: "最低分",
                header: "l",
              },
              {
                name: "平均值",
                header: "a",
              },
            ];
            let countData = this.handleCountData(countList, countValue);
            this.deductTableOptions.api.setPinnedBottomRowData(countData);
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
    handleCountData(data, value) {
      let arr = [];
      if (data) {
        value.forEach((item) => {
          let obj = {};
          let mold = { name: item.name };
          this.month.forEach((items) => {
            let name = items.charAt(0).toUpperCase() + items.slice(1);
            let str = { [items]: data[`${item.header}${name}`] };
            obj = { ...obj, ...str };
          });
          obj = { ...mold, ...obj };
          arr.push(obj);
        });
      }
      return arr;
    },
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-departmentStatisticsExaminationTable {
  height: 100%;
  padding: 0 5px;
  .m-agTable {
    position: relative;
    height: 100%;
    .m-titleBar {
      // padding: 14px 0;
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
      top: 35px;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
