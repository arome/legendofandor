import { Game } from 'boardgame.io';
import { Hero, Monster } from './Character';
import { Token } from './Token';

export type Resource = 'gold' | 'wineskin'
export interface IG extends Game {
    readonly difficulty: 'easy' | 'hard';
    players: { [key: string]: Hero }
    monsters: Monster[];
    tokens: Token[];
    status: string | null;
    castleDefense: number;
    dices: number[];
    rollingDices: number[];
    letter: string;
    fight: {
        turn?: 'player' | 'monster';
        player?: any;
        monster?: any;
        result?: any;
        summary?: string;
    };
    splittableResource: { gold?: number, wineskin?: number }
    tempSplit: { [key: number]: { gold?: number, wineskin?: number } }
    init: boolean;
}