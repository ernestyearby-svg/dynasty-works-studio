import React, { useState, useEffect } from 'react';

interface AssetDetail {
  status: string;
  assetId: string;
  receiptId: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  signedUrl: string;
  expiresIn: number;
}

export default function PrincipalAssetPortal(): React.JSX.Element {
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(900);

  // Extract non-secret reference identifiers from URL
  const searchParams = new URLSearchParams(window.location.search);
  const aid = searchParams.get('aid') || searchParams.get('assetId') || '';
  const rid = searchParams.get('rid') || searchParams.get('receiptId') || '';

  // 15-minute countdown timer once authorized
  useEffect(() => {
    if (!asset || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [asset, timeRemaining]);

  function formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the DWS Principal Passcode.');
      return;
    }
    if (!aid || !rid) {
      setError('Missing submission or asset reference in URL.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // POST passcode over HTTPS; never placed in URL, localStorage, or cookies
      const res = await fetch('/api/submissions/assets/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          aid: aid.trim(),
          rid: rid.trim(),
          passcode: passcode.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Intentionally generic error message to prevent enumeration
        setError(data.message || 'Authorization failed. Invalid credentials or request reference.');
        setAsset(null);
      } else if (data.status === 'authorized' && data.signedUrl) {
        setAsset(data);
        setTimeRemaining(data.expiresIn || 900);
        // Wipe passcode from state immediately upon successful authorization
        setPasscode('');
      } else {
        setError(data.message || 'Unexpected response from vault authorization.');
      }
    } catch (err: any) {
      setError(`Network error connecting to vault: ${err.message || 'Unknown issue'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '780px', margin: '60px auto', padding: '0 20px', color: '#f8fafc' }}>
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
          DYNASTY WORKS STUDIO // OPERATOR ACCESS
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
          Principal Vault
        </h1>
        <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Confidential founder asset retrieval. Restricted strictly to authorized studio principals.
        </p>
      </div>

      {/* Authorized Vault View */}
      {asset ? (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
            <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
              ✓ AUTHORIZED PRINCIPAL GRANT
            </span>
            <span style={{ fontSize: '12px', color: timeRemaining < 120 ? '#ef4444' : '#94a3b8', fontFamily: 'monospace' }}>
              Expires in: {formatTime(timeRemaining)}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 10px', color: '#f8fafc' }}>
              {asset.originalFilename}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
              <div><strong style={{ color: '#cbd5e1' }}>MIME Type:</strong> {asset.mimeType}</div>
              <div><strong style={{ color: '#cbd5e1' }}>File Size:</strong> {formatBytes(asset.sizeBytes)}</div>
              <div><strong style={{ color: '#cbd5e1' }}>Receipt ID:</strong> {asset.receiptId}</div>
            </div>
          </div>

          {timeRemaining > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={asset.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                SECURELY VIEW / DOWNLOAD ASSET (15-Min Vault Link) →
              </a>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                Signed URL expires automatically in {formatTime(timeRemaining)}. Asset is streamed directly from private Supabase vault.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px' }}>
              <p style={{ margin: 0, color: '#fca5a5', fontSize: '13px' }}>
                Signed URL expired. Please refresh the page and enter passcode to generate a new short-lived grant.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Unauthenticated Gate: Displays non-secret reference + Passcode Input */
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '28px' }}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px', color: '#f8fafc' }}>
              Authentication Required
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
              <div>
                <span style={{ color: '#64748b' }}>Submission Reference: </span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{rid || 'Not specified'}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Asset Reference: </span>
                <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{aid || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="principal-passcode" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px' }}>
                Enter DWS Principal Passcode
              </label>
              <input
                id="principal-passcode"
                type="password"
                autoComplete="off"
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter principal authentication passcode..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '14px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: submitting ? 'wait' : 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              {submitting ? 'Verifying Authorization...' : 'Unlock Vault Asset →'}
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '20px', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>🔒 Vault Security Standard: Zero permanent public URLs. Zero credential exposure. Access audited.</div>
        <div>Dynasty Works Studio Private Cloud Vault · founder-intake-assets</div>
      </div>
    </div>
  );
}
