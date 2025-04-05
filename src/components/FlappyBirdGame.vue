<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Flappy Bird</v-toolbar-title>
    </v-app-bar>
    <v-container fluid class="game-container">
      <div class="d-flex justify-center mb-4 my-2">
        <v-chip color="primary" class="mr-2">
          <v-icon small left>mdi-star</v-icon>
          Score: {{ score }}
        </v-chip>

        <v-chip color="secondary" class="white--text">
          <v-icon small left>mdi-trophy</v-icon>
          High Score: {{ highScore }}
        </v-chip>
      </div>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="" @click="gameStarted && jump()">
            <div class="clouds"></div>
            <canvas ref="gameCanvas" width="390" height="500"></canvas>
          </v-card>

          <div class="my-5">
            <v-btn
              rounded
              depressed
              large
              color="primary"
              @click="startGame"
              v-if="!gameStarted"
            >
              <v-icon left>mdi-play-circle</v-icon>
              Start Game
            </v-btn>
          </div>

          <div
            class="my-5 d-flex justify-center align-center"
            v-if="gameStarted"
          >
            <v-btn
              rounded
              depressed
              large
              :color="paused ? 'warning' : 'error'"
              @click="togglePause"
            >
              <v-icon>{{ paused ? "mdi-play" : "mdi-pause" }}</v-icon>
              {{ paused ? "Resume" : "Pause" }}
            </v-btn>

            <v-btn
              rounded
              depressed
              large
              color="success"
              class="ml-2"
              @click="jump"
            >
              <v-icon>mdi-arrow-up-bold</v-icon> Jump
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-dialog
        v-model="showDialog"
        persistent
        max-width="400"
        transition="fade-transition"
      >
        <v-dialog
          v-model="showDialog"
          persistent
          max-width="auto"
          transition="fade-transition"
        >
          <v-card
            color="rgba(15, 15, 15, 0.9)"
            class="d-flex flex-column justify-center align-center text-center"
          >
            <v-card-title class="text-h5 white--text justify-center">
              Game Over
            </v-card-title>

            <v-card-text class="white--text text-subtitle-1">
              Your Score: <strong>{{ score }}</strong
              ><br />
              Highest Score: <strong>{{ highScore }}</strong>
            </v-card-text>

            <v-card-actions class="justify-center my-2">
              <v-btn
                rounded
                depressed
                large
                color="primary"
                @click="startGame"
                v-if="!gameStarted"
              >
                Play Again!
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      bird: { x: 50, y: 200, velocity: 0 },
      gravity: 0.5,
      pipes: [],
      pipeGap: 100,
      pipeWidth: 50,
      pipeSpeed: 2,
      score: 0,
      highScore: 0,
      gameInterval: null,
      birdImage: null,
      showDialog: false,
      gameStarted: false,
      paused: false,
    };
  },
  mounted() {
    this.canvas = this.$refs.gameCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.highScore = parseInt(localStorage.getItem("flappyHighScore")) || 0;

    window.addEventListener("keydown", () => {
      if (this.gameStarted) this.jump();
    });

    this.canvas.addEventListener("touchstart", () => {
      if (this.gameStarted) this.jump();
    });

    this.birdImage = new Image();
    this.birdImage.src = "https://cdn-icons-png.flaticon.com/128/92/92009.png";

    this.clearCanvas(); // Initial blank canvas
  },
  methods: {
    startGame() {
      this.bird = { x: 50, y: 200, velocity: 0 };
      this.pipes = [{ x: 400, height: Math.random() * 200 + 50 }];
      this.score = 0;
      this.showDialog = false;
      this.gameStarted = true;
      this.clearCanvas();
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.gameLoop, 20);
    },
    gameLoop() {
      this.updateGame();
      this.checkCollision();
      this.drawGame();
    },
    updateGame() {
      this.bird.velocity += this.gravity;
      this.bird.y += this.bird.velocity;
      this.pipes.forEach((pipe) => (pipe.x -= this.pipeSpeed));
      if (this.pipes[0].x + this.pipeWidth < 0) {
        this.pipes.shift();
        this.pipes.push({ x: 400, height: Math.random() * 200 + 50 });
        this.score++;
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem("flappyHighScore", this.highScore);
        }
      }
    },
    checkCollision() {
      if (this.bird.y >= 480 || this.bird.y <= 0) {
        this.endGame();
      }
      this.pipes.forEach((pipe) => {
        if (
          this.bird.x < pipe.x + this.pipeWidth &&
          this.bird.x + 20 > pipe.x &&
          (this.bird.y < pipe.height ||
            this.bird.y > pipe.height + this.pipeGap)
        ) {
          this.endGame();
        }
      });
    },
    drawGame() {
      this.ctx.clearRect(0, 0, 400, 500);
      this.ctx.fillStyle = "skyblue";
      this.ctx.fillRect(0, 0, 400, 500);

      // Draw clouds
      this.ctx.fillStyle = "white";
      this.ctx.beginPath();
      this.ctx.arc(100, 50, 20, 0, Math.PI * 2);
      this.ctx.arc(120, 50, 30, 0, Math.PI * 2);
      this.ctx.arc(150, 50, 20, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw pipes
      this.ctx.fillStyle = "green";
      this.pipes.forEach((pipe) => {
        this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.height);
        this.ctx.fillRect(
          pipe.x,
          pipe.height + this.pipeGap,
          this.pipeWidth,
          500 - pipe.height - this.pipeGap
        );
      });

      // Draw bird
      if (this.birdImage.complete && this.gameStarted) {
        this.ctx.drawImage(this.birdImage, this.bird.x, this.bird.y, 40, 40);
      }
    },
    jump() {
      this.bird.velocity = -5;
    },
    endGame() {
      clearInterval(this.gameInterval);
      this.gameStarted = false;
      this.showDialog = true;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, 400, 500);
      this.ctx.fillStyle = "skyblue";
      this.ctx.fillRect(0, 0, 400, 500);

      // Draw clouds only
      this.ctx.fillStyle = "white";
      this.ctx.beginPath();
      this.ctx.arc(100, 50, 20, 0, Math.PI * 2);
      this.ctx.arc(120, 50, 30, 0, Math.PI * 2);
      this.ctx.arc(150, 50, 20, 0, Math.PI * 2);
      this.ctx.fill();
    },
    togglePause() {
      if (this.paused) {
        this.gameInterval = setInterval(this.gameLoop, 20);
      } else {
        clearInterval(this.gameInterval);
      }
      this.paused = !this.paused;
    },
  },
};
</script>

<style scoped>
.game-container {
  text-align: center;
  border-radius: 10px;
  position: relative;
}

canvas {
  background: transparent;
  display: block;
  margin: auto;
}

.clouds {
  height: 60px;
  background: url("https://www.transparenttextures.com/patterns/clouds.png");
  background-repeat: repeat-x;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
