import Vue from "vue";
import Router from "vue-router";
import AboutPage from "./components/AboutPage.vue";
import MemoryGame from "./components/MemoryGame.vue";
import SnakeGame from "./components/SnakeGame.vue";
import HomePage from "./components/HomePage.vue";
import XoxoGame from "./components/XoxoGame.vue";
import FlappyBirdGame from "./components/FlappyBirdGame.vue";
import AllGamePage from "./components/AllGamePage.vue";
import BlockBlastGame from "./components/BlockBlastGame.vue";
import FruitFrenzyGame from "./components/FruitFrenzyGame.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/memory-game", component: MemoryGame },
    { path: "/", component: HomePage },
    { path: "/all-games", component: AllGamePage },
    { path: "/about", component: AboutPage },
    { path: "/snake-game", component: SnakeGame },
    { path: "/xoxo-game", component: XoxoGame },
    { path: "/flappybird-game", component: FlappyBirdGame },
    { path: "/blockblast-game", component: BlockBlastGame },
    { path: "/fruitfrenzy-game", component: FruitFrenzyGame },
  ],
});
