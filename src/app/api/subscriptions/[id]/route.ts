import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/subscriptions/service";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const sub = await service.getSubscription(id);
  return httpJson(sub);
});
