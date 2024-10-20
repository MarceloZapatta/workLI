import { green, brightYellow, red } from "https://deno.land/std@0.205.0/fmt/colors.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

export async function helpDocumentation() {
  console.log(`worKLI ${await getCurrentVersion()}`);
  console.log('What you want to do?');
  console.log(brightYellow('help'));
  console.log(` ${green('help')} shows this worKLI helper`);
  console.log(brightYellow('make'));
  console.log(` ${green('make:enviroment')} creates a new enviroment`);
  console.log(` ${green('make:project')} creates a new project`);
  console.log(brightYellow('enviroment'));
  console.log(` ${green('enviroment:activate')} set default enviroment`);
}

async function getCurrentVersion() {
  const packageJson = await Deno.readTextFile("./deno.json");
  const parsed = JSON.parse(packageJson);
  return parsed.version;
}

export function currentEnviroment() {
  const env = config({path: './enviroments/.env'});
  
  if (!env.CURRENT_ENVIROMENT) {
    return console.log(`Current enviroment: (${red('No enviroment actived')})`);
  }

  console.log(`Current enviroment: (${green(env.CURRENT_ENVIROMENT || '')})`);
}
