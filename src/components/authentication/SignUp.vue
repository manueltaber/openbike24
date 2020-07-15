<template>
  <v-card class="elevation-12 pa-5">
    <v-card-title>
      <v-row align="center" justify="center">
        <v-avatar color="primary" size="62">
          <span class="white--text headline">OB</span>
        </v-avatar>
      </v-row>
    </v-card-title>
    <v-card-actions v-if="errorMessage">
      <v-alert type="error" width="100%">
        {{ errorMessage }}
      </v-alert>
    </v-card-actions>
    <v-card-text>
      <v-form>
        <email-input v-model="email" :disabled="componentsDisabled" />
        <password-input
          v-model="password"
          :disabled="componentsDisabled"
          :perform-validation="true"
          :calculate-strength="true"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        block
        :disabled="componentsDisabled"
        :loading="doingSignUp"
        @click="signUp"
      >
        Sign up
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <v-row align="center" justify="center">
        OR
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="#4267B2"
        :dark="!componentsDisabled"
        block
        :disabled="componentsDisabled"
        @click="signUpWithFacebook"
      >
        <v-icon left>
          {{ mdiFacebookIcon }}
        </v-icon>
        Sign up with Facebook
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        color="#DB4437"
        :dark="!componentsDisabled"
        block
        :disabled="componentsDisabled"
        @click="signUpWithGoogle"
      >
        <v-icon left>
          {{ mdiGoogleIcon }}
        </v-icon>
        Sign up with Google
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        text
        block
        :disabled="componentsDisabled"
        @click="alreadyHaveAccount"
      >
        Already have an account?
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiFacebook, mdiGoogle } from "@mdi/js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "@/components/authentication/firebase";

export default Vue.extend({
  name: "SignUp",
  components: {
    "email-input": () => import("@/components/authentication/EmailInput.vue"),
    "password-input": () =>
      import("@/components/authentication/PasswordInput.vue")
  },
  data: () => ({
    mdiFacebookIcon: mdiFacebook,
    mdiGoogleIcon: mdiGoogle,
    email: null as string | null,
    password: null as string | null,
    errorMessage: null as string | null,
    doingSignUp: false
  }),
  computed: {
    componentsDisabled: function(): boolean {
      return this.doingSignUp;
    }
  },
  methods: {
    signUp: async function() {
      this.doingSignUp = true;

      if (this.email && this.password) {
        try {
          const res = await createUserWithEmailAndPassword(
            this.email,
            this.password
          );
          if (res.user) {
            sendEmailVerification(res.user);
            this.$emit("successful-sign-up");
          }
        } catch (error) {
          this.errorMessage = error;
          this.doingSignUp = false;
        }
      }
    },
    signUpWithFacebook: function() {
      console.info("signupwithfacebook");
    },
    signUpWithGoogle: function() {
      console.info("signupwithgoogle");
    },
    alreadyHaveAccount: function() {
      this.$emit("already-have-account");
    }
  }
});
</script>
