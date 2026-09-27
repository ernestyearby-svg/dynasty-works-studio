# Capability Lab — Phase III Founder Review

Source checkpoint: `ff5bc7b`.
Scope: 07 Capital, 08 Orchestration, 09 Space. Local only. No deployment.

## 07 — CAPITAL / Business and capital intelligence

An editorial financial document in warm paper and deep green. Unit volume is the master assumption. Revenue typography moves and scales, the revenue mass expands, costs rebalance, operating result relocates and capital allocations change.

Five chapters: Thesis, Assumption, Consequence, Capital, Horizon. All data is explicitly fictional. The model exposes its assumptions:

- Monthly volume: 200–2,400 units.
- Unit price: $180.
- Unit cost: $95, falling to $85 at 1,200 units.
- Monthly operating cost: $45,000 plus $15 per unit above 1,000.
- Setup: $240,000; initial inventory: two months of unit cost.
- Required capital: setup + initial inventory + six months of negative operating result, if any.
- Illustrative funding envelope: $1.2m. Static cash runway uses remaining cash divided by monthly operating loss.
- Horizon includes a 530-unit operating threshold and annualized operating result / required capital. This is not an investor return forecast.

No real-company financial information is used. Taxes, debt, growth and actual cash timing are outside this model. The diagram is expressive causal information design, not a to-scale accounting chart.

## 08 — ORCHESTRATION / Automation and execution intelligence

A near-black temporal field with a restrained lime execution signal and warm exception state. Eight stages progress through Ingest, Classify, Route, Execute, Human Gate, Validate, Publish and Audit.

Run Job advances on timed state changes. The current temporal segment expands while completed stages retain their record. Human Gate actually stops downstream execution. Approve resumes; Return re-enters classification; Reject ends the run without publication.

The optional simulated validation exception isolates output and blocks Publish. Repair + Retry performs validation again, then progresses to Publish and Audit. Timestamped events record the path. All activity is local simulation: no real agents, integrations, network publishing or business data.

## 09 — SPACE / Spatial and environmental intelligence

One modular social pavilion develops through Plan, Mass, Structure, Circulation, Material, Light, Human Scale and Occupation. The same geometry remains traceable as the camera tilts from orthographic plan into axonometric representation.

Three sheltered wings frame a shared open court: western screened retreat, eastern conversation bench, northern presentation platform. One arrival path connects the court and wings. Native columns, beams, timber slats, mineral platforms, furnishings, circulation traces and proportion figures establish a spatial program.

Representation is deliberately architectural rather than photorealistic. The pavilion is an unbuilt concept; structural capacity, accessibility dimensions, weather performance and code compliance have not been certified.

## Techniques and dependencies

React state and semantic HTML; CSS composition; SVG financial geometry; timed finite-state workflow; existing Three.js and RoomEnvironment for the pavilion. Existing local LabSans/LabSerif fonts. No dependencies added. No generated raster artwork, stock images, client imagery or external services.

## Performance

New isolated production chunks, minified / gzip:

- Capital: approximately 5.8 / 2.4 kB JS.
- Orchestration: approximately 5.3 / 2.1 kB JS.
- Space wrapper: approximately 2.9 / 1.4 kB JS.
- Space scene: approximately 5.2 / 2.6 kB JS.

Space renders only on input and resize; no continuous render loop. Timers and observers are cleaned up; geometry, materials, environment and renderer are disposed. Scene is lazily loaded. Existing shared Three/RoomEnvironment chunk is approximately 581 / 147 kB and retains Vite's >500 kB warning.

Headless Edge requestAnimationFrame cadence sample: median approximately 16.7 ms, p95 approximately 16.8 ms across all three routes. This is an idle scheduling sample, not a physical-device GPU benchmark or a 60fps guarantee.

## QA

- Isolated lab production build: PASS.
- TypeScript: PASS.
- Lint: PASS.
- Console: PASS, no errors captured.
- 144 automated checks: PASS.
- Overflow: PASS at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560.
- Financial calculations: four unit-volume cases, required capital and runway independently checked.
- Workflow: held gate, downstream wait, Return, keyboard Reject, exception isolation, retry, completion and audit checked.
- Space: all eight states and native canvas load checked.
- Keyboard: native sliders, buttons, selects/state controls and visible focus.
- Screen-reader support: labeled controls, pressed states, semantic stage list, workflow status announcement and descriptive canvas alternative. No physical screen-reader session was performed.
- Reduced motion: spatial CSS transitions removed; pavilion remains directly controlled; workflow keeps meaningful timing and gate behavior without requiring motion for comprehension.
- Visual review: all 17 new captures inspected, with enlarged checks for key desktop and mobile compositions.

## Captures

Directory: `outputs/capability-phase-iii/`
Gallery: `outputs/capability-phase-iii/index.html`

### Capital

- capital-thesis-1440.png
- capital-assumption-1440.png
- capital-consequence-1440.png
- capital-deployment-1440.png
- capital-thesis-390.png

### Orchestration

- orchestration-idle-1440.png
- orchestration-execution-1440.png
- orchestration-human-gate-1440.png
- orchestration-exception-1440.png
- orchestration-complete-1440.png
- orchestration-execution-390.png

### Space

- space-plan-1440.png
- space-mass-structure-1440.png
- space-material-light-1440.png
- space-human-scale-1440.png
- space-occupation-1440.png
- space-occupation-390.png

Desktop captures are 1440 × 1000; mobile captures are 390 × 844. Mobile routes scroll naturally to remaining controls and audit detail.

## Preservation

All source files for approved artifacts 01–06 and their shared stylesheet remain identical to `ff5bc7b`. Only the isolated lab index and lab-only Vite route allowlist are extended, alongside seven new study files.

V5.8 unchanged. Investor deployment unchanged. Public production unchanged. MyMosa unchanged. IKLA unchanged.

No deployment or push. 10 Genesis not started.

STOP — founder review required.
