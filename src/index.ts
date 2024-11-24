import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

import puppeteer, { type BrowserWorker } from "@cloudflare/puppeteer";

type Env = {
  BROWSER: BrowserWorker;
  X_AUTH_TEST: Workflow;
};

// User-defined params passed to your workflow
type Params = {
  email: string;
  metadata: Record<string, string>;
};

const username = "syrokomskyi";
const password = "Visor777@";

export class XAuthTest extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    // Can access bindings on `this.env`
    // Can access params on `event.payload`

    await step.sleep("wait on something", "6 seconds");

    // const { page } = await step.do("Init browser", async () => {
    //   const browser = await chromium.launch();
    //   const context = await browser.newContext();
    //   const page = await context.newPage();

    //   return { page };
    // });

    // step.do("Go to auth X page", async () => {
    //   await page.goto("https://x.com/i/flow/login");

    //   return { page_url: page.url(), page_title: await page.title() };
    // });

    // step.do("Input username", async () => {
    //   await page.fill('input[autocomplete="username"]', username);
    //   await page.click("text=Next");

    //   return { page_url: page.url(), page_title: await page.title() };
    // });

    // step.do("Input password and wait for login", async () => {
    //   await page.fill('input[autocomplete="current-password"]', password);
    //   await page.click("text=Log in");
    //   await page.waitForURL("https://x.com/home");

    //   return { page_url: page.url(), page_title: await page.title() };
    // });

    // step.do("Result", async () => {
    //   return { page_url: page.url(), page_title: await page.title() };
    // });
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    // Get the status of an existing instance, if provided
    const id = url.searchParams.get("id");
    if (id) {
      const instance = await env.X_AUTH_TEST.get(id);
      return Response.json({
        status: await instance.status(),
      });
    }

    // Spawn a new instance and return the ID and status
    const instance = await env.X_AUTH_TEST.create();

    const { searchParams } = new URL(req.url);
    const screenshot = searchParams.get("screenshot");
    if (!screenshot) {
      return new Response(
        "Please add the ?screenshot=https://example.com/ parameter",
      );
    }

    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    await page.goto(screenshot);
    const img = (await page.screenshot()) as Buffer;
    await browser.close();

    return new Response(img, {
      headers: {
        "content-type": "image/jpeg",
      },
    });
  },
};
