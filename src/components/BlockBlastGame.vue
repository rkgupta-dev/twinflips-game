<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <div>
        <!-- <v-btn icon @click="toggleSound">
          <v-icon>{{
            isSoundEnabled ? "mdi-volume-high" : "mdi-volume-off"
          }}</v-icon>
        </v-btn> -->
        <v-btn icon @click="showInstructions = true">
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </div>
      <v-toolbar-title>Block Blast</v-toolbar-title>
    </v-app-bar>
    <v-container fluid>
      <div class="d-flex justify-center mb-4 my-2">
        <v-chip color="primary" class="mr-2 white--text">
          <v-icon small left>mdi-star</v-icon>
          Score: {{ formattedScore }}
        </v-chip>

        <v-chip color="primary" class="mr-2 white--text">
          <v-icon small left>mdi-arrow-up-bold-box</v-icon>
          Level: {{ level }}
        </v-chip>

        <v-chip color="secondary" class="white--text">
          <v-icon small left>mdi-trophy</v-icon>
          High Score: {{ formattedHighScore }}
        </v-chip>
      </div>
      <v-row no-gutters justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4">
          <!-- Game Board -->
          <v-card
            dark
            color="grey darken-4"
            class="mx-4 mb-4 game-board-container"
          >
            <v-card-text class="pa-2">
              <div class="game-board">
                <div
                  v-for="(row, rowIndex) in gameBoard"
                  :key="`row-${rowIndex}`"
                  class="game-row"
                >
                  <div
                    v-for="(cell, colIndex) in row"
                    :key="`cell-${rowIndex}-${colIndex}`"
                    class="game-cell"
                    :class="getCellClass(cell, rowIndex, colIndex)"
                    @click="handleCellClick(rowIndex, colIndex)"
                    @mouseenter="handleCellHover(rowIndex, colIndex)"
                    @mouseleave="handleCellLeave"
                  >
                    <v-scale-transition>
                      <div
                        v-if="isPreviewCell(rowIndex, colIndex)"
                        class="preview-overlay"
                        :class="getPreviewClass(rowIndex, colIndex)"
                      ></div>
                    </v-scale-transition>
                    <v-fade-transition>
                      <div v-if="cell === 'gold'" class="gold-sparkle"></div>
                    </v-fade-transition>
                    <v-fade-transition>
                      <div v-if="cell === 'bomb'" class="bomb-dot"></div>
                    </v-fade-transition>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Block Selector -->
          <v-card
            dark
            color="grey darken-3"
            class="mx-4 mb-4"
            style="border-radius: 15px; height: 155px"
          >
            <v-card-title class="justify-center subtitle-1 py-2"
              >Available Blocks</v-card-title
            >
            <v-card-text class="pa-2">
              <div class="block-selector">
                <div
                  v-for="block in availableBlocks"
                  :key="block.id"
                  class="block-option"
                  :class="{
                    selected: selectedBlock && selectedBlock.id === block.id,
                  }"
                  @click="handleBlockSelect(block)"
                >
                  <div
                    class="block-preview"
                    :style="{
                      gridTemplateColumns: `repeat(${block.shape[0].length}, 1fr)`,
                      gridTemplateRows: `repeat(${block.shape.length}, 1fr)`,
                    }"
                  >
                    <template v-for="(row, rowIndex) in block.shape">
                      <div
                        v-for="(cell, colIndex) in row"
                        :key="`preview-${rowIndex}-${colIndex}`"
                        class="block-cell"
                        :class="{ [block.color]: cell }"
                      ></div>
                    </template>
                  </div>
                </div>

                <div v-if="availableBlocks.length === 0" class="no-blocks">
                  No blocks available. Game over!
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Game Controls -->
          <v-card-actions class="justify-center pb-4">
            <v-btn
              color="secondary"
              :disabled="!selectedBlock"
              @click="rotateSelectedBlock"
              class="mx-1"
              rounded
              depressed
              large
            >
              <v-icon left>mdi-rotate-right</v-icon>
              Rotate
            </v-btn>
            <v-btn
              color="primary"
              @click="confirmReset"
              class="mx-1"
              rounded
              depressed
              large
            >
              <v-icon left>mdi-refresh</v-icon>
              New Game
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>

      <!-- Instructions Dialog -->
      <v-dialog v-model="showInstructions" max-width="500" persistent>
        <v-card>
          <v-card-title class="headline primary white--text"
            >How to Play Block Blast</v-card-title
          >
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12">
                <h3 class="subtitle-1 font-weight-bold">Game Rules:</h3>
                <v-list dense>
                  <v-list-item
                    v-for="(rule, i) in gameRules"
                    :key="i"
                    class="px-0"
                  >
                    <v-list-item-icon class="mr-2">
                      <v-icon color="primary">mdi-check-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div class="multi-line">{{ rule }}</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12">
                <h3 class="subtitle-1 font-weight-bold">Special Blocks:</h3>
                <v-list dense>
                  <v-list-item class="px-0">
                    <v-list-item-icon class="mr-2">
                      <div class="special-block gold"></div>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div>Gold blocks give double points when cleared</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-icon class="mr-2">
                      <div class="special-block bomb"></div>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div>Bomb blocks clear adjacent cells when placed</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12">
                <h3 class="subtitle-1 font-weight-bold">Controls:</h3>
                <v-list dense>
                  <v-list-item class="px-0">
                    <v-list-item-icon class="mr-2">
                      <v-icon color="primary">mdi-gesture-tap</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div>Click on a block to select it</div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-list-item-icon class="mr-2">
                      <v-icon color="primary">mdi-rotate-right</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <div>
                        Press 'R' key or click Rotate button to rotate blocks
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <div class="text-right">
              <v-btn
                color="primary"
                @click="showInstructions = false"
                rounded
                depressed
                large
              >
                Start Playing
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Game Over Dialog -->
      <v-dialog v-model="isGameOver" max-width="500" persistent>
        <v-card>
          <v-card-title class="headline primary white--text"
            >Game Over!</v-card-title
          >
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" class="text-center">
                <h2 class="display-1 font-weight-bold mb-4">
                  {{ isHighScore ? "New High Score!" : "Your Results" }}
                </h2>

                <v-row>
                  <v-col cols="6">
                    <div class="subtitle-1 grey--text">Final Score</div>
                    <div class="display-1 font-weight-bold">
                      {{ formattedScore }}
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="subtitle-1 grey--text">Level Reached</div>
                    <div class="display-1 font-weight-bold">{{ level }}</div>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="6">
                    <div class="subtitle-1 grey--text">Blocks Placed</div>
                    <div class="display-1 font-weight-bold">
                      {{ placedBlocks }}
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="subtitle-1 grey--text">Lines Cleared</div>
                    <div class="display-1 font-weight-bold">
                      {{ totalLinesCleared }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <div class="text-right mt-4">
              <v-btn
                color="primary"
                @click="
                  startNewGame();
                  isGameOver = false;
                "
                rounded
                depressed
                large
              >
                Play Again
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Confirm Reset Dialog -->
      <v-dialog v-model="showResetConfirm" max-width="400">
        <v-card>
          <v-card-title class="headline">Start New Game?</v-card-title>
          <v-card-text>
            Are you sure you want to start a new game? Your current progress
            will be lost.
            <div class="text-right mt-4">
              <v-btn
                text
                @click="showResetConfirm = false"
                rounded
                depressed
                large
                >Cancel</v-btn
              >
              <v-btn
                color="primary"
                @click="
                  startNewGame();
                  showResetConfirm = false;
                "
                rounded
                depressed
                large
                >New Game</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Level Up Notification -->
      <v-snackbar v-model="showLevelUp" :timeout="3000" color="success" top>
        <v-row align="center" no-gutters>
          <v-icon class="mr-2">mdi-arrow-up-bold</v-icon>
          <span>Level Up! You've reached Level {{ level }}</span>
        </v-row>
      </v-snackbar>

      <!-- Line Clear Notification -->
      <v-snackbar v-model="showLineCleared" :timeout="2000" color="info" bottom>
        <v-row align="center" no-gutters>
          <v-icon class="mr-2">mdi-delete-sweep</v-icon>
          <span>{{ lineClearedMessage }}</span>
        </v-row>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "BlockBlastGame",

  data() {
    return {
      // Game settings
      BOARD_SIZE: 10,
      POINTS_PER_LINE: 100,
      BLOCKS_PER_LEVEL: 10,

      // Game state
      gameBoard: [],
      score: 0,
      highScore: 0,
      level: 1,
      placedBlocks: 0,
      totalLinesCleared: 0,
      availableBlocks: [],
      selectedBlock: null,
      isGameOver: false,
      isHighScore: false,
      showInstructions: true,
      showResetConfirm: false,
      showLevelUp: false,
      showLineCleared: false,
      lineClearedMessage: "",
      isSoundEnabled: true,

      // UI state
      hoverPosition: null,

      // Game rules
      gameRules: [
        "Select a block from the available blocks",
        "Place blocks on the board to form complete lines",
        "Complete lines are cleared and award points",
        "Points increase with your level",
        "The game ends when no more blocks can be placed",
      ],

      // Audio elements
      sounds: {
        place: null,
        rotate: null,
        lineCleared: null,
        levelUp: null,
        gameOver: null,
        select: null,
      },

      // Block shapes
      BLOCK_SHAPES: [
        // Single block
        { shape: [[true]] },

        // Line shapes
        { shape: [[true, true]] },
        { shape: [[true, true, true]] },
        { shape: [[true], [true]] },
        { shape: [[true], [true], [true]] },

        // L shapes
        {
          shape: [
            [true, false],
            [true, true],
          ],
        },
        {
          shape: [
            [false, true],
            [true, true],
          ],
        },
        {
          shape: [
            [true, true],
            [true, false],
          ],
        },
        {
          shape: [
            [true, true],
            [false, true],
          ],
        },

        // T shape
        {
          shape: [
            [true, true, true],
            [false, true, false],
          ],
        },
        {
          shape: [
            [false, true, false],
            [true, true, true],
          ],
        },

        // Square shape
        {
          shape: [
            [true, true],
            [true, true],
          ],
        },

        // Z shapes
        {
          shape: [
            [true, true, false],
            [false, true, true],
          ],
        },
        {
          shape: [
            [false, true, true],
            [true, true, false],
          ],
        },
      ],
    };
  },

  computed: {
    formattedScore() {
      return this.score.toLocaleString();
    },

    formattedHighScore() {
      return this.highScore.toLocaleString();
    },
  },

  created() {
    // Load high score from localStorage
    this.loadHighScore();

    // Initialize the game board
    this.initializeBoard();

    // Generate initial blocks
    this.generateNewBlocks();

    // Add keyboard listener for rotation
    window.addEventListener("keydown", this.handleKeyDown);

    // Initialize audio elements
    this.initAudio();
  },

  beforeDestroy() {
    // Remove keyboard listener
    window.removeEventListener("keydown", this.handleKeyDown);
  },

  watch: {
    // Watch for level up
    placedBlocks(newValue) {
      if (newValue >= this.level * this.BLOCKS_PER_LEVEL) {
        this.level++;
        this.showLevelUp = true;
        this.playSound("levelUp");
        this.generateNewBlocks(true); // Generate new blocks with bonus
      }
    },

    // Watch for game over
    availableBlocks: {
      handler(newBlocks) {
        if (newBlocks.length > 0 && !this.canPlaceAnyBlock()) {
          this.handleGameOver();
        }
      },
      deep: true,
    },

    // Watch for score changes to update high score
    score(newScore) {
      if (newScore > this.highScore) {
        this.highScore = newScore;
        this.saveHighScore();
        this.isHighScore = true;
      }
    },
  },

  methods: {
    // Initialize audio elements
    initAudio() {
      // Create audio elements
      this.sounds.place = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3"
      );
      this.sounds.rotate = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3"
      );
      this.sounds.lineCleared = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3"
      );
      this.sounds.levelUp = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3"
      );
      this.sounds.gameOver = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3"
      );
      this.sounds.select = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"
      );

      // Preload audio
      Object.values(this.sounds).forEach((sound) => {
        sound.load();
        sound.volume = 0.5;
      });
    },

    // Play a sound effect
    playSound(soundName) {
      if (this.isSoundEnabled && this.sounds[soundName]) {
        // Clone the audio to allow overlapping sounds
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = 0.5;
        sound.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    },

    // Toggle sound on/off
    toggleSound() {
      this.isSoundEnabled = !this.isSoundEnabled;
    },

    // Load high score from localStorage
    loadHighScore() {
      const savedHighScore = localStorage.getItem("blockBlastHighScore");
      if (savedHighScore) {
        this.highScore = parseInt(savedHighScore, 10);
      }
    },

    // Save high score to localStorage
    saveHighScore() {
      localStorage.setItem("blockBlastHighScore", this.highScore.toString());
    },

    // Initialize the game board
    initializeBoard() {
      this.gameBoard = Array(this.BOARD_SIZE)
        .fill(null)
        .map(() => Array(this.BOARD_SIZE).fill(null));
    },

    // Confirm reset game
    confirmReset() {
      if (this.score > 0) {
        this.showResetConfirm = true;
      } else {
        this.startNewGame();
      }
    },

    // Start a new game
    startNewGame() {
      this.initializeBoard();
      this.score = 0;
      this.level = 1;
      this.placedBlocks = 0;
      this.totalLinesCleared = 0;
      this.selectedBlock = null;
      this.isGameOver = false;
      this.isHighScore = false;
      this.generateNewBlocks();
    },

    // Handle game over
    handleGameOver() {
      this.playSound("gameOver");
      this.isGameOver = true;
    },

    // Generate new blocks
    generateNewBlocks() {
      // Always generate exactly 3 new blocks
      const count = 3;
      const newBlocks = [];

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(
          Math.random() * this.BLOCK_SHAPES.length
        );
        const block = JSON.parse(
          JSON.stringify(this.BLOCK_SHAPES[randomIndex])
        );

        // Assign random color
        const colors = ["red", "blue", "green", "yellow", "purple"];

        // Add special blocks at higher levels
        if (this.level >= 3) {
          // Add gold blocks (worth double points)
          if (Math.random() < 0.2) {
            colors.push("gold");
          }

          // Add bomb blocks (clear adjacent cells)
          if (this.level >= 5 && Math.random() < 0.15) {
            colors.push("bomb");
          }
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Add unique ID and color
        const newBlock = {
          ...block,
          color: randomColor,
          id: `block-${Date.now()}-${i}`,
        };

        newBlocks.push(newBlock);
      }

      // Replace existing blocks instead of adding to them
      this.availableBlocks = newBlocks;
    },

    // Handle block selection
    handleBlockSelect(block) {
      this.selectedBlock = block;
      this.playSound("select");
    },

    // Handle cell click for block placement
    handleCellClick(row, col) {
      if (!this.selectedBlock) return;

      // Check if block can be placed at this position
      if (this.canPlaceBlock(this.selectedBlock, row, col)) {
        // Create a copy of the board
        const newBoard = JSON.parse(JSON.stringify(this.gameBoard));

        // Place the block on the board
        this.selectedBlock.shape.forEach((blockRow, rowOffset) => {
          blockRow.forEach((cell, colOffset) => {
            if (cell) {
              newBoard[row + rowOffset][col + colOffset] =
                this.selectedBlock.color;
            }
          });
        });

        // Update the board
        this.gameBoard = newBoard;

        // Play placement sound
        this.playSound("place");

        // Handle bomb blocks (clear adjacent cells)
        if (this.selectedBlock.color === "bomb") {
          this.handleBombPlacement(newBoard, row, col);
        }

        // Remove the placed block from available blocks
        this.availableBlocks = this.availableBlocks.filter(
          (block) => block.id !== this.selectedBlock.id
        );

        // Increment placed blocks counter
        this.placedBlocks++;

        // Clear the selected block
        this.selectedBlock = null;

        // Check for complete lines
        const { clearedBoard, linesCleared } =
          this.checkForCompleteLines(newBoard);

        if (linesCleared > 0) {
          // Award points for cleared lines
          let pointsEarned = linesCleared * this.POINTS_PER_LINE * this.level;

          // Update total lines cleared
          this.totalLinesCleared += linesCleared;

          // Play line cleared sound
          this.playSound("lineCleared");

          // Show notification
          this.lineClearedMessage = `${linesCleared} line${
            linesCleared > 1 ? "s" : ""
          } cleared! +${pointsEarned} points`;
          this.showLineCleared = true;

          // Update the score
          this.score += pointsEarned;

          // Update the board with cleared lines
          this.gameBoard = clearedBoard;
        }

        // Generate new blocks only if all blocks have been used
        if (this.availableBlocks.length <= 1) {
          // If this was the last block, generate 3 new ones
          this.generateNewBlocks();
        }
      }
    },

    // Handle bomb placement (clear adjacent cells)
    handleBombPlacement(board, centerRow, centerCol) {
      // Define the relative positions of adjacent cells (including diagonals)
      const adjacentOffsets = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      // Clear adjacent cells
      adjacentOffsets.forEach(([rowOffset, colOffset]) => {
        const row = centerRow + rowOffset;
        const col = centerCol + colOffset;

        // Check if the cell is within bounds
        if (
          row >= 0 &&
          row < this.BOARD_SIZE &&
          col >= 0 &&
          col < this.BOARD_SIZE
        ) {
          // Clear the cell
          board[row][col] = null;
        }
      });

      // Update the board
      this.gameBoard = board;
    },

    // Handle cell hover for preview
    handleCellHover(row, col) {
      this.hoverPosition = { row, col };
    },

    // Handle cell leave
    handleCellLeave() {
      this.hoverPosition = null;
    },

    // Handle keyboard input
    handleKeyDown(e) {
      // Rotate when 'R' or 'r' is pressed
      if ((e.key === "r" || e.key === "R") && this.selectedBlock) {
        this.rotateSelectedBlock();
      }
    },

    // Rotate the selected block
    rotateSelectedBlock() {
      if (!this.selectedBlock) return;

      // Create a deep copy of the selected block
      const rotatedBlock = JSON.parse(JSON.stringify(this.selectedBlock));

      // Get the dimensions of the current shape
      const rows = rotatedBlock.shape.length;
      const cols = rotatedBlock.shape[0].length;

      // Create a new rotated shape matrix
      const newShape = Array(cols)
        .fill(null)
        .map(() => Array(rows).fill(false));

      // Perform the rotation (90 degrees clockwise)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          newShape[c][rows - 1 - r] = rotatedBlock.shape[r][c];
        }
      }

      rotatedBlock.shape = newShape;
      this.selectedBlock = rotatedBlock;

      // Play rotation sound
      this.playSound("rotate");
    },

    // Check if a block can be placed at the specified position
    canPlaceBlock(block, startRow, startCol) {
      const rows = this.gameBoard.length;
      const cols = this.gameBoard[0].length;

      // Check if the block would go out of bounds
      if (
        startRow + block.shape.length > rows ||
        startCol + block.shape[0].length > cols
      ) {
        return false;
      }

      // Check if any cell is already occupied
      for (let r = 0; r < block.shape.length; r++) {
        for (let c = 0; c < block.shape[0].length; c++) {
          if (
            block.shape[r][c] &&
            this.gameBoard[startRow + r][startCol + c] !== null
          ) {
            return false;
          }
        }
      }

      return true;
    },

    // Check if any available block can be placed anywhere on the board
    canPlaceAnyBlock() {
      for (const block of this.availableBlocks) {
        // Try all four rotations of the block
        const rotations = [0, 1, 2, 3];

        for (const rotation of rotations) {
          // Create a copy of the block
          const rotatedBlock = JSON.parse(JSON.stringify(block));

          // Apply rotations
          for (let r = 0; r < rotation; r++) {
            const rows = rotatedBlock.shape.length;
            const cols = rotatedBlock.shape[0].length;

            // Create a new rotated shape matrix
            const newShape = Array(cols)
              .fill(null)
              .map(() => Array(rows).fill(false));

            // Perform the rotation (90 degrees clockwise)
            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                newShape[j][rows - 1 - i] = rotatedBlock.shape[i][j];
              }
            }

            rotatedBlock.shape = newShape;
          }

          // Check if this rotation can be placed anywhere
          for (
            let row = 0;
            row <= this.BOARD_SIZE - rotatedBlock.shape.length;
            row++
          ) {
            for (
              let col = 0;
              col <= this.BOARD_SIZE - rotatedBlock.shape[0].length;
              col++
            ) {
              if (this.canPlaceBlock(rotatedBlock, row, col)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    // Check for complete horizontal lines
    checkForCompleteLines(board) {
      const rows = board.length;
      const cols = board[0].length;
      const newBoard = JSON.parse(JSON.stringify(board));
      let linesCleared = 0;

      // Check for complete horizontal lines
      for (let i = 0; i < rows; i++) {
        let isComplete = true;

        for (let j = 0; j < cols; j++) {
          if (newBoard[i][j] === null) {
            isComplete = false;
            break;
          }
        }

        if (isComplete) {
          // Clear the line
          for (let j = 0; j < cols; j++) {
            newBoard[i][j] = null;
          }
          linesCleared++;
        }
      }

      return { clearedBoard: newBoard, linesCleared };
    },

    // Get affected cells for preview
    getAffectedCells(row, col) {
      if (!this.selectedBlock) return [];

      const affectedCells = [];

      // Check if the block would go out of bounds
      const isValidPlacement = this.canPlaceBlock(this.selectedBlock, row, col);

      // Add all cells that would be affected by this block
      for (let r = 0; r < this.selectedBlock.shape.length; r++) {
        for (let c = 0; c < this.selectedBlock.shape[0].length; c++) {
          if (this.selectedBlock.shape[r][c]) {
            const cellRow = row + r;
            const cellCol = col + c;

            // Check if this cell is within bounds
            const isInBounds =
              cellRow >= 0 &&
              cellRow < this.gameBoard.length &&
              cellCol >= 0 &&
              cellCol < this.gameBoard[0].length;

            if (isInBounds) {
              // Check if this specific cell can be placed (not already occupied)
              const isCellValid = this.gameBoard[cellRow][cellCol] === null;

              affectedCells.push({
                row: cellRow,
                col: cellCol,
                valid: isCellValid && isValidPlacement,
              });
            }
          }
        }
      }

      return affectedCells;
    },

    // Check if a cell is part of the preview
    isPreviewCell(row, col) {
      if (!this.selectedBlock || !this.hoverPosition) return false;

      const affectedCells = this.getAffectedCells(
        this.hoverPosition.row,
        this.hoverPosition.col
      );
      return affectedCells.some((cell) => cell.row === row && cell.col === col);
    },

    // Get the preview class for a cell
    getPreviewClass(row, col) {
      if (!this.selectedBlock || !this.hoverPosition) return "";

      const affectedCells = this.getAffectedCells(
        this.hoverPosition.row,
        this.hoverPosition.col
      );
      const matchingCell = affectedCells.find(
        (cell) => cell.row === row && cell.col === col
      );

      if (matchingCell) {
        return matchingCell.valid
          ? `${this.selectedBlock.color} valid-preview`
          : "invalid-preview";
      }

      return "";
    },

    // Get the class for a cell based on its content
    getCellClass(cell, row, col) {
      // Use the parameters to potentially add position-based styling
      const isEvenPosition = (row + col) % 2 === 0;
      return {
        [cell]: cell !== null,
        empty: cell === null,
        "even-cell": isEvenPosition && cell === null,
        "odd-cell": !isEvenPosition && cell === null,
      };
    },
  },
};
</script>

<style scoped>
.game-container {
  max-width: 500px;
  margin: 0 auto;
}

.game-board-container {
  border-radius: 15px;
  overflow: hidden;
}

.game-board {
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  gap: 4px;
  padding: 4px;
}

.game-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.game-cell {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
}

.game-cell:hover {
  transform: scale(1.05);
}

.game-cell.empty {
  background-color: #424242;
}

.game-cell.even-cell {
  background-color: #3d3d3d;
}

.game-cell.odd-cell {
  background-color: #424242;
}

.game-cell.red {
  background-color: #f44336;
}

.game-cell.blue {
  background-color: #2196f3;
}

.game-cell.green {
  background-color: #4caf50;
}

.game-cell.yellow {
  background-color: #ffeb3b;
}

.game-cell.purple {
  background-color: #9c27b0;
}

.game-cell.gold {
  background-color: #ffc107;
  position: relative;
  overflow: hidden;
}

.game-cell.bomb {
  background-color: #212121;
  position: relative;
}

.gold-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.7;
  animation: sparkle 1.5s infinite;
}

.bomb-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: #f44336;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1s infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  opacity: 0.6;
}

.preview-overlay.valid-preview.red {
  background-color: #f44336;
}

.preview-overlay.valid-preview.blue {
  background-color: #2196f3;
}

.preview-overlay.valid-preview.green {
  background-color: #4caf50;
}

.preview-overlay.valid-preview.yellow {
  background-color: #ffeb3b;
}

.preview-overlay.valid-preview.purple {
  background-color: #9c27b0;
}

.preview-overlay.valid-preview.gold {
  background-color: #ffc107;
}

.preview-overlay.valid-preview.bomb {
  background-color: #212121;
}

.preview-overlay.invalid-preview {
  background-color: #f44336;
}

.block-selector {
  display: flex;
  justify-content: center;
  gap: 24px;
  min-height: 80px;
}

.block-option {
  padding: 8px;
  border-radius: 4px;
  background-color: #424242;
  cursor: pointer;
  transition: all 0.2s;
}

.block-option:hover {
  background-color: #616161;
  transform: scale(1.03);
}

.block-option.selected {
  background-color: #616161;
  box-shadow: 0 0 0 2px white;
}

.block-preview {
  display: grid;
  gap: 4px;
}

.block-cell {
  width: 24px;
  height: 24px;
  border-radius: 2px;
}

.block-cell.red {
  background-color: #f44336;
}

.block-cell.blue {
  background-color: #2196f3;
}

.block-cell.green {
  background-color: #4caf50;
}

.block-cell.yellow {
  background-color: #ffeb3b;
}

.block-cell.purple {
  background-color: #9c27b0;
}

.block-cell.gold {
  background-color: #ffc107;
}

.block-cell.bomb {
  background-color: #212121;
}

.no-blocks {
  color: #9e9e9e;
  padding: 16px;
  text-align: center;
  width: 100%;
}

.special-block {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.special-block.gold {
  background-color: #ffc107;
  position: relative;
  overflow: hidden;
}

.special-block.bomb {
  background-color: #212121;
  position: relative;
}

.special-block.gold::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.7;
}

.special-block.bomb::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: #f44336;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
@media (max-width: 600px) {
  .game-cell {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }

  .block-cell {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
}

@media (max-width: 480px) {
  .game-cell {
    width: 28px;
    height: 28px;
    border-radius: 4px;
  }

  .block-cell {
    width: 18px;
    height: 18px;
    border-radius: 2px;
  }
}

@media (max-width: 360px) {
  .game-cell {
    width: 20px;
    height: 20px;
    border-radius: 3px;
  }

  .block-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
}
</style>
