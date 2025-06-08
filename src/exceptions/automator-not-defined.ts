import type { ProjectType } from '../interfaces/project-type.ts';

export default class AutomatorNotDefined extends Error {
  constructor(
    automatorType: ProjectType,
    message: string = 'The automator type was not defined: '
  ) {
    super(`${message}${automatorType}`);
    this.name = 'AutomatorNotDefined';
  }
}
