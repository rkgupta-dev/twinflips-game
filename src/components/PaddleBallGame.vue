<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Paddle Ball</v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="text-center mb-3">
            <v-chip color="primary">
              <v-icon small left>mdi-star</v-icon> Score: {{ score }}</v-chip
            >
            <v-chip color="secondary" class="ml-2">
              <v-icon small left>mdi-trophy</v-icon> High Score:
              {{ highScore }}</v-chip
            >
          </div>

          <!-- Canvas & Mobile Swipe Control Layer -->
          <div class="canvas-wrapper">
            <canvas
              ref="gameCanvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="game-canvas"
            ></canvas>
            <!-- Sliding swipe control area -->
            <div
              class="mobile-slider"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
            ></div>
          </div>

          <!-- Start Overlay -->
          <div
            class="start-overlay d-flex flex-column align-center justify-center"
            v-if="!gameStarted"
          >
            <h2 class="text-h5 mb-4 primary--text">Let's Play!</h2>
            <v-btn color="primary" depressed rounded large @click="startGame">
              Start Game
            </v-btn>
          </div>

          <!-- Difficulty Selector -->
          <v-btn-toggle
            v-model="selectedLevel"
            mandatory
            class="mb-4 d-flex justify-center"
            color="primary"
            group
            rounded
          >
            <v-btn
              v-for="level in difficultyLevels"
              :key="level"
              :value="level"
              class="mx-1"
              depressed
            >
              {{ level }}
            </v-btn>
          </v-btn-toggle>

          <!-- Start Game or Resume Button -->
          <div class="text-center">
            <v-btn
              v-if="!gameStarted"
              color="primary"
              @click="startGame"
              large
              rounded
              depressed
            >
              Start Game
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Game Over Dialog -->
    <v-dialog v-model="showBallGameOverDialog" persistent max-width="400">
      <v-card
        class="pa-6 rounded-xl text-center"
        color="rgba(0, 0, 0, 0.7)"
        dark
        elevation="12"
      >
        <h2 class="text-h5 mb-4 primary--text">🎮 Game Over!</h2>
        <p class="text-subtitle-1 white--text">Final Score: {{ score }}</p>
        <p class="text-subtitle-2 secondary--text">
          High Score: {{ highScore }}
        </p>
        <v-btn
          class="mt-4"
          color="primary"
          @click="resetGame"
          rounded
          large
          depressed
        >
          {{ isGameOver ? "Play Again!" : "Restart" }}
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBallGameOverDialog: false,
      gameStarted: false, // Track if the game has started
      canvasWidth: 0,
      canvasHeight: 500,
      ctx: null,
      ball: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        radius: 10,
      },
      paddle: {
        width: 100,
        height: 20,
        x: 0,
        y: 0,
        speed: 7,
        moveLeft: false,
        moveRight: false,
      },
      isGameOver: false,
      animationFrameId: null,
      startX: null, // For swipe control
      selectedLevel: "Medium",
      difficultyLevels: ["Easy", "Medium", "Fast"],
      score: 0, // New score property
      highScore: localStorage.getItem("BouncingBallhighScore") || 0, // Load high score from LocalStorage
    };
  },
  mounted() {
    this.setupCanvas();
    window.addEventListener("resize", this.setupCanvas);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.setDifficulty();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this.setupCanvas);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  },
  watch: {
    selectedLevel() {
      this.resetGame();
    },
  },
  methods: {
    setupCanvas() {
      const canvasContainer = this.$refs.gameCanvas.parentElement;
      this.canvasWidth = canvasContainer.offsetWidth;
      const canvas = this.$refs.gameCanvas;
      canvas.width = this.canvasWidth;
      this.ctx = canvas.getContext("2d");

      this.paddle.x = (this.canvasWidth - this.paddle.width) / 2;
      this.paddle.y = this.canvasHeight - this.paddle.height - 10;

      this.ball.x = this.canvasWidth / 2;
      this.ball.y = this.canvasHeight - 30;
    },
    setDifficulty() {
      switch (this.selectedLevel) {
        case "Easy":
          this.ball.dx = 3;
          this.ball.dy = -3;
          break;
        case "Medium":
          this.ball.dx = 5;
          this.ball.dy = -5;
          break;
        case "Fast":
          this.ball.dx = 7;
          this.ball.dy = -7;
          break;
        default:
          this.ball.dx = 5;
          this.ball.dy = -5;
      }
    },
    handleKeyDown(e) {
      if (e.key === "ArrowLeft") this.paddle.moveLeft = true;
      if (e.key === "ArrowRight") this.paddle.moveRight = true;
    },
    handleKeyUp(e) {
      if (e.key === "ArrowLeft") this.paddle.moveLeft = false;
      if (e.key === "ArrowRight") this.paddle.moveRight = false;
    },
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
    },
    handleTouchMove(e) {
      const currentX = e.touches[0].clientX;
      const dx = currentX - this.startX;
      this.startX = currentX;
      this.paddle.x += dx;

      // Clamp paddle
      if (this.paddle.x < 0) this.paddle.x = 0;
      if (this.paddle.x + this.paddle.width > this.canvasWidth) {
        this.paddle.x = this.canvasWidth - this.paddle.width;
      }
    },
    drawBall() {
      const { x, y, radius } = this.ball;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ff5722";
      this.ctx.fill();
      this.ctx.closePath();
    },
    drawPaddle() {
      const { x, y, width, height } = this.paddle;
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      this.ctx.fillStyle = "#3f51b5";
      this.ctx.fill();
      this.ctx.closePath();
    },
    updatePaddle() {
      if (this.paddle.moveLeft) {
        this.paddle.x -= this.paddle.speed;
        if (this.paddle.x < 0) this.paddle.x = 0;
      }
      if (this.paddle.moveRight) {
        this.paddle.x += this.paddle.speed;
        if (this.paddle.x + this.paddle.width > this.canvasWidth) {
          this.paddle.x = this.canvasWidth - this.paddle.width;
        }
      }
    },
    updateBall() {
      const ball = this.ball;
      const paddle = this.paddle;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall bounce
      if (ball.x + ball.radius > this.canvasWidth || ball.x - ball.radius < 0) {
        ball.dx *= -1;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }

      // Paddle bounce
      if (
        ball.y + ball.radius >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
        this.score++; // Increment score when ball hits the paddle
      }

      // Game over
      if (ball.y + ball.radius > this.canvasHeight) {
        this.gameOver();
      }
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    gameLoop() {
      if (this.isGameOver) return;
      this.showBallGameOverDialog = false;
      this.clearCanvas();
      this.drawBall();
      this.drawPaddle();
      this.updateBall();
      this.updatePaddle();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },
    startGame() {
      this.gameStarted = true;
      this.isGameOver = false;
      this.score = 0; // Reset score
      this.showBallGameOverDialog = false;
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    },
    gameOver() {
      this.isGameOver = true;
      this.showBallGameOverDialog = true;
      cancelAnimationFrame(this.animationFrameId);

      // Check if the score is higher than the current high score
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("BouncingBallhighScore", this.highScore); // Save high score to LocalStorage
      }
    },
    resetGame() {
      cancelAnimationFrame(this.animationFrameId);
      this.setupCanvas();
      this.setDifficulty();
      this.startGame();
    },
  },
};
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.game-canvas {
  width: 100%;
  max-width: 100%;
  background-color: #e0f7fa;
  display: block;
  margin: 0 auto;
  border-radius: 15px;
}

.start-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://img.freepik.com/free-vector/boy-throwing-ball-white-background_1308-79134.jpg?ga=GA1.1.1001727922.1730456661&semt=ais_hybrid&w=740");
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-slider {
  position: absolute;
  top: 0;
  left: 0;
  height: 500px;
  width: 100%;
  z-index: 10;
}

.v-dialog .v-card {
  border-radius: 15px;
  background: #333;
}

.v-select .v-input__control {
  border-radius: 10px;
}
</style>
