import User from "@entities/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { bodyMissingProps, noValidEntryFound } from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getConnection } from "typeorm";

// Register user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Error(bodyMissingProps);
  }

  try {
    const repository = getConnection().getRepository(User);
    const result = await repository.find(username);

    if (result.length) {
      throw new Error("Username already exists");
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
        expiresIn: "7d",
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
    const result = await repository.find(username);

    if (!result.length) {
      throw new Error("No username found");
    }

    const match = await bcrypt.compare(password, result[0].password);
    if (!match) {
      throw new Error("Wrong password");
    }

    const token = jwt.sign(
      {
        username: result[0].username,
        userId: result[0].id,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "7d",
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
  if (username) {
    updateOps.username = username;
  }
  if (password) {
    updateOps.password = bcrypt.hashSync(password, 10);
  }
  try {
    const repository = getConnection().getRepository(User);
    const result = await repository.update(userId, {
      ...updateOps,
    });
    if (result.affected && result.affected > 0) {
      return res.status(StatusCodes.OK);
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
  try {
    const repository = getConnection().getRepository(User);
    const result = await repository.delete(userId);
    if (result.affected && result.affected > 0) {
      return res.status(StatusCodes.OK);
    }
    res.status(StatusCodes.NOT_FOUND).json({
      message: noValidEntryFound,
    });
  } catch (err) {
    next(err);
  }
};
