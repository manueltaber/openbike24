<template>
  <v-card class="pa-5">
    <v-card-title>
      Routes
    </v-card-title>
    <v-row v-if="loading" class="text-center">
      <v-col cols="12">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <!--<v-expansion-panels multiple>
      <v-expansion-panel v-for="route in routes" :key="route.uid">
        <v-expansion-panel-header>
          {{ route.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ route.timestamp }}
          {{ route.coordinates }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>-->
    <v-list-item v-for="route in routes" :key="route.uid" two-line>
      <v-list-item-content>
        <v-list-item-title>{{ route.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ new Date(route.timestamp * 1000).toLocaleString() }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon @click="deleteRoute(route)">
          <v-icon> {{ mdiDeleteIcon }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiDelete } from "@mdi/js";
import { Route } from "./PositionData";
import firebase from "firebase/app";

export default Vue.extend({
  name: "Routes",
  data: () => ({
    mdiDeleteIcon: mdiDelete,
    loading: true as boolean,
    user: null as firebase.User | null,
    routes: [] as Array<Route>
  }),
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
      if (user != null) {
        console.info("User ready");
        console.info(user.uid);
        this.loadRoutes();
      } else {
        console.info("Unknown");
      }
    });
  },
  methods: {
    loadRoutes: function() {
      if (this.user) {
        this.loading = true;
        const db = firebase.firestore();
        db.collection("users")
          .doc(this.user.uid)
          .collection("routes")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              const route: Route = doc.data() as Route;
              this.routes.push(route);
            });
            this.loading = false;
          });
      }
    },
    deleteRoute: function(route: Route) {
      if (this.user) {
        console.info("deleteRoute");
        const db = firebase.firestore();
        db.collection("users")
          .doc(this.user.uid)
          .collection("routes")
          .doc(route.uid)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
            this.loadRoutes();
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      }
    }
  }
});
</script>
