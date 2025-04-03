<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Memory Match Game</v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <div>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <div class="my-3">
              <v-chip class="mr-2" color="primary" outlined>
                <v-icon left>mdi-cards</v-icon>
                Matches: {{ matches }} of {{ cards.length / 2 }}
              </v-chip>

              <v-chip color="primary" outlined>
                <v-icon left>mdi-timer-outline</v-icon>
                Time: {{ formatTime }}
              </v-chip>
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
                      class="d-flex align-center justify-center custom-border flip-container"
                      :class="{
                        flipped:
                          flippedIndexes.includes(index) || card.isMatched,
                      }"
                    >
                      <div class="card-inner">
                        <!-- Front Side (Hidden Icon) -->
                        <div
                          class="card-front d-flex align-center justify-center"
                        >
                          <v-icon>mdi-help</v-icon>
                        </div>

                        <!-- Back Side (Revealed Icon) -->
                        <v-card
                          class="card-back d-flex align-center justify-center"
                        >
                          <v-icon large :color="card.color">{{
                            card.icon
                          }}</v-icon>
                        </v-card>
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
      </div>

      <v-container class="text-center">
        <v-dialog v-model="showTimerDialog" persistent max-width="300">
          <v-card
            class="pa-4 rounded-xl text-center"
            color="rgba(15, 15, 15, 0.8)"
            dark
            elevation="12"
          >
            <v-card-title class="d-flex flex-column align-center">
              <div class="text-h4 font-weight-bold mt-3 animate-fade">🎉</div>
              <div class="text-h5 font-weight-bold mt-3 animate-fade">
                Congratulations!
              </div>
              <div class="text-subtitle-1 mt-1 animate-fade">
                You’ve found all the matches!
              </div>
            </v-card-title>

            <v-card-text
              class="d-flex align-center justify-center mt-4 animate-scale"
            >
              <v-icon size="55" color="cyan">mdi-timer</v-icon>
              <span class="ml-3 text-h5 font-weight-bold">{{
                formatTime
              }}</span>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                elevation="5"
                rounded
                class="px-6 py-3 animate-button"
                @click="showTimerDialog = false"
              >
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-container>
  </div>
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
      showTimerDialog: false, // Shows timer only after completion
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
              this.triggerConfetti();
              this.stopTimer();
              this.showTimerDialog = true; // Show timer after completion
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
      this.showTimerDialog = false; // Hide timer when game resets
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

.flip-container {
  perspective: 1000px;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  background: linear-gradient(
    45deg,
    rgba(106, 27, 154, 0.9),
    rgba(66, 165, 245, 0.9)
  );
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color) !important;
  border-radius: 10px; /* Smooth rounded corners */
}

.card-back {
  transform: rotateY(180deg);
}
</style>
