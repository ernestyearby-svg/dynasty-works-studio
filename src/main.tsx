import {Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import ExperienceSystem,{RouteLoading} from './experience/ExperienceSystem';
import {installMotionTokens} from './experience/tokens';

installMotionTokens();
const path=window.location.pathname.replace(/\/$/,'')||'/';
const isLab=path==='/experience-lab';
if(!isLab)document.documentElement.classList.add('dws-experience-enabled');
const supportRoutes=['/privacy','/terms','/portal/retrieve','/founder-blueprint/intake','/capabilities','/contact','/automation','/growth-partnership','/how-we-build','/services','/templates','/start-a-business','/start-a-business/builder',...['start','brand','build','launch','distribute','activate','grow','publish'].map(p=>'/capabilities/'+p)];
const supporting=supportRoutes.includes(path);
if(supporting)document.body.classList.add('dws-v3');
// Resolve only this document's route before its first transition snapshot.
// No SPA router: browser navigation, history and form lifecycles remain native.
const loaders={
 lab:()=>import('./ExperienceLab'),
 environment:()=>import('./VisualEnvironmentLab'),
 support:()=>import('./SupportingPages'),
 mymosa:()=>import('./MyMosa53'),
 review51:()=>import('./Review51'),
 prototype:()=>import('./Prototype'),
 home:()=>import('./CinematicHome'),
 work:()=>import('./V5WorkEntry'),
 blueprint:()=>import('./FounderBlueprintPage'),
 studio:()=>import('./StudioPage'),
};
const route=path==='/visual-environment-lab'?'environment':isLab?'lab':path==='/founder-blueprint'?'blueprint':path==='/studio'?'studio':supporting?'support':path==='/work/mymosa'?'mymosa':path==='/v5-1-review'?'review51':path==='/prototype'?'prototype':path==='/'||path==='/v5-2-review'?'home':'work';
const {default:Page}=await loaders[route]();
const room=path==='/'||path==='/v5-2-review'?'creation':path==='/work'?'gallery':path.startsWith('/concept-lab')?'laboratory':path==='/studio'?'human':null;
if(room){document.body.dataset.cinematicRoom=room;await import('./cinematic-rooms.css');}
flushSync(()=>createRoot(document.getElementById('root')!).render(<>{!isLab&&<ExperienceSystem/>}<Suspense fallback={<RouteLoading/>}><Page/></Suspense></>));
if(window.location.hash){
 const target=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
 if(target)void document.fonts.ready.then(()=>requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant'})));
}


