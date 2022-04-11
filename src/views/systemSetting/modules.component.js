/*
 * @author: 方景哲
 * @since: 2021-05-11
 */
let components = {
  personnelManagement: () => import("./systemSettings/personnelManagement"),
  companyManagement: () => import("./systemSettings/companyManagement"),
  departmentalManagement: () =>
    import("./systemSettings/departmentalManagement"),
  systemFieldManagement: () => import("./systemSettings/systemFieldManagement"),
  departmentTemplateManagement: () =>
    import("./systemSettings/departmentTemplateManagement"),
  nodeFieldManagement: () => import("./systemSettings/nodeFieldManagement"),
  departmentFieldManagement: () =>
    import("./systemSettings/departmentFieldManagement"),
  formManagement: () => import("./systemSettings/formManagement"),
  departmentDefaultManagement: () =>
    import("./systemSettings/departmentDefaultManagement"),
  menuManagement: () => import("./systemSettings/menuManagement"),
  organizationalManagement: () =>
    import("./systemSettings/organizationalManagement"),
  userManagement: () => import("./systemSettings/userManagement"),
  processManagement: () => import("./systemSettings/processManagement"),
  rewardAndPunishmentManagement: () =>
    import("./systemSettings/rewardAndPunishmentManagement"),
};
export default components;
