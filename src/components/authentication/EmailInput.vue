<template>
  <v-text-field
    :value="value"
    :disabled="disabled"
    label="Email"
    name="email"
    type="text"
    :error-messages="errorMessage"
    @blur="blur"
    @input="input"
    @keydown="keydown"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { validateEmail } from "@/components/authentication/validators";

export default Vue.extend({
  name: "EmailInput",
  props: {
    value: { type: String, required: false, default: null },
    disabled: { type: Boolean, required: false, default: false }
  },
  data: () => ({
    dirty: false,
    errorMessage: null as string | null
  }),
  methods: {
    blur: function() {
      this.dirty = true;
      this.validate(this.value);
    },
    input: function(text: string) {
      if (this.dirty) {
        this.validate(text);
      }
      this.$emit("input", text);
    },
    keydown: function(event: KeyboardEvent) {
      if (event.key == "Enter") {
        this.$emit("confirm");
      }
    },
    validate: function(text: string) {
      const errors = validateEmail(text);
      if (errors) {
        this.errorMessage = errors[0];
      } else {
        this.errorMessage = null;
      }
    }
  }
});
</script>
