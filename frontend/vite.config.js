import path from "path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        "process.env": {},
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            api: path.resolve(__dirname, "src/api"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
});
