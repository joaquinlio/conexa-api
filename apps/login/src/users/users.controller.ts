import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { hash, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { GetUsersDto } from './dto/get-users.dto';
import { UserGuard } from './users.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createUserDto: UserDto) {
    try {
      const { email, password } = createUserDto;

      // Check if user with the same email already exists
      const existingUser = await this.usersService.findOne(email);

      if (existingUser)
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

      // Hash the user's password
      const hashedPassword = await hash(password, 10);

      return await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    try {
      const { email, password } = userDto;

      // Check if user with the email exists
      const existingUser = await this.usersService.findOne(email);

      if (existingUser) {
        // Compare the provided password with the stored password
        const isMatch = await compareSync(password, existingUser.password);

        if (!isMatch) {
          // If passwords don't match, throw an error
          throw new HttpException(
            'Email or Password incorrect',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Generate an access token using the email
        const access_token = await this.jwtService.signAsync({
          email: email,
        });

        // Return the access token
        return {
          access_token,
        };
      }

      // If no user is found with the email, throw an error
      throw new HttpException(
        'Email or Password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(UserGuard)
  @Get()
  async getUsers(@Request() req, @Query() getUsersDto: GetUsersDto) {
    try {
      // Extract the token from the request object and create the headers object
      const headers = { authorization: `Bearer ${req.token}` };

      return await this.usersService.getUsersFromBusiness(getUsersDto, headers);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
