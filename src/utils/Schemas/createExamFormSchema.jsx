import { z } from "zod";

const examMetadataSchema = z.object({
  examTitle: z
    .string()
    .min(1, "Exam title is required")
    .max(100, "Title too long"),
  subtitle: z.string().optional().or(z.literal("")),
  instructions: z.string().min(1, "Instructions are required"),
  examDate: z.coerce.date({
    required_error: "Exam date is required",
    invalid_type_error: "Invalid date format",
  }),
  duration: z.number().min(30, "Duration must be at least 30 minutes"),
  examType: z.enum(["Single Subject", "Multi Subject"], {
    errorMap: () => ({ message: "Please select exam type" }),
  }),
  examMode: z.enum(["Online", "Offline"], {
    errorMap: () => ({ message: "Please select exam mode" }),
  }),
  examCategory: z.enum(["NEET-UG", "JEE-MAINS", "Custom"], {
    errorMap: () => ({ message: "Please select exam category" }),
  }),
});

const participantsSchema = z.object({
  selectedGroups: z
    .array(z.string())
    .min(1, "At least one group must be selected"),
});

// Updated schema to handle question types (MCQ, Assertion & Reason, Numerical)
const questionTypeCountSchema = z.object({
  mcq: z
    .number()
    .min(0, "MCQ count must be 0 or greater")
    .optional()
    .default(0),
  assertionReason: z
    .number()
    .min(0, "Assertion & Reason count must be 0 or greater")
    .optional()
    .default(0),
  numerical: z
    .number()
    .min(0, "Numerical count must be 0 or greater")
    .optional()
    .default(0),
});

const questionsSetupSchema = z.object({
  selectedSubjects: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
  selectedChapters: z
    .array(z.string())
    .min(1, "At least one chapter must be selected"),
  selectedTopics: z.array(z.string()).optional(),
  topicQuestionCounts: z
    .record(z.string(), questionTypeCountSchema)
    .optional()
    .refine((data) => {
      if (!data) return false;

      // Check if at least one topic has at least one question
      const hasQuestions = Object.values(data).some((counts) => {
        return (
          (counts.mcq || 0) +
            (counts.assertionReason || 0) +
            (counts.numerical || 0) >
          0
        );
      });

      return hasQuestions;
    }, "At least one topic must have questions selected"),
});

const marksGradingSchema = z.object({
  totalQuestions: z.number().min(1, "Must have at least one question"),
  totalMarks: z.number().min(1, "Must have at least one mark"),
});

const finalizeSchema = z.object({
  confirmed: z
    .boolean()
    .refine((val) => val === true, "Please confirm to create the exam"),
});

const completeFormSchema = z.object({
  ...examMetadataSchema.shape,
  ...participantsSchema.shape,
  ...questionsSetupSchema.shape,
  ...marksGradingSchema.shape,
  ...finalizeSchema.shape,
});

export {
  completeFormSchema,
  examMetadataSchema,
  participantsSchema,
  questionsSetupSchema,
  marksGradingSchema,
  finalizeSchema,
  questionTypeCountSchema,
};
