export default class ProjectNameNotFound extends Error {
  constructor(message: string = "Project name not found") {
    super(message);
    this.name = "ProjectNameNotFound";
  }
}
