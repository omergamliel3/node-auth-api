import { Repository } from "typeorm";

export default abstract class BaseController<T> {
  protected repository: Repository<T>;
  protected abstract getRepository(): Repository<T>;

  constructor() {
    this.repository = this.getRepository();
  }
}
