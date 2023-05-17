import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('BUSINESS_SERVICE') private client: ClientProxy,
  ) {}

  async create(createUserDto: UserDto) {
    // Create a new user document based on the provided userDto
    const createdUser = await this.userModel.create(createUserDto);
    return {
      email: createdUser.email,
      _id: createdUser._id,
    };
  }

  async findOne(email: string) {
    // Find a user document based on the provided email
    return await this.userModel.findOne({ email }).exec();
  }

  async getUsersFromBusiness(query: GetUsersDto, headers: any) {
    return new Promise((resolve, reject) => {
      // Send a message to the business service using the client
      this.client.send({ cmd: 'getUsers' }, { query, headers }).subscribe({
        // Handle the response from the business service
        next: (users: User[]) => {
          // Resolve the promise with the retrieved users
          resolve(users);
        },
        // Handle any errors that occur during the request
        error: (error: Error) => {
          // Reject the promise with the error
          reject(error);
        },
      });
    });
  }
}
