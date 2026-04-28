import * as repo from "./repository";
import type { ClassCreateInput, ClassEntity, ClassWithCount } from "./schema";

export async function createClass(input: ClassCreateInput): Promise<ClassEntity> {
  return repo.createClass(input);
}

export async function listClasses(day?: number): Promise<ClassWithCount[]> {
  return repo.listClasses(day !== undefined ? { day } : {});
}
