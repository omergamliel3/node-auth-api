import User from "@entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as constants from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getConnection, Repository } from "typeorm";
import logger from "@shared/logger";

export default class UserController {
  private repository: Repository<User>;

  constructor() {
    this.repository = getConnection().getRepository(User);
  }

  // Register user
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new Error(constants.bodyMissingProps);
      }

      const result = await this.repository.findOne({ username });

      if (result) {
        throw new Error(constants.usernameExists);
      }

      const user = new User();
      user.username = username;
      user.password = bcrypt.hashSync(password, 10);
      const createdUser = await this.repository.save(user);

      const token = jwt.sign(
        {
          username: createdUser.username,
          userId: createdUser.id,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: process.env.JWT_EXPIRED_IN as string,
        }
      );

      res.status(StatusCodes.CREATED).json(token);
    } catch (err) {
      next(err);
    }
  }

  // Login user
  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    try {
      const user = await this.repository.findOne({ username });

      if (!user) {
        throw new Error(constants.usernameNotFound);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error(constants.wrongPassword);
      }

      const token = jwt.sign(
        {
          username: user.username,
          userId: user.id,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: process.env.JWT_EXPIRED_IN as string,
        }
      );

      res.status(StatusCodes.OK).json(token);
    } catch (err) {
      next(err);
    }
  }

  // Update user
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const { username, password } = req.body;
    const updateOps: { [key: string]: any } = {};

    try {
      if (!username && !password) {
        throw new Error(constants.cannotPerformUpdate);
      }
      if (username) {
        updateOps.username = username;
      }
      if (password) {
        updateOps.password = bcrypt.hashSync(password, 10);
      }

      const result = await this.repository.update(userId, {
        ...updateOps,
      });
      if (result.affected && result.affected > 0) {
        return res.status(StatusCodes.OK).send();
      }
      res.status(StatusCodes.NOT_FOUND).json({
        message: constants.noValidEntryFound,
      });
    } catch (err) {
      next(err);
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    logger.info(userId);
    try {
      const result = await this.repository.delete({ id: userId });
      if (result.affected && result.affected > 0) {
        return res.status(StatusCodes.OK).send();
      }
      res.status(StatusCodes.NOT_FOUND).json({
        message: constants.noValidEntryFound,
      });
    } catch (err) {
      next(err);
    }
  }
}
