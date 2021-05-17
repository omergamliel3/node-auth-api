import { StatusCodes } from "http-status-codes";

export class HttpException extends Error {
  constructor(public status: StatusCodes, public message: string) {
    super(message);
  }
}
