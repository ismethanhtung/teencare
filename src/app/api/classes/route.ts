import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import { ClassCreateSchema } from "@/features/classes/schema";
import * as service from "@/features/classes/service";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = ClassCreateSchema.parse(await req.json());
  const created = await service.createClass(body);
  return httpJson(created, 201);
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const dayParam = req.nextUrl.searchParams.get("day");
  const day = dayParam !== null ? Number(dayParam) : undefined;
  if (day !== undefined && (Number.isNaN(day) || day < 0 || day > 6)) {
    return httpJson({ error: { code: "VALIDATION_ERROR", message: "day must be 0..6" } }, 400);
  }
  const data = await service.listClasses(day);
  return httpJson({ data });
});
