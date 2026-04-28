import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, type ErrorCode } from "./errors";

export function httpJson<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function httpError(
  code: ErrorCode,
  status: number,
  message?: string,
  details?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { error: { code, message: message ?? code, details } },
    { status },
  );
}

/**
 * Wrap a route handler to translate AppError / ZodError to consistent JSON responses.
 */
export function withErrorHandler<TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<NextResponse>,
): (...args: TArgs) => Promise<NextResponse> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ZodError) {
        return httpError("VALIDATION_ERROR", 400, "Invalid request body", {
          issues: err.issues.map((i) => ({ path: i.path, message: i.message })),
        });
      }
      if (err instanceof AppError) {
        return httpError(err.code, err.status, err.message, err.details);
      }
      console.error("[unhandled]", err);
      return NextResponse.json(
        { error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } },
        { status: 500 },
      );
    }
  };
}
