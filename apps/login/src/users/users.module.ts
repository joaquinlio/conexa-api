import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.register([
      {
        name: configuration.transportServiceName,
        transport: Transport.REDIS,
        options: {
          host: configuration.transportHost,
          port: configuration.transportPort,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
