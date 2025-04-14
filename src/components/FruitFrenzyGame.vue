<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Fruit Frenzy</v-toolbar-title>
    </v-app-bar>

    <v-container
      fluid
      class="d-flex flex-column align-center justify-center fill-height"
    >
      <div class="d-flex justify-center my-2 flex-wrap">
        <v-chip color="primary" class="mr-2 mb-2">
          <v-icon small left>mdi-timer-outline</v-icon>
          Time: {{ timer }}
        </v-chip>
        <v-chip color="primary" class="mr-2 mb-2">
          <v-icon small left>mdi-trophy</v-icon>
          Score: {{ score }}
        </v-chip>
        <v-chip color="secondary" class="white--text mb-2">
          <v-icon small left>mdi-medal-outline</v-icon>
          High Score: {{ bestScore }}
        </v-chip>
      </div>

      <div
        class="canvas-wrapper"
        style="position: relative; display: inline-block"
      >
        <canvas
          ref="canvas"
          :width="canvasSize"
          :height="canvasSize"
          class="elevation-8"
          style="
            touch-action: none;
            background-color: #111;
            border: 2px solid #ff4081;
            border-radius: 15px;
          "
        ></canvas>

        <div class="my-5 d-flex justify-center">
          <v-btn
            depressed
            rounded
            large
            color="primary"
            @click="togglePause"
            v-if="hasGameStarted && !showGameOverDialog"
          >
            <v-icon left>
              {{ isRunning ? "mdi-pause-circle" : "mdi-play-circle" }}
            </v-icon>
            {{ isRunning ? "Pause" : "Resume" }}
          </v-btn>
        </div>

        <!-- Start Overlay -->
        <div
          v-if="!hasGameStarted"
          class="start-overlay d-flex flex-column align-center justify-center"
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10;
            border-radius: 15px;
          "
        >
          <h2 class="text-h5 mb-4 primary--text">🍉 Welcome to Fruit Frenzy</h2>
          <v-btn color="primary" depressed rounded large @click="startGame">
            Start Game
          </v-btn>
        </div>
      </div>

      <!-- Game Over Dialog -->
      <v-dialog v-model="showGameOverDialog" persistent max-width="400">
        <v-card
          class="pa-4 rounded-xl text-center"
          color="rgba(15, 15, 15, 0.8)"
          dark
          elevation="12"
        >
          <h2 class="text-h5 mb-4 primary--text">⏰ Time's Up!</h2>
          <p class="text-subtitle-1 white--text">Final Score: {{ score }}</p>
          <p class="text-subtitle-2 secondary--text">
            High Score: {{ bestScore }}
          </p>
          <p
            v-if="showWowText"
            class="text-h6 mt-2 pink--text font-weight-bold"
          >
            Wow! You broke the record! 🎉
          </p>
          <v-btn
            color="primary"
            depressed
            rounded
            large
            class="mt-4"
            @click="playAgain"
          >
            Play Again
          </v-btn>
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
      hasGameStarted: false,
      showGameOverDialog: false,
      animationFrameId: null,
      canvasSize: 388,
      ctx: null,
      fruits: [],
      slicedPieces: [],
      score: 0,
      bestScore: parseInt(localStorage.getItem("bestScore")) || 0,
      timer: 60,
      isRunning: false,
      trail: [],
      splashColors: ["#ff4081", "#4caf50", "#2196f3", "#ffeb3b"],
      slashSound: null,
      gameInterval: null,
      fruitSpawner: null,
      showWowText: false,
    };
  },
  mounted() {
    this.initCanvas();
    this.bindInputEvents();
  },
  beforeDestroy() {
    this.unbindInputEvents();
    clearInterval(this.fruitSpawner);
    clearInterval(this.gameInterval);
    cancelAnimationFrame(this.animationFrameId);
  },
  methods: {
    startGame() {
      this.hasGameStarted = true;
      this.showGameOverDialog = false;
      this.resetGameState();
      this.startGameLoop();
      this.spawnFruit();
      this.startTimer();
    },
    togglePause() {
      this.isRunning = !this.isRunning;
      if (this.isRunning) {
        this.startGameLoop();
        this.spawnFruit();
      } else {
        cancelAnimationFrame(this.animationFrameId);
        clearInterval(this.fruitSpawner);
      }
    },
    playAgain() {
      this.startGame();
    },
    resetGameState() {
      this.fruits = [];
      this.slicedPieces = [];
      this.score = 0;
      this.timer = 60;
      this.trail = [];
      this.showWowText = false;
      this.isRunning = true;
      clearInterval(this.fruitSpawner);
      clearInterval(this.gameInterval);
      cancelAnimationFrame(this.animationFrameId);
    },
    initCanvas() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d");
    },
    bindInputEvents() {
      const canvas = this.$refs.canvas;
      canvas.addEventListener("mousemove", this.trackMouse);
      canvas.addEventListener("touchmove", this.trackTouch, { passive: false });
    },
    unbindInputEvents() {
      const canvas = this.$refs.canvas;
      canvas.removeEventListener("mousemove", this.trackMouse);
      canvas.removeEventListener("touchmove", this.trackTouch);
    },
    trackMouse(e) {
      if (!this.isRunning) return;
      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.trail.push({ x, y });
      if (this.trail.length > 5) this.trail.shift();
      this.checkSlice(x, y);
    },
    trackTouch(e) {
      if (!this.isRunning) return;
      e.preventDefault();
      const rect = this.$refs.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.trail.push({ x, y });
      if (this.trail.length > 5) this.trail.shift();
      this.checkSlice(x, y);
    },
    checkSlice(x, y) {
      this.fruits.forEach((fruit) => {
        if (fruit.sliced) return;
        const dx = fruit.x - x;
        const dy = fruit.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < fruit.size / 2) {
          fruit.sliced = true;
          this.score += 10;
          this.showSplash(fruit.x, fruit.y);
          this.spawnSlices(fruit);
          this.playSound();
        }
      });
    },
    spawnFruit() {
      this.fruitSpawner = setInterval(() => {
        if (!this.isRunning) return;
        const fruit = {
          emoji: ["🍉", "🍎", "🍓", "🍌", "🍇"][Math.floor(Math.random() * 5)],
          x: Math.random() * (this.canvasSize - 40) + 20,
          y: this.canvasSize,
          speedY: Math.random() * -5 - 4,
          gravity: 0.1,
          size: 40,
          sliced: false,
        };
        this.fruits.push(fruit);
      }, 700);
    },
    spawnSlices(fruit) {
      this.slicedPieces.push(
        {
          emoji: fruit.emoji,
          x: fruit.x - 10,
          y: fruit.y,
          vx: -2,
          vy: fruit.speedY,
          gravity: 0.15,
          rotation: -0.1,
          angle: 0,
          alpha: 1,
          clip: "left", // ⬅️ Only show left half
        },
        {
          emoji: fruit.emoji,
          x: fruit.x + 10,
          y: fruit.y,
          vx: 2,
          vy: fruit.speedY,
          gravity: 0.15,
          rotation: 0.1,
          angle: 0,
          alpha: 1,
          clip: "right", // ⬅️ Only show right half
        }
      );
    },
    startGameLoop() {
      const loop = () => {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawFruits();
        this.drawSlicedPieces();
        this.drawTrail();
        this.animationFrameId = requestAnimationFrame(loop);
      };
      this.animationFrameId = requestAnimationFrame(loop);
    },
    drawFruits() {
      this.fruits.forEach((fruit, index) => {
        if (fruit.sliced) return;
        fruit.y += fruit.speedY;
        fruit.speedY += fruit.gravity;
        if (fruit.y > this.canvasSize + 40) this.fruits.splice(index, 1);
        this.ctx.font = `${fruit.size}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.fillText(fruit.emoji, fruit.x, fruit.y);
      });
    },
    drawSlicedPieces() {
      this.slicedPieces.forEach((piece, index) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += piece.gravity;
        piece.angle += piece.rotation;
        piece.alpha -= 0.01;

        if (piece.alpha <= 0) {
          this.slicedPieces.splice(index, 1);
          return;
        }

        const fontSize = 30;

        this.ctx.save();
        this.ctx.translate(piece.x, piece.y);
        this.ctx.rotate(piece.angle);
        this.ctx.globalAlpha = piece.alpha;
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // Clip the emoji to half (left or right)
        this.ctx.beginPath();
        this.ctx.rect(
          piece.clip === "left" ? -fontSize : 0,
          -fontSize,
          fontSize,
          fontSize * 2
        );
        this.ctx.clip();

        // Draw the sliced emoji
        this.ctx.fillText(piece.emoji, 0, 0);
        this.ctx.restore();
      });
    },
    drawTrail() {
      if (this.trail.length < 2) return;
      this.ctx.strokeStyle = "#ff4081";
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      this.ctx.stroke();
    },
    showSplash(x, y) {
      const splashColor =
        this.splashColors[Math.floor(Math.random() * this.splashColors.length)];
      this.ctx.beginPath();
      this.ctx.fillStyle = splashColor;
      this.ctx.arc(x, y, 30, 0, 2 * Math.PI);
      this.ctx.fill();
    },
    playSound() {
      if (this.slashSound) {
        this.slashSound.currentTime = 0;
        this.slashSound.play();
      }
    },
    startTimer() {
      this.timer = 60;
      this.gameInterval = setInterval(() => {
        if (this.isRunning) {
          this.timer--;
          if (this.timer <= 0) {
            clearInterval(this.gameInterval);
            clearInterval(this.fruitSpawner);
            this.endGame();
          }
        }
      }, 1000);
    },
    endGame() {
      this.isRunning = false;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem("bestScore", this.bestScore);
        this.showWowText = true;
        confetti(); // Show confetti
      }
      this.showGameOverDialog = true;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

h1 {
  font-family: "Press Start 2P", cursive;
  text-shadow: 0 0 10px #ff4081;
}

canvas {
  image-rendering: pixelated;
}
</style>
