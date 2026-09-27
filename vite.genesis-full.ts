import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {mkdirSync,copyFileSync} from 'node:fs';
export default defineConfig({plugins:[react(),{name:'storyboard-only',configureServer(server){server.middlewares.use((req,_res,next)=>{if(/^\/genesis-full\/?$/.test(req.url?.split('?')[0]||''))req.url='/genesis-full/index.html';next();});},closeBundle(){mkdirSync('dist-genesis-full/fonts',{recursive:true});for(const font of ['manrope','bodoni-moda'])copyFileSync(`public/fonts/${font}.woff2`,`dist-genesis-full/fonts/${font}.woff2`);}}],build:{outDir:'dist-genesis-full',copyPublicDir:false,rollupOptions:{input:fileURLToPath(new URL('./genesis-full/index.html',import.meta.url))}},server:{host:'127.0.0.1',port:5199,strictPort:true}});

