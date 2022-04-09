/*
 * @author: 郭湛良-景兴
 * @since: 2021-06-18
 */
import req from "@/api/req";
export default {
  /**
   * 待办转入，根据单据编号获取考核表申请流程详情
   * @arg {String} billNum 单据编号
   */
  getApplybillTableBybillNum: (billNum) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillTable/getApplybillTableBybillNum",
      params: {
        billNum,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 删除评分流程信息
   * @arg {Number} id 评分流程信息Id
   * @arg {String} modifySapnum 修改人工号
   * @arg {String} modifyName 修改人名称
   */
  deleteApplybillScoreTable: ({ id, modifySapnum, modifyName }) => {
    return req({
      baseUrl: "pms",
      method: "DELETE",
      url: `datPfmApplybillScore/delApplyBillScore?id=${id}&modifySapnum=${modifySapnum}&modifyName=${modifyName}`,
      params: {},
    });
  },
  /**
   * 已有流程提交到下一节点审批
   * @arg {String} billNum 流程号
   * @arg {Number} appSelfTotal 自评总分
   * @arg {Number} appTotal 考核总分
   * @arg {Number} appeal 是否申诉
   * @arg {String} createBy 当前操作人工号
   * @arg {String} creator 当前操作人姓名
   * @arg {Number} isDeductPoints 是否有加扣分项 0-否，1-是
   * @arg {Number} isReturn 是否退回 0-否，1-是
   * @arg {Number} returnNode 退回节点id
   * @arg {String} remark 签字意见
   * @arg {Number} sjTotal 上级评分
   * @arg {Array} tableDetailList 评分明细信息
   */
  submitApplyScoreBacklog: ({
    billNum,
    appSelfTotal,
    appTotal,
    appeal,
    createBy,
    creator,
    isDeductPoints,
    isReturn,
    returnNode,
    remark,
    sjTotal,
    tableDetailList,
  }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/submitApplyScoreBacklog",
      params: {
        billNum,
        appSelfTotal,
        appTotal,
        appeal,
        createBy,
        creator,
        isDeductPoints,
        isReturn,
        returnNode,
        remark,
        sjTotal,
        tableDetailList,
      },
    });
  },
  /**
   * 待办转入，获取详情评分流程（合并评分）
   * @arg {String} billNum 单据编号
   * @arg {Boolean} isBacklog 是否待办 true: 待办; false: 已办;
   * @arg {String} createBy 当前操作人工号
   */
  getApplyBillNumScoreBatchVO: ({ billNum, isBacklog, createBy }) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillScore/getApplyBillNumScoreBatchVO",
      params: {
        billNum,
        isBacklog,
        createBy,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 评分流程 批量提交待审核接口
   * @arg {String} billNum 单据编号
   * @arg {Number} appeal 是否申诉 0: 是; 1: 否;
   * @arg {Number} isReturn 是否退回 0: 是; 1: 否;
   * @arg {String} remark 签字意见
   * @arg {String} createBy 当前操作人工号
   * @arg {String} creator 当前操作人姓名
   * @arg {Array} tableDetailList 评分明细信息
   */
  submitApplyScoreBacklogBatch: (formData) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/submitApplyScoreBacklogBatch",
      params: formData,
    });
  },
  /**
   * 考核申请表 提交待审核接口
   * @arg {String} billNum 单据编号
   * @arg {Number} appeal 是否申诉 0: 是; 1: 否;
   * @arg {Number} isReturn 是否退回 0: 是; 1: 否;
   * @arg {String} remark 签字意见
   * @arg {String} createBy 当前操作人工号
   * @arg {String} creator 当前操作人姓名
   * @arg {Array} tableDetailList 评分明细信息
   */
  submitApplyTableBacklog: (formData) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillTable/submitApplyTableBacklog",
      params: formData,
    });
  },
  /**
   * 根据流程 requestId获取可退回的节点列表
   * @arg {String} requestId requestId
   */
  getReturnNodeList: (requestId) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "OAWorkFlow/getReturnNodeList",
      params: {
        requestId,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 提交评分流程信息（批量提交）
   * @arg {Array} applybillNumScoreVOS 申请单列表
   * @arg {Object} applybillScoreVO 抬头信息
   * @arg {Array} tableDetailList 明细信息
   ****************************************
   * @arg {Number} isScore 是否评分不限制， 0-是，1-否
   * @arg {Number} merge 是否合并评分， 0-是，1-否
   */
  submitApplyBillScoreBatch: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/submitApplyBillScoreBatch",
      params: data,
    }),
  /**
   * 提交评分流程信息
   * @arg {Object} applybillScoreVO 抬头信息
   * @arg {Array} tableDetailList 明细信息
   * @arg {Number} isScore 是否评分不限制， 0-是，1-否
   * @arg {Number} merge 是否合并评分， 0-是，1-否
   */
  submitApplyBillScore: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/submitApplyBillScore",
      params: data,
    }),
  /**
   * 保存评分表申请流程信息（批量保存）
   * @arg {Array} applybillNumScoreVOS 申请单列表
   * @arg {Object} applybillScoreVO 抬头信息
   * @arg {Array} tableDetailList 明细信息
   ****************************************
   * @arg {Number} isScore 是否评分不限制， 0-是，1-否
   * @arg {Number} merge 是否合并评分， 0-是，1-否
   */
  savaApplyBillScoreBatch: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/savaApplyBillScoreBatch",
      params: data,
    }),
  /**
   * 待办转入，根据单据编号获取评分流程的详情
   * @arg {String} billNum 单据编号
   * @arg {Boolean} isBacklog 是否待办  true: 待办; false: 已办;
   */
  getApplyBillNumScoreVO: (billNum, isBacklog) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillScore/getApplyBillNumScoreVO",
      params: {
        billNum,
        isBacklog,
      },
      isOriginalGET: 1,
    }),
  /**
   * 保存评分表申请流程信息
   * @arg {Object} applybillScoreVO 抬头信息
   * @arg {Array} tableDetailList 明细信息
   */
  savaApplyBillScore: ({ applybillScoreVO, tableDetailList }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillScore/savaApplyBillScore",
      params: {
        applybillScoreVO,
        tableDetailList,
      },
    }),
  /**
   * 发起评分流程的时候的详情
   * @arg {String} sapNum 员工工号
   */
  getApplySapNumScoreVO: (sapNum) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillScore/getApplySapNumScoreVO",
      params: {
        sapNum,
      },
      isOriginalGET: 1,
    }),
  /**
   *   获取待办事宜
   * @arg {Object} data 请求参数
   */
  getWorkflowList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "todoWorkflow/getWorkflowList",
      params: {
        current: data.current,
        size: data.size,
        entity: {
          ...data.data,
        },
      },
    }),
  /**
   *    获取已办事宜
   * @arg {Object} data 请求参数
   */
  haveGetWorkflowList: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "handledWorkflow/getWorkflowList",
      params: {
        current: data.current,
        size: data.size,
        entity: {
          ...data.data,
        },
      },
    }),
  /**
   * 已办导出
   * @arg {Object} data 请求参数
   */
  exportDetail: (data) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "handledWorkflow/exportDetail",
      params: data,
    }),
  /**
   * 保存考核表申请流程明细信息
   * @arg {Number} mostlyId 考核表申请流程信息记录Id
   * @arg {Array} addDetailList 新增的明细信息列表
   * @arg {Array} updateDetailList 修改的明细信息列表
   * @arg {Array} deleteDetailList 删除的明细信息 Id 集合
   * @arg {String} operatorSapNum 操作人工号
   * @arg {String} operatorName 操作人姓名
   */
  saveApplybillTableDetailList: ({
    mostlyId,
    addDetailList,
    updateDetailList,
    deleteDetailList,
    operatorSapNum,
    operatorName,
  }) =>
    req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmTableDetail/saveChangeBatch",
      params: {
        mostlyId,
        addDetailList,
        updateDetailList,
        deleteDetailList,
        operatorSapNum,
        operatorName,
      },
    }),
  /**
   * 处理流程业务（提交）
   * @arg {Number} id 考核表申请流程信息抬头Id
   */
  disposeWorkflow: (id) =>
    req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillTable/disposeWorkflow",
      params: {
        id,
      },
      isOriginalGET: 1,
    }),
  /**
   * 根据 Id 获取考核表申请流程信息
   * @arg {Number} id 已保存的申请表的Id
   */
  getApplybillTableById: (id) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillTable/getApplybillTableById",
      params: {
        id,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 删除考核表申请流程信息
   * @arg {Number} id 考核表申请流程信息记录Id
   * @arg {String} updateBy 修改人工号
   * @arg {String} updator 修改人姓名
   */
  deleteApplybillTable: ({ id, updateBy, updator }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: `datPfmApplybillTable/deleteApplybillTable?id=${id}&modifySapnum=${updateBy}&modifyName=${updator}`,
      params: {},
    });
  },
  /**
   * 获取流程明细列（字段）
   * @arg {Number} processId 流程Id
   * @arg {Number} nodeId 流程节点Id
   * @arg {Number} templateId 模板Id（人员信息中的）
   */
  getDetailColumnList: (processId, nodeId, templateId) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: `basePfmMercolumn/getDetailColumnList?processId=${processId}&nodeId=${nodeId}&templateId=${templateId}`,
      params: {},
    });
  },
  /**
   * 保存考核表申请流程信息
   * @arg {Object} data 请求参数
   */
  saveApplybillTable: (data) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillTable/saveApplybillTable",
      params: data,
    });
  },
  /**
   * 发起考核汇总流程 详情
   * @arg {String} applyDeptId 汇总部门Id 多部门传值格式: '17,16';
   * @arg {String} applyDeptName 汇总部门Id 多部门传值格式: '人力资源部,行政部';
   * @arg {Number} applySummaryType 汇总类型 0: 月度; 1: 季度; 2: 年度; 3: 全年季度;
   * @arg {String} applyBeginDate 汇总开始时间
   * @arg {String} applyEndDate 汇总结束时间
   * @arg {String} createBy 创建人工号
   * @arg {String} creator 创建人姓名
   */
  getPfmSummaryDetail: ({
    applyDeptId,
    applyDeptName,
    applySummaryType,
    applyBeginDate,
    applyEndDate,
    createBy,
    creator,
  }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillSummary/getPfmSummaryDetail",
      params: {
        applyDeptId,
        applyDeptName,
        applySummaryType,
        applyBeginDate,
        applyEndDate,
        createBy,
        creator,
      },
    });
  },
  /**
   * 待办转入，获取汇总流程详情
   * @arg {String} billNum 单据编号
   */
  getApplyBillNumSummaryVO: (billNum) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillSummary/getApplyBillNumSummaryVO",
      params: {
        billNum,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 根据部门id 获取部门负责人信息
   * @arg {Number} deptId 部门Id
   */
  getApplyEmployeeListByDeptId: (deptId) => {
    return req({
      baseUrl: "pms",
      method: "GET",
      url: "datPfmApplybillSummary/getApplyEmployeeList",
      params: {
        deptId,
      },
      isOriginalGET: 1,
    });
  },
  /**
   * 保存汇总申请表申请流程信息
   * @arg {Object} applySummary 抬头信息
   * @arg {Object} summaryDetail 明细信息
   */
  savaApplyBillSummary: ({ applySummary, summaryDetail }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillSummary/savaApplyBillSummary",
      params: {
        applySummary,
        summaryDetail,
      },
    });
  },
  /**
   * 删除汇总申请流程信息
   * @arg {Number} id 评分流程信息Id
   * @arg {String} modifySapnum 修改人工号
   * @arg {String} modifyName 修改人名称
   */
  delApplyBillSummary: ({ id, modifySapnum, modifyName }) => {
    return req({
      baseUrl: "pms",
      method: "DELETE",
      url: `datPfmApplybillSummary/delApplyBillSummary?id=${id}&modifySapnum=${modifySapnum}&modifyName=${modifyName}`,
      params: {},
    });
  },
  /**
   * 提交汇总申请流程信息
   * @arg {Object} applySummary 抬头信息
   * @arg {Object} summaryDetail 明细信息
   */
  submitApplyBillSummary: ({ applySummary, summaryDetail }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillSummary/submitApplyBillSummary",
      params: {
        applySummary,
        summaryDetail,
      },
    });
  },
  /**
   * 汇总流程 提交待审核
   * @arg {Object} applySummary 抬头信息
   * @arg {Object} summaryDetail 明细信息
   */
  submitApplySummaryBacklog: ({ applySummary, summaryDetail }) => {
    return req({
      baseUrl: "pms",
      method: "POST",
      url: "datPfmApplybillSummary/submitApplySummaryBacklog",
      params: {
        applySummary,
        summaryDetail,
      },
    });
  },
};
