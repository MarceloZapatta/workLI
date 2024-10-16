import { green } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { currentEnviroment, helpDocumentation } from './help-documentation.ts';
import EnviromentService from './services/enviroment-service.ts';
import EnviromentNotFound from './exceptions/enviroment-not-found.ts';
import ProjectService from './services/project-service.ts';
import AutomatorService from "./services/automator-service.ts";

export default class App {
  enviromentService: EnviromentService;
  projectService: ProjectService;
  automatorService: AutomatorService;

  constructor() {
    this.enviromentService = new EnviromentService();
    this.projectService = new ProjectService();
    this.automatorService = new AutomatorService();
  }

  async showHelpDocs() {
    await helpDocumentation();
  }

  showCurrentEviroment() {
    currentEnviroment();
  }

  async processArg(args: string[]) {
    this.showCurrentEviroment();

    const arg = args[0];

    try {
      switch (arg) {
        case 'run':
        case 'project:run':
          await this.projectService.run(args[1]);
          break;
        case 'make:enviroment':
          await this.enviromentService.createNewEnviroment(args[1]);
          break;
        case 'make:project':
          await this.projectService.createNewProject(args[1]);
          break;
        case 'enviroment:activate':
          await this.enviromentService.setCurrentEnviroment(args[1]);
          break;
        case 'automator:test':
          await this.automatorService.index();
          break;
        default:
          this.showCommandNotFound(arg);
          break;
      }
    } catch (error) {
      if (error instanceof EnviromentNotFound) {
        console.error('No enviroment is active.');
        return Deno.exit(0);
      }

      throw error;
    }
  }

  private showCommandNotFound(arg: string) {
    console.log(`The command ${green(arg)} was not found.`);
  }
}
