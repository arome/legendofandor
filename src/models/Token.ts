export type TokenType = 'farmer' | 'well' | 'fog'

export interface Token {
    position: number;
}

export interface UsableToken extends Token {
    used: boolean;
}

export interface FarmerToken extends Token {
    picked: boolean;
    id: number;
}