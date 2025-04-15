import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./registerServiceWorker";

import Vue2TouchEvents from "vue2-touch-events";
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
