"use client";
import { Wordmark } from "@legacy/components/wordmark";
import Link from "@legacy/components/site-link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "@legacy/navigation";
import { navigation } from "@legacy/data/site";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () =>
      header.current?.setAttribute(
        "data-scrolled",
        String(window.scrollY > 24),
      );
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() =>
      nav.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
    );
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header
      ref={header}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
      className={"nav shell" + (pathname === "/" ? " master-nav" : "")}
    >
      <Link
        href="/"
        className="wordmark"
        aria-label="Dynasty Works Studio home"
      >
        <Wordmark />
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        ref={nav}
        id="site-navigation"
        aria-label="Main navigation"
        className={`nav-links ${open ? "open" : ""}`}

      >
        {navigation.map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={
              pathname === n.href ||
              (n.href !== "/" && n.href !== "/start-a-business" && pathname?.startsWith(n.href + "/")) ||
              (n.href === "/capabilities" && pathname === "/automation")
                ? "page"
                : undefined
            }
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
