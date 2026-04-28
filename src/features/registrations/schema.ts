import { z } from "zod";

export const RegistrationCreateSchema = z.object({
  studentId: z.string().min(1),
  subscriptionId: z.string().min(1),
});

export type RegistrationCreateInput = z.infer<typeof RegistrationCreateSchema>;

export type Registration = {
  id: string;
  classId: string;
  studentId: string;
  subscriptionId: string;
  status: "active" | "cancelled";
  cancelledAt?: string;
  refunded?: boolean;
  createdAt: string;
  updatedAt: string;
};
