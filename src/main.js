import Vue from "vue";
import Vuelidate from "vuelidate";
import Paginate from "vuejs-paginate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMeta from "vue-meta";
import dateFilter from "@/filters/date.filter";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";
import tooltipDirective from "@/directives/tooltip.directive";
import messagePlugin from "./utils/message.plugin";
import titlePlugin from "./utils/title.plugin";
import Loader from "@/components/app/Loader";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;
Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.use(Vuelidate);
Vue.use(VueMeta);
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.filter("localize", localizeFilter);
Vue.directive("tooltip", tooltipDirective);
Vue.component("Loader", Loader);
Vue.component("Paginate", Paginate);
const firebaseConfig = {
  apiKey: "AIzaSyBVqa1qlT4uluCdU6gNAiov5NipuB6-x-I",
  authDomain: "vue-crm-qqq.firebaseapp.com",
  databaseURL: "https://vue-crm-qqq.firebaseio.com",
  projectId: "vue-crm-qqq",
  storageBucket: "vue-crm-qqq.appspot.com",
  messagingSenderId: "313568038036",
  appId: "1:313568038036:web:1ce649d90b31aad88ab881",
  measurementId: "G-BC5YZF6LZN"
};
firebase.initializeApp(firebaseConfig);
let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
