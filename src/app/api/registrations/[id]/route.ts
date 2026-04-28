import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/registrations/service";

type RouteCtx = { params: Promise<{ id: string }> };

export const DELETE = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const cancelled = await service.cancelRegistration(id);
  return httpJson(cancelled);
});
