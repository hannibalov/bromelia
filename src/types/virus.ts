export type AnimalColor = 'red' | 'blue' | 'yellow' | 'green' | 'multicolor';
export type CardType = 'animal' | 'virus' | 'medicine' | 'special';

export interface VirusCard {
    id: string;
    type: CardType;
    color: AnimalColor;
    imageUrl: string;
    name: string;
}

export interface BodyPartState {
    animal: VirusCard;
    viruses: VirusCard[];
    medicines: VirusCard[];
    status: 'healthy' | 'infected' | 'vaccinated' | 'immunized' | 'dead';
}

export interface VirusPlayer {
    id: string;
    name: string;
    isAI: boolean;
    hand: VirusCard[];
    board: BodyPartState[];
}

export interface VirusGameState {
    players: VirusPlayer[];
    currentPlayerIndex: number;
    deck: VirusCard[];
    discardPile: VirusCard[];
    gamePhase: 'setup' | 'playing' | 'finished';
    winner: VirusPlayer | null;
}
