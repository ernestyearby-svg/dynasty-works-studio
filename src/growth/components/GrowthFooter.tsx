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
    <footer style={{ background: '#090b0d', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '48px 0 64px' }} role="contentinfo">
      <div className="growth-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://dynastyworksstudio.com/growth"
            className="growth-wordmark"
            aria-label="Dynasty Works Studio Growth Operating System Home"
          >
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ece9e1', textTransform: 'uppercase' }}>
              DYNASTY WORKS STUDIO
            </span>
          </a>
          <span style={{ fontSize: '12px', color: '#686b77', fontFamily: 'monospace' }}>
            // GROWTH OPERATING SYSTEM V2.0
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '12px', color: '#7a7d88' }}>
          <a href="/growth" style={{ color: '#a0a3ad', textDecoration: 'none' }}>Overview</a>
          <a href="/growth/apply" style={{ color: '#a0a3ad', textDecoration: 'none' }}>Diagnostic</a>
          <a href="/growth/book" style={{ color: '#a0a3ad', textDecoration: 'none' }}>Schedule</a>
          <a href="/privacy" style={{ color: '#a0a3ad', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: '#a0a3ad', textDecoration: 'none' }}>Terms</a>
          <button
            type="button"
            onClick={toggleMotion}
            style={{
              background: 'none',
              border: 'none',
              color: '#686b77',
              fontSize: '11px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {motionReduced ? 'Motion: Reduced' : 'Reduce Motion'}
          </button>
          <span>© {new Date().getFullYear()} Dynasty Works</span>
        </div>
      </div>
    </footer>
  );
};
