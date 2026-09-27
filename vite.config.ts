import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({plugins:[react()],resolve:{alias:{'@legacy':fileURLToPath(new URL('./legacy',import.meta.url)),'@':fileURLToPath(new URL('./domain',import.meta.url))}},build:{outDir:'dist',rollupOptions:{input:{main:fileURLToPath(new URL('./index.html',import.meta.url)),review52:fileURLToPath(new URL('./v5-2-review/index.html',import.meta.url)),review51:fileURLToPath(new URL('./v5-1-review/index.html',import.meta.url)),prototype:fileURLToPath(new URL('./prototype/index.html',import.meta.url))}}},server:{fs:{allow:[fileURLToPath(new URL('..',import.meta.url))]}}});
