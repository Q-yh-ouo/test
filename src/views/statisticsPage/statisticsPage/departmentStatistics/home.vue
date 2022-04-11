<!--
 * 集团统计页面-首页
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-personalStatisticsHome">
    <div class="m-personalStatisticsHome-top">
      <div class="m-item">
        <div class="m-item-main resize-height">
          <div class="m-titleBar">
            <div class="m-title">
              <div class="m-icon">
                <i class="iconfont icon-gaikuang" />
              </div>
              <h2 class="title-text">月度得分概况</h2>
            </div>
          </div>
          <div class="m-content-left-top">
            <div class="m-list">
              <!-- 1122 -->
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.employeeNum }}</p>
                  <p class="m-col-title">考核人数</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastEmployeeNum }}）
                  </p>
                </li>
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.coverage }}%</p>
                  <p class="m-col-title">考核覆盖率</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastCoverage }}%）
                  </p>
                </li>
              </ul>
            </div>
            <div class="m-list">
              <!-- 3344 -->
              <ul class="m-row">
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.toTalScore }}</p>
                  <p class="m-col-title">部门平均分</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastTotalScore }}）
                  </p>
                </li>
                <li class="m-col">
                  <p class="m-col-num">{{ scoreData.getScore.standard }}%</p>
                  <p class="m-col-title">绩效达标率</p>
                  <p class="m-col-desc">
                    （上月{{ scoreData.getScore.lastStandard }}%）
                  </p>
                </li>
              </ul>
            </div>
            <div class="m-tips">
              <span>不达标人员：</span>
              <span>{{ scoreData.getScore.employeeName }}</span>
            </div>
          </div>
        </div>
        <div class="m-item-main resize-height" style="margin-top: 15px">
          <div class="m-titleBar">
            <div class="m-title">
              <div class="m-icon">
                <i class="iconfont icon-gaikuang" />
              </div>
              <h2 class="title-text">绩效工资情况</h2>
            </div>
          </div>
          <div class="m-content-left-bottom">
            <div class="m-list">
              <div class="m-row">
                <p class="m-col-num">{{ scoreData.getWage.sumStandWage }}</p>
                <p class="m-col-title">标准绩效工资总额</p>
              </div>
              <div class="m-row">
                <p class="m-col-num">{{ scoreData.getWage.sumRealWage }}</p>
                <p class="m-col-title">实发绩效工资总额</p>
                <p class="m-col-desc">
                  (差额原因：{{
                    scoreData.getWage.employeeName == ""
                      ? "无"
                      : scoreData.getWage.employeeName
                  }})
                </p>
              </div>
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
              <h2 class="title-text">人员概况</h2>
            </div>
          </div>
          <div class="m-content">
            <div class="m-list">
              <ul class="m-row compare-score">
                <div class="line" />
                <div class="score highest">
                  <div>
                    <div class="score-num">
                      {{ scoreData.getEmployee[0].topScore }}
                    </div>
                    <span class="score-title">最高分</span>
                  </div>
                </div>
                <div class="differ">
                  <p>极值</p>
                  <p>{{ scoreData.getEmployee[0].different }}分</p>
                </div>
                <div class="score minimum">
                  <div class="score-num">
                    {{ scoreData.getEmployee[0].lowestScore }}
                  </div>
                  <span class="score-title">最低分</span>
                </div>
              </ul>
              <ul class="m-row">
                <li class="m-col">
                  <p
                    class="m-col-num"
                    :title="scoreData.getEmployee[0].topName"
                  >
                    {{ scoreData.getEmployee[0].topName }}
                  </p>
                  <p class="m-col-title">
                    最高分{{ scoreData.getEmployee[0].employeeType }}
                  </p>
                </li>
                <li class="m-col">
                  <p
                    class="m-col-num"
                    :title="scoreData.getEmployee[0].lowestName"
                  >
                    {{ scoreData.getEmployee[0].lowestName }}
                  </p>
                  <p class="m-col-title">
                    最低分{{ scoreData.getEmployee[0].employeeType }}
                  </p>
                </li>
              </ul>
            </div>
            <div class="m-list">
              <ul class="m-row compare-score">
                <div class="line" />
                <div class="score highest">
                  <div>
                    <div class="score-num">
                      {{ scoreData.getEmployee[1].topScore }}
                    </div>
                    <span class="score-title">最高分</span>
                  </div>
                </div>
                <div class="differ">
                  <p>极值</p>
                  <p>{{ scoreData.getEmployee[1].different }}分</p>
                </div>
                <div class="score minimum">
                  <div class="score-num">
                    {{ scoreData.getEmployee[1].lowestScore }}
                  </div>
                  <span class="score-title">最低分</span>
                </div>
              </ul>
              <ul class="m-row">
                <li class="m-col">
                  <p
                    class="m-col-num"
                    :title="scoreData.getEmployee[1].topName"
                  >
                    {{ scoreData.getEmployee[1].topName }}
                  </p>
                  <p class="m-col-title">
                    最高分{{ scoreData.getEmployee[1].employeeType }}
                  </p>
                </li>
                <li class="m-col">
                  <p
                    class="m-col-num"
                    :title="scoreData.getEmployee[1].lowestName"
                  >
                    {{ scoreData.getEmployee[1].lowestName }}
                  </p>
                  <p class="m-col-title">
                    最低分{{ scoreData.getEmployee[1].employeeType }}
                  </p>
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
            <div class="resize-height2">
              <ag-grid-vue
                v-loading="deductTableLoading"
                :gridOptions="deductTableOptions"
                :columnDefs="deductTableColumns"
                :rowData="deductTableData"
                class="m-agTableContent ag-theme-balham"
              />
            </div>
            <div class="resize-height2" style="margin-top: 10px">
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
      </div>
    </div>
  </div>
</template>
<script>
import gridOptions from "lesso-common/public/gridOptions";
import dateDay from "@/date";
export default {
  name: "departmentStatisticsHome",
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
       * 扣分表格 ag-grid 相关数据
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
       * 加分表格 ag-grid 相关数据
       */
      bonusTableLoading: false, // 加载状态
      bonusTableOptions: {}, // ag-grid配置
      bonusTableColumns: [], // 列属性
      bonusTableData: [], // 表格数据
      bonusTableCurrentPage: 1, // 当前页码
      bonusTablePageSize: 30, // 当前分页大小
      bonusTableTotal: 0, // 总记录数量
      scoreData: {
        getScore: {
          employeeNum: "",
          lastEmployeeNum: "",
          coverage: "",
          lastCoverage: "",
          toTalScore: "",
          lastTotalScore: "",
          standard: "",
          lastStandard: "",
        },
        getEmployee: [{}, {}],
        getWage: {
          sumStandWage: "",
          sumRealWage: "",
          employeeName: "",
        },
        getQuarter: {},
      },
      queryData: {},
      columnDefs: [],
      rowData: [],
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
          width: 200,
        },
        {
          headerName: "部门",
          field: "department",
          width: 200,
        },
        {
          headerName: "评级",
          field: "pfmRating",
          width: 200,
        },
      ];

      this.bonusTableOptions = gridOptions();
      this.bonusTableColumns = [
        {
          headerName: "干部姓名",
          field: "employee",
          width: 200,
        },
        {
          headerName: "部门",
          field: "department",
          width: 200,
        },
        {
          headerName: "评级",
          field: "pfmRating",
          width: 200,
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
        .GetDepartSummary(data)
        .then((res) => {
          console.log(res, "res");
          if (res.data.code == 200 || res.data.code == 1) {
            this.scoreData = res.data.rows[0];
            this.rowData = res.data.rows[0].getQuarter;
            for (var i = 0; i < this.rowData.length; i++) {
              if (this.rowData[i].type == "员工") {
                this.deductTableData.push(this.rowData[i]);
              } else {
                this.bonusTableData.push(this.rowData[i]);
              }
            }
          } else {
            this.$alert(res.data.info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
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
.m-personalStatisticsHome {
  height: 100%;
  padding: 0 5px;
  .m-personalStatisticsHome-top {
    // height: 100%;
    height: calc(100% - 14px);
    font-size: 0;
    .m-item {
      display: inline-block;
      box-sizing: border-box;
      width: 33.33333%;
      height: 100%;
      vertical-align: middle;
      &:nth-child(1) {
        padding-right: 10px;
        height: 100%;
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
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .m-list {
            // position: absolute;
            // left: 0;
            // right: 0;
            // top: 50%;
            // transform: translateY(-50%);
            .m-row {
              position: relative;
              font-size: 0;
              padding: 30px 0;
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
        .m-content-left-top {
          height: calc(100% - 30px);
          display: flex;
          flex-direction: column;
          .m-list {
            flex: 1;
            border-top: 1px solid #edeff2;
            // height: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            &:nth-child(1) {
              border-top: none;
            }
            .m-row {
              flex: 1;
              font-size: 0;
              border-top: 1px solid #edeff2;
              display: flex;
              align-items: center;
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
                }
                &-title {
                  color: #555;
                  font-size: 14px;
                  margin: 5px 0;
                }
                &-desc {
                  font-size: 22px;
                  color: #8a8f99;
                  font-size: 12px;
                }
              }
            }
          }
          .m-tips {
            // flex: 1;
            font-size: 12px;
            border-top: 1px solid #edeff2;
            padding: 10px 0;
            max-height: 100px;
            overflow: scroll;
          }
        }
        .m-content-left-bottom {
          height: calc(100% - 30px);
          .m-list {
            border-top: 1px solid #edeff2;
            height: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            &:nth-child(1) {
              border-top: none;
            }
            .m-row {
              flex: 1;
              font-size: 0;
              border-top: 1px solid #edeff2;
              display: flex;
              flex-direction: column;
              justify-content: center;
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
                }
                &-title {
                  color: #555;
                  font-size: 14px;
                  margin: 5px 0;
                }
                &-desc {
                  font-size: 22px;
                  color: #8a8f99;
                  font-size: 12px;
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
    top: 280px;
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
      top: 100px;
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
  .resize-height {
    height: calc(50% - 7px) !important;
  }
  .resize-height2 {
    height: calc(50% - 5px) !important;
  }
}
</style>
