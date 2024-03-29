import { Game } from 'boardgame.io';
import { Hero, Monster } from './Character';
import { UsableToken, FarmerToken } from './Token';

export type ItemType = 'gold' | 'wineskin'
export interface IG extends Game {
    readonly difficulty: 'easy' | 'hard';
    players: { [key: string]: Hero }
    monsters: Monster[];
    tokens: {
        fog: UsableToken[],
        well: UsableToken[],
        farmer: FarmerToken[]
    };
    status: { id: string, data: any };
    castleDefense: number;
    rollingDices: number[];
    letter: string;
    fight: {
        turn?: 'player' | 'monster';
        player?: any;
        monster?: any;
        result?: any;
        summary?: string;
    };
    resources: {
        total: { gold?: number, wineskin?: number }
        current: { [key: string]: { gold?: number, wineskin?: number } }
    },
    init: boolean;
}