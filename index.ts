#!/usr/bin/env node

import App from "./src/app.ts";

const app = new App();

const args = Deno.args;

if (args.length === 0) {
  await app.showHelpDocs();
  Deno.exit(1);
}

app.processArg(args);