<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Tic-Tac-Toe</v-toolbar-title>
    </v-app-bar>
    <v-container fluid class="d-flex justify-center align-center fill-height">
      <div class="mb-4 font-weight-bold text-subtitle-1">Let's Play 🎉</div>
      <v-card class="pa-4 text-center" max-width="auto">
        <v-row>
          <v-col v-for="(cell, index) in board" :key="index" cols="4">
            <v-card
              :class="{
                'win-cell': winningCells.includes(index),
                flipped: flippedCells.includes(index),
                'disabled-cell': cell !== '',
              }"
              class="xoxo-cell"
              @click="makeMove(index)"
            >
              <span class="primary--text glowing-text">{{ cell }}</span>
            </v-card>
          </v-col>
        </v-row>
        <div class="my-4">
          <v-btn class="mt-4" large rounded color="primary" @click="resetGame">
            <v-icon>mdi-restart</v-icon> Restart
          </v-btn>
        </div>
      </v-card>

      <!-- Transparent Dialog for Winner/Draw -->
      <v-dialog
        v-model="gameOverDialog"
        persistent
        max-width="400px"
        overlay-opacity="0.1"
      >
        <v-card class="winner-dialog">
          <v-card-title class="text-h5 d-flex justify-center winner-text">
            <span v-if="winner">{{ winner }} Wins! 🎉</span>
            <span v-else>It's a Draw! 🤝</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="primary" dark rounded large @click="resetGame">
              <v-icon left>mdi-restart</v-icon> Play Again
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import confetti from "canvas-confetti";

export default {
  data() {
    return {
      board: Array(9).fill(""),
      currentPlayer: "X",
      winner: null,
      isDraw: false,
      winningCells: [],
      flippedCells: [],
      gameOverDialog: false, // Dialog visibility
    };
  },
  methods: {
    makeMove(index) {
      if (!this.board[index] && !this.winner && !this.isDraw) {
        this.$set(this.board, index, this.currentPlayer);
        this.flippedCells.push(index); // Flip effect

        if (this.checkWin()) {
          this.winner = this.currentPlayer;
          this.showGameOverDialog();
          this.launchConfetti(); // Show confetti if won
        } else if (this.board.every((cell) => cell !== "")) {
          this.isDraw = true;
          this.showGameOverDialog();
        } else {
          this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        }
      }
    },
    checkWin() {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          this.winningCells = pattern;
          return true;
        }
      }
      return false;
    },
    showGameOverDialog() {
      this.gameOverDialog = true;
    },
    launchConfetti() {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    },
    resetGame() {
      this.board = Array(9).fill("");
      this.currentPlayer = "X";
      this.winner = null;
      this.isDraw = false;
      this.winningCells = [];
      this.flippedCells = [];
      this.gameOverDialog = false; // Close dialog
    },
  },
};
</script>

<style scoped>
.xoxo-cell {
  width: 100px;
  height: 100px;
  font-size: 4rem;
  font-weight: bold;
  border-radius: 15px;
  border: 1px solid green;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s ease-in-out;
}

.flipped {
  transform: rotateY(180deg);
}

.glowing-text {
  color: #0f0; /* Green glow */
  text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0;
}

.win-cell {
  background-color: green !important;
}

.disabled-cell {
  pointer-events: none; /* Disable clicking on filled cells */
}

.winner-dialog {
  background: rgba(0, 0, 0, 0.8) !important; /* Dark Transparent Background */
  color: white;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
  animation: fadeIn 0.5s ease-in-out;
}

.winner-text {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.v-btn {
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s ease-in-out;
}

.v-btn:hover {
  transform: scale(1.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
