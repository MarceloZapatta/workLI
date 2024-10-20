import { green, red } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { folderExists, fileExists, updateEnvFile } from '../helpers/helpers.ts';
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import EnviromentNotFound from '../exceptions/enviroment-not-found.ts';

export default class EnviromentService {
  /**
   * Create a new .env enviroment file at the enviroments folders
   */
  public async createNewEnviroment(name: string) {
    await this.createEnviromentsFolder();
    await this.createEnviromentFolder(name);
    await this.createEnviromentFile(name);

    const envPath = './enviroments/.env';
    const env = config({ path: envPath });

    if (!env.CURRENT_ENVIROMENT) {
      await this.setCurrentEnviroment(name);
    }

    console.log(`${green('Enviroment succesfully created!')}`);
  }

  /**
   * Set the current active enviroment
   */
  public async setCurrentEnviroment(name: string) {
    if (!(await folderExists(`./enviroments/${name}`))) {
      console.error(`Enviroment ${red(name)} was not found!`);
      Deno.exit(0);
    }

    const envPath = './enviroments/.env';
    const env = config({ path: envPath });

    env.CURRENT_ENVIROMENT = name;

    await updateEnvFile(envPath, env);
    console.log(`Current enviroment updated: (${green(name)})`);
  }

  /**
   * Get current active enviroment
   */
  public getCurrentEnviroment(): string {
    const envPath = './enviroments/.env';
    const env = config({ path: envPath });

    if (!env.CURRENT_ENVIROMENT) {
      throw new EnviromentNotFound();
    }

    return env.CURRENT_ENVIROMENT;
  }

  /**
   * Create if not exists the enviroment folder
   */
  private async createEnviromentsFolder(): Promise<boolean> {
    if (!(await folderExists('enviroments'))) {
      Deno.mkdirSync('./enviroments');
    }

    if (!(await fileExists('./enviroments/.env'))) {
      Deno.writeTextFile('./enviroments/.env', 'CURRENT_ENVIROMENT=');
    }

    return true;
  }

  /**
   * Create if not exists the enviroment folder
   */
  private async createEnviromentFolder(name: string): Promise<boolean> {
    if (!(await folderExists(`./enviroments/${name}`))) {
      await Deno.mkdir(`./enviroments/${name}`);
    }

    return true;
  }

  /**
   * Create env file if not exists
   */
  private async createEnviromentFile(name: string): Promise<boolean> {
    const filePath = `./enviroments/${name}/.env`;

    if (await fileExists(filePath)) {
      console.error(`Enviroment ${red(name)} already exists!`);
      return Deno.exit(0);
    }

    const envContent = `ENV_NAME=${name}`;

    try {
      await Deno.writeTextFile(`./${filePath}`, envContent);
    } catch (_error) {
      console.error('Error creating enviroment config file');
    }

    return true;
  }
}
