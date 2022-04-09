<!--
 * 字段管理页面
 * @author: 方景哲
 * @since: 2021-05-11
-->
<template>
  <div class="m-window m-systemFieldManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="">
              <el-input
                v-model.trim="searchForm.fieldName"
                type="text"
                placeholder="字段名称/字段描述"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="14" :push="6">
            <el-row :gutter="10" type="flex" justify="end">
              <el-col :span="3" style="overflow: hidden">
                <el-checkbox
                  v-model="searchForm.state"
                  label="显示停用"
                  style="margin-right: 30px"
                  @change="getMainTableData"
                />
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
              <!-- <el-col :span="4">
                <el-button type="primary" @click="detail">明细</el-button>
              </el-col> -->
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
    <!-- 新增、编辑字段信息 对话框 -->
    <el-dialog
      :title="fieldFormDialogTitle"
      :visible.sync="fieldFormDialogVisible"
      :before-close="closeFieldFormDialog"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="fieldForm"
        :model="fieldForm"
        :rules="fieldFormRules"
        label-width="140px"
      >
        <el-form-item label="字段名" prop="fieldName">
          <el-input
            v-model.trim="fieldForm.fieldName"
            type="text"
            @input="slele"
            placeholder="请输入字段名"
            clearable
            :disabled="operationFlag == 'detail' ? true : false"
          />
        </el-form-item>
        <el-form-item label="字段描述" prop="fieldText">
          <el-input
            v-model.trim="fieldForm.fieldText"
            type="text"
            placeholder="请输入字段描述"
            clearable
            :disabled="operationFlag == 'detail' ? true : false"
          />
        </el-form-item>
        <el-form-item label="宽度" prop="fieldWidth">
          <el-input
            v-model.number="fieldForm.fieldWidth"
            @blur="handleInputTwo"
            type="text"
            placeholder="请输入宽度"
            clearable
            :disabled="operationFlag == 'detail' ? true : false"
          />
        </el-form-item>
        <el-form-item label="保留小数位" prop="keepDecimal">
          <el-input
            v-model.number="fieldForm.keepDecimal"
            @blur="handleInput"
            type="text"
            placeholder="请输入保留小数位"
            clearable
            :disabled="operationFlag == 'detail' ? true : false"
          />
        </el-form-item>
        <el-form-item label="控件类型" prop="fieldEditType">
          <el-select
            v-model="fieldForm.fieldEditType"
            filterable
            clearable
            placeholder="请选择控件类型"
            :disabled="operationFlag == 'detail' ? true : false"
          >
            <el-option
              v-for="item in controlTypeOptions"
              :key="item.code"
              :label="item.contractorName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型" prop="fieldType">
          <el-select
            v-model="fieldForm.fieldType"
            filterable
            clearable
            placeholder="请选择字段类型"
            :disabled="operationFlag == 'detail' ? true : false"
          >
            <el-option
              v-for="item in tableTypeOptions"
              :key="item.code"
              :label="item.contractorName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序" prop="sequence">
          <el-input
            v-model.number="fieldForm.sequence"
            type="text"
            placeholder="请输入显示排序"
            clearable
            :disabled="operationFlag == 'detail' ? true : false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFieldFormDialog()">取消</el-button>
        <el-button
          type="primary"
          :disabled="cantdoit"
          @click="onConfirmFieldForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑字段信息 对话框 -->
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
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
// 字段信息表单校验规则
const fieldFormRules = {
  fieldName: [
    {
      required: true,
      trigger: "blur",
      message: "请输入字段名",
    },
  ],
  fieldType: [
    {
      required: true,
      trigger: "blur",
      message: "请输入表格类型",
    },
  ],
  fieldText: [
    {
      required: true,
      trigger: "blur",
      message: "请输入字段描述",
    },
  ],
  fieldWidth: [
    {
      required: true,
      trigger: "blur",
      message: "请输入宽度",
    },
    { type: "number", message: "宽度必须为数字值", trigger: "blur" },
  ],
  keepDecimal: [
    {
      required: true,
      trigger: "blur",
      message: "请输入保留小数位",
    },
    { type: "number", message: "位数必须为数字值", trigger: "blur" },
  ],
  fieldEditType: [
    {
      required: true,
      trigger: "change",
      message: "请选择控件类型",
    },
  ],
  id: [
    {
      required: true,
      trigger: "blur",
      message: "请输入排序",
    },
  ],
};

export default {
  name: "systemFieldManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "systemFieldManagement",
      /**
       * @vuese
       * 按钮权限组
       */
      fieldName: "",
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
        fieldName: "",
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
      cantdoit: false,
      /**
       * @vuese
       * 操作标识
       */
      operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
      /**
       * @vuese
       * 字段信息表单对话框 相关数据
       */
      fieldFormDialogVisible: false, // 对话框是否显示
      fieldFormSubmitting: false, // 表单提交状态
      // 字段信息表单数据
      fieldForm: {
        fieldName: "", // 字段名
        fieldText: "", // 字段描述
        fieldWidth: 50, // 宽度
        keepDecimal: 0, // 保留小数位
        fieldEditType: undefined, // 控件类型
        id: 0, // 排序
      },
      fieldFormRules, // 字段信息表单校验规则
      controlTypeOptions: [
        {
          contractorName: "多行文本框",
          code: "0",
        },
        {
          contractorName: "文本框",
          code: "1",
        },
        {
          contractorName: "日期选择框",
          code: "2",
        },
        {
          contractorName: "下拉框",
          code: "3",
        },
      ], // 控件类型选项
      tableTypeOptions: [
        {
          contractorName: "整数类型",
          code: 1,
        },
        {
          contractorName: "日期类型",
          code: 2,
        },
        {
          contractorName: "字符串类型",
          code: 0,
        },
        {
          contractorName: "小数类型",
          code: 3,
        },
      ], // 控件类型选项
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 字段信息表单对话框的标题
     */
    fieldFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增字段信息";
          break;
        case "edit":
          _title = "编辑字段信息";
          break;
        case "detail":
          _title = "明细字段信息";
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
  },
  // 实例挂载前
  beforeMount() {
    // 初始化ag-grid表格配置
    this.initGrid();
  },
  // 实例挂载完成
  mounted() {},
  // 实例内函数
  methods: {
    handleInput() {
      this.cantdoit = false;
      if (this.fieldForm.keepDecimal < 0) {
        this.$message.info("保留小数位应大于0");
        this.cantdoit = true;
      }
    },
    handleInputTwo() {
      this.cantdoit = false;
      if (this.fieldForm.fieldWidth < 0) {
        this.$message.info("宽度应大于0");
        this.cantdoit = true;
      }
    },
    slele(value) {
      value = value.replace(/[\u4e00-\u9fa5]/g, "");
      this.fieldForm.fieldName = value;
    },
    /**
     * @vuese
     * 是否选中列表数据
     */
    beSelected() {
      let rows = this.mainTableOptions.api.getSelectedRows(); //获取选择行的数据
      if (rows.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择一行数据",
        });
        return false;
      } else {
        return true;
      }
    },
    resetManageForm() {
      if (this.$refs.fieldForm) {
        this.$refs.fieldForm.resetFields();
      }
      this.fieldForm = {
        fieldName: "", // 字段名
        fieldText: "", // 字段描述
        fieldWidth: 50, // 宽度
        keepDecimal: 0, // 保留小数位
        fieldEditType: undefined, // 控件类型
        id: 0, // 排序
      };
    },
    /**
     * @vuese
     * 明细
     */
    detail() {
      this.resetManageForm();
      let rows = this.mainTableOptions.api.getSelectedRows(); //获取选择行的数据
      if (!this.beSelected()) {
        return;
      }
      this.fieldForm = JSON.parse(JSON.stringify(rows[0]));
      this.operationFlag = "detail";

      this.openFieldFormDialog();
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
      this.mainTableOptions = gridOptions({
        singleSelection: true, // 是否单选
        dragSelectCheckbox: true, // 是否启用拖选行
      });

      this.mainTableColumns = [
        {
          headerName: "排序",
          field: "index",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "字段类型",
          field: "fieldType",
          cellRenderer: (params) => {
            if (params.value == 0) {
              return "字符串类型";
            } else if (params.value == 1) {
              return "整数类型";
            } else if (params.value == 2) {
              return "日期类型";
            } else {
              return "小数类型";
            }
          },
        },
        {
          headerName: "字段名",
          field: "fieldName",
        },
        {
          headerName: "字段描述",
          field: "fieldText",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "宽度",
          field: "fieldWidth",
        },
        {
          headerName: "保留小数位",
          field: "keepDecimal",
        },
        {
          headerName: "控件类型",
          field: "fieldEditType",
          cellRenderer: (params) => {
            if (params.value == 0) {
              return "多行文本框";
            } else if (params.value == 1) {
              return "文本框";
            } else if (params.value == 2) {
              return "日期选择框";
            } else {
              return "下拉框";
            }
          },
        },
        {
          headerName: "显示排序",
          field: "sequence",
        },
        {
          headerName: "创建人姓名",
          field: "creator",
        },
        {
          headerName: "创建人工号",
          field: "createBy",
        },
        {
          headerName: "修改人姓名",
          field: "updator",
        },
        {
          headerName: "修改人工号",
          field: "updateBy",
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
      this.mainTableLoading = true;
      this.$http
        .getBasePfmMercolumnList({
          fieldName: this.searchForm.fieldName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          current: this.mainTableCurrentPage,
          size: this.mainTablePageSize,
          state: this.searchForm.state ? 1 : 0,
        })
        .then((response) => {
          this.mainTableLoading = false;
          const data = response.data;
          const { code, info } = data;
          console.log(data);
          if (code === 1) {
            const { rows, total } = data;
            rows.records.map((item, index) => {
              item.index = index + 1;
            });
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
     * 搜索事件
     */ onSearch() {
      this.operationFlag = "query";
      this.getMainTableData();
    },
    /**
     * @vuese
     * 新增事件
     */
    onAdd() {
      this.operationFlag = "add";
      // this.openFieldFormDialog();
      this.resetForm("fieldForm");
      this.fieldFormDialogVisible = true;
    },
    /**
     * @vuese
     * 编辑事件
     */
    onEdit() {
      this.resetManageForm();
      let rows = this.mainTableOptions.api.getSelectedRows(); //获取选择行的数据
      if (!this.beSelected()) {
        return;
      }
      this.fieldForm = JSON.parse(JSON.stringify(rows[0]));
      this.fieldForm.fieldType = Number(this.fieldForm.fieldType);
      this.operationFlag = "edit";
      this.fieldFormDialogVisible = true;
    },
    /**
     * @vuese
     * 删除事件
     */
    onDelete() {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要停用的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm("确定停用？").then(() => {
        this.operationFlag = "delete";
        // 删除系统字段信息
        this.deleteBasePfmMercolumn(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 恢复事件
     */
    onRestore() {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要启用的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm("确定启用？").then(() => {
        this.operationFlag = "restore";
        // 恢复系统字段信息
        this.restoreBasePfmMercolumn(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 打开 字段信息表单对话框
     */
    openFieldFormDialog() {
      this.fieldFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("fieldForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("fieldForm");
          // 设置表单默认值
          this.fieldForm = {
            fieldName: "", // 字段名
            fieldText: "", // 字段描述
            fieldWidth: 50, // 宽度
            keepDecimal: 0, // 保留小数位
            fieldEditType: undefined, // 控件类型
            sequence: 0, // 排序
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 字段信息表单对话框
     */
    closeFieldFormDialog() {
      this.$confirm("确认关闭？").then(() => {
        this.fieldFormDialogVisible = false;
        this.resetForm("fieldForm");
      });
    },
    /**
     * @vuese
     * 判断输入是否符合
     */
    hasSlow() {
      if (
        Number(this.fieldForm.fieldWidth) < 0 ||
        Number(this.fieldForm.decimals) < 0 ||
        Number(this.fieldForm.sort) < 0
      ) {
        this.$message.warning("数字项不能小于0");
        return false;
      }
    },
    /**
     * @vuese
     * 字段信息表单对话框 确认事件
     */
    onConfirmFieldForm() {
      if (this.hasSlow()) {
        return;
      }
      if (this.operationFlag == "detail") {
        this.fieldFormDialogVisible = false;
        this.resetForm("fieldForm");
        return;
      }
      this.$refs["fieldForm"].validate((valid) => {
        if (valid) {
          this.fieldFormSubmitting = true;

          const { sapNum, employeeName } =
            this.$utils.getStorage("userData").user;
          this.fieldForm.fieldWidth = Number(this.fieldForm.fieldWidth);
          this.fieldForm.keepDecimal = Number(this.fieldForm.keepDecimal);
          this.fieldForm.sequence = Number(this.fieldForm.sequence);
          this.fieldForm.creator = employeeName;
          this.fieldForm.createBy = sapNum;
          this.fieldForm.updator = employeeName;
          this.fieldForm.updateBy = sapNum;

          this.fieldForm.sequence = this.fieldForm.id;
          if (this.operationFlag === "add") {
            console.log(1);
            this.$http.saveMercolumn(this.fieldForm).then((res) => {
              if (res.data.code == "1") {
                this.$message.success(res.data.info);
                this.getMainTableData();
                this.fieldFormDialogVisible = false;
                this.resetForm("fieldForm");
              } else {
                this.$message.warning(res.data.info);
              }
            });
          } else if (this.operationFlag === "edit") {
            // 移除表单项的校验结果
            this.$http.updateMercolumn(this.fieldForm).then((res) => {
              if (res.data.code == "1") {
                this.$message.success(res.data.info);
                this.getMainTableData();
                this.fieldFormDialogVisible = false;
                this.resetForm("fieldForm");
              } else {
                this.$message.warning(res.data.info);
              }
            });
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
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      this[formName] = {
        fieldName: "", // 字段名
        fieldText: "", // 字段描述
        fieldWidth: 50, // 宽度
        keepDecimal: 0, // 保留小数位
        fieldEditType: undefined, // 控件类型
        id: 0, // 排序
      };
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
     * @vuese
     * 删除系统字段信息
     * @arg {String} id 字段Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    deleteBasePfmMercolumn(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      this.$http
        .deleteBasePfmMercolumn({
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
     * 恢复系统字段信息
     * @arg {String} id 字段Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    restoreBasePfmMercolumn(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "restore", true);
      this.$http
        .restoreBasePfmMercolumn({
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
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
.m-systemFieldManagement {
}
.systemButtons {
}
</style>
