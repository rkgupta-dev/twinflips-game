const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "GameZone",
    short_name: "GameZone",
    themeColor: "#651FFF", // or your app's main color
    backgroundColor: "#651FFF",
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
