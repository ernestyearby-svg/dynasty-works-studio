import type { SubmissionUIState } from "@legacy/lib/submission-contracts";
// Reusable future transport feedback. Only disabled feedback is reachable in V1.4's intake.
export function SubmissionFeedback({ result }: { result: SubmissionUIState }) {
  if (result.state === "idle") return null;
  if (result.state === "submitting")
    return (
      <p role="status" aria-busy="true">
        Sending your intake securely…
      </p>
    );
  if (result.state === "success")
    return (
      <p className="submission-message" role="status">
        Your intake was received for project review. Receipt: {result.receiptId}
        . This is not a payment or booking confirmation.
      </p>
    );
  return (
    <p
      className="submission-message"
      role={result.state === "error" ? "alert" : "status"}
    >
      {result.message}
    </p>
  );
}
