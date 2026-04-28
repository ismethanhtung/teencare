import type { NextRequest } from "next/server";
import { httpJson, withErrorHandler } from "@/lib/http";
import { StudentCreateSchema } from "@/features/students/schema";
import * as service from "@/features/students/service";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = StudentCreateSchema.parse(await req.json());
  const student = await service.createStudent(body);
  return httpJson(student, 201);
});

export const GET = withErrorHandler(async () => {
  const students = await service.listStudents();
  return httpJson({ data: students });
});
