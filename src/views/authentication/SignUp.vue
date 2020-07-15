<template>
  <sign-up
    @successful-sign-up="successfulSignUp"
    @already-have-account="alreadyHaveAccount"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SignUpView",
  components: {
    "sign-up": () => import("@/components/authentication/SignUp.vue")
  },
  data: () => ({}),
  methods: {
    successfulSignUp: function() {
      this.$router.push("/");
    },
    alreadyHaveAccount: function() {
      this.$router.push("/authentication/signin");
    }
  }
});
</script>
