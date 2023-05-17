import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsEmail()
  email: string;
}

export class HeadersDto {
  @IsString()
  authorization: string;
}

export class UserDto {
  @IsEmail()
  email: string;

  @IsInt()
  iat: number;

  @IsInt()
  exp: number;
}

export class GetUsersDto {
  @IsNotEmpty()
  query: QueryDto;
  @IsNotEmpty()
  headers: HeadersDto;
  @IsOptional()
  user: UserDto;
  @IsOptional()
  token: string;
}
