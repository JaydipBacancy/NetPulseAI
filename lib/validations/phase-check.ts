import { z } from "zod";

export const phaseCheckSchema = z.object({
  operatorName: z
    .string()
    .trim()
    .min(2, "Enter an operator or team name."),
  contactEmail: z
    .string()
    .trim()
    .email("Enter a valid email address."),
  targetNode: z
    .string()
    .trim()
    .min(3, "Enter a node label or site code."),
});

export type PhaseCheckInput = z.infer<typeof phaseCheckSchema>;
