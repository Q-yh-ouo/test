<!--
 * 人员奖惩记录管理
 * @author: 郭湛良-景兴
 * @since: 2021-06-04
-->
<template>
  <div class="m-window m-rewardAndPunishmentManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-form-item label="" prop="startTime">
              <el-date-picker
                v-model="searchForm.startTime"
                clearable
                type="date"
                placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="endTime">
              <el-date-picker
                v-model="searchForm.endTime"
                clearable
                type="date"
                placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="personNo">
              <el-input
                v-model.trim="searchForm.personNo"
                type="text"
                placeholder="员工工号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="personName">
              <el-input
                v-model.trim="searchForm.personName"
                type="text"
                placeholder="员工姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :push="2">
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
              <el-col :span="4">
                <el-button
                  v-if="btnPermissions.delete"
                  :disabled="btnDisableds.delete"
                  :loading="btnLoadings.delete"
                  type="primary"
                  @click="onDelete()"
                >
                  {{ searchForm.state ? "启用" : "停用" }}
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
    <!-- 新增、编辑奖惩记录 对话框 -->
    <el-dialog
      :title="punishmentFormDialogTitle"
      :visible.sync="punishmentFormDialogVisible"
      :before-close="punishmentFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="punishmentForm"
        :model="punishmentForm"
        :rules="punishmentFormRules"
        label-width="140px"
      >
        <el-form-item label="员工名称" prop="punishmentEmployee">
          <el-input
            v-model.trim="punishmentForm.punishmentEmployee"
            type="text"
            placeholder="请输入员工名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="奖惩明细" prop="punishmentDetail">
          <el-input
            v-model.trim="punishmentForm.punishmentDetail"
            type="text"
            placeholder="请输入奖惩明细"
            clearable
          />
        </el-form-item>
        <el-form-item label="奖惩分数" prop="punishmentScore">
          <el-input
            v-model.trim="punishmentForm.punishmentScore"
            type="text"
            placeholder="请输入奖惩分数"
            clearable
          />
        </el-form-item>
        <el-form-item label="奖惩时间" prop="punishmentTime">
          <el-date-picker
            v-model="punishmentForm.punishmentTime"
            clearable
            type="date"
            placeholder="请选择"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePunishmentFormDialog(true)">取消</el-button>
        <el-button
          :loading="punishmentFormSubmitting"
          type="primary"
          @click="onConfirmPunishmentForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑奖惩记录 对话框 -->
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
// 奖惩记录信息表单校验规则
const punishmentFormRules = {
  punishmentEmployee: [
    {
      required: true,
      trigger: "blur",
      message: "请输入员工姓名",
    },
  ],
  punishmentDetail: [
    {
      required: true,
      trigger: "blur",
      message: "请输入奖惩明细",
    },
  ],
  punishmentScore: [
    {
      required: true,
      trigger: "blur",
      message: "请输入奖惩分数",
    },
  ],
  punishmentTime: [
    {
      required: true,
      trigger: "change",
      message: "请选择奖惩时间",
    },
  ],
};

export default {
  name: "rewardAndPunishmentManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "rewardAndPunishmentManagement",
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        query: true, // 查询
        add: true, // 新增
        edit: true, // 编辑
        delete: true, // 删除
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
      },
      /**
       * @vuese
       * 按钮加载状态
       */
      btnLoadings: {
        delete: false, // 删除
      },
      /**
       * @vuese
       * 搜索表单数据
       */
      searchForm: {
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        personNo: "", // 员工工号
        personName: "", // 员工姓名
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
      /**
       * @vuese
       * 操作标识
       */
      operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
      /**
       * @vuese
       * 奖惩记录信息表单对话框 相关数据
       */
      punishmentFormDialogVisible: false, // 对话框是否显示
      punishmentFormSubmitting: false, // 表单提交状态
      // 奖惩记录信息表单数据
      punishmentForm: {
        punishmentEmployee: "", // 员工姓名
        punishmentDetail: "", // 奖惩明细
        punishmentScore: "", // 奖惩分数
        punishmentTime: null, // 奖惩时间
      },
      punishmentFormRules, // 奖惩记录信息表单校验规则
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 奖惩记录信息表单对话框的标题
     */
    punishmentFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增奖惩记录信息";
          break;
        case "edit":
          _title = "编辑奖惩记录信息";
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
    // tabs标签页切换
    EvenBus.$on(TABS_CHANGE, (data) => {
      //   if (data.content === this.name) {}
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
          headerName: "员工姓名",
          field: "punishmentEmployee",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "奖惩明细",
          field: "punishmentDetail",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "奖惩分数",
          field: "punishmentScore",
        },
        {
          headerName: "奖惩时间",
          field: "punishmentTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "创建人",
          field: "createName",
        },
        {
          headerName: "创建时间",
          field: "createTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "修改人",
          field: "modifyName",
        },
        {
          headerName: "修改时间",
          field: "modifyTime",
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
      this.openPunishmentFormDialog();
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
      this.openPunishmentFormDialog();
    },
    /**
     * @vuese
     * 删除事件
     */
    onDelete() {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要删除的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm(`确认${this.searchForm.state ? "启用" : "停用"}?`).then(
        () => {
          this.operationFlag = "delete";
          // 删除部门信息
          this.deleteDeptment(_rows[0].id);
        }
      );
    },
    /**
     * @vuese
     * 打开 奖惩记录信息表单对话框
     */
    openPunishmentFormDialog() {
      this.punishmentFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("punishmentForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("punishmentForm");
          // 设置表单默认值
          this.punishmentForm = {
            punishmentEmployee: this.mainTableSelectedRow.punishmentEmployee, // 员工姓名
            punishmentDetail: this.mainTableSelectedRow.punishmentDetail, // 奖惩明细
            punishmentScore: this.mainTableSelectedRow.punishmentScore, // 奖惩分数
            punishmentTime: this.mainTableSelectedRow.punishmentTime, // 奖惩时间
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 奖惩记录信息表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closePunishmentFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.punishmentFormDialogVisible = false;
        });
      } else {
        this.punishmentFormDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 奖惩记录信息表单对话框 关闭前的回调
     */
    punishmentFormDialogBeforeClose() {
      this.closePunishmentFormDialog(true);
    },
    /**
     * @vuese
     * 奖惩记录信息表单对话框 确认事件
     */
    onConfirmPunishmentForm() {
      this.$refs["punishmentForm"].validate((valid) => {
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
     * 获取部门列表
     */
    getDeptmentList() {
      this.mainTableLoading = true;
      this.$http
        .getDeptmentList({
          startTime: this.searchForm.startTime || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          endTime: this.searchForm.endTime || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          personNo: this.searchForm.personNo || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          personName: this.searchForm.personName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
     * 新增部门
     * @arg {Number} companyId 公司Id
     * @arg {String} deptName 部门名称
     * @arg {String} higherDept 上级部门Id,没有传 0
     * @arg {String} createSapnum 创建人工号
     * @arg {String} createName 创建人姓名
     */
    addDeptment() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.punishmentFormSubmitting = true;
      this.$http
        .addDeptment({
          ...this.punishmentForm,
          createBy: sapNum,
          creator: employeeName,
        })
        .then((response) => {
          this.punishmentFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            // 关闭奖惩记录信息表单对话框
            this.closePunishmentFormDialog();
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
          this.punishmentFormSubmitting = false;
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
     * @arg {String} modifySapnum 修改人工号
     * @arg {String} modifyName 修改人姓名
     */
    updateDeptment() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      const { id } = this.mainTableSelectedRow;
      this.punishmentFormSubmitting = true;
      this.$http
        .updateDeptment({
          ...this.punishmentForm,
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.punishmentFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            // 关闭奖惩记录信息表单对话框
            this.closePunishmentFormDialog(false);
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
          this.punishmentFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 删除部门信息
     * @arg {String} id 公司Id
     * @arg {String} modifySapnum 修改人工号
     * @arg {String} modifyName 修改人姓名
     */
    deleteDeptment(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      this.$http
        .deleteDeptment({
          id,
          modifySapnum: sapNum,
          modifyName: employeeName,
        })
        .then((response) => {
          this.$set(this.btnLoadings, "delete", false);
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "删除成功",
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
.m-rewardAndPunishmentManagement {
}
</style>
