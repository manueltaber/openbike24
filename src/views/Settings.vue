<template>
  <v-card class="pa-5">
    <v-card-title>
      Settings
    </v-card-title>
    <v-card-actions>
      <v-btn color="error" block :loading="loading" @click="signOut">
        Sign out
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { signOut } from "@/components/authentication/firebase";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    loading: false
  }),
  methods: {
    signOut: async function() {
      this.loading = true;
      await signOut();
      this.$router.push("/authentication/signin");
    }
  }
});
</script>
