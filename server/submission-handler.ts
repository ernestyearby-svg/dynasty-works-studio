import {
  submissionSchemas,
  type SubmissionKind,
} from "@/lib/submission-contracts";
import { generateRoadmap } from "@/lib/recommendation-engine";
import {
  disabledSubmissionDependencies,
  type SubmissionDependencies,
} from "@/server/submission-adapters";
import { site } from "@/data/site";
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const reply = (
  status: number,
  body: unknown,
  extra: Record<string, string> = {},
) => Response.json(body, { status, headers: { ...responseHeaders, ...extra } });
const unavailable = () =>
  reply(503, {
    status: "not_configured",
    message:
      "Your information has not been submitted. Secure delivery is not connected. Download a local copy to keep it.",
  });
const maxBodyBytes = 48000;
async function readJSON(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  if (Number(request.headers.get("content-length") || 0) > maxBodyBytes)
    return {
      ok: false,
      response: reply(413, {
        status: "rejected",
        message: "Request is too large.",
      }),
    };
  const reader = request.body?.getReader();
  if (!reader)
    return {
      ok: false,
      response: reply(400, {
        status: "rejected",
        message: "Expected a JSON body.",
      }),
    };
  let size = 0;
  const chunks: Uint8Array[] = [];
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return {
          ok: false,
          response: reply(413, {
            status: "rejected",
            message: "Request is too large.",
          }),
        };
      }
      chunks.push(value);
    }
    if (timedOut)
      return {
        ok: false,
        response: reply(408, {
          status: "rejected",
          message: "Request took too long.",
        }),
      };
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return {
      ok: true,
      value: JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      ),
    };
  } catch {
    return {
      ok: false,
      response: reply(400, {
        status: "rejected",
        message: "Invalid or incomplete JSON.",
      }),
    };
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
export async function handleSubmission(
  request: Request,
  kind: SubmissionKind,
  deps: SubmissionDependencies = disabledSubmissionDependencies,
) {
  if (request.method !== "POST")
    return reply(
      405,
      { status: "rejected", message: "Use POST." },
      { Allow: "POST" },
    );
  const url = new URL(request.url),
    origin = request.headers.get("origin");
  const allowedOrigin = ["localhost", "127.0.0.1"].includes(url.hostname)
    ? url.origin
    : site.origin;
  if (
    !origin ||
    origin !== allowedOrigin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply(403, {
      status: "rejected",
      message: "Request origin is not allowed.",
    });
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return reply(415, {
      status: "rejected",
      message: "Expected application/json.",
    });
  // Production cannot become active merely by setting an environment flag. Every dependency must be reviewed and attached server-side.
  const ready =
    deps.enabled && deps.repository && deps.limiter && deps.botVerifier;
  try {
    if (ready) {
      const limit = await deps.limiter!.consume(request);
      if (!limit.allowed)
        return reply(
          429,
          {
            status: "rate_limited",
            message: "Please wait before trying again.",
          },
          {
            "Retry-After": String(
              Math.min(
                3600,
                Math.max(1, Math.ceil(limit.retryAfterSeconds) || 60),
              ),
            ),
          },
        );
    }
    const body = await readJSON(request);
    if (!body.ok) return body.response;
    const parsed = submissionSchemas[kind].safeParse(body.value);
    if (!parsed.success)
      return reply(422, {
        status: "validation_error",
        message: "Please review the required fields.",
        errors: parsed.error.flatten().fieldErrors,
      });
    if (!ready) return unavailable();
    if (!(await deps.botVerifier!.verify(parsed.data.botToken || "", request)))
      return reply(403, {
        status: "rejected",
        message: "Verification was not completed. Please try again.",
      });
    // Narrow per route before persistence. Posted recommendation snapshots are rejected by the strict schema.
    let saved;
    if (kind === "builder") {
      const payload = submissionSchemas.builder.parse(body.value);
      saved = await deps.repository!.persistAtomic(
        { kind, payload },
        { roadmap: generateRoadmap(payload.data) },
      );
    } else if (kind === "blueprint") {
      saved = await deps.repository!.persistAtomic(
        { kind, payload: submissionSchemas.blueprint.parse(body.value) },
        {},
      );
    } else {
      saved = await deps.repository!.persistAtomic(
        { kind, payload: submissionSchemas.general.parse(body.value) },
        {},
      );
    }
    if (saved.status === "conflict")
      return reply(409, {
        status: "conflict",
        message:
          "This request was already used for different information. Start a new submission.",
      });
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        saved.receiptId,
      )
    )
      throw new Error("Missing persisted receipt");
    return reply(202, { status: "accepted", receiptId: saved.receiptId });
  } catch {
    return reply(503, {
      status: "unavailable",
      message:
        "Delivery is unavailable. No receipt was confirmed. Keep your draft and retry with the same request key when service returns.",
    });
  }
}
