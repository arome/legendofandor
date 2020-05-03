export type HeroType = 'Archer_female' | 'Archer_male' | 'Mage_female' | 'Mage_male' | 'Warrior_female' | 'Warrior_male' | 'Dwarf_female' | 'Dwarf_male'
export type MonsterType = 'Gor' | 'Skrall'
export type SpecialAbility = 'proxyAttack' | 'bait' | 'wellPower' | 'flipDice'

export interface Character {
    readonly numDice: number[];
    willpower: number;
    strength: number;
    readonly id?: string;
    positionOnMap: number;
}

export interface Monster extends Character {
    readonly type: MonsterType;
    readonly reward: { [key: string]: number };
    readonly startingPos: number;
}

export interface Hero extends Character {
    readonly name: string;
    readonly type: HeroType;
    hoursPassed: number;
    specialAbilities: { [key in SpecialAbility]: boolean };
    pickedFarmer: number[];
    gold: number;
    wineskin: number;
    endDay: boolean;
    hoveredArea: any;
    path: number[][];
}
