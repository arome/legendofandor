export type TokenType = 'farmer' | 'well' | 'fog'

export interface Token {
    type: TokenType;
    positionOnMap: number;
}

export interface UsableToken extends Token {
    used: boolean;
}

export interface FarmerToken extends Token {
    startingPos: number;
    picked: boolean;
}