<!--
 * 节点字段管理页面
 * @author: 郭湛良-景兴
 * @since: 2021-04-27
-->
<template>
    <div class="m-window m-nodeFieldManagement">
      <!-- 工具栏 -->
      <div class="m-toolbar">
        <el-form ref="searchForm" :model="searchForm" label-width="0px">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item prop="processId" label="">
                <el-select
                  v-model="searchForm.processId"
                  :loading="processOptionsLoading"
                  filterable
                  clearable
                  placeholder="系统流程"
                >
                  <el-option
                    v-for="item in processOptions"
                    :key="item.id"
                    :label="item.processName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="" prop="nodeId">
                <el-select
                  v-model="searchForm.nodeId"
                  :loading="processNodeSearchOptionsLoading"
                  :disabled="!searchForm.processId"
                  filterable
                  clearable
                  :placeholder="
                    searchForm.processId ? '流程节点' : '请先选择流程'
                  "
                >
                  <el-option
                    v-for="item in processNodeSearchOptions"
                    :key="item.NODEID"
                    :label="item.NODENAME"
                    :value="item.NODEID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="6">
              <el-row :gutter="10" type="flex" justify="end">
                <el-col :span="4" style="overflow: hidden">
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
      <!-- 新增、编辑字段信息 对话框 -->
      <el-dialog
        :title="fieldFormDialogTitle"
        :visible.sync="fieldFormDialogVisible"
        :before-close="fieldFormDialogBeforeClose"
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
          <el-form-item
            v-if="operationFlag === 'add'"
            label="系统流程"
            prop="processId"
          >
            <el-select
              v-model="fieldForm.processId"
              :loading="processOptionsLoading"
              filterable
              clearable
              placeholder="请选择系统流程"
            >
              <el-option
                v-for="item in processOptions"
                :key="item.id"
                :label="item.processName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="operationFlag === 'add'"
            label="流程节点"
            prop="nodeId"
          >
            <el-select
              v-model="fieldForm.nodeId"
              :loading="processNodeOptionsLoading"
              :disabled="!fieldForm.processId"
              filterable
              clearable
              placeholder="请选择流程节点"
            >
              <el-option
                v-for="item in processNodeOptions"
                :key="item.NODEID"
                :label="item.NODENAME"
                :value="item.NODEID"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="operationFlag === 'add'"
            label="系统字段"
            prop="columnIds"
          >
            <el-select
              v-model="fieldForm.columnIds"
              :loading="systemFieldOptionsLoading"
              filterable
              clearable
              multiple
              collapse-tags
              placeholder="请选择系统字段"
            >
              <el-option
                v-for="item in systemFieldOptions"
                :key="item.id"
                :label="item.fieldText + '：' + item.fieldName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="显示" prop="columnShow">
            <el-switch
              v-model="fieldForm.columnShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="编辑" prop="columnEdit">
            <el-switch
              v-model="fieldForm.columnEdit"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeFieldFormDialog(true)">取消</el-button>
          <el-button
            :loading="fieldFormSubmitting"
            type="primary"
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
  // 字段信息表单校验规则
  const fieldFormRules = {
    processId: [
      {
        required: true,
        trigger: "change",
        message: "请选择系统流程",
      },
    ],
    nodeId: [
      {
        required: true,
        trigger: "change",
        message: "请选择流程节点",
      },
    ],
    columnIds: [
      {
        required: true,
        trigger: "change",
        message: "请选择系统字段",
      },
    ],
  };
  // 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
  let mainTableSelectedRow = null;
  
  export default {
    name: "nodeFieldManagement",
    // 依赖组件
    components: {},
    // 接口（组件的接口）
    props: {},
    // 响应式数据
    data() {
      return {
        name: "nodeFieldManagement",
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
          processId: "", // 流程Id
          nodeId: "", // 节点Id
          state: false, // 是否显示停用
        },
        processNodeSearchOptionsLoading: false, // 流程节点选项加载状态
        processNodeSearchOptions: false, // 流程节点选项
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
         * 字段信息表单对话框 相关数据
         */
        fieldFormDialogVisible: false, // 对话框是否显示
        fieldFormSubmitting: false, // 表单提交状态
        // 字段信息表单数据
        fieldForm: {
          processId: null, // 系统流程Id
          nodeId: null, // 流程节点Id
          columnIds: null, // 系统字段ids
          columnShow: false, // 是否可显示
          columnEdit: false, // 是否可编辑
        },
        fieldFormRules, // 字段信息表单校验规则
        processOptionsLoading: false, // 流程选项加载状态
        processOptions: false, // 流程选项
        processNodeOptionsLoading: false, // 流程节点选项加载状态
        processNodeOptions: false, // 流程节点选项
        systemFieldOptionsLoading: false, // 系统字段选项加载状态
        systemFieldOptions: false, // 系统字段选项
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
            _title = "新增节点字段信息";
            break;
          case "edit":
            _title = "编辑节点字段信息";
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
      // 获取流程列表
      this.getProcessList();
      // 获取所有系统字段
      this.getBasePfmMercolumnListAll();
    },
    // 实例挂载前
    beforeMount() {
      // 初始化ag-grid表格配置
      this.initGrid();
      // tabs标签页切换
      EvenBus.$on(TABS_CHANGE, (data) => {
        if (data.content === this.name) {
          // 获取流程列表
          this.getProcessList();
          // 获取所有系统字段
          this.getBasePfmMercolumnListAll();
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
            headerName: "流程名称",
            field: "processName",
            width: 200,
            /**
             * 一般在第一列数据上加勾选框
             */
            headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
            checkboxSelection: true, // 是否在行头显示勾选框
            headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
            cellRendererFramework: tooltipForCell,
          },
          {
            headerName: "OA节点ID",
            field: "nodeId",
            width: 150,
          },
          {
            headerName: "OA节点名称",
            field: "nodeText",
            width: 150,
          },
          {
            headerName: "字段名称",
            field: "columnName",
            width: 150,
          },
          {
            headerName: "是否可编辑",
            field: "columnEdit",
            width: 100,
            cellRenderer: ({ data }) => {
              return data.columnEdit === 0 ? "是" : "否";
            },
          },
          {
            headerName: "是否显示",
            field: "columnShow",
            width: 100,
            cellRenderer: ({ data }) => {
              return data.columnShow === 0 ? "是" : "否";
            },
          },
          {
            headerName: "创建人工号",
            field: "createBy",
            width: 150,
          },
          {
            headerName: "创建人名称",
            field: "creator",
            width: 150,
          },
          {
            headerName: "创建时间",
            field: "createTime",
            width: 150,
            cellRendererFramework: tooltipForCell,
          },
          {
            headerName: "修改人工号",
            field: "updateBy",
            width: 150,
          },
          {
            headerName: "修改人名称",
            field: "updator",
            width: 150,
          },
          {
            headerName: "修改时间",
            field: "updateTime",
            width: 150,
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
        this.getNodeColumnsList();
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
        this.openFieldFormDialog();
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
        this.openFieldFormDialog();
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
          // 删除节点字段数据
          this.deleteNodeColumns(_rows[0].id);
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
          // 恢复节点字段数据
          this.restoreNodeColumns(_rows[0].id);
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
              columnShow: mainTableSelectedRow.columnShow === 0, // 是否可显示
              columnEdit: mainTableSelectedRow.columnEdit === 0, // 是否可编辑
            };
          }
        });
      },
      /**
       * @vuese
       * 关闭 字段信息表单对话框
       * @arg {Boolean} reconfirm 是否需要二次确认
       */
      closeFieldFormDialog(reconfirm) {
        if (reconfirm) {
          this.$confirm("确认关闭？").then(() => {
            this.fieldFormDialogVisible = false;
          });
        } else {
          this.fieldFormDialogVisible = false;
        }
      },
      /**
       * @vuese
       * 流程信息表单对话框 关闭前的回调
       */
      fieldFormDialogBeforeClose() {
        this.closeFieldFormDialog(true);
      },
      /**
       * @vuese
       * 字段信息表单对话框 确认事件
       */
      onConfirmFieldForm() {
        this.$refs["fieldForm"].validate((valid) => {
          if (valid) {
            if (this.operationFlag === "add") {
              this.addNodeColumns();
            } else if (this.operationFlag === "edit") {
              this.updateNodeColumns();
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
       * 获取节点字段数据列表
       */
      getNodeColumnsList() {
        this.mainTableLoading = true;
        this.$http
          .getNodeColumnsList({
            ...this.searchForm,
            processId: this.searchForm.processId || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
            nodeId: this.searchForm.nodeId || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
       * 新增节点字段
       */
      addNodeColumns() {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.fieldFormSubmitting = true;
        const newFieldForm = { ...this.fieldForm };
        newFieldForm.columnEdit = newFieldForm.columnEdit ? 0 : 1;
        newFieldForm.columnShow = newFieldForm.columnShow ? 0 : 1;
        const findNode = this.processNodeOptions.find(
          (item) => item.NODEID === newFieldForm.nodeId
        );
        newFieldForm.nodeText = findNode ? findNode.NODENAME : "";
        this.$http
          .addNodeColumns({
            ...newFieldForm,
            createBy: sapNum,
            creator: employeeName,
          })
          .then((response) => {
            this.fieldFormSubmitting = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              this.$message({
                type: "success",
                message: "新增成功",
              });
              // 关闭节点字段信息表单对话框
              this.closeFieldFormDialog(false);
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
            this.fieldFormSubmitting = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 修改节点字段信息
       * @arg {Number} id 节点字段记录Id
       * @arg {Number} columnEdit 是否可编辑 0: 是; 1: 否;
       * @arg {Number} columnShow 是否可显示 0: 是; 1: 否;
       * @arg {Number} updateBy 修改人工号
       * @arg {String} updator 修改人名称
       */
      updateNodeColumns() {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        const { id } = mainTableSelectedRow;
        this.fieldFormSubmitting = true;
        const newFieldForm = {};
        newFieldForm.columnEdit = this.fieldForm.columnEdit ? 0 : 1;
        newFieldForm.columnShow = this.fieldForm.columnShow ? 0 : 1;
        this.$http
          .updateNodeColumns({
            ...newFieldForm,
            id,
            updateBy: sapNum,
            updator: employeeName,
          })
          .then((response) => {
            this.fieldFormSubmitting = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              this.$message({
                type: "success",
                message: "修改成功",
              });
              // 关闭节点字段信息表单对话框
              this.closeFieldFormDialog(false);
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
            this.fieldFormSubmitting = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 删除节点字段数据
       * @arg {String} id 节点字段数据记录Id
       * @arg {String} updateBy 修改人工号
       * @arg {String} updator 修改人姓名
       */
      deleteNodeColumns(id) {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.$set(this.btnLoadings, "delete", true);
        this.$http
          .deleteNodeColumns({
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
       * 恢复节点字段数据
       * @arg {String} id 节点字段数据记录Id
       * @arg {String} updateBy 修改人工号
       * @arg {String} updator 修改人姓名
       */
      restoreNodeColumns(id) {
        const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
        this.$set(this.btnLoadings, "restore", true);
        this.$http
          .restoreNodeColumns({
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
       * 获取流程信息列表
       */
      getProcessList() {
        this.processOptionsLoading = true;
        this.$http
          .getProcessListAll()
          .then((response) => {
            this.processOptionsLoading = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              this.processOptions = rows;
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.processOptionsLoading = false;
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 根据流程Id获取流程节点
       * @arg {Number} workflowId 流程Id
       * @arg {String} flag 标识 search: 搜索用; form: 表单用;
       */
      getNodeListByWorkflowId(workflowId, flag) {
        if (flag === "search") {
          this.processNodeSearchOptionsLoading = true;
        } else {
          this.processNodeOptionsLoading = true;
        }
        this.$http
          .getNodeListByWorkflowId(workflowId)
          .then((response) => {
            if (flag === "search") {
              this.processNodeSearchOptionsLoading = false;
            } else {
              this.processNodeOptionsLoading = false;
            }
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              if (flag === "search") {
                this.processNodeSearchOptions = rows;
              } else {
                this.processNodeOptions = rows;
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
            if (flag === "search") {
              this.processNodeSearchOptionsLoading = false;
            } else {
              this.processNodeOptionsLoading = false;
            }
            if (error.response && error.response.data.code === 0) {
              this.$message.error(error.response.data.info);
            }
          });
      },
      /**
       * @vuese
       * 获取所有系统字段
       */
      getBasePfmMercolumnListAll() {
        this.systemFieldOptionsLoading = true;
        this.$http
          .getBasePfmMercolumnListTwo()
          .then((response) => {
            this.systemFieldOptionsLoading = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              this.systemFieldOptions = rows;
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            this.systemFieldOptionsLoading = false;
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
      "fieldForm.processId"(val) {
        const findProcess = this.processOptions.find((item) => item.id === val);
        if (findProcess) {
          this.getNodeListByWorkflowId(findProcess.workflowId, "form");
        } else {
          this.$set(this.fieldForm, "nodeId", "");
        }
      },
      "searchForm.processId"(val) {
        const findProcess = this.processOptions.find((item) => item.id === val);
        if (findProcess) {
          this.getNodeListByWorkflowId(findProcess.workflowId, "search");
        } else {
          this.$set(this.searchForm, "nodeId", "");
        }
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .m-nodeFieldManagement {
  }
  </style>
  