<template>
  <div class="form-container flex object-center justify-center">
    <div class="form-container flex flex-col gap-4">
      <div class="form-field relative p-2">
        <label class="absolute form-field__input-xs">Full Name</label>
        <div class="static-field pt-4 flex form-field__input-main">
          {{ profileStore.profile?.name || "Not set" }}
        </div>
      </div>

      <div class="form-field relative p-2">
        <label class="absolute form-field__input-xs">Email</label>
        <div class="static-field pt-4 flex form-field__input-main">
          {{ profileStore.profile?.email || "Not set" }}
        </div>
      </div>

      <div class="form-field relative p-2">
        <label class="absolute form-field__input-xs">Phone Number</label>
        <div class="static-field pt-4 flex form-field__input-main">
          <div class="phone-display flex items-center gap-2">
            <span class="country-flag">{{ phoneInfo.flag }}</span>
            <span class="phone-number">{{ phoneInfo.number }}</span>
          </div>
        </div>
      </div>

      <EditButton @click="router.push('/profile/edit')" text="Edit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import EditButton from "@/components/atoms/EditButton.vue";
import { useProfileStore } from "@/stores/profile";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { countryCodes } from "@/data/countryCodes";
import theme from "@/config/theme";

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
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Required field")
      .email("Email needs to be provided"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number (E.164 format)"
      ),
  })
);

const initialValues = ref<FormValues>({
  name: "",
  email: "",
  phone: "",
});

// Load existing profile data if editing
onMounted(() => {
  if (profileStore.profile) {
    initialValues.value = {
      name: profileStore.profile.name,
      email: profileStore.profile.email,
      phone: profileStore.profile.phone,
    };
  }
});

function onSubmit(values: FormValues) {
  profileStore.updateProfile({
    name: values.name,
    email: values.email,
    phone: values.phone,
  });

  router.push("/profile");
}

// Update computed property for phone display
const phoneInfo = computed(() => {
  if (!profileStore.profile?.phone) {
    return {
      flag: "🌍",
      number: "Not set",
    };
  }

  const phone = profileStore.profile.phone;
  const match = phone.match(/^\+(\d+)\s*(.*)$/);

  if (!match) {
    return {
      flag: "🌍",
      number: phone,
    };
  }

  const countryCode = `+${match[1]}`;
  const country =
    countryCodes.find((c) => c.code === countryCode) ||
    countryCodes.find((c) => c.code === "+1"); // Default to US if not found

  return {
    flag: country?.flag || "🌍",
    number: match[2],
  };
});
</script>

<style scoped lang="scss">
.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  align-items: center;
}

input {
  background-color: var(--neutral-light-blue);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-base);
  border: 1px solid var(--neutral-blue);
  text-decoration: none;

  &:focus {
    outline: none;
    border-color: var(--accent-info);
  }
}

.error-message {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.form-field {
  width: 100%;
  max-width: 21.375rem;
  height: 3.125rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: #f5f5f5;
  box-shadow: 0px 2px 25px 1px rgba(0, 0, 0, 0.02);
  display: flex;

  &__input-xs {
    color: #757575;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  &__input-main {
    color: #212121;
    font-family: "SF Pro Display", sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 510;
    line-height: normal;
  }
}

.phone-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.country-flag {
  font-size: var(--font-size-xl);
}

.phone-number {
  color: var(--text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.static-field {
  color: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
