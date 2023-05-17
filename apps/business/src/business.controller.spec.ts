import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { JwtService } from '@nestjs/jwt';

describe('BusinessController', () => {
  let controller: BusinessController;
  let service: BusinessService;
  let jwtService: JwtService;
  const mockQuery: any = {
    query: { page: '1', limit: '2', email: 'asdasD@gmail.com' },
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZEBnbWFpbC5jb20iLCJpYXQiOjE2ODQyMDA5MjEsImV4cCI6MTY4NDIwMTUyMX0.j1XI6lxAdtPEelog1Tw265nI0KShXwP8WxRYHqFssnQ',
    },
  };
  const mockUsers: any = [
    {
      email: 'john.doe@example.com',
      _id: '123',
    },
    {
      email: 'john2.doe@example.com',
      _id: '1234',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        ValidationPipe,
        {
          provide: BusinessService,
          useValue: {
            findAll: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockUsers)),
          },
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const result = await controller.getUsers(mockQuery);
      expect(result).toEqual(mockUsers);
    });

    it('should throw an error if an exception occurs', async () => {
      const expectedError = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(expectedError);

      await expect(controller.getUsers(mockQuery)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
