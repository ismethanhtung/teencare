import { z } from "zod";

const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:mm");

export const TimeSlotSchema = z
  .object({ start: hhmm, end: hhmm })
  .refine((v) => v.start < v.end, { message: "timeSlot.end must be after start" });

export const ClassCreateSchema = z.object({
  name: z.string().min(1).max(120),
  subject: z.string().min(1).max(80),
  dayOfWeek: z.number().int().min(0).max(6),
  timeSlot: TimeSlotSchema,
  teacherName: z.string().min(1).max(80),
  maxStudents: z.number().int().min(1).max(500),
});

export type ClassCreateInput = z.infer<typeof ClassCreateSchema>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>;

export type ClassEntity = {
  id: string;
  name: string;
  subject: string;
  dayOfWeek: number;
  timeSlot: TimeSlot;
  teacherName: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
};

export type ClassWithCount = ClassEntity & { registeredCount: number };
