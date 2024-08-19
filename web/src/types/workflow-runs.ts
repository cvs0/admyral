import z from "zod";
import { withCamelCaseTransform } from "./utils";
import { Json } from "./json";

export const WorkflowRunMetadata = withCamelCaseTransform(
	z.object({
		run_id: z.string(),
		created_at: z.string(),
	}),
);
export type TWorkflowRunMetadata = z.infer<typeof WorkflowRunMetadata>;

export const WorkflowRunStepMetadata = withCamelCaseTransform(
	z.object({
		step_id: z.string(),
		action_type: z.string(),
	}),
);
export type TWorkflowRunStepMetadata = z.infer<typeof WorkflowRunStepMetadata>;

export const WorkflowRunStep = withCamelCaseTransform(
	z.object({
		step_id: z.string(),
		action_type: z.string(),
		prev_step_id: z.string().nullable(),
		logs: z.string().nullable(),
		result: Json.nullable(),
		input_args: Json.nullable(),
	}),
);
export type TWorkflowRunStep = z.infer<typeof WorkflowRunStep>;