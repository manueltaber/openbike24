<template>
  <sign-in @new-account="newAccount" @successful-sign-in="successfulSignIn" />
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
    newAccount: function() {
      this.$router.push("/authentication/signup");
    },
    successfulSignIn: function() {
      this.$router.push("/live");
    }
  }
});
</script>
