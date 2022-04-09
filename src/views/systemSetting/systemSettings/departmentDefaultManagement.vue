<!--
 * 部门默认信息管理页面
 * @author: 郭湛良-景兴
 * @since: 2021-04-27
-->
<template>
  <div class="m-window m-departmentDefaultManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="" prop="deptIds">
              <el-select
                v-model="searchForm.deptIds"
                :loading="departmentOptionsLoading"
                :class="{
                  'multiple-select':
                    searchForm.deptIds && searchForm.deptIds.length > 1,
                }"
                filterable
                clearable
                multiple
                collapse-tags
                placeholder="请选择部门"
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
          <el-col :span="10" :push="8">
            <el-row :gutter="10" type="flex" justify="end">
              <el-col :span="3" style="overflow: hidden">
                <el-checkbox v-model="searchForm.state" label="显示停用" />
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="btnPermissions.query"
                  :disabled="btnDisableds.query"
                  :loading="mainTableLoading"
                  type="primary"
                  @click="onSearch()"
                >
                  查询
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="btnPermissions.add"
                  :disabled="btnDisableds.add"
                  type="primary"
                  @click="onAdd()"
                >
                  新增
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="btnPermissions.edit"
                  :disabled="btnDisableds.edit"
                  type="primary"
                  @click="onEdit()"
                >
                  编辑
                </el-button>
              </el-col>
              <el-col v-if="!searchForm.state" :span="4">
                <el-button
                  v-if="btnPermissions.delete"
                  :disabled="btnDisableds.delete"
                  :loading="btnLoadings.delete"
                  type="primary"
                  @click="onDelete()"
                >
                  停用
                </el-button>
              </el-col>
              <el-col v-else :span="4">
                <el-button
                  v-if="btnPermissions.restore"
                  :disabled="btnDisableds.restore"
                  :loading="btnLoadings.restore"
                  type="primary"
                  @click="onRestore()"
                >
                  启用
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- /工具栏 -->
    <!-- 主表格 当表格有页码时，m-agTable 后面应加上 m-bottom -->
    <div class="m-agTable m-bottom">
      <ag-grid-vue
        v-loading="mainTableLoading"
        :gridOptions="mainTableOptions"
        :columnDefs="mainTableColumns"
        :rowData="mainTableData"
        class="m-agTableContent ag-theme-balham"
      />
    </div>
    <!-- /主表格 -->
    <!-- 主表格分页 -->
    <div class="m-page">
      <el-pagination
        :current-page="mainTableCurrentPage"
        :page-size="mainTablePageSize"
        :total="mainTableTotal"
        :page-sizes="tableSizeList"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleMainTableSizeChange"
        @current-change="handleMainTableCurrentChange"
      />
    </div>
    <!-- /主表格分页 -->
    <!-- 新增、编辑部门默认信息 对话框 -->
    <el-dialog
      :title="departmentDefaultFormDialogTitle"
      :visible.sync="departmentDefaultFormDialogVisible"
      :before-close="departmentDefaultFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="70%"
    >
      <el-form
        ref="departmentDefaultForm"
        :model="departmentDefaultForm"
        :rules="departmentDefaultFormRules"
        label-width="140px"
      >
        <el-row :gutter="10">
          <el-col v-if="operationFlag === 'add'" :span="12">
            <el-form-item
              :required="operationFlag === 'add'"
              label="部门"
              prop="deptIds"
            >
              <el-select
                v-model="departmentDefaultForm.deptIds"
                :loading="departmentOptionsLoading"
                filterable
                multiple
                collapse-tags
                placeholder="请选择部门"
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
          <el-col :span="12">
            <el-form-item label="是否自评" prop="selfEvaluation">
              <el-switch
                v-model="departmentDefaultForm.selfEvaluation"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onChangeSelfEvaluation"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :required="operationFlag === 'add'"
              label="自评占比"
              prop="scoreRatio"
            >
              <el-select
                v-model="departmentDefaultForm.scoreRatio"
                filterable
                placeholder="请选择"
              >
                <el-option :value="0" label="不占比" />
                <el-option :value="0.1" label="占比10%" />
                <el-option :value="0.2" label="占比20%" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :required="operationFlag === 'add'"
              label="计分方式"
              prop="grade"
            >
              <el-select
                v-model="departmentDefaultForm.grade"
                filterable
                placeholder="请选择计分方式"
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
          <el-col :span="12">
            <el-form-item
              :required="operationFlag === 'add'"
              label="考核指标"
              prop="weight"
            >
              <el-select
                v-model="departmentDefaultForm.weight"
                filterable
                placeholder="请选择考核指标"
              >
                <el-option value="一级指标" label="一级指标" />
                <el-option value="二级指标" label="二级指标" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核体现方式" prop="appraisalMode">
              <el-select
                v-model="departmentDefaultForm.appraisalMode"
                filterable
                clearable
                placeholder="请选择考核体现方式"
              >
                <el-option value="当月工资体现" label="当月工资体现" />
                <el-option value="次月工资体现" label="次月工资体现" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门负责人" prop="pfmDepartmentHead">
              <el-select
                v-model="departmentDefaultForm.pfmDepartmentHead"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                placeholder="请选择部门负责人"
              >
                <el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="干部人数" prop="pfmLeader">
              <el-input
                v-model.trim="departmentDefaultForm.pfmLeader"
                type="text"
                placeholder="请输入干部人数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="干部S级评定标准" prop="pfmStandard">
              <el-input
                v-model.trim="departmentDefaultForm.pfmStandard"
                type="text"
                placeholder="请输入干部S级评定标准"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工人数" prop="pfmEmployee">
              <el-input
                v-model.trim="departmentDefaultForm.pfmEmployee"
                type="text"
                placeholder="请输入员工人数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="S级人数" prop="pfmSnum">
              <el-input
                v-model.trim="departmentDefaultForm.pfmSnum"
                type="text"
                placeholder="请输入S级人数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核形式" prop="pfmType">
              <el-input
                v-model.trim="departmentDefaultForm.pfmType"
                type="text"
                placeholder="请输入考核形式"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合格分数" prop="pfmPassingScore">
              <el-input
                v-model.trim="departmentDefaultForm.pfmPassingScore"
                type="text"
                placeholder="请输入合格分数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不合格的绩效系数" prop="pfmFailCoefficient">
              <el-input
                v-model.trim="departmentDefaultForm.pfmFailCoefficient"
                type="text"
                placeholder="请输入不合格的绩效系数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绩效应用形式" prop="pfmAppliedForms">
              <el-input
                v-model.trim="departmentDefaultForm.pfmAppliedForms"
                type="text"
                placeholder="请输入绩效应用形式"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪酬对接人" prop="pfmSalary">
              <el-select
                v-model="departmentDefaultForm.pfmSalary"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                placeholder="请选择薪酬对接人"
              >
                <el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核人数" prop="pfmCheckNum">
              <el-input
                v-model.trim="departmentDefaultForm.pfmCheckNum"
                type="text"
                placeholder="请输入考核人数"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇总备注信息" prop="memo">
              <el-input
                v-model.trim="departmentDefaultForm.memo"
                type="text"
                placeholder="请输入汇总备注信息"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否需要到员工自评节点"
              prop="isSelfEvaluationNode"
            >
              <el-switch
                v-model="departmentDefaultForm.isSelfEvaluationNode"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDepartmentDefaultFormDialog(true)"
          >取消</el-button
        >
        <el-button
          :loading="departmentDefaultFormSubmitting"
          type="primary"
          @click="onConfirmDepartmentDefaultForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑部门默认信息 对话框 -->
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
import EvenBus from "@/public/evenBus";
import { TABS_CHANGE } from "@/public/evenbusConstant";
import Vue from "vue";
const tooltipForCell = Vue.extend({
  template: `<el-tooltip 
                    class="item" 
                    effect="dark" 
                    :content="params.value" 
                    placement="top-start">
                    <span>{{params.value}}</span>
                </el-tooltip>`,
});
// 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
let mainTableSelectedRow = null;

export default {
  name: "departmentDefaultManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "departmentDefaultManagement",
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        query: true, // 查询
        add: true, // 新增
        edit: true, // 编辑
        delete: true, // 删除
        restore: true, // 恢复
      },
      /**
       * @vuese
       * 按钮禁用状态
       */
      btnDisableds: {
        query: false, // 查询
        add: false, // 新增
        edit: false, // 编辑
        delete: false, // 删除
        restore: false, // 恢复
      },
      /**
       * @vuese
       * 按钮加载状态
       */
      btnLoadings: {
        delete: false, // 删除
        restore: false, // 恢复
      },
      /**
       * @vuese
       * 搜索表单数据
       */
      searchForm: {
        deptIds: null, // 部门ids
        state: false, // 是否显示停用
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
       * 部门默认信息表单对话框 相关数据
       */
      departmentDefaultFormDialogVisible: false, // 对话框是否显示
      departmentDefaultFormSubmitting: false, // 表单提交状态
      // 部门默认信息表单数据
      departmentDefaultForm: {
        deptIds: null, // 部门ids
        selfEvaluation: false, // 是否自评
        isSelfEvaluationNode: false,
        scoreRatio: null, // 自评占比
        grade: null, // 计分方式
        weight: "", // 考核指标
        appraisalMode: "", // 考核体现方式
        pfmDepartmentHead: "", // 部门负责人
        pfmLeader: 0, // 干部人数
        pfmStandard: "", // 干部S级评定标准
        pfmEmployee: 0, // 员工人数
        pfmSnum: 0, // S级人数
        pfmType: "", // 考核形式
        pfmPassingScore: 0, // 合格分数

        pfmFailCoefficient: "", // 不合格的绩效系数
        pfmAppliedForms: "", // 绩效应用形式
        pfmSalary: "", // 薪酬对接人
        pfmCheckNum: 0, // 考核人数
        memo: "", // 汇总备注信息
      },
      departmentDefaultFormRules: {
        deptIds: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (
                this.operationFlag === "add" &&
                (!value || value.length === 0)
              ) {
                callback(new Error("请选择部门"));
              } else {
                callback();
              }
            },
          },
        ],
        scoreRatio: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.operationFlag === "add" && !value && value !== 0) {
                callback(new Error("请选择自评占比"));
              } else {
                callback();
              }
            },
          },
        ],
        grade: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.operationFlag === "add" && !value && value !== 0) {
                callback(new Error("请选择计分方式"));
              } else {
                callback();
              }
            },
          },
        ],
        weight: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.operationFlag === "add" && !value) {
                callback(new Error("请选择考核指标"));
              } else {
                callback();
              }
            },
          },
        ],
      }, // 部门默认信息表单校验规则
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
      ], // 计分方式选项
      companyOptions: [], // 公司选项
      companyOptionsLoading: false, // 公司选项加载状态
      departmentOptions: [], // 部门选项
      departmentOptionsLoading: false, // 部门选项加载状态
      personnelOptions: [], // 人员选项
      personnelOptionsLoading: false, // 人员选项加载状态
      selfEvaluationIsChange: false, // 是否改变过是否自评
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 部门默认信息表单对话框的标题
     */
    departmentDefaultFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增部门默认信息";
          break;
        case "edit":
          _title = "编辑部门默认信息";
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
    // 获取主表格数据
    this.getMainTableData();
    // 获取所有公司
    this.getCompanyListAll();
    // 获取所有部门
    this.getDeptmentListAll();
    // 获取所有人员
    this.getMoldPeronListAll();
  },
  // 实例挂载前
  beforeMount() {
    // 初始化ag-grid表格配置
    this.initGrid();
    // tabs标签页切换
    EvenBus.$on(TABS_CHANGE, (data) => {
      if (data.content === this.name) {
        // 获取所有公司
        this.getCompanyListAll();
        // 获取所有部门
        this.getDeptmentListAll();
        // 获取所有人员
        this.getMoldPeronListAll();
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
      this.mainTableOptions = gridOptions({
        singleSelection: false, // 是否单选
        dragSelectCheckbox: true, // 是否启用拖选行
      });

      this.mainTableColumns = [
        {
          headerName: "公司名称",
          field: "companyName",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "部门名称",
          field: "deptName",
          width: 200,
        },
        {
          headerName: "是否自评",
          field: "selfEvaluation",
          width: 100,
          cellRenderer: ({ data }) => {
            return data.selfEvaluation === 0 ? "是" : "否";
          },
        },
        {
          headerName: "是否需要到员工自评节点",
          field: "isSelfEvaluationNode",
          cellRenderer: ({ data }) => {
            return data.isSelfEvaluationNode === 0 ? "是" : "否";
          },
        },
        {
          headerName: "自评占比",
          field: "scoreRatio",
          width: 100,
        },
        {
          headerName: "计分方式",
          field: "grade",
          width: 150,
          cellRenderer: ({ data }) => {
            const findGrade = this.gradeOptions.find(
              (item) => item.value === data.grade
            );
            return findGrade ? findGrade.name : "";
          },
        },
        {
          headerName: "考核指标",
          field: "weight",
          width: 100,
        },
        {
          headerName: "考核体现方式",
          field: "appraisalMode",
          width: 150,
        },
        {
          headerName: "部门负责人",
          field: "pfmDepartmentHead",
          width: 150,
        },
        {
          headerName: "干部人数",
          field: "pfmLeader",
          width: 100,
        },
        {
          headerName: "干部S级评定标准",
          field: "pfmStandard",
          width: 150,
        },
        {
          headerName: "员工人数",
          field: "pfmEmployee",
          width: 100,
        },
        {
          headerName: "S级人数",
          field: "pfmSnum",
          width: 100,
        },
        {
          headerName: "考核形式",
          field: "pfmType",
          width: 150,
        },
        {
          headerName: "合格分数",
          field: "pfmPassingScore",
          width: 100,
        },
        {
          headerName: "不合格的绩效系数",
          field: "pfmFailCoefficient",
          width: 150,
        },
        {
          headerName: "绩效应用形式",
          field: "pfmAppliedForms",
          width: 150,
        },
        {
          headerName: "薪酬对接人",
          field: "pfmSalary",
          width: 150,
        },
        {
          headerName: "实施时间",
          field: "executeTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "考核人数",
          field: "pfmCheckNum",
          width: 100,
        },
        {
          headerName: "汇总备注信息",
          field: "memo",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "创建人工号",
          field: "createBy",
          width: 150,
        },
        {
          headerName: "创建人姓名",
          field: "creator",
          width: 150,
        },
        {
          headerName: "创建时间",
          field: "createTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "修改人工号",
          field: "updateBy",
          width: 150,
        },
        {
          headerName: "修改人姓名",
          field: "updator",
          width: 150,
        },
        {
          headerName: "修改时间",
          field: "updateTime",
          width: 150,
        },
      ];
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
    getMainTableData() {
      this.getDeptDefaultInfoList();
    },
    /**
     * @vuese
     * 搜索事件
     */
    onSearch() {
      this.operationFlag = "query";
      // 获取主表格数据
      this.getMainTableData();
    },
    /**
     * @vuese
     * 新增事件
     */
    onAdd() {
      this.operationFlag = "add";
      this.openDepartmentDefaultFormDialog();
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
      mainTableSelectedRow = _rows;
      // 打开对话框
      this.openDepartmentDefaultFormDialog();
    },
    /**
     * @vuese
     * 删除事件
     */
    onDelete() {
      // 主表格选中行
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要停用的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      } else if (_rows.length > 1) {
        this.$alert("暂不支持批量停用，请选择一条", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm("确定停用？").then(() => {
        this.operationFlag = "delete";
        // 删除部门默认信息
        this.deleteDeptDefaultInfo(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 恢复事件
     */
    onRestore() {
      // 主表格选中行
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要启用的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      } else if (_rows.length > 1) {
        this.$alert("暂不支持批量启用，请选择一条", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm("确定启用？").then(() => {
        this.operationFlag = "restore";
        // 恢复部门默认信息
        this.restoreDeptDefaultInfo(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 打开 部门默认信息表单对话框
     */
    openDepartmentDefaultFormDialog() {
      this.departmentDefaultFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("departmentDefaultForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("departmentDefaultForm");
          this.selfEvaluationIsChange = false;
          if (mainTableSelectedRow.length === 1) {
            console.log(mainTableSelectedRow);
            const {
              selfEvaluation, // 是否自评
              scoreRatio, // 自评占比
              grade, // 计分方式
              weight, // 考核指标
              appraisalMode, // 考核体现方式
              pfmDepartmentHead, // 部门负责人
              pfmLeader, // 干部人数
              pfmStandard, // 干部S级评定标准
              pfmEmployee, // 员工人数
              pfmSnum, // S级人数
              pfmType, // 考核形式
              pfmPassingScore, // 合格分数
              pfmFailCoefficient, // 不合格的绩效系数
              pfmAppliedForms, // 绩效应用形式
              pfmSalary, // 薪酬对接人
              pfmCheckNum, // 考核人数
              memo, // 汇总备注信息
            } = mainTableSelectedRow[0];
            // 设置表单默认值
            this.departmentDefaultForm = {
              deptIds: null, // 部门ids
              selfEvaluation: selfEvaluation === 0, // 是否自评
              scoreRatio, // 自评占比
              grade, // 计分方式
              weight, // 考核指标
              appraisalMode, // 考核体现方式
              pfmDepartmentHead, // 部门负责人
              pfmLeader, // 干部人数
              pfmStandard, // 干部S级评定标准
              pfmEmployee, // 员工人数
              pfmSnum, // S级人数
              pfmType, // 考核形式
              pfmPassingScore, // 合格分数
              pfmFailCoefficient, // 不合格的绩效系数
              pfmAppliedForms, // 绩效应用形式
              pfmSalary, // 薪酬对接人
              pfmCheckNum, // 考核人数
              memo, // 汇总备注信息
            };
            console.log(this.departmentDefaultForm);
          } else {
            // 设置表单默认值
            this.departmentDefaultForm = {
              deptIds: null, // 部门ids
              selfEvaluation: false, // 是否自评
              scoreRatio: null, // 自评占比
              grade: null, // 计分方式
              weight: "", // 考核指标
              appraisalMode: "", // 考核体现方式
              pfmDepartmentHead: "", // 部门负责人
              pfmLeader: "", // 干部人数
              pfmStandard: "", // 干部S级评定标准
              pfmEmployee: "", // 员工人数
              pfmSnum: "", // S级人数
              pfmType: "", // 考核形式
              pfmPassingScore: "", // 合格分数
              pfmFailCoefficient: "", // 不合格的绩效系数
              pfmAppliedForms: "", // 绩效应用形式
              pfmSalary: "", // 薪酬对接人
              pfmCheckNum: "", // 考核人数
              memo: "", // 汇总备注信息
            };
          }
        }
      });
    },
    /**
     * @vuese
     * 关闭 部门默认信息表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closeDepartmentDefaultFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.departmentDefaultFormDialogVisible = false;
        });
      } else {
        this.departmentDefaultFormDialogVisible = false;
      }
    },
    selfPPP(value) {
      this.departmentDefaultForm.isSelfEvaluationNode =
        !this.departmentDefaultForm.isSelfEvaluationNode;
    },
    /**
     * @vuese
     * 部门默认信息表单对话框 关闭前的回调
     */
    departmentDefaultFormDialogBeforeClose() {
      this.closeDepartmentDefaultFormDialog(true);
    },
    /**
     * @vuese
     * 部门默认信息表单对话框 确认事件
     */
    onConfirmDepartmentDefaultForm() {
      this.$refs["departmentDefaultForm"].validate((valid) => {
        if (valid) {
          if (this.operationFlag === "add") {
            this.addDeptDefaultInfo();
          } else if (this.operationFlag === "edit") {
            this.updateDeptDefaultInfo();
          }
        }
      });
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
      this[formName] = {};
    },
    onChangeSelfEvaluation() {
      this.selfEvaluationIsChange = true;
    },
    // 根据部门名称，合并部门
    // mergeDepartmentByName(list) {
    //   const newDepartmentList = [];
    //   if (list && list.length > 0) {
    //     for (const item of list) {
    //       const findSameIndex = newDepartmentList.findIndex(
    //         (newDepartmentItem) => newDepartmentItem.deptName === item.deptName
    //       );
    //       if (findSameIndex !== -1) {
    //         newDepartmentList[findSameIndex].ids += `,${item.id}`;
    //       } else {
    //         newDepartmentList.push({
    //           ids: String(item.id),
    //           deptName: item.deptName,
    //         });
    //       }
    //     }
    //   }
    //   return newDepartmentList;
    // },
    /**
     * @vuese
     * 获取部门默认信息列表
     */
    getDeptDefaultInfoList() {
      this.mainTableLoading = true;
      this.$http
        .getDeptDefaultInfoList({
          ...this.searchForm,
          deptIds:
            this.searchForm.deptIds && this.searchForm.deptIds.length > 0
              ? this.searchForm.deptIds
              : undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          state: this.searchForm.state ? 1 : 0,
          current: this.mainTableCurrentPage,
          size: this.mainTablePageSize,
        })
        .then((response) => {
          this.mainTableLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows, total } = data;
            this.mainTableData = rows.records;
            this.mainTableTotal = total;
          } else {
            this.mainTableData = [];
            this.mainTableTotal = 0;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.mainTableLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 新增部门默认信息
     */
    addDeptDefaultInfo() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.departmentDefaultFormSubmitting = true;
      const newDepartmentDefaultForm = { ...this.departmentDefaultForm };
      newDepartmentDefaultForm.selfEvaluation =
        newDepartmentDefaultForm.selfEvaluation ? 0 : 1;
      newDepartmentDefaultForm.isSelfEvaluationNode =
        newDepartmentDefaultForm.isSelfEvaluationNode ? 0 : 1;
      // const newDeptIds = [];
      // if (
      //   newDepartmentDefaultForm.deptIds &&
      //   newDepartmentDefaultForm.deptIds.length > 0
      // ) {
      //   for (const item of newDepartmentDefaultForm.deptIds) {
      //     const _split = item.split(",");
      //     for (const splitItem of _split) {
      //       newDeptIds.push(parseInt(splitItem));
      //     }
      //   }
      // }
      // newDepartmentDefaultForm.deptIds = newDeptIds;
      this.$http
        .addDeptDefaultInfo({
          ...newDepartmentDefaultForm,
          createSapnum: sapNum,
          createName: employeeName,
        })
        .then((response) => {
          this.departmentDefaultFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            // 关闭部门默认信息表单对话框
            this.closeDepartmentDefaultFormDialog(false);
            // 获取主表格数据
            this.getMainTableData();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.departmentDefaultFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 修改部门默认信息
     */
    updateDeptDefaultInfo() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.departmentDefaultFormSubmitting = true;
      const newDepartmentDefaultForm = { ...this.departmentDefaultForm };
      for (const key in newDepartmentDefaultForm) {
        if (
          newDepartmentDefaultForm[key] === undefined ||
          newDepartmentDefaultForm[key] === null ||
          newDepartmentDefaultForm[key] === ""
        ) {
          delete newDepartmentDefaultForm[key];
        } else if (!this.selfEvaluationIsChange && key === "selfEvaluation") {
          delete newDepartmentDefaultForm[key];
        }
      }
      if (newDepartmentDefaultForm.selfEvaluation !== undefined) {
        newDepartmentDefaultForm.selfEvaluation =
          newDepartmentDefaultForm.selfEvaluation ? 0 : 1;
      }
      if (newDepartmentDefaultForm.isSelfEvaluationNode !== undefined) {
        newDepartmentDefaultForm.isSelfEvaluationNode =
          newDepartmentDefaultForm.isSelfEvaluationNode ? 0 : 1;
      }
      const newDeptIds = [];
      for (const item of mainTableSelectedRow) {
        newDeptIds.push(item.deptId);
      }
      newDepartmentDefaultForm.deptIds = newDeptIds;
      this.$http
        .updateDeptDefaultInfo({
          ...newDepartmentDefaultForm,
          modifySapnum: sapNum,
          modifyName: employeeName,
        })
        .then((response) => {
          this.departmentDefaultFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            // 关闭部门默认信息表单对话框
            this.closeDepartmentDefaultFormDialog(false);
            // 获取主表格数据
            this.getMainTableData();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.departmentDefaultFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 删除部门默认信息
     * @arg {String} id 部门默认信息记录Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    deleteDeptDefaultInfo(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      this.$http
        .deleteDeptDefaultInfo({
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.$set(this.btnLoadings, "delete", false);
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "停用成功",
            });
            // 获取主表格数据
            this.getMainTableData();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.$set(this.btnLoadings, "delete", false);
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 恢复部门默认信息
     * @arg {String} id 部门默认信息记录Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    restoreDeptDefaultInfo(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "restore", true);
      this.$http
        .restoreDeptDefaultInfo({
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.$set(this.btnLoadings, "restore", false);
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "启用成功",
            });
            // 获取主表格数据
            this.getMainTableData();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.$set(this.btnLoadings, "restore", false);
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 获取所有公司
     */
    getCompanyListAll() {
      this.companyOptionsLoading = true;
      this.$http
        .getCompanyListAll()
        .then((response) => {
          this.companyOptionsLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.companyOptions = rows;
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
     * 获取所有人员
     */
    getMoldPeronListAll() {
      this.personnelOptionsLoading = true;
      this.$http
        .getMoldPeronListAll({})
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
  },
  // 侦听器
  watch: {
    "searchForm.state"() {
      // 获取主表格数据
      this.mainTableCurrentPage = 1;
      this.mainTablePageSize = 30;
      this.getMainTableData();
    },
  },
};
</script>
<style lang="less" scoped>
.m-departmentDefaultManagement {
  // .multiple-select {
  //   /deep/ .el-select__tags {
  //     & > span {
  //       margin-right: 40px;
  //       .el-tag {
  //         &:nth-child(1) {
  //           margin-right: 40px;
  //         }
  //         &:nth-child(2) {
  //           position: absolute;
  //           top: 0;
  //           right: 0;
  //         }
  //       }
  //     }
  //     & > input {
  //       position: absolute;
  //       top: 0;
  //       right: 0;
  //       width: 40px;
  //       margin-left: 0;
  //     }
  //   }
  // }
  // /deep/ .el-select__tags {
  //   font-size: 0;
  // }
  /deep/ .el-tag.el-tag--info {
    // margin-left: 2%;
    overflow: hidden;
    // &:nth-child(1) {
    //   width: 56%;
    // }
    // &:nth-child(2) {
    //   width: 40%;
    // }
  }
}
</style>
