<!--
 * 公司信息管理页面
 * @author: 郭湛良-景兴
 * @since: 2021-04-23
-->
<template>
  <div class="m-window m-companyManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="" prop="companyName">
              <el-input
                v-model.trim="searchForm.companyName"
                type="text"
                placeholder="公司名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="10">
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
    <!-- 新增、编辑公司 对话框 -->
    <el-dialog
      :title="companyFormDialogTitle"
      :visible.sync="companyFormDialogVisible"
      :before-close="companyFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="companyForm"
        :model="companyForm"
        :rules="companyFormRules"
        label-width="140px"
      >
        <el-form-item label="公司组织根编码" prop="parentCode">
          <el-select
            v-model="companyForm.parentCode"
            :loading="unauthorizeCompLoading"
            placeholder="请选择"
            clearable
            filterable
            @change="onChangeUnauthorizeComp"
          >
            <el-option
              v-for="item in unauthorizeCompList"
              :key="item.id"
              :label="item.organizationName"
              :value="item.organizationCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司板块" prop="moduleCode">
          <el-select
            v-model="companyForm.moduleCode"
            :loading="moduleCodeCompLoading"
            placeholder="请选择"
            clearable
            filterable
            @change="onChangeodModuleCodeComp"
          >
            <el-option
              v-for="item in moduleCodeCompList"
              :key="item.id"
              :label="item.moduleName"
              :value="item.moduleCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司编码" prop="companyCode">
          <el-input
            v-model.trim="companyForm.companyCode"
            :disabled="operationFlag === 'edit'"
            :maxlength="4"
            type="text"
            placeholder="请输入公司编码"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司全称" prop="companyFullName">
          <el-input
            v-model.trim="companyForm.companyFullName"
            type="text"
            placeholder="请输入公司全称"
            :maxlength="30"
            clearable
          />
        </el-form-item>
        <el-form-item label="公司简称" prop="companyName">
          <el-input
            v-model.trim="companyForm.companyName"
            type="text"
            placeholder="请输入公司简称"
            :maxlength="30"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCompanyFormDialog(true)">取消</el-button>
        <el-button
          :loading="companyFormSubmitting"
          type="primary"
          @click="onConfirmCompanyForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑公司 对话框 -->
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
import EvenBus from "@/public/evenBus";
import { TABS_CHANGE } from "@/public/evenbusConstant";
import Vue from "vue";

// 公司表单校验规则
const companyFormRules = {
  companyCode: [
    {
      required: true,
      trigger: "blur",
      message: "请输入公司编码",
    },
    {
      min: 4,
      max: 4,
      trigger: "blur",
      message: "公司编码长度应为4",
    },
  ],
  companyFullName: [
    {
      required: true,
      trigger: "blur",
      message: "请输入公司全称",
    },
  ],
  parentCode: [
    {
      required: true,
      trigger: "change",
      message: "请选择",
    },
  ],
  moduleCode: [
    {
      required: true,
      trigger: "change",
      message: "请选择",
    },
  ],
};
// 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
let mainTableSelectedRow = null;
const tooltipForCell = Vue.extend({
  template: `<el-tooltip 
    class="item" 
    effect="dark" 
    :content="params.value" 
    placement="top-start">
    <span>{{params.value}}</span>
  </el-tooltip>`,
});
export default {
  name: "companyManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "companyManagement",
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
        changeState: true, // 改变状态，停用、启用
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
        changeState: false, // 改变状态，停用、启用
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
        companyName: "", // 公司名称
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
       * 公司信息表单对话框 相关数据
       */
      companyFormDialogVisible: false, // 对话框是否显示
      companyFormSubmitting: false, // 表单提交状态
      // 公司表单数据
      companyForm: {
        companyCode: "", // 公司编码
        companyFullName: "", // 公司全称
        companyName: "", // 公司简称
        parentCode: "", // 公司组织根编码
        moduleCode: "", //公司板块编号
        moduleName: "", //公司板块名称
      },
      companyFormRules, // 公司表单校验规则
      /**
       * @vuese
       * 可授权公司 相关数据
       */
      unauthorizeCompLoading: false, // 可授权公司加载状态
      unauthorizeCompList: [], // 可授权公司列表
      // 公司板块
      moduleCodeCompLoading: false, //公司板块还在状态
      moduleCodeCompList: [], //公司板块列表
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 公司表单对话框的标题
     */
    companyFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增公司信息";
          break;
        case "edit":
          _title = "编辑公司信息";
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
    // 获取可授权公司列表
    this.getUnauthorizeComp();
    // 获取公司板块
    this.getModuleCodeCompList();
  },
  // 实例挂载前
  beforeMount() {
    // 初始化ag-grid表格配置
    this.initGrid();
    // tabs标签页切换
    EvenBus.$on(TABS_CHANGE, (data) => {
      if (data.content === this.name) {
        // 获取可授权公司列表
        this.getUnauthorizeComp();
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
        singleSelection: true, // 是否单选
        dragSelectCheckbox: true, // 是否启用拖选行
      });

      this.mainTableColumns = [
        {
          headerName: "公司编码",
          field: "companyCode",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "公司板块",
          field: "moduleName",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "公司简称",
          field: "companyName",

          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "公司全称",
          field: "companyFullName",

          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "创建人",
          field: "creator",
        },
        {
          headerName: "创建时间",
          field: "createTime",
        },
        {
          headerName: "修改人",
          field: "updator",
        },
        {
          headerName: "修改时间",
          field: "updateTime",
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
      this.getCompanyList();
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
      this.openCompanyFormDialog();
    },
    /**
     * @vuese
     * 编辑事件
     */
    onEdit() {
      this.operationFlag = "edit";
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
      this.openCompanyFormDialog();
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
        // 删除公司信息
        this.deleteCompany(_rows[0].id);
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
        // 恢复公司信息
        this.restoreCompany(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 打开 公司表单对话框
     */
    openCompanyFormDialog() {
      this.companyFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("companyForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("companyForm");
          // 从可授权公司列表中找当前主表格选中行的可授权公司，如果没找到则将表单中的“parentCode”清空，不作此处理的话有可能会出现显示“19000127”等编码的情况
          const findUnauthorizeComp = this.unauthorizeCompList.find(
            (item) => item.organizationCode === mainTableSelectedRow.parentCode
          );
          // 设置表单默认值
          this.companyForm = {
            companyCode: mainTableSelectedRow.companyCode, // 公司编码
            companyFullName: mainTableSelectedRow.companyFullName, // 公司全称
            companyName: mainTableSelectedRow.companyName, // 公司简称
            moduleCode: mainTableSelectedRow.moduleCode,
            moduleName: mainTableSelectedRow.moduleName,
            parentCode: findUnauthorizeComp
              ? mainTableSelectedRow.parentCode
              : "", // 公司组织根编码
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 公司表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closeCompanyFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.companyFormDialogVisible = false;
        });
      } else {
        this.companyFormDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 公司表单对话框 关闭前的回调
     */
    companyFormDialogBeforeClose() {
      this.closeCompanyFormDialog(true);
    },
    /**
     * @vuese
     * 公司表单对话框 确认事件
     */
    onConfirmCompanyForm() {
      this.$refs["companyForm"].validate((valid) => {
        if (valid) {
          if (this.operationFlag === "add") {
            this.addCompany();
          } else if (this.operationFlag === "edit") {
            this.updateCompany();
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
    },
    /**
     * 公司组织根编码选择器 改变事件
     */
    onChangeUnauthorizeComp(val) {
      const findUnauthorizeComp = this.unauthorizeCompList.find(
        (item) => item.organizationCode === val
      );
      if (findUnauthorizeComp) {
        const { organizationName } = findUnauthorizeComp;
        this.$set(this.companyForm, "companyFullName", organizationName);
      }
    },
    /**
     * 公司组织根编码选择器 改变事件
     */
    onChangeodModuleCodeComp(val) {
      const findUnauthorizeComp = this.moduleCodeCompList.find(
        (item) => item.moduleCode === val
      );
      if (findUnauthorizeComp) {
        const { moduleName, moduleCode } = findUnauthorizeComp;
        this.$set(this.companyForm, "moduleName", moduleName);
        this.$set(this.companyForm, "moduleCode", moduleCode);
      }
    },
    /**
     * @vuese
     * 获取公司列表
     */
    getCompanyList() {
      this.mainTableLoading = true;
      this.$http
        .getCompanyList({
          ...this.searchForm,
          companyName: this.searchForm.companyName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
     * 获取可授权公司板块列表
     */
    getModuleCodeCompList() {
      this.moduleCodeCompLoading = true;
      this.$http
        .getCompanyModulePart()
        .then((response) => {
          console.log(response, "response");
          this.moduleCodeCompLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.moduleCodeCompList = rows;
            if (this.operationFlag === "edit") {
              let temp = rows.find((params) => {
                return params.moduleCode === mainTableSelectedRow.moduleCode;
              });
              this.$set(this.searchForm, "moduleCode", temp[0].moduleCode);
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
          this.moduleCodeCompLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 获取可授权公司列表
     */
    getUnauthorizeComp() {
      this.unauthorizeCompLoading = true;
      this.$http
        .getUnauthorizeComp()
        .then((response) => {
          this.unauthorizeCompLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.unauthorizeCompList = rows;
            // 当前操作为编辑 且 公司信息表单对话框为打开状态 且 有主表格选中数据时，对表单中“parentCode”赋值
            if (
              this.operationFlag === "edit" &&
              this.companyFormDialogVisible &&
              mainTableSelectedRow
            ) {
              const findUnauthorizeComp = this.unauthorizeCompList.find(
                (item) =>
                  item.organizationCode === mainTableSelectedRow.parentCode
              );
              this.$set(
                this.companyForm,
                "parentCode",
                findUnauthorizeComp ? mainTableSelectedRow.parentCode : ""
              ); // 设置公司信息表单的组织根编码
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
          this.unauthorizeCompLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 新增公司
     * @arg {String} companyCode 公司编码
     * @arg {String} companyFullName 公司全称
     * @arg {String} companyName 公司简称
     * @arg {String} parentCode 公司根编码
     * @arg {String} createBy 创建人工号
     * @arg {String} creator 创建人姓名
     */
    addCompany() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.companyFormSubmitting = true;
      this.$http
        .addCompany({
          ...this.companyForm,
          createBy: sapNum,
          creator: employeeName,
        })
        .then((response) => {
          this.companyFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            // 关闭公司信息表单对话框
            this.closeCompanyFormDialog(false);
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
          this.companyFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 修改公司信息
     * @arg {String} id 公司Id
     * @arg {String} companyCode 公司编码
     * @arg {String} companyFullName 公司全称
     * @arg {String} companyName 公司简称
     * @arg {String} parentCode 公司根编码
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    updateCompany() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      const { id } = mainTableSelectedRow;
      this.companyFormSubmitting = true;
      this.$http
        .updateCompany({
          ...this.companyForm,
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.companyFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            // 关闭公司信息表单对话框
            this.closeCompanyFormDialog(false);
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
          this.companyFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 删除公司信息
     * @arg {String} id 公司Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    deleteCompany(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      this.$http
        .deleteCompany({
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
     * 恢复公司信息
     * @arg {String} id 公司Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    restoreCompany(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "restore", true);
      this.$http
        .restoreCompany({
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
.m-companyManagement {
}
</style>
