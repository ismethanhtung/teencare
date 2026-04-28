import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/parents/service";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const parent = await service.getParentDetail(id);
  return httpJson(parent);
});
