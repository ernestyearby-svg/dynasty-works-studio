"use client";
import { useState } from "react";
const steps = [
  [
    "Idea",
    "A possibility worth investigating.",
    "Start with the question, the audience and the change you want to make.",
  ],
  [
    "Strategy",
    "Give the idea a direction.",
    "Connect the opportunity, business model and positioning to a practical set of decisions.",
  ],
  [
    "Identity",
    "Make the company recognizable.",
    "Translate the direction into a name, a voice and a coherent visual system.",
  ],
  [
    "Product",
    "Make the promise tangible.",
    "Develop the object, service or experience people will actually use.",
  ],
  [
    "Technology",
    "Build what supports it.",
    "Connect the website, application, commerce and operating systems.",
  ],
  [
    "Market",
    "Prepare for the real world.",
    "Bring the story, sales materials, launch activity and customer journey together.",
  ],
  [
    "Company",
    "The pieces work as one.",
    "A coordinated company, with a clear next move across Define, Build, Launch and Scale.",
  ],
];
export function Foundry() {
  const [active, setActive] = useState(0);
  return (
    <section className="v3-foundry" aria-labelledby="foundry-title">
      <div className="v3-register">
        <p>THE FOUNDRY</p>
        <span>AN IDEA, CONSTRUCTED.</span>
        <span>EXPLORE THE SEQUENCE</span>
      </div>
      <div className="v3-foundry-layout">
        <div>
          <h2 id="foundry-title">
            Ideas become
            <br />
            <em>assets.</em>
          </h2>
          <p>Each decision gives the next one something to build on.</p>
          <div
            className="v3-foundry-controls"
            role="group"
            aria-label="Explore the Foundry sequence"
          >
            {steps.map(([label], i) => (
              <button
                key={label}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                aria-controls="foundry-detail"
              >
                <span>0{i + 1}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div
          id="foundry-detail"
          className="v3-foundry-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="v3-foundry-number" aria-hidden="true">
            0{active + 1}
          </span>
          <p className="eyebrow">{steps[active][0]}</p>
          <h3>{steps[active][1]}</h3>
          <p>{steps[active][2]}</p>
          <div className="v3-workline-progress" aria-hidden="true">
            <span
              style={{ width: ((active + 1) / steps.length) * 100 + "%" }}
            />
          </div>
          <button
            className="text-link"
            onClick={() => setActive((active + 1) % steps.length)}
          >
            {active === steps.length - 1
              ? "BACK TO THE IDEA"
              : "NEXT / " + steps[active + 1][0].toUpperCase()}{" "}
            →
          </button>
        </div>
      </div>
    </section>
  );
}
