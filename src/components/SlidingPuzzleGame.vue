<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title>Sliding Puzzle</v-toolbar-title>
    </v-app-bar>

    <div
      v-if="!gameStarted"
      class="start-overlay d-flex flex-column align-center justify-center"
    >
      <h2 class="text-h5 mb-4 primary--text">Let's Play!</h2>
      <v-btn color="primary" depressed rounded large @click="startGame"
        >Start Game</v-btn
      >
    </div>

    <v-container class="text-center">
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-card class="pa-2" style="border-radius: 15px">
            <div class="d-flex justify-space-between px-2">
              <v-chip color="primary" text-color="white"
                >🕒 Time: {{ timeElapsed }}s</v-chip
              >
              <v-chip color="secondary" text-color="white">
                <v-icon small left>mdi-repeat</v-icon> Moves: {{ moves }}
              </v-chip>
            </div>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col
                v-for="(tile, index) in tiles"
                :key="index"
                cols="4"
                class="pa-1"
              >
                <v-btn
                  :color="tile === 0 ? 'grey lighten-3' : 'primary'"
                  class="tile-btn"
                  block
                  height="115"
                  elevation="2"
                  @click="move(index)"
                  v-touch:swipe.left="() => onSwipe(index, 'left')"
                  v-touch:swipe.right="() => onSwipe(index, 'right')"
                  v-touch:swipe.up="() => onSwipe(index, 'up')"
                  v-touch:swipe.down="() => onSwipe(index, 'down')"
                >
                  <span v-if="tile !== 0" class="tile-number">{{ tile }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <v-divider class="my-4" />

          <v-card class="pa-4" elevation="4" rounded="xl">
            <v-row dense align="center" class="mb-3">
              <div class="text-h6 font-weight-bold">🏆 Best Score</div>
            </v-row>

            <v-divider class="mb-4"></v-divider>

            <v-row dense>
              <v-col cols="6" class="text-left">
                <div class="text-subtitle-2 font-weight-medium mb-1">
                  🕒 TIME
                </div>
                <v-chip color="primary">
                  {{ bestScore.time !== "N/A" ? bestScore.time + "s" : "N/A" }}
                </v-chip>
              </v-col>

              <v-col cols="6" class="text-left">
                <div class="text-subtitle-2 font-weight-medium mb-1">
                  🎯 MOVES
                </div>
                <v-chip color="secondary">
                  {{ bestScore.moves !== "N/A" ? bestScore.moves : "N/A" }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-model="showSlidingPuzzleDialog"
      persistent
      max-width="420px"
      overlay-opacity="0.1"
    >
      <v-card class="winner-dialog pa-4">
        <v-card-title class="justify-center">
          <span class="text-h6 font-weight-bold winner-text">
            🎉 Puzzle Solved!
          </span>
        </v-card-title>

        <v-card-subtitle
          class="text-center mt-2 font-weight-bold text-subtitle-1 white--text text--darken-1 mb-4"
        >
          You cracked it in
          <span class="teal--text text--darken-2">{{ moves }}</span> moves and
          <span class="deep-orange--text text--darken-2">{{
            timeElapsed
          }}</span>
          seconds! ⏱️
        </v-card-subtitle>

        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" dark rounded large @click="restart">
            <v-icon left>mdi-restart</v-icon>
            Play Again
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tiles: [],
      moves: 0,
      timer: null,
      timeElapsed: 0,
      showSlidingPuzzleDialog: false,
      gameStarted: false,
      bestScore: {
        time: null,
        moves: null,
      },
    };
  },
  computed: {
    isWin() {
      return (
        JSON.stringify(this.tiles) ===
        JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])
      );
    },
  },
  watch: {
    isWin(isCompleted) {
      if (isCompleted) {
        this.stopTimer();
        this.showSlidingPuzzleDialog = true;
        this.updateBestScore();
      }
    },
  },
  methods: {
    move(index) {
      if (this.isWin) return;
      const blank = this.tiles.indexOf(0);
      const valid = this.getValidMoves(blank);
      if (valid.includes(index)) {
        this.swap(index, blank);
        this.moves++;
      }
    },
    onSwipe(index, direction) {
      if (this.isWin) return;
      const row = Math.floor(index / 3);
      const col = index % 3;
      let target = null;

      if (direction === "left" && col < 2) target = index + 1;
      if (direction === "right" && col > 0) target = index - 1;
      if (direction === "up" && row < 2) target = index + 3;
      if (direction === "down" && row > 0) target = index - 3;

      if (target !== null && this.tiles[target] === 0) {
        this.swap(index, target);
        this.moves++;
      }
    },
    swap(i, j) {
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
      this.tiles = [...this.tiles];
    },
    getValidMoves(blank) {
      const r = Math.floor(blank / 3);
      const c = blank % 3;
      const moves = [];
      if (r > 0) moves.push(blank - 3);
      if (r < 2) moves.push(blank + 3);
      if (c > 0) moves.push(blank - 1);
      if (c < 2) moves.push(blank + 1);
      return moves;
    },
    shuffle() {
      let arr;
      do {
        arr = [1, 2, 3, 4, 5, 6, 7, 8, 0].sort(() => Math.random() - 0.5);
      } while (
        !this.isSolvable(arr) ||
        JSON.stringify(arr) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 0])
      );
      this.tiles = arr;
    },
    isSolvable(arr) {
      const nums = arr.filter((n) => n !== 0);
      let inv = 0;
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          if (nums[i] > nums[j]) inv++;
        }
      }
      return inv % 2 === 0;
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeElapsed++;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    restart() {
      this.stopTimer();
      this.moves = 0;
      this.timeElapsed = 0;
      this.shuffle();
      this.startTimer();
      this.showSlidingPuzzleDialog = false;
    },
    startGame() {
      this.gameStarted = true;
      this.restart();
    },
    updateBestScore() {
      const currentBest = JSON.parse(localStorage.getItem("bestScore")) || {};
      const isBetter =
        !currentBest.time ||
        this.timeElapsed < currentBest.time ||
        (this.timeElapsed === currentBest.time &&
          this.moves < currentBest.moves);

      if (isBetter) {
        this.bestScore = { time: this.timeElapsed, moves: this.moves };
        localStorage.setItem("bestScore", JSON.stringify(this.bestScore));
      } else {
        this.bestScore = currentBest;
      }
    },
  },
  mounted() {
    const savedScore = JSON.parse(localStorage.getItem("bestScore"));
    if (savedScore) {
      this.bestScore = savedScore;
    }
  },
  beforeDestroy() {
    this.stopTimer();
  },
};
</script>

<style scoped>
.tile-btn {
  font-size: 33px;
  font-weight: bold;
  border-radius: 15px;
}
.tile-number {
  color: white;
}
.winner-dialog {
  background: rgba(
    0,
    0,
    0,
    0.85
  ) !important; /* Slightly darker for better contrast */
  color: white;
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-in-out;
  max-width: 400px;
  margin: auto;
}
.start-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://img.freepik.com/free-vector/number-0-9-with-math-symbols_1308-97693.jpg");
  background-size: cover;
  z-index: 20;
}
.card-background {
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(100, 43, 115, 1) 0%,
    rgba(4, 0, 4, 1) 90%
  );
}
</style>
