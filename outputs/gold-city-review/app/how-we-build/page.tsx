import Link from "@/components/site-link";
import { FinalCTA } from "@/components/studio";
import { CreationNetwork } from "@/components/company-creation";
import { MethodSequence } from "@/components/studio-upgrade";
export const metadata = { title:"How We Build — Define, Build, Launch, Scale",description:"From the first strategic decision to identity, product, digital experience and market. Four connected stages with a clear next move.",alternates:{canonical:"/how-we-build"} };
export default function HowWeBuild(){return <div className="v2-page upgrade-method-page">
  <header className="upgrade-page-intro shell"><p className="eyebrow">DYNASTY WORKS / HOW WE BUILD</p><h1>Good ideas need<br /><em>a way forward.</em></h1><div className="upgrade-intro-bottom"><p>Define the direction. Build the assets. Prepare the launch. Connect the operation. One studio coordinating the work between them.</p><Link href="/start-a-business/builder" className="text-link">MAP YOUR COMPANY →</Link></div></header>
  <MethodSequence />
  <section className="upgrade-example-link shell"><p className="eyebrow">FROM ABSTRACT TO TANGIBLE</p><h2>See the possibilities.<br /><em>Then define yours.</em></h2><p>Explore photorealistic identity, packaging and product studies in our Concept Lab. For completed project evidence, visit Selected Work.</p><div><Link href="/concept-lab" className="text-link">EXPLORE VISUAL STUDIES →</Link><Link href="/work" className="text-link">VIEW SELECTED WORK →</Link></div></section>
  <CreationNetwork /><FinalCTA />
</div>}
