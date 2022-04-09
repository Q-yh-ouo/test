<!--
 * 部门信息管理页面
 * @author: 郭湛良-景兴
 * @since: 2021-04-23
-->
<template>
  <div class="m-window m-departmentalManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="" prop="companyId">
              <el-select
                v-model="searchForm.companyId"
                :loading="companyOptionsLoading"
                filterable
                clearable
                placeholder="请选择公司"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.id"
                  :label="item.companyFullName || item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="deptName">
              <el-input
                v-model.trim="searchForm.deptName"
                type="text"
                placeholder="部门名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="6">
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
        :defaultColDef="defaultColDef"
        :columnTypes="columnTypes"
        :groupUseEntireRow="true"
        :groupRowRendererParams="groupRowRendererParams"
        :frameworkComponents="frameworkComponents"
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
    <!-- 新增、编辑部门 对话框 -->
    <el-dialog
      :title="departmentFormDialogTitle"
      :visible.sync="departmentFormDialogVisible"
      :before-close="departmentFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="departmentForm"
        :model="departmentForm"
        :rules="departmentFormRules"
        label-width="140px"
      >
        <el-form-item label="公司名称" prop="companyId">
          <el-select
            v-model="departmentForm.companyId"
            :loading="companyOptionsLoading"
            filterable
            clearable
            placeholder="请选择公司"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model.trim="departmentForm.deptName"
            type="text"
            placeholder="请输入部门名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="上级部门名称" prop="higherDept">
          <el-select
            v-model="departmentForm.higherDept"
            :loading="departmentOptionsLoading"
            :disabled="!departmentForm.companyId"
            filterable
            clearable
            placeholder="请选择上级部门"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.deptName"
              :value="item.id"
              :disabled="
                operationFlag === 'edit' &&
                mainTableSelectedRow &&
                mainTableSelectedRow.id === item.id
              "
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDepartmentFormDialog(true)">取消</el-button>
        <el-button
          :loading="departmentFormSubmitting"
          type="primary"
          @click="onConfirmDepartmentForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑部门 对话框 -->
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
// 部门信息表单校验规则
const departmentFormRules = {
  companyId: [
    {
      required: true,
      trigger: "change",
      message: "请选择公司",
    },
  ],
  deptName: [
    {
      required: true,
      trigger: "blur",
      message: "请输入部门名称",
    },
  ],
};

export default {
  name: "departmentalManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "departmentalManagement",
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
        companyId: "", // 公司Id
        deptName: "", // 部门名称
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
      mainTableSelectedRow: null, // 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
      groupRowRendererParams: null,
      defaultColDef: null,
      columnTypes: null,
      frameworkComponents: null,
      /**
       * @vuese
       * 操作标识
       */
      operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
      /**
       * @vuese
       * 部门信息表单对话框 相关数据
       */
      departmentFormDialogVisible: false, // 对话框是否显示
      departmentFormSubmitting: false, // 表单提交状态
      // 部门信息表单数据
      departmentForm: {
        companyId: "", // 公司Id
        deptName: "", // 部门名称
        higherDept: "", // 上级部门Id
      },
      departmentFormRules, // 部门信息表单校验规则
      companyOptions: [], // 公司选项
      companyOptionsLoading: false, // 公司选项加载状态
      departmentOptions: [], // 部门选项
      departmentOptionsLoading: false, // 部门选项加载状态
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 部门信息表单对话框的标题
     */
    departmentFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增部门信息";
          break;
        case "edit":
          _title = "编辑部门信息";
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
          headerName: "公司名称",
          field: "companyName",
          /**
           * 一般在第一列数据上加勾选框
           */
          cellRendererFramework: tooltipForCell,
          rowGroup: true,
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "部门名称",
          field: "deptName",
        },
        {
          headerName: "上级部门名称",
          field: "higherDeptName",
        },
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
      // 获取部门列表
      this.getDeptmentList();
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
      this.openDepartmentFormDialog();
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
      this.mainTableSelectedRow = _rows[0];
      // 打开对话框
      this.openDepartmentFormDialog();
      // 当选中行数据汇总公司Id等于部门信息表单中的公司Id时，获取一下该公司的部门列表。（为了解决watch中旧值与新值相同的情况下没有重新获取部门列表的问题）
      if (
        _rows[0].companyId &&
        _rows[0].companyId === this.departmentForm.companyId
      ) {
        // 根据当前编辑行的公司查找部门列表
        this.getDeptmentListByCompanyId(_rows[0].companyId);
      }
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
        // 删除部门信息
        this.deleteDeptment(_rows[0].id);
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
        // 恢复部门信息
        this.restoreDeptment(_rows[0].id);
      });
    },
    /**
     * @vuese
     * 打开 部门信息表单对话框
     */
    openDepartmentFormDialog() {
      this.departmentFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("departmentForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("departmentForm");
          // 从公司选项列表中找当前主表格选中行的关联公司，如果没找到则将表单中的“companyId”清空，不作此处理的话有可能会出现显示“1”等id的情况
          const findCompany = this.companyOptions.find(
            (item) => item.id === this.mainTableSelectedRow.companyId
          );
          // 从部门选项列表中找当前主表格选中行的关联上级部门，如果没找到则将表单中的“higherDept”清空，不作此处理的话有可能会出现显示“1”等id的情况
          const findDepartment = this.departmentOptions.find(
            (item) => item.id === this.mainTableSelectedRow.higherDept
          );
          // 设置表单默认值
          this.departmentForm = {
            companyId: findCompany ? this.mainTableSelectedRow.companyId : "", // 公司Id
            deptName: this.mainTableSelectedRow.deptName, // 部门名称
            higherDept: findDepartment
              ? this.mainTableSelectedRow.higherDept
              : "", // 上级部门Id
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 部门信息表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closeDepartmentFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.departmentFormDialogVisible = false;
        });
      } else {
        this.departmentFormDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 部门信息表单对话框 关闭前的回调
     */
    departmentFormDialogBeforeClose() {
      this.closeDepartmentFormDialog(true);
    },
    /**
     * @vuese
     * 部门信息表单对话框 确认事件
     */
    onConfirmDepartmentForm() {
      this.$refs["departmentForm"].validate((valid) => {
        if (valid) {
          if (this.operationFlag === "add") {
            this.addDeptment();
          } else if (this.operationFlag === "edit") {
            this.updateDeptment();
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
            // 当前操作为编辑 且 部门信息表单对话框为打开状态 且 有主表格选中数据时，对表单中“companyId”赋值
            if (
              this.operationFlag === "edit" &&
              this.departmentFormDialogVisible &&
              this.mainTableSelectedRow
            ) {
              const findCompany = this.companyOptions.find(
                (item) => item.id === this.mainTableSelectedRow.companyId
              );
              this.$set(
                this.departmentForm,
                "companyId",
                findCompany ? this.mainTableSelectedRow.companyId : ""
              ); // 设置部门信息表单的公司Id
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
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 获取部门列表
     */
    getDeptmentList() {
      this.mainTableLoading = true;
      this.$http
        .getDeptmentList({
          companyId: this.searchForm.companyId || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          deptName: this.searchForm.deptName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
     * 根据公司Id获取部门列表
     */
    getDeptmentListByCompanyId(companyId) {
      this.departmentOptionsLoading = true;
      this.$http
        .getDeptmentListAll({ companyId })
        .then((response) => {
          this.departmentOptionsLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.departmentOptions = rows;
            // 当前操作为编辑 且 部门信息表单对话框为打开状态 且 有主表格选中数据时，对表单中“higherDept”赋值
            if (
              this.operationFlag === "edit" &&
              this.departmentFormDialogVisible &&
              this.mainTableSelectedRow
            ) {
              const findDepartment = this.departmentOptions.find(
                (item) => item.id === this.mainTableSelectedRow.higherDept
              );
              this.$set(
                this.departmentForm,
                "higherDept",
                findDepartment ? this.mainTableSelectedRow.higherDept : ""
              ); // 设置部门信息表单的上级部门Id
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
          this.departmentOptionsLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 新增部门
     * @arg {Number} companyId 公司Id
     * @arg {String} deptName 部门名称
     * @arg {String} higherDept 上级部门Id,没有传 0
     * @arg {String} createBy 创建人工号
     * @arg {String} creator 创建人姓名
     */
    addDeptment() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.departmentFormSubmitting = true;
      this.$http
        .addDeptment({
          ...this.departmentForm,
          higherDept: this.departmentForm.higherDept || 0,
          createBy: sapNum,
          creator: employeeName,
        })
        .then((response) => {
          this.departmentFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            // 关闭部门信息表单对话框
            this.closeDepartmentFormDialog();
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
          this.departmentFormSubmitting = false;
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
    updateDeptment() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      const { id } = this.mainTableSelectedRow;
      this.departmentFormSubmitting = true;
      this.$http
        .updateDeptment({
          ...this.departmentForm,
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.departmentFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            // 关闭部门信息表单对话框
            this.closeDepartmentFormDialog(false);
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
          this.departmentFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 删除部门信息
     * @arg {String} id 公司Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    deleteDeptment(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      this.$http
        .deleteDeptment({
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
     * 恢复部门信息
     * @arg {String} id 公司Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    restoreDeptment(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "restore", true);
      this.$http
        .restoreDeptment({
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
    "departmentForm.companyId"(val) {
      if (val) {
        this.getDeptmentListByCompanyId(val);
      } else {
        this.departmentOptions = [];
        this.$set(this.departmentForm, "higherDept", "");
      }
    },
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
.m-departmentalManagement {
}
</style>
