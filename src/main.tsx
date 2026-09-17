import {lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';

const SupportingPages=lazy(()=>import('./SupportingPages'));
const supportRoutes=["/founder-blueprint","/founder-blueprint/intake","/studio","/capabilities","/contact","/automation","/growth-partnership","/how-we-build","/services","/templates","/start-a-business","/start-a-business/builder"];
supportRoutes.push(...['start','brand','build','launch','distribute','activate','grow','publish'].map(p=>'/capabilities/'+p));
const supporting=supportRoutes.includes(window.location.pathname.replace(/\/$/,''));
if(supporting)document.body.classList.add('dws-v3');
const MyMosa53=lazy(()=>import('./MyMosa53'));
const Work=lazy(()=>import('./V5WorkEntry'));
const Review52=lazy(()=>import('./Review52'));
const Review51=lazy(()=>import('./Review51'));
const Prototype=lazy(()=>import('./Prototype'));
createRoot(document.getElementById('root')!).render(<Suspense fallback={<p role="status">Opening Dynasty Works Studio…</p>}>{supporting?<SupportingPages/>:/^\/work\/mymosa\/?$/.test(window.location.pathname)?<MyMosa53/>:/^\/v5-2-review\/?$/.test(window.location.pathname)?<Review52/>:/^\/v5-1-review\/?$/.test(window.location.pathname)?<Review51/>:/^\/prototype\/?$/.test(window.location.pathname)?<Prototype/>:window.location.pathname==='/'?<Review52/>:<Work/>}</Suspense>);

