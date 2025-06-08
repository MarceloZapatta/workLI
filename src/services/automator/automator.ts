import ProjectTypeNotImplemented from '../../exceptions/project-type-not-implemented.ts';
import ProjectNameNotFound from '../../exceptions/project-name-not-found.ts';
import AutomatorI from '../../interfaces/automator-interface.ts';
import type { ProjectType } from '../../interfaces/project-type.ts';
import ProjectService from '../project-service.ts';

export default class Automator implements AutomatorI {
  protected projectType?: ProjectType;
  private projectName?: string;
  private projectFolder?: string;
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  run() {
    this.createProject();
    this.copyTemplateFiles();
  }

  /**
   * Creates the project folder
   */
  async createProject() {
    this.projectFolder = await this.projectService.createNewProject(
      this.projectName ?? ''
    );
  }

  /**
   * Copy default template files
   */
  copyTemplateFiles() {
    this.checkRequiredVars();

    const templateFolder = `templates/${this.projectType}`;

    for (const file of Deno.readDirSync(templateFolder)) {
      Deno.copyFileSync(
        `${templateFolder}/${file.name}`,
        `${this.projectFolder}/${file.name}`
      );
    }
  }

  /**
   * Checks if the required vars have values
   */
  checkRequiredVars() {
    this.checkProjectType();
    this.checkProjectName();
  }

  /**
   * Checks if the project type is filled
   */
  checkProjectType() {
    if (!this.projectType) {
      throw new ProjectTypeNotImplemented();
    }
  }

  /**
   * Checks if the project name is filled
   */
  checkProjectName() {
    if (!this.projectName) {
      throw new ProjectNameNotFound();
    }
  }
}
