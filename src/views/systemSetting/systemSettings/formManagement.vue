<!--
 * 考核表内容管理
 * @author: 郭湛良-景兴
 * @since: 2021-05-10
-->
<template>
  <div class="m-window m-formManagement">
    <!-- 基础信息 -->
    <div class="m-basic-info">
      <el-row :gutter="10" type="flex">
        <el-col>
          <div class="basic-info-item">
            <span class="basic-info-item-label">申请人：</span>
            <span class="basic-info-item-value">{{
              userData.employeeName
            }}</span>
          </div>
          <div class="basic-info-item">
            <span class="basic-info-item-label">申请日期：</span>
            <span class="basic-info-item-value">{{ today }}</span>
          </div>
          <!-- <div class="basic-info-item">
            <span class="basic-info-item-label">申请单号：</span>
            <span class="basic-info-item-value"></span>
          </div> -->
        </el-col>
        <el-col :span="2">
          <el-button
            :loading="submitting"
            type="primary"
            size="small"
            @click="onSave"
          >
            保存
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- /基础信息 -->
    <!-- 抬头信息 -->
    <div class="m-header-info">
      <div class="title-text">抬头信息</div>
      <div class="m-header-info-con">
        <el-form
          ref="headerInfoForm"
          :model="headerInfoForm"
          :rules="headerInfoFormRules"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item
                label="申请主题"
                prop="applyTitle"
                label-width="90px"
              >
                <el-input
                  v-model.trim="headerInfoForm.applyTitle"
                  type="text"
                  placeholder="请输入申请主题"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="考核部门" prop="deptId" label-width="90px">
                <el-select
                  v-model="headerInfoForm.deptId"
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
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="被考核人"
                prop="applySapNum"
                label-width="90px"
              >
                <el-select
                  v-model="headerInfoForm.applySapNum"
                  :loading="personnelOptionsLoading"
                  :disabled="!headerInfoForm.deptId"
                  :placeholder="
                    headerInfoForm.deptId ? '请选择' : '请先选择考核部门'
                  "
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in personnelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.sapNum"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="考核表应用时间"
                prop="applicationTime"
                label-width="130px"
              >
                <el-date-picker
                  v-model="headerInfoForm.applicationTime"
                  :picker-options="applicationTimePickerOptions"
                  :clearable="false"
                  type="date"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="考核表类型"
                prop="formType"
                label-width="105px"
              >
                <el-select
                  v-model="headerInfoForm.formType"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option :value="0" label="KPI考核表" />
                  <el-option :value="1" label="绩效管理要点表" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计分方式" prop="grade" label-width="90px">
                <el-select
                  v-model="headerInfoForm.grade"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in gradeOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="考核指标" prop="weight" label-width="90px">
                <el-select
                  v-model="headerInfoForm.weight"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option value="一级指标" label="一级指标" />
                  <el-option value="二级指标" label="二级指标" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="是否自评"
                prop="selfEvaluation"
                label-width="90px"
              >
                <el-select
                  v-model="headerInfoForm.selfEvaluation"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option :value="0" label="是" />
                  <el-option :value="1" label="否" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="自评占比"
                prop="scoreRatio"
                label-width="130px"
              >
                <el-select
                  v-model="headerInfoForm.scoreRatio"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option :value="0" label="不占比" />
                  <el-option :value="0.1" label="占比10%" />
                  <el-option :value="0.2" label="占比20%" />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <el-form-item label="备注" prop="memo" label-width="105px">
                <el-input
                  v-model.trim="headerInfoForm.memo"
                  type="text"
                  placeholder="请输入备注"
                  clearable
                />
              </el-form-item>
            </el-col> -->
          </el-row>
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
            v-if="btnPermissions.add"
            :disabled="
              btnDisableds.add ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            type="primary"
            size="small"
            @click="onAdd()"
          >
            新增
          </el-button>
        </el-col>
        <!-- <el-col :span="2">
          <el-button
            v-if="btnPermissions.edit"
            :disabled="
              btnDisableds.edit ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            type="primary"
            size="small"
            @click="onEdit()"
          >
            编辑
          </el-button>
        </el-col> -->
        <el-col :span="2">
          <el-button
            v-if="btnPermissions.delete"
            :disabled="
              btnDisableds.delete ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            type="primary"
            @click="onDelete()"
          >
            删除
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-upload
            v-if="btnPermissions.import"
            :disabled="
              btnDisableds.import ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            :action="''"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeImportDetail"
            :http-request="importDetail"
            class="upload-btn"
          >
            <el-button
              :loading="btnLoadings.import"
              :disabled="
                btnDisableds.import ||
                !mainTableShow ||
                mainTableColumns.length === 0
              "
              type="primary"
            >
              导入
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="2">
          <el-button
            v-if="btnPermissions.export"
            :disabled="
              btnDisableds.export ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            type="primary"
            @click="onExport"
          >
            导出
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button
            v-if="btnPermissions.import"
            :disabled="
              btnDisableds.downloadTemplate ||
              !mainTableShow ||
              mainTableColumns.length === 0
            "
            type="primary"
            @click="downloadImportTemplate"
          >
            下载模板
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- /工具栏 -->
    <template v-if="mainTableShow">
      <!-- 主表格 当表格有页码时，m-agTable 后面应加上 m-bottom -->
      <div class="m-agTable">
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
    <!-- 新增、编辑明细信息 对话框 -->
    <el-dialog
      :title="detailFormDialogTitle"
      :visible.sync="detailFormDialogVisible"
      :before-close="detailFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="70%"
    >
      <el-form
        ref="detailForm"
        :model="detailForm"
        :rules="detailFormRules"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col
            v-for="item in detailColumns"
            :key="item.fieldName"
            :span="12"
          >
            <el-form-item
              :label="item.fieldText"
              :prop="item.fieldName"
              :rules="item.rules"
            >
              <el-input
                v-if="item.fieldEditType === '0'"
                v-model.trim="detailForm[item.fieldName]"
                :placeholder="'请输入' + item.fieldText"
                :autosize="{ minRows: 1, maxRows: 3 }"
                :maxlength="item.fieldLength || null"
                type="textarea"
                clearable
              />
              <el-input
                v-else-if="item.fieldEditType === '1'"
                v-model.trim="detailForm[item.fieldName]"
                :placeholder="'请输入' + item.fieldText"
                :maxlength="item.fieldLength || null"
                type="text"
                clearable
              />
              <el-date-picker
                v-else-if="item.fieldEditType === '2'"
                v-model="detailForm[item.fieldName]"
                type="date"
                placeholder="请选择"
              />
              <!-- <el-input
                v-else
                v-model.trim="detailForm[item.fieldName]"
                :placeholder="'请输入' + item.fieldName"
                type="text"
                clearable
              /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDetailFormDialog(true)">取消</el-button>
        <el-button
          :loading="detailFormSubmitting"
          type="primary"
          @click="onConfirmDetailForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑明细信息 对话框 -->
    <!--导入失败对话框-->
    <el-dialog
      :visible.sync="importFailDialogVisible"
      :before-close="importFailDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      title="导入失败的明细信息"
      width="70%"
    >
      <div v-if="importFailTableShow" class="m-agTable" style="height: 400px">
        <ag-grid-vue
          class="m-agTableContent ag-theme-balham"
          :gridOptions="importFailTableOptions"
          :columnDefs="importFailTableColumns"
          :rowData="importFailList"
        ></ag-grid-vue>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importFailDialogClose(true)">取消</el-button>
        <el-button
          :loading="exportingFailList"
          type="primary"
          @click="exportFailList"
        >
          导出
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
import constant from "@/public/constant";
import XLSX from "xlsx";
import EvenBus from "@/public/evenBus";
import { TABS_CHANGE } from "@/public/evenbusConstant";
import { v4 as uuidv4 } from "uuid";

let workflowId = ""; // OA流程ID
let nodeId = ""; // 流程节点Id
const requestId = 1;
if (constant.appenv == "dev") {
  workflowId = 9123;
  nodeId = 18944;
} else if (constant.appenv == "qas") {
  workflowId = 9123;
  nodeId = 18944;
} else if (constant.appenv == "app") {
  workflowId = 10383;
  nodeId = 23045;
}

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
// 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
let mainTableSelectedRow = null;
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
  name: "formManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "formManagement",
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
       * 保存状态
       */
      submitting: false,
      /**
       * @vuese
       * 抬头信息表单
       */
      headerInfoForm: {
        applyTitle: "", // 申请主题
        formType: 0, // 考核表类型 0: KPI考核表; 1: 绩效管理要点表;
        deptId: null, // 考核部门Id
        applicationTime: this.$utils.dateFormat(
          "yyyy-MM-dd",
          new Date().getTime() + 24 * 60 * 60 * 1000
        ), // 考核表应用时间
        applySapNum: null, // 被评人工号
        grade: null, // 计分方式 0: 权重分; 1: 权重分扣分; 2: 权重分每项100分;
        selfEvaluation: null, // 是否自评 0: 是; 1: 否;
        scoreRatio: null, // 自评占比 0: 不占比; 0.1: 占比10%; 0.2: 占比20%;
        weight: null, // 考核指标
        memo: null, // 备注
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
      /**
       * @vuese
       * 导入失败 对话框 相关数据
       */
      importFailDialogVisible: false, // 对话框是否显示
      exportingFailList: false, // 导出插入失败的列表的状态
      importFailTableShow: false, // 导入失败表格 显示状态
      importFailTableOptions: {}, // ag-grid 配置
      importFailTableColumns: [], // ag-grid 字段
      importFailList: [], // 插入失败明细列表
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 明细信息表单对话框的标题
     */
    detailFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增明细信息";
          break;
        case "edit":
          _title = "编辑明细信息";
          break;
        default:
          break;
      }
      return _title;
    },
  },
  // 实例创建
  created() {
    // 初始化操作按钮权限
    this.initAuthBtn();
    // 获取所有部门
    this.getDeptmentListAll();
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
        // 根据部门Id获取所有人员
        if (this.headerInfoForm.deptId) {
          this.getMoldPeronListAll(this.headerInfoForm.deptId);
        }
      }
    });
  },
  // 实例挂载完成
  mounted() {},
  // 实例销毁前
  beforeDestroy() {
    EvenBus.$off(TABS_CHANGE);
  },
  // 实例内函数
  methods: {
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
        // this.mainTableOptions = gridOptions({
        //   singleSelection: true, // 是否单选
        //   dragSelectCheckbox: true, // 是否启用拖选行
        // });
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
              editable: true,
              cellEditorFramework: datePicker(item),
            };
          } else {
            newItem = {
              ...newItem,
              editable: true,
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
          if (index === 0) {
            newItem = {
              ...newItem,
              headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
              checkboxSelection: true, // 是否在行头显示勾选框
              headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
            };
          }
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
        this.mainTableOptions = gridOptions({
          singleSelection: true, // 是否单选
          dragSelectCheckbox: true, // 是否启用拖选行
        });
        this.detailColumns = [];
        // 动态配置表格列
        this.mainTableColumns = [];
        this.mainTableData = [];
        this.mainTableShow = true; // 挂载表格
      });
    },
    /**
     * @vuese
     * 初始化导入失败明细信息表格
     */
    initImportFailTable() {
      this.importFailTableShow = false; // 卸载表格
      this.$nextTick(() => {
        this.importFailTableOptions = gridOptions({});
        // 动态配置表格列
        const importFailTableColumns = this.detailColumns.map((item) => {
          let newItem = {
            headerName: item.fieldText,
            field: item.fieldName,
            width: item.colidWeight || item.fieldWidth,
          };
          return newItem;
        });
        importFailTableColumns.push({
          headerName: "错误信息",
          field: "errInfo",
          width: 250,
          cellRenderer: (params) => {
            return `<span style="color: #F56C6C;">${params.value}</span>`;
          },
        });
        this.importFailTableColumns = importFailTableColumns;
        this.importFailTableShow = true; // 挂载表格
      });
    },
    /**
     * @vuese
     * 重置导入失败明细信息表格
     */
    resetImportFailTable() {
      this.importFailTableShow = false; // 卸载表格
      this.$nextTick(() => {
        this.importFailTableOptions = gridOptions({});
        // 动态配置表格列
        this.importFailTableColumns = [];
        this.importFailList = [];
        this.importFailTableShow = true; // 挂载表格
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
     * 初始化明细表单数据
     */
    initDetailForm() {
      const _detailForm = {};
      for (const item of this.detailColumns) {
        _detailForm[item.fieldName] = null;
      }
      this.detailForm = _detailForm;
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
          _rules.push({
            pattern: /^(\d{4})-(\d{2})-(\d{2})$/,
            message: `请保证${item.fieldText}格式为yyyy-MM-dd`,
            trigger: "change",
          });
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
     * 校验明细列表不能存在空行，且不能为空。并且对每个字段进行校验规则
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
     * 保存事件
     */
    onSave() {
      this.$refs["headerInfoForm"].validate((valid) => {
        if (valid) {
          if (
            this.checkDetailList() &&
            this.checkkpiName() &&
            this.checkKpiWeight()
          ) {
            this.getProcessIdByWorkflowId().then((processId) => {
              this.saveApplybillTable(processId);
            });
          }
        }
      });
    },
    /**
     * @vuese
     * 新增事件
     */
    onAdd() {
      this.operationFlag = "add";
      // this.openDetailFormDialog();
      // 新增空行
      const newRow = {};
      for (const item of this.detailColumns) {
        newRow[item.fieldName] = null;
      }
      this.addDetailBatch([newRow]);
    },
    /**
     * @vuese
     * 编辑事件
     */
    onEdit() {
      this.operationFlag = "edit";
      // 主表格选中行
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要编辑的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      // 保存选中行的数据
      mainTableSelectedRow = _rows[0];
      // 打开对话框
      this.openDetailFormDialog();
    },
    /**
     * @vuese
     * 删除事件
     */
    onDelete() {
      // 主表格选中行
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要删除的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.operationFlag = "delete";
      const newMainTableData = [];
      for (const dataItem of this.mainTableData) {
        const findData = _rows.find(
          (rowItem) => rowItem.uuid && rowItem.uuid === dataItem.uuid
        );
        if (!findData) {
          newMainTableData.push(dataItem);
        }
      }
      this.mainTableData = newMainTableData;
    },
    /**
     * @vuese
     * 导入前
     */
    beforeImportDetail(file) {
      this.$set(this.btnLoadings, "import", true);
      this.readExcel(file).then((data) => {
        if (data[0].json.length === 0) {
          this.$set(this.btnLoadings, "import", false);
          this.$alert("Excel中没有数据", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
        } else {
          const { successData, failData } = this.handleDetailExcelData(
            data[0].json
          );
          // console.log("successData:", successData);
          // console.log("failData:", failData);
          if (successData.length > 0) {
            this.addDetailBatch(successData);
            if (failData.length === 0) {
              this.$message({
                type: "success",
                message: "导入成功",
              });
            } else {
              this.$message({
                type: "warning",
                message: `部分数据导入成功，${failData.length}条失败`,
              });
              this.openImportFailDialog();
              this.importFailList = failData;
            }
          } else {
            this.$message({
              type: "error",
              message: "导入失败",
            });
            this.openImportFailDialog();
            this.importFailList = failData;
          }
          this.$set(this.btnLoadings, "import", false);
        }
      });
    },
    /**
     * @vuese
     * 导入
     */
    importDetail(data) {
      this.readExcel(data.file);
    },
    /**
     * @vuese
     * 读取Excel文件，返回json
     */
    readExcel(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          const data = event.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const workbookArr = [];
          workbook.SheetNames.forEach(function (sheetName) {
            let _json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              defval: null,
            });
            // 去空格处理
            _json = _json.map((item) => {
              const newItem = {};
              for (const key in item) {
                newItem[key] = item[key].trim();
              }
              return newItem;
            });
            // 过滤空行
            _json = _json.filter((i) => !Object.values(i).every((j) => !j));
            workbookArr.push({
              name: sheetName,
              json: _json,
            });
          });
          resolve(workbookArr);
        };
        fileReader.onerror = function (event) {
          reject(event);
        };
        // 读取上传文件为二进制
        fileReader.readAsBinaryString(file);
      });
    },
    /**
     * @vuese
     * 处理明细批量导入模板的数据
     */
    handleDetailExcelData(data) {
      const successData = [];
      const failData = [];
      // 行数据初始值
      const initRowData = {};
      for (const item of this.detailColumns) {
        initRowData[item.fieldName] = null;
      }
      // 遍历 Excel 数据
      for (const item of data) {
        const newItem = { ...initRowData };
        let errRule = null;
        for (const key in item) {
          const findColumnItem = this.detailColumns.find(
            (columnItem) => columnItem.fieldText === key
          );
          // 找到列
          if (findColumnItem) {
            // fieldEditType 0: 多行文本框; 1: 文本框; 2: 日期选择器;
            let _value = item[key];
            if (findColumnItem.fieldEditType === "2") {
              _value =
                item[key] && !isNaN(Date.parse(item[key]))
                  ? this.$utils.dateFormat("yyyy-MM-dd", item[key])
                  : item[key];
            }
            newItem[findColumnItem.fieldName] = _value;
            // 校验字段规则
            if (!errRule) {
              errRule = checkRules(findColumnItem.rules, _value);
            }
          }
        }
        if (errRule) {
          failData.push({
            ...newItem,
            errInfo: errRule.message,
          });
        } else {
          successData.push(newItem);
        }
      }
      return {
        successData,
        failData,
      };
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
     * 下载导入模板
     */
    downloadImportTemplate() {
      this.exportExcel("导入模板", this.mainTableColumns, []);
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
     * 打开 明细信息表单对话框
     */
    openDetailFormDialog() {
      this.detailFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("detailForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("detailForm");
          // 设置表单默认值
          this.detailForm = {
            ...mainTableSelectedRow,
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 明细信息表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closeDetailFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.detailFormDialogVisible = false;
        });
      } else {
        this.detailFormDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 明细信息表单对话框 关闭前的回调
     */
    detailFormDialogBeforeClose() {
      this.closeDetailFormDialog(true);
    },
    /**
     * @vuese
     * 明细信息表单对话框 确认事件
     */
    onConfirmDetailForm() {
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          if (this.operationFlag === "add") {
            this.addDetail();
          } else if (this.operationFlag === "edit") {
            this.updateDetail();
          }
        }
      });
    },
    /**
     * @vuese
     * 打开 导入失败的对话框
     */
    openImportFailDialog() {
      this.importFailDialogVisible = true;
    },
    /**
     * @vuese
     * 导入失败的对话框 关闭事件
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    importFailDialogClose(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.importFailDialogVisible = false;
        });
      } else {
        this.importFailDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 导入失败的对话框 关闭前的回调
     */
    importFailDialogBeforeClose() {
      this.importFailDialogClose(true);
    },
    /**
     * @vuese
     * 导出失败的明细列表
     */
    exportFailList() {
      this.exportingFailList = true;
      const _columns = this.detailColumns.map((item) => ({
        ...item,
        field: item.fieldName,
        headerName: item.fieldText,
      }));
      this.exportExcel("导入失败的明细列表", _columns, this.importFailList);
      this.exportingFailList = false;
    },
    /**
     * @vuese
     * 重置表单
     * @arg {String} formName 表单名称
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * @vuese
     * 移除表单项的校验结果
     * @arg {String} formName 表单名称
     */
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate();
    },
    /**
     * 重置页面
     */
    resetPage() {
      // 重置当天时间
      this.today = this.$utils.dateFormat("yyyy-MM-dd", new Date());
      // 重置抬头信息表单
      this.resetForm("headerInfoForm");
      // 重置ag-grid表格配置
      this.resetGrid();
      // 重置导入失败明细信息表格
      this.resetImportFailTable();
      // 初始化明细表单数据
      this.initDetailForm();
      // 重置考核表应用时间
      this.$set(
        this.headerInfoForm,
        "applicationTime",
        this.$utils.dateFormat(
          "yyyy-MM-dd",
          new Date().getTime() + 24 * 60 * 60 * 1000
        )
      );
    },
    /**
     * @vuese
     * 添加明细
     */
    addDetail() {
      let isEmpty = true;
      for (const key in this.detailForm) {
        if (this.detailForm[key]) {
          isEmpty = false;
        }
      }
      if (isEmpty) {
        this.$alert("请填写表单", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.addDetailBatch([{ ...this.detailForm }]);
      this.closeDetailFormDialog(false);
    },
    /**
     * @vuese
     * 修改明细信息
     */
    updateDetail() {
      let isEmpty = true;
      for (const key in this.detailForm) {
        if (this.detailForm[key]) {
          isEmpty = false;
        }
      }
      if (isEmpty) {
        this.$alert("请填写表单", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      const { uuid } = mainTableSelectedRow;
      const findDetailIndex = this.mainTableData.findIndex(
        (item) => item.uuid === uuid
      );
      if (findDetailIndex !== -1) {
        this.$set(this.mainTableData, findDetailIndex, {
          ...this.mainTableData[findDetailIndex],
          ...this.detailForm,
        });
      }
      this.closeDetailFormDialog(false);
    },
    /**
     * @vuese
     * 批量添加明细
     * @arg {Array} data 数据
     */
    addDetailBatch(data) {
      const newData = data.map((item) => ({
        ...item,
        uuid: uuidv4(),
      }));
      this.mainTableData = this.mainTableData.concat(newData);
    },

    /**
     * @vuese
     * 获取流程信息列表
     */
    getProcessIdByWorkflowId() {
      return new Promise((resolve) => {
        this.$http
          .getProcessList({
            workflowId, // OA流程ID
            state: 0,
          })
          .then((response) => {
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              if (rows.records.length > 0) {
                resolve(rows.records[0].id);
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
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
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
     * 获取所有人员
     */
    getMoldPeronListAll(deptId) {
      this.personnelOptionsLoading = true;
      this.$http
        .getMoldPeronListAll({ deptmentId: deptId })
        .then((response) => {
          this.personnelOptionsLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
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
    /**
     * @vuese
     * 获取部门默认信息
     */
    getDeptDefaultInfoByDeptId(deptId) {
      this.$http
        .getDeptDefaultInfoList({
          deptIds: [deptId],
          state: 0,
        })
        .then((response) => {
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            const _list = rows.records;
            // 请求结果返回后，判断一下当前选中部门是不是与这个请求的部门对应的
            if (this.headerInfoForm.deptId === deptId) {
              this.$set(this.headerInfoForm, "grade", _list[0].grade);
              this.$set(
                this.headerInfoForm,
                "selfEvaluation",
                _list[0].selfEvaluation
              );
              this.$set(this.headerInfoForm, "scoreRatio", _list[0].scoreRatio);
              this.$set(this.headerInfoForm, "weight", _list[0].weight);
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
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 获取流程明细列（字段）
     * @arg {Number} processId 流程Id
     * @arg {Number} nodeId 流程节点Id
     * @arg {Number} templateId 模板Id（人员信息中的）
     */
    getDetailColumnList(processId, templateId) {
      this.$http
        .getDetailColumnList(processId, nodeId, templateId)
        .then((response) => {
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.detailColumns = this.initDetailColumnRules(rows);
            // 初始化ag-grid表格配置
            this.initGrid();
            // 初始化导入失败明细信息表格
            this.initImportFailTable();
            // 初始化明细表单数据
            this.initDetailForm();
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
        });
    },
    /**
     * @vuese
     * 新增考核表申请流程信息
     */
    saveApplybillTable(processId) {
      // 处理明细信息的数据
      const _detailList = [];
      console.log(this.mainTableData);
      for (const item of this.mainTableData) {
        const newItem = { ...item };
        delete newItem.uuid;
        if (_detailList.length === 0) {
          _detailList.push(Object.keys(newItem));
        }
        _detailList.push(Object.values(newItem));
      }
      // 明细为空则提醒，并退出函数
      if (_detailList.length === 0) {
        this.$alert("明细不能为空", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      // 处理表单数据
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.submitting = true;
      const findPersonnel = this.personnelOptions.find(
        (item) => item.sapNum === this.headerInfoForm.applySapNum
      );
      const findDepartment = this.departmentOptions.find(
        (item) => item.id === this.headerInfoForm.deptId
      );
      // 请求体
      const newData = {
        ...this.headerInfoForm,
        applyCompany: findPersonnel ? findPersonnel.company : null,
        applyDate: `${this.today} 00:00:00`,
        applyDeptName: findPersonnel ? findPersonnel.department : null,
        applyEmployee: findPersonnel ? findPersonnel.name : null,
        applyName: employeeName,
        applyType: processId,
        creater: sapNum,
        tableName: this.headerInfoForm.applyTitle,
        applicationTime: this.headerInfoForm.applicationTime
          ? this.$utils.dateFormat(
              "yyyy-MM-dd 00:00:00",
              this.headerInfoForm.applicationTime
            )
          : null,
        companyId: findPersonnel ? findPersonnel.companyId : null,
        deptmentId: findPersonnel ? findPersonnel.deptmentId : null,
        deptName: findDepartment ? findDepartment.deptName : null,
        detailList: _detailList.length > 0 ? _detailList : null,
      };
      // 发送请求
      this.$http
        .saveApplybillTable({
          ...newData,
          workflowId, // OA流程ID
          nodeId, // 流程节点Id
          requestId,
          createBy: sapNum,
          creator: employeeName,
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
            // 重置页面表单数据
            this.resetPage();
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
        });
    },
  },
  // 侦听器
  watch: {
    // 部门Id
    "headerInfoForm.deptId"(val) {
      this.$set(this.headerInfoForm, "applySapNum", null);
      this.$set(this.headerInfoForm, "grade", null);
      this.$set(this.headerInfoForm, "selfEvaluation", null);
      this.$set(this.headerInfoForm, "scoreRatio", null);
      this.$set(this.headerInfoForm, "weight", null);
      if (val) {
        this.getDeptDefaultInfoByDeptId(val);
        // 根据部门Id获取所有人员
        this.getMoldPeronListAll(val);
      } else {
        this.personnelOptions = [];
      }
    },
    // 被考核人工号
    "headerInfoForm.applySapNum"(val) {
      if (val) {
        const personnelInfo = this.personnelOptions.find(
          (item) => item.sapNum === val
        );
        const reg = new RegExp("(?<=(绩效考核表申请流程-)).*?(?=(-))");
        // 没有填写申请主题或者符合正则的，生成一个申请主题
        if (
          !this.headerInfoForm.applyTitle ||
          reg.test(this.headerInfoForm.applyTitle)
        ) {
          this.headerInfoForm.applyTitle = `绩效考核表申请流程-${personnelInfo.name}-${this.today}`;
        }
        // 根据员工的 templateId 获取字段列
        if (personnelInfo) {
          const { templateId } = personnelInfo;
          this.getProcessIdByWorkflowId().then((processId) => {
            this.getDetailColumnList(processId, templateId);
          });
        }
      } else {
        this.resetGrid();
        this.resetImportFailTable();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.m-window {
  &.m-formManagement {
    .m-basic-info {
      font-size: 0;
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
</style>
