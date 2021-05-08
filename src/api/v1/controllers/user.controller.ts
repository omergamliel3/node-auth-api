import BaseController from "./base.controller";
import User from "@entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getConnection, Repository } from "typeorm";
import {
  wrongPasswordErr,
  usernameNotFoundErr,
  usernameExistsErr,
  bodyMissingPropsErr,
  cannotPerformUpdateErr,
  noValidEntryFoundErr,
} from "@shared/errors";

export default class UserController extends BaseController<User> {
  protected getRepository(): Repository<User> {
    return getConnection().getRepository(User);
  }
  // Register user
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw bodyMissingPropsErr;
      }

      const result = await this.repository.findOne({ username });

      if (result) {
        throw usernameExistsErr;
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
        throw usernameNotFoundErr;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw wrongPasswordErr;
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
        throw cannotPerformUpdateErr;
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
      throw noValidEntryFoundErr;
    } catch (err) {
      next(err);
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const result = await this.repository.delete({ id: userId });
      if (result.affected && result.affected > 0) {
        return res.status(StatusCodes.OK).send();
      }
      throw noValidEntryFoundErr;
    } catch (err) {
      next(err);
    }
  }
}
