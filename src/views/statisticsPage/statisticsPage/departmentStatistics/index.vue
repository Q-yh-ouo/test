<!--
 * 部门统计页面
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
-->
<template>
  <div class="m-window m-departmentStatistics">
    <div class="g-header clearfix">
      <ul class="header-left">
        <li
          v-for="(item, index) of tabList"
          :key="item.name"
          :class="{ active: index === tabActive }"
          @click="onChange(index)"
        >
          {{ item.title }}
        </li>
      </ul>
      <div class="header-right">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-date-picker
              v-model="searchForm.date"
              format="yyyy 年 MM 月"
              value-format="yyyyMM"
              :clearable="false"
              type="month"
              size="small"
              placeholder="选择月份"
            />
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="searchForm.companyId"
              :loading="companyOptionsLoading"
              :clearable="false"
              size="small"
              placeholder="选择公司"
              filterable
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="searchForm.departmentId"
              :loading="departmentOptionsLoading"
              :clearable="false"
              size="small"
              placeholder="选择部门"
              filterable
            >
              <el-option
                v-for="item in departmentOptions"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="searchForm.subdivisionsDeptId"
              :loading="departmentOptionsLoading2"
              :clearable="false"
              size="small"
              placeholder="选择下属部门"
              filterable
            >
              <el-option
                v-for="item in departmentOptions2"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="g-main">
      <component
        :ref="tabList[tabActive].name"
        :is="tabList[tabActive].name"
        :searchParams="searchForm"
      />
    </div>
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import home from "./home.vue";
import examinationTable from "./examinationTable.vue";
import meritPay from "./meritPay.vue";
import quotaScore from "./quotaScore.vue";
import dateDay from "@/date";
export default {
  name: "departmentStatistics",
  // 依赖组件
  components: {
    home,
    examinationTable,
    meritPay,
    quotaScore,
  },
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "departmentStatistics",
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        query: true, // 查询
      },
      /**
       * @vuese
       * tabs
       */
      tabActive: 0,
      tabList: [
        {
          name: "home",
          title: "首页",
        },
        {
          name: "examinationTable",
          title: "部门",
        },
        {
          name: "meritPay",
          title: "绩效工资",
        },
        {
          name: "quotaScore",
          title: "指标得失",
        },
      ],
      /**
       * @vuese
       * 搜索表单数据
       */
      searchForm: {
        date: dateDay.dateDays, // 日期
        companyId: null, // 公司Id
        departmentId: null, // 部门Id
        departmentName: null, // 部门名称
        subdivisionsDeptId: null, // 二级部门
      },
      /**
       * @vuese
       * 公司选择器数据
       */
      companyOptions: [], // 公司选项
      companyOptionsLoading: false, // 公司选项加载状态
      /**
       * @vuese
       * 部门选择器数据
       */
      departmentOptions: [], // 部门选项
      departmentOptionsLoading: false, // 部门选项加载状态
      /**
       * @vuese
       * 二级部门选择器数据
       */
      departmentOptions2: [], // 二级部门选项
      departmentOptionsLoading2: false, // 二级部门选项加载状态
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  async created() {
    // 初始化操作按钮权限
    this.initAuthBtn();
    // 是否有权限操作部门及公司页面
    let valid = await this.getDepartCompanyAuth();
    // 获取公司列表
    if (valid == 1) {
      this.getCompanyListAll();
    }
  },
  // 实例挂载前
  beforeMount() {},
  // 实例挂载完成
  mounted() {
    let dateYear = dateDay.dateDays.substr(0, 4);
    let dateMonth = dateDay.dateDays.substr(4, 2);
    if (dateMonth == "00") {
      dateYear = dateYear - 1;
      dateMonth = "12";
    } else {
      console.log("not January");
    }
    this.searchForm.date = dateYear + "" + dateMonth;
  },
  // 实例销毁前
  beforeDestroy() {},
  // 实例内函数
  methods: {
    /**
     * @vuese
     * 判断当前用户是否有权限操作部门与公司页面
     */
    getDepartCompanyAuth() {
      return this.$http
        .GetloginpersonDepartCompany(this.$constant.user.sapNum)
        .then((res) => {
          const { code, rows, info } = res.data;
          if (code != 200 && code != 1) {
            this.$Msg.warning(info);
          }
          return code;
        })
        .catch((err) => {
          this.$Msg.error(err.response.data.info);
          return 0;
        });
    },
    /**
     * @vuese
     * 初始化按钮权限
     */
    initAuthBtn() {
      authorize.getBtnAuth(this.name, this.btnPermissions);
    },
    /**
     * tab 切换
     * @arg {Number} index 下标
     */
    onChange(index) {
      this.tabActive = index;
      setTimeout(() => {
        this.onSearch();
      }, 500);
    },
    /**
     * @vuese
     * 查询数据
     */
    onSearch() {
      this.$refs[this.tabList[this.tabActive].name].getData();
    },
    /**
     * @vuese
     * 获取所有公司
     */
    getCompanyListAll() {
      this.companyOptionsLoading = true;
      this.$http
        .GetloginpersonCompany(this.$constant.user.sapNum)
        .then((response) => {
          this.companyOptionsLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.companyOptions = rows;
            // 若公司列表没数据，则清空选项
            if (rows.length > 0) {
              // 若未选择公司，则默认选第一个
              if (!this.searchForm.companyId) {
                this.$set(this.searchForm, "companyId", rows[0].id);
              }
            }
            if (!this.searchForm.companyId) {
              // 当选择器选项没有后续请求，发起查询
              this.onSearch();
            }
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.companyOptionsLoading = false;
          this.$set(this.searchForm, "companyId", null);
          // 当选择器选项没有后续请求，发起查询
          this.onSearch();
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 根据公司Id获取部门列表
     * @arg {Number} companyId 公司Id
     * @arg {Number} higherDept 上级部门Id
     */
    getDeptmentListByCompanyId(companyId, higherDept) {
      if (higherDept === undefined) {
        this.departmentOptionsLoading = true;
      } else {
        this.departmentOptionsLoading2 = true;
      }
      let createBy = this.$constant.user.sapNum;
      this.$http
        .GetloginpersonDepart({ companyId, higherDept, createBy })
        .then((response) => {
          if (higherDept === undefined) {
            this.departmentOptionsLoading = false;
          } else {
            this.departmentOptionsLoading2 = false;
          }
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            if (higherDept === undefined) {
              this.departmentOptions = rows;
              // 若部门列表没数据，则清空选项
              if (rows.length > 0) {
                // 若未选择部门，则默认选第一个
                if (!this.searchForm.departmentId) {
                  this.$set(this.searchForm, "departmentId", rows[0].id);
                  this.$set(
                    this.searchForm,
                    "departmentName",
                    rows[0].deptName
                  );
                }
              }
              if (!this.searchForm.departmentId) {
                // 当选择器选项没有后续请求，发起查询
                this.onSearch();
              }
            } else {
              this.departmentOptions2 = rows;
              // 若二级部门列表没数据，则清空选项
              if (rows.length > 0) {
                // 若未选择二级部门，则默认选第一个
                if (!this.searchForm.subdivisionsDeptId && rows.length > 0) {
                  this.$set(this.searchForm, "subdivisionsDeptId", rows[0].id);
                }
              }
              // 当选择器选项没有后续请求，发起查询
              this.onSearch();
            }
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          if (higherDept === undefined) {
            this.departmentOptionsLoading = false;
            this.$set(this.searchForm, "departmentId", null);
            this.$set(this.searchForm, "departmentName", null);
          } else {
            this.departmentOptionsLoading2 = false;
            this.$set(this.searchForm, "subdivisionsDeptId", null);
          }
          // 当选择器选项没有后续请求，发起查询
          this.onSearch();
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
  },
  // 侦听器
  watch: {
    "searchForm.date"() {
      // 发起查询
      this.onSearch();
    },
    "searchForm.companyId"(val) {
      this.$set(this.searchForm, "departmentId", null);
      this.$set(this.searchForm, "departmentName", null);
      if (val) {
        this.getDeptmentListByCompanyId(val);
      }
    },
    "searchForm.departmentId"(val) {
      this.$set(this.searchForm, "subdivisionsDeptId", null);
      if (val) {
        this.getDeptmentListByCompanyId(this.searchForm.companyId, val);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.m-departmentStatistics {
  .g-header {
    .header-left {
      float: left;
      width: 227px;
      font-size: 0;
      li {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        margin-left: 15px;
        text-align: center;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
        &.active {
          color: #409eff;
        }
        &:nth-child(1) {
          margin-left: 0;
        }
      }
    }
    .header-right {
      margin-left: 242px;
    }
  }
  .g-main {
    position: absolute;
    top: 52px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
