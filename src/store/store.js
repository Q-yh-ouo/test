import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
let store = new Vuex.Store({
  state: {
    personSearchInfo: {
      sapnum: null,
      company: null,
      department: null,
      departmentName: null,
      month: null,
      beginDate: null,
      endDate: null,
      lastMonth: null,
      lastBeginDate: null,
      lastEndDate: null,
      subdivisionsDepartment: null,
    },
    departSearchInfo: {},
    companySearchInfo: {},
  },

  getters: {
    getPersonInfo(state) {
      return state.personSearchInfo;
    },
  },
  actions: {
    setPersonInfo({ commit, state }, data) {
      commit("setPersonSearch", data);
    },
  },
  mutations: {
    setPersonSearch(state, data) {
      state.personSearchInfo = { ...data };
    },
  },
});

export default store;
