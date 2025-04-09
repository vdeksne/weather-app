import { createRouter, createWebHistory } from "vue-router";
import WeatherView from "@/views/WeatherView.vue";
import CityView from "@/views/CityView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ProfileEditView from "@/views/ProfileEditView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: WeatherView,
    },
    {
      path: "/weather/:lat/:lon",
      name: "cityView",
      component: CityView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/profile/edit",
      name: "profile-edit",
      component: ProfileEditView,
    },
  ],
});

export default router;
