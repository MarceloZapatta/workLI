import AutomatorNotDefined from '../../exceptions/automator-not-defined.ts';
import type Automator from '../../interfaces/automator-interface.ts';
import { ProjectType } from '../../interfaces/project-type.ts';
import AutomatorLaravel from './automator-laravel.ts';

export default class AutomatorFactory {
  static make(projectType: ProjectType): Automator {
    switch (projectType) {
      case ProjectType.Laravel:
        return new AutomatorLaravel();
      default:
        throw new AutomatorNotDefined(projectType);
    }
  }
}
