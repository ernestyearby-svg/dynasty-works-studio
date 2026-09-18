import {lazy,Suspense} from 'react';
import {createRoot} from 'react-dom/client';

const ExperienceLab=lazy(()=>import('./ExperienceLab'));
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
createRoot(document.getElementById('root')!).render(<Suspense fallback={<p role="status">Opening Dynasty Works Studio…</p>}>{/^\/experience-lab\/?$/.test(window.location.pathname)?<ExperienceLab/>:supporting?<SupportingPages/>:/^\/work\/mymosa\/?$/.test(window.location.pathname)?<MyMosa53/>:/^\/v5-2-review\/?$/.test(window.location.pathname)?<Review52/>:/^\/v5-1-review\/?$/.test(window.location.pathname)?<Review51/>:/^\/prototype\/?$/.test(window.location.pathname)?<Prototype/>:window.location.pathname==='/'?<Review52/>:<Work/>}</Suspense>);

// Restore direct hash navigation after the lazy route has mounted.
if (window.location.hash) {
 const targetId=decodeURIComponent(window.location.hash.slice(1));
 const jump=()=>{const target=document.getElementById(targetId);if(!target)return false;void document.fonts.ready.then(()=>requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant'})));return true;};
 const observer=new MutationObserver(()=>{if(jump())observer.disconnect();});
 if(!jump())observer.observe(document.getElementById('root')!,{childList:true,subtree:true});
}

