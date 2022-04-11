<!--
 * 待办事宜页面
 * @author: 郭湛良-景兴
 * @since: 2021-04-28
-->
<template>
  <div class="m-window m-toDoList">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="" prop="applyName">
              <el-input
                v-model.trim="searchForm.applyName"
                type="text"
                placeholder="申请人"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="applyCompany">
              <el-select
                v-model="searchForm.applyCompany"
                filterable
                clearable
                placeholder="请选择考核人公司"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="applyDeptName">
              <el-select
                v-model="searchForm.applyDeptName"
                filterable
                clearable
                placeholder="请选择被考核人部门"
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.deptName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="billNum">
              <el-input
                v-model.trim="searchForm.billNum"
                type="text"
                placeholder="申请流程号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="applyTitle">
              <el-input
                v-model.trim="searchForm.applyTitle"
                type="text"
                placeholder="申请标题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="workflowType">
              <el-select
                v-model="searchForm.workflowType"
                filterable
                clearable
                placeholder="请选择流程类型"
              >
                <el-option
                  v-for="item in workflowTypeArr"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="assessee">
              <el-input
                v-model.trim="searchForm.assessee"
                type="text"
                placeholder="被考核员工"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="startReceiveTime">
              <el-date-picker
                v-model="searchForm.startReceiveTime"
                type="date"
                placeholder="流程开始日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="endReceiveTime">
              <el-date-picker
                v-model="searchForm.endReceiveTime"
                type="date"
                placeholder="流程结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button type="primary" @click="onExport(1)">
              表格统计导出
            </el-button>
          </el-col>
          <el-col :span="2" :push="6">
            <el-button type="primary" @click="onExport()">
              流程明细导出
            </el-button>
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
let summary = [
  {
    headerName: "汇总部门",
    field: "department",
  },
  {
    headerName: "待办人",
    field: "nextPersons",
  },
  {
    headerName: "被考核员工SAP工号",
    field: "applyEmployeeSap",
  },
  {
    headerName: "被考核员工",
    field: "employee",
  },
  {
    headerName: "被考核员工岗位",
    field: "post",
  },
  {
    headerName: "员工类型",
    field: "type",
  },
  {
    headerName: "一月考核得分",
    field: "janScore",
  },
  {
    headerName: "二月考核得分",
    field: "febScore",
  },
  {
    headerName: "三月考核得分",
    field: "marScore",
  },
  {
    headerName: "四月考核得分",
    field: "aprScore",
  },
  {
    headerName: "五月考核得分",
    field: "mayScore",
  },
  {
    headerName: "六月考核得分",
    field: "junScore",
  },
  {
    headerName: "七月考核得分",
    field: "julScore",
  },
  {
    headerName: "八月考核得分",
    field: "augScore",
  },
  {
    headerName: "九月考核得分",
    field: "sepScore",
  },
  {
    headerName: "十月考核得分",
    field: "octScore",
  },
  {
    headerName: "十一月考核得分",
    field: "novScore",
  },
  {
    headerName: "十二月考核得分",
    field: "decScore",
  },
  {
    headerName: "年度平均分",
    field: "averageScore",
  },
  {
    headerName: "季度平均分",
    field: "average",
  },
  {
    headerName: "季度评级",
    field: "pfmRating",
  },
  {
    headerName: "考核月份",
    field: "checkMonth",
  },
  {
    headerName: "考核得分",
    field: "score",
  },
  {
    headerName: "标准工资",
    field: "standardWage",
  },
  {
    headerName: "实发工资",
    field: "realWage",
  },
  {
    headerName: "工资差额",
    field: "difference",
  },
  {
    headerName: "第一季度平均分",
    field: "firstAverage",
  },
  {
    headerName: "第一季度评级",
    field: "firstRating",
  },
  {
    headerName: "第二季度评级",
    field: "secondAverage",
  },
  {
    headerName: "第二季度平均分",
    field: "secondRating",
  },
  {
    headerName: "第三季度评级",
    field: "thirdAverage",
  },
  {
    headerName: "第三季度平均分",
    field: "thirdRating",
  },
  {
    headerName: "第四季度评级",
    field: "fourthAverage",
  },
  {
    headerName: "第四季度平均分",
    field: "fourthRating",
  },
  {
    headerName: "备注",
    field: "memo",
  },
];
let scoreAndTable = [
  {
    headerName: "公司",
    field: "appCompany",
  },
  {
    headerName: "部门",
    field: "appDeptName",
  },
  {
    headerName: "员工姓名",
    field: "appEmployee",
  },
  {
    headerName: "考核月份",
    field: "actualDate",
  },
  {
    headerName: "发起日期",
    field: "applyDate",
  },
  {
    headerName: "指标名称",
    field: "kpiName",
  },
  {
    headerName: "二级指标",
    field: "kpiDefine",
  },
  {
    headerName: "指标定义",
    field: "kpiSecondDefine",
  },
  {
    headerName: "目标",
    field: "kpiObjective",
  },
  {
    headerName: "权重",
    field: "kpiWeight",
  },
  {
    headerName: "评分细则",
    field: "scoringRubric",
  },
  {
    headerName: "考核周期",
    field: "kpiCycle",
  },
  {
    headerName: "数据提供部门/人",
    field: "kpiDirector",
  },
  {
    headerName: "数据支撑报表",
    field: "dataReport",
  },
  {
    headerName: "责任人",
    field: "principal",
  },
  {
    headerName: "协助人",
    field: "patronn",
  },
  {
    headerName: "待办人",
    field: "nextPersons",
  },
  {
    headerName: "考核目的",
    field: "kpiGoal",
  },
  {
    headerName: "计划完成日期",
    field: "plannedDate",
  },
  {
    headerName: "实际完成日期",
    field: "actualDate",
  },
  {
    headerName: "完成情况",
    field: "completion",
  },
  {
    headerName: "自评分数",
    field: "selfScore",
  },
  {
    headerName: "自评理由",
    field: "selfReason",
  },
  {
    headerName: "考核得分",
    field: "score",
  },
  {
    headerName: "评定理由",
    field: "reason",
  },
  {
    headerName: "备注",
    field: "memo",
  },
];
export default {
  name: "haveDoList",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {
    removeTabByCode: Function,
    addTab: {
      type: Function,
    },
  },
  // 响应式数据
  data() {
    return {
      name: "haveDoList",
      workflowTypeArr: [
        {
          id: 3,
          companyName: "绩效评分与申诉流程",
        },
        {
          id: 2,
          companyName: "绩效考核表申请流程",
        },
        {
          id: 4,
          companyName: "绩效汇总表申请流程",
        },
      ],
      companyOptions: [], // 公司选项
      departmentOptions: [], // 部门选项
      /**
       * @vuese
       * 按钮权限组
       */
      btnPermissions: {
        query: true, // 查询
      },
      /**
       * @vuese
       * 按钮禁用状态
       */
      btnDisableds: {
        query: false, // 查询
      },
      /**
       * @vuese
       * 搜索表单数据
       */
      searchForm: {
        applyName: "",
        startReceiveTime: null,
        endReceiveTime: null,
        applyCompany: "",
        billNum: "",
        applyTitle: "",
        workflowType: "",
        applyDeptName: "",
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
    };
  },
  // 计算属性
  computed: {},
  // 实例创建
  created() {
    // 初始化操作按钮权限
    this.initAuthBtn();
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
        this.getMainTableData();
      }
    });
  },
  // 实例销毁前
  beforeDestroy() {
    EvenBus.$off(TABS_CHANGE);
  },
  // 实例挂载完成
  mounted() {
    this.getMainTableData();
  },
  // 实例内函数
  methods: {
    /**
     * @vuese
     * 根据公司获取部门
     */
    usecompFindCompanyId(companyId) {
      this.$http.getDeptmentListAll({ companyId }).then((response) => {
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
      });
    },
    /**
     * @vuese
     * 获取所有公司
     */
    getCompanyListAll() {
      this.$http
        .getCompanyListAll()
        .then((response) => {
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
     * 导出
     */
    onExport(type) {
      let rows = this.mainTableOptions.api.getSelectedRows();
      let flag = null;
      let billNum = [];
      if (rows === 0) {
        this.$alert("没有数据可导出", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      if (type == 1) {
        this.exportExcel(
          "报表统计信息",
          this.mainTableColumns,
          this.mainTableData
        );
        return;
      }
      rows.map((item) => {
        if (!flag) {
          flag = item.workflowType;
        } else if (flag != item.workflowType) {
          this.$alert("导出的流程类型不一致", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
          return;
        }
        billNum.push(item.billNum);
      });
      this.$http.exportDetail(billNum).then((res) => {
        if (res.data.code == 1) {
          this.exportExcel(
            flag == "绩效汇总表申请流程"
              ? "已办事宜考核汇总流程明细表"
              : "已办事宜考核表明细",
            flag == "绩效汇总表申请流程" ? summary : scoreAndTable,
            res.data.rows
          );
        } else {
          this.$message.info(res.data.info);
        }
      });
    },
    exportExcel(fileName, columns, data) {
      // 表头数据
      const sheetHeader = columns.map((item) => item.headerName);
      // 表格数据
      const sheetData = data.map((item) => {
        const newItem = {};
        for (const key in item) {
          const findColumn = columns.find(
            (columnItem) => columnItem.field === key
          );
          if (findColumn) {
            newItem[findColumn.headerName] = item[key];
          }
        }
        return newItem;
      });
      this.$utils.exportExcel({
        sheetHeader,
        data: sheetData,
        fileName: `${fileName}.xlsx`,
      });
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
      let that = this;
      this.mainTableOptions = Object.assign({}, gridOptions(), {
        singleSelection: true, // 是否单选
        dragSelectCheckbox: true, // 是否启用拖选行
        onCellDoubleClicked: (event) => {
          let data = null;
          switch (event.data.workflowType) {
            case "绩效考核表申请流程":
              data = {
                children: null,
                code: "formApplication",
                id: 10309,
                name: "考核表申请流程",
                picName: null,
                picUrl: null,
                pid: 10304,
              };
              break;
            case "绩效评分与申诉流程":
              data = {
                children: null,
                code: "gradingApplication",
                id: 10310,
                name: "评分与申诉流程",
                picName: null,
                picUrl: null,
                pid: 10304,
              };
              break;
            case "绩效汇总表申请流程":
              data = {
                children: null,
                code: "summaryApplication",
                id: 10312,
                name: "汇总表申请流程",
                picName: null,
                picUrl: null,
                pid: 10304,
              };
              break;
            default:
              break;
          }
          if (data) {
            this.addTab(data, { referrer: this.name, rowData: event.data });
          }
        },
      });

      this.mainTableColumns = [
        {
          headerName: "申请标题",
          field: "applyTitle",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "被考核人公司",
          field: "applyCompany",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "被考核人部门",
          field: "applyDeptName",
          width: 150,
        },
        {
          headerName: "申请流程号",
          field: "billNum",
          width: 150,
        },
        {
          headerName: "待办人",
          field: "nextPersons",
          width: 150,
        },
        {
          headerName: "流程类型",
          field: "workflowType",
          width: 150,
        },
        {
          headerName: "申请日期",
          field: "applyTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "接受日期",
          field: "receiveTime",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "申请人",
          field: "applyName",
          width: 150,
        },
        {
          headerName: "当前节点",
          field: "status",
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
      const { startReceiveTime, endReceiveTime } = this.searchForm;
      // 接收开始时间与接收结束时间必须同时存在或同时不存在
      // if (!startReceiveTime ^ !endReceiveTime) {
      //   this.$alert("接收开始时间不能与接收结束时间必须成对！", {
      //     showClose: false,
      //     confirmButtonText: "确定",
      //     customClass: "alertFailure",
      //   });
      // } else {
      // 接收开始时间不能大于接收结束时间
      // if (startReceiveTime > endReceiveTime) {
      //   this.$alert("接收开始时间不能大于接收结束时间！", {
      //     showClose: false,
      //     confirmButtonText: "确定",
      //     customClass: "alertFailure",
      //   });
      // }
      //}
      this.searchForm.startReceiveTime = this.searchForm.startReceiveTime
        ? this.$utils.dateFormat(
            "yyyy-MM-dd hh:mm:ss",
            this.searchForm.startReceiveTime
          )
        : null;
      this.searchForm.endReceiveTime = this.searchForm.endReceiveTime
        ? this.$utils.dateFormat(
            "yyyy-MM-dd hh:mm:ss",
            this.searchForm.endReceiveTime
          )
        : null;
      this.mainTableLoading = true;
      const { sapNum } = this.$utils.getStorage("userData").user;
      let data = {};
      data.size = this.mainTablePageSize;
      data.current = this.mainTableCurrentPage;
      data.data = {
        ...this.searchForm,
        sapNum,
      };
      this.$http
        .haveGetWorkflowList(data)
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
     * 搜索事件
     */
    onSearch() {
      this.operationFlag = "query";
      // 设置当前页码为第一页
      this.mainTableCurrentPage = 1;
      // 获取主表格数据
      this.getMainTableData();
    },
  },
  // 侦听器
  watch: {
    "searchForm.applyCompany"(val) {
      if (val) {
        let use = null;
        this.companyOptions.map((item) => {
          if (item.companyName == val) {
            use = item.id;
          }
        });
        this.usecompFindCompanyId(use);
      } else {
        this.departmentOptions = [];
      }
    },
  },
};
</script>
<style lang="less" scoped>
.m-window {
  &.m-toDoList {
    & > .m-agTable {
      top: 100px;
    }
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
