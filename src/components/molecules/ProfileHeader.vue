<template>
  <div class="background-image">
    <div class="profile-container p-4">
      <RouterLink to="/">
        <ProfileArrow />
      </RouterLink>
      <div
        class="profile-header flex items-center gap-2 justify-center flex-col"
      >
        <h1 class="mb-12 mt-[-13px]">Edit Profile</h1>
        <ProfileImageIcon class="mb-2" />
        <EditProfileIcon
          v-if="route.path === '/profile/edit'"
          class="mt-[-3rem] ml-20"
        />
        <div v-if="profile" class="mb-1">
          <div class="profile-field">
            <p>{{ profile.name }}</p>
          </div>
          <div class="profile-field mb-7">
            <span class="email-text">{{ profile.email }}</span> |
            {{ profile.phone }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProfileArrow from "@/components/atoms/icons/ProfileArrow.vue";
import ProfileImageIcon from "@/components/atoms/icons/ProfileImageIcon.vue";
import EditProfileIcon from "@/components/atoms/icons/EditProfileIcon.vue";
import { RouterLink, useRoute } from "vue-router";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";

const route = useRoute();
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
</script>

<style lang="scss">
h1 {
  display: flex;
  width: 6.9375rem;
  height: 1.0625rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600 !important;
  line-height: 1.75rem; /* 140% */
}
</style>

<style lang="scss">
.background-image {
  background-image: url("@/assets/images/background.svg");
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  margin: -1rem;
}

.profile-field p {
  color: var(--Light-Gray-11, #000);
  text-align: center;
  font-family: "SF Pro Display", sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
}

a {
  text-decoration: none;
}

@media (min-width: 550px) {
  .background-image {
    background-image: none !important;
    background: none !important;
  }
}
</style>

<style scoped lang="scss">
.email-text {
  color: inherit;
  font-family: "SF Pro Display", sans-serif;
}
</style>
