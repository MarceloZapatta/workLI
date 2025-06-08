export default class EnvironmentNotFound extends Error {
  constructor(message: string = 'Environment not found') {
    super(message);
    this.name = 'EnvironmentNotFound';
  }
}
