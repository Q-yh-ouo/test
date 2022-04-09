let components = {
  formApplication: () => import("./systemFlow/formApplication.vue"),
  gradingApplication: () => import("./systemFlow/gradingApplication.vue"),
  haveDoList: () => import("./systemFlow/haveDoList.vue"),
  summaryApplication: () => import("./systemFlow/summaryApplication.vue"),
  toDoList: () => import("./systemFlow/toDoList.vue"),
};
export default components;
