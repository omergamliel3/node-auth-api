import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Trim } from "class-sanitizer";

export class RegisterDto {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Username should be minimum of 5 characters" })
  username: string;

  @IsString()
  @MinLength(8, { message: "Password should be minimum of 8 characters" })
  password: string;
}

export class LoginDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateDto {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Username should be minimum of 5 characters" })
  username: string;

  @IsString()
  @MinLength(8, { message: "Password should be minimum of 8 characters" })
  password: string;
}
