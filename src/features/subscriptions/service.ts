import { AppError } from "@/lib/errors";
import { todayInAppTz, isWithinDateRange } from "@/lib/time";
import * as repo from "./repository";
import * as studentsRepo from "@/features/students/repository";
import type { Subscription, SubscriptionCreateInput } from "./schema";

export async function createSubscription(
  input: SubscriptionCreateInput,
): Promise<Subscription> {
  const student = await studentsRepo.findStudentById(input.studentId);
  if (!student) throw new AppError("STUDENT_NOT_FOUND", 404);
  return repo.createSubscription(input);
}

export async function getSubscription(id: string): Promise<Subscription> {
  const sub = await repo.findSubscriptionById(id);
  if (!sub) throw new AppError("SUBSCRIPTION_NOT_FOUND", 404);
  return sub;
}

export async function useOneSession(id: string): Promise<Subscription> {
  const sub = await repo.findSubscriptionById(id);
  if (!sub) throw new AppError("SUBSCRIPTION_NOT_FOUND", 404);
  const today = todayInAppTz();
  if (!isWithinDateRange(today, sub.startDate, sub.endDate)) {
    throw new AppError("SUBSCRIPTION_EXPIRED", 409, "Subscription not in active date range");
  }
  if (sub.usedSessions >= sub.totalSessions) {
    throw new AppError("SUBSCRIPTION_EXHAUSTED", 409, "All sessions used");
  }
  const updated = await repo.incrementUsedSessions(id, 1);
  if (!updated) throw new AppError("SUBSCRIPTION_NOT_FOUND", 404);
  return updated;
}

export async function listSubscriptions(): Promise<Subscription[]> {
  return repo.listSubscriptions();
}
