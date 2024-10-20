export default class ProjectTypeNotImplemented extends Error {
  constructor(
    message: string = 'Project Type Not Implemented, did you forget to register in the Automator file?'
  ) {
    super(message);
    this.name = 'ProjectTypeNotImplemented';
  }
}
