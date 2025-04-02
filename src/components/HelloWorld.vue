<template>
  <v-container fluid class="bg-purple">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <h1>Memory Match Game</h1>

        <div>
          <v-chip class="mr-2" color="primary" outlined>
            Matches: {{ matches }} of {{ cards.length / 2 }}
          </v-chip>
          <v-chip color="primary" outlined> Time: {{ formatTime }} </v-chip>
        </div>

        <v-card class="my-5 custom-border" :class="themeClass">
          <v-card-text>
            <v-row>
              <v-col
                v-for="(card, index) in cards"
                :key="card.id"
                cols="4"
                sm="4"
              >
                <v-card
                  @click="handleCardClick(index)"
                  height="100"
                  class="d-flex align-center justify-center custom-border"
                  :class="themeClass"
                >
                  <div>
                    <div
                      v-if="flippedIndexes.includes(index) || card.isMatched"
                      class="d-flex align-center justify-center"
                    >
                      <v-icon large :color="card.color">{{ card.icon }}</v-icon>
                    </div>
                    <div v-else class="d-flex align-center justify-center">
                      <v-icon>mdi-help</v-icon>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-btn
          @click="resetGame"
          depressed
          rounded
          large
          color="primary"
          class="my-2"
        >
          <v-icon>mdi-restart</v-icon> Start New Game
        </v-btn>
      </v-col>
    </v-row>

    <v-container class="text-center">
      <v-snackbar v-model="showCongrats" :timeout="5000">
        🎉 Congratulations! You've found all the matches! 🎈
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showCongrats = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script>
import confetti from "canvas-confetti";

export default {
  name: "MemoryGame",
  data() {
    return {
      cards: [],
      flippedIndexes: [],
      matches: 0,
      isChecking: false,
      showCongrats: false,
      timer: 0,
      timerInterval: null,
      gameStarted: false,
    };
  },
  computed: {
    formatTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    },
    themeClass() {
      return this.$vuetify.theme.dark ? "dark-mode" : "light-mode";
    },
  },
  mounted() {
    this.resetGame();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    createCards() {
      const iconConfigs = [
        { icon: "mdi-heart", color: "pink" },
        { icon: "mdi-star", color: "amber" },
        { icon: "mdi-weather-sunny", color: "orange" },
        { icon: "mdi-weather-night", color: "purple" },
        { icon: "mdi-cloud", color: "light-blue" },
        { icon: "mdi-flower", color: "green" },
      ];

      const cards = [];
      iconConfigs.forEach(({ icon, color }, index) => {
        cards.push(
          { id: index * 2, icon, color, isMatched: false },
          { id: index * 2 + 1, icon, color, isMatched: false }
        );
      });
      return this.shuffleCards(cards);
    },

    shuffleCards(cards) {
      return [...cards].sort(() => Math.random() - 0.5);
    },

    triggerConfetti() {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    },

    handleCardClick(clickedIndex) {
      if (this.isChecking || this.cards[clickedIndex].isMatched) return;
      if (this.flippedIndexes.includes(clickedIndex)) return;
      if (this.flippedIndexes.length === 2) return;
      if (!this.gameStarted) {
        this.startTimer();
        this.gameStarted = true;
      }

      this.flippedIndexes = [...this.flippedIndexes, clickedIndex];

      if (this.flippedIndexes.length === 2) {
        this.isChecking = true;
        const [firstIndex, secondIndex] = this.flippedIndexes;

        if (this.cards[firstIndex].icon === this.cards[secondIndex].icon) {
          setTimeout(() => {
            this.cards[firstIndex].isMatched = true;
            this.cards[secondIndex].isMatched = true;
            this.flippedIndexes = [];
            this.matches++;
            this.isChecking = false;

            if (this.matches === this.cards.length / 2) {
              this.showCongrats = true;
              this.triggerConfetti(); // Trigger confetti animation
              this.stopTimer();
            }
          }, 500);
        } else {
          setTimeout(() => {
            this.flippedIndexes = [];
            this.isChecking = false;
          }, 400);
        }
      }
    },

    resetGame() {
      this.cards = this.createCards();
      this.flippedIndexes = [];
      this.matches = 0;
      this.isChecking = false;
      this.gameStarted = false;
      this.stopTimer();
      this.timer = 0;
    },

    startTimer() {
      this.stopTimer();
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
  },
};
</script>

<style scoped>
.custom-border {
  border: 1px solid var(--border-color) !important;
  border-radius: 10px; /* Smooth rounded corners */
}

/* Light Mode Border */
.light-mode {
  --border-color: #6a1b9a; /* Soft blueviolet */
}

/* Dark Mode Border */
.dark-mode {
  --border-color: #42a5f5; /* Lighter shade for visibility */
}
</style>
