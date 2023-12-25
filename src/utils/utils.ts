import { Response } from 'express';
import * as jwt from 'jsonwebtoken'
import { CardTokenRequest } from '../dtos/cardToken.dto';
const secretKey = 'secret_key';

export const generateToken = (data: any): string => {
    return jwt.sign(data, secretKey, { expiresIn: '1m' });
};

const luhnCheck = (number: string): boolean => {
    const digits = number.split('').map(Number);

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    // El número es válido si la suma es un múltiplo de 10
    return sum % 10 === 0;
};

export const validateCardData = (body: CardTokenRequest): boolean => {
    // Validar longitud del email
    if (!body.email || body.email.length < 5 || body.email.length > 100) {
        return false;
    }

    // Validar longitud del número de tarjeta
    const cardNumber = body.card_number.toString();
    if (cardNumber.length < 13 || cardNumber.length > 16) {
        return false;
    }

    // Validar longitud del mes de expiración
    if (body.expiration_month.length !== 1 && body.expiration_month.toString().length !== 2) {
        return false;
    }

    // Validar formato del mes de expiración
    const monthValue = parseInt(body.expiration_month, 10);
    if (monthValue < 1 || monthValue > 12) {
        return false;
    }

    
     // Validar longitud del año de expiración
     if (body.expiration_year.toString().length !== 4) {
        return false;
    }

    // Validar formato del año de expiración
    const currentYear = new Date().getFullYear();
    const yearValue = parseInt(body.expiration_year, 10);
    if (yearValue < currentYear || yearValue > currentYear + 5) {
        return false;
    }

    // Validar longitud del CVV
    const cvv = body.cvv.toString();
    if (cvv.length !== 3 && cvv.length !== 4) {
        return false;
    }

    // Validar el formato del email
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/;
    if (!emailRegex.test(body.email)) {
        return false;
    }

    // Validar el formato del número de tarjeta usando el algoritmo de Luhn
    if (!luhnCheck(body.card_number.toString())) {
        return false;
    }

    return true;
};