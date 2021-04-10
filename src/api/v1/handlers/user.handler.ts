import User from "@entities/user";
import { getConnection, Repository } from "typeorm";

export class UserHandler {
  repository: Repository<User>;
  constructor() {
    this.repository = getConnection().getRepository(User);
  }

  async findUserById(userId: string) {
    return await this.repository.findOne(userId);
  }

  async deleteUserById(userId: string) {
    return await this.repository.delete(userId);
  }
}
