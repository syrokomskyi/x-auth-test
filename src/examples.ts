// <docs-tag name="simple-workflow-example">
import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";

type Env = {};
type Params = {};

// Create your own class that implements a Workflow
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
	// Define a run() method
	async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
		// Define one or more steps that optionally return state.
		const state = step.do("my first step", async () => {
			return [1, 2, 3];
		});

		step.do("my second step", async () => {
			for (const data in state) {
				// Do something with your state
			}
		});
	}
}
// </docs-tag name="simple-workflow-example">
