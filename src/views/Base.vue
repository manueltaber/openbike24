<template>
  <span v-if="!loadingUser">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>openbike24</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height main-background pt-0" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-bottom-navigation app grow color="primary">
      <v-btn :to="'/live'">
        <span>Live</span>
        <v-icon>{{ mdiMapMarkerOutlineIcon }}</v-icon>
      </v-btn>

      <v-btn :to="'/routes'">
        <span>Routes</span>
        <v-icon>{{ mdiHistoryIcon }}</v-icon>
      </v-btn>

      <v-btn :to="'/settings'">
        <span>Settings</span>
        <v-icon>{{ mdiCogOutlineIcon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { getCurrentUser } from "@/components/authentication/firebase";
import { mdiMapMarkerOutline, mdiHistory, mdiCogOutline } from "@mdi/js";

export default Vue.extend({
  name: "Base",
  data: () => ({
    mdiMapMarkerOutlineIcon: mdiMapMarkerOutline,
    mdiHistoryIcon: mdiHistory,
    mdiCogOutlineIcon: mdiCogOutline,
    loadingUser: true
  }),
  mounted: async function() {
    try {
      await getCurrentUser();
      this.loadingUser = false;
    } catch (error) {
      this.$router.push("/authentication/signin");
    }
  }
});
</script>
