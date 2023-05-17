import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { BusinessService } from './business.service';

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

describe('BusinessService', () => {
  let service: BusinessService;
  let model: Model<UserDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: getModelToken('User'), // Provide a substitute for the User dependency
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: 'BUSINESS_SERVICE', // Provide a substitute for the BUSINESS_SERVICE dependency
          useValue: {}, // Use an empty object as a substitute
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getOne by email', async () => {
    jest.spyOn(model, 'find').mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce(mockUsers),
    } as any);

    const foundUser = await service.findAll(1, 2, 'john.doe@example.com');
    expect(foundUser).toEqual(mockUsers);
  });
});
