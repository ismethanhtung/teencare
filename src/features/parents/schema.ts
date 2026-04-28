import { z } from "zod";

export const ParentCreateSchema = z.object({
    name: z.string().min(1).max(120),
    phone: z.string().min(6).max(20),
    email: z.string().email().optional(),
});

export const ParentUpdateSchema = z
    .object({
        name: z.string().min(1).max(120).optional(),
        phone: z.string().min(6).max(20).optional(),
        email: z.string().email().nullable().optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
        message: "Empty update payload",
    });

export type ParentCreateInput = z.infer<typeof ParentCreateSchema>;
export type ParentUpdateInput = z.infer<typeof ParentUpdateSchema>;

export type Parent = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
};
