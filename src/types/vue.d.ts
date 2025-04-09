/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
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

// Volar
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $style: { [key: string]: string };
    $props: any;
    $slots: any;
    $emit: any;
  }
}

export {};
