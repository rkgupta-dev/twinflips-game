<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Snake Game</v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <div>
        <div class="text-center">
          <div>
            <v-chip color="primary">
              <v-icon small left>mdi-star</v-icon> Score: {{ score }}</v-chip
            >
            <v-chip color="secondary" class="ml-2">
              <v-icon small left>mdi-trophy</v-icon> High Score:
              {{ highScore }}</v-chip
            >
          </div>

          <div class="game-board-wrapper">
            <canvas
              ref="gameCanvas"
              :width="boardSize"
              :height="boardSize"
              class="game-board"
            ></canvas>
            <div v-if="gameOver" class="game-over-overlay">
              <h2>Game Over!</h2>
              <p>Your score: {{ score }}</p>
              <v-btn rounded color="primary" @click="resetGame"
                >Play Again</v-btn
              >
            </div>
          </div>

          <div class="my-2">
            <v-btn-toggle
              v-model="difficulty"
              mandatory
              class="my-2 small-btn-toggle"
            >
              <v-btn value="easy" small>Easy</v-btn>
              <v-btn value="medium" small>Medium</v-btn>
              <v-btn value="hard" small>Hard</v-btn>
            </v-btn-toggle>
            <br />
            <v-btn rounded color="error" class="ma-2" @click="resetGame"
              >Reset</v-btn
            >
            <v-btn rounded color="primary" class="my-2" @click="togglePause">{{
              isPaused ? "Resume" : "Pause"
            }}</v-btn>
          </div>

          <!-- Mobile Controls -->
          <div class="d-flex flex-column align-items-center">
            <div>
              <v-btn
                fab
                large
                color="primary"
                class=""
                @click="changeDirection('up')"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
            </div>
            <div class="d-flex justify-center align-items-center">
              <v-btn
                fab
                large
                color="primary"
                class="mx-8"
                @click="changeDirection('left')"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>

              <v-btn
                fab
                large
                color="primary"
                class="mx-8"
                @click="changeDirection('right')"
              >
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
            <div class="">
              <v-btn
                fab
                large
                color="primary"
                class=""
                @click="changeDirection('down')"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SnakeGame",

  data() {
    return {
      boardSize: 350,
      gridSize: 20,
      cellSize: 0,
      snake: [],
      food: null,
      direction: "right",
      nextDirection: "right",
      gameInterval: null,
      gameOver: false,
      isPaused: false,
      score: 0,
      highScore: 0,
      difficulty: "medium",
      difficultySettings: {
        easy: { speed: 150, growthRate: 1 },
        medium: { speed: 100, growthRate: 1 },
        hard: { speed: 70, growthRate: 1 },
      },
    };
  },

  computed: {
    currentSpeed() {
      return this.difficultySettings[this.difficulty].speed;
    },

    currentGrowthRate() {
      return this.difficultySettings[this.difficulty].growthRate;
    },
  },

  watch: {
    difficulty() {
      if (!this.gameOver && !this.isPaused) {
        this.resetInterval();
      }
    },
  },

  mounted() {
    this.cellSize = this.boardSize / this.gridSize;
    this.setupGame();
    this.setupEventListeners();

    // Load high score from localStorage if available
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore);
    }
  },

  beforeDestroy() {
    this.clearInterval();
    window.removeEventListener("keydown", this.handleKeyDown);
  },

  methods: {
    setupGame() {
      // Initialize snake in the middle of the board
      const middle = Math.floor(this.gridSize / 2);
      this.snake = [
        { x: middle, y: middle },
        { x: middle - 1, y: middle },
        { x: middle - 2, y: middle },
      ];

      this.direction = "right";
      this.nextDirection = "right";
      this.score = 0;
      this.gameOver = false;
      this.isPaused = false;

      this.generateFood();
      this.drawBoard();
      this.resetInterval();
    },

    setupEventListeners() {
      window.addEventListener("keydown", this.handleKeyDown);
    },

    handleKeyDown(e) {
      switch (e.key) {
        case "ArrowUp":
          this.changeDirection("up");
          break;
        case "ArrowDown":
          this.changeDirection("down");
          break;
        case "ArrowLeft":
          this.changeDirection("left");
          break;
        case "ArrowRight":
          this.changeDirection("right");
          break;
        case " ":
          this.togglePause();
          break;
      }
    },

    changeDirection(newDirection) {
      // Prevent 180-degree turns
      if (
        (this.direction === "up" && newDirection === "down") ||
        (this.direction === "down" && newDirection === "up") ||
        (this.direction === "left" && newDirection === "right") ||
        (this.direction === "right" && newDirection === "left")
      ) {
        return;
      }

      this.nextDirection = newDirection;
    },

    resetInterval() {
      this.clearInterval();
      this.gameInterval = setInterval(this.gameLoop, this.currentSpeed);
    },

    clearInterval() {
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
      }
    },

    togglePause() {
      this.isPaused = !this.isPaused;

      if (this.isPaused) {
        this.clearInterval();
      } else {
        this.resetInterval();
      }
    },

    resetGame() {
      this.clearInterval();
      this.setupGame();
    },

    gameLoop() {
      if (this.gameOver || this.isPaused) return;

      this.direction = this.nextDirection;
      this.moveSnake();
      this.checkCollision();

      if (!this.gameOver) {
        this.checkFood();
        this.drawBoard();
      }
    },

    moveSnake() {
      const head = { ...this.snake[0] };

      switch (this.direction) {
        case "up":
          head.y -= 1;
          break;
        case "down":
          head.y += 1;
          break;
        case "left":
          head.x -= 1;
          break;
        case "right":
          head.x += 1;
          break;
      }

      this.snake.unshift(head);

      // Remove tail unless food was eaten
      if (!this.checkFood(true)) {
        this.snake.pop();
      }
    },

    checkCollision() {
      const head = this.snake[0];

      // Check wall collision
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= this.gridSize ||
        head.y >= this.gridSize
      ) {
        this.endGame();
        return;
      }

      // Check self collision (skip the head)
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          this.endGame();
          return;
        }
      }
    },

    checkFood(checkOnly = false) {
      const head = this.snake[0];

      if (head.x === this.food.x && head.y === this.food.y) {
        if (!checkOnly) {
          this.score += 10;
          this.updateHighScore();
          this.generateFood();

          // Increase speed slightly as score increases
          if (this.score % 50 === 0) {
            this.resetInterval();
          }
        }
        return true;
      }

      return false;
    },

    generateFood() {
      // Generate food at a random position not occupied by the snake
      let foodPosition;

      do {
        foodPosition = {
          x: Math.floor(Math.random() * this.gridSize),
          y: Math.floor(Math.random() * this.gridSize),
        };
      } while (this.isPositionOccupied(foodPosition));

      this.food = foodPosition;
    },

    isPositionOccupied(position) {
      return this.snake.some(
        (segment) => segment.x === position.x && segment.y === position.y
      );
    },

    drawBoard() {
      const canvas = this.$refs.gameCanvas;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, this.boardSize, this.boardSize);

      // Draw background grid
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, this.boardSize, this.boardSize);

      // Draw snake
      this.snake.forEach((segment, index) => {
        // Head is a different color
        ctx.fillStyle = index === 0 ? "#388E3C" : "#4CAF50";
        this.drawCell(ctx, segment.x, segment.y);
      });

      // Draw food
      ctx.fillStyle = "#F44336";
      this.drawCell(ctx, this.food.x, this.food.y);

      // Draw grid lines
      ctx.strokeStyle = "#E0E0E0";
      ctx.lineWidth = 1;

      for (let i = 0; i <= this.gridSize; i++) {
        const pos = i * this.cellSize;

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, this.boardSize);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(this.boardSize, pos);
        ctx.stroke();
      }
    },

    drawCell(ctx, x, y) {
      const padding = 1; // Small padding for visual separation
      ctx.fillRect(
        x * this.cellSize + padding,
        y * this.cellSize + padding,
        this.cellSize - padding * 2,
        this.cellSize - padding * 2
      );
    },

    endGame() {
      this.gameOver = true;
      this.clearInterval();
      this.updateHighScore();
    },

    updateHighScore() {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("snakeHighScore", this.highScore);
      }
    },
  },
};
</script>

<style scoped>
.snake-game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  padding: 20px;
}

.game-card {
  max-width: 700px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: #ffffff;
}

.game-board-wrapper {
  position: relative;
  margin: 10px auto;
  width: 350px;
  height: 350px;
  border-radius: 8px;
}

.game-board {
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 8px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-controls {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Ensures all buttons are centered */
  gap: 20px;
}

.direction-btn {
  margin: 0 10px; /* Adds horizontal spacing without breaking alignment */
}

@media (min-width: 800px) {
  .mobile-controls {
    display: none;
  }
}
</style>
