import {
  green,
  brightYellow,
  red,
} from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

export async function helpDocumentation() {
  console.log(`worKLI ${await getCurrentVersion()}`);
  console.log('What you want to do?');
  console.log(brightYellow('help'));
  console.log(` ${green('help')} shows this worKLI helper`);
  console.log(brightYellow('make'));
  console.log(` ${green('make')} assistent for creating a new project`);
  console.log(` ${green('make:project')} creates a new project`);
  console.log(` ${green('make:environment')} creates a new environment`);
  console.log(brightYellow('environment'));
  console.log(` ${green('environment:activate')} set default environment`);
}

async function getCurrentVersion() {
  const packageJson = await Deno.readTextFile('./deno.json');
  const parsed = JSON.parse(packageJson);
  return parsed.version;
}

export function currentEnvironment() {
  const env = config({ path: './environments/.env' });

  if (!env.CURRENT_ENVIROMENT) {
    return console.log(
      `Current environment: (${red('No environment actived')})`
    );
  }

  console.log(`Current environment: (${green(env.CURRENT_ENVIROMENT || '')})`);
}
