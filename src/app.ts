import { green } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import {
  currentEnvironment,
  helpDocumentation,
} from '../help-documentation.ts';
import EnvironmentService from './services/environment-service.ts';
import EnvironmentNotFound from './exceptions/environment-not-found.ts';
import ProjectService from './services/project-service.ts';
import AutomatorService from './services/automator-service.ts';

export default class App {
  environmentService: EnvironmentService;
  projectService: ProjectService;
  automatorService: AutomatorService;

  constructor() {
    this.environmentService = new EnvironmentService();
    this.projectService = new ProjectService();
    this.automatorService = new AutomatorService();
  }

  async showHelpDocs() {
    await helpDocumentation();
  }

  showCurrentEviroment() {
    currentEnvironment();
  }

  async processArg(args: string[]) {
    this.showCurrentEviroment();

    const arg = args[0];

    try {
      switch (arg) {
        case 'make':
          await this.automatorService.index();
          break;
        case 'run':
        case 'project:run':
          this.projectService.run(args[1]);
          break;
        case 'make:environment':
          await this.environmentService.createNewEnvironment(args[1]);
          break;
        case 'make:project':
          await this.projectService.createNewProject(args[1]);
          break;
        case 'environment:activate':
          await this.environmentService.setCurrentEnvironment(args[1]);
          break;
        case 'environment:list':
          await this.environmentService.listEnvironments();
          break;
        case 'project:list':
          await this.projectService.listProjects();
          break;
        case 'help':
          this.showHelpDocs();
          break;
        default:
          this.showCommandNotFound(arg);
          break;
      }
    } catch (error) {
      if (error instanceof EnvironmentNotFound) {
        console.error('No environment is active.');
        return Deno.exit(0);
      }

      throw error;
    }
  }

  private showCommandNotFound(arg: string) {
    console.log(`The command ${green(arg)} was not found.`);
  }
}
