const fs=require('fs');let s=fs.readFileSync('src/Prototype.tsx','utf8');
s=s.replace('opacity={assembly}','opacity={phase===0?assembly:0}');
s=s.replaceAll("transform:'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)'","transform:phase===0?'translate('+(assembly*35)+'px,'+(-assembly*20)+'px)':'none'");
s=s.replace('<path d="M571 257L665 222V365L571 400Z" fill="#17191c"/><path d="M665 222L695 238V382L665 365Z" fill="#999b96"/>','<path d="M572 239V382H699V360H594V239Z" fill="#17191c"/><path d="M594 239H699V337" fill="none" stroke="#92968c"/><circle cx="699" cy="239" r="5" fill="#2457ff"/>');
s=s.replace('<path d="M293 302V196L382 151V256" fill="#17191c"/>','<path d="M293 302V196L308 188V278L382 241V256Z" fill="#17191c"/>');
fs.writeFileSync('src/Prototype.tsx',s);
