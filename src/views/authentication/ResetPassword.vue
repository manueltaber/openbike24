<template>
  <reset-password :prefill-email="prefillEmail" @sign-in="signIn" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PasswordResetView",
  components: {
    "reset-password": () =>
      import("@/components/authentication/ResetPassword.vue")
  },
  props: {
    prefillEmail: { type: String, required: false, default: null }
  },
  data: () => ({}),
  methods: {
    signIn: function() {
      this.$router.push("/authentication/signin");
    }
  }
});
</script>
