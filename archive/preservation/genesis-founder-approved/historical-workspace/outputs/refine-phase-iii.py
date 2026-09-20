from pathlib import Path
p=Path('src/capability/Orchestration.tsx');s=p.read_text().replace('useEffect,useState','useEffect,useRef,useState');s=s.replace("const[step,setStep]", "const started=useRef(0);const[step,setStep]");s=s.replace("const log=(s:string)=>setEvents(e=>[...e,s]);", "const log=(s:string)=>setEvents(e=>[...e,`${((performance.now()-started.current)/1000).toFixed(1)}s / ${s}`]);");s=s.replace("function start(){setRun", "function start(){started.current=performance.now();setRun")
s=s.replace("'04 / Human authorization required. Downstream held.'", "`${((performance.now()-started.current)/1000).toFixed(1)}s / Human authorization required. Downstream held.`")
s=s.replace("'05 / Checksum mismatch. Output isolated. Publish blocked.'", "`${((performance.now()-started.current)/1000).toFixed(1)}s / Checksum mismatch. Output isolated. Publish blocked.`")
s=s.replace("'07 / Audit sealed. Simulation complete.'", "`${((performance.now()-started.current)/1000).toFixed(1)}s / Audit sealed. Simulation complete.`")
s=s.replace("`${String(step+1).padStart(2,'0')} / ${stages[step+1]} entered.`", "`${((performance.now()-started.current)/1000).toFixed(1)}s / ${stages[step+1]} entered.`")
p.write_text(s)
