import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import * as service from "@/features/students/service";
import { StudentUpdateSchema } from "@/features/students/schema";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = withErrorHandler(async (_req: Request, ctx: RouteCtx) => {
    const { id } = await ctx.params;
    const student = await service.getStudentDetail(id);
    return httpJson(student);
});

export const PATCH = withErrorHandler(
    async (req: NextRequest, ctx: RouteCtx) => {
        const { id } = await ctx.params;
        const body = StudentUpdateSchema.parse(await req.json());
        const updated = await service.updateStudent(id, body);
        return httpJson(updated);
    },
);
