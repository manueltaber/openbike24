<template>
  <v-text-field
    :value="value"
    :disabled="disabled"
    label="Password"
    name="password"
    :type="showPassword ? 'text' : 'password'"
    :error-messages="errorMessage"
    :suffix="strength"
    :append-icon="showPassword ? mdiEyeIcon : mdiEyeOffIcon"
    @click:append="showPassword = !showPassword"
    @blur="blur"
    @input="input"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import {
  validatePassword,
  calculatePasswordStrength,
  PasswordStrength
} from "@/components/authentication/validators";

export default Vue.extend({
  name: "PasswordInput",
  props: {
    value: { type: String, required: false, default: null },
    disabled: { type: Boolean, required: false, default: false },
    performValidation: { type: Boolean, required: false, default: false },
    calculateStrength: { type: Boolean, required: false, default: false }
  },
  data: () => ({
    mdiEyeIcon: mdiEye,
    mdiEyeOffIcon: mdiEyeOff,
    showPassword: false,
    dirty: false,
    errorMessage: null as string | null,
    strength: null as string | null
  }),
  methods: {
    blur: function() {
      this.dirty = true;
      this.validate(this.value);
    },
    input: function(text: string) {
      this.calculatePasswordStrength(text);
      if (this.dirty) {
        this.validate(text);
      }
      this.$emit("input", text);
    },
    validate: function(text: string) {
      if (this.performValidation) {
        const errors = validatePassword(text);
        if (errors) {
          this.errorMessage = errors[0];
        } else {
          this.errorMessage = null;
        }
      }
    },
    calculatePasswordStrength: function(text: string) {
      if (this.calculateStrength) {
        const strength = calculatePasswordStrength(text);
        if (strength === PasswordStrength.Short) {
          this.strength = "Short";
        } else if (strength === PasswordStrength.Common) {
          this.strength = "Common";
        } else if (strength === PasswordStrength.Weak) {
          this.strength = "Weak";
        } else if (strength === PasswordStrength.Ok) {
          this.strength = "Ok";
        } else if (strength === PasswordStrength.Strong) {
          this.strength = "Strong";
        }
      }
    }
  }
});
</script>
