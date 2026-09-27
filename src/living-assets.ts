export const dwsAssets={
 rawIdea:{alt:'Conceptual study of raw stone, drawings and tools, representing an idea before its form is resolved.',mobileFocus:'100% 50%',focus:'54% 50%'},
 brandFormation:{alt:'Conceptual identity system presented through paper, glass and printed materials.',mobileFocus:'100% 50%',focus:'65% 50%'},
 packaging:{alt:'Conceptual packaging study with textured boxes, paper and print details.',mobileFocus:'100% 50%',focus:'62% 50%'},
 productDesign:{alt:'Conceptual cylindrical product, material samples and design drawings.',mobileFocus:'100% 50%',focus:'61% 50%'},
 digitalExperience:{alt:'Conceptual website and mobile interface displayed on a laptop and phone.',mobileFocus:'100% 50%',focus:'65% 50%'},
 physicalExperience:{alt:'Conceptual exhibition environment showing how a brand can become a physical experience.',mobileFocus:'100% 50%',focus:'60% 50%'},
 materialCraft:{alt:'Conceptual material study combining textured paper, stone, wood and brushed metal.',mobileFocus:'100% 50%',focus:'58% 50%'},
 humanCreation:{alt:'Conceptual visualization of a designer sketching; not a photograph of a Dynasty Works employee.',mobileFocus:'100% 50%',focus:'52% 50%'},
 scale:{alt:'Conceptual composition of products and a city skyline representing expansion, not studio locations.',mobileFocus:'100% 50%',focus:'57% 50%'},
 futureExperiment:{alt:'Conceptual future environment with a person looking through a circular opening toward a city.',mobileFocus:'100% 50%',focus:'63% 50%'},
} as const;
export type LivingAsset=keyof typeof dwsAssets;
export function assetSet(key:LivingAsset,format:'avif'|'webp'){return [480,960,1536].map(w=>`/assets/living/${key}-${w}.${format} ${w}w`).join(', ')}
