import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';
import configuration from 'config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${configuration.dbhost}${configuration.dbdatabase}`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: configuration.jwtsecret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
