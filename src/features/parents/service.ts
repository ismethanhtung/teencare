import { AppError } from "@/lib/errors";
import * as repo from "./repository";
import * as studentsRepo from "@/features/students/repository";
import type { Parent, ParentCreateInput, ParentUpdateInput } from "./schema";
import type { Student } from "@/features/students/schema";

export async function createParent(input: ParentCreateInput): Promise<Parent> {
    return repo.createParent(input);
}

export async function updateParent(
    id: string,
    patch: ParentUpdateInput,
): Promise<Parent> {
    const updated = await repo.updateParent(id, patch);
    if (!updated) throw new AppError("PARENT_NOT_FOUND", 404);
    return updated;
}

export async function getParentDetail(
    id: string,
): Promise<Parent & { students: Student[] }> {
    const parent = await repo.findParentById(id);
    if (!parent) throw new AppError("PARENT_NOT_FOUND", 404);
    const students = await studentsRepo.listStudentsByParent(id);
    return { ...parent, students };
}

export async function listParents(): Promise<Parent[]> {
    return repo.listParents();
}
