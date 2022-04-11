<!--
 * 集团统计页面-首页
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-personalStatisticsHome">
    <div class="m-personalStatisticsHome-top">
      <div class="m-item">
        <div class="m-item-main">
          <div class="m-titleBar">
            <div class="m-title">
              <div class="m-icon">
                <i class="iconfont icon-gaikuang" />
              </div>
              <h2 class="title-text">月度得分概况</h2>
            </div>
          </div>
          <div class="m-content">
            <div class="m-list">
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.rank }}</p>
                  <p class="m-col-title">部门排名</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastRank }}）
                  </p>
                </li>
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.score }}</p>
                  <p class="m-col-title">个人得分</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastScore }}）
                  </p>
                </li>
              </ul>
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.average }}</p>
                  <p class="m-col-title">平均分</p>
                </li>
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.standard }}</p>
                  <p class="m-col-title">绩效达标</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="m-item">
        <div class="m-item-main">
          <div class="m-titleBar">
            <div class="m-title">
              <div class="m-icon">
                <i class="iconfont icon-fenhongqingkuang" />
              </div>
              <h2 class="title-text">绩效分析情况</h2>
            </div>
          </div>
          <div class="m-content">
            <div class="m-list">
              <ul class="m-row compare-score">
                <div class="line" />
                <div class="score highest">
                  <div>
                    <div class="score-num" v-if="scoreData.getEmployee">
                      {{ scoreData.getEmployee.topScore }}
                    </div>
                    <span class="score-title">最高分</span>
                  </div>
                </div>
                <div class="differ">
                  <p>极值</p>
                  <p v-if="scoreData.getEmployee">
                    {{ scoreData.getEmployee.different }}分
                  </p>
                </div>
                <div class="score minimum">
                  <div class="score-num" v-if="scoreData.getEmployee">
                    {{ scoreData.getEmployee.lowestScore }}
                  </div>
                  <span class="score-title">最低分</span>
                </div>
              </ul>
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num" v-if="scoreData.getEmployee">
                    {{ scoreData.getEmployee.topRank }}
                  </p>
                  <p class="m-col-title">最高分排名</p>
                </li>
                <li class="m-col">
                  <p class="m-col-num" v-if="scoreData.getEmployee">
                    {{ scoreData.getEmployee.lowestRank }}
                  </p>
                  <p class="m-col-title">最低分排名</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="m-item">
        <div class="m-item-main">
          <div class="m-titleBar">
            <div class="m-title">
              <div class="m-icon">
                <i class="iconfont icon-pingshenjieguo" />
              </div>
              <h2 class="title-text">上季度评级结果</h2>
            </div>
          </div>
          <div class="m-content">
            <div class="m-list">
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getQuarter.average }}</p>
                  <p class="m-col-title">季度平均分</p>
                </li>
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getQuarter.pfmRating }}</p>
                  <p class="m-col-title">季度级别</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-personalStatisticsHome-target">
      <div class="m-titleBar">
        <div class="m-title">
          <div class="m-icon">
            <i class="iconfont icon-gaikuang" />
          </div>
          <h2 class="title-text">指标得失</h2>
        </div>
      </div>
      <ul class="m-target-list">
        <li class="target-item">
          <p>失分指标:</p>
          <p class="goaltext">
            {{
              lostDetailList.length == 0
                ? "无"
                : scoreData.getLostDetail.length > 0
                ? scoreData.getLostDetail.lostDetail
                : "无"
            }}
          </p>
        </li>
        <li class="target-item">
          <p>加分指标:</p>
          <p
            v-html="
              scoreData.getLostDetail.length > 0
                ? scoreData.getLostDetail[0].plusDetail
                : '无'
            "
            class="goaltext"
          ></p>
        </li>
        <li class="target-item">
          <p>高分指标:</p>
        </li>
      </ul>
      <!-- <div class="m-content">
        <div class="m-chart">
          <div class="m-title">{{ name }}绩效得分折线图</div>
          <div class="m-content">
            <ve-line
              v-if="refreshVeLine"
              :data="chartData"
              :legend-visible="false"
              height="100%"
            />
          </div>
        </div>
      </div> -->
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
                id="personalStatisticsHomeChart"
              ></div>
            </div>
          </div>
          <div class="no-data-chart" v-else>暂无绩效得分折线图数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import VeLine from "v-charts/lib/line";
import dateDay from "@/date";
import * as echarts from "echarts";
export default {
  name: "personalStatisticsHome",
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
      lostDetailList: [],
      scoreData: {
        getScore: {
          rank: "",
          lastRank: "",
          score: "",
          lastScore: "",
          average: "",
          standard: "",
        },
        getEmployee: {
          topScore: "",
          lowestScore: "",
          different: "",
          topRank: "",
          lowestRank: "",
        },
        getLostDetail: [
          {
            lostDetail: "",
            plusDetail: "",
          },
        ],
        getQuarter: {},
        getSummaryData: {},
      },
      refreshVeLine: true,
      regionala: {},
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  created() {},
  // 实例挂载前
  beforeMount() {},
  // 实例挂载完成
  mounted() {
    this.regional();
    window.onresize = function () {
      echarts
        .init(document.getElementById("personalStatisticsHomeChart"))
        .resize();
    };
  },
  // 实例销毁前
  beforeDestroy() {},
  // 实例内函数
  methods: {
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
      this.$http.GetDefaultMessagePerson(data).then((res) => {
        const { code, rows, info } = res.data;
        if (code == 200 || code == 1) {
          this.scoreData = res.data.rows[0];
          this.scoreData.getScore.average =
            res.data.rows[0].getScore.average.toFixed(2);
          // this.name = res.data.rows[0].getSummaryData.name;
          this.name = this.$utils.getStorage("userData").user.employeeName;
          this.lostDetailList = res.data.rows[0].getLostDetail.map((item) => {
            return item.lostDetail;
          });
          let summaryData = res.data.rows[0].getSummaryData;
          console.log(summaryData, "summaryData");
          if (!summaryData || summaryData.yearScore.length == 0) {
            this.refreshVeLine = false;
            return;
          }
          summaryData.yearScore.forEach((item, index) => {
            this.chartData.rows[index].score = item;
          });
          this.regionala.setOption({
            series: [
              {
                data: summaryData.yearScore,
              },
            ],
          });
          // this.refreshVeLine = false;
          this.$nextTick(() => {
            this.refreshVeLine = true;
          });
        } else {
          this.$Msg.warning(info);
        }
        this.scoreData = res.data.rows[0];
        this.scoreData.getScore.average =
          res.data.rows[0].getScore.average.toFixed(2);
        this.name = res.data.rows[0].getSummaryData.name;
        this.lostDetailList = res.data.rows[0].getLostDetail.map((item) => {
          return item.lostDetail;
        });
        let summaryData = res.data.rows[0].getSummaryData;
        summaryData.yearScore.forEach((item, index) => {
          this.chartData.rows[index].score = item;
        });
        this.refreshVeLine = false;
        this.$nextTick(() => {
          this.refreshVeLine = true;
        });
      });
    },
    regional() {
      this.regionala = echarts.init(
        document.getElementById("personalStatisticsHomeChart")
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
.m-personalStatisticsHome {
  height: 100%;
  padding: 0 5px;
  .m-personalStatisticsHome-top {
    // height: 260px;
    height: 220px;
    font-size: 0;
    .m-item {
      display: inline-block;
      box-sizing: border-box;
      width: 33.33333%;
      height: 100%;
      vertical-align: middle;
      &:nth-child(1) {
        padding-right: 10px;
      }
      &:nth-child(2) {
        padding: 0 10px;
        .m-item-main {
          .m-titleBar {
            .m-title {
              .m-icon {
                .iconfont {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      &:nth-child(3) {
        padding-left: 10px;
      }
      &-main {
        position: relative;
        box-sizing: border-box;
        height: 100%;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        .m-titleBar {
          padding-bottom: 16px;
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
          top: 48px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          .m-list {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            .m-row {
              position: relative;
              font-size: 0;
              padding: 20px 0;
              border-top: 1px solid #edeff2;
              &:nth-child(1) {
                border-top: none;
              }
              .m-col {
                display: inline-block;
                width: 50%;
                text-align: center;
                &-num {
                  color: #2e3033;
                  font-size: 20px;
                  font-weight: bold;
                }
                &-title {
                  margin-top: 5px;
                  color: #555;
                  font-size: 14px;
                }
                &-desc {
                  margin-top: 5px;
                  color: #8a8f99;
                  font-size: 12px;
                }
              }
              &.compare-score {
                height: 71px;
                .line {
                  position: absolute;
                  height: 3px;
                  top: 50%;
                  left: 0;
                  right: 0;
                  transform: translateY(-50%);
                  background: linear-gradient(270deg, #d5cfff, #4f8cf6);
                }
                .score {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  // margin-top: -19px;
                  text-align: center;
                  background-color: #fff;
                  &.highest {
                    left: 8%;
                    padding: 0 5px;
                  }
                  &.minimum {
                    right: 8%;
                    padding: 0 5px;
                  }
                  &-num {
                    color: #2e3033;
                    font-size: 26px;
                    font-weight: bold;

                    position: absolute;
                    top: -30px;
                    left: 50%;
                    -webkit-transform: translateX(-50%);
                    transform: translateX(-50%);
                  }
                  &-title {
                    background-color: #fff;
                    color: #555;
                    font-size: 14px;
                  }
                }
                .differ {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  p {
                    font-size: 12px;
                    color: #8a8f99;
                    text-align: center;
                    &:nth-child(2) {
                      margin-top: 20px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .m-personalStatisticsHome-target {
    position: absolute;
    // top: 280px;
    top: 243px;
    left: 0;
    right: 0;
    bottom: 0;
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
    .m-target-list {
      margin-top: 10px;
      font-size: 0;
      // text-align: center;
      .target-item {
        // display: inline-block;
        // margin-left: 15px;
        color: #555;
        font-size: 13px;
        font-weight: bold;
        // &:nth-child(1) {
        //   margin-left: 0;
        // }
        .goaltext {
          text-indent: 2em;
        }
      }
    }
    .m-content {
      position: absolute;
      // top: 59px;
      // top: 100px;
      top: 132px;
      left: 0;
      right: 0;
      bottom: 0;
      .m-chart {
        height: 100%;
      }
    }
    .m-chart {
      height: 100%;
      margin-top: 15px;
      .m-title {
        height: 30px;
        line-height: 30px;
        color: #8a8f99;
        font-size: 22px;
        text-align: center;
      }
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
