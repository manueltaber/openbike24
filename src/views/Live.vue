<template>
  <v-card v-if="!geolocationBrowserSupport">
    No Browser Support
  </v-card>
  <v-card v-else-if="geolocationError">
    Geolocation Error
  </v-card>
  <v-card v-else class="pa-5">
    <v-row class="text-center">
      <v-col cols="12">
        <v-progress-circular
          :rotate="110"
          :size="150"
          :value="currentSpeedProgress"
          :width="9"
          :color="currentSpeedColor"
        >
          <v-row class="text-center">
            <v-col cols="12" class="pa-0 pt-4">
              <h1>
                <span v-if="geolocationReady">
                  {{ currentSpeedInKmHRouned }}
                </span>
                <v-icon v-else :color="currentSpeedColor" size="40">
                  {{ mdiTimerSandIcon }}
                </v-icon>
              </h1>
            </v-col>
            <v-col cols="12" class="pa-0">
              <p>km/h</p>
            </v-col>
          </v-row>
        </v-progress-circular>

        <!--<h2>Geolocation Browser Support: {{ geolocationBrowserSupport }}</h2>
        <p>{{ currentPosition }}</p>-->
        <!--<h3>Lat {{ currentLatitude }} /Long {{ currentLongitude }}</h3>
        <p>
          Accuracy:
          {{ currentAccuracyRounded ? currentAccuracyRounded : "-na-" }}m
        </p>-->

        <v-row>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ mdiApproximatelyEqualIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>
                {{ currentAccuracyRounded ? currentAccuracyRounded : "-na-" }}m
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ mdiImageFilterHdrIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>
                {{ currentAltitudeRounded ? currentAltitudeRounded : "-na-" }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <!--<v-icon>mdi-image-filter-hdr</v-icon>
        <h3>Alt {{ currentAltitude ? currentAltitude : "-na-" }}</h3>
        <p>Acc {{ currentAltitudeAccuracy }}m</p>

        <p>{{ counter }}</p>
        <p>Speed: {{ currentSpeed }}</p>-->
      </v-col>
    </v-row>
    <v-card-actions v-if="!trackingUUID">
      <v-btn color="primary" block @click="startTracking">
        <v-icon left>
          {{ mdiTimerOutlineIcon }}
        </v-icon>
        Start tracking
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="trackingUUID && !trackingPaused">
      <v-btn color="primary" block @click="pauseTracking">
        <v-icon left>
          {{ mdiPauseIcon }}
        </v-icon>
        Pause tracking
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="trackingUUID && trackingPaused">
      <v-btn color="primary" block @click="resumeTracking">
        <v-icon left>
          {{ mdiPlayIcon }}
        </v-icon>
        Resume tracking
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="trackingUUID">
      <v-btn color="error" block @click="stopTracking">
        <v-icon left>
          {{ mdiTimerOffOutlineIcon }}
        </v-icon>
        Stop tracking
      </v-btn>
    </v-card-actions>
    <v-dialog v-if="trackingDialogVisible" :value="true" :max-width="300">
      <v-card>
        <v-card-title>Stop tracking</v-card-title>
        <v-card-text>Sure stop tracking?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="trackingDialogCancel">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="trackingDialogConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  mdiTimerSand,
  mdiApproximatelyEqual,
  mdiImageFilterHdr,
  mdiTimerOutline,
  mdiPause,
  mdiPlay,
  mdiTimerOffOutline
} from "@mdi/js";
import { Route } from "./PositionData";
import { getCurrentUser } from "@/components/authentication/firebase";
import firebase from "firebase/app";

export default Vue.extend({
  name: "Live",
  data: () => ({
    mdiTimerSandIcon: mdiTimerSand,
    mdiApproximatelyEqualIcon: mdiApproximatelyEqual,
    mdiImageFilterHdrIcon: mdiImageFilterHdr,
    mdiTimerOutlineIcon: mdiTimerOutline,
    mdiPauseIcon: mdiPause,
    mdiPlayIcon: mdiPlay,
    mdiTimerOffOutlineIcon: mdiTimerOffOutline,
    geolocationBrowserSupport: false,
    geolocationReady: false,
    geolocationError: false,
    geolocationOptions: {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    },
    geolocationWatchId: null as number | null,

    currentPosition: null as Position | null,
    currentLatitude: null as number | null,
    currentLongitude: null as number | null,
    currentAccuracy: null as number | null,
    currentAltitude: null as number | null,
    currentAltitudeAccuracy: null as number | null,
    currentSpeed: 0 as number,
    positionHistory: [] as Array<Position>,
    counter: 0,

    user: null as firebase.User | null,
    trackingUUID: null as string | null,
    trackingPaused: false,
    trackingDialogVisible: false
  }),
  computed: {
    currentSpeedInKmHRouned: function() {
      // current speed = m/s
      return (this.currentSpeed * 3.6).toFixed(2);
    },
    currentAccuracyRounded: function() {
      if (this.currentAccuracy) {
        return this.currentAccuracy.toFixed(0);
      }
      return null;
    },
    currentAltitudeRounded: function() {
      if (this.currentAltitude) {
        return this.currentAltitude.toFixed(0);
      }
      return null;
    },
    currentSpeedProgress: function() {
      // 70km/h = 100%
      const percent = (100 / 70) * (this.currentSpeed * 3.6);
      return percent;
    },
    currentSpeedColor: function() {
      if (this.currentSpeed * 3.6 < 27) {
        return "green";
      } else if (this.currentSpeed * 3.6 < 50) {
        return "orange";
      }
      return "red";
    }
  },
  mounted: async function() {
    if ("geolocation" in navigator) {
      /* geolocation funktioniert */
      this.geolocationBrowserSupport = true;
    } else {
      /* geolocation funktioniert NICHT */
      this.geolocationBrowserSupport = false;
    }
    try {
      this.user = await getCurrentUser();
      this.activateGeolocation();
    } catch (error) {
      console.error(error);
    }
  },
  beforeDestroy: function() {
    this.deactivateGeolocationWatcher();
  },
  methods: {
    activateGeolocation: function() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationReady = true;
          this.setCurrentPosition(position);
          this.activateGeolocationWatcher();
        },
        error => {
          this.setGeolocationError(error);
        },
        this.geolocationOptions
      );
    },
    activateGeolocationWatcher: function() {
      this.geolocationWatchId = navigator.geolocation.watchPosition(
        position => {
          this.setCurrentPosition(position);
        },
        error => {
          this.setGeolocationError(error);
        },
        this.geolocationOptions
      );
    },
    deactivateGeolocationWatcher: function() {
      if (this.geolocationWatchId) {
        navigator.geolocation.clearWatch(this.geolocationWatchId);
      }
    },
    setCurrentPosition: function(position: Position) {
      this.currentPosition = position;
      this.currentLatitude = position.coords.latitude;
      this.currentLongitude = position.coords.longitude;
      this.currentAccuracy = position.coords.accuracy;
      this.currentAltitude = position.coords.altitude;
      this.currentAltitudeAccuracy = position.coords.altitudeAccuracy;
      this.currentSpeed = position.coords.speed ? position.coords.speed : 0;
      if (this.trackingUUID && !this.trackingPaused) {
        this.positionHistory.push(position);
      }
      this.counter = this.counter + 1;
    },
    setGeolocationError: function(error: PositionError) {
      console.info(error);
      this.geolocationError = true;
    },
    uuid: function(): string {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, char => {
        // Nachkommastellen abschneiden
        const random = (Math.random() * 16) | 0;
        // Bei x Random 0-15 (0-F), bei y Random 0-3 + 8 = 8-11 (8-b) gemäss RFC 4122
        const value = char === "x" ? random : (random % 4) + 8;
        // Hexadezimales Zeichen zurückgeben
        return value.toString(16);
      });
    },
    startTracking: function() {
      this.trackingUUID = this.uuid();
    },
    pauseTracking: function() {
      this.trackingPaused = true;
    },
    resumeTracking: function() {
      this.trackingPaused = false;
    },
    stopTracking: function() {
      this.trackingDialogVisible = true;
    },
    trackingDialogCancel: function() {
      this.trackingDialogVisible = false;
    },
    trackingDialogConfirm: function() {
      this.trackingDialogVisible = false;
      this.saveRoute();
      this.trackingUUID = null;
      this.positionHistory = [];
    },
    saveRoute: function() {
      if (this.user && this.trackingUUID) {
        const doc: Route = {
          uid: this.trackingUUID,
          name: "Tour 1",
          timestamp: new Date(),
          coordinates: []
        };
        for (const position of this.positionHistory) {
          doc.coordinates.push({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altutudeAccuracy: position.coords.altitudeAccuracy,
            speed: position.coords.speed ? position.coords.speed : 0,
            timestamp: new Date(position.timestamp)
          });
        }

        const db = firebase.firestore();
        db.collection("users")
          .doc(this.user.uid)
          .collection("routes")
          .doc(this.trackingUUID)
          .set(doc)
          .then(function() {
            console.log("Document successfully written!");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    }
  }
});
</script>
