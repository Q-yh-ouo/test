/*
 * @author: 郭湛良-景兴
 * @since: 2021-06-28
 */
let components = {
  personalStatistics: () =>
    import("./statisticsPage/personalStatistics/index.vue"),
  departmentStatistics: () =>
    import("./statisticsPage/departmentStatistics/index.vue"),
  companyStatistics: () =>
    import("./statisticsPage/companyStatistics/index.vue"),
};
export default components;
