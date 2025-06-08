import { green, red } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { folderExists, fileExists, updateEnvFile } from '../helpers/helpers.ts';
import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts';
import EnvironmentNotFound from '../exceptions/environment-not-found.ts';

export default class EnvironmentService {
  /**
   * Create a new .env environment file at the environments folders
   */
  public async createNewEnvironment(name: string) {
    await this.createEnvironmentsFolder();
    await this.createEnvironmentFolder(name);
    await this.createEnvironmentFile(name);

    const envPath = './environments/.env';
    const env = config({ path: envPath });

    if (!env.CURRENT_ENVIROMENT) {
      await this.setCurrentEnvironment(name);
    }

    console.log(`${green('Environment succesfully created!')}`);
  }

  /**
   * Set the current active environment
   */
  public async setCurrentEnvironment(name: string) {
    if (!(await folderExists(`./environments/${name}`))) {
      console.error(`Environment ${red(name)} was not found!`);
      Deno.exit(0);
    }

    const envPath = './environments/.env';
    const env = config({ path: envPath });

    env.CURRENT_ENVIROMENT = name;

    await updateEnvFile(envPath, env);
    console.log(`Current environment updated: (${green(name)})`);
  }

  /**
   * Get current active environment
   */
  public getCurrentEnvironment(): string {
    const envPath = './environments/.env';
    const env = config({ path: envPath });

    if (!env.CURRENT_ENVIROMENT) {
      throw new EnvironmentNotFound();
    }

    return env.CURRENT_ENVIROMENT;
  }

  /**
   * Create if not exists the environment folder
   */
  private async createEnvironmentsFolder(): Promise<boolean> {
    if (!(await folderExists('environments'))) {
      Deno.mkdirSync('./environments');
    }

    if (!(await fileExists('./environments/.env'))) {
      Deno.writeTextFile('./environments/.env', 'CURRENT_ENVIROMENT=');
    }

    return true;
  }

  /**
   * Create if not exists the environment folder
   */
  private async createEnvironmentFolder(name: string): Promise<boolean> {
    if (!(await folderExists(`./environments/${name}`))) {
      await Deno.mkdir(`./environments/${name}`);
    }

    return true;
  }

  /**
   * Create env file if not exists
   */
  private async createEnvironmentFile(name: string): Promise<boolean> {
    const filePath = `./environments/${name}/.env`;

    if (await fileExists(filePath)) {
      console.error(`Environment ${red(name)} already exists!`);
      return Deno.exit(0);
    }

    const envContent = `ENV_NAME=${name}`;

    try {
      await Deno.writeTextFile(`./${filePath}`, envContent);
    } catch (_error) {
      console.error('Error creating environment config file');
    }

    return true;
  }

  /**
   * List all available environments
   */
  public async listEnvironments(): Promise<void> {
    try {
      const entries = Deno.readDir('./environments');
      const environments: string[] = [];
      const currentEnv = this.getCurrentEnvironment();

      for await (const entry of entries) {
        if (entry.isDirectory && entry.name !== '.git') {
          environments.push(entry.name);
        }
      }

      if (environments.length === 0) {
        console.log('No environments found.');
        return;
      }

      console.log('\nAvailable environments:');
      environments.forEach((env) => {
        const isCurrent = env === currentEnv;
        const prefix = isCurrent ? '→ ' : '  ';
        const name = isCurrent ? green(env) : env;
        console.log(`${prefix}${name}`);
      });
      console.log(''); // Add empty line for better readability
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error listing environments:', error.message);
      } else {
        console.error('An unknown error occurred while listing environments');
      }
    }
  }
}
