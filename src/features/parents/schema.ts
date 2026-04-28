import { z } from "zod";

export const ParentCreateSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional(),
});

export type ParentCreateInput = z.infer<typeof ParentCreateSchema>;

export type Parent = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
};
