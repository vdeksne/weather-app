<template>
  <div class="form-container flex object-center justify-center items-center">
    <Form
      :validation-schema="validationSchema"
      :initial-values="initialValues"
      @submit="onSubmit"
      v-slot="{ values }"
      class="form-container flex flex-col gap-4 m-4 object-center justify-center"
    >
      <div class="form-field relative">
        <Field
          id="name"
          name="name"
          type="text"
          autocomplete="name"
          :placeholder="profileStore.profile?.name || 'Enter your name'"
          class="pt-4 input-field"
        />
        <label for="name" class="absolute text-xs left-2 top-2"
          >Full Name</label
        >
        <ErrorMessage name="name" class="text-red-500 error-message" />
      </div>

      <div class="form-field relative">
        <Field
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          :placeholder="profileStore.profile?.email || 'Enter your email'"
          class="pt-4 input-field"
        />
        <label for="email" class="absolute text-xs left-2 top-2">Email</label>
        <ErrorMessage name="email" class="text-red-500 error-message" />
      </div>

      <div class="form-field relative">
        <div class="phone-input-container">
          <select
            id="country-code"
            name="country-code"
            class="country-code-select"
            v-model="selectedCountryCode"
            @change="updatePhoneValue"
            :title="getSelectedCountryName()"
          >
            <option
              v-for="country in countryCodes"
              :key="country.code"
              :value="country.code"
              :title="country.name"
            >
              {{ country.flag }}
            </option>
          </select>
          <span class="current-flag">{{ getCurrentFlag() }}</span>
          <Field
            id="phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            v-model="phoneNumber"
            :placeholder="'234 567 89'"
            class="pt-4 input-field phone-input"
            @input="updatePhoneValue"
          />
        </div>
        <label for="phone" class="absolute text-xs left-2 top-2"
          >Phone Number</label
        >
        <ErrorMessage name="phone" class="text-red-500 error-message" />
      </div>

      <BaseButton type="submit" text="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage, useField } from "vee-validate";
import { useRouter } from "vue-router";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import BaseButton from "@/components/atoms/BaseButton.vue";
import { useProfileStore } from "@/stores/profile";
import type { Ref } from "vue";
import { ref, onMounted, watch } from "vue";
import { countryCodes } from "@/data/countryCodes";

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

const router = useRouter();
const profileStore = useProfileStore();

const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .optional()
      .transform((val) => val || profileStore.profile?.name || ""),
    email: z
      .string()
      .email("Email needs to be provided")
      .optional()
      .transform((val) => val || profileStore.profile?.email || ""),
    phone: z
      .string()
      .regex(/^[0-9\s]{6,}$/, "Please enter only numbers and spaces")
      .optional()
      .transform((val) => val || profileStore.profile?.phone || ""),
  })
);

const initialValues: Ref<FormValues> = ref({
  name: "Jane Doe",
  email: "jane@gmail.com",
  phone: "234 567 89",
});

const selectedCountryCode = ref("+1"); // Default to US
const phoneNumber = ref("");
const { setValue } = useField("phone");

function getSelectedCountryName() {
  const country = countryCodes.find(
    (c) => c.code === selectedCountryCode.value
  );
  return country ? `${country.name} ${country.code}` : "";
}

function updatePhoneValue() {
  // Only validate the phone number part without country code
  setValue(phoneNumber.value.trim());
}

// Initialize phone number from profile if it exists
onMounted(() => {
  if (profileStore.profile) {
    initialValues.value = {
      name: profileStore.profile.name,
      email: profileStore.profile.email,
      phone: profileStore.profile.phone,
    };

    // Extract country code and number from the full phone number
    if (profileStore.profile.phone) {
      const phone = profileStore.profile.phone;
      // Match country code pattern (e.g., +01) and the rest of the number
      const match = phone.match(/^\+(\d+)\s*(.*)$/);
      if (match) {
        const countryCode = `+${match[1]}`;
        // Find the country in our list that matches this code
        const country =
          countryCodes.find((c) => c.code === countryCode) ||
          countryCodes.find((c) => c.code === "+1"); // Default to US if not found

        selectedCountryCode.value = country ? country.code : "+371"; // Fallback to Latvia if nothing found
        phoneNumber.value = match[2];
        // Set the initial phone number without country code for validation
        setValue(match[2]);
      }
    }
  }
});

// Add helper function to get current country flag
function getCurrentFlag() {
  const country = countryCodes.find(
    (c) => c.code === selectedCountryCode.value
  );
  return country ? country.flag : "🇱🇻"; // Default to Latvia flag if not found
}

function onSubmit(values: FormValues) {
  // Combine country code with phone number for storage
  const fullPhoneNumber = `${selectedCountryCode.value} ${
    values.phone || phoneNumber.value || ""
  }`;

  profileStore.updateProfile({
    name: values.name || profileStore.profile?.name || "",
    email: values.email || profileStore.profile?.email || "",
    phone: fullPhoneNumber,
  });

  router.push("/profile");
}
</script>

<style scoped lang="scss">
.form-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 21.375rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  max-width: 21.375rem;
  height: 3.125rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #ededed;
  background: #fff;
  box-shadow: 0px 2px 25px 1px rgba(0, 0, 0, 0.02);
  padding-top: 1rem;
  font-family: "SF Pro", "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 510;
  line-height: normal;
  color: var(--Light-Gray-10, #212121);

  &::placeholder {
    background: #fff;
    color: var(--Light-Gray-10, #212121);
    font-family: "SF Pro", "SF Pro Display", sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 510;
    line-height: normal;
  }

  &:focus {
    outline: none;
    border-color: #2e3a5a;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: #212121;
    -webkit-box-shadow: 0 0 0 30px white inset;
    transition: background-color 5000s ease-in-out 0s;
    font-family: "SF Pro", "SF Pro Display", sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 510;
    line-height: normal;
  }
}

.error-message {
  font-size: 0.875rem;
  margin-top: 0;
  text-align: left;
}
label {
  color: var(--Light-Gray-7, #757575);
  font-family: "SF Pro", "SF Pro Display", sans-serif;
  font-size: 0.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.input-field {
  width: 100%;
  padding: 0.5rem;
  max-width: 21.375rem;
  height: 3.125rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #ededed;
  background: #fff;
  box-shadow: 0px 2px 25px 1px rgba(0, 0, 0, 0.02);
  padding-top: 1rem;
  font-family: "SF Pro", "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 510;
  line-height: normal;
  color: var(--Light-Gray-10, #212121);
}
.input-field:active {
  color: var(--Light-Gray-10, #212121) !important;
  font-family: "SF Pro", "SF Pro Display", sans-serif;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 510;
  line-height: normal;
}

.phone-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.country-code-select {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  opacity: 0;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.current-flag {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  pointer-events: none;
  z-index: 5;
  margin-top: 0.25rem;
}

.phone-input {
  padding-left: 2.2rem !important;
}
</style>
