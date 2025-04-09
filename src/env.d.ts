/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

import type { DefineComponent } from "vue";

declare module "*.vue" {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Volar support
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    RouterLink: typeof import("vue-router")["RouterLink"];
    RouterView: typeof import("vue-router")["RouterView"];
  }

  interface ComponentCustomProperties {
    $style: { [key: string]: string };
  }
}

declare module "vue" {
  import type { Ref, ComponentCustomProperties } from "@vue/runtime-dom";

  export {
    ref,
    computed,
    watch,
    onMounted,
    onUnmounted,
    defineProps,
    defineEmits,
    defineExpose,
    withDefaults,
    createApp,
  } from "@vue/runtime-dom";

  export type { Ref };
}

// Volar
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $style: { [key: string]: string };
    $props: any;
    $slots: any;
    $emit: any;
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  // Add other env variables here
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
