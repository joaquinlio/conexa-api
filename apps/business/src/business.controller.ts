import {
  Controller,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { UserGuard } from './users.guard';
import { MessagePattern } from '@nestjs/microservices';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @MessagePattern({ cmd: 'getUsers' })
  @UseGuards(UserGuard)
  async getUsers(getUsersDto: GetUsersDto) {
    try {
      const { page, limit, email } = getUsersDto.query;

      // Parse the page and limit values to integers
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);

      // Call the businessService to fetch users based on the parsed values
      return await this.businessService.findAll(parsedPage, parsedLimit, email);
    } catch (error) {
      console.log(error);

      // Throw an HttpException with the error message and status code
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
