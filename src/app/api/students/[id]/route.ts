import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/students/service";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const student = await service.getStudentDetail(id);
  return httpJson(student);
});
