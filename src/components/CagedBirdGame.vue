<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title>Caged Bird</v-toolbar-title>
    </v-app-bar>
    <v-container>
      <v-row class="fill-height align-center justify-center">
        <v-col cols="12" md="10" lg="8">
          <div class="text-center mb-4">
            <h1 class="text-h4 font-weight-bold primary--text">
              Free the Bird
            </h1>
            <p class="secondary--text">
              Solve brain teasers to free the caged bird!
            </p>
          </div>

          <v-row>
            <v-col cols="12" md="6" order="2" order-md="1">
              <!-- Game States -->
              <v-fade-transition mode="out-in">
                <!-- Intro State -->
                <v-card
                  v-if="gameState === 'intro'"
                  class="pa-4 bg-white-transparent"
                  elevation="8"
                >
                  <v-card-title
                    class="text-h5 font-weight-bold primary--text justify-center"
                  >
                    Welcome to the Challenge!
                  </v-card-title>
                  <v-card-text class="text-center primary--text">
                    A beautiful bird has been trapped in a cage. Solve three
                    brain teasers correctly to set it free!
                  </v-card-text>
                  <div class="text-center">
                    <v-btn
                      color="primary"
                      dark
                      rounded
                      x-large
                      @click="handleStartGame"
                    >
                      Begin Adventure
                    </v-btn>
                  </div>
                </v-card>

                <!-- Playing State -->
                <v-card
                  v-else-if="gameState === 'playing'"
                  class="pa-4 bg-white-transparent"
                  elevation="8"
                >
                  <div class="mb-4">
                    <div
                      class="d-flex justify-space-between primary--text caption mb-1"
                    >
                      <span>Progress</span>
                      <span
                        >{{ correctAnswers }} of
                        {{ availableQuestions.length }} correct</span
                      >
                    </div>
                    <v-progress-linear
                      :value="progress"
                      height="8"
                      color="success"
                      background-color="amber lighten-3"
                      rounded
                    ></v-progress-linear>
                  </div>

                  <v-fade-transition mode="out-in">
                    <!-- Question Display -->
                    <div v-if="!showFeedback" key="question">
                      <h3
                        class="text-subtitle-1 font-weight-bold primary--text mb-4"
                      >
                        {{ currentQuestion.question }}
                      </h3>

                      <v-radio-group v-model="selectedAnswer" class="mt-2">
                        <v-card
                          v-for="(option, index) in currentQuestion.options"
                          :key="index"
                          :class="[
                            'mb-2 pa-3 option-card',
                            selectedAnswer === option ? 'selected-option' : '',
                          ]"
                          outlined
                          @click="selectedAnswer = option"
                        >
                          <v-radio
                            :value="option"
                            :label="option"
                            color="primary"
                            hide-details
                          ></v-radio>
                        </v-card>
                      </v-radio-group>

                      <div class="text-center mt-4">
                        <v-btn
                          color="primary"
                          dark
                          rounded
                          x-large
                          block
                          :disabled="!selectedAnswer"
                          @click="handleAnswer"
                        >
                          Submit Answer
                        </v-btn>
                      </div>
                    </div>

                    <!-- Feedback Display -->
                    <div v-else key="feedback" class="text-center py-8">
                      <div
                        v-if="feedbackType === 'correct'"
                        class="text-h6 success--text font-weight-bold"
                      >
                        Correct! The bird is one step closer to freedom!
                      </div>
                      <div v-else class="text-h6 error--text font-weight-bold">
                        Not quite right, but keep trying!
                      </div>
                    </div>
                  </v-fade-transition>
                </v-card>

                <!-- Completed State -->
                <v-card
                  v-else-if="gameState === 'completed'"
                  class="pa-4 bg-white-transparent text-center"
                  elevation="8"
                >
                  <v-card-title
                    class="text-h5 font-weight-bold primary--text justify-center"
                  >
                    {{
                      correctAnswers === availableQuestions.length
                        ? "🎉 Congratulations!\nThe bird is free!"
                        : "🎯 Challenge Complete!\nGood job!"
                    }}
                  </v-card-title>
                  <v-card-text class="primary--text">
                    {{
                      correctAnswers === availableQuestions.length
                        ? "You've successfully solved all the brain teasers and freed the bird!"
                        : `You got ${correctAnswers} out of ${
                            availableQuestions.length
                          } correct. The bird is ${
                            correctAnswers === 0
                              ? "still trapped"
                              : "partially free"
                          }.`
                    }}
                  </v-card-text>
                  <div class="text-center">
                    <v-btn
                      color="primary"
                      dark
                      rounded
                      x-large
                      @click="handleRestart"
                    >
                      Play Again
                    </v-btn>
                  </div>
                </v-card>
              </v-fade-transition>
            </v-col>

            <v-col
              cols="12"
              md="6"
              order="1"
              order-md="2"
              class="d-flex justify-center align-center"
            >
              <!-- Bird Cage -->
              <div class="bird-cage-container">
                <!-- Cage -->
                <div class="cage" :class="{ 'cage-freed': isBirdFree }">
                  <svg viewBox="0 0 200 240" class="cage-svg">
                    <!-- Cage top -->
                    <path
                      d="M40,40 C40,20 160,20 160,40"
                      stroke="#8B4513"
                      stroke-width="4"
                      fill="none"
                    />

                    <!-- Cage hook -->
                    <path
                      d="M100,20 L100,5"
                      stroke="#8B4513"
                      stroke-width="3"
                      fill="none"
                    />
                    <circle cx="100" cy="5" r="3" fill="#8B4513" />

                    <!-- Cage bars -->
                    <line
                      v-for="(_, i) in 7"
                      :key="i"
                      :x1="40 + i * 20"
                      y1="40"
                      :x2="40 + i * 20"
                      y2="200"
                      stroke="#8B4513"
                      stroke-width="3"
                      :class="[
                        'cage-bar',
                        {
                          'cage-bar-fade':
                            (correctAnswers > 0 && i % 2 === 0) ||
                            (correctAnswers > 1 && i % 2 === 1),
                          'cage-bar-freed': isBirdFree,
                        },
                      ]"
                    />

                    <!-- Cage bottom -->
                    <path
                      d="M40,200 C40,220 160,220 160,200"
                      stroke="#8B4513"
                      stroke-width="4"
                      fill="none"
                    />
                  </svg>
                </div>

                <!-- Bird -->
                <!-- Animated Bird -->
                <div class="bird" :class="{ 'bird-freed': isBirdFree }">
                  <img
                    :src="isBirdFree ? freedBirdGif : cagedBirdGif"
                    alt="Bird"
                    class="animated-bird"
                  />
                </div>

                <!-- Freedom message -->
                <div
                  v-if="isBirdFree"
                  class="freedom-message secondary--text font-weight-bold"
                >
                  Free at last!
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "FreeBirdGame",
  data() {
    return {
      cagedBirdGif:
        "https://img.clipart-library.com/2/clip-transparent-bird-gif/clip-transparent-bird-gif-5.gif",
      freedBirdGif:
        "https://img.clipart-library.com/2/clip-transparent-bird-gif/clip-transparent-bird-gif-5.gif",
      gameState: "intro", // 'intro', 'playing', 'completed'
      currentQuizIndex: 0,
      correctAnswers: 0,
      showFeedback: false,
      feedbackType: null,
      selectedAnswer: null,
      availableQuestions: [],
      quizData: [
        {
          question:
            "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
          options: ["An Echo", "A Shadow", "A Thought", "A Cloud"],
          correctAnswer: "An Echo",
        },
        {
          question:
            "What has keys but no locks, space but no room, and you can enter but not go in?",
          options: ["A Keyboard", "A Map", "A Dream", "A Book"],
          correctAnswer: "A Keyboard",
        },
        {
          question: "The more you take, the more you leave behind. What am I?",
          options: ["Footsteps", "Memories", "Breath", "Time"],
          correctAnswer: "Footsteps",
        },
        {
          question: "What gets wetter as it dries?",
          options: ["A Towel", "A Sponge", "Hair", "Soap"],
          correctAnswer: "A Towel",
        },
        {
          question:
            "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
          options: ["A Map", "A Globe", "A Dream", "A Painting"],
          correctAnswer: "A Map",
        },
        {
          question:
            "What can travel around the world while staying in a corner?",
          options: ["A Stamp", "A Passport", "The Internet", "A Thought"],
          correctAnswer: "A Stamp",
        },
        {
          question: "What has a head and a tail, but no body?",
          options: ["A Coin", "A Snake", "A Dream", "A River"],
          correctAnswer: "A Coin",
        },
        {
          question: "What has many keys but can't open a single lock?",
          options: ["A Piano", "A Keyboard", "A Map", "A Book"],
          correctAnswer: "A Piano",
        },
        {
          question: "What can you catch but not throw?",
          options: ["A Cold", "A Ball", "A Fish", "A Thought"],
          correctAnswer: "A Cold",
        },
        {
          question: "What has legs, but doesn't walk?",
          options: ["A Table", "A Bird", "A Fish", "A Snake"],
          correctAnswer: "A Table",
        },
        {
          question:
            "I'm light as a feather, but the strongest person can't hold me for more than a few minutes. What am I?",
          options: ["Breath", "A Thought", "Time", "A Feather"],
          correctAnswer: "Breath",
        },
        {
          question: "What has a neck but no head?",
          options: ["A Bottle", "A Shirt", "A Giraffe", "A River"],
          correctAnswer: "A Bottle",
        },
        {
          question: "What has an eye but cannot see?",
          options: ["A Needle", "A Storm", "A Camera", "A Potato"],
          correctAnswer: "A Needle",
        },
        {
          question:
            "What can you break, even if you never pick it up or touch it?",
          options: ["A Promise", "A Heart", "Silence", "A Record"],
          correctAnswer: "A Promise",
        },
        {
          question: "What goes up but never comes down?",
          options: ["Your Age", "The Sun", "A Balloon", "Temperature"],
          correctAnswer: "Your Age",
        },
      ],
      // Sound effect URLs
      sounds: {
        BUTTON_CLICK: "/sounds/button-click.wav",
        CORRECT_ANSWER: "/sounds/correct-answer.wav",
        WRONG_ANSWER: "/sounds/wrong-answer.wav",
        BIRD_FREED: "/sounds/bird-freed.wav",
      },
      // Cache for audio objects
      audioCache: {},
    };
  },
  computed: {
    progress() {
      return (
        (this.correctAnswers / (this.availableQuestions.length || 1)) * 100
      );
    },
    currentQuestion() {
      return (
        this.availableQuestions[this.currentQuizIndex] || {
          question: "",
          options: [],
          correctAnswer: "",
        }
      );
    },
    isBirdFree() {
      return (
        this.correctAnswers === this.availableQuestions.length &&
        this.gameState === "completed"
      );
    },
  },
  created() {
    this.preloadSounds();
  },
  mounted() {
    // Add a click event listener to enable audio
    document.addEventListener("click", this.enableAudio);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.enableAudio);
  },
  methods: {
    getRandomQuestions() {
      // Create a copy of all questions
      const allQuestions = [...this.quizData];
      const selectedQuestions = [];

      // Select 3 random questions
      for (let i = 0; i < 3; i++) {
        if (allQuestions.length === 0) break;

        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions[randomIndex]);
        allQuestions.splice(randomIndex, 1);
      }

      return selectedQuestions;
    },
    handleStartGame() {
      this.playSound("BUTTON_CLICK");
      this.availableQuestions = this.getRandomQuestions();
      this.gameState = "playing";
    },
    handleAnswer() {
      const isCorrect =
        this.selectedAnswer === this.currentQuestion.correctAnswer;
      this.playSound(isCorrect ? "CORRECT_ANSWER" : "WRONG_ANSWER");
      this.feedbackType = isCorrect ? "correct" : "incorrect";
      this.showFeedback = true;

      if (isCorrect) {
        this.correctAnswers++;
      }

      setTimeout(() => {
        this.showFeedback = false;
        this.selectedAnswer = null;
        this.currentQuizIndex++;

        if (this.currentQuizIndex === this.availableQuestions.length) {
          this.gameState = "completed";
          // If all answers are correct, play the bird freed sound
          if (
            isCorrect &&
            this.correctAnswers === this.availableQuestions.length
          ) {
            setTimeout(() => this.playSound("BIRD_FREED"), 500);
          }
        }
      }, 1500);
    },
    handleRestart() {
      this.playSound("BUTTON_CLICK");
      this.availableQuestions = this.getRandomQuestions();
      this.gameState = "intro";
      this.currentQuizIndex = 0;
      this.correctAnswers = 0;
      this.selectedAnswer = null;
    },
    // Sound functions
    playSound(soundName) {
      try {
        // Create or get cached audio
        if (!this.audioCache[soundName]) {
          this.audioCache[soundName] = new Audio(this.sounds[soundName]);
          // Set volume
          this.audioCache[soundName].volume = 0.5;
        }

        // Reset and play
        const audio = this.audioCache[soundName];
        audio.currentTime = 0;
        audio.play().catch((err) => {
          // Silently fail - this prevents console errors if user hasn't interacted with page yet
          console.log(`Sound playback failed: ${err.message}`);
        });
      } catch (error) {
        // Fail silently
        console.log("Error playing sound", error);
      }
    },
    preloadSounds() {
      Object.keys(this.sounds).forEach((key) => {
        const audio = new Audio(this.sounds[key]);
        audio.preload = "auto";
        this.audioCache[key] = audio;
      });
    },
    enableAudio() {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener("click", this.enableAudio);
    },
  },
};
</script>

<style scoped>
.bird-game-bg {
  background: linear-gradient(to bottom, #fff8e1, #ffe0b2);
  min-height: 100vh;
}

.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(5px);
  border-radius: 15px;
}

/* Bird Cage Styles */
.bird-cage-container {
  position: relative;
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1/1;
  margin: 0 auto;
}

.cage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
}

.cage-freed {
  opacity: 0.5;
  transform: scale(0.9);
}

.cage-svg {
  width: 100%;
  height: 100%;
}

.cage-bar {
  transition: opacity 0.5s ease;
}

.cage-bar-fade {
  opacity: 0.3;
}

.cage-bar-freed {
  opacity: 0.3;
}

.bird {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1s ease;
}

.bird-freed {
  transform: translateY(-100px) scale(1);
}

.bird-svg {
  width: 50%;
  height: 50%;
}

.bird-body {
  animation: pulse 2s infinite;
}

.bird-head {
  animation: pulse 2s infinite;
}

.bird-wing {
  transform-origin: 50px 40px;
  animation: flapWing 2s infinite;
}

.bird-freed .bird-wing {
  animation: flapWingFast 0.5s infinite;
}

.bird-tail {
  transform-origin: 25px 50px;
}

.bird-freed .bird-tail {
  animation: wagTail 1s infinite;
}

.bird-freed .bird-beak {
  animation: openBeak 1.5s infinite;
}

.freedom-message {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  text-align: center;
  margin-top: 12px;
  font-size: 1.25rem;
  animation: fadeIn 1s forwards;
  opacity: 0;
}

/* Option Cards */
.option-card {
  border-color: #673ab7 !important;
}

.selected-option {
  background-color: #d1c4e9 !important;
  border-color: #673ab7 !important;
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    fill: #ffd700;
  }
  50% {
    fill: #ffc700;
  }
}

@keyframes flapWing {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes flapWingFast {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes wagTail {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}

@keyframes openBeak {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .bird-cage-container {
    max-width: 180px;
  }

  .freedom-message {
    font-size: 1rem;
    margin-top: 8px;
  }
}

.animated-bird {
  width: 120px;
  height: auto;
  transition: transform 1s ease;
}

.bird-freed .animated-bird {
  transform: translateY(-50px) scale(1.1); /* slight upward motion when free */
}
</style>
