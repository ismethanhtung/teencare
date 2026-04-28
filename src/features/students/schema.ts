import { z } from "zod";

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const StudentCreateSchema = z.object({
    name: z.string().min(1).max(120),
    dob: dateOnly,
    gender: z.enum(["male", "female", "other"]),
    currentGrade: z.string().min(1).max(20),
    parentId: z.string().min(1),
});

export const StudentUpdateSchema = z
    .object({
        name: z.string().min(1).max(120).optional(),
        dob: dateOnly.optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        currentGrade: z.string().min(1).max(20).optional(),
        parentId: z.string().min(1).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
        message: "Empty update payload",
    });

export type StudentCreateInput = z.infer<typeof StudentCreateSchema>;
export type StudentUpdateInput = z.infer<typeof StudentUpdateSchema>;

export type Student = {
    id: string;
    name: string;
    dob: string;
    gender: "male" | "female" | "other";
    currentGrade: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
};
