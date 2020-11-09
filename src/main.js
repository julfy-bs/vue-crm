import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter";
import messagePlugin from "./utils/message.plugin";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter("date", dateFilter);

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
