# DWS V5.8 × Capability Lab — Integration Architecture

**Founder review only · 2026-09-19 · No implementation authorized**

This document proposes information and experience architecture. Routes, navigation changes, copy, budgets, and behaviors below are proposals, not implemented features or deployment claims. No gateway winner has been selected.

## 01 — Executive thesis

Let the visitor choose a depth of proof without forcing a tour. V5.8 declares how DWS thinks. Selected Work documents real projects. Capabilities lets the visitor operate original demonstrations. Genesis shows how disciplines become an operating system through decisions and consequences.

The integration should add access, not another homepage narrative. Preserve every approved artifact's native composition and behavior. Add only a small, consistent way to enter, orient, and leave. An artifact must remain useful as evidence of a discipline even when a visitor never reaches Genesis.

Three gateway concepts are offered in section 06. The founder must choose one before any prototype implementation. This is not permission to blend them.

## 02 — Current V5.8 inventory

### Verified foundations

| Foundation | Approved commit | Branch / tag |
| --- | --- | --- |
| V5.8 | 445b43ad561cfb6fc61a6bc6b0a4b1a5e03c35ab | backup/v5.8-founder-approved / v5.8-founder-approved |
| Capability Lab 01–09 | f88cf6060e299e44153fd9c0880d132df761668d | backup/capability-lab-01-09-founder-approved / capability-lab-01-09-founder-approved |
| Genesis final | ddf4cefeb0a913e8ef30f9d0b6349bdc05ea7d67 | backup/genesis-founder-approved / genesis-founder-approved |

All references were resolved locally to their approved commits for this architecture audit. The V5.8 tag is annotated: its tag-object ID differs from its peeled commit; the peeled commit is correct. Prior remote preservation is recorded in the founder-lock record. No remote mutation or deployment was performed for this document.

Checkout: codex/genesis-full-intelligence at the Genesis approval. Tracked and untracked status clean before this document. Source inspection found no differences from V5.8 in the audited main entry, homepage, homepage shell, or Portfolio files.

### Actual experience and constraints

| Surface | Current implementation / implication |
| --- | --- |
| Homepage | CinematicHome → VisualEnvironmentLab in candidate mode → Review52. Arrival, eight-stage Creation Chamber, four operating states, Builder, Proof, Invitation, footer. No new story inserted into the chamber. |
| Primary homepage navigation | Work; How we build; Company Builder; Capabilities; Studio; Start a company. Capabilities already has a top-level place. |
| Proof | Selected Work plus Concept Lab. Concept Lab is currently described as “independent capability studies,” creating a future terminology collision. |
| Builder | Inline at /#review-builder. /company-builder redirects there. Browser-local diagnostic, roadmap result/download and readable text fallback. Founder Blueprint remains $1,500. |
| Selected Work | /work with MyMosa and IKLA Maison only. /work/mymosa uses MyMosa53; /work/ikla-maison uses Portfolio. Older MyMosa code exists in Portfolio but is not the active route: do not accidentally switch implementations. |
| Existing Capabilities | /capabilities renders the legacy four-stage overview, expandable eight-practice catalogue, digital systems, commercial paths and CTA. Existing /capabilities/start, brand, build, launch, distribute, activate, grow, publish paths must survive. |
| Concept Lab | Six fictional brand-world studies: Véritas, Lumière, Aūra, Altius, Solara, Nova. These show imagined category worlds, rather than the new interactive discipline instruments. |
| Studio / contact / Blueprint | Existing supporting routes and conversion destinations retained. |
| Capability Lab | Separate Vite entry and lazy artifact imports at /capability-lab and nine existing review slugs. Not integrated into main site routing. |
| Genesis | Separate /genesis-full entry and build, DOM/SVG/CSS, approved Continuous Instrument and inherited transaction model. Not part of the main site router. |
| Navigation runtime | Native document navigation with route-specific dynamic imports, V5.4 state Primitive, native history and focus handling. No SPA router to replace. |

Audit sources: src/main.tsx, CinematicHome.tsx, Review52.tsx, Review52Shell.tsx, SupportingPages.tsx, Portfolio.tsx, portfolio-data.ts, ReviewDiagnostic.tsx, experience/ExperienceSystem.tsx, experience/tokens.ts, capability/main.tsx and scene imports, genesis-full/main.tsx and geometry.ts, legacy/app/capabilities/page.tsx, public/_redirects, and the separate Vite configs. This is a source architecture audit, not a fresh live-site certification.

## 03 — Content / proof hierarchy

| Layer | Visitor question | Evidence | Required distinction |
| --- | --- | --- | --- |
| Homepage | What do you believe; how do you build? | Cinematic construction and operating philosophy | Declarative thesis, not a business simulation |
| Selected Work | What have you built? | MyMosa + IKLA | Real project case studies; source-backed claims only |
| Capabilities | What can you build? | Artifacts 01–09 | Original DWS demonstrations; no client engagement; sample data where applicable |
| Genesis | How does it compound? | Interactive cause, constraint, authorization, settlement, recovery | Fictional company simulation; capstone, not a client or live operating business |

Concept Lab remains an adjacent speculative category, not a fifth claim of commercial proof. Avoid using “work,” “client,” or “case study” as umbrella labels for all four layers.

## 04 — Proposed site map

- Homepage / — existing experience, one restrained invitation inside Proof.
- Selected Work /work — MyMosa /work/mymosa and IKLA /work/ikla-maison only.
- Capabilities /capabilities — existing commercial overview retained; a clear entrance to demonstrations.
  - In practice /capabilities/in-practice — founder-selected gateway.
  - Nine demonstration destinations under /capabilities/in-practice/.
  - Existing eight practice paths retained independently.
- Genesis /genesis — elevated capstone, reached from the gateway and appropriate completion context.
- Concept Lab /concept-lab — existing speculative studies and their URLs.
- How we build, Studio, contact, Founder Blueprint and intake — unchanged.
- Company Builder /company-builder → /#review-builder — unchanged behavior.

The proposed gateway path deliberately avoids replacing the existing /capabilities service architecture. Existing private /capability-lab and /genesis-full review entries remain recovery references; public alias decisions come later.

## 05 — Homepage integration

**Location: the existing Proof movement, after Builder and before Invitation.** At this point the visitor has seen the complete creation thesis, operating method, and a way to begin. A capability invitation can add evidence without delaying the revenue path or interrupting the chamber.

Propose one text-led entrance, “Capabilities in practice,” with one supporting sentence describing original interactive DWS demonstrations. This is working copy for approval, not final copy. It distinguishes this invitation from the existing “Selected work” language more clearly than another “What we build” headline.

Use existing Proof space rather than a new full-height section. Preserve Selected Work as the primary real-project entrance. The new capability entrance would take the second major discovery position; Concept Lab remains available as a subordinate text link with a speculative description. This changes the Proof invitation hierarchy and therefore requires a specific founder gate, despite leaving the larger homepage sequence intact.

No artifact previews, tile set, extra canvas, new scroll rail, or direct Genesis entrance on the homepage in the initial integration. No change to Arrival, Creation Chamber, operating sequence, Builder or Invitation. Proposed footprint limit: no extra pinned time and no more than one short text row of additional vertical height at a comparable viewport. If that cannot be met, defer the homepage invitation and use the existing Capabilities nav until approved.

## 06 — Capability gateway: three concepts, no selected winner

All three expose semantic links to all nine disciplines, require no visit order, and allow direct entry. Selection explores the gateway; an explicit “Open demonstration” action enters the artifact. No auto-navigation on hover and no compulsory animation.

### A — The Discipline Score

**Core metaphor:** Nine distinct voices in a composed score; Genesis is their convergence.

**Desktop:** A typographic score traverses a shallow horizontal field. A selected discipline occupies the principal reading position; neighboring names change emphasis around it. Thin alignment relationships connect relevant disciplines without becoming a node network. One short description names the behavior the visitor can test. No artifact rendering or thumbnails in the gateway.

**Mobile:** One focused discipline at readable scale, with Previous/Next and a text “All disciplines” list. Swiping is optional; buttons provide equivalent control. The focused item retains its position after returning from a study.

**Discovery:** All nine names available immediately in the score or semantic list. Relationships are editorial suggestions: physical form ↔ structure ↔ space; identity ↔ experience ↔ adaptation; economics ↔ operations ↔ execution. They are not categories that hide artifacts or claims of chronological dependency. Numbering stays 01–09.

**Genesis elevation:** A distinct concluding line, “See the disciplines work together,” sits beyond the score and opens /genesis. Never numbered 10 in public navigation.

**Selected Work distinction:** A small separate text exit labeled “Real project case studies” leads to /work; it is outside the score.

**Performance:** HTML text and restrained SVG rules; no Three.js or native study mount. Active state uses existing motion tokens. Suitable for minimal transfer cost.

**Creative risk:** Can become decorative technical notation or an over-designed service list. Mitigation: names, one demonstrable action and meaningful relationships only; no ornamental coordinates.

### B — The Working Passage

**Core metaphor:** A sequence of thresholds, each opening into a different kind of making.

**Desktop:** Native vertical scrolling passes through nine offset typographic thresholds, with compact position navigation. A threshold is an opening in the page composition, not a card or a rendered room. Each names a discipline and an action such as inspect, transform or authorize. No embedded miniature of the artifact. Vary density and entry position rather than repeating nine equally tall panels.

**Mobile:** Short consecutive chapters with clear next threshold and an always-available index. No scroll pinning. Open an artifact deliberately, then Back returns to the same chapter and scroll position.

**Discovery:** Sequential browsing plus an early “All nine disciplines” disclosure for direct access. No stage must be completed to reach another. Keep the whole journey short enough to scan; the artifacts carry the depth.

**Genesis elevation:** The passage concludes in a single capstone threshold, visually wider in purpose rather than more decorated. It can also be reached through the gateway index immediately.

**Selected Work distinction:** The passage identifies itself as original demonstrations at entry; real-project proof remains a separate exit, never a tenth passage chapter.

**Performance:** Mostly HTML/CSS. Intersection-driven emphasis only; no heavy preloads on visibility. More document length, but not more scene runtimes.

**Creative risk:** May repeat the homepage's scroll narrative or become nine conventional sections. Mitigation: no construction story, no required progress, no full-viewport chapter repetition. This is spatial discovery, not another Idea → Company performance.

### C — The Commission Lens

**Core metaphor:** A visitor's practical question reveals which disciplines bear on it.

**Desktop:** A large editorial question field offers three nonexclusive lenses: “Give it form,” “Shape its use,” “Make it operate” (provisional copy). Choosing one reorganizes typographic emphasis in one shared field of nine discipline names. A selected artifact's action and limitation appear inline. Nothing is ranked as a personalized recommendation.

**Mobile:** Choose a lens, then explore one readable discipline at a time with a short related-name list. “All disciplines” remains visible; selection never conceals access. No input form, scoring, contact capture or saved profiling.

**Discovery:** Proposed overlaps: Give it form → Object Zero, Form, Surface / Structure, Space; Shape its use → Living Canvas, Signal, Space; Make it operate → Sovereign OS, Capital, Orchestration. Every artifact is represented, relationships may overlap, and numbering is stable. These are navigation lenses, not a new capability taxonomy.

**Genesis elevation:** A fourth, qualitatively different action—“Bring the disciplines together”—opens Genesis. It is not another filter or result tile.

**Selected Work distinction:** The gateway makes no inference about completed client projects. “See real project work” remains a separate exit.

**Performance:** Small local selection state and text; no recommendation service or study rendering. Three.js loads only on explicit artifact entry.

**Creative risk:** Could resemble a second Company Builder, category filter or claim of intelligent matching. Mitigation: three navigation lenses only, no questions about the visitor's business, no generated answer and no visual gallery. If the founder sees a filter UI rather than an authored experience, reject this concept before implementation.

**Decision required:** A, B or C. None is recommended over another in this document.

## 07 — Artifact navigation system

Keep each approved world intact. A restrained context rail occupies safe space outside interactive media and approved controls. It contains the artifact name, disclosure, and a “Navigate” control. Desktop may expose Capability index plus Previous/Next directly; the expanded navigation provides Genesis and Back to DWS. Company Builder is a secondary “Start with an idea” exit, not another competing primary action.

Keep Previous/Next ordered 01–09 for predictability. No wrap from 09 back to 01. At 09, replace the next destination with the capstone invitation to Genesis. At 01, omit Previous. All entries remain directly accessible from the index.

Do not add a case-study masthead, generic intro, new background, frame, or mandatory description above every artifact. Reuse existing index slots where feasible. Any replacement of a locked artifact's header is a separately reviewed integration delta, not blanket permission to redesign it. A small persistent navigation control must remain accessible during full-screen portions and must not cover the artifact's native controls.

## 08 — Genesis positioning

Public name: Genesis. Role: the capstone. Internal archival identity remains artifact 10.

Homepage: cinematic, declarative, scroll-led construction. Genesis: interactive, causal, manually inspectable company behavior. The distinction is not visual complexity: Genesis demonstrates that changes have consequences and authority matters.

Preserve all ten states, Company B, held/authorized/active/settled/recovery behavior, Return and idempotency. Never make visiting earlier artifacts a prerequisite. Explain the simulation once at entry; sample money, capacities and operational data must not be mistaken for DWS results or live connections.

Entrances: the Capability gateway's elevated conclusion; artifact navigation; one optional Builder completion relationship. No additional top-level Genesis item and no initial direct homepage link.

At Return, navigation must not replace the approved ending or reset its ledger. Provide exits outside the instrument: Capability index, DWS home, Company Builder. Do not append a new simulated business stage.

## 09 — Selected Work relationship

MyMosa and IKLA remain the only case studies. Keep their routes, approved assets, paused scope and copy unchanged.

Potential later discipline references must read as independent examples: “Explore a DWS packaging demonstration,” not “The system behind this client.” Do not map Surface / Structure to MyMosa's specific packaging process or Form to IKLA's actual design process without evidence. For the first integration, defer case-study cross-links entirely. The existing global Capabilities access is sufficient and avoids reopening paused work.

## 10 — Concept Lab decision analysis

| Option | Semantic benefit | Cost / risk | Assessment |
| --- | --- | --- | --- |
| Keep distinct | Retains speculative brand worlds alongside interactive demonstrations | Requires precise labels, especially current Proof wording | Recommended |
| Reposition as unfinished R&D | Makes a clear laboratory distinction | Current polished fictional studies are not verified unfinished work; would misdescribe them | Not recommended now |
| Eventual retirement | Fewer destinations | Removes a different kind of imagination and existing URLs; redundancy not demonstrated | Not justified |

Recommendation: **KEEP DISTINCT**. Concept Lab means speculative category/brand-world experimentation. Capabilities means usable demonstrations of discipline. Genesis means integrated causal simulation. Nova's imagined company-world thesis is not the same evidence as Genesis's authority, economics and recovery mechanics.

Do not alter Concept Lab in this phase. Approve the terminology boundary first, then separately review any entrance-copy change. No deletion, migration or route redirect is proposed now.

## 11 — Company Builder relationship

Keep the roadmap as the outcome. Generate and download exactly as today; no demonstration becomes a required step. After completion, beneath the download/readable result and subordinate to the $1,500 Blueprint engagement path, offer one optional “Explore the disciplines in your roadmap” disclosure.

Proposed mapping uses existing result service identifiers and verified taxonomy—not text guessing, AI inference or a new scoring engine. Identity → Form; digital experience → Living Canvas or Signal only when the result supports that need; operational systems → Sovereign OS / Orchestration; product/packaging/space/capital links only where the actual result supports them. Show at most two relevant demonstration links; if no defensible match exists, offer the general gateway. Review the exact service-ID map before implementation.

The same disclosure can include one secondary Genesis link for seeing a whole company system. Do not auto-open it or calculate a new personalized Genesis scenario. No Builder answers are put into URLs, sent to artifact runtimes, or interpreted as simulated financial inputs. Returning must not erase the roadmap; baseline browser-local state restoration requires an integration test before this exit is shipped.

## 12 — Global navigation

**Capabilities top-level: RECOMMENDED, retaining its existing position and /capabilities destination.** That page retains service orientation and gains a single clear gateway entrance after separate approval. Do not silently replace the commercial overview with demonstrations.

**Genesis top-level: NOT RECOMMENDED.** Elevate it within the capability journey, not by adding another header item.

Work, How we build, Company Builder and Studio keep their roles. Cross-route anchors must resolve to /#operating and /#review-builder when leaving a non-home experience; homepage-local anchors remain unchanged. Artifact navigation supplements the global route model without importing the full homepage header or duplicating multiple nav rows.

## 13 — Route architecture

Proposed public destinations, not created routes:

| Artifact | Existing isolated review slug | Proposed destination |
| --- | --- | --- |
| Gateway | /capability-lab | /capabilities/in-practice |
| Object Zero | /capability-lab/3d-product | /capabilities/in-practice/object-zero |
| Living Canvas | /capability-lab/web | /capabilities/in-practice/living-canvas |
| Sovereign OS | /capability-lab/os | /capabilities/in-practice/sovereign-os |
| Signal | /capability-lab/mobile | /capabilities/in-practice/signal |
| Form | /capability-lab/identity | /capabilities/in-practice/form |
| Surface / Structure | /capability-lab/packaging | /capabilities/in-practice/surface-structure |
| Capital | /capability-lab/capital | /capabilities/in-practice/capital |
| Orchestration | /capability-lab/orchestration | /capabilities/in-practice/orchestration |
| Space | /capability-lab/space | /capabilities/in-practice/space |
| Genesis | /genesis-full | /genesis |

Retain independent document entry boundaries with the current native navigation model. Do not introduce an SPA router for this task. The current main loader routes unsupported paths into Portfolio; new paths therefore require explicit build/route registration, static entry metadata, refresh handling and genuine unknown-route behavior in a later implementation gate. Likewise, current /capabilities/* practice dispatch must not swallow /capabilities/in-practice paths.

Legacy private review URLs must not be repurposed destructively. Decide whether to keep private aliases or issue redirects only after the candidate is approved. No production redirects now.

## 14 — Transition architecture

Use existing FAST 160ms, STANDARD 360ms, SYSTEM 720ms and cubic-bezier(.22,.68,.12,1). Shared state feedback belongs to navigation, not to continuous artifact animation.

Gateway selection uses FAST/STANDARD. Explicit route entry uses the approved “same system, new context” transition, without delaying available content. Compact Primitive feedback appears only during actual navigation/loading. Do not add a second persistent L inside Genesis's instrument or an artifact's controls. The global signal should recede once that experience is ready.

Keep native links, modifier-key/new-tab behavior, browser Back/Forward, and scroll restoration. On fresh intentional entry, announce the route and focus its main heading; on history restoration, restore prior position without forcing focus to the top. Reduced motion removes spatial transfer and preserves the same destinations. Error/loading states remain readable, with a direct return link and no fake completion animation.

## 15 — Mobile architecture

The gateway concept determines mobile discovery, as specified in section 06. Common rules: one readable focal discipline, a direct all-disciplines text path, obvious entry/return, and no horizontal page overflow. No nine-thumbnail grid or scaled-down relationship map.

A compact “Navigate” control opens a touch-safe semantic menu with artifact index, Previous/Next, Genesis, home and Builder. Preserve focused trigger on close, Escape/back behavior, safe-area spacing and document scroll position. No overlay may block the native mobile instrument, slider or transaction action. Respect each approved artifact's existing mobile composition; resolve navigation collisions through placement, not by shrinking the artifact.

## 16 — Performance / loading

### Proposed boundaries and budgets

Budgets below are **targets for later measurement**, not current benchmark results. Compressed transfer means the production gzip-equivalent resource size; cached shared resources are excluded from incremental figures.

| Boundary | Proposed budget / policy |
| --- | --- |
| Locked homepage | Zero additional capability/Genesis scene code or media requests. Shared navigation addition target ≤5 KB compressed JS and ≤3 KB CSS; justify any excess. Existing V5.8 rendering cost is unchanged. |
| Shared entry | Reuse React, approved fonts and motion tokens where cacheable. No scene imports, artifact styles or global Three.js in navigation. |
| Gateway | Incremental JS ≤30 KB and CSS ≤15 KB, excluding shared runtime/fonts. No artifact renderer in the gateway. |
| DOM/SVG artifacts | Incremental JS target ≤80 KB and CSS ≤25 KB per route, excluding shared runtime. Validate against each approved baseline before setting a hard gate. |
| Three.js routes | Object Zero (NativeScene), Surface / Structure (PackagingScene), Space (SpaceScene). Renderer shared chunk fetched only on entering one of these routes; provisional compressed renderer+scene budget ≤250 KB, plus shared UI. Budget failure requires review, not unapproved visual simplification. |
| Genesis | Independent runtime/style boundary; provisional total JS ≤90 KB compressed and CSS ≤15 KB, fonts excluded. No Three.js import. |

Confirmed source technology: Living Canvas, Sovereign OS, Signal, Form, Capital and Orchestration have no direct Three.js import in their inspected entry files. Trace complete production dependency graphs at implementation QA; entry inspection alone does not prove zero transitive leakage.

The prior preservation build recorded Genesis JS about 67.12 KB gzip and CSS 2.77 KB gzip. Those are build-transfer observations only, not interaction timing, memory, network or mobile scores. No new performance measurements were taken for this architecture document.

Preload only current-route critical fonts/shell. On clear pointer or keyboard intent, optional lightweight destination-shell prefetch is acceptable if data-saving constraints allow. Do not prefetch Object Zero, Surface / Structure, Space, Genesis, or all neighboring artifacts from the homepage, gateway visibility, or Next labels. No preload merely because a link enters the viewport.

Only one artifact runtime mounts at once. Dispose WebGL resources and listeners on exit; pause offscreen/hidden activity where already supported. Retain approved fallback behavior and report missing coverage rather than inventing a new fallback design. Proposed validation targets: CLS ≤0.1; INP ≤200ms in later representative tests; no sustained rendering when hidden. These are acceptance targets, not guarantees of field performance.

## 17 — Accessibility

Use headings, links and buttons as the primary structure; no canvas-only gateway navigation. Every discipline and relation must be understandable as text. Hover is enhancement only; keyboard and touch reach the same destinations without accidental activation.

Provide skip-to-experience and skip-to-navigation paths, visible focus, semantic current item, 44px minimum touch targets where practicable, and sufficient contrast in each artifact's native palette. Avoid duplicate live regions from shared shell and instruments. Label demonstrations and sample data in accessible text.

Audit drawer focus trapping/return, native Back, direct entry, reduced motion and high zoom. Motion is never the only cue to selected discipline or transaction state. Any accessibility defect in locked artifact behavior is reported for a scoped founder-approved correction, not silently redesigned during integration.

## 18 — SEO / metadata

Investor and candidate environments retain noindex/nofollow in applicable response headers and document metadata. No sitemap submission or search promotion. Link-only anonymous access is not confidentiality: deployable output must exclude preservation records, test captures, internal reports and source-map information that could expose private material.

For a separately authorized future public release: gateway title “Capabilities in Practice — Dynasty Works Studio”; artifact titles “Object Zero — Physical Intelligence — DWS” and equivalent factual discipline labels; Genesis title “Genesis — Company Creation Simulation — DWS.” Descriptions explicitly distinguish original demonstration from client work and simulation from real financial results.

Use canonical URLs for selected public routes and approved native captures for social previews only after capture selection. Do not apply client-review, product-offer, testimonial or financial-performance structured data to fictional demonstrations. Preserve existing Selected Work canonicals. Public indexability is a separate release decision; route creation must not silently remove review robots policy.

## 19 — Integration risks

| Risk | Mitigation / approval criterion |
| --- | --- |
| Homepage too long | One invitation within Proof; no extra pinned segment, nine-study summary or new full-height movement. |
| Capability overload | One focal discipline, all-items text access, optional relationship discovery; no compulsory tour. |
| Demonstrations mistaken for clients | Persistent concise disclosure and separate route taxonomy; only MyMosa/IKLA use case-study language. |
| Genesis duplicates homepage | Frame Genesis around causal decisions, finite constraints and authorization; no second cinematic teaser or reused homepage sequence. |
| Concept Lab redundancy | Keep fictional brand-world exploration distinct from usable discipline instruments; fix terminology only after approval. |
| Navigation bloat | Retain existing Capabilities item; keep Genesis contextual and Concept Lab secondary. |
| Heavy 3D leakage | Separate entry/import boundaries; network audit must show no capability scene requests on homepage/gateway. |
| Mobile discovery complexity | One readable focus, explicit buttons, direct index; no gesture-only routes or miniature maps. |
| Visual inconsistency | Consistent navigation semantics and motion timing, not a universal visual template. Compare approved captures. |
| DWS identity overpowers artifacts | Small context rail; keep native typography, colors and media dominance; no added branded frame. |
| Novelty over business proof | Each entry states a concrete demonstrable action and limitation; retain accessible explanation of what changes and why it matters. |
| Conversion becomes unclear | Builder remains the primary revenue path; demonstrations optional after results; clear return and Blueprint priority. |

Additional technical risks: practice-route collisions, broad legacy styles leaking into artifacts, history restoration losing Builder results, and multiple L signals competing. Resolve each through explicit boundary tests before integrated visual review.

## 20 — Implementation phases (future authorization required)

1. Founder approves gateway concept, proof taxonomy, homepage invitation location, route model and Concept Lab distinction. No code before this gate.
2. Create a separate integration branch from approved recovery foundations and snapshot baseline route, bundle and visual evidence. Preserve investor URL.
3. Prototype only the selected gateway plus common navigation behavior in isolation. Approve desktop/mobile before route integration.
4. Integrate one light artifact and one heavy artifact to validate isolation, return paths and visual non-regression. Expand only after this boundary proof passes.
5. Connect remaining artifacts and Genesis without changing their internals; verify transactional behavior and state isolation.
6. Add the approved Capabilities entrance, single homepage invitation, and optional post-roadmap disclosure. No MyMosa/IKLA edits.
7. Run full private-candidate QA and founder review. Promotion requires separate explicit authorization; integration approval alone is not deployment permission.

## 21 — Founder review gates

**Gate A — architecture:** Choose A/B/C gateway; approve /capabilities/in-practice with service overview retained; decide the Proof hierarchy change; confirm KEEP Concept Lab and no top-level Genesis. Review proposed copy separately.

**Gate B — gateway/native navigation:** Approve one desktop and one mobile prototype, navigation rail placement, disclosures, index and Back behavior. Reject any concept that becomes a gallery or service grid.

**Gate C — fidelity:** Compare each approved artifact and Genesis against locked evidence at identical viewport/state. Only reviewed navigation-context differences are permitted.

**Gate D — conversion/performance:** Confirm Builder results/download and Blueprint priority, no sensitive answer transfer, no scene leakage, loading/error/fallback behavior and accessibility.

**Gate E — integrated candidate:** Founder visual approval on actual private candidate plus technical QA. Existing investor deployment remains untouched until separately authorized promotion.

Current status: **Gate A awaiting founder review. IMPLEMENTATION AUTHORIZED: NO.**

## 22 — Proposed captures / QA

No new captures are produced in this architecture-only task. Future evidence should include:

- 1440 and 390: chosen gateway entry, alternate selection, all-disciplines access, Genesis entrance, navigation expanded and return position.
- 1440 and 390: homepage Proof before/after; full homepage height comparison; Creation Chamber unchanged states; Builder result and optional proof disclosure.
- Each artifact at its approved desktop/mobile initial and decisive interaction states; compare to locked captures, masking only explicitly approved shell changes.
- Genesis at Signal, Identity, Form, Experience, Economics, System, Market, Company held/authorized/active/settled/recovered, Return L/point and reverse traversal; check idempotency after navigation restoration.
- All proposed direct URLs, refresh, unknown route, browser Back/Forward, modifier-key entry, keyboard focus/announcements, menu Escape, touch and reduced motion.
- Widths 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560; 200% zoom; physical phone check before promotion.
- Network waterfall proving gateway/homepage do not load study/Genesis/Three.js additions; cold/warm route transfer; memory after leaving heavy routes; context-loss behavior and console isolation.
- Build, TypeScript, lint; roadmap generation/download/readable fallback; noindex/nofollow on actual candidate; output privacy audit; public/investor deployments unchanged.

Archive QA outside application/public output. Any failing protected behavior blocks progression; do not use integration as permission to rewrite an approved artifact.

---

**Protection confirmation:** V5.8, Capability Lab 01–09 and Genesis remain founder locked. Investor deployment, public production, GitHub main, MyMosa and IKLA unchanged. This document is the only authored deliverable. No application code, routes, components, dependencies or deployments changed. Stop for founder review.
