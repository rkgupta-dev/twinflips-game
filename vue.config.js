const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "GameZone",
    short_name: "GameZone",
    themeColor: "#673AB7", // or your app's main color
    backgroundColor: "#673AB7",
    display: "standalone",
    start_url: ".",
    manifestOptions: {
      short_name: "GameZone",
      name: "GameZone",
      icons: [
        {
          src: "img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
});
