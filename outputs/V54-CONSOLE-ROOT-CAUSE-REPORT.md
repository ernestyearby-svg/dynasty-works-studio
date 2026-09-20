# DWS V5.4 — MutationObserver Root-Cause Report

## Outcome
ERROR REPRODUCED: YES
SOURCE: BROWSER INJECTION (Codex in-app browser iframe instrumentation)
FUNCTIONAL IMPACT: NONE observed in the tested DWS flows.
DWS CODE CHANGE REQUIRED: NO
Application checkpoint unchanged: 1de9a265646e2213424c4e5a8649a29d30edd2c6
Branch: codex/v5.4-experience-integration
Candidate: https://codex-v5-4-experience-integration--dynasty-works-v54-candidate.netlify.app/

## Exact error
`Uncaught TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.`
The in-app browser log provides neither a source URL nor a stack trace. The precise injected function and invalid argument are therefore unavailable. No claim is made that the argument specifically was document.body or null.

## Causal evidence
1. Actual authenticated candidate: Home to Work navigation logged the exact error at 2026-09-18T06:53:31.277Z. A read-only DOM observation at 06:53:31.291Z found /work/, readyState interactive, the Netlify HUD iframe present, and no React H1 yet. The application then initialized normally.
2. Netlify injects /.netlify/scripts/hud?variant=owner-private. It constructs #nl-hud-frame using srcdoc. The inspected HUD JavaScript and generated srcdoc contain no MutationObserver call.
3. A minimal local HTML reproduction contains only a heading, native link and a dynamically appended srcdoc iframe. It has NO DWS scripts, NO React, NO transition code, NO packages, NO Netlify script and NO MutationObserver calls. In the same in-app browser it produces the identical error on first load (06:54:24.430Z), navigation (06:54:28.545Z), and reload/history (06:55:58.624Z / .652Z / .677Z).
4. A control page without an iframe produces no error in the in-app browser.
5. A separate minimal page with the saved Netlify HUD script also reproduces the error in the in-app browser (07:03:54.134Z / .301Z).
6. Fresh, nonpersistent Edge contexts running the SAME plain/iframe/HUD fixtures produce zero errors through load, link navigation, reload, back and forward. This separates the browser-injected observer from the page scripts and the Netlify script.

Conclusion: the Netlify toolbar supplies the iframe trigger, but an observer outside DWS/Netlify page code generates the error in the in-app browser. The authentication mechanism itself is not established as defective. This is not a DWS observer lifecycle failure. No workaround or error suppression was added.

## Reproduction matrix
| Test | Result |
|---|---|
| Authenticated candidate reload | Initial sampled reload showed no error; route later initialized normally |
| Authenticated hard refresh | No additional error in the sampled hard refresh |
| Home to Work | Exact error before new H1; HUD already present |
| Direct MyMosa plus back/forward | Exact error recurred during this sequence; routes resolved |
| Minimal iframe, in-app browser | Exact error, without DWS or Netlify |
| Minimal no-iframe control, in-app browser | Clean |
| Minimal Netlify HUD, in-app browser | Exact error |
| All three fixtures, clean Edge | Clean |
| Local production route/interaction sweeps | Clean |
| Candidate in clean unauthenticated Edge | Redirects to Netlify Team protection; application cannot be tested anonymously |

No anonymous Netlify clone was created. The iframe/no-iframe and clean-browser controls establish the external source without changing hosting protections or adding another deployment. Authenticated ordinary Edge was not tested; no saved browser cookies or credentials were extracted.

## Source audit
- src/experience/ExperienceSystem.tsx:57-59: observer receives root from document.getElementById only when non-null and initialization is pending. DOM lookup returns an Element, a valid Node. It disconnects when the H1 becomes available and on component cleanup.
- Vite module-preload compatibility code: observes document, a valid Node. On the tested modern browsers modulepreload support returns before this compatibility observer is created. It is document-lifetime code.
- Bundled supporting-page Radix focus-scope: container guarded before observe; disconnects on cleanup. It is not loaded on Home/Work/MyMosa where the error reproduces.
- Other .observe uses in DWS visual components are IntersectionObserver, not MutationObserver, with element/ref guards and disconnect cleanup.
- React/application code is absent from the decisive minimal reproduction.

## Functional and technical checks
- Production build: PASS
- TypeScript: PASS
- Lint: PASS
- Local console: PASS (24 routes at 1440 and 390, plus dedicated motion/keyboard/history tests)
- Anonymous Netlify console: NOT TESTED (authentication redirect)
- Authenticated Netlify console: FAIL — external in-app-browser error remains visible
- Native transitions: PASS desktop/mobile
- Reduced motion: PASS; no spatial transition, focus preserved
- Keyboard/H1 focus/history: PASS
- Responsive overflow/image checks: PASS in the route sweep
- Builder: PASS; authenticated candidate produced roadmap and download-prepared confirmation; local download was received as dynasty-works-initial-roadmap.txt
- Persistent Primitive/CTA/navigation: no functional failure observed

## Files
No application, design, motion, dependency, hosting or repository files changed. No new checkpoint.
Diagnostic-only files outside the deployed dist:
- outputs/observer-isolation-server.cjs
- outputs/observer-clean-browser.cjs
- outputs/observer-clean-browser.json
- outputs/V54-CONSOLE-ROOT-CAUSE-REPORT.md
Existing outputs/v54-interaction-qa.json and integration-regression-qa.json refreshed.

## Protections
Investor published deploy remains 6aac50116446a300089b50b9 at 0268f213206e7daedb1947770c4e41be29861573.
GitHub main remains bbae995cc30ac93bafe80596410e9a2ea2b366fe.
MyMosa remains paused. Public production, Vercel, motion, Creation Primitive and candidate deployment unchanged.

## Recommendation
PROMOTION READY from the console-defect investigation perspective: no DWS fix is required. Founder visual approval and explicit promotion authorization remain separate requirements. Nothing was promoted. Report the minimal srcdoc reproduction to the in-app browser maintainer if desired; no external report was sent.
