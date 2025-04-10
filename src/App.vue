<template>
  <v-app>
    <v-main>
      <router-view />

      <!-- Bottom Nav -->
      <v-sheet
        v-if="!isGameRoute"
        color="primary"
        class="d-flex justify-space-around align-center pa-2"
        elevation="8"
        height="50"
        tile
        style="position: fixed; bottom: 0; width: 100%"
      >
        <v-btn to="/" exact text class="no-style-btn" :ripple="false">
          <v-icon left>mdi-home</v-icon>
          Home
        </v-btn>

        <v-btn to="/all-games" text class="no-style-btn" :ripple="false">
          <v-icon left>mdi-nintendo-game-boy</v-icon>
          All Games
        </v-btn>

        <v-btn to="/about" text class="no-style-btn" :ripple="false">
          <v-icon left>mdi-information</v-icon>
          About
        </v-btn>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    isGameRoute() {
      const gamePaths = [
        "/memory-game",
        "/snake-game",
        "/xoxo-game",
        "/flappybird-game",
        "/blockblast-game",
        "/fruitfrenzy-game",
      ];
      const path = this.$route.path.replace(/\/$/, ""); // remove trailing slash
      return gamePaths.includes(path);
    },
  },
};
</script>

<style scoped>
.no-style-btn {
  background-color: transparent !important;
  box-shadow: none !important;
  color: white !important;
  min-width: auto;
  padding: 4px 8px;
  border-radius: 20px !important; /* Makes the button fully rounded */
}

/* Prevent Vuetify/router from changing active styles */
.no-style-btn.v-btn--active,
.no-style-btn.router-link-exact-active,
.no-style-btn.router-link-active {
  background-color: transparent !important;
  color: white !important;
}
</style>
