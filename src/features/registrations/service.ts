import { AppError } from "@/lib/errors";
import { hoursUntil, nextSessionDateTime, timeRangesOverlap } from "@/lib/time";
import * as repo from "./repository";
import * as classesRepo from "@/features/classes/repository";
import * as studentsRepo from "@/features/students/repository";
import * as subsRepo from "@/features/subscriptions/repository";
import type { Registration } from "./schema";

export async function registerStudentToClass(input: {
  classId: string;
  studentId: string;
  subscriptionId: string;
}): Promise<Registration> {
  // 1. Existence
  const klass = await classesRepo.findClassById(input.classId);
  if (!klass) throw new AppError("CLASS_NOT_FOUND", 404);
  const student = await studentsRepo.findStudentById(input.studentId);
  if (!student) throw new AppError("STUDENT_NOT_FOUND", 404);
  const sub = await subsRepo.findSubscriptionById(input.subscriptionId);
  if (!sub) throw new AppError("SUBSCRIPTION_NOT_FOUND", 404);

  // 2. Subscription belongs to student
  if (sub.studentId !== input.studentId) {
    throw new AppError("SUBSCRIPTION_STUDENT_MISMATCH", 400, "Subscription does not belong to student");
  }

  // 3. Subscription valid (uses computed isActive: in-range + remaining > 0)
  if (sub.remainingSessions <= 0) {
    throw new AppError("SUBSCRIPTION_EXHAUSTED", 409, "Subscription has no remaining sessions");
  }
  if (!sub.isActive) {
    throw new AppError("SUBSCRIPTION_EXPIRED", 409, "Subscription not in active date range");
  }

  // 4. Capacity
  const count = await classesRepo.countActiveRegistrations(input.classId);
  if (count >= klass.maxStudents) {
    throw new AppError("CLASS_FULL", 409, "Class has reached max students");
  }

  // 5. Schedule conflict
  const studentRegs = await repo.listActiveByStudent(input.studentId);
  if (studentRegs.length > 0) {
    const otherClasses = await Promise.all(
      studentRegs.map((r) => classesRepo.findClassById(r.classId)),
    );
    const conflict = otherClasses.find(
      (c) => c && c.dayOfWeek === klass.dayOfWeek && timeRangesOverlap(c.timeSlot, klass.timeSlot),
    );
    if (conflict) {
      throw new AppError("SCHEDULE_CONFLICT", 409, "Student has overlapping class on same day", {
        conflictingClassId: conflict.id,
      });
    }
  }

  // 6. Insert (unique partial index protects against double-register race)
  return repo.createRegistration(input);
}

export async function cancelRegistration(id: string, now: Date = new Date()): Promise<Registration> {
  const reg = await repo.findRegistrationById(id);
  if (!reg) throw new AppError("REGISTRATION_NOT_FOUND", 404);
  if (reg.status !== "active") throw new AppError("ALREADY_CANCELLED", 409);

  const klass = await classesRepo.findClassById(reg.classId);
  if (!klass) throw new AppError("CLASS_NOT_FOUND", 404);

  const next = nextSessionDateTime(klass.dayOfWeek, klass.timeSlot.start, now);
  const refund = hoursUntil(next, now) >= 24;

  if (refund) {
    const sub = await subsRepo.findSubscriptionById(reg.subscriptionId);
    if (sub && sub.usedSessions > 0) {
      await subsRepo.incrementUsedSessions(reg.subscriptionId, -1);
    }
  }
  const cancelled = await repo.markCancelled(id, refund);
  if (!cancelled) throw new AppError("ALREADY_CANCELLED", 409);
  return cancelled;
}

export async function listActiveRegistrations(): Promise<Registration[]> {
  return repo.listAllActive();
}
