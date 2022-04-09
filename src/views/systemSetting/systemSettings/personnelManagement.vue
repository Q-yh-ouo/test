<template>
  <div class="m-window m-personnelManagement">
    <!-- 工具栏 -->
    <div class="m-toolbar">
      <el-form ref="searchForm" :model="searchForm" label-width="0px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="" prop="name">
              <el-input
                v-model.trim="searchForm.name"
                type="text"
                placeholder="员工姓名 / 工号 / 公司 / 部门 / 二级部门"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="18" :push="2">
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
              <el-col :span="4">
                <el-button type="primary" @click="authorize(0)">
                  管辖部门授权
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="authorize(1)">
                  汇总部门授权
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="warrant()">
                  部门模板授权
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary">
                  <a
                    href="http://fastmarket.oss-cn-shenzhen.aliyuncs.com/test/%E5%91%98%E5%B7%A5%E4%BF%A1%E6%81%AF%E6%A8%A1%E6%9D%BF.xlsx"
                    download=""
                    style="color: #fff; text-decoration: none"
                    >下载导入模板</a
                  >
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-upload
                  :action="''"
                  :multiple="false"
                  :show-file-list="false"
                  :before-upload="beforeImportPersonnel"
                  :http-request="importPersonnel"
                  :file-list="[]"
                  class="upload-btn"
                >
                  <el-button type="primary">导入</el-button>
                </el-upload>
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
    <!-- 新增、编辑人员信息 对话框 -->
    <el-dialog
      :title="personnelFormDialogTitle"
      :visible.sync="personnelFormDialogVisible"
      :before-close="personnelFormDialogBeforeClose"
      :close-on-click-modal="false"
      v-dialogDrag
      width="70%"
    >
      <el-form
        ref="personnelForm"
        :model="personnelForm"
        :rules="personnelFormRules"
        label-width="180px"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="员工工号" prop="sapNum">
              <el-input
                v-model.trim="personnelForm.sapNum"
                :disabled="operationFlag === 'edit' || multipleSelection"
                type="number"
                placeholder="请输入员工工号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model.trim="personnelForm.name"
                type="text"
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工类型" prop="type">
              <el-select
                v-model="personnelForm.type"
                filterable
                clearable
                placeholder="请输入员工类型"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司" prop="companyId">
              <el-select
                v-model="personnelForm.companyId"
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
          <el-col :span="12">
            <el-form-item label="部门" prop="deptmentId">
              <el-select
                v-model="personnelForm.deptmentId"
                :loading="departmentOptionsLoading"
                filterable
                clearable
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级部门" prop="subdivisionsDeptId">
              <el-select
                v-model="personnelForm.subdivisionsDeptId"
                :loading="departmentOptionsLoading2"
                filterable
                clearable
                placeholder="请选择二级部门"
              >
                <el-option
                  v-for="item in departmentOptions2"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准工资" prop="standardWage">
              <el-input
                v-model.trim="personnelForm.standardWage"
                type="number"
                placeholder="请输入标准工资"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有管辖部门权限" prop="authorityDept">
              <el-switch
                v-model="personnelForm.authorityDept"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有汇总部门权限" prop="summaryDept">
              <el-switch
                v-model="personnelForm.summaryDept"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否使用员工考核表" prop="isEmployeeTable">
              <el-switch
                v-model="personnelForm.isEmployeeTable"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否合并评分" prop="isMerge">
              <el-switch
                v-model="personnelForm.isMerge"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否评分不限制" prop="isScore">
              <el-switch
                v-model="personnelForm.isScore"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分节点1人员" prop="managerName">
              <el-select
                v-model="personnelForm.managerName"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                ref="managerSapNum"
                placeholder="请选择人员"
                @focus="showScorePerson(1, 'managerSapNum', 'managerName')"
              >
                <!--  
<el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.sapNum"
                />

                -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分节点2人员" prop="managerName2">
              <el-select
                v-model="personnelForm.managerName2"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                ref="managerSapNum2"
                placeholder="请选择人员"
                @focus="showScorePerson(2, 'managerSapNum2', 'managerName2')"
              >
                <!--
                  <el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.sapNum"
                />
                -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分节点3人员" prop="managerName3">
              <el-select
                v-model="personnelForm.managerName3"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                ref="managerSapNum3"
                placeholder="请选择人员"
                @focus="showScorePerson(3, 'managerSapNum3', 'managerName3')"
              >
                <!--
                  <el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.sapNum"
                />
                -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评分人" prop="raterName">
              <el-select
                v-model="personnelForm.raterName"
                :loading="personnelOptionsLoading"
                filterable
                clearable
                ref="rater"
                placeholder="请选择人员"
                @focus="showScorePerson(4, 'rater', 'raterName')"
              >
                <!--
                  <el-option
                  v-for="item in personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.sapNum"
                />
                -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePersonnelFormDialog(true)">取消</el-button>
        <el-button
          :loading="personnelFormSubmitting"
          type="primary"
          @click="onConfirmPersonnelForm()"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <!-- /新增、编辑人员信息 对话框 -->
    <!-- 人员信息选择弹框 -->
    <el-dialog
      :title="scorePersonTitle"
      :visible.sync="showScorePersonDialog"
      width="50%"
      :before-close="scorePersonClose"
    >
      <div class="el-dialog-div">
        <div class="m-toolbar" style="margin-bottom: 20px">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-input
                v-model.trim="scorePersonSearchName"
                type="text"
                placeholder="员工姓名"
                clearable
              />
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="scorePersonCompanyId"
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
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="scorePersonDeptmentId"
                :loading="departmentOptionsLoading"
                filterable
                clearable
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="10" :push="2">
              <el-row :gutter="10" type="flex" justify="end">
                <el-col :span="8">
                  <el-button
                    :loading="scorePersonLoading"
                    type="primary"
                    @click="findScorePerson()"
                  >
                    查询
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click="commitScorePerson()">
                    确认
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="m-agTable m-bottom">
          <ag-grid-vue
            v-loading="scorePersonLoading"
            :gridOptions="scorePersonOptions"
            :columnDefs="scorePersonColumns"
            :rowData="scorePersonData"
            class="m-agTableContent ag-theme-balham"
          />
        </div>
        <!-- /主表格 -->
        <!-- 分页 -->
        <div class="m-page">
          <el-pagination
            :current-page="scorePersonCurrentPage"
            :page-size="scorePersonPageSize"
            :total="scorePersonTotal"
            :page-sizes="tableSizeList"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleScorePersonSizeChange"
            @current-change="handleScorePersonCurrentChange"
          />
        </div>
        <!-- /分页 -->
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 授权弹框 -->
    <el-dialog
      title="请选择授权模板"
      :visible.sync="warrantDialogVisible"
      width="50%"
      custom-class="menu-dialog-height"
      :before-close="warrantHandleClose"
    >
      <el-form
        :model="warrantForm"
        ref="warrantForm"
        label-width="100px"
        :rules="warrantFormRules"
        class="demo-ruleForm"
      >
        <el-form-item label="模板" prop="templateId">
          <el-select v-model="warrantForm.templateId" placeholder="请选择">
            <el-option
              v-for="item in warrantOptions"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warrantDialogVisibleClose">取 消</el-button>
        <el-button type="primary" @click="warrantCommit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 公司,部门弹框 -->
    <el-dialog
      :title="authorizeTitle"
      :visible.sync="authorizeDialog"
      width="50%"
      custom-class="menu-dialog-height"
      :before-close="authorizeClose"
    >
      <div class="el-dialog-div">
        <div class="m-toolbar" style="margin-bottom: 20px">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-select
                v-model="authorizeCompanyId"
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
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="authorizeDeptmentId"
                :loading="departmentOptionsLoading"
                filterable
                clearable
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="10" :push="6">
              <el-row :gutter="10" type="flex" justify="end">
                <el-col :span="8">
                  <el-button type="primary" @click="getDeptmentList()">
                    查询
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click="commitAuthorize()">
                    确认
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="m-agTable m-bottom">
          <ag-grid-vue
            v-loading="authorizeLoading"
            :gridOptions="authorizeOptions"
            :columnDefs="authorizeColumns"
            :rowData="authorizeData"
            class="m-agTableContent ag-theme-balham"
          />
        </div>
        <!-- /主表格 -->
        <!-- 分页 -->
        <div class="m-page">
          <el-pagination
            :current-page="authorizeCurrentPage"
            :page-size="authorizePageSize"
            :total="authorizeTotal"
            :page-sizes="tableSizeList"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleAuthorizeSizeChange"
            @current-change="handleAuthorizeCurrentChange"
          />
        </div>
        <!-- /分页 -->
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>
<script>
import authorize from "@/public/authorize";
import gridOptions from "lesso-common/public/gridOptions";
import XLSX from "xlsx";
import EvenBus from "@/public/evenBus";
import Vue from "vue";
import { TABS_CHANGE } from "@/public/evenbusConstant";

let key_deptmentId = null;
// 人员信息表单校验规则
const personnelFormRules = {
  sapNum: [
    {
      required: true,
      trigger: "blur",
      message: "请输入员工工号",
    },
  ],
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入员工姓名",
    },
  ],
  type: [
    {
      required: true,
      trigger: "blur",
      message: "请输入员工类型",
    },
  ],
  companyId: [
    {
      required: true,
      trigger: "change",
      message: "请选择公司",
    },
  ],
  deptmentId: [
    {
      required: true,
      trigger: "change",
      message: "请选择部门",
    },
  ],
  standardWage: [
    {
      required: true,
      trigger: "blur",
      message: "请输入标准工资",
    },
  ],
};
// 主表格选中行数据，点击“编辑”操作按钮时保存的选中行数据
let mainTableSelectedRow = null;
// 是否监听选择
let isWatchSelect = true;
const warrantFormRules = {
  templateId: [
    {
      required: true,
      trigger: "blur",
      message: "请选择模板",
    },
  ],
};
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
  name: "personnelManagement",
  // 依赖组件
  components: {},
  // 接口（组件的接口）
  props: {},
  // 响应式数据
  data() {
    return {
      // 人员信息选择弹框搜索条件
      warrantFormRules,
      authorizeType: null,
      scorePersonSearchName: "",
      authorizeTitle: "",
      authorizeCompanyId: null,
      authorizeDeptmentId: null,
      authorizeDialog: false,
      // 人员信息选择弹框搜索条件
      scorePersonCompanyId: null,
      operatingData: null,
      // 人员信息选择弹框搜索条件
      scorePersonDeptmentId: "",
      // 人员信息选择弹框显示隐藏
      operatingDataName: null,
      showScorePersonDialog: false,
      // 人员信息选择弹框标题
      warrantDialogVisible: false,
      warrantForm: {},
      warrantOptions: [],
      scorePersonTitle: "",
      btnStatus: {},
      // 是否多选修改
      multipleSelection: false,
      // 多选的员工工号数组
      multipleSelectionList: [],

      // 多选的员工工号字符串拼接形式
      multipleSelectionStr: "",
      name: "personnelManagement",
      typeOptions: [
        {
          companyName: "干部",
          companyCode: 0,
        },
        {
          companyName: "员工",
          companyCode: 1,
        },
      ],
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
        name: "", // 员工名称
        state: false, // 是否显示停用
      },
      /**
       * @vuese
       * 表格分页大小选项
       */
      tableSizeList: [30, 50, 100, 150, 200],
      /**
       * @vuese
       * 人员选择表格 ag-grid 相关数据
       */
      scorePersonLoading: false, // 加载状态
      scorePersonOptions: {}, // ag-grid配置
      scorePersonColumns: [], // 列属性
      scorePersonData: [], // 表格数据
      scorePersonCurrentPage: 1, // 当前页码
      scorePersonPageSize: 30, // 当前分页大小
      scorePersonTotal: 0, // 总记录数量
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

      authorizeLoading: false, // 加载状态
      authorizeOptions: {}, // ag-grid配置
      authorizeColumns: {}, // 列属性
      authorizeData: [], // 表格数据
      authorizeCurrentPage: 1, // 当前页码
      authorizePageSize: 30, // 当前分页大小
      authorizeTotal: 0, // 总记录数量
      /**
       * @vuese
       * 操作标识
       */
      operationFlag: "", // query: 查询; add: 新增; edit: 编辑; delete: 删除;
      /**
       * @vuese
       * 人员信息表单对话框 相关数据
       */
      personnelFormDialogVisible: false, // 对话框是否显示
      personnelFormSubmitting: false, // 表单提交状态
      // 人员信息表单数据
      personnelForm: {
        sapNum: null, // 员工工号
        name: null, // 员工姓名
        type: null, // 员工类型
        companyId: null, // 公司Id
        company: null, // 公司名称
        deptmentId: "", // 部门Id
        department: "", // 部门名称
        standardWage: "", // 标准工资
        subdivisionsDeptId: "", // 二级部门Id
        subdivisionsDept: "", // 二级部门名称
        authorityDept: false, // 是否有管辖部门权限
        summaryDept: false, // 是否有汇总部门权限
        isEmployeeTable: false, // 是否使用员工考核表
        isMerge: false, // 是否合并评分
        isScore: false, // 是否评分不限制
        managerName: "", // 评分节点1人员姓名
        managerName2: "", // 评分节点2人员姓名
        managerName3: "", // 评分节点3人员姓名
        managerSapNum: "", // 评分节点1人员工号
        managerSapNum2: "", // 评分节点2人员工号
        managerSapNum3: "", // 评分节点3人员工号
        rater: null, // 评分人工号
        raterName: null, // 评分人姓名
      },
      personnelFormRules, // 人员信息表单校验规则
      companyOptions: [], // 公司选项
      companyOptionsLoading: false, // 公司选项加载状态
      departmentOptions: [], // 部门选项
      departmentOptionsLoading: false, // 部门选项加载状态
      departmentOptions2: [], // 二级部门选项
      departmentOptionsLoading2: false, // 二级部门选项加载状态
      personnelOptions: [], // 人员选项
      personnelOptionsLoading: false, // 人员选项加载状态
    };
  },
  // 计算属性
  computed: {
    /**
     * @vuese
     * 人员信息表单对话框的标题
     */
    personnelFormDialogTitle() {
      let _title = "";
      switch (this.operationFlag) {
        case "add":
          _title = "新增人员信息";
          break;
        case "edit":
          _title = "编辑人员信息";
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
    // 获取所有人员
    this.getMoldPeronListAll();
    this.getWarrantOptions();
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
        // 获取所有人员
        this.getMoldPeronListAll();
        this.getWarrantOptions();
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
    commitAuthorize() {
      const _rows = this.authorizeOptions.api.getSelectedRows();
      const rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择授权的公司或部门", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      const userData = this.$utils.getStorage("userData").user;
      let deptIds = [];
      _rows.map((item) => {
        deptIds.push(item.id);
      });
      let data = {
        createSapNum: userData.sapNum,
        creator: userData.creator,
        sapNum: rows[0].sapNum,
        deptIds,
      };
      let that = this;
      if (this.authorizeType == 0) {
        that.$http
          .updateRelAuthorityDept(data)
          .then((response) => {
            that.authorizeDialog = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              that.$message.success(info);
            } else {
              that.$alert(info, {
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
      } else {
        that.$http
          .relupdateRelAuthorityDept(data)
          .then((response) => {
            that.authorizeDialog = false;
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              that.$message.success(info);
            } else {
              that.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.code === 0) {
              that.$message.error(error.response.data.info);
            }
          });
      }
    },
    authorize(type) {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要授权的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      if (_rows.length > 1) {
        this.$alert("只能选择一行进行授权", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.authorizeType = type;
      this.authorizeTitle = type == 0 ? "管辖部门授权" : "汇总部门授权";
      this.authorizeDialog = true;
      this.getDeptmentList();
    },
    getDeptmentList() {
      this.authorizeLoading = true;
      let data = {
        current: this.authorizeCurrentPage,
        size: this.authorizePageSize,
        state: 0,
        companyId: this.authorizeCompanyId ? this.authorizeCompanyId : null,
        deptName: this.authorizeDeptmentId ? this.authorizeDeptmentId : null,
      };
      this.$http.getDeptmentList(data).then((res) => {
        if (res.data.code == 1) {
          this.authorizeData = res.data.rows.records;
          this.authorizeTotal = res.data.rows.total;
          const _rows = this.getMainTableSelectedRows();
          if (this.authorizeType == 0) {
            this.$http
              .getEnableDeptList({ sapNum: _rows[0].sapNum })
              .then((res) => {
                const nodes = this.authorizeOptions.api.getRenderedNodes();
                res.data.rows.map((item) => {
                  nodes.map((use) => {
                    if (use.data.id == item) {
                      this.authorizeOptions.api.selectNode(use, true);
                    }
                  });
                });

                this.authorizeLoading = false;
              });
          } else {
            this.$http
              .relgetEnableDeptList({ sapNum: _rows[0].sapNum })
              .then((res) => {
                const nodes = this.authorizeOptions.api.getRenderedNodes();
                res.data.rows.map((item) => {
                  nodes.map((use) => {
                    if (use.data.id == item) {
                      this.authorizeOptions.api.selectNode(use, true);
                    }
                  });
                });

                this.authorizeLoading = false;
              });
          }
        } else {
          this.authorizeLoading = false;
          this.$message.info(res.data.info);
        }
      });
    },
    warrantCommit() {
      let rows = this.mainTableOptions.api.getSelectedRows();
      let sapNumList = [];
      rows.map((item) => {
        sapNumList.push(item.sapNum);
      });

      let data = { ...this.warrantForm };
      data.sapNumList = sapNumList;
      this.$http.updateTemplate(data).then((res) => {
        if (res.data.code == "1") {
          this.$message.success(res.data.info);
          this.getMainTableData();
          this.warrantDialogVisible = false;
        } else {
          this.$message.warning(res.data.info);
        }
      });
    },
    warrantDialogVisibleClose() {
      this.warrantForm = {};
      this.warrantDialogVisible = false;
    },
    authorizeClose() {
      this.authorizeData = [];
      this.authorizeDialog = false;
      this.authorizeTitle = "";
      this.authorizeCompanyId = null;
      this.authorizeDeptmentId = null;
    },
    getWarrantOptions() {
      this.$http
        .getBasePfmMergetBaseDeptColumnTemplateListcolumnList({ state: 0 })
        .then((res) => {
          this.warrantOptions = res.data.rows.records;
        });
    },
    warrantHandleClose(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.warrantDialogVisible = false;
        });
      } else {
        this.warrantDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 获取评分人员表单数据
     */
    getScorePeronList() {
      this.scorePersonLoading = true;
      this.$http
        .getMoldPeronList({
          // scorePersonCompanyId
          // scorePersonDeptmentId
          companyId: this.scorePersonCompanyId || undefined,
          deptmentId: this.scorePersonDeptmentId || undefined,
          name: this.scorePersonSearchName || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
          current: this.scorePersonCurrentPage,
          size: this.scorePersonPageSize,
          state: 0,
        })
        .then((response) => {
          this.scorePersonLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows, total } = data;
            this.scorePersonData = rows.records;
            this.scorePersonTotal = total;
          } else {
            this.scorePersonData = [];
            this.scorePersonTotal = 0;
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.scorePersonLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 人员信息选择搜索
     */
    findScorePerson() {
      this.getScorePeronList();
    },
    /**
     * @vuese
     * 人员信息选择确认
     */
    commitScorePerson() {
      let rows = this.scorePersonOptions.api.getSelectedRows();
      let data = rows[0];
      this.$set(this.personnelForm, this.operatingData, data.sapNum);
      this.$set(this.personnelForm, this.operatingDataName, data.name);
      this.closeitAllr();
    },
    /**
     * @vuese
     * 显示人员信息选择弹框
     */
    showScorePerson(type, ref, name) {
      // 获取选择信息列表
      this.getScorePeronList();
      this.modifyScorePersonTitle(type);
      this.$refs[ref].blur();
      this.operatingData = ref;
      this.operatingDataName = name;
      this.showScorePersonDialog = true;
    },
    closeitAllr() {
      this.showScorePersonDialog = false;
      this.scorePersonSearchName = "";
      this.operatingData = null;
      this.operatingDataName = null;
      this.scorePersonCompanyId = null;
      this.scorePersonDeptmentId = null;
    },
    /**
     * @vuese
     * 关闭人员信息选择弹框
     */
    scorePersonClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.closeitAllr();
          done();
        })
        .catch((_) => {});
    },
    /**
     * @vuese
     * 修改人员信息标题
     */
    modifyScorePersonTitle(type) {
      if (type == 1) {
        this.scorePersonTitle = "评分节点1人员";
      } else if (type == 2) {
        this.scorePersonTitle = "评分节点2人员";
      } else if (type == 3) {
        this.scorePersonTitle = "评分节点3人员";
      } else if (type == 4) {
        this.scorePersonTitle = "评分人";
      }
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
          Promise.all(
            newExcelData.map(async (item) => {
              const findCompany = this.companyOptions.find(
                (companyItem) =>
                  companyItem.companyFullName === item.company ||
                  companyItem.companyName == item.company
              );
              if (findCompany) {
                item.companyId = findCompany.id;
                await this.usecompFindCompanyId(
                  findCompany.id,
                  item.department
                );
                item.deptmentId = key_deptmentId;
              }
              return item;
            })
          ).then((res) => {
            this.addPersonBatch(res);
          });
        }
      });
    },
    addPersonBatch(excelData) {
      console.log(excelData);
      this.$http
        .addBatch(excelData)
        .then((res) => {
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
            this.onSearch();
          }
        })
        .catch((err) => {
          if (err.response && err.response.data.code === 0) {
            this.$message.error(err.response.data.info);
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
          headerName: "员工工号",
          field: "sapNum",
        },
        {
          headerName: "员工姓名",
          field: "name",
        },
        {
          headerName: "所属公司",
          field: "company",
        },
        {
          headerName: "部门",
          field: "department",
        },
        {
          headerName: "二级部门",
          field: "subdivisionsDept",
        },
        {
          headerName: "员工类型",
          field: "type",
        },
        {
          headerName: "标准工资",
          field: "standardWage",
        },
        {
          headerName: "是否有管辖部门权限",
          field: "authorityDept",
        },
        {
          headerName: "是否有汇总部门权限",
          field: "summaryDept",
        },
        {
          headerName: "是否评分不限制",
          field: "isScore",
        },
        {
          headerName: "是否合并评分",
          field: "isMerge",
        },
        {
          headerName: "是否使用员工考核表",
          field: "isEmployeeTable",
        },
        {
          headerName: "评分人工号",
          field: "rater",
        },
        {
          headerName: "评分人姓名",
          field: "raterName",
        },
        {
          headerName: "评分节点1人员工号",
          field: "managerSapNum",
        },
        {
          headerName: "评分节点1人员姓名",
          field: "managerName",
        },
        {
          headerName: "评分节点2人员工号",
          field: "managerSapNum2",
        },
        {
          headerName: "评分节点2人员姓名",
          field: "managerName2",
        },
        {
          headerName: "评分节点3人员工号",
          field: "managerSapNum3",
        },
        {
          headerName: "评分节点3人员姓名",
          field: "managerName3",
        },
        {
          headerName: "部门显示模板名称",
          field: "templateName",
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
            } else if (findColumnItem.field === "isScore") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
            } else if (findColumnItem.field === "isMerge") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
            } else if (findColumnItem.field === "isEmployeeTable") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
            } else if (findColumnItem.field === "authorityDept") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
            } else if (findColumnItem.field === "summaryDept") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
            } else if (findColumnItem.field === "type") {
              newItem[findColumnItem.field] = item[key] == "是" ? 0 : 1;
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
      this.scorePersonOptions = gridOptions({
        singleSelection: true, // 是否启用拖选行
      });
      this.authorizeOptions = gridOptions({
        dragSelectCheckbox: true, // 是否启用拖选行
      });
      this.authorizeColumns = [
        {
          headerName: "公司名称",
          field: "companyName",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
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
      this.scorePersonColumns = [
        {
          headerName: "工号",
          field: "sapNum",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: true, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据
        },
        {
          headerName: "姓名",
          field: "name",
        },
        {
          headerName: "公司",
          field: "company",
        },
        {
          headerName: "部门",
          field: "department",
        },
        {
          headerName: "二级部门",
          field: "subdivisionsDept",
        },
      ];
      this.mainTableColumns = [
        {
          headerName: "SAP工号",
          field: "sapNum",
          /**
           * 一般在第一列数据上加勾选框
           */
          headerCheckboxSelection: false, // 是否在标题栏显示全选勾选框
          checkboxSelection: true, // 是否在行头显示勾选框
          headerCheckboxSelectionFilteredOnly: true, //是否只全选过滤数据

          width: 150,
        },
        {
          headerName: "姓名",
          field: "name",
          width: 100,
        },
        {
          headerName: "OA账号",
          field: "oaAccount",

          width: 150,
        },
        {
          headerName: "公司",
          field: "company",
          cellRendererFramework: tooltipForCell,
        },
        {
          headerName: "部门",
          field: "department",

          width: 150,
        },
        {
          headerName: "二级部门",
          field: "subdivisionsDept",
          width: 150,
        },
        {
          headerName: "员工类型",
          field: "type",
          width: 150,
          cellRenderer: (params) => {
            return params.value === 0 ? "干部" : "员工";
          },
        },
        {
          headerName: "标准工资",
          field: "standardWage",
          width: 150,
        },
        {
          headerName: "是否有管辖部门权限",
          field: "authorityDept",
          width: 150,
          cellRenderer: ({ data }) => {
            return data.authorityDept === 0 ? "是" : "否";
          },
        },
        {
          headerName: "是否有汇总部门权限",
          field: "summaryDept",
          width: 150,
          cellRenderer: ({ data }) => {
            return data.summaryDept === 0 ? "是" : "否";
          },
        },
        {
          headerName: "是否评分不限制",
          field: "isScore",
          width: 150,
          cellRenderer: ({ data }) => {
            return data.isScore === 0 ? "是" : "否";
          },
        },
        {
          headerName: "是否合并评分",
          field: "isMerge",
          width: 150,
          cellRenderer: ({ data }) => {
            return data.isMerge === 0 ? "是" : "否";
          },
        },
        {
          headerName: "是否使用员工考核表",
          field: "isEmployeeTable",
          width: 150,
          cellRenderer: ({ data }) => {
            return data.isEmployeeTable === 0 ? "是" : "否";
          },
        },
        {
          headerName: "评分人工号",
          field: "rater",
          width: 150,
        },
        {
          headerName: "评分人姓名",
          field: "raterName",
          width: 150,
        },
        {
          headerName: "上级SAP工号",
          field: "managerSapNum",
          width: 150,
        },
        {
          headerName: "上级姓名",
          field: "managerName",
          width: 150,
        },
        {
          headerName: "上级2 SAP工号",
          field: "managerSapNum2",
          width: 150,
        },
        {
          headerName: "上级2 姓名",
          field: "managerName2",
          width: 150,
        },
        {
          headerName: "上级3 SAP工号",
          field: "managerSapNum3",
          width: 150,
        },
        {
          headerName: "上级3 姓名",
          field: "managerName3",
          width: 150,
        },
        {
          headerName: "模板名称",
          field: "templateName",
          width: 150,
          cellRendererFramework: tooltipForCell,
        },
      ];
    },
    /**
     * @vuese
     * 处理人员选择表格分页大小改变事件
     * @arg {Number} val 分页大小
     */
    handleAuthorizeSizeChange(val) {
      // 设置当前页码为第一页
      this.authorizeCurrentPage = 1;
      // 设置分页大小
      this.authorizePageSize = val;
      // 获取部门表格数据
      this.getDeptmentList();
    },
    /**
     * @vuese
     * 处理人员选择页码改变事件
     * @arg {Number} val 页码
     */
    handleAuthorizeCurrentChange(val) {
      // 设置当前页码
      this.authorizeCurrentPage = val;
      // 获取部门表格数据
      this.getDeptmentList();
    },
    /**
     * @vuese
     * 处理人员选择表格分页大小改变事件
     * @arg {Number} val 分页大小
     */
    handleScorePersonSizeChange(val) {
      // 设置当前页码为第一页
      this.scorePersonCurrentPage = 1;
      // 设置分页大小
      this.scorePersonPageSize = val;
      // 获取评分人表格数据
      this.getScorePeronList();
    },
    /**
     * @vuese
     * 处理人员选择页码改变事件
     * @arg {Number} val 页码
     */
    handleScorePersonCurrentChange(val) {
      // 设置当前页码
      this.scorePersonCurrentPage = val;
      // 获取评分人表格数据
      this.getScorePeronList();
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
    // 授权功能
    warrant() {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要授权的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.warrantForm = {};
      this.warrantDialogVisible = true;
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
      // 获取人员信息列表
      this.getMoldPeronList();
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
      isWatchSelect = true;
      this.openPersonnelFormDialog();
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
      if (_rows.length > 1) {
        this.multipleSelection = true;
        _rows.map((item) => {
          this.multipleSelectionList.push(item.sapNum);
        });
        this.multipleSelectionStr = this.multipleSelectionList.join(",");
        this.personnelForm.sapNum = this.multipleSelectionStr;
        // 打开对话框
        this.openPersonnelFormDialog();
      } else {
        // 保存选中行的数据
        mainTableSelectedRow = _rows[0];
        const { companyId, deptmentId } = _rows[0];
        isWatchSelect = false;
        // 获取所有公司
        this.getCompanyListAll();
        this.getCompanyListByCompanyCode(companyId).then((data) => {
          const list = data.records;
          if (list.length > 0) {
            this.getDeptmentListByCompanyId(list[0].id);
            this.getDeptmentListByCompanyId(list[0].id, deptmentId);
          }
        });
        this.openPersonnelFormDialog();
      }
    },
    /**
     * @vuese
     * 删除事件
     */
    onDelete() {
      const _rows = this.getMainTableSelectedRows();
      if (_rows.length === 0) {
        this.$alert("请选择需要操作的行", {
          showClose: false,
          confirmButtonText: "确定",
          customClass: "alertPrompt",
        });
        return;
      }
      this.$confirm(`确认${this.searchForm.state ? "启用" : "停用"}?`).then(
        () => {
          this.operationFlag = "delete";
          // 删除人员信息
          this.deleteMoldPeron(_rows[0].id);
        }
      );
    },
    /**
     * @vuese
     * 打开 人员信息表单对话框
     */
    openPersonnelFormDialog() {
      this.personnelFormDialogVisible = true;
      this.$nextTick(() => {
        if (this.operationFlag === "add" || this.multipleSelection) {
          // 重置表单
          this.resetForm("personnelForm");
          if (this.multipleSelection) {
            this.$set(this.personnelForm, "sapNum", this.multipleSelectionStr);
          }
        } else if (this.operationFlag === "edit") {
          // 移除表单项的校验结果
          this.clearFormValidate("personnelForm");
          const {
            sapNum,
            name,
            type,
            companyId,
            company,
            deptmentId,
            department,
            standardWage,
            subdivisionsDeptId,
            subdivisionsDept,
            authorityDept,
            summaryDept,
            isEmployeeTable,
            isMerge,
            isScore,
            managerName,
            managerName2,
            managerName3,
            managerSapNum,
            managerSapNum2,
            managerSapNum3,
            rater,
            raterName,
          } = mainTableSelectedRow;
          // 设置表单默认值
          this.personnelForm = {
            sapNum, // 员工工号
            name, // 员工姓名
            type, // 员工类型
            companyId, //: String(companyId), // 公司Id
            company, // 公司名称
            deptmentId, // 部门Id
            department, // 部门名称
            standardWage, // 标准工资
            subdivisionsDeptId, // 二级部门Id
            subdivisionsDept, // 二级部门名称
            authorityDept: authorityDept === 0, // 是否有管辖部门权限
            summaryDept: summaryDept === 0, // 是否有汇总部门权限
            isEmployeeTable: isEmployeeTable === 0, // 是否使用员工考核表
            isMerge: isMerge === 0, // 是否合并评分
            isScore: isScore === 0, // 是否评分不限制
            managerName, // 评分节点1人员姓名
            managerName2, // 评分节点2人员姓名
            managerName3, // 评分节点3人员姓名
            managerSapNum, // 评分节点1人员工号
            managerSapNum2, // 评分节点2人员工号
            managerSapNum3, // 评分节点3人员工号
            rater, // 评分人工号
            raterName, // 评分人姓名
          };
          this.$nextTick(() => {
            isWatchSelect = true;
          });
        }
      });
    },
    /**
     * @vuese
     * 关闭 人员信息表单对话框
     * @arg {Boolean} reconfirm 是否需要二次确认
     */
    closePersonnelFormDialog(reconfirm) {
      if (reconfirm) {
        this.$confirm("确认关闭？").then(() => {
          this.personnelFormDialogVisible = false;
          this.resetForm("personnelForm");

          this.clearFormValidate("personnelForm");
          this.multipleSelectionList = [];
          this.multipleSelectionStr = "";
          this.multipleSelection = false;
          this.closeitAllr();
        });
      } else {
        this.personnelFormDialogVisible = false;
      }
    },
    /**
     * @vuese
     * 公司表单对话框 关闭前的回调
     */
    personnelFormDialogBeforeClose() {
      this.closePersonnelFormDialog(true);
    },
    /**
     * @vuese
     * 人员信息表单对话框 确认事件
     */
    onConfirmPersonnelForm() {
      this.$refs["personnelForm"].validate((valid) => {
        if (valid) {
          if (this.operationFlag === "add") {
            this.addMoldPeron();
          } else if (this.operationFlag === "edit") {
            this.updateMoldPeron();
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
      this[formName] = {};
    },
    /**
     * @vuese
     * 移除表单项的校验结果
     * @arg {String} formName 表单名称
     */
    clearFormValidate(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].clearValidate();
      }
    },
    /**
     * @vuese
     * 获取人员信息列表
     */
    getMoldPeronList() {
      this.mainTableLoading = true;
      this.$http
        .getMoldPeronList({
          ...this.searchForm,
          name: this.searchForm.name || undefined, // 不允许传空字符串，值为空时改为undefined，axios会过滤掉undefined的字段
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
     * 获取所有人员
     */
    getMoldPeronListAll() {
      this.personnelOptionsLoading = true;
      this.$http
        .getMoldPeronListAll({})
        .then((response) => {
          this.personnelOptionsLoading = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            this.personnelOptions = rows;
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.personnelOptionsLoading = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 新增人员信息
     */
    addMoldPeron() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.personnelFormSubmitting = true;
      this.personnelForm.templateId = this.personnelForm.deptmentId;
      const newPersonnelForm = { ...this.personnelForm };
      const findCompany = this.companyOptions.find(
        (item) => item.id === newPersonnelForm.companyId
      );
      const findDepartment = this.departmentOptions.find(
        (item) => item.id === newPersonnelForm.deptmentId
      );
      const findDepartment2 = this.departmentOptions2.find(
        (item) => item.id === newPersonnelForm.subdivisionsDeptId
      );
      newPersonnelForm.company = findCompany ? findCompany.companyName : "";
      newPersonnelForm.department = findDepartment
        ? findDepartment.deptName
        : "";
      newPersonnelForm.subdivisionsDept = findDepartment2
        ? findDepartment2.deptName
        : "";
      newPersonnelForm.authorityDept = !newPersonnelForm.authorityDept ? 1 : 0;
      newPersonnelForm.isEmployeeTable = !newPersonnelForm.isEmployeeTable
        ? 1
        : 0;
      newPersonnelForm.isMerge = !newPersonnelForm.isMerge ? 1 : 0;
      newPersonnelForm.isScore = !newPersonnelForm.isScore ? 1 : 0;
      newPersonnelForm.summaryDept = !newPersonnelForm.summaryDept ? 1 : 0;
      // 判断以下表单内的值是否为空，是的话把它们对应的员工工号也去掉
      if (!newPersonnelForm.managerName) {
        newPersonnelForm.managerSapNum = "";
      }
      if (!newPersonnelForm.managerName2) {
        newPersonnelForm.managerSapNum2 = "";
      }
      if (!newPersonnelForm.managerName3) {
        newPersonnelForm.managerSapNum3 = "";
      }
      if (!newPersonnelForm.raterName) {
        newPersonnelForm.rater = "";
      }
      this.$http
        .addMoldPeron({
          ...newPersonnelForm,
          createBy: sapNum,
          creator: employeeName,
        })
        .then((response) => {
          this.personnelFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            // 关闭人员信息表单对话框
            this.closePersonnelFormDialog(false);
            // 获取主表格数据
            this.getMainTableData();
            // 获取所有人员
            this.getMoldPeronListAll();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.personnelFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 修改人员信息
     */
    updateMoldPeron() {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      const { id } = mainTableSelectedRow;
      this.personnelFormSubmitting = true;
      if (this.multipleSelection) {
        this.personnelForm.id = this.personnelForm.id.split(",");
      }
      const newPersonnelForm = { ...this.personnelForm };
      const findCompany = this.companyOptions.find(
        (item) => item.id === newPersonnelForm.companyId
      );
      const findDepartment = this.departmentOptions.find(
        (item) => item.id === newPersonnelForm.deptmentId
      );
      const findDepartment2 = this.departmentOptions2.find(
        (item) => item.id === newPersonnelForm.subdivisionsDeptId
      );
      newPersonnelForm.company = findCompany ? findCompany.companyName : "";
      newPersonnelForm.department = findDepartment
        ? findDepartment.deptName
        : "";
      newPersonnelForm.subdivisionsDept = findDepartment2
        ? findDepartment2.deptName
        : "";
      newPersonnelForm.authorityDept = !newPersonnelForm.authorityDept ? 1 : 0;
      newPersonnelForm.isEmployeeTable = !newPersonnelForm.isEmployeeTable
        ? 1
        : 0;
      newPersonnelForm.isMerge = !newPersonnelForm.isMerge ? 1 : 0;
      newPersonnelForm.isScore = !newPersonnelForm.isScore ? 1 : 0;
      newPersonnelForm.summaryDept = !newPersonnelForm.summaryDept ? 1 : 0;
      // 判断以下表单内的值是否为空，是的话把它们对应的员工工号也去掉
      if (!newPersonnelForm.managerName) {
        newPersonnelForm.managerSapNum = "";
      }
      if (!newPersonnelForm.managerName2) {
        newPersonnelForm.managerSapNum2 = "";
      }
      if (!newPersonnelForm.managerName3) {
        newPersonnelForm.managerSapNum3 = "";
      }
      if (!newPersonnelForm.raterName) {
        newPersonnelForm.rater = "";
      }
      console.log(newPersonnelForm);
      this.$http
        .updateMoldPeron({
          ...newPersonnelForm,
          id,
          updateBy: sapNum,
          updator: employeeName,
        })
        .then((response) => {
          this.personnelFormSubmitting = false;
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            // 关闭公司信息表单对话框
            this.closePersonnelFormDialog(false);
            // 获取主表格数据
            this.getMainTableData();
            // 获取所有人员
            this.getMoldPeronListAll();
          } else {
            this.$alert(info, {
              showClose: false,
              confirmButtonText: "确定",
              customClass: "alertFailure",
            });
          }
        })
        .catch((error) => {
          this.personnelFormSubmitting = false;
          if (error.response && error.response.data.code === 0) {
            this.$message.error(error.response.data.info);
          }
        });
    },
    /**
     * @vuese
     * 删除人员信息
     * @arg {String} id 员工Id
     * @arg {String} updateBy 修改人工号
     * @arg {String} updator 修改人姓名
     */
    deleteMoldPeron(id) {
      const { sapNum, employeeName } = this.$utils.getStorage("userData").user;
      this.$set(this.btnLoadings, "delete", true);
      let http = this.searchForm.state
        ? "restoreBasePfmMold"
        : "deleteMoldPeron";
      this.$http[http]({
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
              message: this.searchForm.state ? "启用成功" : "停用成功",
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
            // 当前操作为编辑 且 人员信息表单对话框为打开状态 且 有主表格选中数据时，对表单中“companyId”赋值
            if (
              this.operationFlag === "edit" &&
              this.personnelFormDialogVisible &&
              mainTableSelectedRow
            ) {
              const findCompany = rows.find(
                (item) => item.id === mainTableSelectedRow.companyId
              );
              this.$set(
                this.personnelForm,
                "companyId",
                findCompany ? mainTableSelectedRow.companyId : null
              ); // 设置人员信息表单的公司id
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
     * 根据公司编码获取公司信息
     */
    getCompanyListByCompanyCode(companyCode) {
      return new Promise((resolve) => {
        this.$http
          .getCompanyList({ companyCode, state: 0 })
          .then((response) => {
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              resolve(rows);
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
      });
    },
    async usecompFindCompanyId(companyId, flag) {
      if (flag) {
        await this.$http
          .getDeptmentListAll({ companyId, higherDept: 0 })
          .then((response) => {
            const data = response.data;
            const { code, info } = data;
            if (code === 1) {
              const { rows } = data;
              this.departmentOptions = rows;
              if (flag) {
                this.departmentOptions.map((res) => {
                  if (res.deptName == flag) {
                    key_deptmentId = res.id;
                  }
                });
              }
            } else {
              this.$alert(info, {
                showClose: false,
                confirmButtonText: "确定",
                customClass: "alertFailure",
              });
            }
          });
      } else {
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
      }
    },
    /**
     * @vuese
     * 根据公司Id获取部门列表
     */
    getDeptmentListByCompanyId(companyId, higherDept) {
      if (higherDept === undefined) {
        this.departmentOptionsLoading = true;
      } else {
        this.departmentOptionsLoading2 = true;
      }
      this.$http
        .getDeptmentListAll({ companyId, higherDept })
        .then((response) => {
          if (higherDept === undefined) {
            this.departmentOptionsLoading = false;
          } else {
            this.departmentOptionsLoading2 = false;
          }
          const data = response.data;
          const { code, info } = data;
          if (code === 1) {
            const { rows } = data;
            if (higherDept === undefined) {
              this.departmentOptions = rows;
              //this.openPersonnelFormDialog();
            } else {
              this.departmentOptions2 = rows;
              //this.openPersonnelFormDialog();
            }
            // 当前操作为编辑 且 人员信息表单对话框为打开状态 且 有主表格选中数据时，对表单中“deptmentId”、“subdivisionsDeptId”赋值
            if (
              this.operationFlag === "edit" &&
              this.personnelFormDialogVisible &&
              mainTableSelectedRow
            ) {
              if (higherDept === undefined) {
                const findDepartment = rows.find(
                  (item) => item.id === mainTableSelectedRow.deptmentId
                );
                this.$set(
                  this.personnelForm,
                  "deptmentId",
                  findDepartment ? mainTableSelectedRow.deptmentId : null
                ); // 设置人员信息表单的部门id
              } else {
                const findDepartment = rows.find(
                  (item) => item.id === mainTableSelectedRow.subdivisionsDeptId
                );
                this.$set(
                  this.personnelForm,
                  "subdivisionsDeptId",
                  findDepartment
                    ? mainTableSelectedRow.subdivisionsDeptId
                    : null
                ); // 设置人员信息表单的二级部门id
              }
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
          if (higherDept === undefined) {
            this.departmentOptionsLoading = false;
          } else {
            this.departmentOptionsLoading2 = false;
          }
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
    "personnelForm.companyId"(val) {
      if (isWatchSelect) {
        this.$set(this.personnelForm, "deptmentId", "");
        this.$set(this.personnelForm, "subdivisionsDeptId", "");
        if (val) {
          this.getDeptmentListByCompanyId(val);
        } else {
          this.departmentOptions = [];
        }
      }
    },
    "personnelForm.deptmentId"(val) {
      if (isWatchSelect) {
        this.$set(this.personnelForm, "subdivisionsDeptId", "");
        if (val) {
          this.getDeptmentListByCompanyId(this.personnelForm.companyId, val);
        }
      }
    },
    authorizeCompanyId(val) {
      if (val) {
        this.authorizeDeptmentId = null;
        this.usecompFindCompanyId(val);
      } else {
        this.authorizeDeptmentId = null;
        this.departmentOptions = [];
      }
    },
    scorePersonCompanyId(val) {
      if (val) {
        this.scorePersonDeptmentId = null;
        this.usecompFindCompanyId(val);
      } else {
        this.scorePersonDeptmentId = null;
        this.departmentOptions = [];
      }
    },
    /**
     *
     */
  },
};
</script>
<style lang="less" scoped>
.m-personnelManagement {
}
.upload-btn {
  /deep/ .el-upload {
    width: 100%;
  }
}
.menu-dialog-height {
  height: 60%;
}
.el-dialog-div {
  height: 60vh;
  position: relative;
}
.el-dialog-div > .m-agTable {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
}
.el-dialog-div > .m-agTable.m-bottom {
  bottom: 35px;
}
</style>
