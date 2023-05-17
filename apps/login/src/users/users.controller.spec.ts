import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let jwtService: JwtService;

  const mockUser: any = {
    email: 'john.doe@example.com',
    password: 'p@ssword123',
  };
  const mockQuery: any = {
    query: { page: '1', limit: '2', email: 'asdasD@gmail.com' },
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZEBnbWFpbC5jb20iLCJpYXQiOjE2ODQyMDA5MjEsImV4cCI6MTY4NDIwMTUyMX0.j1XI6lxAdtPEelog1Tw265nI0KShXwP8WxRYHqFssnQ',
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ValidationPipe,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: UserDto) =>
                Promise.resolve({ _id: 'uuid', ...user }),
              ),
            findOne: jest.fn(),
            getUsersFromBusiness: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mockUser, mockUser])),
          },
        },
        JwtService,
        {
          provide: 'BUSINESS_SERVICE', // Provide a substitute for the BUSINESS_SERVICE dependency
          useValue: {}, // Use an empty object as a substitute
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = await controller.create(mockUser);
      expect(result._id).toEqual('uuid');
    });

    it('should throw an error if user already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);

      const expectedError = new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );

      await expect(controller.create(mockUser)).rejects.toThrow(expectedError);
    });

    it('should throw an error if an exception occurs', async () => {
      const expectedError = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(service, 'create').mockRejectedValueOnce(expectedError);

      await expect(controller.create(mockUser)).rejects.toThrow(expectedError);
    });
  });

  describe('login', () => {
    it('should return access token with valid data', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        ...mockUser,
        password: hashSync('p@ssword123', 10),
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access-token');

      const result = await controller.login(mockUser);
      expect(result).toEqual({
        access_token: 'access-token',
      });
    });

    it('should throw an error if an exception occurs', async () => {
      const expectedError = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(expectedError);

      await expect(controller.create(mockUser)).rejects.toThrow(expectedError);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const token: string = 'token';
      const result = await controller.getUsers(token, mockQuery);
      expect(result).toEqual([mockUser, mockUser]);
    });
  });
});
