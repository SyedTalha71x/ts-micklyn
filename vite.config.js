/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: 5174, 
  // },
  server: {
    host: '0.0.0.0',
    port: 5173, 
    allowedHosts: [
      'localhost',
      '4fdb-2400-adc1-120-cd00-d829-d98d-e8f3-9ab.ngrok-free.app', 
    ],
  },
})
