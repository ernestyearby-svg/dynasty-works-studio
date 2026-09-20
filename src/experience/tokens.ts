export const DWS_MOTION={fast:160,standard:360,system:720,ease:'cubic-bezier(.22,.68,.12,1)'} as const;
export function installMotionTokens(){
 const style=document.documentElement.style;
 style.setProperty('--dws-fast',`${DWS_MOTION.fast}ms`);
 style.setProperty('--dws-standard',`${DWS_MOTION.standard}ms`);
 style.setProperty('--dws-system',`${DWS_MOTION.system}ms`);
 style.setProperty('--dws-ease',DWS_MOTION.ease);
}
