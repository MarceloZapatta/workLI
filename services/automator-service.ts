import { green } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts';
import { fileExists } from '../helpers/helpers.ts';
import { ProjectType } from '../interfaces/project-type.ts';
import AutomatorFactory from "./automator/automator-factory.ts";

export default class AutomatorService {
  public async index() {
    const projectType = await this.detectProject();

    const automator = AutomatorFactory.make(projectType);
    automator?.run();

    console.log('o project type é' + projectType);
  }

  public async detectProject(): Promise<ProjectType> {
    const currentPath = Deno.cwd();

    if (await fileExists(`${currentPath}/composer.json`)) {
      const composerJson = JSON.parse(Deno.readTextFileSync('./composer.json'));

      const installedPackages = Object.keys(composerJson.require);

      if (installedPackages.includes('laravel/framework')) {

        const confirmation = this.confirmProjectType(ProjectType.Laravel);

        if (confirmation) {
          return ProjectType.Laravel;
        }
      }
    }

    return this.askWhichProjectType();
  }

  public async askWhichProjectType(): Promise<ProjectType> {
    const selectedProjectType = await Select.prompt({
      message: 'Which type of project?',
      options: [
        'Docker',
        'PHP',
        'Laravel',
        'Laravel Sail',
        'Java',
        'Python',
        'React',
        'Flutter',
        'Custom',
      ],
    });

    const confirmation = this.confirmProjectType(selectedProjectType);

    if (confirmation === false) {
      return this.askWhichProjectType();
    }

    switch (selectedProjectType) {
      case 'Laravel':
      case 'Laravel Sail':
        return ProjectType.Laravel;
      default:
        return ProjectType.Custom;
    }
  }

  private confirmProjectType(projectType: string): boolean {
    return confirm(`Do you confirm project type: (${green(projectType)})`)
  }
}
