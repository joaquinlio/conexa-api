import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { GetUsersDto } from './dto/get-users.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { Observer } from 'rxjs';

const mockUsers: any = [
  { _id: '1', email: 'user1@example.com' },
  { _id: '2', email: 'user2@example.com' },
];

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'BUSINESS_SERVICE',
            transport: Transport.TCP,
          },
        ]),
      ],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUsers[0]),
            constructor: jest.fn().mockResolvedValue(mockUsers[0]),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: 'BUSINESS_SERVICE', // Provide a substitute for the BUSINESS_SERVICE dependency
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    client = ClientProxyFactory.create({
      transport: Transport.TCP,
    });
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        _id: '1',
        ...mockUsers[0],
      }),
    );

    const newUser = await service.create(mockUsers[0]);

    expect(newUser).toEqual({
      _id: '1',
      ...mockUsers[0],
    });
  });

  it('should return an array of users from business service', async () => {
    const query: GetUsersDto = {
      page: 1,
      limit: 10,
      email: 'example@example.com',
    };
    const headers = { Authorization: 'Bearer token' };

    jest.spyOn(client, 'send').mockImplementation((): any => ({
      subscribe: (
        observerOrNext?: Partial<Observer<any>> | ((value: any) => void),
      ) => {
        if (typeof observerOrNext === 'function') {
          observerOrNext(mockUsers);
        } else if (
          observerOrNext &&
          typeof observerOrNext.next === 'function'
        ) {
          observerOrNext.next(mockUsers);
        }
        return {
          unsubscribe: () => {},
        };
      },
    }));
    service['client'] = client;

    const result = await service.getUsersFromBusiness(query, headers);

    expect(client.send).toHaveBeenCalledTimes(1);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'getUsers' },
      { query, headers },
    );
    expect(result).toEqual(mockUsers);
  });

  it('should throw an error if the request fails', async () => {
    const query: GetUsersDto = {
      page: 1,
      limit: 10,
      email: 'example@example.com',
    };
    const headers = { Authorization: 'Bearer token' };
    const errorMessage = 'Error retrieving users';
    jest.spyOn(client, 'send').mockImplementation((): any => ({
      subscribe: (callback: any, errorCallback: any) => {
        throw new Error(errorMessage);
      },
    }));
    service['client'] = client;
    await expect(
      service.getUsersFromBusiness(query, headers),
    ).rejects.toThrowError(errorMessage);
    expect(client.send).toHaveBeenCalledTimes(1);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'getUsers' },
      { query, headers },
    );
  });
});
