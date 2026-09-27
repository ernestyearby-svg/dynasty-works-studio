import React, { useState, useEffect } from 'react';

export const GrowthFooter: React.FC = () => {
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMotionReduced(prefersReduced);
  }, []);

  const toggleMotion = () => {
    const next = !motionReduced;
    setMotionReduced(next);
    if (next) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  return (
    <footer className="growth-footer" role="contentinfo">
      <div className="growth-container growth-footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://dynastyworksstudio.com/growth"
            className="growth-brand-lockup"
            aria-label="Dynasty Works Studio Growth Operating System Home"
          >
            <div className="growth-brand-mark" style={{ width: '24px', height: '24px' }}>
              <svg width="14" height="14" viewBox="0 0 250 150" fill="none">
                <path
                  d="M20 125V95H90V60H160V25H230V125Z"
                  stroke="#D4B483"
                  strokeWidth="14"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--dws-bone)' }}>
              DYNASTY WORKS STUDIO
            </span>
          </a>
          <span style={{ fontSize: '12px', color: 'var(--dws-text-dim)' }}>
            Growth Operating System · Infrastructure Architecture
          </span>
        </div>

        <div className="growth-footer-legal">
          <a href="/growth">Overview</a>
          <a href="/growth/apply">Apply</a>
          <a href="/growth/book">Schedule</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <button
            type="button"
            onClick={toggleMotion}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--dws-text-dim)',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {motionReduced ? 'Motion: Reduced' : 'Reduce Motion'}
          </button>
          <span>© {new Date().getFullYear()} Dynasty Works Studio</span>
        </div>
      </div>
    </footer>
  );
};
