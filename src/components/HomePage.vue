<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="https://cdn-icons-png.flaticon.com/128/720/720284.png"
          transition="scale-transition"
          width="40"
        />
        <span class="text-h6">GameZone</span>
      </div>

      <v-spacer></v-spacer>

      <!-- About Page Icon Button -->
      <!-- <v-btn icon to="/about">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn> -->

      <!-- Dark Mode Toggle -->
      <v-btn @click="toggleTheme" icon>
        <v-icon>{{
          $vuetify.theme.dark ? "mdi-weather-night" : "mdi-white-balance-sunny"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container>
      <!-- Auto-scroll Featured Games Carousel -->
      <div>
        <v-carousel cycle height="200px" hide-delimiters>
          <v-carousel-item v-for="(game, index) in homeBanners" :key="index">
            <v-img
              :src="game.image"
              :alt="game.title"
              class="carousel-image rounded-image"
            ></v-img>
          </v-carousel-item>
        </v-carousel>
      </div>

      <!-- Section Title -->
      <div class="my-4 text-subtitle-1 font-weight-bold text-primary">
        Top Games
        <v-icon right color="primary">mdi-gamepad-variant</v-icon>
      </div>

      <!-- All Games Grid with 3 cards per row -->
      <v-row dense>
        <v-col v-for="game in allGames" :key="game.title" cols="4">
          <v-card
            @click="$router.push(game.link)"
            class="game-card custom-border"
            :class="themeClass"
          >
            <v-img
              :src="game.image"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="115px"
              contain
            >
              <v-card-subtitle>{{ game.title }}</v-card-subtitle>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeBanners: [
        {
          title: "Game 1",
          image:
            "https://img.freepik.com/free-vector/astronaut-alien-explore-planet-far-galaxy_107791-2322.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid",
        },
        {
          title: "Game 2",
          image:
            "https://img.freepik.com/free-vector/space-game-level-background-with-crystal-platforms-rocket_88138-1122.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid&w=740",
        },
        {
          title: "Game 3",
          image:
            "https://img.freepik.com/free-vector/exotic-tropical-snake-tree-jungle-with-pond_107791-8732.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid&w=740",
        },
      ],
      allGames: [
        {
          title: "Memory Matching",
          image: "https://cdn-icons-png.flaticon.com/256/8715/8715328.png",
          link: "/memory-game",
        },
        {
          title: "Snake",
          image: "https://cdn-icons-png.flaticon.com/256/10757/10757414.png",
          link: "/snake-game",
        },
        {
          title: "Tic-Tac-Toe",
          image: "https://cdn-icons-png.flaticon.com/256/9933/9933737.png",
          link: "/xoxo-game",
        },
        {
          title: "Flappy Bird",
          image: "https://cdn-icons-png.flaticon.com/128/1496/1496830.png",
          link: "/flappybird-game",
        },
      ],
    };
  },
  computed: {
    themeClass() {
      return this.$vuetify.theme.dark ? "dark-mode" : "light-mode";
    },
  },
  mounted() {
    // Load theme preference from localStorage on app start
    const savedTheme = localStorage.getItem("darkMode") === "true";
    this.$vuetify.theme.dark = savedTheme;
  },
  methods: {
    toggleTheme() {
      const newTheme = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = newTheme;
      localStorage.setItem("darkMode", newTheme); // Save the theme preference
    },
  },
};
</script>

<style scoped>
.custom-border {
  border: 1px solid var(--border-color) !important;
  border-radius: 10px;
}

.light-mode {
  --border-color: #6a1b9a;
}

.dark-mode {
  --border-color: #42a5f5;
}

.carousel-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.rounded-image {
  border-radius: 15px;
}

.game-card {
  background-image: linear-gradient(
    111.4deg,
    rgba(7, 7, 9, 1) 6.5%,
    rgba(27, 24, 113, 1) 93.2%
  );
  cursor: pointer;
  border-radius: 15px;
}

.game-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
}
</style>
