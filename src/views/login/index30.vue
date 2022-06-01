<!--
 * 汇总表申请流程
 * @author: 郭湛良-景兴
 * @since: 2021-06-23
-->
<template>
    <div v-loading="pageLoading" class="m-window m-summaryApplication">
      <!-- 基础信息 -->
      <el-row :gutter="10" type="flex">
        <el-col v-if="query && query.referrer" :span="2">
          <el-button type="primary" size="small" @click="onBack">
            返回
          </el-button>
        </el-col>
        <el-col v-if="query.referrer !== 'haveDoList'" :span="2">
          <el-button
            :loading="saving || submitting"
            :disabled="deleting || !applyBillTableDetail"
            type="primary"
            size="small"
            @click="onSave"
          >
            保存
          </el-button>
        </el-col>
        <el-col v-if="query.referrer !== 'haveDoList'" :span="2">
          <el-button
            :loading="submitting"
            :disabled="
              ((saving || deleting) && !submitting) || !applyBillTableDetail
            "
            type="primary"
            size="small"
            @click="onSubmit(false)"
          >
            提交
          </el-button>
        </el-col>
        <el-col
          v-if="
            applyBillTableDetail &&
            query.referrer !== 'haveDoList' &&
            applyBillTableDetail.summary.requestId === 0
          "
          :span="2"
        >
          <el-button
            :loading="deleting"
            :disabled="saving || submitting"
            type="primary"
            size="small"
            @click="delApplyBillSummary"
          >
            删除
          </el-button>
        </el-col>
        <el-col
          v-if="
            applyBillTableDetail &&
            query.referrer !== 'haveDoList' &&
            applyBillTableDetail.summary.requestId > 0
          "
          :span="2"
        >
          <el-button
            :loading="deleting"
            :disabled="saving || submitting"
            type="primary"
            size="small"
            @click="onReturn"
          >
            退回
          </el-button>
        </el-col>
        <el-col
          v-if="
            !applyBillTableDetail ||
            (applyBillTableDetail &&
              applyBillTableDetail.summary.requestId === null)
          "
          :span="2"
        >
          <el-button
            :loading="pageLoading"
            :disabled="saving || submitting"
            type="primary"
            size="small"
            @click="onSearch"
          >
            查询
          </el-button>
        </el-col>
        <el-col>
          <div class="m-basic-info">
            <div class="basic-info-item">
              <span class="basic-info-item-label">申请人：</span>
              <span class="basic-info-item-value">{{
                (applyBillTableDetail &&
                  applyBillTableDetail.summary.applyName) ||
                userData.employeeName
              }}</span>
            </div>
            <div class="basic-info-item">
              <span class="basic-info-item-label">申请日期：</span>
              <span class="basic-info-item-value">{{ today }}</span>
            </div>
            <div
              v-if="applyBillTableDetail && applyBillTableDetail.summary.billNum"
              class="basic-info-item"
            >
              <span class="basic-info-item-label">申请单号：</span>
              <span class="basic-info-item-value">
                {{ applyBillTableDetail.summary.billNum }}
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- /基础信息 -->
      <!-- 抬头信息 -->
      <div class="m-header-info">
        <!-- 
        <div class="title-text">抬头信息</div>
         -->
        <div class="m-header-info-con">
          <el-form
            ref="headerInfoForm"
            :model="headerInfoForm"
            :rules="headerInfoFormRules"
          >
            <table class="myTable" cellspacing="0" cellpadding="0">
              <tr>
                <td colspan="6" class="tLeft bg fontWeight">抬头信息</td>
              </tr>
              <tr>
                <td class="bg fontWeight">
                  <span class="required">*</span>申请主题
                </td>
                <td class="tLeft">
                  <el-form-item prop="applyTitle">
                    <el-input
                      v-model.trim="headerInfoForm.applyTitle"
                      disabled
                      type="text"
                    />
                  </el-form-item>
                </td>
                <td class="bg fontWeight"><span class="required">*</span>部门</td>
                <td class="tLeft">
                  <el-tooltip
                    :disabled="
                      !applyBillTableDetail ||
                      (applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId === null)
                    "
                    :content="deptmentsText"
                    effect="dark"
                    placement="top"
                  >
                    <el-form-item prop="applyDeptId">
                      <el-select
                        v-model="headerInfoForm.applyDeptId"
                        :loading="departmentOptionsLoading"
                        :disabled="
                          applyBillTableDetail &&
                          applyBillTableDetail.summary.requestId !== null
                        "
                        :class="{
                          'multiple-select':
                            headerInfoForm.applyDeptId &&
                            headerInfoForm.applyDeptId.length > 1,
                        }"
                        filterable
                        clearable
                        multiple
                        collapse-tags
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in departmentOptions"
                          :key="item.id"
                          :label="
                            (item.companyName || '') +
                            (item.companyName && item.deptName ? '-' : '') +
                            item.deptName
                          "
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </td>
                <td class="bg fontWeight">部门负责人</td>
                <td class="tLeft">
                  <el-form-item prop="applyEmployee">
                    <el-select
                      v-model="headerInfoForm.applyEmployee"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :loading="personnelOptionsLoading"
                      filterable
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in personnelOptions"
                        :key="item.applyEmployee"
                        :label="item.applyEmployeeName"
                        :value="item.applyEmployee"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="bg fontWeight">
                  <span class="required">*</span>汇总类型
                </td>
                <td class="tLeft">
                  <el-form-item prop="applySummaryType">
                    <el-select
                      v-model="headerInfoForm.applySummaryType"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      placeholder="请选择"
                    >
                      <el-option :value="0" label="月度" />
                      <el-option :value="1" label="季度" />
                      <el-option :value="2" label="年度" />
                      <el-option :value="3" label="全年季度" />
                    </el-select>
                  </el-form-item>
                </td>
                <td class="bg fontWeight">
                  <span class="required">*</span>汇总日期
                </td>
                <td class="tLeft">
                  <el-form-item prop="summaryDate">
                    <el-date-picker
                      v-if="headerInfoForm.applySummaryType === 0"
                      v-model="headerInfoForm.summaryDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="month"
                      placeholder="请选择"
                    />
                    <quarterPicker
                      v-else-if="headerInfoForm.applySummaryType === 1"
                      v-model="headerInfoForm.summaryDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                    />
                    <!-- <el-date-picker
                      v-else-if="headerInfoForm.applySummaryType === 1"
                      v-model="headerInfoForm.summaryDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="month"
                      placeholder="请选择"
                    /> -->
                    <el-date-picker
                      v-else-if="headerInfoForm.applySummaryType === 2"
                      v-model="headerInfoForm.summaryDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="year"
                      placeholder="请选择"
                    />
                    <el-date-picker
                      v-else-if="headerInfoForm.applySummaryType === 3"
                      v-model="headerInfoForm.summaryDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="year"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </td>
                <!-- <td class="bg fontWeight">
                  <span class="required">*</span>汇总开始日期
                </td>
                <td class="tLeft">
                  <el-form-item prop="applyBeginDate">
                    <el-date-picker
                      v-model="headerInfoForm.applyBeginDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="date"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </td>
                <td class="bg fontWeight">
                  <span class="required">*</span>汇总结束日期
                </td>
                <td class="tLeft">
                  <el-form-item prop="applyEndDate">
                    <el-date-picker
                      v-model="headerInfoForm.applyEndDate"
                      :disabled="
                        applyBillTableDetail &&
                        applyBillTableDetail.summary.requestId !== null
                      "
                      :clearable="false"
                      type="date"
                      placeholder="请选择"
                    />
                  </el-form-item>
                </td> -->
                <template
                  v-if="
                    applyBillTableDetail &&
                    applyBillTableDetail.summary.requestId > 0
                  "
                >
                  <td class="bg fontWeight height40">
                    <span class="required">*</span>是否申诉
                  </td>
                  <td class="tLeft">
                    <el-form-item prop="appeal">
                      <el-select
                        v-model="headerInfoForm.appeal"
                        :disabled="query.referrer === 'haveDoList'"
                        placeholder="请选择"
                      >
                        <el-option :value="0" label="是" />
                        <el-option :value="1" label="否" />
                      </el-select>
                    </el-form-item>
                  </td>
                </template>
              </tr>
              <tr>
                <td class="bg fontWeight">备注</td>
                <td class="tLeft" colspan="5">
                  <el-form-item prop="appeal">
                    <el-input
                      v-model="headerInfoForm.memo"
                      type="textarea"
                      resize="none"
                      maxlength="200"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr
                v-if="
                  applyBillTableDetail &&
                  applyBillTableDetail.summary.requestId > 0
                "
              >
                <td class="bg fontWeight">签字意见</td>
                <td class="tLeft">
                  <el-form-item prop="remark">
                    <el-input
                      v-model.trim="headerInfoForm.remark"
                      :disabled="query.referrer === 'haveDoList'"
                      :placeholder="
                        query.referrer === 'haveDoList' ? '' : '请输入'
                      "
                      type="text"
                      clearable
                    />
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </div>
      <!-- /抬头信息 -->
      <!-- 工具栏 -->
      <div class="m-toolbar">
        <el-row :gutter="10" type="flex">
          <el-col>
            <div class="title-text">报表明细信息</div>
          </el-col>
          <el-col :span="2">
            <el-button
              v-if="btnPermissions.export"
              :disabled="
                btnDisableds.export ||
                !mainTableShow ||
                mainTableColumns.length === 0 ||
                deleting
              "
              type="primary"
              @click="onExport"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!-- /工具栏 -->
      <template v-if="mainTableShow">
        <!-- 主表格 当表格有页码时，m-agTable 后面应加上 m-bottom -->
        <div
          :style="{
            top:
              applyBillTableDetail && applyBillTableDetail.summary.requestId > 0
                ? '360px'
                : '280px',
          }"
          class="m-agTable"
        >
          <ag-grid-vue
            ref="ag-grid"
            v-loading="mainTableLoading"
            :gridOptions="mainTableOptions"
            :columnDefs="mainTableColumns"
            :rowData="mainTableData"
            class="m-agTableContent ag-theme-balham"
          />
        </div>
        <!-- /主表格 -->
        <!-- 主表格分页 -->
        <!-- <div class="m-page">
          <el-pagination
            :current-page="mainTableCurrentPage"
            :page-size="mainTablePageSize"
            :total="mainTableTotal"
            :page-sizes="tableSizeList"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleMainTableSizeChange"
            @current-change="handleMainTableCurrentChange"
          />
        </div> -->
        <!-- /主表格分页 -->
      </template>
      <!-- 选择退回节点 对话框 -->
      <el-dialog
        :visible.sync="returnFormDialogVisible"
        :before-close="closeReturnFormDialog"
        :close-on-click-modal="false"
        title="选择退回节点"
        v-dialogDrag
        width="50%"
      >
        <el-form
          ref="returnForm"
          :model="returnForm"
          :rules="returnFormRules"
          label-width="140px"
        >
          <el-form-item label="退回节点" prop="returnNode">
            <el-select
              v-model="returnForm.returnNode"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in returnNodeOptions"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeReturnFormDialog">取 消</el-button>
          <el-button :loading="returning" type="primary" @click="onReturnConfirm">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- /选择退回节点 对话框 -->
    </div>
  </template>
  <script>
  import Vue from "vue";
  import authorize from "@/public/authorize";
  import gridOptions from "lesso-common/public/gridOptions";
  import constant from "@/public/constant";
  import EvenBus from "@/public/evenBus";
  import { TABS_CHANGE } from "@/public/evenbusConstant";
  import quarterPicker from "@/components/quarterPicker";
  
  let workflowId = ""; // OA流程ID
  let nodeId = ""; // 流程节点Id
  const requestId = 0;
  if (constant.appenv == "dev") {
    workflowId = 9123;
    nodeId = 18938;
  } else if (constant.appenv == "qas") {
    workflowId = 9123;
    nodeId = 18938;
  } else if (constant.appenv == "app") {
    workflowId = 10383;
    nodeId = 23045;
  }
  
  // 抬头信息表单校验规则
  const headerInfoFormRules = {
    applyDeptId: [
      {
        required: true,
        trigger: "change",
        message: "请选择部门",
      },
    ],
    applySummaryType: [
      {
        required: true,
        trigger: "change",
        message: "请选择汇总类型",
      },
    ],
    summaryDate: [
      {
        required: true,
        trigger: "change",
        message: "请选择汇总日期",
      },
    ],
  };
  
  // 是否监听选择
  let isWatchSelect = true;
  
  /**
   * @vuese
   * 校验规则
   */
  function checkRules(rules, value) {
    let _err = null;
    for (const item of rules) {
      // 必填，没有值
      if (item.required && !value) {
        _err = item;
        break;
      }
      // 有值才去校验规则
      if (value) {
        // 有正则的情况下
        if (item.pattern) {
          if (!item.pattern.test(value)) {
            _err = item;
            break;
          }
        }
        // 有最小值或最大值限制的情况下
        if (item.min || item.min === 0 || item.max || item.max === 0) {
          let _min = item.min || 0;
          if (value.length < _min) {
            _err = item;
            break;
          } else if (item.max > 0 && value.length > item.max) {
            _err = item;
            break;
          }
        }
      }
    }
    return _err;
  }
  // 单元格内文本框
  function inputText(columnItem) {
    return Vue.extend({
      template: `<span>
        <input ref="input" v-model.trim="setValue" class="column-input"></input>
      </span>`,
      data() {
        return {
          columnItem,
          setValue: null,
          oldValue: null,
        };
      },
      mounted() {
        // 获取聚焦
        this.$nextTick((ele) => {
          this.$refs.input.focus();
        });
        if (this.params.value === 0) {
          this.setValue;
          this.oldValue;
        } else {
          this.setValue = this.params.value;
          this.oldValue = this.params.value;
        }
      },
      methods: {
        valueChanged() {
          return this.setValue;
        },
        getValue() {
          const { rules } = this.columnItem;
          const _err = checkRules(rules, this.setValue);
          if (_err) {
            setTimeout(() => {
              this.$alert(_err.message, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertPrompt",
              });
            }, 100);
            return this.oldValue;
          }
          return this.setValue;
        },
      },
    });
  }
  // 单元格内日期选择器
  function datePicker(columnItem) {
    return Vue.extend({
      template: `<span>
        <el-date-picker ref="input" v-model="setValue" type="date" placeholder="选择日期" class="column-date-picker" @blur="onBlur"></el-date-picker>
      </span>`,
      data() {
        return {
          columnItem,
          setValue: null,
          oldValue: null,
        };
      },
      mounted() {
        // 获取聚焦
        this.$nextTick((ele) => {
          this.$refs.input.focus();
        });
        if (this.params.value === 0) {
          this.setValue;
          this.oldValue;
        } else {
          this.setValue = this.params.value;
          this.oldValue = this.params.value;
        }
      },
      methods: {
        onBlur() {
          this.getValue();
          this.params.context.componentParent.mainTableOptions.api.setFocusedCell();
        },
        valueChanged() {
          return this.setValue;
        },
        getValue() {
          const newValue = this.setValue
            ? this.$utils.dateFormat("yyyy-MM-dd", this.setValue)
            : null;
          const { rules } = this.columnItem;
          let _err = checkRules(rules, newValue);
          if (_err) {
            setTimeout(() => {
              this.$alert(_err.message, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertPrompt",
              });
            }, 100);
            return checkRules(rules, this.oldValue) ? null : this.oldValue;
          }
          return newValue;
        },
      },
    });
  }
  
  export default {
    name: "summaryApplication",
    // 依赖组件
    components: {
      quarterPicker,
    },
    // 接口（组件的接口）
    props: {
      removeTabByCode: Function,
      addTab: {
        type: Function,
      },
      query: {
        type: Object,
        default: () => {},
      },
    },
    // 响应式数据
    data() {
      return {
        name: "summaryApplication",
        /**
         * @vuese
         * 当前登录用户信息
         */
        userData: this.$utils.getStorage("userData").user,
        /**
         * @vuese
         * 当前日期
         */
        today: this.$utils.dateFormat("yyyy-MM-dd", new Date()),
        /**
         * @vuese
         * 申请单详情
         */
        applyBillTableDetail: null,
        /**
         * @vuese
         * 保存状态
         */
        saving: false,
        /**
         * @vuese
         * 提交状态
         */
        submitting: false,
        /**
         * @vuese
         * 删除状态
         */
        deleting: false,
        /**
         * @vuese
         * 退回状态
         */
        returning: false,
        /**
         * @vuese
         * 抬头信息表单
         */
        headerInfoForm: {
          applyTitle: "", // 申请主题
          applyDeptId: [], // 部门id
          applyEmployee: null, // 部门负责人
          applySummaryType: 0, // 汇总类型 0: 月度; 1: 季度; 2: 年度; 3: 全年季度;
          applyBeginDate: null, // 汇总开始时间
          applyEndDate: null, // 汇总结束时间
          summaryDate: new Date(), // 汇总日期
          appeal: 1, // 是否申诉， 0-是，1-否
          remark: "", // 签字意见
        },
        headerInfoFormRules, // 抬头信息表单校验规则
        /**
         * @vuese
         * 按钮权限组
         */
        btnPermissions: {
          export: true, // 导出
        },
        /**
         * @vuese
         * 按钮禁用状态
         */
        btnDisableds: {
          export: false, // 导出
        },
        /**
         * @vuese
         * 按钮加载状态
         */
        btnLoadings: {
          export: false, // 导出
        },
        /**
         * @vuese
         * 页面数据请求状态
         */
        pageLoading: false,
        /**
         * @vuese
         * 表格分页大小选项
         */
        tableSizeList: [30, 50, 100, 150, 200],
        /**
         * @vuese
         * 页面表格 ag-grid 相关数据
         */
        mainTableShow: true, // 显示状态
        mainTableLoading: false, // 加载状态
        mainTableOptions: {}, // ag-grid配置
        mainTableColumns: [], // 列属性
        mainTableData: [], // 表格数据
        mainTableCurrentPage: 1, // 当前页码
        mainTablePageSize: 30, // 当前分页大小
        mainTableTotal: 0, // 总记录数量
        /**
         * @vuese
         * 操作标识
         */
        operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
        /**
         * @vuese
         * 部门选择器相关数据
         */
        departmentOptions: [], // 部门选项
        departmentOptionsLoading: false, // 部门选项加载状态
        /**
         * @vuese
         * 部门负责人选择器相关数据
         */
        personnelOptions: [], // 人员选项
        personnelOptionsLoading: false, // 人员选项加载状态
        /**
         * @vuese
         * 流程明细列（字段）
         * @arg {String} fieldName 字段英文名称
         * @arg {String} fieldText 字段中文名称
         * @arg {String} fieldType 0: string; 1: int; 2: date; 3: decimal;
         * @arg {String} fieldEditType 0: 多行文本框; 1: 文本框; 2: 日期选择器;
         * @arg {Number} fieldLength 字段内容长度
         * @arg {Number} colidWeight 列显示宽度（新字段，如果该字段没值则取 fieldWidth）
         * @arg {Number} keepDecimal 保留小数位
         * @arg {Number} sequence 字段显示排序
         */
        detailColumns: [],
        /**
         * @vuese
         * 退回表单
         */
        returnFormDialogVisible: false, // 对话框是否显示
        returnForm: {
          returnNode: null, // 退回节点
        },
        returnFormRules: {
          returnNode: [
            {
              required: true,
              trigger: ["change"],
              message: "请选择退回节点",
            },
          ],
        }, // 退回表单校验规则
        returnNodeOptions: [], // 退回节点选项
        returnNodeOptionsLoading: false, // 退回节点选项加载状态
      };
    },
    // 计算属性
    computed: {
      /**
       * @vuese
       * 拼接部门名称
       */
      deptmentsText() {
        let str = "";
        for (const item of this.headerInfoForm.applyDeptId) {
          const findDeptment = this.departmentOptions.find(
            (deptItem) => deptItem.id === item
          );
          if (findDeptment) {
            const deptName = `${findDeptment.companyName}${
              findDeptment.companyName && findDeptment.deptName ? "-" : ""
            }${findDeptment.deptName}`;
            str += str ? `,${deptName}` : deptName;
          }
        }
        return str;
      },
    },
    // 实例创建
    created() {
      // 初始化操作按钮权限
      this.initAuthBtn();
      // 获取所有部门
      this.getDeptmentListAll();
      // 根据页面参数获取详情
      this.getDetailByQuery();
    },
    // 实例挂载前
    beforeMount() {
      // 初始化ag-grid表格配置
      this.initGrid();
      // tabs标签页切换
      EvenBus.$on(TABS_CHANGE, (data) => {
        if (data.content === this.name) {
          // 获取所有部门
          this.getDeptmentListAll();
        }
      });
    },
    // 实例挂载完成
    mounted() {},
    // 实例销毁前
    beforeDestroy() {
      // EvenBus.$off(TABS_CHANGE);
    },
    // 实例内函数
    methods: {
      /**
       * @vuese
       * 返回上一个页面
       */
      onBack() {
        if (!this.query || !this.query.referrer) {
          this.removeTabByCode(this.name);
          return;
        }
        let referrerName = null;
        switch (this.query.referrer) {
          case "toDoList":
            referrerName = "待办事宜";
            break;
          case "haveDoList":
            referrerName = "已办事宜";
            break;
          default:
            break;
        }
        this.addTab({
          code: this.query.referrer,
          name: referrerName,
        });
        this.removeTabByCode(this.name);
      },
      /**
       * @vuese
       * 根据页面参数获取详情
       */
      getDetailByQuery() {
        if (this.query && this.query.rowData) {
          const { billNum } = this.query.rowData;
          this.getApplyBillNumSummaryVO(billNum);
        }
      },
      /**
       * @vuese
       * 初始化按钮权限
       */
      initAuthBtn() {
        authorize.getBtnAuth(this.name, this.btnPermissions);
      },
      /**
       * @vuese
       * 初始化ag-grid表格配置
       */
      initGrid() {
        this.mainTableShow = false; // 卸载表格
        this.$nextTick(() => {
          this.mainTableOptions = Object.assign(
            {},
            gridOptions({
              singleSelection: false, // 是否单选
              dragSelectCheckbox: true, // 是否启用拖选行
            }),
            {
              context: {
                componentParent: this,
              },
            }
          );
          // 动态配置表格列
          this.mainTableColumns = this.detailColumns.map((item, index) => {
            let newItem = {
              headerName: item.fieldText,
              field: item.fieldName,
              width: item.colidWeight || item.fieldWidth,
            };
            // fieldEditType 0: 多行文本框; 1: 文本框; 2: 日期选择器;
            if (item.fieldEditType === "2") {
              newItem = {
                ...newItem,
                editable:
                  this.query.referrer !== "haveDoList" && item.columnEdit === "0",
                cellEditorFramework: datePicker(item),
              };
            } else {
              newItem = {
                ...newItem,
                editable:
                  this.query.referrer !== "haveDoList" && item.columnEdit === "0",
                cellEditorFramework: inputText(item),
                suppressKeyboardEvent: (params) => {
                  const _rowIndex = params.node.rowIndex;
                  const _key = params.event.keyCode;
                  if (_key === 38) {
                    // keyup
                    if (_rowIndex === 0) {
                      return;
                    } else {
                      this.mainTableOptions.api.setFocusedCell(
                        _rowIndex - 1,
                        item.fieldName,
                        null
                      );
                      this.mainTableOptions.api.startEditingCell({
                        rowIndex: _rowIndex - 1 < 0 ? 0 : _rowIndex - 1,
                        colKey: item.fieldName,
                      });
                    }
                  } else if (_key === 40) {
                    // keydowm
                    this.mainTableOptions.api.setFocusedCell(
                      _rowIndex + 1,
                      item.fieldName,
                      null
                    );
                    this.mainTableOptions.api.startEditingCell({
                      rowIndex: _rowIndex + 1,
                      colKey: item.fieldName,
                    });
                  }
                },
              };
            }
            // if (index === 0) {
            //   newItem = {
            //     ...newItem,
            //     headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
            //     checkboxSelection: true, // 是否在行头显示勾选框
            //     headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
            //   };
            // }
            return newItem;
          });
          this.mainTableShow = true; // 挂载表格
        });
      },
      /**
       * @vuese
       * 重置ag-grid表格配置
       */
      resetGrid() {
        this.mainTableShow = false; // 卸载表格
        this.$nextTick(() => {
          this.mainTableOptions = Object.assign(
            {},
            gridOptions({
              singleSelection: false, // 是否单选
              dragSelectCheckbox: true, // 是否启用拖选行
            }),
            {
              context: {
                componentParent: this,
              },
            }
          );
          this.detailColumns = [];
          // 动态配置表格列
          this.mainTableColumns = [];
          this.mainTableData = [];
          this.mainTableShow = true; // 挂载表格
        });
      },
      /**
       * @vuese
       * 处理主表格分页大小改变事件
       * @arg {Number} val 分页大小
       */
      handleMainTableSizeChange(val) {
        // 设置当前页码为第一页
        this.mainTableCurrentPage = 1;
        // 设置分页大小
        this.mainTablePageSize = val;
        // 获取主表格数据
        this.getMainTableData();
      },
      /**
       * @vuese
       * 处理主表格页码改变事件
       * @arg {Number} val 页码
       */
      handleMainTableCurrentChange(val) {
        // 设置当前页码
        this.mainTableCurrentPage = val;
        // 获取主表格数据
        this.getMainTableData();
      },
      /**
       * @vuese
       * 获取主表格选中行数据
       */
      getMainTableSelectedRows() {
        return this.mainTableOptions.api.getSelectedRows();
      },
      /**
       * @vuese
       * 获取主表格数据
       */
      getMainTableData() {},
      /**
       * @vuese
       * 初始化明细信息字段的表单校验规则
       */
      initDetailColumnRules(columns) {
        return columns.map((item) => {
          const _rules = [];
          // 预留以后需要控制必填/非必填
          _rules.push({
            required: false,
            message: `请${item.fieldEditType === "2" ? "选择" : "输入"}${
              item.fieldText
            }`,
            trigger: ["blur", "change"],
          });
          if (item.fieldName === "kpi_name") {
            _rules[0].required = true;
          }
          // fieldEditType 0: 多行文本框; 1: 文本框; 2: 日期选择器;
          // fieldType 0: string; 1: int; 2: date; 3: decimal;
          // keepDecimal 保留小数位;
          // fieldLength 字段长度
          if (item.fieldEditType !== "2") {
            if (item.fieldType === "1" || item.fieldType === "3") {
              _rules.push({
                pattern: /^[+-]?\d+(\.\d+)?$/,
                message: `${item.fieldText}必须为数字值`,
                trigger: ["blur", "change"],
              });
            }
            if (item.fieldType === "1") {
              _rules.push({
                pattern: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/,
                message: `${item.fieldText}必须为整数`,
                trigger: ["blur", "change"],
              });
            }
            if (item.fieldType === "3" && item.keepDecimal) {
              _rules.push({
                pattern: eval(
                  "/(^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)(?:\\.\\d{1," +
                    item.keepDecimal +
                    "})?$)/"
                ),
                message: `${item.fieldText}小数点后只能保留 ${item.keepDecimal} 位小数`,
                trigger: ["blur", "change"],
              });
            }
          } else {
            // _rules.push({
            //   pattern: /^(\d{4})-(\d{2})-(\d{2})$/,
            //   message: `请保证${item.fieldText}格式为yyyy-MM-dd`,
            //   trigger: "change",
            // });
          }
          if (item.fieldLength > 0) {
            _rules.push({
              min: 0,
              max: item.fieldLength,
              message: `${item.fieldText}长度不能超过 ${item.fieldLength} 个字符`,
              trigger: ["blur", "change"],
            });
          }
          item.rules = _rules;
          return item;
        });
      },
      /**
       * @vuese
       * 校验明细列表中 kpi_name 列的值不允许空
       */
      checkkpiName() {
        const kpiNameIsNotEmpty = this.mainTableData.every(
          (item) => item.kpi_name
        );
        if (!kpiNameIsNotEmpty) {
          this.$alert("明细信息内“指标名称”不能为空", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
        }
        return kpiNameIsNotEmpty;
      },
      /**
       * @vuese
       * 校验明细列表中 kpi_weight 列的值加起来不能超过100
       */
      checkKpiWeight() {
        // 后勤部忽略权重限制
        const findDepartment = this.departmentOptions.find(
          (item) => item.id === this.headerInfoForm.deptId
        );
        if (findDepartment && findDepartment.deptName === "后勤部") {
          return true;
        }
        // 权重总和
        let kpiWeightTotal = 0;
        for (const item of this.mainTableData) {
          const _kpiWeight = parseFloat(item.kpi_weight);
          if (!isNaN(_kpiWeight)) {
            kpiWeightTotal += _kpiWeight;
          }
        }
        if (kpiWeightTotal !== 100) {
          this.$alert("明细信息内“权重”总和需等于100", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
          return false;
        }
        return true;
      },
      /**
       * @vuese
       * 校验明细列表不能存在空行，且不能为空
       */
      checkDetailList() {
        if (this.mainTableData.length === 0) {
          this.$alert("明细列表不能为空", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
          return false;
        } else {
          let hasEmpty = false; // 是否空行
          let errRule = null; // 错误规则
          for (const item of this.mainTableData) {
            const newItem = { ...item };
            delete newItem.uuid;
            // 判断是否全部字段都为空
            if (Object.values(newItem).every((val) => !val)) {
              hasEmpty = true;
              break;
            }
            // 已经找到错误规则 跳出循环
            if (errRule) {
              break;
            }
            // 遍历每一个字段 校验规则
            for (const key in newItem) {
              const findColumnItem = this.detailColumns.find(
                (columnItem) => columnItem.fieldName === key
              );
              if (findColumnItem) {
                // 校验字段规则
                errRule = checkRules(findColumnItem.rules, newItem[key]);
                if (errRule) {
                  break;
                }
              }
            }
          }
          if (hasEmpty) {
            this.$alert("明细列表不能存在空行", {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertPrompt",
            });
            return false;
          }
          if (errRule) {
            this.$alert(errRule.message, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertPrompt",
            });
            return false;
          }
        }
        return true;
      },
      /**
       * @vuese
       * 打开 退回对话框
       */
      openReturnFormDialog() {
        this.returnFormDialogVisible = true;
      },
      /**
       * @vuese
       * 关闭 退回对话框
       */
      closeReturnFormDialog() {
        this.returnFormDialogVisible = false;
      },
      /**
       * @vuese
       * 退回事件
       */
      onReturn() {
        // 打开对话框
        this.openReturnFormDialog();
        // 重置表单
        this.resetForm("returnForm");
        // 获取退回节点选项
        this.getReturnNodeList();
      },
      /**
       * @vuese
       * 查询
       */
      onSearch() {
        this.$refs["headerInfoForm"].validate((valid) => {
          if (valid) {
            this.getPfmSummaryDetail();
          }
        });
      },
      /**
       * @vuese
       * 退回确认事件
       */
      onReturnConfirm() {
        this.onSubmit(true);
      },
      /**
       * @vuese
       * 保存事件
       */
      onSave() {
        if (!this.applyBillTableDetail) {
          this.$message({
            type: "warning",
            message: "没有申请表信息，请先查询",
          });
        } else {
          // 否则 保存
          this.savaApplyBillSummary().then((billNum) =>
            this.getApplyBillNumSummaryVO(billNum)
          );
        }
      },
      /**
       * @vuese
       * 提交事件
       * @arg {Boolean} isReturn 是否退回
       */
      onSubmit(isReturn) {
        if (!this.applyBillTableDetail) {
          this.$message({
            type: "warning",
            message: "没有申请表信息，请先查询",
          });
        } else {
          // 否则
          if (isReturn) {
            this.$refs["returnForm"].validate((valid) => {
              if (valid) {
                this.returning = true;
                this.submitApplySummaryBacklog(isReturn).then(() =>
                  this.onBack()
                );
              }
            });
          } else {
            this.submitting = true;
            if (this.applyBillTableDetail.summary.requestId > 0) {
              // 提交待审核
              this.submitApplySummaryBacklog(isReturn).then(() => this.onBack());
            } else {
              // 提交汇总申请流程信息
              this.submitApplyBillSummary().then(() => this.onBack());
            }
          }
        }
      },
      /**
       * @vuese
       * 导出
       */
      onExport() {
        if (this.mainTableData.length === 0) {
          this.$alert("没有数据可导出", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
          return;
        }
        this.exportExcel(
          "报表明细信息",
          this.mainTableColumns,
          this.mainTableData
        );
      },
      /**
       * @vuese
       * 导出Excel
       */
      exportExcel(fileName, columns, data) {
        // 表头数据
        const sheetHeader = columns.map((item) => item.headerName);
        // 表格数据
        const sheetData = data.map((item) => {
          const newItem = {};
          for (const key in item) {
            const findColumn = columns.find(
              (columnItem) => columnItem.field === key
            );
            if (findColumn) {
              newItem[findColumn.headerName] = item[key];
            }
          }
          return newItem;
        });
        this.$utils.exportExcel({
          sheetHeader,
          data: sheetData,
          fileName: `${fileName}.xlsx`,
        });
      },
      /**
       * @vuese
       * 重置表单
       * @arg {String} formName 表单名称
       */
      resetForm(formName) {
        if (!this.$refs[formName]) {
          return;
        }
        this.$refs[formName].resetFields();
      },
      /**
       * @vuese
       * 移除表单项的校验结果
       * @arg {String} formName 表单名称
       */
      clearFormValidate(formName) {
        if (!this.$refs[formName]) {
          return;
        }
        this.$refs[formName].clearValidate();
      },
      /**
       * @vuese
       * 将明细信息列表处理成提交格式
       * @arg {Array} list 明细列表
       * @arg {Array} deleteFields 要删除的字段
       * @arg {Array} sort 自定义排序，例如：["id", "name"]
       */
      formatToSubmit(list, deleteFields = [], sort = []) {
        const newList = [];
        for (const item of list) {
          const newItem = { ...item };
          // 在 newItem 中删除 deleteFields 中包含的字段
          for (const fieldItem of deleteFields) {
            delete newItem[fieldItem];
          }
          const newItem2 = { ...newItem };
          const sortKeys = []; // 参与排序字段的key
          const sortValues = []; // 参与排序字段的值
          // 在 newItem2 中删除 sort 中包含的字段，并且保存参与排序的相关字段的key和value分别保存到新的数组里面去
          for (const fieldItem of sort) {
            if (Object.keys(newItem2).includes(fieldItem)) {
              delete newItem2[fieldItem];
              sortKeys.push(fieldItem);
              sortValues.push(newItem[fieldItem]);
            }
          }
          // 最终拼接
          if (newList.length === 0) {
            newList.push([...sortKeys, ...Object.keys(newItem2)]);
          }
          newList.push([...sortValues, ...Object.values(newItem2)]);
        }
        return newList;
      },
      /**
       * @vuese
       * 发起考核汇总流程 详情
       */
      getPfmSummaryDetail() {
        // 当前登录用户
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        // 处理请求数据
        const { applyDeptId, applySummaryType } = this.headerInfoForm;
        const { applyBeginDate, applyEndDate } = this.getApplyDate();
        const formData = {
          applyDeptId: "",
          applyDeptName: "",
          applySummaryType,
          applyBeginDate,
          applyEndDate,
          createBy: sapNum,
          creator: employeeName,
        };
        for (const item of applyDeptId) {
          const findDeptment = this.departmentOptions.find(
            (deptItem) => deptItem.id === item
          );
          if (findDeptment) {
            formData.applyDeptId += formData.applyDeptId ? `,${item}` : item;
            formData.applyDeptName += formData.applyDeptName
              ? `,${findDeptment.deptName}`
              : findDeptment.deptName;
          }
        }
        // 发起请求
        this.pageLoading = true;
        this.$http
          .getPfmSummaryDetail(formData)
          .then((response) => {
            this.pageLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              const { detailColumns, summary, summaryDetail } = rows;
              // 保存申请表详情
              this.applyBillTableDetail = rows;
              this.detailColumns = this.initDetailColumnRules(detailColumns);
              this.$set(this.headerInfoForm, "applyTitle", summary.applyTitle);
              this.mainTableData = summaryDetail;
              // 初始化ag-grid表格配置
              this.initGrid();
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.pageLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 待办转入，根据单据编号获取考核表申请流程详情
       * @arg {String} billNum 单据编号
       */
      getApplyBillNumSummaryVO(billNum) {
        this.pageLoading = true;
        this.$http
          .getApplyBillNumSummaryVO(billNum)
          .then((response) => {
            this.pageLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              const { detailColumns, summary, summaryDetail } = rows;
              // 保存申请表详情
              this.applyBillTableDetail = rows;
              this.detailColumns = this.initDetailColumnRules(detailColumns);
              this.$set(this.headerInfoForm, "applyTitle", summary.applyTitle);
              this.$set(
                this.headerInfoForm,
                "applyDeptId",
                summary.applyDeptId
                  ? summary.applyDeptId.split(",").map((item) => Number(item))
                  : []
              );
              this.$set(
                this.headerInfoForm,
                "applyEmployee",
                summary.applyEmployee
              );
              // 停止监听选择器
              isWatchSelect = false;
              this.$set(
                this.headerInfoForm,
                "applySummaryType",
                summary.applySummaryType
              );
              // 放开监听选择器
              this.$nextTick(() => {
                isWatchSelect = true;
              });
              this.$set(
                this.headerInfoForm,
                "summaryDate",
                summary.applySummaryType === 1
                  ? [
                      new Date(summary.applyBeginDate),
                      new Date(summary.applyEndDate),
                    ]
                  : new Date(summary.applyBeginDate)
              );
              this.mainTableData = summaryDetail;
              // 初始化ag-grid表格配置
              this.initGrid();
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.pageLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 获取所有部门
       */
      getDeptmentListAll() {
        this.departmentOptionsLoading = true;
        this.$http
          .getDeptmentListAll({})
          .then((response) => {
            this.departmentOptionsLoading = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              this.departmentOptions = rows;
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.departmentOptionsLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 删除汇总申请流程信息
       * @arg {Number} id 评分流程信息Id
       * @arg {String} modifySapnum 修改人工号
       * @arg {String} modifyName 修改人名称
       */
      delApplyBillSummary() {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.deleting = true;
        this.$http
          .delApplyBillSummary({
            id: this.applyBillTableDetail.summary.id,
            updateBy: sapNum,
            updator: employeeName,
          })
          .then((response) => {
            this.deleting = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              // 关闭当前页面，返回代办
              this.resetPage();
              this.onBack();
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.deleting = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * 重置页面
       */
      resetPage() {
        // 重置考核表申请流程信息
        this.applyBillTableDetail = null;
        // 重置抬头信息表单
        this.resetForm("headerInfoForm");
        // 重置ag-grid表格配置
        this.resetGrid();
      },
      /**
       * @vuese
       * 根据汇总类型、汇总日期，获得开始日期、结束日期
       */
      getApplyDate() {
        const { summaryDate } = this.headerInfoForm;
        if (!summaryDate) {
          return {
            applyBeginDate: null,
            applyEndDate: null,
          };
        }
        // 开始日期
        let applyBeginDate = null;
        // 结束日期
        let applyEndDate = null;
        // 0: 月度; 1: 季度; 2: 年度; 3: 全年季度;
        switch (this.headerInfoForm.applySummaryType) {
          // 月度
          case 0:
            applyBeginDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), summaryDate.getMonth(), 1)
            );
            applyEndDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), summaryDate.getMonth() + 1, 0)
            );
            break;
          // 季度
          case 1:
            applyBeginDate = this.$utils.dateFormat("yyyy-MM-dd", summaryDate[0]);
            applyEndDate = this.$utils.dateFormat("yyyy-MM-dd", summaryDate[1]);
            break;
          // 年度
          case 2:
            applyBeginDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), 0, 1)
            );
            applyEndDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), 12, 0)
            );
            break;
          // 全年季度
          case 3:
            applyBeginDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), 0, 1)
            );
            applyEndDate = this.$utils.dateFormat(
              "yyyy-MM-dd",
              new Date(summaryDate.getFullYear(), 12, 0)
            );
            break;
          default:
            break;
        }
        return {
          applyBeginDate,
          applyEndDate,
        };
      },
      /**
       * @vuese
       * 保存汇总申请表申请流程信息
       * @arg {Object} applySummary 抬头信息
       * @arg {Object} summaryDetail 明细信息
       */
      savaApplyBillSummary() {
        const { applyBeginDate, applyEndDate } = this.getApplyDate();
        return new Promise((resolve, reject) => {
          const { summary } = this.applyBillTableDetail;
          // 当前登录用户信息
          const { sapNum, employeeName } =
            this.$utils.getStorage("userData").user;
          // 处理提交信息
          const findPersonnel = this.personnelOptions.find(
            (item) => item.applyEmployee === this.headerInfoForm.applyEmployee
          );
          const formData = {
            applySummary: {
              ...summary,
              // applyDeptId: "",
              // applyDeptName: "",
              applyEmployee: findPersonnel ? findPersonnel.applyEmployee : null,
              applyEmployeeName: findPersonnel
                ? findPersonnel.applyEmployeeName
                : null,
              applyBeginDate,
              applyEndDate,
              updateBy: sapNum,
              updator: employeeName,
              createBy: sapNum,
              creator: employeeName,
            },
            summaryDetail: this.mainTableData.map((item) => ({
              ...item,
              updateBy: sapNum,
              updator: employeeName,
              createBy: sapNum,
              creator: employeeName,
            })),
          };
          if (formData.summaryDetail.length == 0) {
            this.submitting = false;
            this.$message.error("明细信息不能为空");
            return;
          }
          // 拼接部门id 与 部门名称
          // for (const item of this.headerInfoForm.applyDeptId) {
          //   const findDeptment = this.departmentOptions.find(
          //     (deptItem) => deptItem.id === item
          //   );
          //   if (findDeptment) {
          //     formData.applySummary.applyDeptId += formData.applySummary
          //       .applyDeptId
          //       ? `,${item}`
          //       : item;
          //     formData.applySummary.applyDeptName += formData.applySummary
          //       .applyDeptName
          //       ? `,${findDeptment.deptName}`
          //       : findDeptment.deptName;
          //   }
          // }
          this.saving = true;
          // 发起请求
          this.$http
            .savaApplyBillSummary(formData)
            .then((response) => {
              this.saving = false;
              const data = response.data;
              const { code, info, rows } = data;
              if (code === 1) {
                this.$message({
                  type: "success",
                  message: "保存成功",
                });
                resolve(rows);
              } else {
                this.$alert(info, {
                  showClose: false,
                  confirmButtonText: "确定",
                  customClass: "alertFailure",
                });
              }
            })
            .catch((error) => {
              this.saving = false;
              if (error.response && error.response.data.code === 0) {
                this.$message.error(error.response.data.info);
              }
              reject(error);
            });
        });
      },
      /**
       * @vuese
       * 提交汇总申请流程信息
       * @arg {Object} applySummary 抬头信息
       * @arg {Object} summaryDetail 明细信息
       */
      submitApplyBillSummary() {
        return new Promise((resolve, reject) => {
          const { summary } = this.applyBillTableDetail;
          // 当前登录用户信息
          const { sapNum, employeeName } =
            this.$utils.getStorage("userData").user;
          const { applyBeginDate, applyEndDate } = this.getApplyDate();
          // 处理提交信息
          const findPersonnel = this.personnelOptions.find(
            (item) => item.applyEmployee === this.headerInfoForm.applyEmployee
          );
          const formData = {
            applySummary: {
              ...summary,
              // applyDeptId: "",
              // applyDeptName: "",
              applyEmployee: findPersonnel ? findPersonnel.applyEmployee : null,
              applyEmployeeName: findPersonnel
                ? findPersonnel.applyEmployeeName
                : null,
              applyBeginDate,
              applyEndDate,
              updateBy: sapNum,
              updator: employeeName,
              createBy: sapNum,
              creator: employeeName,
            },
            summaryDetail: this.mainTableData.map((item) => ({
              ...item,
              updateBy: sapNum,
              updator: employeeName,
              createBy: sapNum,
              creator: employeeName,
            })),
          };
          if (formData.summaryDetail.length == 0) {
            this.submitting = false;
            this.$message.error("明细信息不能为空");
            return;
          }
          // 拼接部门id 与 部门名称
          // for (const item of this.headerInfoForm.applyDeptId) {
          //   const findDeptment = this.departmentOptions.find(
          //     (deptItem) => deptItem.id === item
          //   );
          //   if (findDeptment) {
          //     formData.applySummary.applyDeptId += formData.applySummary
          //       .applyDeptId
          //       ? `,${item}`
          //       : item;
          //     formData.applySummary.applyDeptName += formData.applySummary
          //       .applyDeptName
          //       ? `,${findDeptment.deptName}`
          //       : findDeptment.deptName;
          //   }
          // }
          this.$http
            .submitApplyBillSummary(formData)
            .then((response) => {
              this.submitting = false;
              const data = response.data;
              const { code, info, rows } = data;
              if (code === 1) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                });
                resolve(rows);
              } else {
                this.$alert(info, {
                  showClose: false,
                  confirmButtonText: "确定",
                  customClass: "alertFailure",
                });
              }
            })
            .catch((error) => {
              this.submitting = false;
              if (error.response && error.response.data.code === 0) {
                this.$message.error(error.response.data.info);
              }
              reject(error);
            });
        });
      },
      /**
       * @vuese
       * 汇总流程 提交待审核
       * @arg {Object} applySummary 抬头信息
       * @arg {Object} summaryDetail 明细信息
       */
      submitApplySummaryBacklog(isReturn) {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        const { billNum } = this.applyBillTableDetail.summary;
        const formData = {
          billNum,
          appeal: this.headerInfoForm.appeal,
          createBy: sapNum,
          creator: employeeName,
          isReturn: isReturn ? 1 : 0, // 是否退回 0-否，1-是
          remark: this.headerInfoForm.remark, // 签字意见
          tableDetailList: this.mainTableData.map((item) => ({
            ...item,
            createBy: sapNum,
            creator: employeeName,
            updateBy: sapNum,
            updator: employeeName,
          })),
        };
        // 退回节点人
        if (isReturn) {
          formData.returnNode = this.returnForm.returnNode;
        }
        return new Promise((resolve, reject) => {
          this.$http
            .submitApplySummaryBacklog(formData)
            .then((response) => {
              if (isReturn) {
                this.returning = false;
              } else {
                this.submitting = false;
              }
              const data = response.data;
              const { code, info } = data;
              if (code === 1) {
                this.$message({
                  type: "success",
                  message: "提交成功",
                });
                resolve();
              } else {
                this.$alert(info, {
                  showClose: false,
                  confirmButtonText: "确定",
                  customClass: "alertFailure",
                });
              }
            })
            .catch((error) => {
              if (isReturn) {
                this.returning = false;
              } else {
                this.submitting = false;
              }
              if (error.response && error.response.data.code === 0) {
                this.$message.error(error.response.data.info);
              }
              reject(error);
            });
        });
      },
      /**
       * @vuese
       * 根据流程 requestId获取可退回的节点列表
       * @arg {String} requestId requestId
       */
      getReturnNodeList() {
        this.returnNodeOptionsLoading = true;
        const { requestId } = this.applyBillTableDetail;
        this.$http
          .getReturnNodeList(requestId)
          .then((response) => {
            this.returnNodeOptionsLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              this.returnNodeOptions = rows;
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.returnNodeOptionsLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 根据部门id 获取部门负责人信息
       * @arg {Number} deptId 部门Id
       */
      getApplyEmployeeListByDeptId(deptId) {
        this.personnelOptionsLoading = true;
        this.$http
          .getApplyEmployeeListByDeptId(deptId)
          .then((response) => {
            this.personnelOptionsLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              this.personnelOptions = rows;
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.personnelOptionsLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
    },
    // 侦听器
    watch: {
      // 传递过来的页面参数
      query(val) {
        // 根据页面参数获取详情
        this.getDetailByQuery();
      },
      // 部门选择改变
      "headerInfoForm.applyDeptId"(val) {
        if (val && val.length > 0) {
          this.getApplyEmployeeListByDeptId(val[0]);
        } else {
          this.$set(this.headerInfoForm, "applyEmployee", null);
        }
      },
      // 汇总类型选择改变
      "headerInfoForm.applySummaryType"(val, olVal) {
        if (!isWatchSelect) {
          return;
        }
        const valArr = [val, olVal];
        if (!valArr.includes(2) || !valArr.includes(3)) {
          this.$set(this.headerInfoForm, "summaryDate", null);
        }
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .m-window {
    &.m-summaryApplication {
      .m-basic-info {
        font-size: 0;
        text-align: right;
        .basic-info-item {
          display: inline-block;
          line-height: 40px;
          margin-left: 20px;
          &:nth-child(1) {
            margin-left: 0;
          }
          &-label {
            font-weight: bold;
            font-size: 16px;
          }
          &-value {
            font-size: 14px;
          }
        }
      }
      .m-header-info {
        &-con {
        }
      }
      .title-text {
        font-weight: bold;
        font-size: 18px;
        line-height: 40px;
      }
      /deep/ .el-tag.el-tag--info {
        overflow: hidden;
      }
    }
    .m-agTable {
      top: 260px;
      // bottom: 44px;
    }
    .m-file {
      position: absolute;
      height: 34px;
      right: 0;
      bottom: 0;
      left: 0;
      margin-top: 10px;
      /deep/ .el-button {
        height: 100%;
        line-height: 1;
        padding: 0 15px;
      }
    }
    .file-dialog-toolbar {
      overflow: hidden;
      &-left {
        float: left;
      }
      &-right {
        float: right;
        width: 300px;
      }
    }
    .file-list {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ecf0f0;
      overflow: hidden;
      .file-item {
        position: relative;
        cursor: pointer;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dcdfe6;
        float: left;
        &.active {
          border-color: #409eff;
        }
        /deep/ .el-checkbox {
          position: absolute;
          top: 0;
          left: 5px;
        }
        &-mask {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 2;
        }
        .file-icon {
          padding: 20px 20px 5px 20px;
          .iconfont {
            font-size: 45px;
            &.icon-file-unknown {
              color: #606266;
            }
          }
        }
        .file-name {
          padding: 0 5px 5px 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }
    .upload-btn {
      /deep/ .el-upload {
        width: 100%;
      }
    }
    /deep/ .column-input {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0 3px;
      margin: 0;
      border: none;
      outline: none;
      line-height: 1;
    }
    /deep/ .column-date-picker {
      height: 26px;
      line-height: 26px;
      input {
        height: 100%;
        border: none;
      }
      .el-input__icon {
        line-height: 26px;
      }
    }
  }
  .myTable {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;
    border-spacing: 0;
    margin-bottom: 10px;
    td {
      height: 30px;
      border: 1px solid #ccc;
    }
  }
  .tLeft {
    text-align: left;
  }
  .bg {
    background-color: #f5faff;
  }
  .fontWeight {
    font-weight: 800;
  }
  .label {
    width: 13.3333%;
  }
  .required {
    color: red;
    font-weight: 800;
  }
  .content {
    width: 350px;
  }
  .fontWeight {
    font-weight: 800;
  }
  .tLeft {
    text-align: left;
  }
  .bg {
    background-color: #f5faff;
  }
  .bgBank {
    background-color: #f5f7fa;
  }
  .remark {
    position: relative;
    padding: 0;
    textarea {
      font-size: 12px;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .el-form-item {
    margin: 0;
  }
  </style>
  