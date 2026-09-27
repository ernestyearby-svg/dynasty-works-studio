import Link from "@/components/site-link";
import { creationStages } from "@/data/company-creation";
import { founderBlueprint } from "@/data/founder-blueprint";
import { OptimizedImage } from "@/components/optimized-image";

export function EngagementPaths() {
  return <section className="upgrade-entry shell" aria-labelledby="entry-title">
    <div><p className="eyebrow">WHERE TO BEGIN</p><h2 id="entry-title">Your next move.<br /><em>Made clear.</em></h2><p>Start with the decision in front of you. We connect the work around it.</p></div>
    <div className="upgrade-paths">
      <Link href="/founder-blueprint"><span>01 / I HAVE AN IDEA</span><h3>Define what to build.</h3><p>A strategic roadmap before you commit to execution.</p><strong>Founder Blueprint · {founderBlueprint.priceLabel} <b aria-hidden="true">↗</b></strong></Link>
      <Link href="/start-a-business/builder"><span>02 / I’M READY TO BUILD</span><h3>Connect the pieces.</h3><p>Map the brand, product, digital and market requirements.</p><strong>Start your company roadmap <b aria-hidden="true">↗</b></strong></Link>
      <Link href="/automation"><span>03 / I’M ALREADY OPERATING</span><h3>Strengthen the system.</h3><p>Explore connected workflows and a clearer operating structure.</p><strong>Explore digital systems <b aria-hidden="true">↗</b></strong></Link>
    </div>
  </section>;
}
const stageOutcomes = [
  { question:"What deserves to be built?", decision:"A clear direction", outputs:["Positioning and audience priorities", "A company-development roadmap", "A brief for the next stage"] },
  { question:"How does the idea become tangible?", decision:"A connected set of assets", outputs:["Identity and design systems", "Product and packaging development", "Websites, applications and commerce"] },
  { question:"How will it meet the market?", decision:"A coordinated first move", outputs:["Launch plan and campaign materials", "Sales and distribution preparation", "Channel and activation priorities"] },
  { question:"What should work better next?", decision:"A more capable operation", outputs:["Workflow and integration plans", "Reporting and optimization priorities", "A roadmap for the next market or product"] },
];
export function MethodSequence() {
  return <section className="upgrade-method shell" aria-label="Four connected stages">
    <p className="upgrade-scope-note">Illustrative outputs. Your engagement is scoped around the business, its stage and what already exists.</p>
    {creationStages.map((stage,i)=><article className="upgrade-method-stage" id={"stage-"+stage.id} key={stage.id}>
      <span className="upgrade-stage-number" aria-hidden="true">0{i+1}</span>
      <div><p className="eyebrow">{stage.name}</p><h2>{stageOutcomes[i].question}</h2><p className="upgrade-method-lead">{stage.description}</p>
        <div className="upgrade-output"><h3>{stageOutcomes[i].decision}</h3><ul>{stageOutcomes[i].outputs.map(output=><li key={output}>{output}</li>)}</ul></div>
        <details><summary>Explore the scope <span aria-hidden="true">+</span></summary><ul>{stage.items.map(item=><li key={item}>{item}</li>)}</ul><div className="upgrade-practice-links">{stage.practices.map(p=><Link key={p} href={"/capabilities/"+p}>{p} ↗</Link>)}</div>
        {stage.id==='define'&&<p className="small-note">Licensed advice and filings are handled by qualified professionals. We coordinate the brief and specialist integration.</p>}
        {(stage.id==='launch'||stage.id==='scale')&&<p className="small-note">Distribution preparation does not imply that Dynasty Works holds a distribution license. Integrations require confirmed scope, access and approval.</p>}
        </details>
      </div>
    </article>)}
  </section>;
}
const studies = [
  {id:"identity",title:"An identity you can feel.",type:"Identity / print / material",description:"A study in paper, proportion and the translation of an identity into physical touchpoints.",alt:"AI-generated identity materials study with a black book, textured stationery and a color swatch.",note:"Material and composition study. No commissioned identity or production samples are depicted."},
  {id:"packaging",title:"The product before the first touch.",type:"Packaging / form / finish",description:"A packaging visualization exploring the relationship between a container, its label and its outer carton.",alt:"AI-generated packaging study with an amber vessel, ceramic jar and forest-green carton.",note:"Speculative packaging. No formulation, manufacturing readiness or commercial release is implied."},
  {id:"product",title:"A form with a purpose.",type:"Product / industrial visualization",description:"A physical-product study examining proportion, material contrast and the details of a tactile interface.",alt:"AI-generated portable audio product concept with brushed aluminum, woven grille and a rotary control.",note:"Concept visualization. Engineering, acoustic performance and manufacturing feasibility have not been validated."},
];
export function MockupStudies() {
  return <section className="upgrade-studies" aria-label="Photorealistic concept studies">
    {studies.map((study,i)=><figure key={study.id} className={"upgrade-study upgrade-study-"+study.id} id={study.id}>
      <div className="upgrade-study-image"><OptimizedImage src={"/assets/concept-lab/"+study.id+"-1536.webp"} srcSet={"/assets/concept-lab/"+study.id+"-768.webp 768w, /assets/concept-lab/"+study.id+"-1536.webp 1536w"} sizes="(max-width: 700px) 100vw, 85vw" width={1536} height={1024} loading="lazy" alt={study.alt}/></div>
      <figcaption><div><p className="eyebrow">0{i+1} / {study.type}</p><h2>{study.title}</h2></div><div><span className="upgrade-concept-label">AI-GENERATED CONCEPT</span><p>{study.description}</p><p className="upgrade-study-note">{study.note}</p></div></figcaption>
    </figure>)}
  </section>;
}
