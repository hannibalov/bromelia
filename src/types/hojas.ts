// Types for Hojas game

export type LeafColor = 'red' | 'green' | 'yellow' | 'blue';
export type LeafType = 'plain' | 'fruit' | 'bug';

export interface Leaf {
    id: string;
    color: LeafColor;
    type: LeafType;
    x: number; // Percent 0-100
    y: number; // Percent 0-100
    rotation: number; // Degrees 0-360
    zIndex: number;
}

export interface HojasPlayer {
    id: string;
    name: string;
    isAI: boolean;
    collectedPairs: { bug: Leaf; fruit: Leaf }[];
    singleLeaves: Leaf[];
    score: number; // Based on pairs + singles for tie-breaker
}

export type HojasGamePhase = 'setup' | 'playing' | 'finished';

export interface HojasGameState {
    gameId: string | null;
    players: HojasPlayer[];
    currentPlayerIndex: number;
    leaves: Leaf[];
    gamePhase: HojasGamePhase;
    selection: Leaf | null; // Currently selected leaf in the turn
    notification: {
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        visible: boolean;
    } | null;
}

export type HojasGameAction =
    | { type: 'START_GAME'; payload: { playersInfo: { name: string; isAI: boolean }[] } }
    | { type: 'PICK_LEAF'; payload: { leafId: string } }
    | { type: 'END_TURN' }
    | { type: 'SET_NOTIFICATION'; payload: HojasGameState['notification'] }
    | { type: 'CLEAR_NOTIFICATION' };
