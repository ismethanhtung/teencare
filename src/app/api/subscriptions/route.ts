import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import { SubscriptionCreateSchema } from "@/features/subscriptions/schema";
import * as service from "@/features/subscriptions/service";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = SubscriptionCreateSchema.parse(await req.json());
  const created = await service.createSubscription(body);
  return httpJson(created, 201);
});

export const GET = withErrorHandler(async () => {
  const data = await service.listSubscriptions();
  return httpJson({ data });
});
