import Vue from "vue";
import Router from "vue-router";
import AboutPage from "./components/AboutPage.vue";
import MemoryGame from "./components/MemoryGame.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", component: MemoryGame },
    { path: "/about", component: AboutPage },
  ],
});
