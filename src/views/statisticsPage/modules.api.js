/*
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
 */
import req from "@/api/req";

export default {
  /** ****************获取基础数据接口******************** */
  /**
   * 获取登录人的人员信息
   * @arg
   */
  GetloginpersonInfo: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: `basePfmMold/getMoldInfo?sapNum=${data}`,
      // params: data,
    });
  },
  /**
   * 获取登录人是否有权限打开公司跟部门模块页面
   * @arg
   */
  GetloginpersonDepartCompany: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: `basePfmMold/isDeptAuth?sapNum=${data}`,
      // params: data,
    });
  },
  /**
   * 获取当前登录人管辖部门权限的公司
   * @arg
   */
  GetloginpersonCompany: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: `basePfmCompany/getCompanyListByAuthDept?sapNum=${data}`,
      // params: data,
    });
  },
  /**
   * 获取当前登录人管辖部门权限的部门
   * @arg
   */
  GetloginpersonDepart: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: `basePfmDeptment/getDeptListByAuthDept`,
      params: data,
    });
  },

  /** ****************获取基础数据接口******************** */
  /** ****************个人统计页面接口******************** */
  /**
   * 个人统计页面 - 首页
   * @arg
   */
  GetDefaultMessagePerson: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getDefaultMessagePerson",
      params: data,
    });
  },
  /**
   * 个人统计页面 - 考核表 - 表头
   * @arg
   */
  GetDefaultProgressReviewHeader: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getShowColumn",
      params: data,
    });
  },
  /**
   * 个人统计页面 - 考核表 - 内容
   * @arg
   */
  GetDefaultProgressReviewDetail: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getPFMTableDetail",
      params: data,
    });
  },
  /**
   * 个人统计页面 - 绩效得分
   * @arg
   */
  GetDefaultPerformanceScore: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getScoreDetailPerson",
      params: data,
    });
  },
  /**
   * 个人统计页面 - 指标失分
   * @arg
   */
  GetDefaultLostScore: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getLostDetailPerson",
      params: data,
    });
  },
  /**
   * 个人统计页面 - 指标得分
   * @arg
   */
  GetDefaultPlusScore: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "person/getPlusDetailPerson",
      params: data,
    });
  },
  /** ****************个人统计页面接口******************** */
  /** ****************部门统计页面接口******************** */
  /**
   * 部门统计页面 - 指标失分
   * @arg
   */
  GetDepartLostScore: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getLostDetailDept",
      params: data,
    });
  },
  /**
   * 部门统计页面 - 指标得分
   * @arg
   */
  GetDepartPlusScore: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getPlusDetailDept",
      params: data,
    });
  },
  /**
   * 部门统计页面 - 绩效工资 - 月度绩效考核结果
   * @arg
   */
  GetDepartMonthlyPerformanceAppraisal: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getScoreDetail",
      params: data,
    });
  },
  /**
   * 部门统计页面 - 绩效工资 - 月度绩效工资
   * @arg
   */
  GetDepartMonthlyPerformancePay: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getWageDetail",
      params: data,
    });
  },
  /**
   * 部门统计页面 - 部门 - 年度考核结果
   * @arg
   */
  GetDepartYearlyPerformanceAppraisal: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getSummaryDept",
      params: data,
    });
  },
  /**
   * 部门统计页面 - 部门 - 首页
   * @arg
   */
  GetDepartSummary: (data) => {
    return req({
      baseUrl: "pms",
      method: "post",
      url: "department/getDefaultMessage",
      params: data,
    });
  },
  /** ****************部门统计页面接口******************** */
};
