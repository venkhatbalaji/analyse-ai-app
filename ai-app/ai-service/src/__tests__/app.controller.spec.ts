import { Test, TestingModule } from '@nestjs/testing';
import { FundController } from '../fund-signup/fund.controller';
import { FundService } from '../fund-signup/fund.service';
import { HttpStatus } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import {
  createFailureResponse,
  createSuccessResponse,
} from '../common/common.response';
import {
  FundInfoRequest,
  PrimaryContactRequest,
  FundUboInfoRequest,
} from '../validators/fund.validator';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { KinesisService } from '../logger/kinesis.logger';
import { Types } from 'mongoose';

describe('FundController', () => {
  let fundController: FundController;
  let fundService: FundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundController],
      providers: [
        FundService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('Companies'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: KinesisService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    fundController = module.get<FundController>(FundController);
    fundService = module.get<FundService>(FundService);
  });

  describe('Primary Contact Info', () => {
    it('should create primary contact information with valid input', async () => {
      const request: PrimaryContactRequest = {
        firstName: 'test',
        lastName: 'test',
        middleName: 'test',
        passportNumber: 's8798798',
        primaryPassport: 'test',
        passportExpiryDate: new Date(2023, 1, 1),
        passportIssueDate: new Date(2020, 1, 1),
        title: 'test',
        salutation: 'test',
        userId: new Types.ObjectId(),
      };

      const successResponse = createSuccessResponse({
        message: 'User created successfully',
      });

      jest
        .spyOn(fundService, 'postPrimaryInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.primaryContactInfo(request, expressResponse);

      expect(expressResponse.json).toHaveBeenCalledWith(successResponse);
      expect(expressResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should throw invalid resonse information with invalid input', async () => {
      const request: PrimaryContactRequest = {
        firstName: 'test',
        lastName: 'test',
        middleName: 'test',
        passportExpiryDate: new Date(2023, 1, 1),
        passportIssueDate: new Date(2020, 1, 1),
        passportNumber: 's8798798',
        primaryPassport: 'test',
        title: 'test',
        userId: new Types.ObjectId(),
      } as PrimaryContactRequest;

      const successResponse = createFailureResponse({
        message: 'Invalid Request',
      });

      jest
        .spyOn(fundService, 'postPrimaryInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.primaryContactInfo(request, expressResponse);

      expect(expressResponse.status).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  describe('Fund Info', () => {
    it('should create Fund information with valid input', async () => {
      const request: FundInfoRequest = {
        city: 'test',
        countryOfResidence: 'test',
        postalCode: 'test',
        streetName: 'test',
        additionalInfo: 'test',
        proofOfAddress: 'test',
        userId: new Types.ObjectId(),
      };

      const successResponse = createSuccessResponse({
        message: 'Resi info updated successfully',
      });

      jest
        .spyOn(fundService, 'postFundInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.fundInfo(request, expressResponse);

      expect(expressResponse.json).toHaveBeenCalledWith(successResponse);
      expect(expressResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw invalid response information with invalid input', async () => {
      const request: FundInfoRequest = {
        postalCode: 'test',
        streetName: 'test',
        additionalInfo: 'test',
        proofOfAddress: 'test',
        userId: new Types.ObjectId(),
      } as FundInfoRequest;

      const successResponse = createFailureResponse({
        message: 'Invalid Request',
      });

      jest
        .spyOn(fundService, 'postFundInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.fundInfo(request, expressResponse);

      expect(expressResponse.status).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  describe('Ubo Info', () => {
    it('should create Ubo information with valid input', async () => {
      const request: FundUboInfoRequest = {
        occupation: 'test',
        jobType: 'test',
        fund: 'test',
        designation: 'test',
        annualIncome: 'test',
        isFinancialLiability: true,
        amountAllocated: 'test',
        investmentExperience: 'test',
        expectedReturn: 'test',
        interestedAssets: ['test'],
        userId: new Types.ObjectId(),
      };

      const successResponse = createSuccessResponse({
        message: 'Ubo info updated successfully',
      });

      jest
        .spyOn(fundService, 'postUboInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.uboInfo(request, expressResponse);

      expect(expressResponse.json).toHaveBeenCalledWith(successResponse);
      expect(expressResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw invalid resonse information with invalid input', async () => {
      const request: FundUboInfoRequest = {
        occupation: 'test',
        jobType: 'test',
        fund: 'test',
        designation: 'test',
        annualIncome: 'test',
        isFinancialLiability: true,
        amountAllocated: 'test',
        investmentExperience: 'test',
        userId: new Types.ObjectId(),
      } as FundUboInfoRequest;

      const successResponse = createFailureResponse({
        message: 'Invalid Request',
      });

      jest
        .spyOn(fundService, 'postUboInformation')
        .mockResolvedValue(successResponse);

      const expressResponse: ExpressResponse = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await fundController.uboInfo(request, expressResponse);

      expect(expressResponse.status).toHaveBeenCalledWith(
        HttpStatus.BAD_REQUEST,
      );
    });
  });

});
