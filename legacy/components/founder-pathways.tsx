"use client";
import { useState } from "react";
import Link from "@legacy/components/site-link";
import { founderPathways } from "@legacy/data/company-builder";
import { RadioGroup, RadioGroupItem } from "@legacy/components/ui/radio-group";
export function FounderPathways() {
  const [selected, setSelected] = useState(founderPathways[0].id);
  const pathway = founderPathways.find((p) => p.id === selected)!;
  return (
    <section className="shell section founder-pathways" id="your-start">
      <div className="section-title">
        <span className="eyebrow">YOUR STARTING POINT</span>
        <h2>Where are you right now?</h2>
      </div>
      <div className="pathway-layout">
        <RadioGroup
          aria-label="Choose your starting point"
          value={selected}
          onValueChange={setSelected}
          className="pathway-options"
        >
          {founderPathways.map((p, i) => (
            <label
              key={p.id}
              className={
                "pathway-option " + (selected === p.id ? "selected" : "")
              }
              htmlFor={"pathway-" + p.id}
            >
              <RadioGroupItem
                id={"pathway-" + p.id}
                value={p.id}
                className="builder-radio"
              />
              <span className="eyebrow">0{i + 1}</span>
              <span>
                <strong>{p.title}</strong>
                <span>{p.quote}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        <div className="pathway-result" aria-live="polite">
          <span className="eyebrow">A PLACE TO BEGIN</span>
          <h3>{pathway.title}</h3>
          <p>{pathway.description}</p>
          <ul>
            {pathway.recommended.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="small-note">
            A starting suggestion, refined around your company.
          </p>
          <Link
            className="button dark"
            href={"/start-a-business/builder?pathway=" + pathway.id}
          >
            Build from here ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
