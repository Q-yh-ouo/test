<!--
 * 系统流程管理界面
 * @author: 郭湛良-景兴
 * @since: 2021-05-10
-->
<template>
    <div class="m-window m-processManagement">
      <!-- 工具栏 -->
      <div class="m-toolbar">
        <el-form ref="searchForm" :model="searchForm" label-width="0px">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item label="" prop="processName">
                <el-input
                  v-model.trim="searchForm.processName"
                  type="text"
                  placeholder="流程名称"
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
      <!-- 新增、编辑流程信息 对话框 -->
      <el-dialog
        :title="processFormDialogTitle"
        :visible.sync="processFormDialogVisible"
        :before-close="processFormDialogBeforeClose"
        :close-on-click-modal="false"
        v-dialogDrag
        width="50%"
      >
        <el-form
          ref="processForm"
          :model="processForm"
          :rules="processFormRules"
          label-width="140px"
        >
          <el-form-item label="OA流程ID" prop="workflowId">
            <el-input
              v-model.trim="processForm.workflowId"
              type="text"
              placeholder="请输入OA流程ID"
              clearable
            />
          </el-form-item>
          <el-form-item label="流程名称" prop="processName">
            <el-input
              v-model.trim="processForm.processName"
              type="text"
              placeholder="请输入流程名称"
              clearable
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeProcessFormDialog(true)">取消</el-button>
          <el-button
            :loading="processFormSubmitting"
            type="primary"
            @click="onConfirmProcessForm()"
          >
            确定
          </el-button>
        </span>
      </el-dialog>
      <!-- /新增、编辑流程信息 对话框 -->
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
  // 流程信息表单校验规则
  const processFormRules = {
    workflowId: [
      {
        required: true,
        trigger: "blur",
        message: "请输入OA流程ID",
      },
    ],
    processName: [
      {
        required: true,
        trigger: "blur",
        message: "请输入流程名称",
      },
    ],
  };
  // 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
  let mainTableSelectedRow = null;
  
  export default {
    name: "processManagement",
    // 依赖组件
    components: {},
    // 接口（组件的接口）
    props: {},
    // 响应式数据
    data() {
      return {
        name: "processManagement",
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
          processName: "", // 流程名称
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
         * 流程信息表单对话框 相关数据
         */
        processFormDialogVisible: false, // 对话框是否显示
        processFormSubmitting: false, // 表单提交状态
        // 流程信息表单数据
        processForm: {
          workflowId: "", // OA流程ID
          processName: "", // 流程名称
        },
        processFormRules, // 流程信息表单校验规则
      };
    },
    // 计算属性
    computed: {
      /**
       * @vuese
       * 流程信息表单对话框的标题
       */
      processFormDialogTitle() {
        let _title = "";
        switch (this.operationFlag) {
          case "add":
            _title = "新增流程信息";
            break;
          case "edit":
            _title = "编辑流程信息";
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
    // 实例销毁前
    beforeDestroy() {},
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
            headerName: "OA流程ID",
            field: "workflowId",
            width: 150,
            /**
             * 一般在第一列数据上加勾选框
             */
            headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
            checkboxSelection: true, // 是否在行头显示勾选框
            headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
          },
          {
            headerName: "流程编码",
            field: "processCode",
            width: 150,
          },
          {
            headerName: "流程名称",
            field: "processName",
            cellRendererFramework: tooltipForCell,
          },
          {
            headerName: "创建人",
            field: "creator",
          },
          {
            headerName: "创建时间",
            field: "createTime",
            cellRendererFramework: tooltipForCell,
          },
          {
            headerName: "修改人",
            field: "updator",
          },
          {
            headerName: "修改时间",
            field: "updateTime",
            cellRendererFramework: tooltipForCell,
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
        this.getProcessList();
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
        this.openProcessFormDialog();
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
        this.openProcessFormDialog();
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
          // 删除流程信息
          this.deleteProcess(_rows[0].id);
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
          // 恢复流程信息
          this.restoreProcess(_rows[0].id);
        });
      },
      /**
       * @vuese
       * 打开 流程信息表单对话框
       */
      openProcessFormDialog() {
        this.processFormDialogVisible = true;
        this.$nextTick(() => {
          if (this.operationFlag === "add") {
            // 重置表单
            this.resetForm("processForm");
          } else if (this.operationFlag === "edit") {
            // 移除表单项的校验结果
            this.clearFormValidate("processForm");
            // 设置表单默认值
            this.processForm = {
              workflowId: mainTableSelectedRow.workflowId, // OA流程ID
              processName: mainTableSelectedRow.processName, // 流程名称
            };
          }
        });
      },
      /**
       * @vuese
       * 关闭 流程信息表单对话框
       * @arg {Boolean} reconfirm 是否需要二次确认
       */
      closeProcessFormDialog(reconfirm) {
        if (reconfirm) {
          this.$confirm("确认关闭？").then(() => {
            this.processFormDialogVisible = false;
          });
        } else {
          this.processFormDialogVisible = false;
        }
      },
      /**
       * @vuese
       * 流程信息表单对话框 关闭前的回调
       */
      processFormDialogBeforeClose() {
        this.closeProcessFormDialog(true);
      },
      /**
       * @vuese
       * 流程信息表单对话框 确认事件
       */
      onConfirmProcessForm() {
        this.$refs["processForm"].validate((valid) => {
          if (valid) {
            if (this.operationFlag === "add") {
              this.addProcess();
            } else if (this.operationFlag === "edit") {
              this.updateProcess();
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
       * 获取流程信息列表
       */
      getProcessList() {
        this.mainTableLoading = true;
        this.$http
          .getProcessList({
            ...this.searchForm,
            processName: this.searchForm.processName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
       * 新增流程信息
       * @arg {String} workflowId OA流程ID
       * @arg {String} processName 流程名称
       * @arg {String} createBy 创建人工号
       * @arg {String} creator 创建人名称
       */
      addProcess() {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.processFormSubmitting = true;
        this.$http
          .addProcess({
            ...this.processForm,
            createBy: sapNum,
            creator: employeeName,
          })
          .then((response) => {
            this.processFormSubmitting = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              this.$message({
                type: "success",
                message: "新增成功",
              });
              // 关闭流程信息表单对话框
              this.closeProcessFormDialog(false);
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
            this.processFormSubmitting = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 修改流程信息
       * @arg {String} workflowId OA流程ID
       * @arg {String} processName 流程名称
       * @arg {String} updateBy 修改人工号
       * @arg {String} updator 修改人名称
       */
      updateProcess() {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        const { id } = mainTableSelectedRow;
        this.processFormSubmitting = true;
        this.$http
          .updateProcess({
            ...this.processForm,
            id,
            updateBy: sapNum,
            updator: employeeName,
          })
          .then((response) => {
            this.processFormSubmitting = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              // 关闭流程信息表单对话框
              this.closeProcessFormDialog(false);
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
            this.processFormSubmitting = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 删除流程信息
       * @arg {String} id 流程信息记录Id
       * @arg {String} updateBy 修改人工号
       * @arg {String} updator 修改人姓名
       */
      deleteProcess(id) {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.$set(this.btnLoadings, "delete", true);
        this.$http
          .deleteProcess({
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
       * 恢复流程信息
       * @arg {String} id 流程信息记录Id
       * @arg {String} updateBy 修改人工号
       * @arg {String} updator 修改人姓名
       */
      restoreProcess(id) {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.$set(this.btnLoadings, "restore", true);
        this.$http
          .restoreProcess({
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
  .m-processManagement {
  }
  </style>
  