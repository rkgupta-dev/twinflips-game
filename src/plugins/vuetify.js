import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// Get saved theme preference from localStorage or default to 'dark'
const savedTheme = localStorage.getItem("darkMode") === "true";

export default new Vuetify({
  theme: {
    dark: savedTheme, // Set initial theme from localStorage
    themes: {
      light: {
        primary: "#651FFF",
        secondary: "#00712D",
      },
      dark: {
        primary: "#42A5F5",
        secondary: "#D91656",
      },
    },
  },
});
