import path from "path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/sanctum": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,
            },
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,
            },
            // Add other routes as needed
        },
    },
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
