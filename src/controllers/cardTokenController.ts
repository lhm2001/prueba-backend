import { Request, Response } from 'express';
import * as redis from 'redis';
import { CardTokenRequest } from '../dtos/cardToken.dto';
import { getData, signIn, verifyToken } from '../services/cardTokenService';

const redisClient = redis.createClient();

export const createToken = async (req: Request, res: Response) => {
    const tokenHeader = verifyToken(req);

    const body: CardTokenRequest = req.body;

    const token=await signIn(body)

    if (token === null) {
        return res.status(400).json({ error: 'Datos de tarjeta inválidos' });
    }

    return res.status(200).json({ token });
};

export const getCreditCardData = async (req: Request, res: Response) => {
    const tokenHeader = verifyToken(req);

    const token = req.params.token;

    try {
        const responseData = await getData(token);

        if (responseData === null) {
            return res.status(404).json({ error: 'Token inválido o expirado.' });
        }

        res.status(200).json({ responseData });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

