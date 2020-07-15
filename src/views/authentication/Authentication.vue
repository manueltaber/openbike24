<template>
  <v-container class="fill-height main-background" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: "Authentication",
  data: () => ({
    showSignUp: false
  })
};
</script>

<style scoped>
.main-background {
  background-image: url("/img/mountainbike.jpg");
  background-size: cover;
  background-color: #cccccc;
  /*background-repeat: repeat;*/
}
</style>
