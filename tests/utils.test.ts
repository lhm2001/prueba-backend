// utils.test.ts
import { createClient } from 'redis';
import { CardTokenRequest } from '../src/dtos/cardToken.dto';
import { getData, signIn, verifyToken } from '../src/services/cardTokenService';
import { validateCardData, generateToken } from '../src/utils/utils';
import { Response } from 'express';
import * as redis from 'redis';

jest.mock('../src/utils/utils', () => ({
  ...jest.requireActual('../src/utils/utils'),
  generateToken: jest.fn(() => 'mocked-token'),
}));

const redisClientMock = {
  connect: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  expire: jest.fn(),
  quit: jest.fn(),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    quit: jest.fn(),
  })),
}));

describe('Services', () => {
  describe('verifyToken', () => {
    it('should return the token from the Authorization header', () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer mock-token',
        },
      };
  
      const token = verifyToken(mockReq);
  
      expect(token).toBe('mock-token');
    });
  
    it('should throw an error if Authorization header is not provided', () => {
      const mockReq = {
        headers: {},
      };

      expect(() => verifyToken(mockReq)).toThrowError('Token no proporcionado');
    });
  
    it('should throw an error if Authorization header does not start with "Bearer "', () => {
      const mockReq = {
        headers: {
          authorization: 'InvalidToken',
        },
      };
  
      expect(() => verifyToken(mockReq)).toThrowError('Token no proporcionado');
    });
  
  });

  describe('signIn', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return a token', async () => {
      const mockBody = {
        email: 'correo@gmail.com',
        card_number: 4716571601324236,
        cvv: 1234,
        expiration_year: '2027',
        expiration_month: '12',
      };
  
      const token = await signIn(mockBody);
  
      expect(generateToken).toHaveBeenCalledWith({ body: mockBody });

      expect(token).toBe('mocked-token');
    });

    it('should return a valid token on successful sign in', async () => {
      const mockBody = {
          email: 'correo@gmail.com',
          card_number: 4716571601324236,
          cvv: 1234,
          expiration_year: '2027',
          expiration_month: '12',
      };

      const token = await signIn(mockBody);

      expect(token).toBeDefined();
  });

  it('should return null on invalid card data', async () => {
      const mockBody = {
          email: 'correo@gmail.com',
          card_number: 123,
          cvv: 1234,
          expiration_year: '2027',
          expiration_month: '12',
      };

      const token = await signIn(mockBody);

      expect(token).toBeNull();
  });
  });

  describe('getData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return null for non-existent token in Redis', async () => {
      const nonExistentToken = 'non-existent-token';
  
      const result = await getData(nonExistentToken);
  
      expect(result).toBeNull();
    });

  });

});