<template>
  <v-card class="elevation-12 pa-5">
    <v-card-title v-if="donePasswortReset">
      <v-row align="center" justify="center">
        <v-avatar size="62">
          <v-icon>{{ mdiEmailIcon }}</v-icon>
        </v-avatar>
      </v-row>
    </v-card-title>
    <v-card-title v-else>
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
    <v-card-text v-if="donePasswortReset" align="center" justify="center">
      We sent a password reset link to {{ this.email }}. If you don't see the
      the email, check your spam folder.
    </v-card-text>
    <v-card-text v-if="!donePasswortReset">
      <v-form>
        <email-input
          v-model="email"
          :disabled="componentsDisabled"
          @confirm="resetPassword"
        />
      </v-form>
    </v-card-text>
    <v-card-actions v-if="!donePasswortReset">
      <v-btn
        color="primary"
        block
        :disabled="resetPasswordDisabled"
        :loading="componentsDisabled"
        @click="resetPassword"
      >
        Reset Password
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn text block :disabled="componentsDisabled" @click="signIn">
        Sign in
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiBikeFast, mdiEmail } from "@mdi/js";
import {
  FirebaseError,
  sendPasswordResetEmail
} from "@/components/authentication/firebase";

export default Vue.extend({
  name: "ResetPassword",
  components: {
    "email-input": () => import("@/components/authentication/EmailInput.vue")
  },
  props: {
    prefillEmail: { type: String, required: false, default: null }
  },
  data: () => ({
    mdiBikeFastIcon: mdiBikeFast,
    mdiEmailIcon: mdiEmail,
    email: null as string | null,
    errorMessage: null as string | null,
    doingPasswordReset: false,
    donePasswortReset: false
  }),
  computed: {
    resetPasswordDisabled: function(): boolean {
      if (this.email) {
        return false;
      } else {
        return true;
      }
    },
    componentsDisabled: function(): boolean {
      return this.doingPasswordReset;
    }
  },
  mounted: function() {
    this.email = this.prefillEmail;
  },
  methods: {
    resetPassword: async function() {
      if (this.email) {
        this.doingPasswordReset = true;
        try {
          await sendPasswordResetEmail(this.email);
          this.errorMessage = null;
          this.donePasswortReset = true;
          this.doingPasswordReset = false;
        } catch (error) {
          if (error instanceof FirebaseError) {
            this.errorMessage = error.message;
            this.doingPasswordReset = false;
          } else {
            throw error;
          }
        }
      }
    },
    signIn: function() {
      this.$emit("sign-in");
    }
  }
});
</script>
