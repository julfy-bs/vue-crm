import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import info from "./info";
import category from "@/store/category";
import record from "@/store/record";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    async fetchCurrency() {
      // const key = process.env.VUE_APP_FIXER;
      const res = await fetch(
        //  fixer exchange rates
        // `http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`
        `https://api.exchangeratesapi.io/latest?base=RUB&symbols=RUB,EUR,USD`
      );
      return await res.json();
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth,
    info,
    category,
    record
  }
});
