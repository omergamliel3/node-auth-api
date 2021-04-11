import User from "@entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {
  bodyMissingProps,
  cannotPerformUpdate,
  noValidEntryFound,
  usernameExists,
  usernameNotFound,
  wrongPassword,
} from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getConnection } from "typeorm";
import logger from "@shared/logger";

// Register user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new Error(bodyMissingProps);
    }
    const repository = getConnection().getRepository(User);
    const result = await repository.findOne({ username });

    if (result) {
      throw new Error(usernameExists);
    }

    const user = new User();
    user.username = username;
    user.password = bcrypt.hashSync(password, 10);
    const createdUser = await repository.save(user);

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
};

// Login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const repository = getConnection().getRepository(User);
    const user = await repository.findOne({ username });

    if (!user) {
      throw new Error(usernameNotFound);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error(wrongPassword);
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
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { username, password } = req.body;
  const updateOps: { [key: string]: any } = {};

  try {
    if (!username && !password) {
      throw new Error(cannotPerformUpdate);
    }
    if (username) {
      updateOps.username = username;
    }
    if (password) {
      updateOps.password = bcrypt.hashSync(password, 10);
    }
    const repository = getConnection().getRepository(User);
    const result = await repository.update(userId, {
      ...updateOps,
    });
    if (result.affected && result.affected > 0) {
      return res.status(StatusCodes.OK).send();
    }
    res.status(StatusCodes.NOT_FOUND).json({
      message: noValidEntryFound,
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  logger.info(userId);
  try {
    const repository = getConnection().getRepository(User);
    const result = await repository.delete({ id: userId });
    if (result.affected && result.affected > 0) {
      return res.status(StatusCodes.OK).send();
    }
    res.status(StatusCodes.NOT_FOUND).json({
      message: noValidEntryFound,
    });
  } catch (err) {
    next(err);
  }
};
