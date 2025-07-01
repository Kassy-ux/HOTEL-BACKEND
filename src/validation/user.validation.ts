import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export const PartialUserSchema = UserSchema.partial();

export type UserInput = z.infer<typeof UserSchema>;
export type PartialUserInput = z.infer<typeof PartialUserSchema>;
