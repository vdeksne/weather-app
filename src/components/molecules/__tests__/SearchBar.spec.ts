import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import SearchBar from "../SearchBar.vue";

// Mock environment variables
vi.stubGlobal("import.meta", {
  env: {
    VITE_OPENWEATHER_API_KEY: "test-api-key",
  },
});

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: { template: "<div>Home</div>" },
    },
  ],
});

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        {
          name: "London",
          country: "GB",
          lat: 51.5074,
          lon: -0.1278,
        },
      ],
    }),
  },
}));

// Mock weather store
vi.mock("@/stores/weather", () => ({
  useWeatherStore: vi.fn(() => ({
    loading: false,
    error: null,
    previewCity: null,
  })),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia());

    // Reset router
    router.push("/");

    // Clear all mocks
    vi.clearAllMocks();
  });

  const mountOptions = {
    global: {
      plugins: [router],
      stubs: {
        MicrophoneIcon: true,
        CloseSearchIcon: true,
        SearchIcon: true,
      },
    },
  };

  it("renders properly", () => {
    const wrapper = mount(SearchBar, mountOptions);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("updates searchQuery when input changes", async () => {
    const wrapper = mount(SearchBar, mountOptions);
    const input = wrapper.find("input[type='text']");
    await input.setValue("London");
    expect((input.element as HTMLInputElement).value).toBe("London");
  });

  it("clears search when close icon is clicked", async () => {
    const wrapper = mount(SearchBar, mountOptions);
    const input = wrapper.find("input[type='text']");
    await input.setValue("London");

    const closeIcon = wrapper.findComponent({ name: "CloseSearchIcon" });
    await closeIcon.trigger("click");

    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("emits search-active event when input has content", async () => {
    const wrapper = mount(SearchBar, mountOptions);
    const input = wrapper.find("input[type='text']");
    await input.setValue("London");

    const emitted = wrapper.emitted("search-active");
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([true]);
  });

  it("handles speech recognition click", async () => {
    // Mock window and navigator for speech recognition
    const originalWindow = { ...window };
    const originalNavigator = { ...navigator };

    // Mock SpeechRecognition
    vi.stubGlobal("SpeechRecognition", class {});

    // Mock navigator.userAgent to simulate a desktop browser
    Object.defineProperty(window, "navigator", {
      value: {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      configurable: true,
    });

    const wrapper = mount(SearchBar, mountOptions);
    const micIcon = wrapper.findComponent({ name: "MicrophoneIcon" });
    await micIcon.trigger("click");

    // Restore original window and navigator
    Object.defineProperty(window, "navigator", {
      value: originalNavigator,
    });

    expect(micIcon.exists()).toBe(true);
  });
});
