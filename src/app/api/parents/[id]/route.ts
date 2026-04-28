import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/parents/service";
import { ParentUpdateSchema } from "@/features/parents/schema";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
    const { id } = await ctx.params;
    const parent = await service.getParentDetail(id);
    return httpJson(parent);
});

export const PATCH = withErrorHandler(
    async (req: NextRequest, ctx: RouteCtx) => {
        const { id } = await ctx.params;
        const body = ParentUpdateSchema.parse(await req.json());
        const updated = await service.updateParent(id, body);
        return httpJson(updated);
    },
);
