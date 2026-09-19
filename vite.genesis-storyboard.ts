import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {mkdirSync,copyFileSync} from 'node:fs';
export default defineConfig({plugins:[react(),{name:'storyboard-only',configureServer(server){server.middlewares.use((req,_res,next)=>{if(/^\/genesis-storyboard\/?$/.test(req.url?.split('?')[0]||''))req.url='/genesis-storyboard/index.html';next();});},closeBundle(){mkdirSync('dist-genesis-storyboard/fonts',{recursive:true});for(const font of ['manrope','bodoni-moda'])copyFileSync(`public/fonts/${font}.woff2`,`dist-genesis-storyboard/fonts/${font}.woff2`);}}],build:{outDir:'dist-genesis-storyboard',copyPublicDir:false,rollupOptions:{input:fileURLToPath(new URL('./genesis-storyboard/index.html',import.meta.url))}},server:{host:'127.0.0.1',port:5197,strictPort:true}});
