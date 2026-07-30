import { NextResponse } from "next/server";

export function serverErrorResponse(scope: string): NextResponse {
  const correlationId = crypto.randomUUID();
  console.error(`[${correlationId}] ${scope} failed.`);

  return NextResponse.json(
    {
      error: "Internal server error",
      correlationId,
    },
    { status: 500 }
  );
}
