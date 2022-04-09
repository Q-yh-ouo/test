<!--
 * 用户管理
 * @author: 郭湛良-景兴
 * @since: 2021-05-05
-->
<template>
  <div class="m-window m-userManagement">
    <!-- 页面左边容器 -->
    <div class="m-userManagement-left">
      <!-- 工具栏 -->
      <div class="m-toolbar">
        <el-form
          ref="organizationalTreeSearchForm"
          :model="organizationalTreeSearchForm"
          label-width="0px"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="" prop="keyword">
                <el-input
                  v-model.trim="organizationalTreeSearchForm.keyword"
                  type="text"
                  placeholder="输入关键词进行过滤"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- /工具栏 -->
      <!-- 树形组织架构 -->
      <div class="organizational-tree">
        <el-tree
          ref="organizationalTree"
          :props="{
            children: 'children',
            label: 'label',
          }"
          :data="organizationalTreeData"
          :default-expand-all="false"
          :highlight-current="true"
          :filter-node-method="filterOrganizationalTreeNode"
        >
        </el-tree>
      </div>
      <!-- /树形组织架构 -->
    </div>
    <!-- /页面左边容器 -->
    <!-- 页面右边容器 -->
    <div class="m-userManagement-right">
      <!-- 工具栏 -->
      <div class="m-toolbar">
        <el-form ref="searchForm" :model="searchForm" label-width="0px">
          <el-row :gutter="10" type="flex" justify="space-between">
            <el-col :span="5">
              <el-form-item label="" prop="keyword">
                <el-input
                  v-model.trim="searchForm.keyword"
                  type="text"
                  placeholder="编码、名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-button
                    v-if="btnPermissions.query"
                    :disabled="btnDisableds.query"
                    type="primary"
                    @click="onSearch()"
                  >
                    查询
                  </el-button>
                </el-col>
                <el-col :span="6">
                  <el-button
                    v-if="btnPermissions.add"
                    :disabled="btnDisableds.add"
                    type="primary"
                    @click="onAdd()"
                  >
                    新增
                  </el-button>
                </el-col>
                <el-col :span="6">
                  <el-button
                    v-if="btnPermissions.edit"
                    :disabled="btnDisableds.edit"
                    type="primary"
                    @click="onEdit()"
                  >
                    编辑
                  </el-button>
                </el-col>
                <el-col :span="6">
                  <el-button
                    v-if="btnPermissions.delete"
                    :disabled="btnDisableds.delete"
                    type="primary"
                    @click="onDelete()"
                  >
                    删除
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
    </div>
    <!-- /页面右边容器 -->
    <!-- 新增、编辑用户 对话框 -->
    <el-dialog
      :title="userFormDialogTitle"
      :visible.sync="userFormDialogVisible"
      :before-close="closeUserFormDialog"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userFormRules"
        label-width="140px"
      >
        <el-form-item label="员工工号" prop="personNo">
          <el-input
            v-model.trim="userForm.personNo"
            type="text"
            placeholder="请输入员工工号"
            clearable
          />
        </el-form-item>
        <el-form-item label="姓名" prop="personName">
          <el-input
            v-model.trim="userForm.personName"
            type="text"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input
            v-model.trim="userForm.sex"
            type="text"
            placeholder="请输入性别"
            clearable
          />
        </el-form-item>
        <el-form-item label="在职状态" prop="stat1">
          <el-input
            v-model.trim="userForm.stat1"
            type="text"
            placeholder="请输入在职状态"
            clearable
          />
        </el-form-item>
        <el-form-item label="在职详情" prop="stat2">
          <el-input
            v-model.trim="userForm.stat1"
            type="text"
            placeholder="请输入在职详情"
            clearable
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTimeStr">
          <el-input
            v-model.trim="userForm.beginTimeStr"
            type="text"
            placeholder="请输入开始时间"
            clearable
          />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input
            v-model.trim="userForm.position"
            type="text"
            placeholder="请输入职位"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserFormDialog()">取消</el-button>
        <el-button
          :loading="userFormSubmitting"
          type="primary"
          @click="onConfirmUserForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑用户 对话框 -->
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";

// 用户表单校验规则
const userFormRules = {
  organizationName: [
    {
      required: true,
      trigger: "blur",
      message: "请输入组织名称",
    },
  ],
};

export default {
  name: "userManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "userManagement",
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        query: true, // 查询
        add: true, // 新增
        edit: true, // 编辑
        delete: true, // 删除
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
        changeState: false, // 改变状态，停用、启用
      },
      /**
       * @vuese
       * 组织架构树 搜索表单数据
       */
      organizationalTreeSearchForm: {
        keyword: "", // 关键词
      },
      /**
       * @vuese
       * 搜索表单数据
       */
      searchForm: {
        keyword: "", // 关键词，编码、名称
        isShowDisable: false, // 是否显示停用
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
      operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除; changeState: 切换状态;
      /**
       * @vuese
       * 用户信息表单对话框 相关数据
       */
      userFormDialogVisible: false, // 对话框是否显示
      userFormSubmitting: false, // 表单提交状态
      // 用户表单数据
      userForm: {
        organizationCode: "", // 组织编码
        organizationName: "", // 组织名称
        remark: "", // 备注
      },
      userFormRules, // 用户表单校验规则
      organizationalTreeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ], // 组织架构树形结构数据
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 用户表单对话框的标题
     */
    userFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增用户信息";
          break;
        case "edit":
          _title = "编辑用户信息";
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
          headerName: "工号",
          field: "personNo",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "姓名",
          field: "personName",
        },
        {
          headerName: "性别",
          field: "sex",
        },
        {
          headerName: "开始日期",
          field: "beginTimeStr",
        },
        {
          headerName: "结束日期",
          field: "endTimeStr",
        },
        {
          headerName: "所属公司",
          field: "companyName",
        },
        {
          headerName: "所属部门",
          field: "organizationName",
        },
        {
          headerName: "职位",
          field: "position",
        },
        {
          headerName: "在职状态",
          field: "stat1",
        },
        {
          headerName: "在职详情",
          field: "stat2",
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
    getMainTableData() {},
    /**
     * @vuese
     * 搜索事件
     */
    onSearch() {
      this.operationFlag = "query";
    },
    /**
     * @vuese
     * 新增事件
     */
    onAdd() {
      this.operationFlag = "add";
      this.openUserFormDialog();
    },
    /**
     * @vuese
     * 编辑事件
     */
    onEdit() {
      this.operationFlag = "edit";
      this.openUserFormDialog();
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
      this.operationFlag = "delete";
    },
    /**
     * @vuese
     * 打开 用户表单对话框
     */
    openUserFormDialog() {
      this.userFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("userForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("userForm");
          // 设置表单默认值
          this.userForm = {
            organizationCode: "", // 组织编码
            organizationName: "", // 组织名称
            remark: "", // 备注
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 用户表单对话框
     */
    closeUserFormDialog() {
      this.$confirm("确认关闭？").then(() => {
        this.userFormDialogVisible = false;
      });
    },
    /**
     * @vuese
     * 用户表单对话框 确认事件
     */
    onConfirmUserForm() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.userFormSubmitting = true;
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
     * 过滤组织架构树节点
     */
    filterOrganizationalTreeNode(value, data) {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
  },
  // 侦听器
  watch: {
    "organizationalTreeSearchForm.keyword"(val) {
      // 触发树形组件的过滤节点方法
      this.$refs.organizationalTree.filter(val);
    },
  },
};
</script>
<style lang="less" scoped>
// 页面左边容器的宽度
@leftContainerWidth: 350px;

.m-userManagement {
  &-left {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: @leftContainerWidth;
    .organizational-tree {
      position: absolute;
      left: 0;
      right: 0;
      top: 50px;
      bottom: 0;
      overflow: scroll;
    }
  }
  &-right {
    position: relative;
    height: 100%;
    margin-left: @leftContainerWidth + 10px;
    .m-agTable {
      position: absolute;
      left: 0;
      right: 0;
      top: 50px;
      bottom: 35px;
    }
  }
}
</style>
