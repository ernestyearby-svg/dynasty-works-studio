"use client";
import Link from "@/components/site-link";
import { useState } from "react";
import { navigation } from "@/data/site";
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav shell">
      <Link
        href="/"
        className="wordmark"
        aria-label="Dynasty Works Studio home"
      >
        <span className="brand-mark" aria-hidden="true">
          Ⅾ/
        </span>
        <span>
          DYNASTY
          <br />
          WORKS STUDIO
        </span>
      </Link>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        className={`nav-links ${open ? "open" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {navigation.map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            className={i === navigation.length - 1 ? "nav-cta" : ""}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
