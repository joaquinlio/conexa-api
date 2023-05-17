import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
