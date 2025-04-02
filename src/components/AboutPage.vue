<template>
  <div>
    <v-container fluid class="about-page pa-4 pa-md-8">
      <v-parallax
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        height="300"
        class="rounded-lg mb-8"
      >
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <div class="white--text">
              <h1 class="text-h3 font-weight-bold mb-2">Memory Match Game</h1>
              <p class="text-subtitle-1">
                Challenge your memory with this fun interactive game
              </p>
              <v-btn
                color="primary"
                class="mt-4"
                large
                rounded
                elevation="8"
                to="/"
              >
                <v-icon left>mdi-play</v-icon>
                Play Now
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-parallax>

      <v-row>
        <v-col cols="12" md="6">
          <v-card
            class="mx-auto h-100 transition-swing"
            elevation="6"
            hover
            shaped
          >
            <v-card-title class="primary--text text-h5 font-weight-bold">
              <v-icon large color="primary" class="mr-2"
                >mdi-information-outline</v-icon
              >
              About This Game
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-row justify="center" class="mb-4">
                <v-avatar size="120" class="elevation-4">
                  <v-img
                    src="https://cdn-icons-png.flaticon.com/128/9192/9192463.png"
                    alt="Game Logo"
                    contain
                    class="game-logo"
                  ></v-img>
                </v-avatar>
              </v-row>
              <p class="text-body-1 mb-3">
                Welcome to the <strong>TwinFlip!</strong> This is a fun and
                interactive game designed to test your memory skills. Flip the
                cards and match pairs to win the game in the shortest time
                possible.
              </p>
              <p class="text-body-1">
                This game is designed with a user-friendly interface and
                responsive design, ensuring a smooth experience across different
                devices. Whether you're playing on a desktop or mobile, the game
                adapts seamlessly.
              </p>
              <v-chip-group class="mt-4">
                <v-chip color="primary" outlined small>Memory</v-chip>
                <v-chip color="primary" outlined small>Fun</v-chip>
                <v-chip color="primary" outlined small>Challenge</v-chip>
                <v-chip color="primary" outlined small>Responsive</v-chip>
              </v-chip-group>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0">
              <v-btn text color="primary" class="text-capitalize">
                <v-icon left>mdi-help-circle</v-icon>
                How to Play
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" class="text-capitalize">
                <v-icon left>mdi-star</v-icon>
                Features
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            class="mx-auto h-100 transition-swing"
            elevation="6"
            hover
            shaped
          >
            <v-card-title class="primary--text text-h5 font-weight-bold">
              <v-icon large color="primary" class="mr-2">mdi-account</v-icon>
              About the Developer
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-row justify="center" class="mb-4">
                <v-avatar size="150" class="elevation-8">
                  <v-img
                    src="https://via.placeholder.com/150"
                    alt="Developer Image"
                    class="developer-image"
                  ></v-img>
                </v-avatar>
              </v-row>
              <h3
                class="text-h6 font-weight-bold text-center primary--text mb-3"
              >
                Rohit Kumar Gupta
              </h3>
              <p class="text-body-1 mb-3">
                A passionate frontend developer and teacher specializing in
                Vue.js and Vuetify. Rohit focuses on building intuitive and
                responsive applications that provide exceptional user
                experiences.
              </p>
              <p class="text-body-1">
                If you have any suggestions or feedback, feel free to connect
                and share your thoughts!
              </p>
              <v-row class="mt-4">
                <v-col cols="12" md="6" sm="12">
                  <div class="d-flex">
                    <v-icon color="primary">mdi-email</v-icon>
                    <a
                      class="ml-4"
                      href="mailto:rohitkrgupta333@gmail.com"
                      style="text-decoration: none"
                    >
                      rohitkrgupta333@gmail.com
                    </a>
                  </div>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <div class="d-flex">
                    <v-icon color="primary">mdi-web</v-icon>
                    <a
                      class="ml-4"
                      href="https://rkgupta-dev.web.app/"
                      style="text-decoration: none"
                      target="_blank"
                    >
                      rkgupta-dev.web.app
                    </a>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-btn
                href="https://github.com/rkgupta-dev"
                target="_blank"
                color="grey darken-3"
                class="text-capitalize"
                elevation="2"
                fab
                small
              >
                <v-icon>mdi-github</v-icon>
              </v-btn>
              <v-btn
                href="https://www.linkedin.com/in/rohit-kr-gupta-921760208/"
                target="_blank"
                color="blue darken-3"
                class="text-capitalize ml-4"
                elevation="2"
                fab
                small
              >
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
              <v-btn
                href="https://x.com/KrRohit3337"
                target="_blank"
                color="light-blue"
                class="text-capitalize ml-4"
                elevation="2"
                fab
                small
              >
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                rounded
                class="text-capitalize"
                @click="openContactDialog"
              >
                <v-icon left>mdi-message</v-icon>
                Contact Me
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- contact dialog -->
    <div>
      <!-- Contact Form Dialog -->
      <v-dialog v-model="showContactDialog" max-width="500">
        <v-card class="pa-4 rounded-lg">
          <!-- Title -->
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon left color="primary">mdi-email-outline</v-icon>
            Contact Me
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pt-4">
            <v-form ref="contactForm" v-model="valid">
              <!-- Name (Optional) -->
              <v-text-field
                v-model="form.name"
                label="Full Name"
                outlined
                dense
                prepend-inner-icon="mdi-account"
                class="rounded-lg"
              ></v-text-field>

              <!-- Email (Required & Validated) -->
              <v-text-field
                v-model="form.email"
                label="Email Address"
                outlined
                dense
                prepend-inner-icon="mdi-email"
                class="rounded-lg"
                :rules="[rules.required, rules.email]"
              ></v-text-field>

              <!-- Phone Number (Optional) -->
              <v-text-field
                v-model="form.phone"
                label="Phone Number"
                outlined
                dense
                prepend-inner-icon="mdi-phone"
                class="rounded-lg"
              ></v-text-field>

              <!-- Message (Required) -->
              <v-textarea
                v-model="form.message"
                label="Your Message"
                outlined
                rows="3"
                prepend-inner-icon="mdi-message-text"
                class="rounded-lg"
                :rules="[rules.required]"
              ></v-textarea>
            </v-form>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions class="justify-end">
            <v-btn
              text
              class="text-capitalize"
              @click="showContactDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!valid"
              class="rounded-lg px-6"
              @click="submitContactForm"
            >
              <v-icon left>mdi-send</v-icon> Send Message
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Snackbar for feedback -->
      </v-dialog>
      <v-snackbar
        v-model="snackbar.show"
        :timeout="3000"
        :color="snackbar.color"
      >
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar.show = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </div>

    <v-footer padless class="mt-12 rounded-lg" color="primary " dark>
      <v-card flat tile width="100%" class="primary text-center">
        <!-- <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text> -->

        <!-- <v-divider></v-divider> -->

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>TwinFlip</strong> — All
          Rights Reserved
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
      showContactDialog: false,
      loading: false,
      valid: false,
      form: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
      rules: {
        required: (value) => !!value || "This field is required",
        email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid",
      },
      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  methods: {
    openContactDialog() {
      this.showContactDialog = true;
    },
    submitContactForm() {
      if (!this.$refs.contactForm.validate()) return;

      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.showContactDialog = false;
        this.$refs.contactForm.reset();

        // ✅ Properly update snackbar properties
        this.snackbar.message = "Message sent successfully!";
        this.snackbar.color = "success";
        this.snackbar.show = true; // Now the snackbar should appear
      }, 2000);
    },
  },
};
</script>

<style scoped>
p {
  line-height: 1.8;
  letter-spacing: 0.3px;
}

.game-logo {
  transition: transform 0.3s ease;
}

.game-logo:hover {
  transform: scale(1.1);
}

.developer-image {
  transition: all 0.3s ease;
}

.developer-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* .v-card:hover {
  transform: translateY(-5px);
} */

.v-btn {
  letter-spacing: 1px;
}

.v-avatar {
  transition: all 0.3s ease;
}

.v-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>
