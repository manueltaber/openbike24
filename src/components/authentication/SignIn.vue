<template>
  <v-card class="elevation-12 pa-5">
    <v-card-title>
      <v-row align="center" justify="center">
        <v-avatar color="primary" size="62">
          <span>
            <v-icon dark>{{ mdiBikeFastIcon }}</v-icon>
          </span>
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
        <password-input v-model="password" :disabled="componentsDisabled" />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-checkbox
        v-model="rememberMe"
        label="Remember me"
        :disabled="componentsDisabled"
      ></v-checkbox>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        :disabled="componentsDisabled"
        @click="resetPassword"
      >
        Reset password
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        color="primary"
        block
        :disabled="componentsDisabled"
        :loading="componentsDisabled"
        @click="signIn"
      >
        Sign in
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
        @click="signInWithFacebook"
      >
        <v-icon left>
          {{ mdiFacebookIcon }}
        </v-icon>
        Sign in with Facebook
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        color="#DB4437"
        :dark="!componentsDisabled"
        block
        :disabled="componentsDisabled"
        @click="signInWithGoogle"
      >
        <v-icon left>
          {{ mdiGoogleIcon }}
        </v-icon>
        Sign in with Google
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn text block :disabled="componentsDisabled" @click="newAccount">
        Don't have an account?
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiBikeFast, mdiFacebook, mdiGoogle } from "@mdi/js";
import firebase from "firebase";
import {
  FirebaseError,
  signInWithEmailAndPassword,
  signInWithFacebook,
  signInWithGoogle
} from "@/components/authentication/firebase";

export default Vue.extend({
  name: "SignIn",
  components: {
    "email-input": () => import("@/components/authentication/EmailInput.vue"),
    "password-input": () =>
      import("@/components/authentication/PasswordInput.vue")
  },
  data: () => ({
    mdiBikeFastIcon: mdiBikeFast,
    mdiFacebookIcon: mdiFacebook,
    mdiGoogleIcon: mdiGoogle,
    email: null as string | null,
    password: null as string | null,
    rememberMe: true,
    errorMessage: null as string | null,
    doingSignIn: false
  }),
  computed: {
    componentsDisabled: function(): boolean {
      return this.doingSignIn;
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        // const displayName = user.displayName;
        const email = user.email;
        /*const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        const providerData = user.providerData;*/
        // ...
        console.info("User is signed in");
        console.info(email);
        this.$emit("successful-sign-in");
      } else {
        console.info("User is signed out");
      }
    });
  },
  methods: {
    resetPassword: async function() {
      this.$emit("reset-password", this.email ? this.email : null);
    },
    signIn: async function() {
      if (this.email && this.password) {
        this.doingSignIn = true;
        try {
          await signInWithEmailAndPassword(
            this.email,
            this.password,
            this.rememberMe
          );
        } catch (error) {
          if (error instanceof FirebaseError) {
            this.errorMessage = error.message;
            this.doingSignIn = false;
          } else {
            throw error;
          }
        }
      }
    },
    signInWithFacebook: async function() {
      this.doingSignIn = true;
      try {
        await signInWithFacebook();
      } catch (error) {
        if (error instanceof FirebaseError) {
          this.errorMessage = error.message;
          this.doingSignIn = false;
        } else {
          throw error;
        }
      }
    },
    signInWithGoogle: async function() {
      this.doingSignIn = true;
      try {
        await signInWithGoogle();
      } catch (error) {
        if (error instanceof FirebaseError) {
          this.errorMessage = error.message;
          this.doingSignIn = false;
        } else {
          throw error;
        }
      }
    },
    newAccount: function() {
      this.$emit("new-account");
    }
  }
});
</script>
