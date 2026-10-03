import type { SubmissionUIState } from "@legacy/lib/submission-contracts";

export function SubmissionFeedback({ result }: { result: SubmissionUIState }) {
  if (result.state === "idle") return null;
  if (result.state === "submitting")
    return (
      <p role="status" aria-busy="true">
        Transmitting your intake securely…
      </p>
    );
  if (result.state === "success")
    return (
      <div
        className="submission-success-banner"
        style={{
          margin: "20px 0",
          padding: "24px",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "8px",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "16px",
            color: "#10b981",
            letterSpacing: "0.05em",
            marginBottom: "8px",
          }}
        >
          INTAKE RECEIVED
        </div>
        <p
          style={{
            margin: "0 0 16px 0",
            color: "#e5e7eb",
            fontSize: "14.5px",
            lineHeight: "1.5",
          }}
        >
          Your information has been securely transmitted to Dynasty Works Studio. Our team will review your submission and follow up regarding the appropriate next step.
        </p>
        {result.receiptId && (
          <div
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginBottom: "16px",
              fontFamily: "monospace",
            }}
          >
            Receipt ID: {result.receiptId}
          </div>
        )}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="/growth/book"
            className="button primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              background: "#d4af37",
              color: "#050506",
              fontWeight: 700,
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            BOOK A STRATEGY CALL →
          </a>
        </div>
      </div>
    );

  const fallbackMsg =
    result.message && !result.message.includes('503') && !result.message.includes('HIGHLEVEL')
      ? result.message
      : "We couldn't transmit your intake right now. Your information remains available for local download. Please retry or contact Dynasty Works Studio.";

  return (
    <div
      className="submission-message"
      role={result.state === "error" ? "alert" : "status"}
      style={
        result.state === "error"
          ? {
              margin: "16px 0",
              padding: "16px 20px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "6px",
              color: "#f87171",
              fontSize: "14px",
              lineHeight: "1.5",
            }
          : undefined
      }
    >
      {fallbackMsg}
    </div>
  );
}
