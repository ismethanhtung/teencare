import { AppError } from "@/lib/errors";
import * as repo from "./repository";
import * as parentsRepo from "@/features/parents/repository";
import type { Student, StudentCreateInput } from "./schema";
import type { Parent } from "@/features/parents/schema";

export async function createStudent(input: StudentCreateInput): Promise<Student> {
  const parent = await parentsRepo.findParentById(input.parentId);
  if (!parent) throw new AppError("PARENT_NOT_FOUND", 404);
  return repo.createStudent(input);
}

export async function getStudentDetail(
  id: string,
): Promise<Student & { parent: Parent }> {
  const student = await repo.findStudentById(id);
  if (!student) throw new AppError("STUDENT_NOT_FOUND", 404);
  const parent = await parentsRepo.findParentById(student.parentId);
  if (!parent) throw new AppError("PARENT_NOT_FOUND", 404);
  return { ...student, parent };
}

export async function listStudents(): Promise<Student[]> {
  return repo.listStudents();
}
