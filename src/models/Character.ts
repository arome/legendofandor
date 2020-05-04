import { ItemType } from "./Game"

export type HeroType = 'Archer_female' | 'Archer_male' | 'Mage_female' | 'Mage_male' | 'Warrior_female' | 'Warrior_male' | 'Dwarf_female' | 'Dwarf_male'
export type MonsterType = 'Gor' | 'Skrall'
export type SpecialAbility = 'proxyAttack' | 'bait' | 'wellPower' | 'flipDice'
export type RewardType = 'gold' | 'willpower'

export interface Character {
    readonly id: number;
    readonly numDice: number[];
    willpower: number;
    strength: number;
    position: number;
}

export interface Monster extends Character {
    readonly type: MonsterType;
    readonly rewards: { [key in RewardType]: number };
}

export interface Hero extends Character {
    readonly name: string;
    readonly type: HeroType;
    hoursPassed: number;
    specialAbilities: { [key in SpecialAbility]: boolean };
    pickedFarmers: number[];
    items: { [key in ItemType]: number }
    endDay: boolean;
    hoveredArea: any;
    path: number[][];
}
