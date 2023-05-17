import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
