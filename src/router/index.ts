import { createRouter, createWebHistory } from "vue-router";
import WeatherPage from "@/pages/WeatherPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: WeatherPage,
    },
  ],
});

export default router;
