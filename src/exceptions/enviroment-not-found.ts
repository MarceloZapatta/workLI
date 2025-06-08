export default class EnviromentNotFound extends Error {
  constructor(message: string = "Environment not found") {
    super(message);
    this.name = "EnviromentNotFound";
  }
}
