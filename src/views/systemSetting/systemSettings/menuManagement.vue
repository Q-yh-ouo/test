<!--
 * 角色管理
 * @author: 郭湛良-景兴
 * @since: 2021-05-05
-->
<template>
  <div class="m-window m-menuManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="" prop="roleName">
              <el-input
                v-model.trim="searchForm.roleName"
                type="text"
                placeholder="角色名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="roleName">
              <el-select
                v-model="searchForm.state"
                placeholder="状态"
                clearable
              >
                <el-option
                  v-for="item in roleStateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button
              v-if="btnPermissions.query"
              :disabled="btnDisableds.query"
              type="primary"
              @click="onSearch()"
            >
              查询
            </el-button>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button
              v-if="btnPermissions.add"
              :disabled="btnDisableds.add"
              type="primary"
              @click="onAdd()"
            >
              新增
            </el-button>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button
              v-if="btnPermissions.edit"
              :disabled="btnDisableds.edit"
              type="primary"
              @click="onEdit()"
            >
              编辑
            </el-button>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button
              v-if="btnPermissions.delete"
              :disabled="btnDisableds.delete"
              type="primary"
              @click="onDelete()"
            >
              删除
            </el-button>
          </el-col>
          <el-col :span="2" :push="6">
            <template v-if="btnPermissions.changeState">
              <el-button
                :disabled="btnDisableds.changeState"
                type="primary"
                @click="onChangeState()"
              >
                启用/禁用
              </el-button>
            </template>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- /工具栏 -->
    <div class="m-menuManagement-content">
      <!-- 页面左边容器 -->
      <div class="m-menuManagement-content-left">
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
      <!-- /页面左边容器 -->
      <!-- 页面右边容器 -->
      <div class="m-menuManagement-content-right">
        <div class="menu-tree">
          <el-tree
            ref="menuTree"
            :props="{
              children: 'children',
              label: 'label',
            }"
            :data="menuTreeData"
            show-checkbox
            default-expand-all
            node-key="id"
          />
        </div>
        <div class="footer">
          <el-button type="primary" @click="onSaveMenu">保存</el-button>
        </div>
      </div>
      <!-- /页面右边容器 -->
    </div>
    <!-- 新增、编辑角色 对话框 -->
    <el-dialog
      :title="roleFormDialogTitle"
      :visible.sync="roleFormDialogVisible"
      :before-close="closeRoleFormDialog"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="roleFormRules"
        label-width="140px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model.trim="roleForm.roleName"
            type="text"
            placeholder="请输入角色名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model.trim="roleForm.remark"
            type="text"
            placeholder="请输入备注"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRoleFormDialog()">取消</el-button>
        <el-button
          :loading="roleFormSubmitting"
          type="primary"
          @click="onConfirmRoleForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑角色 对话框 -->
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";

// 角色表单校验规则
const roleFormRules = {
  roleName: [
    {
      required: true,
      trigger: "blur",
      message: "请输入角色名称",
    },
  ],
};

export default {
  name: "menuManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      name: "menuManagement",
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
       * 搜索表单数据
       */
      searchForm: {
        roleName: "",
        state: 0,
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
       * 角色信息表单对话框 相关数据
       */
      roleFormDialogVisible: false, // 对话框是否显示
      roleFormSubmitting: false, // 表单提交状态
      // 角色表单数据
      roleForm: {
        roleName: "", // 角色名称
        remark: "", // 备注
      },
      roleFormRules, // 角色表单校验规则
      /**
       * @vuese
       * 状态选项
       */
      roleStateOptions: [
        {
          label: "启用",
          value: 0,
        },
        {
          label: "禁用",
          value: 1,
        },
      ],
      /**
       * @vuese
       * 菜单树 数据
       */
      menuTreeData: [
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
      ],
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 角色表单对话框的标题
     */
    roleFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增角色信息";
          break;
        case "edit":
          _title = "编辑角色信息";
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
          headerName: "角色名称",
          field: "roleName",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "备注",
          field: "remark",
        },
        {
          headerName: "状态",
          field: "state",
        },
        {
          headerName: "使用人数",
          field: "userNum",
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
      this.openRoleFormDialog();
    },
    /**
     * @vuese
     * 编辑事件
     */
    onEdit() {
      this.operationFlag = "edit";
      this.openRoleFormDialog();
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
     * 切换状态事件，停用、启用
     */
    onChangeState() {
      this.operationFlag = "changeState";
    },
    /**
     * @vuese
     * 保存菜单
     */
    onSaveMenu() {
      console.log(this.$refs.menuTree.getCheckedKeys());
    },
    /**
     * @vuese
     * 打开 角色表单对话框
     */
    openRoleFormDialog() {
      this.roleFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add") {
          // 重置表单
          this.resetForm("roleForm");
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("roleForm");
          // 设置表单默认值
          this.roleForm = {
            roleName: "", // 角色名称
            remark: "", // 备注
          };
        }
      });
    },
    /**
     * @vuese
     * 关闭 角色表单对话框
     */
    closeRoleFormDialog() {
      this.$confirm("确认关闭？").then(() => {
        this.roleFormDialogVisible = false;
      });
    },
    /**
     * @vuese
     * 角色表单对话框 确认事件
     */
    onConfirmRoleForm() {
      this.$refs["roleForm"].validate((valid) => {
        if (valid) {
          this.roleFormSubmitting = true;
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
  },
  // 侦听器
  watch: {},
};
</script>
<style lang="less" scoped>
// 页面右边容器的宽度
@rightContainerWidth: 350px;

.m-menuManagement {
  &-content {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    &-left {
      position: relative;
      height: 100%;
      margin-right: @rightContainerWidth + 10px;
      .m-agTable {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 35px;
      }
    }
    &-right {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: @rightContainerWidth;
      .menu-tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow: scroll;
        border: 1px solid #ecf0f0;
      }
      .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
