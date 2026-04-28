import { z } from "zod";

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const SubscriptionCreateSchema = z
  .object({
    studentId: z.string().min(1),
    packageName: z.string().min(1).max(120),
    startDate: dateOnly,
    endDate: dateOnly,
    totalSessions: z.number().int().min(1).max(1000),
  })
  .refine((v) => v.endDate >= v.startDate, { message: "endDate must be ≥ startDate" });

export type SubscriptionCreateInput = z.infer<typeof SubscriptionCreateSchema>;

export type Subscription = {
  id: string;
  studentId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
