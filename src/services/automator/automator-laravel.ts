import { ProjectType } from '../../interfaces/project-type.ts';
import Automator from './automator.ts';
import type AutomatorI from '../../interfaces/automator-interface.ts';

export default class AutomatorLaravel extends Automator implements AutomatorI {
  override projectType = ProjectType.Laravel;
}
