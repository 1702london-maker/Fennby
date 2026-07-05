import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters"),
  fullName: z.string().min(1, "Full name is required"),
  intendedRole: z.enum(["parent", "tutor", "school_admin"]),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const childLoginSchema = z.object({
  learnerUsername: z.string().min(1),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits"),
});
export type ChildLoginInput = z.infer<typeof childLoginSchema>;

export const createChildLoginSchema = z.object({
  learnerId: z.string().uuid(),
  username: z.string().min(3).max(30),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits"),
});
export type CreateChildLoginInput = z.infer<typeof createChildLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(12, "Password must be at least 12 characters"),
});
