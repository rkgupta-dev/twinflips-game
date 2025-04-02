<template>
  <v-app>
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

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    // No need for additional data properties
  }),

  methods: {
    toggleTheme() {
      const newTheme = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = newTheme;
      localStorage.setItem("darkMode", newTheme); // Save the theme preference
    },
  },

  mounted() {
    // Load theme preference from localStorage on app start
    const savedTheme = localStorage.getItem("darkMode") === "true";
    this.$vuetify.theme.dark = savedTheme;
  },
};
</script>
