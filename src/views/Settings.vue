<template>
  <v-card class="pa-5">
    <v-card-title>
      Settings
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="photoURL ? photoURL : ''">
              <template v-slot:placeholder>
                <v-icon>{{ mdiAccountIcon }}</v-icon>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ email }}</v-list-item-title>
            <v-list-item-subtitle>User</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" block :loading="loading" @click="signOut">
        Sign out
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiAccount } from "@mdi/js";
import { getCurrentUser } from "@/components/authentication/firebase";
import { signOut } from "@/components/authentication/firebase";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    mdiAccountIcon: mdiAccount,
    loading: false,
    email: null as string | null,
    photoURL: null as string | null
  }),
  mounted: async function() {
    try {
      const user = await getCurrentUser();
      this.email = user.email;
      this.photoURL = user.photoURL;
    } catch {
      this.email = null;
      this.photoURL = null;
    }
  },
  methods: {
    signOut: async function() {
      this.loading = true;
      await signOut();
      this.$router.push("/authentication/signin");
    }
  }
});
</script>
