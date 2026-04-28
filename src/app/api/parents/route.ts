import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import { ParentCreateSchema } from "@/features/parents/schema";
import * as service from "@/features/parents/service";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = ParentCreateSchema.parse(await req.json());
  const parent = await service.createParent(body);
  return httpJson(parent, 201);
});

export const GET = withErrorHandler(async () => {
  const parents = await service.listParents();
  return httpJson({ data: parents });
});
