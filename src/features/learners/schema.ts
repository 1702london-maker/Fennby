import { z } from "zod";

export const createLearnerSchema = z.object({
  firstName: z.string().min(1),
  preferredName: z.string().min(1),
  dateOfBirth: z.string().refine((v) => {
    const age = (Date.now() - new Date(v).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 4 && age <= 19;
  }, "Learner age must be between 4 and 19"),
  yearGroup: z.string().min(1),
  currentSchool: z.string().optional(),
  targetExam: z.string().optional(),
  targetSchool: z.string().optional(),
  examBoard: z.string().optional(),
  learningGoals: z.string().optional(),
  sendNotes: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  consent: z.literal(true, { message: "Consent is required" }),
});
export type CreateLearnerInput = z.infer<typeof createLearnerSchema>;
