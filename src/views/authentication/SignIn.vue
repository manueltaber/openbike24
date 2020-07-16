<template>
  <sign-in
    @reset-password="resetPassword"
    @new-account="newAccount"
    @successful-sign-in="successfulSignIn"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SignInView",
  components: {
    "sign-in": () => import("@/components/authentication/SignIn.vue")
  },
  data: () => ({}),
  methods: {
    resetPassword: function(params: string | null) {
      if (params) {
        this.$router.push({
          name: "ResetPassword",
          params: { prefillEmail: params }
        });
      } else {
        this.$router.push({
          name: "ResetPassword"
        });
      }
    },
    newAccount: function() {
      this.$router.push("/authentication/signup");
    },
    successfulSignIn: function() {
      this.$router.push("/live");
    }
  }
});
</script>
