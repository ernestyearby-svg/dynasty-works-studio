import { handleSubmission } from "@/server/submission-handler";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  if (kind !== "general" && kind !== "builder" && kind !== "blueprint")
    return Response.json(
      { status: "rejected", message: "Unknown submission type." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  return handleSubmission(request, kind);
}
