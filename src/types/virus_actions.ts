import { VirusCard } from './virus';

export type VirusAction =
    | { type: 'START_GAME'; payload: { playersInfo: { name: string; isAI: boolean }[] } }
    | { type: 'PLAY_CARD'; payload: { cardId: string; targetPlayerId: string } }
    | { type: 'DISCARD_CARD'; payload: { cardId: string } }
    | { type: 'DRAW_CARDS' }
    | { type: 'NEXT_TURN' };
