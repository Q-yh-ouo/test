<!--
 * 部门显示模板管理 
 * @author: 方景哲
 * @since: 2021-05-11
-->
<template>
  <!-- 部门显示模板管理 -->
  <div class="error">
    <!-- <my-table :type='3'></my-table> -->
    <div class="buttons">
      <!-- 按钮列表 -->
      <el-col :span="4">
        <el-input
          v-model.trim="templateName"
          type="text"
          placeholder="模板名称"
          clearable
        />
      </el-col>
      <el-checkbox
        v-model="showState"
        label="显示停用"
        style="margin-right: 20px"
        @change="getExampleData"
      />
      <el-button type="primary" @click="inquire">查询</el-button>
      <el-button type="primary" @click="add">添加数据</el-button>
      <el-button type="primary" @click="revise">修改</el-button>
      <el-button v-if="!showState" type="primary" @click="deleteColmn"
        >停用</el-button
      >
      <el-button v-else type="primary" @click="onRestore()">启用</el-button>
      <!-- <el-button type="primary" @click="freeze(1)">停用</el-button>
      <el-button type="primary" @click="freeze(0)">启用</el-button> -->
    </div>
    <!-- 数据列表 -->
    <div class="m-agTable m-bottom">
      <ag-grid-vue
        class="m-agTableContent ag-theme-balham"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :rowData="rowData"
        v-loading="loading"
      >
      </ag-grid-vue>
    </div>
    <div class="m-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :layout="pagination.layout"
        :total="pagination.totalCount"
      ></el-pagination>
    </div>
    <!-- 自定义项变更弹窗 开始 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :before-close="handleClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="50%"
    >
      <el-form
        :model="manageForm"
        ref="manageForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="模板名称"
          prop="templateName"
          :rules="[{ required: true, message: '请输入模板名称' }]"
        >
          <el-input v-model="manageForm.templateName" />
        </el-form-item>
        <!-- <el-form-item
          label="部门"
          prop="deptId"
          :rules="[{ required: true, message: '请选择部门' }]"
        >
          <el-select
            v-model="manageForm.deptId"
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
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose(true)">取 消</el-button>
        <el-button type="primary" @click="dialogCommit">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="hasData" class="use">无数据</div>
  </div>
</template>

<script>
import gridOptions from "lesso-common/public/gridOptions";
import Vue from "vue";
/**
 * 单元格文字提示
 */
const tooltipForCell = Vue.extend({
  template: `<el-tooltip 
      :content="String(params.value)"
      effect="dark"
      placement="top-start"
    >
      <span>{{params.value}}</span>
    </el-tooltip>`,
});

export default {
  data() {
    return {
      columnDefs: [], // 列表字段
      hasData: false,
      rowData: [], // 表格数据
      gridOptions: {}, // 表格属性设置
      dialogVisible: false, //弹框显示
      manageForm: {}, //弹框Form数据
      ruleNumber: "", //搜索的规则编号

      loading: false, //查询列表数据等待
      dialogTitle: "", //dialog标题
      showState: 0, //显示启用
      templateName: "", //模板名称
      type: "",
      pagination: {
        pageSizes: [10, 20, 30, 500],
        pageSize: 10,
        layout: "total, sizes, prev, pager, next, jumper",
        totalCount: 0,
        currentPage: 1,
      },
      stateOptions: [
        {
          value: 0,
          label: "启用",
        },
        {
          value: 1,
          label: "禁用",
        },
      ],
      /**
       * @vuese
       * 部门选择器相关数据
       */
      departmentOptions: [], // 部门选项
      departmentOptionsLoading: false, // 部门选项加载状态
    };
  },
  beforeMount() {
    /**
     * @vuese
     * 初始化列表
     *
     */
    this.gridOptions = gridOptions();
    this.columnDefs = [
      {
        headerName: "模板名称",
        field: "templateName",
        checkboxSelection: true, // 是否在行头显示勾选框
        cellRendererFramework: tooltipForCell,
      },
      // {
      //   headerName: "部门名称",
      //   field: "deptName",
      //   width: 250,
      //   cellRendererFramework: tooltipForCell,
      // },
      {
        headerName: "创建人姓名",
        field: "creator",
      },
      {
        headerName: "创建人工号",
        field: "createBy",
      },
      {
        headerName: "创建时间",
        field: "createTime",
      },
      {
        headerName: "修改人姓名",
        field: "updator",
      },
      {
        headerName: "修改人工号",
        field: "updateBy",
      },
      {
        headerName: "修改时间",
        field: "updateTime",
      },
      {
        headerName: "状态",
        field: "state",
        cellRenderer: (params) => {
          const _state = this.stateOptions.find(
            (item) => Number(params.value) === item.value
          );
          return _state ? _state.label : "";
        },
      },
    ];
  },
  mounted() {
    this.getExampleData();
  },
  methods: {
    // 翻页--页大小
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getExampleData();
    },
    // 翻页--页码
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getExampleData();
    },
    /**
     * @vuese
     * 是否选中列表数据
     */
    beSelected() {
      let rows = this.gridOptions.api.getSelectedRows(); //获取选择行的数据
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
    /**
     * @vuese
     * 清空弹框表单表单
     */
    resetManageForm() {
      if (this.$refs.manageForm) {
        this.$refs.manageForm.resetFields();
      }
      this.manageForm = {};
    },
    /**
     * @vuese
     * 查询
     */
    inquire() {
      this.getExampleData();
    },
    /**
     * @vuese
     * 修改
     */
    revise() {
      this.dialogTitle = "修改";
      this.type = "revise";
      let rows = this.gridOptions.api.getSelectedRows(); //获取选择行的数据
      if (!this.beSelected()) {
        return;
      }

      this.manageForm = JSON.parse(JSON.stringify(rows[0]));
      this.dialogVisible = true;
      this.getDeptmentListAll();
    },
    /**
     * @vuese
     * 删除
     */
    deleteColmn() {
      let rows = this.gridOptions.api.getSelectedRows(); //获取选择行的数据
      if (!this.beSelected()) {
        return;
      }
      let id = rows[0].id;
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$http
        .deleteBaseDeptColumnTemplate({
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.error(res.data.info);
          } else {
            this.$message.success(res.data.info);
            this.getExampleData();
          }
        });
    },
    /**
     * @vuese
     * 恢复事件
     */
    onRestore() {
      if (!this.beSelected()) {
        return;
      }
      const _rows = this.gridOptions.api.getSelectedRows(); //获取选择行的数据
      this.restoreBaseDeptColumnTemplate(_rows[0].id);
    },
    /**
     * @vuese
     * 停用
     */
    freeze(state) {
      let rows = this.gridOptions.api.getSelectedRows(); //获取选择行的数据
      if (!this.beSelected()) {
        return;
      }
      let ids = [];
      rows.map((item) => {
        ids.push(item.id);
      });
      this.$http
        .mstRuleErrorMsgStateModifyBatch({
          ids,
          state,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.$message.error(res.data.info);
          } else {
            this.$message.success(res.data.info);
            this.getExampleData();
          }
        });
    },
    /**
     * @vuese
     * 添加
     */
    add() {
      this.resetManageForm();
      this.dialogTitle = "添加";
      this.type = "add";
      this.dialogVisible = true;
      this.getDeptmentListAll();
    },
    /**
     * @vuese
     * 取消dialog弹框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    dialogClose(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？")
          .then(() => {
            this.resetManageForm();
            this.dialogVisible = false;
          })
          .catch(() => {});
      } else {
        this.resetManageForm();
        this.dialogVisible = false;
      }
    },
    /**
     * @vuese
     * 提交dialog弹框
     */
    dialogCommit() {
      if (this.type == "add") {
        // 添加
        const { sapNum, employeeName } =
          this.$utils.getStorage("userData").user;
        const formData = {
          ...this.manageForm,
          createBy: sapNum,
          creator: employeeName,
        };
        // const findDeptment = this.departmentOptions.find(
        //   (item) => item.id === formData.deptId
        // );
        // if (findDeptment) {
        //   formData.deptName = `${findDeptment.companyName}${
        //     findDeptment.companyName && findDeptment.deptName ? "-" : ""
        //   }${findDeptment.deptName}`;
        // }
        this.$refs["manageForm"].validate((valid) => {
          if (valid) {
            this.$http.saveDeptColumnTemplate(formData).then((res) => {
              if (res.data.code == "1") {
                this.$message.success(res.data.info);
                this.getExampleData();
                this.dialogClose();
              } else {
                this.$message.error(res.data.info);
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.type == "revise") {
        // 修改
        const { sapNum, employeeName } =
          this.$utils.getStorage("userData").user;
        const formData = {
          ...this.manageForm,
          updateBy: sapNum,
          updator: employeeName,
        };
        // const findDeptment = this.departmentOptions.find(
        //   (item) => item.id === formData.deptId
        // );
        // if (findDeptment) {
        //   formData.deptName = `${findDeptment.companyName}${
        //     findDeptment.companyName && findDeptment.deptName ? "-" : ""
        //   }${findDeptment.deptName}`;
        // }
        this.$refs["manageForm"].validate((valid) => {
          if (valid) {
            this.$http.updateDeptColumnTemplate(formData).then((res) => {
              if (res.data.code == "1") {
                this.$message.success(res.data.info);
                this.getExampleData();
                this.dialogClose();
              } else {
                this.$message.error(res.data.info);
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        //明细
        this.dialogClose();
      }
    },
    /**
     * @vuese
     * 获取表单数据
     */
    getExampleData() {
      let that = this;

      this.loading = true;
      console.log("获取列表数据");
      let data = {
        state: this.showState ? 1 : 0,
        templateName: this.templateName,
        current: this.pagination.currentPage,
        size: this.pagination.pageSize,
      };
      this.$http
        .getBasePfmMergetBaseDeptColumnTemplateListcolumnList(data)
        .then((res) => {
          this.loading = false;
          that.rowData = res.data.rows.records;
          if (that.rowData.length < 1) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          that.pagination.totalCount = res.data.total;
        })
        .catch((res) => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
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
     * 恢复部门显示模板信息
     * @arg {String} id 部门显示模板信息记录Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    restoreBaseDeptColumnTemplate(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$http
        .restoreBaseDeptColumnTemplate({
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "启用成功",
            });
            // 获取表格数据
            this.getExampleData();
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
  },
};
</script>
<style lang="less" scoped>
.buttons {
  margin-bottom: 20px;
  text-align: right;
  .el-input {
    width: 200px;
    float: left;
    margin-right: 20px;
  }
  .el-select {
    width: 200px;
    float: left;
  }
}
.pageNavigator {
  margin-top: 10px;
  .el-pagination {
    padding: 0px 20px;
    font-weight: normal;
    text-align: right;
  }
}
/deep/.ag-overlay-no-rows-center {
  position: relative;
  top: 50px;
  z-index: 99;
}
.use {
  text-align: center;
}
</style>
