import { green, red } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { folderExists } from '../helpers/helpers.ts';
import EnvironmentService from './environment-service.ts';

export default class ProjectService {
  environmentService: EnvironmentService;
  projectFolder?: string;

  constructor() {
    this.environmentService = new EnvironmentService();
  }

  /**
   * Create a new .env environment file at the env folders
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
    const projectFolder = `./environments/${this.environmentService.getCurrentEnvironment()}/${name}`;

    if (await folderExists(projectFolder)) {
      console.error(`Project [${red(name)}] already exists!`);
      return Deno.exit(0);
    }

    await Deno.mkdir(projectFolder);

    this.projectFolder = projectFolder;

    return true;
  }

  /**
   * Create if not exists the project folder
   */
  private createRunFile(name: string): boolean {
    const filePath = `./environments/${this.environmentService.getCurrentEnvironment()}/${name}/run.sh`;
    let templateBash = '#!/usr/bin/env bash\n';
    templateBash += '# This is the run file for your project\n';
    templateBash +=
      '# Please include any scripts you use to run your project\n';

    Deno.writeTextFileSync(filePath, templateBash);
    Deno.chmodSync(filePath, 0o755);
    return true;
  }

  run(name: string) {
    const filePath = `./environments/${this.environmentService.getCurrentEnvironment()}/${name}/run.sh`;

    const command = new Deno.Command('bash', {
      args: [filePath],
    });

    const child = command.spawn();

    // open a file and pipe the subprocess output to it.
    child.stdout.pipeTo(
      Deno.openSync('output', { write: true, create: true }).writable
    );

    // manually close stdin
    child.stdin.close();
  }

  /**
   * List all projects in the current environment and output them as a formatted text list
   * @returns Array of project names
   */
  public async listProjects(): Promise<string[]> {
    const envPath = `./environments/${this.environmentService.getCurrentEnvironment()}`;

    try {
      const entries = await Deno.readDir(envPath);
      const projects: string[] = [];

      for await (const entry of entries) {
        if (entry.isDirectory) {
          projects.push(entry.name);
        }
      }

      const sortedProjects = projects.sort();

      if (sortedProjects.length === 0) {
        console.log(`${red('No projects found in current environment.')}`);
      } else {
        console.log('\nAvailable projects:');
        console.log('------------------');
        sortedProjects.forEach((project, index) => {
          console.log(`${index + 1}. ${project}`);
        });
        console.log('------------------\n');
      }

      return sortedProjects;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.log(`${red('No projects found in current environment.')}`);
        return [];
      }
      throw error;
    }
  }
}
