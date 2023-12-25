// tokenRoutes.ts
import express from 'express';
import { createToken, getCreditCardData } from '../controllers/cardTokenController';

const router = express.Router();

router.post('/create-token', createToken);
router.get('/get-data/:token', getCreditCardData);

export default router;
