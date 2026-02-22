import { describe, it, expect } from 'vitest';
import { performDraw, checkBust, actionCollectGarden } from './drawLogic';
import { type GameState, type Card, type Player } from '@/types/game';

describe('drawLogic', () => {
    const mockCard = (id: string, value: number): Card => ({ id, value: value as any, imageUrl: '' });

    const createBaseState = (): GameState => ({
        gameId: null,
        players: [
            { id: 'p1', name: 'P1', isAI: false, garden: [mockCard('g1', 5)], savedCards: [], score: 0 },
        ],
        currentPlayerIndex: 0,
        deck: [mockCard('d1', 3)],
        discardPile: [],
        gamePhase: 'playing',
        turnPhase: 'collect',
        drawnCard: null,
        isFirstDraw: true,
    });

    it('should secure garden when actionCollectGarden is called', () => {
        const state = createBaseState();
        const newState = actionCollectGarden(state);

        expect(newState.players[0].savedCards).toHaveLength(1);
        expect(newState.players[0].savedCards[0].value).toBe(5);
        expect(newState.players[0].garden).toHaveLength(0);
        expect(newState.players[0].score).toBe(5);
        expect(newState.turnPhase).toBe('draw');
    });

    it('should detect bust if card value exists in garden AND length >= 3', () => {
        const player: Player = {
            id: 'p1',
            name: '',
            isAI: false,
            garden: [mockCard('c1', 5), mockCard('c2', 1), mockCard('c3', 2)],
            savedCards: [],
            score: 0
        };
        expect(checkBust(player, 5)).toBe(true);
        expect(checkBust(player, 3)).toBe(false);
    });

    it('should NOT detect bust if garden length < 3', () => {
        const player: Player = {
            id: 'p1',
            name: '',
            isAI: false,
            garden: [mockCard('c1', 5), mockCard('c2', 1)],
            savedCards: [],
            score: 0
        };
        expect(checkBust(player, 5)).toBe(false);
    });

    it('should handle empty deck and end game', () => {
        const state = createBaseState();
        state.deck = [];
        const { isGameOver, updatedPlayers } = performDraw(state);
        expect(isGameOver).toBe(true);
        expect(updatedPlayers[0].score).toBe(5); // Saved from current garden
    });
});
