"use client";
import { useState } from "react";
const parts = [
  {
    name: "STRATEGY",
    lead: "A direction the company can act on.",
    body: "Connect the opportunity, positioning and business model to the decisions that follow.",
    links: "Informs identity, product and market.",
  },
  {
    name: "IDENTITY",
    lead: "A recognizable company, across every touchpoint.",
    body: "Give the idea a name, a visual language and a consistent expression.",
    links: "Connects the product to the market.",
  },
  {
    name: "PRODUCT",
    lead: "Something worth bringing into the world.",
    body: "Shape the physical product, digital product or experience around the people it serves.",
    links: "Depends on strategy, technology and operations.",
  },
  {
    name: "TECHNOLOGY",
    lead: "Infrastructure behind the experience.",
    body: "Build the website, application, commerce and connected data systems around how the business works.",
    links: "Connects product, market and operations.",
  },
  {
    name: "MARKET",
    lead: "A route from the company to its customers.",
    body: "Prepare the channels, commercial materials and launch activity that bring the company into the market.",
    links: "Brings identity and product into contact with customers.",
  },
  {
    name: "OPERATIONS",
    lead: "The work behind the promise.",
    body: "Connect information, people and repeatable workflows, with human approval where it matters.",
    links: "Supports delivery, learning and growth.",
  },
];
export function CompanySystem() {
  const [active, setActive] = useState(0);
  return (
    <div className="v2-system-interactive">
      <div
        className="v2-system-grid"
        role="group"
        aria-label="Explore the connected company system"
      >
        <svg
          viewBox="0 0 600 360"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M100 90H500M100 270H500M100 90V270M300 90V270M500 90V270M100 90L500 270M500 90L100 270" />
        </svg>
        {parts.map((p, i) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={active === i}
            aria-controls="company-system-detail"
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            <strong>{p.name}</strong>
            <span className="v2-node" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        id="company-system-detail"
        className="v2-system-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="eyebrow">{parts[active].name}</p>
        <h3>{parts[active].lead}</h3>
        <p>{parts[active].body}</p>
        <p className="v2-connection">{parts[active].links}</p>
      </div>
    </div>
  );
}
