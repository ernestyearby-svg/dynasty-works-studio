export const concepts=[
 {slug:'veritas',name:'Véritas',disciplines:'Spirits / Packaging / Hospitality',image:'01-veritas-spirits-system',premise:'A spirits identity built around the relationship between bottle, material and place.',system:'A shared visual language connects the wordmark, label, packaging and imagined hospitality setting.',detail:'veritas-detail',detailAlt:'Véritas fictional bottle and hospitality composition.'},
 {slug:'lumiere',name:'Lumière',disciplines:'Beauty / Fragrance / Retail',image:'01-lumiere-fragrance-system',premise:'A fragrance world in which the smallest physical details carry the identity.',system:'The study connects bottle form, packaging, printed material and an imagined retail experience.',detail:'lumiere-detail',detailAlt:'Lumière fictional fragrance and editorial imagery.'},
 {slug:'aura',name:'Aūra',disciplines:'Technology / Product / Digital',image:'01-aura-technology-system',premise:'A human-centered technology concept spanning a wearable, its interface and its physical presentation.',system:'Product form, materials and interface language are explored as one experience. Displayed health values are fictional interface examples.',detail:'aura-detail',detailAlt:'Aūra conceptual wearable product range.'},
 {slug:'altius',name:'Altius',disciplines:'Hospitality / Experience / Digital',image:'01-altius-hospitality-system',premise:'A hospitality identity expressed through an imagined guest journey.',system:'Signage, amenities, printed material and digital discovery share one direction. The depicted destinations are concept settings.',detail:'altius-detail',detailAlt:'Altius imagined hospitality environment.'},
 {slug:'solara',name:'Solara',disciplines:'Culinary / Hospitality / Brand Experience',image:'01-solara-culinary-system',premise:'A culinary concept linking the atmosphere of a place to every point of contact.',system:'Menus, packaging, uniforms and digital presentation extend the identity into an imagined restaurant experience.',detail:'solara-detail',detailAlt:'Solara fictional restaurant atmosphere.'},
 {slug:'nova',name:'Nova',disciplines:'Company Creation / Wellness / Digital Product',image:'01-nova-company-creation-system',premise:'One idea explored as an entire company system.',system:'A fictional wellness proposition connects strategy and naming to identity, product, packaging, digital, environment and campaign.',detail:'nova-detail',detailAlt:'NOVA conceptual wellness brand world.'},
];
export const portfolioTitles:Record<string,string>={
 '/work':'Dynasty Works Studio — Selected Work',
 '/work/mymosa':'MyMosa / My Drink Family — Dynasty Works Studio Case Study',
 '/work/ikla-maison':'IKLA Maison — Dynasty Works Studio Case Study',
 '/work/mr-cliffs':'Mr. Cliff’s Premium Bourbon — Dynasty Works Studio Case Study',
 '/concept-lab':'Concept Lab — Dynasty Works Studio',
 ...Object.fromEntries(concepts.map(c=>['/concept-lab/'+c.slug,c.slug==='nova'?'NOVA Company Creation Concept Study — Dynasty Works Studio':c.name+' Concept Study — Dynasty Works Studio'])),
};
