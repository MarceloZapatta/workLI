import { green, red } from "https://deno.land/std@0.205.0/fmt/colors.ts";
import { folderExists } from "../helpers/helpers.ts";
import EnviromentService from "./enviroment-service.ts";

export default class ProjectService {
  enviromentService: EnviromentService;
  projectFolder?: string;

  constructor () {
    this.enviromentService = new EnviromentService();
  }

  /**
   * Create a new .env enviroment file at the env folders
   */
  public async createNewProject(name: string) {
    await this.createProjectFolder(name);
    this.createRunFile(name);

    console.log(`${green('Project succesfully created!')}`);

    return this.projectFolder;
  }

  /**
   * Create if not exists the project folder
   */
  private async createProjectFolder(name: string): Promise<boolean> {
    const projectFolder = `./enviroments/${this.enviromentService.getCurrentEnviroment()}/${name}`;

    if (await folderExists(projectFolder)) {
      console.error(`Project [${red(name)}] already exists!`);
      return Deno.exit(0)
    }
    
    await Deno.mkdir(projectFolder);

    this.projectFolder = projectFolder;

    return true;
  }

  /**
   * Create if not exists the project folder
   */
  private createRunFile(name: string): boolean {
    const filePath = `./enviroments/${this.enviromentService.getCurrentEnviroment()}/${name}/run.sh`;
    let templateBash = '#!/usr/bin/env bash\n';
    templateBash += '# This is the run file for your project\n';
    templateBash += '# Please include any scripts you use to run your project\n';

    Deno.writeTextFileSync(filePath, templateBash);
    Deno.chmodSync(filePath, 0o755);
    return true;
  }

  run(name: string) {
    const filePath = `./enviroments/${this.enviromentService.getCurrentEnviroment()}/${name}/run.sh`;

    console.log('to aqqq');

    const command = new Deno.Command('bash', {
      args: [
        filePath
      ],
    });

    const child = command.spawn();

    // open a file and pipe the subprocess output to it.
    child.stdout.pipeTo(
      Deno.openSync("output", { write: true, create: true }).writable,
    );

    // manually close stdin
    child.stdin.close();
  }
}
