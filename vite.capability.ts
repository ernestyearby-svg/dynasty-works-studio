import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({plugins:[react(),{name:'capability-only',configureServer(server){server.middlewares.use((req,_res,next)=>{if(req.url?.split('?')[0].match(/^\/capability-lab(?:\/(?:3d-product|web|os|mobile|identity|packaging|capital|orchestration|space))?\/?$/))req.url='/capability-lab/index.html';next();});}}],build:{outDir:'dist-capability',emptyOutDir:true,copyPublicDir:false,rollupOptions:{input:fileURLToPath(new URL('./capability-lab/index.html',import.meta.url))}},server:{host:'127.0.0.1',port:5194,strictPort:true}});

