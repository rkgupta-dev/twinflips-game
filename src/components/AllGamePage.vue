<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>All Game</v-toolbar-title>
    </v-app-bar>

    <v-container fluid>
      <!-- Hero Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="hero-card overflow-hidden" height="260">
            <v-img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              height="100%"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.8)"
            >
              <v-card-title class="white--text text-h4 font-weight-bold mt-8">
                Discover New Games
              </v-card-title>
              <v-card-subtitle class="white--text text-h6">
                Explore our collection of premium titles
              </v-card-subtitle>

              <v-card-actions class="ml-4 mb-4">
                <v-chip color="primary" text-color="white" class="mr-2">
                  Action
                </v-chip>
                <v-chip color="cyan darken-2" text-color="white" class="mr-2">
                  RPG
                </v-chip>
                <v-chip color="teal" text-color="white"> Strategy </v-chip>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <!-- Search Bar -->
      <v-row class="m-0 p-0">
        <v-col cols="12" md="6" class="mx-auto">
          <v-text-field
            v-model="searchQuery"
            label="Search Games"
            prepend-inner-icon="mdi-magnify"
            outlined
            dense
            clearable
            rounded
            @click:clear="onClearSearch"
          />
        </v-col>
      </v-row>

      <!-- Horizontal Scrollable Grid (2 cols per group) -->
      <div class="horizontal-scroll-wrapper">
        <div
          class="scroll-row"
          v-for="group in groupedGames"
          :key="group[0].id"
        >
          <div v-for="game in group" :key="game.id" class="scroll-card">
            <v-card class="game-card" hover elevation="3">
              <v-img
                :src="game.image"
                height="150"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
                <v-card-title class="text-h6">{{ game.title }}</v-card-title>
              </v-img>
              <v-card-text>
                <v-row align="center" class="mx-0 mb-2">
                  <v-rating
                    :value="game.rating"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                  <div class="grey--text ml-2">
                    {{ game.rating.toFixed(1) }}
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip
                    small
                    :color="game.isNew ? 'deep-purple' : 'grey'"
                    text-color="white"
                    class="ml-2"
                  >
                    {{ game.isNew ? "NEW" : game.releaseYear }}
                  </v-chip>
                </v-row>

                <div class="my-2 text-subtitle-1">{{ game.genre }}</div>
                <div class="truncate-text">{{ game.description }}</div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-actions>
                <v-btn color="deep-purple darken-2" text>Details</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="white--text"
                  rounded
                  @click="playGame(game.id)"
                >
                  <v-icon left>mdi-play-circle</v-icon>
                  Play
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      games: [
        {
          id: 1,
          title: "Cyber Nexus",
          description:
            "An open-world cyberpunk adventure with stunning visuals and immersive gameplay.",
          image:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1350&q=80",
          rating: 4.7,
          genre: "Action RPG",
          releaseYear: 2023,
          isNew: true,
        },
        {
          id: 2,
          title: "Stellar Odyssey",
          description:
            "Explore the vastness of space in this epic sci-fi adventure game.",
          image:
            "https://images.unsplash.com/photo-1581822261290-991b38693d1b?auto=format&fit=crop&w=1350&q=80",
          rating: 4.5,
          genre: "Space Simulation",
          releaseYear: 2022,
          isNew: false,
        },
        {
          id: 3,
          title: "Shadow Legends",
          description:
            "Embark on a dark fantasy journey filled with magic and monsters.",
          image:
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1350&q=80",
          rating: 4.8,
          genre: "Fantasy RPG",
          releaseYear: 2023,
          isNew: true,
        },
        {
          id: 4,
          title: "Racing Evolution",
          description:
            "Experience high-speed racing with realistic physics and stunning graphics.",
          image:
            "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1350&q=80",
          rating: 4.2,
          genre: "Racing",
          releaseYear: 2022,
          isNew: false,
        },
        {
          id: 5,
          title: "Tactical Force",
          description:
            "Lead your elite squad through intense tactical combat missions.",
          image:
            "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=1350&q=80",
          rating: 4.6,
          genre: "Tactical Shooter",
          releaseYear: 2023,
          isNew: true,
        },
        {
          id: 6,
          title: "Kingdom Builder",
          description:
            "Build and manage your medieval kingdom in this strategy simulation game.",
          image:
            "https://images.unsplash.com/photo-1563811771046-ba984ff30900?auto=format&fit=crop&w=1350&q=80",
          rating: 4.3,
          genre: "Strategy",
          releaseYear: 2021,
          isNew: false,
        },
      ],
    };
  },
  computed: {
    filteredGames() {
      const query = this.searchQuery.toLowerCase();
      return this.games.filter((game) =>
        game.title.toLowerCase().includes(query)
      );
    },
    groupedGames() {
      // Group into arrays of 2 items
      const groups = [];
      for (let i = 0; i < this.filteredGames.length; i += 2) {
        groups.push(this.filteredGames.slice(i, i + 2));
      }
      return groups;
    },
  },
  methods: {
    playGame(id) {
      alert(`Play game with ID: ${id}`);
    },
    onClearSearch() {
      this.searchQuery = ""; // Not always needed but ensures reactivity
    },
  },
};
</script>

<style scoped>
.horizontal-scroll-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 16px;
}
.scroll-row {
  display: inline-flex;
  margin-right: 16px;
}
.scroll-card {
  width: 250px;
  margin-right: 12px;
}
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.game-card {
  border-radius: 15px;
  transition: transform 0.2s;
}
.game-card:hover {
  transform: scale(1.02);
}
</style>
