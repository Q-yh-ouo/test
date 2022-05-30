<!--
 * 绩效考核表申述流程
 * @author: 方景哲
 * @since: 2021-05-19
-->
<template>
    <div v-loading="pageLoading" class="m-mywindow m-window m-gradingApplication">
      <!-- 基础信息 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-row :gutter="10">
            <el-col v-if="query && query.referrer" :span="4">
              <el-button
                :disabled="saving || submitting || deleting"
                type="primary"
                size="small"
                @click="onBack"
              >
                返回
              </el-button>
            </el-col>
            <el-col v-if="query.referrer !== 'haveDoList'" :span="4">
              <el-button
                :loading="saving || submitting"
                :disabled="deleting"
                type="primary"
                size="small"
                @click="onSave"
              >
                保存
              </el-button>
            </el-col>
            <el-col v-if="query.referrer !== 'haveDoList'" :span="4">
              <el-button
                :loading="submitting"
                :disabled="(saving || deleting) && !submitting"
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
                applyBillTableDetail.requestId === 0
              "
              :span="4"
            >
              <el-button
                :loading="deleting"
                :disabled="saving || submitting"
                type="primary"
                size="small"
                @click="deleteApplybillScoreTable"
              >
                删除
              </el-button>
            </el-col>
            <el-col
              v-if="
                applyBillTableDetail &&
                query.referrer !== 'haveDoList' &&
                applyBillTableDetail.requestId > 0
              "
              :span="4"
            >
              <el-button
                :loading="returning"
                :disabled="saving || submitting || deleting"
                type="primary"
                size="small"
                @click="onReturn"
              >
                退回
              </el-button>
            </el-col>
            <!-- <el-col v-if="applyBillTableDetail" :span="2">
              <el-button
                :loading="deleting"
                :disabled="saving || submitting"
                type="primary"
                size="small"
                @click="deleteApplybillScoreTable"
              >
                删除
              </el-button>
            </el-col> -->
            <el-col
              v-if="
                btnPermissions.export &&
                applyBillTableDetail &&
                applyBillTableDetail.merge === 0
              "
              :span="4"
            >
              <el-button
                :disabled="
                  btnDisableds.export ||
                  !mainTableShow ||
                  columnDefs.length === 0 ||
                  saving ||
                  submitting ||
                  deleting
                "
                type="primary"
                @click="onExport"
              >
                导出
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          v-if="applyBillTableDetail && applyBillTableDetail.merge === 1"
          :span="14"
        >
          <div class="m-basic-info">
            <div class="basic-info-item">
              <span class="basic-info-item-label">申请人：</span>
              <span class="basic-info-item-value">{{
                applyBillTableDetail
                  ? applyBillTableDetail.applybillScoreVO.applyName
                  : ""
              }}</span>
            </div>
            <div class="basic-info-item">
              <span class="basic-info-item-label">申请日期：</span>
              <span class="basic-info-item-value">{{ applyDateFmt }}</span>
            </div>
            <div
              v-if="
                applyBillTableDetail &&
                applyBillTableDetail.applybillScoreVO.billNum
              "
              class="basic-info-item"
            >
              <span class="basic-info-item-label">申请单号：</span>
              <span class="basic-info-item-value">
                {{ applyBillTableDetail.applybillScoreVO.billNum }}
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- /基础信息 -->
      <!-- 抬头信息 -->
      <div
        class="m-header-info"
        v-if="
          applyBillTableDetail &&
          applyBillTableDetail.merge === 0 &&
          applyBillTableDetail.applybillScoreVO.requestId &&
          query.referrer === 'toDoList'
        "
      >
        <!-- <div class="title-text">抬头信息</div> -->
        <div class="m-header-info-con">
          <el-form ref="headerInfoForm" :model="headerInfoForm">
            <table class="myTable" cellspacing="0" cellpadding="0">
              <tr>
                <td colspan="6" class="tLeft bg fontWeight">抬头信息</td>
              </tr>
              <tr>
                <td class="bg fontWeight height40">是否申诉</td>
                <td class="tLeft">
                  <el-form-item prop="appeal">
                    <el-select
                      v-model="headerInfoForm.appeal"
                      filterable
                      placeholder="请选择"
                    >
                      <el-option :value="0" label="是" />
                      <el-option :value="1" label="否" />
                    </el-select>
                  </el-form-item>
                </td>
                <td class="bg fontWeight">签字意见</td>
                <td class="tLeft">
                  <el-form-item prop="remark">
                    <el-input
                      v-model.trim="headerInfoForm.remark"
                      placeholder="请输入"
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
      <div
        class="m-header-info"
        v-if="applyBillTableDetail && applyBillTableDetail.merge !== 0"
      >
        <!-- <div class="title-text">抬头信息</div> -->
        <div class="m-header-info-con">
          <el-form ref="headerInfoForm" :model="headerInfoForm">
            <table class="myTable" cellspacing="0" cellpadding="0">
              <tr>
                <td colspan="6" class="tLeft bg fontWeight">抬头信息</td>
              </tr>
              <tr>
                <!-- <td class="bg fontWeight label height65">联系人</td>
                                  <td class="tLeft content">
                                      <el-form-item prop="port">
                                          <el-input placeholder="" clearable v-model.trim="baseInfoForm.contact" disabled></el-input>
                                      </el-form-item>
                                  </td> -->
                <td class="bg fontWeight label">申请主题</td>
                <td class="tLeft content">
                  <el-form-item prop="applyTitle">
                    <el-input
                      v-model.trim="headerInfoForm.applyTitle"
                      :disabled="applyBillTableDetail !== null"
                      type="text"
                      placeholder="请输入申请主题"
                      clearable
                    />
                  </el-form-item>
                </td>
                <td class="bg fontWeight baseInfoForm label">考核部门</td>
                <td class="tLeft">
                  <el-form-item prop="appDeptName">
                    <el-select
                      v-model="headerInfoForm.appDeptName"
                      :disabled="applyBillTableDetail !== null"
                      filterable
                      clearable
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
                </td>
                <td class="bg fontWeight height40 label">被考核人</td>
                <td class="tLeft">
                  <el-form-item prop="appEmployee">
                    <el-select
                      v-model="headerInfoForm.appEmployee"
                      :loading="personnelOptionsLoading"
                      :disabled="
                        !headerInfoForm.deptId || applyBillTableDetail !== null
                      "
                      :placeholder="
                        headerInfoForm.deptId ? '请选择' : '请先选择考核部门'
                      "
                      filterable
                      clearable
                    >
                      <el-input
                        v-model.trim="headerInfoForm.appEmployee"
                        type="text"
                        placeholder=""
                        disabled
                        filterable
                        clearable
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <!-- <td class="label bg fontWeight">报价状态</td>
                                  <td class="tLeft content">{{this.baseInfoForm.quoteState}}</td> -->
              </tr>
              <tr>
                <td class="bg fontWeight">员工类型</td>
                <td class="tLeft">
                  <el-form-item prop="appEmployeeType">
                    <el-select
                      v-model="headerInfoForm.appEmployeeType"
                      disabled
                      filterable
                      clearable
                      placeholder=""
                    >
                      <el-option value="0" label="干部" />
                      <el-option value="1" label="员工" />
                    </el-select>
                  </el-form-item>
                </td>
                <td class="bg fontWeight height40">试用期</td>
                <td class="tLeft">
                  <el-form-item prop="appProbation">
                    <el-select
                      v-model="headerInfoForm.appProbation"
                      disabled
                      filterable
                      clearable
                      placeholder=""
                    >
                      <el-option :value="0" label="是" />
                      <el-option :value="1" label="否" />
                    </el-select>
                  </el-form-item>
                </td>
                <template v-if="query && query.rowData">
                  <td class="bg fontWeight">考核月份</td>
                  <td class="tLeft">
                    <el-form-item prop="checkMonth">
                      <el-input
                        v-model.trim="headerInfoForm.checkMonth"
                        disabled
                        type="text"
                        placeholder=""
                        clearable
                      />
                    </el-form-item>
                  </td>
                </template>
                <template v-else>
                  <td class="bg fontWeight">考核月份</td>
                  <td class="tLeft">
                    <el-form-item prop="lastMonth">
                      <el-input
                        v-model.trim="headerInfoForm.lastMonth"
                        disabled
                        type="text"
                        placeholder=""
                        clearable
                      />
                    </el-form-item>
                  </td>
                </template>
              </tr>
              <tr>
                <td class="bg fontWeight height40">评分人</td>
                <td class="tLeft">
                  <el-form-item prop="appraiser">
                    <el-input
                      v-model.trim="headerInfoForm.appraiser"
                      disabled
                      type="text"
                      placeholder=""
                      clearable
                    />
                  </el-form-item>
                </td>
                <td class="bg fontWeight">考核表名称</td>
                <td class="tLeft">
                  <el-form-item prop="appTableName">
                    <el-input
                      v-model.trim="headerInfoForm.appTableName"
                      disabled
                      type="text"
                      placeholder=""
                      clearable
                    />
                  </el-form-item>
                </td>
                <td class="bg fontWeight">是否自评</td>
                <td class="tLeft">
                  <el-form-item prop="selfEvaluation">
                    <el-select
                      v-model="headerInfoForm.selfEvaluation"
                      disabled
                      filterable
                      clearable
                      placeholder=""
                    >
                      <el-option value="0" label="是" />
                      <el-option value="1" label="否" />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <!---->
              <tr>
                <template v-if="showHigher">
                  <td class="bg fontWeight height40">上级评分</td>
                  <td class="tLeft">
                    <el-form-item prop="sjTotal">
                      <el-input
                        v-model.trim="headerInfoForm.sjTotal"
                        type="text"
                        placeholder="请输入"
                        clearable
                        disabled
                      />
                    </el-form-item>
                  </td>
                </template>
                <template v-if="headerInfoForm.selfEvaluation === '0'">
                  <td class="bg fontWeight">自评总分</td>
                  <td class="tLeft">
                    <el-form-item prop="appSelfTotal">
                      <el-input
                        v-model.trim="headerInfoForm.appSelfTotal"
                        type="text"
                        placeholder="请输入"
                        clearable
                        disabled
                      />
                    </el-form-item>
                  </td>
                </template>
                <template v-if="headerInfoForm.selfEvaluation === '1'">
                  <td class="bg fontWeight">考核总分</td>
                  <td class="tLeft">
                    <el-form-item prop="appTotal">
                      <el-input
                        v-model.trim="headerInfoForm.appTotal"
                        type="text"
                        placeholder="请输入"
                        clearable
                        disabled
                      />
                    </el-form-item>
                  </td>
                </template>
                <td class="bg fontWeight">考核类型</td>
                <td class="tLeft">
                  <el-form-item prop="applySummaryType">
                    <el-select
                      v-model="headerInfoForm.applySummaryType"
                      disabled
                      placeholder="请选择"
                    >
                      <el-option :value="0" label="月度" />
                      <el-option :value="1" label="季度" />
                      <el-option :value="2" label="年度" />
                    </el-select>
                  </el-form-item>
                </td>
                <td class="bg fontWeight height40">是否申诉</td>
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
                <template
                  v-if="
                    !showHigher && applyBillTableDetail.applybillScoreVO.requestId
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
                </template>
              </tr>
              <!---->
              <tr
                v-if="
                  showHigher && applyBillTableDetail.applybillScoreVO.requestId
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
      <div
        v-if="applyBillTableDetail && applyBillTableDetail.merge !== 0"
        class="m-toolbar"
        style="margin-bottom: 0px"
      >
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
                saving ||
                submitting ||
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
      <!-- 主表格 当表格有页码时，m-agTable 后面应加上 m-bottom -->
      <div v-if="mainTableShow" class="m-agTable" :style="{ top: tableTop }">
        <ag-grid-vue
          ref="ag-grid"
          v-if="applyBillTableDetail && applyBillTableDetail.merge === 0"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :columnTypes="columnTypes"
          :groupUseEntireRow="true"
          :groupRowRendererParams="groupRowRendererParams"
          :frameworkComponents="frameworkComponents"
          :rowData="useRowData"
          class="m-agTableContent ag-theme-alpine ag-theme-balham"
        />
        <ag-grid-vue
          ref="ag-grid"
          v-else
          v-loading="mainTableLoading"
          :gridOptions="mainTableOptions"
          :columnDefs="mainTableColumns"
          :rowData="mainTableData"
          class="m-agTableContent ag-theme-balham"
        />
      </div>
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
          <el-button :loading="returning" type="primary" @click="onReturnConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- /选择退回节点 对话框 -->
    </div>
  </template>
  <script>
  import Vue from "vue";
  import authorize from "@/public/authorize";
  import gridOptions from "lesso-common/public/gridOptions";
  import EvenBus from "@/public/evenBus";
  import { TABS_CHANGE } from "@/public/evenbusConstant";
  import { JSAdd, JSSub, JSMul } from "@/public/jsOperation";
  
  // 详细详情
  let applyBillTableDetailAll = null;
  
  // 抬头信息表单校验规则
  const headerInfoFormRules = {
    applyTitle: [
      {
        required: true,
        trigger: ["blur", "change"],
        message: "请输入申请主题",
      },
    ],
    formType: [
      {
        required: true,
        trigger: "change",
        message: "请选择考核表类型",
      },
    ],
    deptId: [
      {
        required: true,
        trigger: "change",
        message: "请选择部门",
      },
    ],
    applicationTime: [
      {
        required: true,
        trigger: "change",
        message: "请选择时间",
      },
    ],
    applySapNum: [
      {
        required: true,
        trigger: "change",
        message: "请选择被考核人",
      },
    ],
    grade: [
      {
        required: true,
        trigger: "change",
        message: "请选择计分方式",
      },
    ],
    selfEvaluation: [
      {
        required: true,
        trigger: "change",
        message: "请选择是否自评",
      },
    ],
    scoreRatio: [
      {
        required: true,
        trigger: "change",
        message: "请选择自评占比",
      },
    ],
    weight: [
      {
        required: true,
        trigger: "change",
        message: "请选择考核指标",
      },
    ],
  };
  // 明细信息表单校验规则
  const detailFormRules = {};
  
  /**
   * 单元格文字提示
   */
  const tooltipForCell = Vue.extend({
    template: `<el-tooltip 
        :content="String(params.value)"
        effect="dark"
        placement="top-start"
      >
        <span>{{params.value}}</span>
      </el-tooltip>`,
  });
  
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
  function inputText(columnItem, callback) {
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
          // 防止报错
          if (this.$refs.input) {
            this.$refs.input.focus();
          }
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
          const { rules, fieldName } = this.columnItem;
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
          const { rowIndex, node } = this.params;
          if (callback) {
            callback({
              rowIndex,
              fieldName,
              dataIndex: parseInt(node.id),
              value: this.setValue,
              rowNode: node,
            });
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
    name: "gradingApplication",
    // 依赖组件
    components: {},
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
        name: "gradingApplication",
        /**
         * @vuese
         * 当前登录用户信息
         */
        userData: this.$utils.getStorage("userData").user,
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
          appDeptName: "", // 考核部门名称
          appEmployee: "", // 被考核人
          lastMonth: "", // 考核月份
          checkMonth: "", // 考核月份
          appTableName: "", // 考核表名称
          appraiser: "", // 评分人名称
          appEmployeeType: null, // 被考核员工类型 0-干部，1-员工
          selfEvaluation: null, // 是否自评， 0-是，1-否
          appProbation: null, // 被考核员工是否试用期 0-是，1-否
          appSelfTotal: "", // 自评分数
          appTotal: "", // 考核总分
          sjTotal: "", // 上级评分
          appeal: 1, // 是否申诉， 0-是，1-否
          remark: "", // 签字意见
        },
        headerInfoFormRules, // 抬头信息表单校验规则
        // 计分方式选项
        gradeOptions: [
          {
            name: "权重分",
            value: 0,
          },
          {
            name: "权重分扣分",
            value: 1,
          },
          {
            name: "权重分每项100分",
            value: 2,
          },
        ],
        // 考核表应用时间，日期选择器特有的选项
        applicationTimePickerOptions: {
          disabledDate: (time) => {
            return (
              new Date(this.$utils.dateFormat("yyyy-MM-dd", time)).getTime() <
              new Date(this.$utils.dateFormat("yyyy-MM-dd", new Date())).getTime()
            );
          },
        },
        /**
         * @vuese
         * 按钮权限组
         */
        btnPermissions: {
          add: true, // 新增
          edit: true, // 编辑
          delete: true, // 删除
          import: true, // 导入
          export: true, // 导出
        },
        /**
         * @vuese
         * 按钮禁用状态
         */
        btnDisableds: {
          add: false, // 新增
          edit: false, // 编辑
          delete: false, // 删除
          import: false, // 导入
          export: false, // 导出
          downloadTemplate: false, // 下载模板
        },
        /**
         * @vuese
         * 按钮加载状态
         */
        btnLoadings: {
          import: false, // 导入
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
         * 页面表格 ag-grid 相关数据
         */
        gridOptions: {},
        gridApi: null,
        columnApi: null,
        columnDefs: [],
        defaultColDef: null,
        columnTypes: null,
        groupRowRendererParams: null,
        useRowData: [],
        /**
         * @vuese
         * 操作标识
         */
        operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
        /**
         * @vuese
         * 明细信息表单对话框 相关数据
         */
        detailFormDialogVisible: false, // 对话框是否显示
        detailFormSubmitting: false, // 表单提交状态
        // 明细信息表单数据
        detailForm: {},
        detailFormRules, // 明细信息表单校验规则
        /**
         * @vuese
         * 部门选择器相关数据
         */
        departmentOptions: [], // 部门选项
        departmentOptionsLoading: false, // 部门选项加载状态
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
        frameworkComponents: null,
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
       * 显示上级
       */
      showHigher() {
        return (
          this.applyBillTableDetail &&
          this.applyBillTableDetail.applybillScoreVO.createBy &&
          (this.query.referrer === "haveDoList" ||
            this.userData.sapNum !==
              this.applyBillTableDetail.applybillScoreVO.createBy)
        );
      },
      /**
       * @vuese
       * 申请日期
       */
      applyDateFmt() {
        if (
          this.applyBillTableDetail &&
          this.applyBillTableDetail.applybillScoreVO.applyDate
        ) {
          return this.$utils.dateFormat(
            "yyyy-MM-dd",
            this.applyBillTableDetail.applybillScoreVO.applyDate
          );
        }
        return this.$utils.dateFormat("yyyy-MM-dd", new Date());
      },
      /**
       * @vuese
       * 表格top高度
       */
      tableTop() {
        let top = 50;
        if (this.applyBillTableDetail) {
          if (this.applyBillTableDetail.merge !== 0) {
            if (this.applyBillTableDetail.applybillScoreVO.requestId) {
              top = 380;
            } else {
              top = 340;
            }
          } else {
            if (
              this.applyBillTableDetail.applybillScoreVO.requestId &&
              this.query.referrer === "toDoList"
            ) {
              top = 130;
            }
          }
        }
        return `${top}px`;
      },
    },
    // 实例创建
    created() {
      // 初始化操作按钮权限
      this.initAuthBtn();
      // 根据页面参数获取详情
      this.getDetailByQuery();
    },
    // 实例挂载前
    beforeMount() {
      // tabs标签页切换
      EvenBus.$on(TABS_CHANGE, (data) => {
        // if (data.content === this.name) {}
      });
    },
    // 实例挂载完成
    mounted() {
      // 初始化ag-grid表格配置
      this.initGrid();
    },
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
          const { referrer, rowData } = this.query;
          const { billNum } = rowData;
          const isBacklog = referrer === "toDoList"; // 是否待办  true: 待办; false: 已办;
          if (referrer === "toDoList") {
            // 获取详情评分流程（合并评分）
            this.getApplyBillNumScoreBatchVO(billNum, isBacklog);
          } else if (referrer === "haveDoList") {
            this.getApplyBillNumScoreVO(billNum, isBacklog);
          }
        } else {
          this.getApplySapNumScoreVO();
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
          // 页面主表格配置
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
          const columns = this.detailColumns.map((item, index) => {
            let newItem = {
              headerName: item.fieldText,
              field: item.fieldName,
              width: item.colidWeight || item.fieldWidth,
              // cellRendererFramework: tooltipForCell,
              // 自动高度
              autoHeight: true,
              cellStyle: {
                "white-space": "normal",
                "word-wrap": "break-word",
              },
            };
            // 可编辑的字段
            const canEditFields = [
              "selfScore", // 自评分数
              "selfReason", // 自评理由
              "score", // 考核得分
              "reason", // 评定理由
              "memo", // 备注
            ];
            if (canEditFields.includes(item.fieldName)) {
              // fieldEditType 0: 多行文本框; 1: 文本框; 2: 日期选择器;
              if (item.fieldEditType === "2") {
                newItem = {
                  ...newItem,
                  editable: this.query.referrer !== "haveDoList",
                  cellEditorFramework: datePicker(item),
                };
              } else {
                // 给单元格添加文本框
                newItem = {
                  ...newItem,
                  editable: this.query.referrer !== "haveDoList",
                  cellEditorFramework: inputText(item, this.inputTextCallback),
                  suppressKeyboardEvent: (params) => {
                    const _rowIndex = params.node.rowIndex;
                    const _key = params.event.keyCode;
                    if (_key === 38) {
                      // keyup
                      if (_rowIndex === 0) {
                        return;
                      } else {
                        if (this.applyBillTableDetail.merge === 0) {
                          // 合并评分时
                          this.gridOptions.api.setFocusedCell(
                            _rowIndex - 1,
                            item.fieldName,
                            null
                          );
                          this.gridOptions.api.startEditingCell({
                            rowIndex: _rowIndex - 1 < 0 ? 0 : _rowIndex - 1,
                            colKey: item.fieldName,
                          });
                        } else {
                          // 单独评分时
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
                      }
                    } else if (_key === 40) {
                      // keydowm
                      if (this.applyBillTableDetail.merge === 0) {
                        this.gridOptions.api.setFocusedCell(
                          _rowIndex + 1,
                          item.fieldName,
                          null
                        );
                        this.gridOptions.api.startEditingCell({
                          rowIndex: _rowIndex + 1,
                          colKey: item.fieldName,
                        });
                      } else {
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
                    }
                  },
                };
              }
            }
            // if (index === 0) {
            //   newItem = {
            //     ...newItem,
            //     headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
            //     checkboxSelection: false, // 是否在行头显示勾选框
            //     headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
            //   };
            // }
            return newItem;
          });
          this.mainTableColumns = columns;
          // 页面主表格（组）配置
          this.gridOptions = Object.assign(
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
          this.columnDefs = [
            {
              headerName: "被考核人",
              field: "groupTitle",
              // width: 150,
              rowGroup: true,
              hide: true,
            },
            ...columns,
          ];
          this.defaultColDef = {
            flex: 1,
            minWidth: 150,
            resizable: true,
          };
          this.groupRowRendererParams = {
            innerRenderer: "groupRowInnerRenderer",
            suppressCount: true,
          };
          this.columnTypes = {
            number: {
              editable: true,
              valueParser: (params) => {
                return String(params.newValue);
              },
            },
          };
          this.mainTableShow = true; // 挂载表格
        });
      },
      /**
       * 单元格输入框组件 输入确认 回调函数
       * @arg {Object} params 组件输入完毕传递过来的参数
       * ---------------------------------------------
       * @arg {Number} rowIndex 组件所在行的下标
       * @arg {String} fieldName 字段名称
       * @arg {Number} dataIndex 所在数据下标
       * @arg {String} value 输入的值
       * @arg {Object} rowNode 组件所在行节点信息
       * ---------------------------------------------
       */
      inputTextCallback(params) {
        // 输入框值更新的回调函数
        const { rowIndex, fieldName, dataIndex, value, rowNode } = params;
        if (this.applyBillTableDetail.merge === 1) {
          // 单独评分
          if (fieldName === "score") {
            this.$nextTick(() => {
              // 自评得分=自评得分
              // 上级评分=考核得分
              // 考核得分=自评得分*自评占比+考核得分*（1-自评占比）
  
              // 计算考核总分
              const assessmentScoreArr = this.mainTableData.map((rowItem) =>
                rowItem.score ? parseFloat(rowItem.score) : 0
              );
              const totalAssessmentScore = assessmentScoreArr.reduce(
                (n, m) => n + m
              );
              const {
                scoreRatio, // 自评占比 0: 不占比; 0.1: 占比10%; 0.2: 占比20%;
                appSelfTotal, // 自评得分
              } = this.applyBillTableDetail.applybillScoreVO;
              const appTotal = JSAdd(
                JSMul(appSelfTotal || 0, scoreRatio),
                JSMul(totalAssessmentScore, 1 - scoreRatio)
              );
              this.$set(this.headerInfoForm, "appTotal", appTotal);
              this.$set(this.headerInfoForm, "sjTotal", appTotal);
            });
          } else if (fieldName === "selfScore") {
            // 计算自评总分
            this.$nextTick(() => {
              const selfScoreArr = this.mainTableData.map((rowItem) =>
                rowItem.selfScore ? parseFloat(rowItem.selfScore) : 0
              );
              const totalSelfScore = selfScoreArr.reduce((n, m) => n + m);
              const {
                scoreRatio, // 自评占比 0: 不占比; 0.1: 占比10%; 0.2: 占比20%;
                appTotal, // 考核总分
              } = this.applyBillTableDetail.applybillScoreVO;
              const sjTotal = JSAdd(
                JSMul(totalSelfScore, scoreRatio),
                JSMul(appTotal || 0, 1 - scoreRatio)
              );
              this.$set(this.headerInfoForm, "appSelfTotal", totalSelfScore);
              this.$set(this.headerInfoForm, "sjTotal", sjTotal);
            });
          }
        } else {
          // 合并评分
          const rowData = this.useRowData[dataIndex];
          const {
            billNum,
            applyCompany,
            appEmployeeSap,
            appEmployee,
            id: rowDataId,
          } = rowData;
          if (fieldName === "score") {
            this.$nextTick(() => {
              // 计算考核总分
              const assessmentScoreArr = this.useRowData
                .filter((rowItem) => rowItem.billNum === billNum)
                .map((rowItem) =>
                  rowItem.score ? parseFloat(rowItem.score) : 0
                );
              const totalAssessmentScore = assessmentScoreArr.reduce(
                (n, m) => n + m
              );
              // 更新 applyBillTableDetailAll 的数据
              // 当前编辑明细所在表的下标
              const detailIndex =
                applyBillTableDetailAll.applybillNumScoreVOS.findIndex(
                  (detailItem) => detailItem.applybillScoreVO.billNum === billNum
                );
              // 当前编辑明细所在表
              const detailItem =
                applyBillTableDetailAll.applybillNumScoreVOS[detailIndex];
              const {
                scoreRatio, // 自评占比 0: 不占比; 0.1: 占比10%; 0.2: 占比20%;
                appSelfTotal, // 自评得分
              } = detailItem.applybillScoreVO;
              // 考核总分
              const appTotal = JSAdd(
                JSMul(appSelfTotal || 0, scoreRatio),
                JSMul(totalAssessmentScore, 1 - scoreRatio)
              );
              // 当前编辑明细的下标
              const detailRowIndex = detailItem.tableDetailList.findIndex(
                (detailRowItem) => detailRowItem.id === rowDataId
              );
              if (detailRowIndex !== -1) {
                // 更新明细数据
                applyBillTableDetailAll.applybillNumScoreVOS[
                  detailIndex
                ].tableDetailList[detailRowIndex].score = parseFloat(value);
              }
              // 更新当前修改的表的总分
              applyBillTableDetailAll.applybillNumScoreVOS[
                detailIndex
              ].applybillScoreVO.appTotal = appTotal;
              // 保存当前修改的表的上级评分
              applyBillTableDetailAll.applybillNumScoreVOS[
                detailIndex
              ].applybillScoreVO.sjTotal = appTotal;
              // 分组标题
              const groupTitle = `${billNum} 被考核人：${applyCompany || ""} ${
                appEmployee || ""
              } 主评分数=${appTotal}`;
  
              // 更新明细中该字段的值
              for (const [rowIndex, rowItem] of this.useRowData.entries()) {
                if (rowItem.appEmployee === appEmployee) {
                  this.$set(this.useRowData[rowIndex], "groupTitle", groupTitle);
                }
              }
              // console.log(
              //   "列表组下标:",
              //   rowNode.parent.rowIndex
              // );
  
              const table = document
                .getElementsByClassName("m-gradingApplication")[0]
                .getElementsByClassName("m-agTable")[0];
              // 改变分组标题内容，更新分数
              const groupListNode = table.getElementsByClassName(
                "ag-full-width-container"
              )[0];
              const thisGroupItemNode =
                groupListNode.children[rowNode.parent.rowIndex];
              const thisGroupValueNode =
                thisGroupItemNode.children[0].getElementsByClassName(
                  "ag-group-value"
                )[0];
              const thisGroupValue = thisGroupValueNode.innerText;
              const thisGroupValueSplit = thisGroupValue.split("=");
              thisGroupValueNode.innerText = `${thisGroupValueSplit[0]}=${appTotal}`;
              console.log(applyBillTableDetailAll);
            });
          } else if (fieldName === "selfScore") {
            // 计算自评总分
            this.$nextTick(() => {
              const selfScoreArr = this.useRowData
                .filter((rowItem) => rowItem.billNum === billNum)
                .map((rowItem) =>
                  rowItem.score ? parseFloat(rowItem.score) : 0
                );
              const totalSelfScore = selfScoreArr.reduce((n, m) => n + m);
              // 计算考核总分
              const assessmentScoreArr = this.useRowData
                .filter((rowItem) => rowItem.billNum === billNum)
                .map((rowItem) =>
                  rowItem.score ? parseFloat(rowItem.score) : 0
                );
              const totalAssessmentScore = assessmentScoreArr.reduce(
                (n, m) => n + m
              );
              // 更新 applyBillTableDetailAll 的数据
              // 当前编辑明细所在表的下标
              const detailIndex =
                applyBillTableDetailAll.applybillNumScoreVOS.findIndex(
                  (detailItem) => detailItem.applybillScoreVO.billNum === billNum
                );
              // 当前编辑明细所在表
              const detailItem =
                applyBillTableDetailAll.applybillNumScoreVOS[detailIndex];
              const {
                scoreRatio, // 自评占比 0: 不占比; 0.1: 占比10%; 0.2: 占比20%;
              } = detailItem.applybillScoreVO;
              // 上级评分
              const appTotal = JSAdd(
                JSMul(totalSelfScore, scoreRatio),
                JSMul(totalAssessmentScore, 1 - scoreRatio)
              );
              // 当前编辑明细的下标
              const detailRowIndex = detailItem.tableDetailList.findIndex(
                (detailRowItem) => detailRowItem.id === rowDataId
              );
              if (detailRowIndex !== -1) {
                // 更新明细数据
                applyBillTableDetailAll.applybillNumScoreVOS[
                  detailIndex
                ].tableDetailList[detailRowIndex].selfScore = parseFloat(value);
              }
              // 更新当前修改的表的自评总分
              applyBillTableDetailAll.applybillNumScoreVOS[
                detailIndex
              ].applybillScoreVO.appSelfTotal = totalSelfScore;
              // 更新当前修改的表的总分
              applyBillTableDetailAll.applybillNumScoreVOS[
                detailIndex
              ].applybillScoreVO.appTotal = appTotal;
              // 保存当前修改的表的上级评分
              applyBillTableDetailAll.applybillNumScoreVOS[
                detailIndex
              ].applybillScoreVO.sjTotal = appTotal;
              // 分组标题
              const groupTitle = `${billNum} 被考核人：${applyCompany || ""} ${
                appEmployee || ""
              } 主评分数=${appTotal}`;
  
              // 更新明细中该字段的值
              for (const [rowIndex, rowItem] of this.useRowData.entries()) {
                if (rowItem.appEmployee === appEmployee) {
                  this.$set(this.useRowData[rowIndex], "groupTitle", groupTitle);
                }
              }
              // console.log(
              //   "列表组下标:",
              //   rowNode.parent.rowIndex
              // );
  
              const table = document
                .getElementsByClassName("m-gradingApplication")[0]
                .getElementsByClassName("m-agTable")[0];
              // 改变分组标题内容，更新分数
              const groupListNode = table.getElementsByClassName(
                "ag-full-width-container"
              )[0];
              // console.log(groupListNode);
              const thisGroupItemNode =
                groupListNode.children[rowNode.parent.rowIndex];
              const thisGroupValueNode =
                thisGroupItemNode.children[0].getElementsByClassName(
                  "ag-group-value"
                )[0];
              const thisGroupValue = thisGroupValueNode.innerText;
              const thisGroupValueSplit = thisGroupValue.split("=");
              thisGroupValueNode.innerText = `${thisGroupValueSplit[0]}=${appTotal}`;
            });
          }
        }
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
          this.gridOptions = gridOptions();
          this.detailColumns = [];
          // 动态配置表格列
          this.mainTableColumns = [];
          this.mainTableData = [];
          this.columnDefs = [];
          this.useRowData = [];
          this.mainTableShow = true; // 挂载表格
        });
      },
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
          if (item.fieldName === "kpiName") {
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
       * 校验明细列表不能存在空行，且不能为空
       */
      checkDetailList() {
        const detailList =
          this.applyBillTableDetail.merge === 0
            ? this.useRowData
            : this.mainTableData;
        let errRule = null; // 错误规则
        for (const item of detailList) {
          const newItem = { ...item };
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
          // 已经找到错误规则 跳出循环
          if (errRule) {
            break;
          }
          // 校验分值
          // 权重不为空的行且数值大于0的行，分数必须填写
          // 如果评分方式为权重分，权重不为空的行，填写的分数不能大于权重的数值
          const grade = this.applyBillTableDetail.applybillScoreVO.grade; // 计分方式 0: 权重分; 1: 权重分扣分; 2: 权重分每项100分;
          const { kpiWeight, score, selfScore } = item;
          if (kpiWeight) {
            if (this.applyBillTableDetail.selfEvaluation === "0") {
              // 自评，自评分数必填
              if (selfScore === undefined || selfScore === null) {
                errRule = { message: "分数必须填写" };
              } else {
                if (grade === "0") {
                  // 自评分数不能大于权重值
                  if (parseFloat(selfScore) > kpiWeight) {
                    errRule = { message: "分数不能大于权重值" };
                  }
                } else if (grade === "1") {
                  // 权重分扣分的自评分数的绝对值不能大于权重值
                  if (Math.abs(selfScore) > kpiWeight) {
                    errRule = { message: "扣分分数绝对值不能大于权重值" };
                  }
                }
              }
            } else {
              // 非自评，考核分数必填
              if (score === undefined || score === null) {
                errRule = { message: "分数必须填写" };
              } else {
                if (grade === "0") {
                  // 考核分数不能大于权重值
                  if (parseFloat(score) > kpiWeight) {
                    errRule = { message: "分数不能大于权重值" };
                  }
                } else if (grade === "1") {
                  // 权重分扣分的自评分数的绝对值不能大于权重值
                  if (Math.abs(score) > kpiWeight) {
                    errRule = { message: "扣分分数绝对值不能大于权重值" };
                  }
                }
              }
            }
          }
        }
        if (errRule) {
          this.$alert(errRule.message, {
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
        if (!this.checkDetailList()) {
          return;
        }
        const isBacklog = !this.query || this.query.referrer === "toDoList"; // 是否待办  true: 待办; false: 已办;
        if (this.applyBillTableDetail) {
          if (this.applyBillTableDetail.merge === 1) {
            // 单独评分
            this.savaApplyBillScore().then((billNum) => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.getApplyBillNumScoreBatchVO(billNum, isBacklog);
            });
          } else {
            // 合并评分
            this.savaApplyBillScoreBatch().then((billNum) => {
              this.$message({
                type: "success",
                message: "保存成功",
              });
              // 关闭当前页面
              // this.removeTabByCode(this.name);
              // 获取详情评分流程（合并评分）
              this.getApplyBillNumScoreBatchVO(billNum, isBacklog);
            });
          }
        }
      },
      /**
       * @vuese
       * 提交事件
       * @arg {Boolean} isReturn 是否退回
       */
      onSubmit(isReturn) {
        if (!this.checkDetailList() || !this.applyBillTableDetail) {
          return;
        }
        if (isReturn) {
          this.$refs["returnForm"].validate((valid) => {
            if (valid) {
              this.submitApply(isReturn);
            }
          });
        } else {
          this.submitApply(isReturn);
        }
      },
      /**
       * @vuese
       * 提交申请
       */
      submitApply(isReturn) {
        if (isReturn) {
          this.returning = true;
        } else {
          this.submitting = true;
        }
        if (this.applyBillTableDetail.merge === 1) {
          // 单独评分
          // 单独提交
          // requestId 为 0 或 null 提交按钮就调用提交的; requestId 不为 0 或 null 就调用审核提交的
          if (!this.applyBillTableDetail.applybillScoreVO.requestId) {
            this.submitApplyBillScore().then(() => {
              // 返回上一页
              this.onBack();
            });
          } else {
            // 否则将已有流程提交到下一节点审批
            this.submitApplyScoreBacklog(isReturn).then(() => {
              // 返回上一页
              this.onBack();
            });
          }
        } else {
          // 合并评分
          // 批量提交
          // requestId 为 0 或 null 提交按钮就调用提交的; requestId 不为 0 或 null 就调用审核提交的
          if (!this.applyBillTableDetail.applybillScoreVO.requestId) {
            this.submitApplyBillScoreBatch().then(() => {
              // 返回上一页
              this.onBack();
            });
          } else {
            this.submitApplyScoreBacklogBatch(isReturn).then(() => {
              // 返回上一页
              this.onBack();
            });
          }
        }
      },
      /**
       * @vuese
       * 导出
       */
      onExport() {
        let columns = [];
        let list = [];
        if (this.applyBillTableDetail.merge === 0) {
          // 合并评分
          columns = this.columnDefs;
          list = this.useRowData;
        } else {
          // 单独评分
          columns = this.mainTableColumns;
          list = this.mainTableData;
        }
        if (list.length === 0) {
          this.$alert("没有数据可导出", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
          return;
        }
        this.exportExcel("报表明细信息", columns, list);
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
       * 发起评分流程 详情
       */
      getApplySapNumScoreVO() {
        const { sapNum } = this.$utils.getStorage("userData").user;
        this.pageLoading = true;
        this.$http
          .getApplySapNumScoreVO(sapNum)
          .then((response) => {
            this.pageLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              const { applybillNumScoreVOS, merge, isScore, requestId } = rows;
              if (!applybillNumScoreVOS || applybillNumScoreVOS.length === 0) {
                return;
              }
              // 保存最详细的详情数据
              applyBillTableDetailAll = rows;
              if (merge === 0) {
                // 合并评分
                let newTableDetailList = [];
                for (const item of applybillNumScoreVOS) {
                  const groupTitle = `${
                    item.applybillScoreVO.billNum || ""
                  } 被考核人：${item.applybillScoreVO.applyCompany || ""} ${
                    item.applybillScoreVO.appEmployee || ""
                  } 主评分数=${item.applybillScoreVO.appTotal || 0}`;
                  newTableDetailList = newTableDetailList.concat(
                    item.tableDetailList.map((detailItem) => ({
                      ...detailItem,
                      billNum: item.applybillScoreVO.billNum,
                      appEmployeeSap: item.applybillScoreVO.appEmployeeSap,
                      appEmployee: item.applybillScoreVO.appEmployee,
                      applyCompany: item.applybillScoreVO.applyCompany,
                      groupTitle,
                    }))
                  );
                }
                // 处理后的详情数据
                this.applyBillTableDetail = {
                  applybillScoreVO: applybillNumScoreVOS[0].applybillScoreVO,
                  detailColumns: applybillNumScoreVOS[0].detailColumns,
                  tableDetailList: newTableDetailList,
                  merge,
                  isScore,
                  requestId,
                };
              } else {
                // 单独评分
                // 处理后的详情数据
                this.applyBillTableDetail = {
                  applybillScoreVO: applybillNumScoreVOS[0].applybillScoreVO,
                  detailColumns: applybillNumScoreVOS[0].detailColumns,
                  tableDetailList: applybillNumScoreVOS[0].tableDetailList,
                  merge,
                  isScore,
                  requestId,
                };
              }
              const { applybillScoreVO, detailColumns, tableDetailList } =
                this.applyBillTableDetail;
              this.headerInfoForm = {
                applyTitle: applybillScoreVO.applyTitle, // 申请主题
                appDeptName: applybillScoreVO.appDeptName, // 考核部门名称
                appEmployee: applybillScoreVO.appEmployee, // 被考核人
                lastMonth: applybillScoreVO.lastMonth, // 考核月份
                appTableName: applybillScoreVO.appTableName, // 考核表名称
                appraiser: applybillScoreVO.appraiser, // 评分人名称
                appEmployeeType: applybillScoreVO.appEmployeeType, // 被考核员工类型 0-干部，1-员工
                selfEvaluation: applybillScoreVO.selfEvaluation, // 是否自评， 0-是，1-否
                appProbation: applybillScoreVO.appProbation, // 被考核员工是否试用期 0-是，1-否
                appSelfTotal: applybillScoreVO.appSelfTotal, // 自评分数
                appTotal: applybillScoreVO.appTotal, // 考核总分
                sjTotal: applybillScoreVO.sjTotal, // 上级评分
                applySummaryType: applybillScoreVO.applySummaryType,
                appeal:
                  !applybillScoreVO.appeal && applybillScoreVO.appeal !== 0
                    ? 1
                    : applybillScoreVO.appeal, // 是否申诉， 0-是，1-否
                remark: "", // 签字意见
              };
              this.detailColumns = this.initDetailColumnRules(detailColumns);
              if (merge === 0) {
                // 合并评分
                this.useRowData = tableDetailList;
              } else {
                // 单独评分
                this.mainTableData = tableDetailList;
              }
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
       * 待办转入，根据单据编号获取评分流程的详情
       * @arg {String} billNum 单据编号
       * @arg {Boolean} isBacklog 是否待办  true: 待办; false: 已办;
       */
      getApplyBillNumScoreVO(billNum, isBacklog) {
        this.pageLoading = true;
        this.$http
          .getApplyBillNumScoreVO(billNum, isBacklog)
          .then((response) => {
            this.pageLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              // 保存最详细的详情数据
              applyBillTableDetailAll = {
                applybillNumScoreVOS: {
                  applybillScoreVO: rows.applybillScoreVO,
                  detailColumns: rows.detailColumns,
                  tableDetailList: rows.tableDetailList,
                },
                merge: 1,
              };
              this.applyBillTableDetail = {
                applybillScoreVO: rows.applybillScoreVO,
                detailColumns: rows.detailColumns,
                tableDetailList: rows.tableDetailList,
                merge: 1,
              };
              const { applybillScoreVO, detailColumns, tableDetailList } =
                this.applyBillTableDetail;
              this.headerInfoForm = {
                applyTitle: applybillScoreVO.applyTitle, // 申请主题
                appDeptName: applybillScoreVO.appDeptName, // 考核部门名称
                appEmployee: applybillScoreVO.appEmployee, // 被考核人
                checkMonth: applybillScoreVO.checkMonth, // 考核月份
                appTableName: applybillScoreVO.appTableName, // 考核表名称
                appraiser: applybillScoreVO.appraiser, // 评分人名称
                appEmployeeType: applybillScoreVO.appEmployeeType, // 被考核员工类型 0-干部，1-员工
                selfEvaluation: applybillScoreVO.selfEvaluation, // 是否自评， 0-是，1-否
                appProbation: applybillScoreVO.appProbation, // 被考核员工是否试用期 0-是，1-否
                appSelfTotal: applybillScoreVO.appSelfTotal, // 自评分数
                appTotal: applybillScoreVO.appTotal, // 考核总分
                sjTotal: applybillScoreVO.sjTotal, // 上级评分
                applySummaryType: applybillScoreVO.applySummaryType, // 上级评分
                appeal:
                  !applybillScoreVO.appeal && applybillScoreVO.appeal !== 0
                    ? 1
                    : applybillScoreVO.appeal, // 是否申诉， 0-是，1-否
                remark: "", // 签字意见
              };
              this.detailColumns = this.initDetailColumnRules(detailColumns);
              this.mainTableData = tableDetailList;
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
       * 待办转入，获取详情评分流程（合并评分）
       * @arg {String} billNum 单据编号
       * @arg {Boolean} isBacklog 是否待办  true: 待办; false: 已办;
       * @arg {String} createBy 当前操作人工号
       */
      getApplyBillNumScoreBatchVO(billNum, isBacklog) {
        const { sapNum } = this.$utils.getStorage("userData").user;
        this.pageLoading = true;
        this.$http
          .getApplyBillNumScoreBatchVO({
            billNum,
            isBacklog,
            createBy: sapNum,
          })
          .then((response) => {
            this.pageLoading = false;
            const data = response.data;
            const { code, info, rows } = data;
            if (code === 1) {
              const { applybillNumScoreVOS, merge, isScore, requestId } = rows;
              if (!applybillNumScoreVOS || applybillNumScoreVOS.length === 0) {
                return;
              }
              // 保存最详细的详情数据
              applyBillTableDetailAll = rows;
              if (merge === 0) {
                // 合并评分
                let newTableDetailList = [];
                for (const item of applybillNumScoreVOS) {
                  const groupTitle = `${
                    item.applybillScoreVO.billNum
                  } 被考核人：${item.applybillScoreVO.applyCompany || ""} ${
                    item.applybillScoreVO.appEmployee || ""
                  } 主评分数=${item.applybillScoreVO.appTotal || 0}`;
                  newTableDetailList = newTableDetailList.concat(
                    item.tableDetailList.map((detailItem) => ({
                      ...detailItem,
                      billNum: item.applybillScoreVO.billNum,
                      appEmployeeSap: item.applybillScoreVO.appEmployeeSap,
                      appEmployee: item.applybillScoreVO.appEmployee,
                      applyCompany: item.applybillScoreVO.applyCompany,
                      applySummaryType: item.applybillScoreVO.applySummaryType,
                      groupTitle,
                    }))
                  );
                }
                // 处理后的详情数据
                this.applyBillTableDetail = {
                  applybillScoreVO: applybillNumScoreVOS[0].applybillScoreVO,
                  detailColumns: applybillNumScoreVOS[0].detailColumns,
                  tableDetailList: newTableDetailList,
                  merge,
                  isScore,
                  requestId,
                };
              } else {
                // 单独评分
                // 处理后的详情数据
                this.applyBillTableDetail = {
                  applybillScoreVO: applybillNumScoreVOS[0].applybillScoreVO,
                  detailColumns: applybillNumScoreVOS[0].detailColumns,
                  tableDetailList: applybillNumScoreVOS[0].tableDetailList,
                  merge,
                  isScore,
                  requestId,
                };
              }
              const { applybillScoreVO, detailColumns, tableDetailList } =
                this.applyBillTableDetail;
              this.headerInfoForm = {
                applyTitle: applybillScoreVO.applyTitle, // 申请主题
                appDeptName: applybillScoreVO.appDeptName, // 考核部门名称
                appEmployee: applybillScoreVO.appEmployee, // 被考核人
                checkMonth: applybillScoreVO.checkMonth, // 考核月份
                appTableName: applybillScoreVO.appTableName, // 考核表名称
                appraiser: applybillScoreVO.appraiser, // 评分人名称
                appEmployeeType: applybillScoreVO.appEmployeeType, // 被考核员工类型 0-干部，1-员工
                selfEvaluation: applybillScoreVO.selfEvaluation, // 是否自评， 0-是，1-否
                appProbation: applybillScoreVO.appProbation, // 被考核员工是否试用期 0-是，1-否
                appSelfTotal: applybillScoreVO.appSelfTotal, // 自评分数
                appTotal: applybillScoreVO.appTotal, // 考核总分
                sjTotal: applybillScoreVO.sjTotal, // 上级评分
                appeal:
                  !applybillScoreVO.appeal && applybillScoreVO.appeal !== 0
                    ? 1
                    : applybillScoreVO.appeal, // 是否申诉， 0-是，1-否
                remark: "", // 签字意见
              };
              this.detailColumns = this.initDetailColumnRules(detailColumns);
              if (merge === 0) {
                // 合并评分
                this.useRowData = tableDetailList;
              } else {
                // 单独评分
                this.mainTableData = tableDetailList;
              }
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
       * 保存考核表申请流程明细信息
       * @arg {Number} mostlyId 考核表申请流程信息记录Id
       * @arg {Array} addDetailList 新增的明细信息列表
       * @arg {Array} updateDetailList 修改的明细信息列表
       * @arg {Array} deleteDetailList 删除的明细信息 Id 集合
       * @arg {String} operatorSapNum 操作人工号
       * @arg {String} operatorName 操作人姓名
       */
      savaApplyBillScore() {
        return new Promise((resolve, reject) => {
          // 当前登录用户信息
          const { sapNum, employeeName } =
            this.$utils.getStorage("userData").user;
          // 详情信息
          this.saving = true;
          // this.query || this.query.referrer === "toDoList"
          const newMainTableData = this.mainTableData.map((item) => {
            const newItem = {
              ...item,
              updateBy: sapNum,
              updator: employeeName,
              createBy: sapNum,
              creator: employeeName,
            };
            // if (!item.createBy && !item.creater) {
            //   newItem.createBy = sapNum;
            //   newItem.creator = employeeName;
            // }
            return newItem;
          });
          const { applybillScoreVO } = this.applyBillTableDetail;
          const newApplybillScoreVO = {
            ...applybillScoreVO,
            ...this.headerInfoForm,
            updateBy: sapNum,
            updator: employeeName,
          };
          if (!applybillScoreVO.createBy && !applybillScoreVO.creater) {
            newApplybillScoreVO.createBy = sapNum;
            newApplybillScoreVO.creater = employeeName;
          }
          this.$http
            .savaApplyBillScore({
              applybillScoreVO: newApplybillScoreVO,
              tableDetailList: newMainTableData,
            })
            .then((response) => {
              this.saving = false;
              const { code, info, rows } = response.data;
              if (code === 1) {
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
       * 保存评分表申请流程信息（批量保存）
       * @arg {Array} applybillNumScoreVOS 申请单列表
       * @arg {Object} applybillScoreVO 抬头信息
       * @arg {Array} tableDetailList 明细信息
       ****************************************
       * @arg {Number} isScore 是否评分不限制， 0-是，1-否
       * @arg {Number} merge 是否合并评分， 0-是，1-否
       */
      savaApplyBillScoreBatch() {
        return new Promise((resolve, reject) => {
          // 当前登录用户信息
          const { sapNum, employeeName } =
            this.$utils.getStorage("userData").user;
          this.saving = true;
          // 处理请求数据
          let newApplyBillTableDetailAll = { ...applyBillTableDetailAll };
          newApplyBillTableDetailAll.applybillNumScoreVOS =
            newApplyBillTableDetailAll.applybillNumScoreVOS.map((item) => ({
              applybillScoreVO: {
                ...item.applybillScoreVO,
                createBy: sapNum,
                creator: employeeName,
                updateBy: sapNum,
                updator: employeeName,
              },
              tableDetailList: item.tableDetailList.map((item) => ({
                ...item,
                createBy: sapNum,
                creator: employeeName,
                updateBy: sapNum,
                updator: employeeName,
              })),
              isScore: newApplyBillTableDetailAll.isScore,
              merge: newApplyBillTableDetailAll.merge,
            }));
          newApplyBillTableDetailAll = {
            merge: 0,
            isScore: 0,
            requestId: 0,
            applybillNumScoreVOS: [
              {
                applybillScoreVO: {
                  id: 27,
                  billNum: "KH20210707029",
                  applySummaryType: 0,
                  applyName: "佘科源",
                  applyDate: null,
                  applyType: 3,
                  applyTitle: "绩效评分与申诉流程-邓景照-2021-07-07",
                  applyCompany: "广东联塑科技实业有限公司",
                  requestId: 0,
                  workflowId: 9122,
                  nodeId: 18944,
                  nodeName: "发起人节点",
                  creater: null,
                  appTableName: "绩效评分与申诉流程-邓景照-2021-07-07",
                  appEmployeeSap: "00047951",
                  appCheckTime: null,
                  appEmployee: "邓景照",
                  appDeptName: "财务部",
                  appEmployeeType: "1",
                  appProbation: 1,
                  appTotal: 5,
                  appSelfTotal: null,
                  appTableId: 125,
                  employeeId: null,
                  memo: null,
                  appeal: null,
                  checkMonth: 7,
                  checkTime: "2021-07-01 00:00:00",
                  appraiser: "佘科源",
                  selfEvaluation: "0",
                  grade: "0",
                  sjTotal: 5,
                  appCompany: null,
                  companyId: 1,
                  deptmentId: 17,
                  subdivisionsDeptId: null,
                  subdivisionsDept: null,
                  remind: null,
                  createBy: "00050201",
                  createTime: "2021-07-07 03:21:47",
                  updateBy: "00050201",
                  updateTime: null,
                  creator: "佘科源",
                  updator: "佘科源",
                  lastMonth: null,
                  stat1: "3",
                  scoreRatio: 0,
                  mergeBatchId: 220746829942226940,
                },
                tableDetailList: [
                  {
                    id: 32,
                    mostlyId: 27,
                    kpiName: "100",
                    kpiDefine: "100",
                    kpiSecondDefine: "100",
                    kpiObjective: "100",
                    kpiWeight: 100,
                    scoringRubric: "100",
                    kpiCycle: "100",
                    kpiDirector: "100",
                    dataReport: null,
                    principal: null,
                    patronn: "100",
                    appraiser: null,
                    kpiGoal: "100",
                    plannedDate: "2021-07-06 00:00:00",
                    actualDate: null,
                    completion: null,
                    selfScore: null,
                    selfReason: null,
                    score: 5,
                    reason: null,
                    memo: null,
                    createBy: "00050201",
                    creator: "佘科源",
                    createTime: "2021-07-06 10:49:38",
                    updateBy: "00050201",
                    updator: "佘科源",
                    updateTime: null,
                  },
                ],
                isScore: 0,
                merge: 0,
              },
            ],
          };
          this.$http
            .savaApplyBillScoreBatch(newApplyBillTableDetailAll)
            .then((response) => {
              this.saving = false;
              const data = response.data;
              const { code, info, rows } = data;
              if (code === 1) {
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
       * 提交评分流程信息
       */
      submitApplyBillScore() {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        // 详情信息
        const newMainTableData = this.mainTableData.map((item) => ({
          ...item,
          createBy: sapNum,
          creator: employeeName,
          updateBy: sapNum,
          updator: employeeName,
        }));
        return new Promise((resolve, reject) => {
          this.$http
            .submitApplyBillScore({
              applybillScoreVO: {
                ...this.applyBillTableDetail.applybillScoreVO,
                ...this.headerInfoForm,
                createBy: sapNum,
                creator: employeeName,
                updateBy: sapNum,
                updator: employeeName,
              },
              tableDetailList: newMainTableData,
              isScore: this.applyBillTableDetail.isScore,
              merge: this.applyBillTableDetail.merge,
            })
            .then((response) => {
              this.submitting = false;
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
              if (error.response && error.response.data.code === 0) {
                this.$message.error(error.response.data.info);
              }
              reject(error);
            });
        });
      },
      /**
       * @vuese
       * 已有流程提交到下一节点审批
       * @arg {Boolean} isReturn 是否退回
       */
      submitApplyScoreBacklog(isReturn) {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        // 详情信息
        const newMainTableData = this.mainTableData.map((item) => ({
          ...item,
          createBy: sapNum,
          creator: employeeName,
          updateBy: sapNum,
          updator: employeeName,
        }));
        console.log(newMainTableData);
        const { applybillScoreVO } = this.applyBillTableDetail;
        // 是否有加扣分项 0-否，1-是
        const isDeductPoints = newMainTableData.find(
          (item) => item.kpiName === "加分项"
        )
          ? 1
          : 0; // 指标名称叫“加分项”“扣分项”的行
        const formData = {
          billNum: applybillScoreVO.billNum,
          appeal: this.headerInfoForm.appeal,
          createBy: sapNum,
          creator: employeeName,
          isDeductPoints,
          isReturn: isReturn ? 1 : 0, // 是否退回 0-否，1-是
          remark: this.headerInfoForm.remark, // 签字意见
          sjTotal: this.headerInfoForm.sjTotal,
          tableDetailList: newMainTableData,
        };
        // 退回节点人
        if (isReturn) {
          formData.returnNode = this.returnForm.returnNode;
        }
        if (this.headerInfoForm.selfEvaluation === "0") {
          formData.appSelfTotal = this.headerInfoForm.appSelfTotal;
        } else {
          formData.appTotal = this.headerInfoForm.appTotal;
        }
        return new Promise((resolve, reject) => {
          this.$http
            .submitApplyScoreBacklog(formData)
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
       * 批量提交待审核接口
       */
      submitApplyScoreBacklogBatch(isReturn) {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        // 处理请求数据
        let newApplyBillTableDetailAll = { ...applyBillTableDetailAll };
        const formData = newApplyBillTableDetailAll.applybillNumScoreVOS.map(
          (item) => {
            const newItem = {
              billNum: item.applybillScoreVO.billNum, // 单据编号
              appeal: this.headerInfoForm.appeal, // 是否申诉 0: 是; 1: 否;
              isReturn: isReturn ? 1 : 0, // 是否退回 0-否，1-是
              remark: this.headerInfoForm.remark, // 签字意见
              appTotal: item.applybillScoreVO.appTotal, // 考核总分
              appSelfTotal: item.applybillScoreVO.appSelfTotal, // 自评总分
              sjTotal: item.applybillScoreVO.sjTotal, // 上级评分
              createBy: sapNum, // 当前操作人工号
              creator: employeeName, // 当前操作人姓名
              // 评分明细信息
              tableDetailList: item.tableDetailList.map((item) => ({
                ...item,
                createBy: sapNum,
                creator: employeeName,
                updateBy: sapNum,
                updator: employeeName,
              })),
            };
            if (isReturn) {
              newItem.returnNode = this.returnForm.returnNode;
            }
            return newItem;
          }
        );
        return new Promise((resolve, reject) => {
          this.$http
            .submitApplyScoreBacklogBatch(formData)
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
       * 提交评分流程信息
       */
      submitApplyBillScoreBatch() {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        // 处理请求数据
        let newApplyBillTableDetailAll = { ...applyBillTableDetailAll };
        newApplyBillTableDetailAll.applybillNumScoreVOS =
          newApplyBillTableDetailAll.applybillNumScoreVOS.map((item) => ({
            applybillScoreVO: {
              ...item.applybillScoreVO,
              createBy: sapNum,
              creator: employeeName,
              updateBy: sapNum,
              updator: employeeName,
            },
            tableDetailList: item.tableDetailList.map((item) => ({
              ...item,
              createBy: sapNum,
              creator: employeeName,
              updateBy: sapNum,
              updator: employeeName,
            })),
            isScore: newApplyBillTableDetailAll.isScore,
            merge: newApplyBillTableDetailAll.merge,
          }));
        return new Promise((resolve, reject) => {
          this.$http
            .submitApplyBillScoreBatch(newApplyBillTableDetailAll)
            .then((response) => {
              this.submitting = false;
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
       * 删除评分流程信息
       * @arg {Number} id 评分流程信息Id
       */
      deleteApplybillScoreTable() {
        // 当前登录用户信息
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.deleting = true;
        this.$http
          .deleteApplybillScoreTable({
            id: this.applyBillTableDetail.applybillScoreVO.id,
            modifySapnum: sapNum,
            modifyName: employeeName,
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
              // 返回上一页
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
       * @vuese
       * 根据流程 requestId获取可退回的节点列表
       * @arg {String} requestId requestId
       */
      getReturnNodeList() {
        this.returnNodeOptionsLoading = true;
        const { requestId } = applyBillTableDetailAll;
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
    },
    // 侦听器
    watch: {
      // 传递过来的页面参数
      query(val) {
        // 根据页面参数获取详情
        this.getDetailByQuery();
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .m-mywindow {
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    overflow: hidden;
    &.m-gradingApplication {
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
          margin-top: 10px;
        }
      }
      .title-text {
        font-weight: bold;
        font-size: 18px;
        line-height: 40px;
      }
    }
    .m-agTable {
      top: 260px;
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
  /deep/ .ag-row-group-expanded,
  .ag-row-group-contracted {
    font-size: 16px;
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
  