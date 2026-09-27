import { inquirySchema } from "@/lib/inquiry";
export async function POST(request: Request) {
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { message: "Request origin is not allowed." },
      { status: 403, headers },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { message: "Expected a JSON request." },
      { status: 415, headers },
    );
  if (Number(request.headers.get("content-length") || 0) > 24000)
    return Response.json(
      { message: "Request is too large." },
      { status: 413, headers },
    );
  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error();
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 24000) {
        await reader.cancel();
        return Response.json(
          { message: "Request is too large." },
          { status: 413, headers },
        );
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    payload = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return Response.json(
      { message: "Invalid request." },
      { status: 400, headers },
    );
  }
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success)
    return Response.json(
      {
        message: "Please check your project details.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422, headers },
    );
  return Response.json(
    {
      status: "not_configured",
      message:
        "Your project has not been submitted. Inquiry delivery is not connected yet. Download your brief to keep a copy.",
    },
    { status: 503, headers },
  );
}
