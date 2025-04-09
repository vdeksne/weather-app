<template>
  <div class="profile-edit p-4">
    <ProfileHeader />
    <FormStatic />
  </div>
</template>

<script setup lang="ts">
import ProfileHeader from "@/components/molecules/ProfileHeader.vue";
import FormStatic from "@/components/organisms/FormStatic.vue";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
</script>

<style scoped lang="scss">
.profile-edit {
  max-width: 800px;
  margin: 0 auto;
}
</style>
