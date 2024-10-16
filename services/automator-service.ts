import { dim, green } from 'https://deno.land/std@0.205.0/fmt/colors.ts';
import { Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts';
import { fileExists } from '../helpers/helpers.ts';
import { ProjectType } from '../interfaces/project-type.ts';

export default class AutomatorService {
  public async index() {
    let projectType = await this.detectProject();

    if (projectType === null) {
      projectType = await this.askWhichProjectType();
    }

    console.log('o project type é' + projectType);
  }

  public async detectProject(): Promise<ProjectType | null> {
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

    return null;
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
        break;
    }
  }

  private confirmProjectType(projectType: string) {
    return confirm(`Do you confirm project type: (${green(projectType)})`)
  }
}
