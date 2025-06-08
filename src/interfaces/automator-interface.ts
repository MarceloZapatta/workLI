import type ProjectService from "../services/project-service.ts";
import type { ProjectType } from "./project-type.ts";

export default interface Automator {
  /**
   * Start's the automator process
   */
  run(): void;

  /**
   * Creates the project folder
   */
  createProject(): void;

  /**
   * Copy default template files
   */
  copyTemplateFiles(): void;

  /**
   * Checks if the required vars have values
   */
  checkRequiredVars(): void;

  /**
   * Checks if the project type is filled
   */
  checkProjectType(): void;

  /**
   * Checks if the project name is filled
   */
  checkProjectName(): void;
}
