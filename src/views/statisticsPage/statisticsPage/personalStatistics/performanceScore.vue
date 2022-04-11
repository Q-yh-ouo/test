<!--
 * 集团统计页面-绩效得分
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-personalStatisticsPerformanceScore">
    <div class="m-agTable">
      <div class="m-titleBar">
        <div class="m-title">
          <div class="m-icon">
            <i class="iconfont icon-gaikuang" />
          </div>
          <h2 class="title-text">{{ name + date }}年月度考核表</h2>
        </div>
      </div>
      <div class="m-content">
        <ag-grid-vue
          v-loading="mainTableLoading"
          :gridOptions="mainTableOptions"
          :columnDefs="mainTableColumns"
          :rowData="mainTableData"
          class="m-agTableContent ag-theme-balham"
        />
      </div>
    </div>
    <div class="m-chart">
      <div class="m-title">{{ name }}绩效得分折线图</div>
      <div class="m-content">
        <!-- <ve-line
          v-if="refreshVeLine"
          :data="chartData"
          :legend-visible="false"
          height="100%"
        /> -->
        <div style="height: 90%" v-if="refreshVeLine">
          <div class="m-chart" style="height: 100%">
            <div
              class="m-eChart"
              style="height: 100%"
              id="personalStatisticsPerformaceScoreChart"
            ></div>
          </div>
        </div>
        <div class="no-data-chart" v-else>暂无绩效得分折线图数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import gridOptions from "lesso-common/public/gridOptions";
// import VeLine from "v-charts/lib/line";
import dateDay from "@/date";
import * as echarts from "echarts";
export default {
  name: "personalStatisticsPerformanceScore",
  // 依赖组件
  components: {
    // VeLine,
  },
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
      /**
       * @vuese
       * 折线图数据
       */
      chartData: {
        columns: ["date", "score"],
        rows: [
          { date: "一月", score: 0 },
          { date: "二月", score: 0 },
          { date: "三月", score: 0 },
          { date: "四月", score: 0 },
          { date: "五月", score: 0 },
          { date: "六月", score: 0 },
          { date: "七月", score: 0 },
          { date: "八月", score: 0 },
          { date: "九月", score: 0 },
          { date: "十月", score: 0 },
          { date: "十一月", score: 0 },
          { date: "十二月", score: 0 },
        ],
      },
      name: "",
      date: "",
      refreshVeLine: true,
      regionala: {},
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
  mounted() {
    this.regional();
    window.onresize = function () {
      echarts
        .init(document.getElementById("personalStatisticsPerformaceScoreChart"))
        .resize();
    };
  },
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

      this.mainTableColumns = [
        {
          headerName: "被考核员工名称",
          field: "name",
        },
        {
          headerName: "被考核员工部门",
          field: "department",
        },
        {
          headerName: "被考核员工职位",
          field: "post",
        },
        {
          headerName: "被考核员工是否试用",
          field: "probation",
        },
        {
          headerName: "1月得分",
          field: "jan",
        },
        {
          headerName: "2月得分",
          field: "feb",
        },
        {
          headerName: "3月得分",
          field: "mar",
        },
        {
          headerName: "4月得分",
          field: "apr",
        },
        {
          headerName: "5月得分",
          field: "may",
        },
        {
          headerName: "6月得分",
          field: "jun",
        },
        {
          headerName: "7月得分",
          field: "jul",
        },
        {
          headerName: "8月得分",
          field: "aug",
        },
        {
          headerName: "9月得分",
          field: "sep",
        },
        {
          headerName: "10月得分",
          field: "oct",
        },
        {
          headerName: "11月得分",
          field: "nov",
        },
        {
          headerName: "12月得分",
          field: "dec",
        },
        {
          headerName: "年度平均分",
          field: "average",
        },
      ];
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
      this.$http
        .GetDefaultPerformanceScore(data)
        .then((res) => {
          if (res.data.code == 200 || res.data.code == 1) {
            this.mainTableData = res.data.rows;
            // this.chartData.rows = res.data.rows[0].yearScore;
            // this.name = this.mainTableData[0].name;
            this.name = this.$utils.getStorage("userData").user.employeeName;
            this.date = thisMonth.startDay.substr(0, 4);
            if (
              !res.data.rows[0].yearScore ||
              res.data.rows[0].yearScore.length == 0
            ) {
              this.refreshVeLine = false;
              return;
            }
            res.data.rows[0].yearScore.forEach((item, index) => {
              this.chartData.rows[index].score = item;
            });
            this.regionala.setOption({
              series: [
                {
                  data: res.data.rows[0].yearScore,
                },
              ],
            });
            this.$nextTick(() => {
              this.refreshVeLine = true;
            });
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
    regional() {
      this.regionala = echarts.init(
        document.getElementById("personalStatisticsPerformaceScoreChart")
      );
      this.regionala.setOption({
        grid: {
          top: 25,
          left: 30,
          right: 0,
          bottom: 25,
        },
        legend: {
          data: [],
          right: 0,
          top: 0,
          textStyle: {
            color: "#8A8E99",
          },
        },
        xAxis: {
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisLabel: {
            color: "#8A8E99",
          },
          axisLine: {
            lineStyle: {
              color: "#F5F7FA",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#8A8E99",
          },
          splitLine: {
            lineStyle: {
              color: "#F5F7FA",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#F5F7FA",
            },
          },
        },
        series: [
          {
            name: "得分",
            type: "line",
            symbol: "circle",
            symbolSize: 6,
            itemStyle: {
              color: "#8A8E99",
              normal: {
                color: "#4F8CF6",
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(250, 252, 255, 1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(209, 226, 255, 0)",
                  },
                ]),
              },
            },
            // smooth: true,
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
      });
    },
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-personalStatisticsPerformanceScore {
  height: 100%;
  padding: 0 5px;
  .m-agTable {
    position: relative;
    height: 40%;
    .m-titleBar {
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
      top: 32px;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .m-chart {
    position: relative;
    height: 60%;
    margin-top: 15px;
    .m-title {
      height: 30px;
      line-height: 30px;
      color: #8a8f99;
      font-size: 16px;
      text-align: center;
    }
    .m-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .no-data-chart {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -77px;
  }
}
</style>
