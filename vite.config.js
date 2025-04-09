import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueMacros from "unplugin-vue-macros/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VueMacros({
            plugins: {
                vue: vue(),
                vueJsx: vueJsx(),
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    assetsInclude: ["**/*.otf"],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: function (assetInfo) {
                    if (assetInfo.name.endsWith(".otf")) {
                        return "assets/fonts/[name][extname]";
                    }
                    return "assets/[name]-[hash][extname]";
                },
            },
        },
    },
});
