import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvHJEdlOdDaJ0quwjDUu5xSTT2FzLy-HA",
  authDomain: "openbike24.firebaseapp.com",
  databaseURL: "https://openbike24.firebaseio.com",
  projectId: "openbike24",
  storageBucket: "openbike24.appspot.com",
  messagingSenderId: "668464320556",
  appId: "1:668464320556:web:9ebf44612c3c0d821dc189",
  measurementId: "G-Y7FTBY26GG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth();
firebase.firestore();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
