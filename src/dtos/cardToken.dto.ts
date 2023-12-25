export interface CardTokenRequest {
    email: string;
    card_number: number;
    cvv: number;
    expiration_month: string;
    expiration_year: string;
  }
  
  export interface CardTokenResponse {
    email: string;
    card_number: number;
    expiration_month: string;
    expiration_year: string;
  }
  