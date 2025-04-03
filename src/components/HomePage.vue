<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="https://cdn-icons-png.flaticon.com/128/9192/9192463.png"
          transition="scale-transition"
          width="40"
        />
        <span class="text-h6">TwinFlip</span>
      </div>

      <v-spacer></v-spacer>

      <!-- About Page Icon Button -->
      <v-btn icon to="/about">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>

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
          <v-carousel-item v-for="(game, index) in featuredGames" :key="index">
            <v-img
              :src="game.image"
              :alt="game.title"
              class="carousel-image rounded-image"
            ></v-img>
          </v-carousel-item>
        </v-carousel>
      </div>

      <!-- Section Title -->
      <div class="my-5 font-weight-bold text-primary">
        All Games
        <v-icon right color="primary">mdi-gamepad-variant</v-icon>
      </div>

      <!-- All Games Grid with 3 cards per row -->
      <v-row justify="center">
        <v-col v-for="(game, index) in allGames" :key="index" cols="6">
          <v-card
            class="elevation-5 custom-border"
            rounded="xl"
            @click="$router.push(game.link)"
            :aria-label="`Go to ${game.title}`"
            role="button"
            tabindex="0"
            @keydown.enter="$router.push(game.link)"
            :class="themeClass"
          >
            <v-img
              :src="game.image"
              lazy-src="https://via.placeholder.com/150"
              height="100px"
              contain
            ></v-img>

            <v-card-text class="text-center py-2">
              <div class="text-subtitle-2 font-weight-bold">
                {{ game.title }}
              </div>
            </v-card-text>
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
      featuredGames: [
        {
          title: "Game 1",
          image:
            "https://img.freepik.com/free-vector/astronaut-alien-explore-planet-far-galaxy_107791-2322.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid",
        },
        {
          title: "Game 2",
          image:
            "https://img.freepik.com/free-vector/ludo-game-from-different-perspectives_23-2148695829.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid",
        },
        {
          title: "Game 3",
          image:
            "https://img.freepik.com/free-photo/huge-medieval-snake_587448-5095.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid",
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
</style>
