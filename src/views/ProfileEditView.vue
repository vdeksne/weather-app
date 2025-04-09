<template>
  <div class="profile-edit p-4">
    <ProfileHeader />
    <Form />
  </div>
</template>

<script setup lang="ts">
import Form from "@/components/organisms/Form.vue";
import ProfileHeader from "@/components/molecules/ProfileHeader.vue";
</script>

<style scoped lang="scss">
.profile-edit {
  max-width: 800px;
  margin: 0 auto;
}
</style>
