import { defineStore } from "pinia";
import { ref } from "vue";

export interface Profile {
  name: string;
  email: string;
  phone: string;
}

const DEFAULT_PROFILE: Profile = {
  name: "Jane Doe",
  email: "jane@gmail.com",
  phone: "+01 234 567 89",
};

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<Profile | null>(null);

  function updateProfile(newProfile: Profile) {
    profile.value = newProfile;
    // Save to localStorage for persistence
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  }

  function loadProfile() {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      profile.value = JSON.parse(savedProfile);
    } else {
      // Initialize with default profile if no saved data exists
      profile.value = DEFAULT_PROFILE;
      localStorage.setItem("userProfile", JSON.stringify(DEFAULT_PROFILE));
    }
  }

  // Load profile from localStorage when store is created
  loadProfile();

  return {
    profile,
    updateProfile,
    loadProfile,
  };
});
