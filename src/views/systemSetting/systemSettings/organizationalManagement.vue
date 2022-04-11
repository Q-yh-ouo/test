<!-- 描述：左上下结构 -->
<template>
  <div class="m-view-leftUpDown m-window">
    <!-- 左边树结构 -->
    <div class="m-leftTree" style="min-width: 590px">
      <el-row :gutter="12" style="paddingbottom: 10px">
        <!--<el-col :span="12">-->
        <!--<el-date-picker-->
        <!--v-model="deptSelectTime"-->
        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--type="daterange"-->
        <!--align="right"-->
        <!--unlink-panels-->
        <!--:picker-options="pickerOptions"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
        <!--</el-col>-->
        <el-col :span="6">
          <el-date-picker
            v-model="deptBeginTime"
            type="date"
            placeholder="开始日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="deptEndTime"
            type="date"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="compName"
            filterable
            placeholder="请选择公司名称"
            clearable
          >
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.companyFullName || item.companyName"
              :value="item.parentCode"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <!-- <el-button type="primary" @click="deptSearch()" v-if="btnStatus.list">查询</el-button> -->
          <el-button
            type="primary"
            @click="searchCompany()"
            v-if="btnStatus.list"
            >查询</el-button
          >
        </el-col>
        <el-col :span="3">
          <el-button
            type="primary"
            @click="newRoot"
            v-if="btnStatus.categoryAdd"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <!--组织架构树形-->
      <div class="custom-tree-container">
        <div class="block" style="background: red">
          <!--show-checkbox-->
          <!--default-expand-all-->
          <el-tree
            v-if="openPanel"
            :data="categoryData"
            node-key="id"
            :load="deptSearch"
            lazy
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="categoryDataTree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                >{{ data.organizationName }}&nbsp;({{
                  data.organizationCode
                }})({{
                  data.beginTime == null
                    ? ""
                    : data.beginTime.replace(" 00:00:00", "")
                }}~{{
                  data.endTime == null
                    ? ""
                    : data.endTime.replace(" 00:00:00", "")
                }})</span
              >
              <span>
                <!--&& !node.parent-->
                <el-button
                  type="text"
                  size="mini"
                  style="border: none"
                  @click.stop="() => deleteChildren(node, data)"
                  v-if="btnStatus.deleteCategory && node.level != 1"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  style="border: none"
                  @click.stop="() => editCategory(node, data)"
                  v-if="btnStatus.editCategory && data.state == 0"
                  >编辑</el-button
                >

                <el-button
                  type="text"
                  size="mini"
                  style="border: none"
                  @click.stop="() => newChildren(node, data)"
                  v-if="btnStatus.newChildren"
                  >增加子项</el-button
                >
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <!-- 右边列表 -->
    <div class="m-rightContent">
      <!-- 工具栏 -->
      <div class="m-condition">
        <el-row :gutter="12" type="flex" justify="end">
          <el-col :span="2">
            <el-button v-if="btnStatus.list" type="primary" @click="search"
              >查询
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              :disabled="!selectNode"
              v-if="btnStatus.add"
              type="primary"
              @click="add"
              >新增
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              :disabled="!selectNode"
              v-if="btnStatus.edit"
              type="primary"
              @click="edit"
              >编辑
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              :disabled="!selectNode"
              v-if="btnStatus.delete"
              type="primary"
              @click="del"
              >删除
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              v-if="btnStatus.introduce"
              type="primary"
              @click="introduce"
              >引入
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-upload
              :action="''"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeImportPersonnel"
              :http-request="importPersonnel"
              :file-list="[]"
              class="upload-btn"
            >
              <el-button
                v-if="btnStatus.import"
                :loading="importing"
                type="primary"
                >导入</el-button
              >
            </el-upload>
          </el-col>
          <el-col :span="3">
            <el-button
              v-if="btnStatus.import"
              type="primary"
              @click="downloadImportTemplate"
              >下载模板</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button
              v-if="btnStatus.export"
              type="primary"
              :loading="exportExcelLoading"
              @click="getExportExcelData"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="4">
            <el-input
              v-model="searchName"
              type="text"
              placeholder="请输入工号/姓名"
              clearable
            ></el-input>
          </el-col>
          <!--<el-col :span="7">-->
          <!--<el-date-picker-->
          <!--v-model="personSelectTime"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--:picker-options="pickerOptions"-->
          <!--type="daterange"-->
          <!--align="right"-->
          <!--unlink-panels-->
          <!--range-separator="至"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期">-->
          <!--</el-date-picker>-->
          <!--</el-col>-->
          <el-col :span="4">
            <el-date-picker
              v-model="personBeginTime"
              type="date"
              placeholder="开始日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="personEndTime"
              type="date"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="3">
            <el-select clearable v-model="stat2" placeholder="状态">
              <el-option
                v-for="item in stat2Options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 人员列表 -->
      <div class="m-agTable" style="margin-top: 50px">
        <ag-grid-vue
          class="m-agTableContent ag-theme-balham"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :rowData="rowData"
          v-loading="loading"
        ></ag-grid-vue>
      </div>
      <!-- 分页 -->
      <div class="m-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!--新增/编辑部门 12300-->
    <el-dialog
      :title="titleDialog"
      :visible.sync="editDataDictionaryVisible"
      :before-close="editDataDictionaryClose"
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataOrganizationForm"
        label-width="140px"
        :model="dataOrganizationForm"
        :rules="rules"
        v-loading="dialogloading"
      >
        <el-form-item
          label="当前上级部门"
          v-if="parentCodeShow && ifEdit && !ifShowOrg"
        >
          <span>{{ organizationParentName }}</span>
          <el-button @click="ifShowOrg = !ifShowOrg">
            {{ ifShowOrg ? "不更改" : "更改" }}
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="parentCodeShow && ifShowOrg"
          label="上级部门"
          prop="organizationParentCode"
        >
          <el-cascader
            v-model.trim="dataOrganizationForm.organizationParentCode"
            @change="changeOrgParentCode"
            style="width: 100%"
            :options="categorySelectData"
            :props="{
              checkStrictly: true,
              value: 'organizationCode',
              label: 'organizationName',
              lazy: true,
              lazyLoad: chooseDeptSearch,
            }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门编码" prop="organizationCode">
          <el-input
            v-model.trim="dataOrganizationForm.organizationCode"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="organizationName">
          <el-input
            v-model.trim="dataOrganizationForm.organizationName"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginTime">
          <el-date-picker
            v-model="dataOrganizationForm.beginTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item v-if="!isModifyCategoryDialog" label="结束日期" prop="endTime">-->
        <!--<el-date-picker-->
        <!--v-model="dataOrganizationForm.endTime"-->
        <!--type="date"-->
        <!--placeholder="选择日期">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDataDictionaryClose">取消</el-button>
        <el-button
          :loading="saveLoading"
          type="primary"
          @click="saveOrEditDictionaryCategory"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!--新增人员信息-->
    <el-dialog
      :title="dictionaryTitle"
      :visible.sync="personVisible"
      :before-close="personClose"
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <el-form
        ref="personForm"
        label-width="140px"
        :model="personForm"
        :rules="personRules"
        v-loading="dialogloading"
      >
        <el-form-item v-if="!ifPerEdit" label="员工工号" prop="personNo">
          <el-input v-model.trim="personForm.personNo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="当前部门" v-if="ifPerEdit && !ifPerShowOrg">
          <span>{{ organizationParentName }}</span>
          <el-button @click="ifPerShowOrg = !ifPerShowOrg"> 更改 </el-button>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptCode" v-if="ifPerShowOrg">
          <el-cascader
            v-model.trim="categoryCode"
            :options="categorySelectData"
            :props="{
              checkStrictly: true,
              value: 'organizationCode',
              label: 'organizationName',
              lazy: true,
              lazyLoad: chooseDeptSearch,
            }"
            clearable
            style="width: 100%"
            @change="changeDeptCode"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="personName">
          <el-input v-model.trim="personForm.personName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="personForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="在职状态" prop="stat1">
          <el-select clearable v-model="personForm.stat1" placeholder="请选择">
            <el-option
              v-for="item in onOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在职详情" prop="stat2">
          <el-select clearable v-model="personForm.stat2" placeholder="请选择">
            <el-option
              v-for="item in offOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="personForm.beginTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model.trim="personForm.position" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="personClose">取消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="savePerson"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!--引入员工-->
    <el-dialog
      :visible.sync="introduceFormVisible"
      :before-close="introduceFormClose"
      :close-on-click-modal="false"
      v-dialogDrag
      title="引入员工"
    >
      <el-form
        ref="introduceForm"
        label-width="140px"
        :model="introduceForm"
        :rules="introduceFormRules"
      >
        <el-form-item v-if="!ifPerEdit" label="员工工号" prop="personNo">
          <el-input v-model.trim="introduceForm.personNo" type="text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="introduceFormClose">取消</el-button>
        <el-button
          :loading="introduceFormSubmitting"
          type="primary"
          @click="introduceFormConfirm"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!--导入失败对话框-->
    <el-dialog
      :visible.sync="importFailDialogVisible"
      :before-close="importFailDialogClose"
      :close-on-click-modal="false"
      v-dialogDrag
      title="导入失败的员工信息"
      width="70%"
    >
      <div class="m-agTable" style="height: 400px">
        <ag-grid-vue
          class="m-agTableContent ag-theme-balham"
          :gridOptions="importFailTableOptions"
          :columnDefs="importFailTableColumns"
          :rowData="importFailList"
        ></ag-grid-vue>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importFailDialogClose">取消</el-button>
        <el-button
          :loading="exportingFailList"
          type="primary"
          @click="exportFailList"
        >
          导出
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/** 引入依赖开始 */
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
import EvenBus from "@/public/evenBus";
import XLSX from "xlsx";
import axios from "axios";
import { TABS_CHANGE } from "@/public/evenbusConstant";
/** 引入依赖结束 */

// 组织架构页面
export default {
  name: "organizationalManagement",
  components: {},
  data() {
    let navList = [];
    return {
      deptBeginTime: null,
      changed: false,
      deptEndTime: null,
      personBeginTime: null,
      personEndTime: null,
      navList: JSON.parse(JSON.stringify(navList)),
      defaultProps: {
        children: "children",
        label: "label",
      },
      orgId: "",
      filterText: "",
      name: "organizationalManagement",
      titleDialog: "新增",
      editDataDictionaryVisible: false,
      isModifyCategoryDialog: false,
      exportExcelLoading: false,
      dialogloading: false,
      selectNode: false, //是否选择节点
      organizationCode: null, //部门组织编码
      parentCode: null, //公司编码
      ifShowOrg: false, //是否更改部门
      ifPerShowOrg: false, //员工改部门
      ifEdit: false, //是否更改部门
      ifPerEdit: false, //人员信息更改部门
      organizationParentName: "", //上级部门
      stat2: "",
      upData: [],
      categoryCode: [],
      openPanel: true,
      saveLoading: false,
      dataOrganizationForm: {
        organizationCode: null,
        organizationName: null,
        parentCode: null,
        organizationParentCode: null,
        organizationParentName: null,
        beginTime: null, //开始时间
        endTime: null, //结束时间
      },
      parentCodeShow: true, //部门树结果集
      categoryData: [], //部门树结果集
      categorySelectData: [], //部门选择树结果集
      saveDeptCode: "",
      stat2Options: [
        {
          value: "3",
          label: "在职",
        },
        {
          value: "0",
          label: "离职",
        },
      ],
      /** 按钮权限控制 */
      pageCode: "template",
      btnStatus: {
        list: false, // 查询
        add: false, // 新增
        edit: false, // 编辑
        delete: false, // 编辑
        categoryAdd: false, // 编辑
        editCategory: false, // 编辑
        newChildren: false, // 添加子项
        categoryDelete: false, // 删除
        export: false, // 导出
        deleteCategory: false, // 删除
        import: false, // 导入
        introduce: false, // 引入
      },
      categoryName: "",
      dictionaryTitle: "新增人员",
      personVisible: false,
      personForm: { sex: "男", deptCode: "", personName: "" },
      currentParentCode: "", // 当前父类
      personRules: {
        deptCode: [
          {
            required: true,
            message: "部门不能为空",
            trigger: "blur",
          },
        ],
        personName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
        stat1: [
          {
            required: true,
            message: "在职状态不能为空",
            trigger: "blur",
          },
        ],
        stat2: [
          {
            required: true,
            message: "在职详情不能为空",
            trigger: "blur",
          },
        ],
        beginTime: [
          {
            required: true,
            message: "开始时间不能为空",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "blur",
          },
        ],
        /*
                    categoryCode: [
                        {
                            required: true,
                            message: "部门名称不能为空",
                            trigger: "blur"
                        }
                    ],
*/
      },
      /** 按钮权限控制 */

      /** 查询条件变量 */
      gcItems: [],
      searchName: "",
      /** 查询条件变量 */
      deptSelectTime: [], //部门的查询时间
      personSelectTime: [], //员工的查询时间
      /** 数据列表 */
      loading: false, //查询列表数据等待
      gridOptions: {}, //ag-grid 配置
      columnDefs: {}, //ag-grid 字段
      rowData: [], //ag-grid 数据
      exportExcelData: [], // 导出数据
      /** 数据列表 */
      /** 公司选项 */
      companys: [], //公司
      compName: "", //公司名称

      /** 分页控件 */
      currentPage: 1, //当前页码
      pageSize: 30, //每页记录条数
      total: 0, //记录总条数
      sizeList: [30, 50, 100, 150, 200], //数组--每页显示条数
      /** 分页控件 */

      /** 新增/编辑 弹出界面数据模型 */
      title: "", //弹框标题
      dialogVisible: false, //打开新增 / 编辑模态框
      editData: {},
      //输入数据验证
      rules: {
        organizationCode: [
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const val = value || "";
              if (String(val).trim() === "") {
                callback();
              } else {
                if (isNaN(Number(val)) || val.length !== 8) {
                  callback(new Error("请输入8位数字部门编码"));
                }
                callback();
              }
            },
          },
        ],
        organizationParentCode: [
          { required: true, trigger: "blur", message: "请选择上级部门" },
        ],
        organizationName: [
          {
            required: true,
            trigger: "blur",
            message: "请填写部门名称不能为空",
          },
          {
            min: 1,
            max: 100,
            message: "请输入字符长度为1-100的名称 ",
            trigger: "blur",
          },
        ],
        beginTime: [
          { required: true, trigger: "blur", message: "请选择开始时间" },
        ],
      },
      /** 新增/编辑 弹出界面数据模型 */
      /** 在岗状态选择框 */
      onOptions: [
        {
          value: "0",
          label: "实习",
        },
        {
          value: "1",
          label: "正式在职",
        },
        {
          value: "2",
          label: "见习",
        },
        {
          value: "3",
          label: "试用",
        },
        {
          value: "4",
          label: "借用",
        },
        {
          value: "5",
          label: "返聘",
        },
        {
          value: "6",
          label: "停薪留岗",
        },
        {
          value: "7",
          label: "停工留薪",
        },
        {
          value: "A",
          label: "退休",
        },
        {
          value: "B",
          label: "离职",
        },
        {
          value: "Z",
          label: "死亡",
        },
      ],
      /** 不在岗状态选择框 */
      offOptions: [
        {
          value: "0",
          label: "离职",
        },
        {
          value: "1",
          label: "不活动",
        },
        {
          value: "2",
          label: "退休",
        },
        {
          value: "3",
          label: "激活",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      /**
       * @vuese
       * 引入员工 对话框 相关数据
       */
      introduceFormVisible: false, // 对话框是否显示
      introduceFormSubmitting: false, // 表单提交状态
      // 引入员工 表单数据
      introduceForm: {
        personNo: "", // 员工工号
      },
      // 引入员工 表单校验规则
      introduceFormRules: {
        personNo: [
          {
            required: true,
            trigger: "blur",
            message: "请输入员工工号",
          },
        ],
      },
      /**
       * @vuese
       * 导入失败 对话框 相关数据
       */
      importFailDialogVisible: false, // 对话框是否显示
      exportingFailList: false, // 导出插入失败的列表的状态
      importing: false, // 导入状态
      importFailTableOptions: {}, // ag-grid 配置
      importFailTableColumns: [], // ag-grid 字段
      importFailList: [], // 插入失败员工列表
    };
  },
  created() {},
  mounted() {
    this.chooseSearchCompany();
  },
  // 此钩子内设置ag-grid
  beforeMount() {
    var sdtime = new Date().setMonth(new Date().getMonth() - 1);
    let sTime = new Date(sdtime);
    let times = [];
    //times.push(sTime)
    //times.push(new Date())
    this.deptBeginTime = sTime;
    this.deptEndTime = new Date();
    //this.deptSelectTime = times
    let perTimes = [];
    let monthFirst = this.getCurrentMonthFirst();
    let spTime = new Date(monthFirst);
    perTimes.push(spTime);
    perTimes.push(new Date());
    this.personSelectTime = perTimes;
    this.personBeginTime = spTime;
    this.personEndTime = new Date();
    // 获取按钮权限
    this.initAuthBtn();
    // this.getCategoryTreeList();
    // this.deptSearch();
    this.getCompanyListAll();

    // ag-grid默认配置
    // this.gridOptions = gridOptions();
    this.initGrid();

    // 初始化人员数据
    this.stat2 = "3";
    this.search();
    // tabs标签页切换
    EvenBus.$on(TABS_CHANGE, (data) => {
      if (data.content === this.name) {
        // 获取所有公司
        this.getCompanyListAll();
      }
    });
  },
  // 实例销毁前
  beforeDestroy() {
    EvenBus.$off(TABS_CHANGE);
  },
  watch: {
    filterText(val) {
      this.$refs.categoryDataTree.filter(val);
    },
    stat2(val) {
      this.changed = true;
    },
  },
  methods: {
    initGrid() {
      this.gridOptions = gridOptions({ singleSelection: true });
      // ag-grid数据源配置
      this.columnDefs = [
        {
          headerName: "工号",
          field: "personNo",
          width: 120,
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        { headerName: "姓名", field: "personName", width: 100 },
        {
          headerName: "开始日期",
          field: "beginTimeStr",
          width: 100,
        },
        {
          headerName: "结束日期",
          field: "endTimeStr",
          width: 100,
        },
        { headerName: "所属公司", field: "companyName", width: 300 },
        { headerName: "所属部门", field: "organizationName", width: 100 },
        { headerName: "职位", field: "position", width: 100 },
        {
          headerName: "在职状态",
          field: "stat1",
          width: 100,
          cellRenderer: (parmas) => {
            let backData = "";
            let index = parmas.data.stat1 + "";
            this.onOptions.forEach((item) => {
              if (item.value == index) {
                backData = item.label;
              }
            });
            return backData;
          },
        },
        {
          headerName: "在职详情",
          field: "stat2",
          width: 100,
          cellRenderer: (parmas) => {
            let index = parmas.data.stat2 + "";
            let backData = "";
            this.offOptions.forEach((item) => {
              if (item.value == index) {
                backData = item.label;
              }
            });
            return backData;
          },
        },
      ];
    },
    /**
     * @vuese
     * 初始化导入失败员工信息表格
     */
    initImportFailTable() {
      this.importFailTableOptions = gridOptions({ singleSelection: true });
      // ag-grid数据源配置
      this.importFailTableColumns = [
        {
          headerName: "部门编码",
          field: "deptCode",
          width: 120,
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: false, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: false, //是否只全选过滤数据
        },
        { headerName: "员工工号", field: "personNo", width: 100 },
        { headerName: "姓名", field: "personName", width: 100 },
        { headerName: "性别", field: "sex", width: 100 },
        {
          headerName: "在职状态",
          field: "stat1",
          width: 100,
          cellRenderer: (parmas) => {
            let backData = "";
            let index = parmas.data.stat1 + "";
            this.onOptions.forEach((item) => {
              if (item.value == index) {
                backData = item.label;
              }
            });
            return backData;
          },
        },
        {
          headerName: "在职详情",
          field: "stat2",
          width: 100,
          cellRenderer: (parmas) => {
            let index = parmas.data.stat2 + "";
            let backData = "";
            this.offOptions.forEach((item) => {
              if (item.value == index) {
                backData = item.label;
              }
            });
            return backData;
          },
        },
        { headerName: "开始日期", field: "beginTime", width: 200 },
        { headerName: "职位", field: "position", width: 100 },
        { headerName: "原因", field: "reason", width: 200 },
      ];
    },
    getCurrentMonthFirst() {
      var date = new Date();
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return date.getFullYear() + "-" + month + "-" + day;
    },
    // 获取所有公司
    getCompanyListAll() {
      this.$http
        .getCompanyListAll()
        .then((res) => {
          let { code, rows } = res.data;

          if (code == 1) {
            this.companys = rows;
          } else if (code == 0) {
            let { info } = res.data;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    dataSearch() {
      this.openPanel = false;
      setTimeout(() => {
        this.openPanel = true;
      }, 100);
    },
    // 新增根
    newRoot() {
      this.titleDialog = "新增根目录";
      this.isModifyCategoryDialog = true;
      this.editDataDictionaryVisible = true;
      this.parentCodeShow = false;
      this.dataOrganizationForm = { beginTime: new Date() };
      if (this.$refs.dataOrganizationForm) {
        this.$refs.dataOrganizationForm.resetFields();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data && !data.label) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    },
    /**
     * @vuese
     * 初始化按钮权限
     */
    initAuthBtn() {
      authorize.getBtnAuth(this.name, this.btnStatus);
    },
    searchCompany(node, resolve) {
      // if (this.deptSelectTime && this.deptSelectTime.length > 0) {
      //     beginSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.deptSelectTime[0]);
      //     endSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.deptSelectTime[1]);
      // }
      if (!this.deptBeginTime || !this.deptEndTime) {
        this.$alert("开始时间和结束时间不能为空！", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      if (
        this.deptBeginTime &&
        this.deptEndTime &&
        this.deptEndTime < this.deptBeginTime
      ) {
        this.$alert("开始时间不能大于结束时间", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }

      //this.loading = true;
      this.$http
        .getOrganizationList({
          entity: {
            beginTime: this.deptBeginTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.deptBeginTime
                )
              : null,
            endTime: this.deptEndTime
              ? this.$utils.dateFormat("yyyy-MM-dd hh:mm:ss", this.deptEndTime)
              : null,
            organizationCode: this.compName,
            parentCode: "00000000",
            // parentCode: node === undefined ? "00000000" : node.data.organizationCode,
          },
        })
        .then((res) => {
          this.loading = false;
          let { code, rows } = res.data;
          if (code == 1) {
            if (node !== undefined && resolve !== undefined) {
              resolve(res.data.rows);
            } else {
              this.categoryData = res.data.rows;
            }
          } else if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    deptSearch(node, resolve) {
      // if(!this.deptSelectTime || this.deptSelectTime.length <= 0){
      //     this.$alert('请选择开始日期和结束日期', {
      //         showClose: false,
      //         confirmButtonText: "确定",
      //         customClass: "alertFailure"
      //     });
      //     return
      // }
      if (!this.deptBeginTime || !this.deptEndTime) {
        this.$alert("开始时间和结束时间不能为空！", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      if (
        this.deptBeginTime &&
        this.deptEndTime &&
        this.deptEndTime < this.deptBeginTime
      ) {
        this.$alert("开始时间不能大于结束时间", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      if (!node) {
        return;
      }
      let orgCode = null;
      // if(!node.data){
      //     return
      // }
      if (node && !node.data.organizationCode) {
        orgCode = "00000000";
      }
      let beginSelectTime = "";
      let endSelectTime = "";
      // if (this.deptSelectTime && this.deptSelectTime.length > 0) {
      //     beginSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.deptSelectTime[0]);
      //     endSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.deptSelectTime[1]);
      // }
      console.log("node", node);
      this.$http
        .getOrganizationList({
          entity: {
            beginTime: this.deptBeginTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.deptBeginTime
                )
              : null,
            endTime: this.deptEndTime
              ? this.$utils.dateFormat("yyyy-MM-dd hh:mm:ss", this.deptEndTime)
              : null,
            id: node.data.id,
            organizationCode:
              orgCode == "00000000" ? null : node.data.organizationCode,
            parentCode: orgCode == "00000000" ? orgCode : null, //node === undefined ? "00000000" : null,
            //                            organizationCode: node.data.organizationCode // 取 conpanyCode
          },
        })
        .then((res) => {
          let { code } = res.data;
          if (code == 1) {
            if (node !== undefined && resolve !== undefined) {
              resolve(res.data.rows);
            } else {
              this.categoryData = res.data.rows;
            }
          } else if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    chooseSearchCompany(node, resolve) {
      let beginSelectTime = this.$utils.dateFormat(
        "yyyy-MM-dd hh:mm:ss",
        new Date()
      );
      let endSelectTime = this.$utils.dateFormat(
        "yyyy-MM-dd hh:mm:ss",
        new Date()
      );
      this.loading = true;
      this.$http
        .getOrganizationList({
          entity: {
            beginTime: beginSelectTime,
            endTime: endSelectTime,
            organizationCode: this.compName,
            parentCode: "00000000",
            // parentCode: node === undefined ? "00000000" : node.data.organizationCode,
          },
        })
        .then((res) => {
          this.loading = false;
          let { code, rows } = res.data;
          if (code == 1) {
            if (node !== undefined && resolve !== undefined) {
              resolve(res.data.rows);
            } else {
              this.categorySelectData = res.data.rows;
            }
          } else if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    chooseDeptSearch(node, resolve) {
      if (!node) {
        return;
      }
      let orgCode = null;
      // if(!node.data){
      //     return
      // }
      if (node && !node.data.organizationCode) {
        orgCode = "00000000";
      }
      let beginSelectTime = this.$utils.dateFormat(
        "yyyy-MM-dd hh:mm:ss",
        new Date()
      );
      let endSelectTime = this.$utils.dateFormat(
        "yyyy-MM-dd hh:mm:ss",
        new Date()
      );
      this.loading = true;
      this.$http
        .getOrganizationList({
          entity: {
            beginTime: beginSelectTime,
            endTime: endSelectTime,
            organizationCode:
              orgCode == "00000000" ? null : node.data.organizationCode,
            parentCode: orgCode == "00000000" ? orgCode : null, //node === undefined ? "00000000" : null,
            //                            organizationCode: node.data.organizationCode // 取 conpanyCode
          },
        })
        .then((res) => {
          this.loading = false;
          let { code } = res.data;
          if (code == 1) {
            if (node !== undefined && resolve !== undefined) {
              resolve(res.data.rows);
            } else {
              this.categorySelectData = res.data.rows;
            }
          } else if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    newButton() {
      this.parentCodeShow = true;
      this.editDataDictionaryVisible = true;
      this.dataOrganizationForm = { beginTime: new Date() };
    },
    handleNodeClick(data) {
      let parent = this.$refs.categoryDataTree.getNode(data).key;
      this.selectNode = data;
      this.categoryCode = data.code;
      this.categoryName = data.label;
      this.currentParentCode = parent;
      //this.parentCode = !parent ? data.code : null
      this.orgId = data.id;
      this.organizationCode = data.organizationCode;
      this.currentPage = 1;
      this.getPersonData();
    },

    // 编辑 12300
    editCategory(node, row) {
      this.titleDialog = "编辑部门";
      this.isModifyCategoryDialog = false;
      this.ifEdit = true;
      this.ifShowOrg = false;
      if (node.level == 1) {
        this.parentCodeShow = false;
      } else {
        this.parentCodeShow = true;
      }
      this.editDataDictionaryVisible = true;
      if (this.$refs.dataOrganizationForm) {
        this.$refs.dataOrganizationForm.resetFields();
      }
      let item = {};
      item.id = row.id;
      item.organizationCode = row.organizationCode;
      item.organizationName = row.organizationName;
      item.beginTime = row.beginTime;
      item.endTime = row.endTime;
      // 拿到父级节点的code跟label   上级部门要做回显就要拿到负极的code跟label
      item.parentCode = node.parent.key;
      item.organizationParentCode = [];
      item.organizationParentName = node.parent.data.organizationName;
      this.dataOrganizationForm = item;
      this.organizationParentName = "";
      this.getTreeNode(node.parent);
      this.organizationParentName = this.organizationParentName.substr(
        0,
        this.organizationParentName.length - 1
      );
    },
    getTreeNode(node) {
      if (node) {
        if (node.data.organizationCode != "00000000") {
          if (node.data.organizationCode) {
            // this.deptSearch(node)
            this.organizationParentName =
              node.data.organizationName + "/" + this.organizationParentName;
            this.dataOrganizationForm.organizationParentCode.unshift(
              node.data.organizationCode
            );
          }
          this.getTreeNode(node.parent);
        }
      }
    },
    // 新增子项目
    newChildren(node, row) {
      this.titleDialog = "增加子项";
      this.parentCodeShow = true;
      this.ifEdit = false;
      this.editDataDictionaryVisible = true;
      if (this.$refs.dataOrganizationForm) {
        this.$refs.dataOrganizationForm.resetFields();
      }
      this.dataOrganizationForm = {
        beginTime: new Date(),
      };
      this.dataOrganizationForm.parentCode = row.parentCode;
      this.dataOrganizationForm.organizationParentCode = row.organizationCode;
      console.log(1112, this.dataOrganizationForm);
      // this.dataOrganizationForm.parentCode = row.code;
      // this.dataOrganizationForm.organizationParentCode = row.code;
    },
    editDataDictionaryClose() {
      this.editDataDictionaryVisible = false;
    },
    changeOrgParentCode(val) {
      console.log("ddd", val);
    },
    saveOrEditDictionaryCategory() {
      //  创建人id和名字
      if (this.dataOrganizationForm.organizationParentCode instanceof Array) {
        this.dataOrganizationForm.organizationParentCode.forEach((item) => {
          this.dataOrganizationForm.parentCode = item;
        });
      } else {
        this.dataOrganizationForm.parentCode =
          this.dataOrganizationForm.organizationParentCode;
      }
      this.$refs["dataOrganizationForm"].validate((valid) => {
        if (valid) {
          this.dataOrganizationForm.beginTime = this.$utils.dateFormat(
            "yyyy-MM-dd hh:mm:ss",
            this.dataOrganizationForm.beginTime
          );
          if (this.dataOrganizationForm.endTime) {
            this.dataOrganizationForm.endTime = this.$utils.dateFormat(
              "yyyy-MM-dd hh:mm:ss",
              this.dataOrganizationForm.endTime
            );
          }

          if (this.dataOrganizationForm.id == null) {
            this.saveOrganization();
          } else {
            this.updaetOrganization();
          }
        } else {
          return false;
        }
      });
    },
    // 保存部门表单
    saveOrganization() {
      this.saveLoading = true;
      this.$http
        .saveOrganization(this.dataOrganizationForm)
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
          if (code == 1) {
            this.searchCompany();
            this.$message({
              type: "success",
              message: "新增成功",
            });
            this.editDataDictionaryVisible = false;
            this.saveLoading = false;
            this.loading = false;
            this.getCategoryTreeList();
            // this.deptSearch();
            this.dataSearch();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.saveLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },

    updaetOrganization() {
      this.saveLoading = true;
      this.$http
        .updateOrganization(this.dataOrganizationForm)
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
          if (code == 1) {
            this.searchCompany();
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.editDataDictionaryVisible = false;
            this.saveLoading = false;
            this.loading = false;
            this.getCategoryTreeList();
            // this.deptSearch();
            this.dataSearch();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.saveLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    // 删除部门
    deleteChildren(node, row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.deleteOrganizationById(row.id);
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    deleleButton() {
      let ids = this.$refs.categoryDataTree.getCheckedKeys();
      let parent = this.$refs.categoryDataTree.getCheckedNodes();
      if (parent[0].children) {
        this.$alert("公司节点不可删除", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      if (!ids || ids.length <= 0) {
        this.$alert("请选择需要删除的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      } else if (ids.length > 1) {
        this.$alert("只能选择一行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      } else {
        this.$confirm("此操作将永久删除该分类, 是否继续?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.deleteOrganizationById(ids[0]);
          })
          .catch(() => {
            this.$message({ type: "info", message: "已取消删除" });
          });
      }
    },
    // 删除接口
    deleteOrganizationById(ids) {
      this.saveLoading = true;
      this.$http
        .deleteOrganizationById({ id: ids })
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
          if (code == 1) {
            this.searchCompany();
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.editDataDictionaryVisible = false;
            this.saveLoading = false;
            this.loading = false;
            this.getCategoryTreeList();
            this.deptSearch();
            this.dataSearch();
          }
        })
        .catch((err) => {
          // callback(err, 0);
        });
    },
    /**
     * @vuese
     * 获取选择的行数据
     */
    getSelectedRow() {
      /**
       * 3.获取选择的行数据
       * api.getSelectedRows() 返回当前选择的行数组
       */
      let rows = this.gridOptions.api.getSelectedRows();
      console.log("rows", rows);
      return rows;
    },
    search() {
      if (this.changed) {
        this.currentPage = 1;
        this.changed = false;
      }
      //this.currentPage = 1
      this.getPersonData();
    },
    /**
     * @vuese
     * 清空表单数据
     */
    clearpersonForm() {
      // if(this.$refs.personForm){
      //     this.$refs.personForm.resetFields();
      // }
      this.categoryCode = "";
      this.personVisible = false;
      this.personForm = { deptCode: "", personName: "", sex: "" };
      this.dialogloading = false;
      this.saveLoading = false;
      this.loading = false;
    },
    getPersonData() {
      /**
       * 4.配置表格数据
       */
      let beginSelectTime = "";
      let endSelectTime = "";
      // if (this.personSelectTime && this.personSelectTime.length > 0) {
      //     beginSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.personSelectTime[0]);
      //     endSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.personSelectTime[1]);
      // } personBeginTime
      if (!this.personBeginTime || !this.personEndTime) {
        this.$alert("开始时间和结束时间不能为空！", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      if (
        this.personBeginTime &&
        this.personEndTime &&
        this.personEndTime < this.personBeginTime
      ) {
        this.$alert("开始时间不能大于结束时间", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      this.loading = true;
      this.$http
        .getPeronList({
          current: this.currentPage,
          size: this.pageSize,
          entity: {
            orgId: this.orgId,
            parentCode: this.parentCode,
            personName: this.searchName,
            organizationCode: this.organizationCode,
            beginTime: this.personBeginTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.personBeginTime
                )
              : null,
            endTime: this.personEndTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.personEndTime
                )
              : null,
            stat2: this.stat2,
          },
        })
        .then((res) => {
          this.loading = false;
          let { code, total, rows } = res.data;
          if (code == 1) {
            if (rows.records && rows.records.length > 0) {
              this.rowData = rows.records.map((item) => ({
                ...item,
                beginTimeStr: item.beginTime
                  ? this.$utils.dateFormat("yyyy-MM-dd", item.beginTime)
                  : "",
                endTimeStr: item.endTime
                  ? this.$utils.dateFormat("yyyy-MM-dd", item.endTime)
                  : "",
              }));
            } else {
              this.rowData = [];
            }
            this.total = rows.total;
          } else if (code == 0) {
            let { info } = res.data;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    add() {
      this.ifPerEdit = false;
      this.ifPerShowOrg = true;
      this.personForm.sex = "男";
      this.personForm.categoryCode = this.categoryCode;
      if (this.organizationCode) {
        this.personVisible = true;
      } else {
        this.$alert("请选择部门", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      }
    },
    /**
     * @vuese
     * 引入
     */
    introduce() {
      this.introduceFormVisible = true;
      this.$nextTick(() => {
        this.$refs["introduceForm"].resetFields();
      });
    },
    /**
     * @vuese
     * 下载导入模板
     */
    downloadImportTemplate() {
      axios
        .get("static/员工导入模板.xlsx", { responseType: "blob" })
        .then((res) => {
          const _url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          let fname = "员工导入模板.xlsx";
          link.href = _url;
          link.setAttribute("download", fname);
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch(() => {
          this.$alert("下载模板失败", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
        });
    },
    /**
     * @vuese
     * 导入前
     */
    beforeImportPersonnel(file) {
      this.readExcel(file).then((data) => {
        if (data[0].json.length === 0) {
          this.$alert("Excel中没有数据", {
            showClose: false,
            confirmButtonText: "确定",
            customClass: "alertPrompt",
          });
        } else {
          const newExcelData = this.handlePersonnelExcelData(data[0].json);
          this.addPersonBatch(newExcelData);
        }
      });
    },
    /**
     * @vuese
     * 导入
     */
    importPersonnel(data) {
      this.readExcel(data.file);
    },
    /**
     * @vuese
     * 读取Excel文件，返回json
     */
    readExcel(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          const data = event.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const workbookArr = [];
          workbook.SheetNames.forEach(function (sheetName) {
            const _json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              defval: "",
            });
            workbookArr.push({
              name: sheetName,
              json: _json,
            });
          });
          resolve(workbookArr);
        };
        fileReader.onerror = function (event) {
          reject(event);
        };
        // 读取上传文件为二进制
        fileReader.readAsBinaryString(file);
      });
    },
    /**
     * @vuese
     * 处理员工批量导入模板的数据
     */
    handlePersonnelExcelData(data) {
      const personnelExcelColumn = [
        {
          field: "deptCode",
          headerName: "部门编码",
        },
        {
          field: "personNo",
          headerName: "员工工号",
        },
        {
          field: "personName",
          headerName: "姓名",
        },
        {
          field: "sex",
          headerName: "性别",
        },
        {
          field: "stat1",
          headerName: "在职状态",
        },
        {
          field: "stat2",
          headerName: "在职详情",
        },
        {
          field: "beginTime",
          headerName: "开始日期",
        },
        {
          field: "position",
          headerName: "职位",
        },
      ];
      const userData = this.$utils.getStorage("userData").user;
      const newJson = data.map((item) => {
        const newItem = {
          createId: userData.id,
          creator: userData.employeeName,
          updateBy: userData.id,
          updator: userData.employeeName,
        };
        for (const key in item) {
          const findColumnItem = personnelExcelColumn.find(
            (columnItem) => columnItem.headerName === key
          );
          if (findColumnItem) {
            if (findColumnItem.field === "stat1") {
              const findOptionItem = this.onOptions.find(
                (optionItem) => optionItem.label === item[key]
              );
              newItem[findColumnItem.field] = findOptionItem
                ? findOptionItem.value
                : "";
            } else if (findColumnItem.field === "stat2") {
              const findOptionItem = this.offOptions.find(
                (optionItem) => optionItem.label === item[key]
              );
              newItem[findColumnItem.field] = findOptionItem
                ? findOptionItem.value
                : "";
            } else if (findColumnItem.field === "beginTime") {
              newItem[findColumnItem.field] = item[key]
                ? `${this.$utils.dateFormat("yyyy-MM-dd", item[key])} 00:00:00`
                : "";
            } else {
              newItem[findColumnItem.field] = item[key];
            }
          } else {
            newItem[key] = item[key];
          }
        }
        return newItem;
      });
      return newJson;
    },
    /**
     * @vuese
     * 批量添加员工 api
     */
    addPersonBatch(excelData) {
      this.importing = true;
      this.$http
        .addPersonBatch(excelData)
        .then((res) => {
          this.importing = false;
          const { code, info, rows } = res.data;
          if (code === 0) {
            this.$message({
              type: "warning",
              message: info,
            });
          } else if (code === 1) {
            this.$message({
              type: "success",
              message: info,
            });
            this.search();
            let newRows = rows || [];
            newRows = newRows.map((item) => ({
              ...item,
              beginTime: item.beginTime
                ? this.$utils.dateFormat("yyyy-MM-dd", item.beginTime)
                : "",
            }));
            this.importFailList = newRows;
            if (rows && rows.length > 0) {
              this.importFailDialogVisible = true;
              this.initImportFailTable();
            }
          }
        })
        .catch((err) => {
          this.importing = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 导入失败的对话框 关闭事件
     */
    importFailDialogClose() {
      this.$confirm("确认关闭？")
        .then(() => {
          this.importFailDialogVisible = false;
        })
        .catch(() => {});
    },
    /**
     * @vuese
     * 导出失败的员工列表
     */
    exportFailList() {
      this.exportingFailList = true;
      const dataList = [];
      const sheetHeader = [
        "部门编码",
        "员工工号",
        "姓名",
        "性别",
        "在职状态",
        "在职详情",
        "开始日期",
        "职位",
      ];
      this.importFailList.map((item) => {
        const findStat1 = this.onOptions.find((i) => i.value == item.stat1);
        const findStat2 = this.offOptions.find((i) => i.value == item.stat2);
        dataList.push({
          部门编码: item.deptCode,
          员工工号: item.personNo,
          姓名: item.personName,
          性别: item.sex,
          在职状态: findStat1 ? findStat1.label : "",
          在职详情: findStat2 ? findStat2.label : "",
          开始日期: item.beginTime,
          职位: item.position,
        });
      });
      this.$utils.exportExcel({
        data: dataList,
        sheetHeader,
        fileName: "员工信息.xlsx",
      });
      this.exportingFailList = false;
    },
    /**
     * @vuese
     * 引入员工 对话框 关闭事件
     */
    introduceFormClose() {
      this.introduceFormVisible = false;
    },
    /**
     * @vuese
     * 引入员工 对话框 确认事件
     */
    introduceFormConfirm() {
      const userData = this.$utils.getStorage("userData").user;
      const _introduceForm = {
        createId: userData.id,
        creator: userData.employeeName,
        updateBy: userData.id,
        updator: userData.employeeName,
        ...this.introduceForm,
      };
      this.$refs["introduceForm"].validate((valid) => {
        if (valid) {
          this.addMdmPerson(_introduceForm).then(() => {
            this.introduceFormClose();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @vuese
     * 引入员工 api
     */
    addMdmPerson(data) {
      this.introduceFormSubmitting = true;
      return new Promise((resolve) => {
        this.$http
          .addMdmPerson(data)
          .then((res) => {
            this.introduceFormSubmitting = false;
            const { code, info } = res.data;
            if (code == 0) {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            } else if (code == 1) {
              this.$message({
                type: "success",
                message: "引入成功",
              });
              this.search();
              resolve();
            }
          })
          .catch((err) => {
            this.introduceFormSubmitting = false;
            if (err.response && err.response.data.code === 0) {
              this.$message.error(err.response.data.info);
            }
          });
      });
    },
    edit() {
      this.dictionaryTitle = "编辑人员信息";
      let s = this.getSelectedRow();
      if (s.length != 1) {
        this.$alert("只能选择一行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      } else {
        let id = s[0].id;
        this.ifPerEdit = true;
        this.ifPerShowOrg = false;
        var item = s[0];
        item.categoryCode = item.deptCode;
        var _item = JSON.parse(JSON.stringify(item));
        this.personForm = _item;
        console.log("!23", this.personForm);
        console.log("!ggg", _item);
        this.personVisible = true;
        this.organizationParentName = item.organizationName;
      }
    },
    changeDeptCode(val) {
      if (val && val.length > 0) {
        this.personForm.deptCode = val.slice(-1)[0];
        this.saveDeptCode = this.personForm.deptCode;
      }
    },
    del() {
      let s = this.getSelectedRow();
      if (s.length > 1) {
        this.$alert("只能选择一行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      } else if (s.length < 1) {
        this.$alert("请选择需要删除的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
      } else {
        let id = s[0].id;
        this.$confirm("此操作将永久删除该员工, 是否继续?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.delPersonById(id);
          })
          .catch(() => {
            this.$message({ type: "info", message: "已取消删除" });
          });
      }
    },
    delPersonById(id) {
      this.saveLoading = true;
      this.currentPage = 1;
      this.$http
        .delPersonById({ id })
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          } else if (code == 1) {
            this.saveLoading = false;
            this.search();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.saveLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    personClose() {
      this.clearpersonForm();
      this.personVisible = false;
    },
    savePerson() {
      let userData = this.$utils.getStorage("userData").user;
      this.personForm.createId = userData.id;
      this.personForm.creator = userData.employeeName;
      this.personForm.updateBy = userData.id;
      this.personForm.updator = userData.employeeName;
      //                this.personForm.deptCode = this.personForm.categoryCode
      this.personForm.deptCode = this.organizationCode;
      if (this.saveDeptCode != null && this.saveDeptCode.length > 0) {
        this.personForm.deptCode = this.saveDeptCode;
      }
      console.log("this.personForm", this.personForm);
      this.$refs["personForm"].validate((valid) => {
        if (valid) {
          console.log(this.personForm);
          if (!this.ifPerEdit) {
            // 新增
            this.addPerson();
          } else {
            // 编辑
            this.updatePerson();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 新增员工
    addPerson() {
      this.saveLoading = true;
      this.personForm.deptCode = this.organizationCode;
      if (this.saveDeptCode != null && this.saveDeptCode.length > 0) {
        this.personForm.deptCode = this.saveDeptCode;
      }
      // this.personForm.companyCode = this.currentParentCode
      if (this.personForm.beginTime) {
        this.personForm.beginTime = this.$utils.dateFormat(
          "yyyy-MM-dd hh:mm:ss",
          this.personForm.beginTime
        );
      }
      this.$http
        .savePerson(this.personForm)
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          } else if (code == 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            this.search();
            this.clearpersonForm();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.saveLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },

    getExportExcelData() {
      /**
       * 4.配置表格数据
       */
      let beginSelectTime = "";
      let endSelectTime = "";
      // if (this.personSelectTime && this.personSelectTime.length > 0) {
      //     beginSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.personSelectTime[0]);
      //     endSelectTime = this.$utils.dateFormat('yyyy-MM-dd hh:mm:ss', this.personSelectTime[1]);
      // }
      if (!this.personBeginTime || !this.personEndTime) {
        this.$alert("开始时间和结束时间不能为空！", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      if (
        this.personBeginTime &&
        this.personEndTime &&
        this.personEndTime < this.personBeginTime
      ) {
        this.$alert("开始时间不能大于结束时间", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertFailure",
        });
        return;
      }
      this.exportExcelLoading = true;
      this.$http
        .getPeronList({
          current: 1,
          size: 1000000,
          entity: {
            orgId: this.orgId,
            parentCode: this.parentCode,
            personName: this.searchName,
            organizationCode: this.organizationCode,
            beginTime: this.personBeginTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.personBeginTime
                )
              : null,
            endTime: this.personEndTime
              ? this.$utils.dateFormat(
                  "yyyy-MM-dd hh:mm:ss",
                  this.personEndTime
                )
              : null,
            stat2: this.stat2,
          },
        })
        .then((res) => {
          this.exportExcelLoading = false;
          let { code, total, rows } = res.data;
          if (code == 1) {
            if (rows.records && rows.records.length > 0) {
              this.exportExcelData = rows.records;
            }
            this.exportExcel();
          } else if (code == 0) {
            let { info } = res.data;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((err) => {
          this.exportExcelLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    /**
     * @数据导出
     */
    exportExcel() {
      // this.$utils.exportExcel({data:[{a:"123"}],sheetHeader:['测试'],fileName:'分公司管理.xlsx'})
      let dataList = [];
      let sheetHeader = [
        "工号",
        "姓名",
        "开始日期",
        "结束日期",
        "所属公司",
        "所属部门",
        "职位",
        "在职状态",
        "在职详情",
      ];
      this.exportExcelData.map((item) => {
        // let index1 = item.stat1 !== null ? Number(item.stat1) : '';
        // let index2 = item.stat2 !== null ? Number(item.stat2) : '';
        dataList.push({
          工号: item.personNo,
          姓名: item.personName,
          开始日期: this.$utils.dateFormat("yyyy-MM-dd", item.beginTime),
          结束日期: this.$utils.dateFormat("yyyy-MM-dd", item.endTime),
          所属公司: item.companyName,
          所属部门: item.organizationName,
          职位: item.position,
          在职状态: this.onOptions.find((i) => i.value == item.stat1).label,
          在职详情: this.offOptions.find((i) => i.value == item.stat2).label,
        });
      });
      this.$utils.exportExcel({
        data: dataList,
        sheetHeader,
        fileName: "员工信息报表.xlsx",
      });
    },
    // 修改人员信息
    updatePerson() {
      this.saveLoading = true;
      if (this.personForm.beginTime) {
        this.personForm.beginTime = this.$utils.dateFormat(
          "yyyy-MM-dd hh:mm:ss",
          this.personForm.beginTime
        );
      }
      if (this.saveDeptCode != null && this.saveDeptCode.length > 0) {
        this.personForm.deptCode = this.saveDeptCode;
      }
      this.$http
        .updatePerson(this.personForm)
        .then((res) => {
          let { code } = res.data;
          if (code == 0) {
            let { info } = res.data;
            this.loading = false;
            this.saveLoading = false;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          } else if (code == 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.search();
            this.clearpersonForm();
          }
        })
        .catch((err) => {
          this.loading = false;
          this.saveLoading = false;
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
          }
        });
    },
    // 分页
    handleSizeChange(val) {
      //更改每页记录条数
      this.currentPage = 1;
      this.pageSize = val;
      this.getPersonData();
    },
    handleCurrentChange(val) {
      //切换页码
      this.currentPage = val;
      this.getPersonData();
    },
  },
};
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /*padding-right: 8px;*/
}

.m-rightContent {
  left: 600px;
}
.upload-btn {
  /deep/ .el-upload {
    width: 100%;
  }
}
</style>
