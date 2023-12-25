import { CardTokenRequest, CardTokenResponse } from '../dtos/cardToken.dto';
import { generateToken, validateCardData } from '../utils/utils';

import * as redis from 'redis';

const redisClient = redis.createClient();

export const verifyToken = (req:any): string => {
    const tokenHeader = req.headers['authorization'];
  
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
      throw new Error('Token no proporcionado');
    }
  
    const token = tokenHeader.split(' ')[1];
  
    return token;
  };

export const signIn = async (body: CardTokenRequest) => {

    if (!validateCardData(body)) {
        return null; 
    }

    const token = generateToken({ body });
    
    await redisClient.connect();

    redisClient.set(token, JSON.stringify({ body }));

    redisClient.expire(token, 60); 

    redisClient.quit();
    
    return token
    
};

export const getData = async (token: any) => {

    await redisClient.connect();

    const rawData = await redisClient.get(token);

    redisClient.quit();

    if (!rawData) {
        return null;
    }

    try {
        const data = JSON.parse(rawData);
        const responseData: CardTokenResponse = {
            email: data.body.email,
            card_number: data.body.card_number,
            expiration_month: data.body.expiration_month,
            expiration_year: data.body.expiration_year,
        };

        return responseData;
    } catch (error) {
        throw new Error('Error al procesar los datos almacenados en Redis.');
    }
};
