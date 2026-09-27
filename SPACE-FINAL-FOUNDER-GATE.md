# SPACE — Phase III Final Founder Gate

Source checkpoint: `6e56d4f`.
Scope: representational elevation of Space only. No deployment.

## Preserved

Pavilion footprint, circular court, three-wing organization, arrival path, massing, primary member dimensions and structural layout are retained. SPACE typography, warm presentation, continuous controller and eight stages are unchanged. Space.tsx and Space.css are byte-identical to the source checkpoint.

## Representation

- Timber: original slat dimensions/spacing retained; seven restrained timber tones, procedural directional grain and rounded edges introduce differentiation.
- Mineral: procedural fine roughness, softened edges and visible platform thickness.
- Metal: slender members retained; base plates and beam-seat junction details added, with controlled metal response.
- Glass: restrained edge-defined translucent panels sit along the existing retreat screen. Transparency is an architectural approximation, not optical simulation.
- Ground: a thin site field and restrained surface lines anchor the pavilion without changing its architectural footprint.
- Light: the same source moves from high oblique light toward lower afternoon light. Slat shadows change orientation and density across the court and occupied edges. Ambient illumination reduces as direct light gains definition; this is not simply an exposure increase.
- Humans: extruded architectural silhouettes and proportioned limbs replace capsule mannequins. Walking, standing, conversation, seated retreat and presenting poses explain distinct spatial uses. Groups fade in without distorting body proportions.
- Notation: structural datum, circulation trace, material callout, light vector, 1.70 m scale reference and occupation labels appear in their relevant stages.

These remain conceptual representations, not built-project evidence or engineering certification. No new imagery or dependencies added. RoundedBoxGeometry comes from the existing Three.js package.

## New captures only

Directory: `outputs/space-final-founder-gate/`

- space-plan-1440.png
- space-structure-1440.png
- space-material-1440.png
- space-light-1440.png
- space-human-scale-1440.png
- space-occupation-1440.png
- space-occupation-390.png

Gallery: `outputs/space-final-founder-gate/index.html`.
Desktop: 1440 × 1000. Mobile: 390 × 844.

Visual inspection covered all seven states, with particular review of material/light differentiation, human scale, seated retreat and mobile model framing.

## QA

BUILD: PASS — isolated lab production build.
TYPESCRIPT: PASS.
LINT: PASS.
CONSOLE: PASS — no errors in capture or interaction runs.
OVERFLOW: PASS — all eight positions at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560.
KEYBOARD: PASS — range Home/Arrow controls, direct stage activation and visible focus.
REDUCED MOTION: PASS — direct manipulation remains usable, no autoplay or time-dependent scene sequence.
94 automated checks passed, including navigation/unmount.

PERFORMANCE: Rendering remains input/resize-driven. No continuous animation loop. Headless Edge input-sweep requestAnimationFrame sample: median 16.7 ms, p95 16.8 ms. This does not establish physical-device GPU performance. New SpaceScene chunk approximately 9.0 kB minified / 4.2 kB gzip. Existing shared Three/RoomEnvironment chunk approximately 589 kB / 148 kB retains the >500 kB build warning. Geometry, textures, materials, observer and renderer are disposed on unmount.

## Protection

Only SpaceScene.tsx changed among application source files.
01–08: LOCKED / UNCHANGED.
V5.8, investor deployment, public production, MyMosa and IKLA: UNCHANGED.
Genesis not started. No deployment or push.

STOP — founder visual approval required.
