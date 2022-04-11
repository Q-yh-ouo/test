/*
 * @author: 郭湛良-景兴
 * @since: 2021-05-06
 */
import req from "@/api/req";
import constant from "@/public/constant";
export default {
  /**
   * 获取组织列表
   * @arg {String} organizationCode 组织编码
   * @arg {String} parentCode 根公司编码
   * @arg {String} beginTime 开始时间
   * @arg {String} endTime 结束时间
   */
  // getOrganizationList: ({ organizationCode, parentCode, beginTime, endTime }) =>
  //   req({
  //     baseUrl: "pms",
  //     method: "POST",
  //     url: "basePfmOrganization/list",
  //     params: {
  //       entity: {
  //         organizationCode,
  //         parentCode,
  //         beginTime,
  //         endTime,
  //       },
  //     },
  //   }),
  getOrganizationList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmOrganization/list",
      params: data,
    }),
  /**
   * 获取公司列表
   * @arg {String} companyId 公司编码
   * @arg {String} companyName 公司名称
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getCompanyList: ({ companyId, companyName, state, current, size }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmCompany/getBasePfmCompanyList",
      params: {
        current,
        size,
        entity: {
          companyId,
          companyName,
          state,
        },
      },
    }),
  /**
   * 获取所有公司
   */
  getCompanyListAll: () =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmCompany/getCompanyList",
      params: {},
    }),
  /**
   * 新增公司
   * @arg {String} companyCode 公司编码
   * @arg {String} companyFullName 公司全称
   * @arg {String} companyName 公司简称
   * @arg {String} parentCode 公司根编码
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人姓名
   */
  addCompany: ({
    companyCode,
    companyFullName,
    companyName,
    parentCode,
    moduleCode,
    moduleName,
    createBy,
    creator,
  }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmCompany/saveCompany",
      params: {
        companyCode,
        companyFullName,
        companyName,
        parentCode,
        moduleCode,
        moduleName,
        createBy,
        creator,
      },
    }),
  /**
   * 修改公司信息
   * @arg {Number} id 公司Id
   * @arg {String} companyCode 公司编码
   * @arg {String} companyFullName 公司全称
   * @arg {String} companyName 公司简称
   * @arg {String} parentCode 公司根编码
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  updateCompany: ({
    id,
    companyCode,
    companyFullName,
    companyName,
    parentCode,
    moduleCode,
    moduleName,
    updateBy,
    updator,
  }) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "basePfmCompany/updateCompany",
      params: {
        id,
        companyCode,
        companyFullName,
        companyName,
        parentCode,
        moduleCode,
        moduleName,
        updateBy,
        updator,
      },
    }),
  /**
   * 删除公司信息
   * @arg {Number} id 公司Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteCompany: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "DELETE",
      url: `basePfmCompany/deleteBasePfmCompany?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复公司信息
   * @arg {Number} id 公司Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreCompany: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmCompany/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 获取待授权公司列表
   */
  getUnauthorizeComp: () =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmOrganization/getUnauthorizeComp",
      params: {},
    }),
  /**
   * 新增组织
   */
  saveOrganization: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmOrganization/add",
      params: data,
    }),
  /**
   * 修改组织
   */
  updateOrganization: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmOrganization/update",
      params: data,
    }),
  /**
   * 删除组织
   */
  deleteOrganizationById: (data) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "basePfmOrganization/delete",
      params: data,
      isOriginalGET: 1,
    }),
  /**
   * 获取所属部门人员列表
   */
  getPeronList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmPerson/getPersonList",
      params: data,
    }),
  /**
   * 批量添加员工
   */
  addPersonBatch: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmPerson/addBatch",
      params: data,
    }),
  /**
   * 批量添加员工
   */
  addBatch: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/addBatch",
      params: data,
    }),
  /**
   * 引入员工
   */
  addMdmPerson: (data) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "basePfmPerson/addMdmPerson",
      params: data,
      isOriginalGET: 1,
    }),
  /**
   * 删除员工
   */
  delPersonById: (data) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "basePfmPerson/deleteById",
      params: data,
      isOriginalGET: 1,
    }),
  /**
   * 新增员工
   */
  savePerson: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmPerson/add",
      params: data,
    }),
  /**
   * 修改员工
   */
  updatePerson: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmPerson/update",
      params: data,
    }),
  /**
   * 获取部门列表
   * @arg {Number} companyId 公司Id
   * @arg {String} deptName 部门名称
   * @arg {Number} higherDept 上级部门id
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getDeptmentList: ({
    companyId,
    deptName,
    higherDept,
    state,
    current,
    size,
  }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmDeptment/getDeptmentPageList",
      params: {
        current,
        size,
        entity: {
          companyId,
          deptName,
          higherDept,
          state,
        },
      },
    }),
  /**
   * 获取所有部门
   * @arg {Number} companyId 公司Id
   * @arg {Number} higherDept 上级部门Id
   */
  getDeptmentListAll: ({ companyId, higherDept }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmDeptment/getDeptmentList",
      params: {
        companyId,
        higherDept,
      },
    }),
  /**
   * 新增部门
   * @arg {Number} companyId 公司Id
   * @arg {String} deptName 部门名称
   * @arg {String} higherDept 上级部门Id,没有传 0
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人姓名
   */
  addDeptment: ({ companyId, deptName, higherDept, createBy, creator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmDeptment/saveDeptment",
      params: {
        companyId,
        deptName,
        higherDept,
        createBy,
        creator,
      },
    }),
  /**
   * 编辑部门信息
   * @arg {Number} id 部门Id
   * @arg {Number} companyId 公司Id
   * @arg {String} deptName 部门名称
   * @arg {String} higherDept 上级部门Id,没有传 0
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人姓名
   */
  updateDeptment: (data) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "basePfmDeptment/getDeptment",
      params: data,
    }),
  /**
   * 删除部门信息
   * @arg {Number} id 部门Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteDeptment: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "DELETE",
      url: `basePfmDeptment/deleteDeptment?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复部门信息
   * @arg {Number} id 部门Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreDeptment: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmDeptment/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 获取人员信息列表
   * @arg {String} name 人员名称
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getMoldPeronList: ({ name, state, current, size, companyId, deptmentId }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/getPeronList",
      params: {
        current,
        size,
        entity: {
          name,
          state,
          companyId,
          deptmentId,
        },
      },
    }),
  /**
   * 获取所有人员
   * @arg {Number} companyId 公司Id
   * @arg {Number} deptmentId 部门Id
   */
  getMoldPeronListAll: ({ companyId, deptmentId }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/getMoldList",
      params: {
        companyId,
        deptmentId,
      },
    }),
  restoreBasePfmMold: ({ id, modifySapnum, modifyName }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmMold/restoreBasePfmMold?id=${id}&modifySapnum=${modifySapnum}&modifyName=${modifyName}`,
      // params: data,
      // query: data,
    }),
  /**
   * 新增人员信息
   * @arg {String} data 人员信息
   */
  addMoldPeron: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/add",
      params: data,
    }),
  /**
   * 修改人员信息
   * @arg {String} data 人员信息
   */
  updateMoldPeron: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/update",
      params: data,
    }),
  /**
   * 删除人员信息
   * @arg {Number} id 员工Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteMoldPeron: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmMold/deleteBasePfmMold?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`, //
      params: {},
    }),
  /**
   * 获取流程信息列表
   * @arg {String} workflowId OA流程ID
   * @arg {String} processName 流程名称
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getProcessList: ({ workflowId, processName, state, current, size }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseProcessType/getProcessPagelist",
      params: {
        current,
        size,
        entity: {
          workflowId,
          processName,
          state,
        },
      },
    }),

  /**
   * 获取所有系统流程
   */
  getProcessListAll: () =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseProcessType/getProcessList",
      params: {},
    }),
  /**
   * 新增流程信息
   * @arg {String} workflowId OA流程ID
   * @arg {String} processName 流程名称
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人名称
   */
  addProcess: ({ workflowId, processName, createBy, creator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseProcessType/saveProcess",
      params: {
        workflowId,
        processName,
        createBy,
        creator,
      },
    }),
  /**
   * 修改流程信息
   * @arg {Number} id 流程信息记录Id
   * @arg {String} workflowId OA流程ID
   * @arg {String} processName 流程名称
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人名称
   */
  updateProcess: ({ id, workflowId, processName, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "baseProcessType/updateProcess",
      params: {
        id,
        workflowId,
        processName,
        updateBy,
        updator,
      },
    }),
  /**
   * 删除流程信息
   * @arg {Number} id 流程信息记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteProcess: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `baseProcessType/deleteProces?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复流程信息
   * @arg {Number} id 流程信息记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreProcess: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `baseProcessType/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 获取系统字段管理列表
   * @arg {String} fieldName 字段名称
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getBasePfmMercolumnList: ({ fieldName, state, current, size }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMercolumn/getBasePfmMercolumnList",
      params: {
        current,
        size,
        entity: { fieldName, state },
      },
    }),
  /**
   * 删除系统字段管理数据
   * @arg {Number} id 字段Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteBasePfmMercolumn: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "DELETE",
      url: `basePfmMercolumn/deleteBasePfmMercolumn?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复系统字段管理数据
   * @arg {Number} id 字段Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreBasePfmMercolumn: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmMercolumn/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 新增系统字段管理数据
   * @arg {String} fieldName 字段名
   * @arg {String} fieldDescription 字段描述
   * @arg {String} fieldWidth 宽度
   * @arg {String} decimals 保留小数位
   * @arg {String} controlType 控件类型
   * @arg {String} sort 排序
   */
  saveMercolumn: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMercolumn/saveMercolumn",
      params: data,
    }),
  /**
   * 修改系统字段管理
   * @arg {Number} id 公司Id
   * @arg {String} fieldName 字段名
   * @arg {String} fieldText 字段描述
   * @arg {String} fieldWidth 宽度
   * @arg {String} keepDecimal 保留小数位
   * @arg {String} controlType 控件类型
   * @arg {String} sort 排序
   */
  updateMercolumn: (data) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "basePfmMercolumn/updateMercolumn",
      params: data,
    }),
  /**
   * 获取部门显示模板管理列表
   * @arg {String} fieldName 字段名称
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getBasePfmMergetBaseDeptColumnTemplateListcolumnList: ({
    state,
    templateName,
    current,
    size,
  }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseDeptColumnTemplate/getBaseDeptColumnTemplateList",
      params: {
        current,
        size,
        entity: { state, templateName },
      },
    }),
  /**
   * 删除部门显示模板信息
   * @arg {Number} id 公司Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteBaseDeptColumnTemplate: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "DELETE",
      url: `baseDeptColumnTemplate/deleteBaseDeptColumnTemplate?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复部门显示模板信息
   * @arg {Number} id 公司Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreBaseDeptColumnTemplate: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `baseDeptColumnTemplate/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 新增系统字段管理数据
   * @arg {String} templateName 模板名称
   * @arg {Number} deptId 部门Id
   * @arg {String} deptName 部门名称
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人姓名
   */
  saveDeptColumnTemplate: ({
    templateName,
    // deptId,
    // deptName,
    createBy,
    creator,
  }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseDeptColumnTemplate/saveDeptColumnTemplate",
      params: {
        templateName,
        // deptId,
        // deptName,
        createBy,
        creator,
      },
    }),
  /**
   * 修改系统字段管理
   * @arg {Number} id 模板id
   * @arg {String} templateName 模板名称
   * @arg {Number} deptId 部门Id
   * @arg {String} deptName 部门名称
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  updateDeptColumnTemplate: ({
    id,
    templateName,
    // deptId,
    // deptName,
    updateBy,
    updator,
  }) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "baseDeptColumnTemplate/updateDeptColumnTemplate",
      params: {
        id,
        templateName,
        // deptId,
        // deptName,
        updateBy,
        updator,
      },
    }),
  /**
   * 获取部门字段管理列表
   * @arg {String} fieldName 字段名称
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getBaseDeptColumnTemplateList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "baseDeptColumnTemplate/getBaseDeptColumnTemplateList",
      params: data,
    }),
  updateTemplate: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMold/updateTemplate",
      params: data,
    }),
  /**
   * 获取部门字段管理右边表格数据列表
   */
  getMercolumns: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relNodeDept/getMercolumns",
      params: data,
    }),
  /**
   * 删除系统字段管理数据
   * @arg {Number} id 公司Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteRelNodeDept: (data) =>
    req({
      baseUrl: "pms",
      method: "post",
      url: `relNodeDept/deleteRelNodeDept`,
      params: data,
    }),
  /**
   * 获取部门默认信息列表
   * @arg {Array} companyIds 公司ids
   * @arg {Array} deptIds 部门Ids
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getDeptDefaultInfoList: ({ companyIds, deptIds, state, current, size }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relDeptDefaultInformation/getPagelist",
      params: {
        current,
        size,
        entity: {
          companyIds,
          deptIds,
          state,
        },
      },
    }),
  /**
   * 新增部门默认信息
   * @arg {String} data 请求参数
   */
  addDeptDefaultInfo: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relDeptDefaultInformation/saveDeptDefaultInformation",
      params: data,
    }),
  /**
   * 修改部门默认信息
   * @arg {String} data 请求参数
   */
  updateDeptDefaultInfo: (data) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "relDeptDefaultInformation/updateDeptDefaultInformation",
      params: data,
    }),
  /**
   * 删除部门默认信息
   * @arg {Number} id 部门默认信息记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteDeptDefaultInfo: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `relDeptDefaultInformation/deleteDeptDefaultInformation?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复部门默认信息
   * @arg {Number} id 部门默认信息记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreDeptDefaultInfo: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `relDeptDefaultInformation/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 获取节点字段数据列表
   * @arg {Number} processId 流程Id
   * @arg {Number} nodeId 节点Id
   * @arg {String} state 逻辑删除，0: 正常; 1: 删除;
   * @arg {Number} current 页码
   * @arg {Number} size 分页大小
   */
  getNodeColumnsList: ({ processId, nodeId, state, current, size }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relNodeColumns/getNodeColumnsPagelist",
      params: {
        current,
        size,
        entity: {
          processId,
          nodeId,
          state,
        },
      },
    }),
  /**
   * 根据流程Id获取流程节点
   * @arg {Number} workflowId 流程Id
   */
  getNodeListByWorkflowId: (workflowId) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `relNodeColumns/getNodeListByWorkflowId?workflowId=${workflowId}`,
      params: {},
    }),
  /**
   * 新增节点字段
   * @arg {Object} data 请求参数
   */
  addNodeColumns: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relNodeColumns/saveNodeColumns",
      params: data,
    }),
  /**
   * 修改节点字段
   * @arg {Number} id 节点字段记录Id
   * @arg {Number} columnEdit 是否可编辑 0: 是; 1: 否;
   * @arg {Number} columnShow 是否可显示 0: 是; 1: 否;
   * @arg {Number} updateBy 修改人工号
   * @arg {String} updator 修改人名称
   */
  updateNodeColumns: ({ id, columnEdit, columnShow, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "relNodeColumns",
      params: {
        id,
        columnEdit,
        columnShow,
        updateBy,
        updator,
      },
    }),
  /**
   * 删除节点字段数据
   * @arg {Number} id 节点字段数据记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteNodeColumns: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `relNodeColumns/deleteNodeColumns?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 恢复节点字段数据
   * @arg {Number} id 节点字段数据记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  restoreNodeColumns: ({ id, updateBy, updator }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: `relNodeColumns/restore?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    }),
  /**
   * 新增系统字段管理数据
   * @arg {String} fieldName 字段名
   * @arg {String} fieldDescription 字段描述
   * @arg {String} fieldWidth 宽度
   * @arg {String} decimals 保留小数位
   * @arg {String} controlType 控件类型
   * @arg {String} sort 排序
   */
  saveRelNodeDept: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relNodeDept/saveRelNodeDept",
      params: data,
    }),
  /**
   * 修改系统字段管理
   * @arg {Number} id 公司Id
   * @arg {String} fieldName 字段名
   * @arg {String} fieldText 字段描述
   * @arg {String} fieldWidth 宽度
   * @arg {String} keepDecimal 保留小数位
   * @arg {String} controlType 控件类型
   * @arg {String} sort 排序
   */
  updateRelNodeDept: (data) =>
    req({
      baseUrl: "pms",
      method: "PUT",
      url: "relNodeDept/updateRelNodeDept",
      params: data,
    }),
  ///获取所有系统字段
  getBasePfmMercolumnListTwo: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmMercolumn/getList",
      params: data,
    }),
  /**
   *    获取员工对应的部门id
   * @arg {Object} data 请求参数
   */
  getEnableDeptList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relAuthorityDept/getEnableDeptList",
      params: data,
    }),
  /**
   *    修改人员管辖部门权限信息
   * @arg {Object} data 请求参数
   */
  updateRelAuthorityDept: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relAuthorityDept/updateRelAuthorityDept",
      params: data,
    }),
  /**
   *    汇总获取员工对应的部门id
   * @arg {Object} data 请求参数
   */
  relgetEnableDeptList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relSummaryDept/getEnableDeptList",
      params: data,
    }),
  /**
   * 汇总修改人员管辖部门权限信息
   * @arg {Object} data 请求参数
   */
  relupdateRelAuthorityDept: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "relSummaryDept/updateRelSummaryDept",
      params: data,
    }),
  /**
   * 获取公司板块数据
   * @arg {Object} data 请求参数
   */
  getCompanyModulePart: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "basePfmCompanyModule/getDeptmentPageList",
      params: data,
    }),
};
