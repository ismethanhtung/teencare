import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import { RegistrationCreateSchema } from "@/features/registrations/schema";
import * as service from "@/features/registrations/service";

type RouteCtx = { params: Promise<{ id: string }> };

export const POST = withErrorHandler(async (req: NextRequest, ctx: RouteCtx) => {
  const { id: classId } = await ctx.params;
  const body = RegistrationCreateSchema.parse(await req.json());
  const reg = await service.registerStudentToClass({ classId, ...body });
  return httpJson(reg, 201);
});
