import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class BusinessService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(page: number = 1, limit: number = 10, email: string = '') {
    const users = await this.userModel
      .find({ email: { $regex: new RegExp(email, 'i') } }) // Filter users by email using case-insensitive regex
      .skip((page - 1) * limit) // Skip users based on the pagination values
      .select('_id email') // Select only the _id and email fields of the users
      .limit(limit); // Limit the number of returned users to the specified limit

    return users;
  }
}
