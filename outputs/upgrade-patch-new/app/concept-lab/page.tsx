import Link from "@/components/site-link";
import { FinalCTA } from "@/components/studio";
import { MockupStudies } from "@/components/studio-upgrade";
export const metadata={title:"Concept Lab — Photorealistic Studies",description:"Speculative identity, packaging and physical-product visualizations. Clearly labeled AI-generated concepts, separate from commissioned work.",alternates:{canonical:"/concept-lab"}};
export default function ConceptLab(){return <div className="v2-page upgrade-lab">
<header className="upgrade-page-intro shell"><p className="eyebrow">DYNASTY WORKS / CONCEPT LAB</p><h1>Ideas.<br /><em>Made tangible.</em></h1><div className="upgrade-intro-bottom"><p>Explore the possibilities before committing to production. Three photorealistic studies in identity, packaging and product.</p><p className="upgrade-disclosure">These are AI-generated studio concepts, not client commissions, photographs of manufactured products or verified results.</p></div></header>
<nav className="upgrade-study-nav shell" aria-label="Visual studies"><a href="#identity">01 / Identity</a><a href="#packaging">02 / Packaging</a><a href="#product">03 / Product</a></nav>
<MockupStudies />
<section className="upgrade-example-link shell"><p className="eyebrow">THE NEXT STEP</p><h2>From a possibility<br /><em>to a plan.</em></h2><p>A visualization helps establish direction. A scoped engagement turns that direction into the right design, development and production work.</p><div><Link href="/start-a-business/builder" className="text-link">START YOUR COMPANY ROADMAP →</Link><Link href="/work" className="text-link">EXPLORE ACTUAL PROJECTS →</Link></div></section>
<FinalCTA /></div>}
