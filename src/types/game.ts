// Game types for Plantas card game

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Card {
    id: string;
    value: CardValue;
    imageUrl: string;
}

export interface Player {
    id: string;
    name: string;
    isAI: boolean;
    garden: Card[]; // Cards currently in player's garden
    savedCards: Card[]; // Cards saved from previous turns
    score: number;
}

export interface GameState {
    gameId: string | null;
    players: Player[];
    currentPlayerIndex: number;
    deck: Card[]; // Main deck
    discardPile: Card[]; // Discarded cards
    gamePhase: 'setup' | 'playing' | 'finished';
    turnPhase: 'collect' | 'draw' | 'steal' | 'decide' | 'lost';
    drawnCard: Card | null; // Currently drawn card
    isFirstDraw: boolean; // Flag to secure garden at start of turn
    notification: {
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        visible: boolean;
    } | null;
}

export interface GameAction {
    type:
    | 'START_GAME'
    | 'COLLECT_GARDEN'
    | 'DRAW_CARD'
    | 'KEEP_CARD'
    | 'STEAL_CARDS'
    | 'END_TURN'
    | 'CONTINUE_TURN'
    | 'LOSE_TURN'
    | 'ACKNOWLEDGE_LOSS'
    | 'ACKNOWLEDGE_LOSS'
    | 'AI_MOVE_DELAY'
    | 'SET_NOTIFICATION'
    | 'CLEAR_NOTIFICATION';
    payload?: any;
}
