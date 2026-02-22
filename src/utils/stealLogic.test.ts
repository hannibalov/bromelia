import { describe, it, expect } from 'vitest';
import { executeSteal, canStealFromAnyone } from './stealLogic';
import type { Player, Card, CardValue } from '@/types/game';

describe('stealLogic', () => {
    const mockCard = (id: string, value: CardValue): Card => ({ id, value, imageUrl: '' });
    const mockPlayer = (id: string, garden: Card[]): Player => ({
        id, name: '', isAI: false, garden, savedCards: [], score: 0
    });

    it('should correctly identify if someone has a card to steal', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5)]),
            mockPlayer('p3', []),
        ];
        expect(canStealFromAnyone(players, 0, 5)).toBe(true);
        expect(canStealFromAnyone(players, 0, 3)).toBe(false);
        expect(canStealFromAnyone(players, 1, 5)).toBe(false); // Current player has it
    });

    it('should identify when multiple players have matching cards (must choose one)', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5)]),
            mockPlayer('p3', [mockCard('c2', 5)]),
        ];
        expect(canStealFromAnyone(players, 0, 5)).toBe(true);
    });

    it('should execute steal from the targeted player only', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5), mockCard('c2', 3)]),
            mockPlayer('p3', [mockCard('c3', 5), mockCard('c4', 5)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 5, 'p2');

        expect(stolenCards).toHaveLength(1);
        expect(stolenCards[0].id).toBe('c1');
        // Target player loses the stolen cards - no longer has value 5
        expect(updatedPlayers[1].garden).toHaveLength(1);
        expect(updatedPlayers[1].garden[0].value).toBe(3);
        expect(updatedPlayers[1].garden.some(c => c.value === 5)).toBe(false);
        expect(updatedPlayers[2].garden).toHaveLength(2); // p3 is untouched
    });

    it('should steal ALL cards with same value from targeted player (not from others)', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5), mockCard('c2', 5), mockCard('c3', 3)]),
            mockPlayer('p3', [mockCard('c4', 5), mockCard('c5', 5)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 5, 'p2');

        // Player A gets ALL 5s from B (2 cards)
        expect(stolenCards).toHaveLength(2);
        expect(stolenCards.every(c => c.value === 5)).toBe(true);
        // Target player B loses ALL cards of that value - no 5s left
        expect(updatedPlayers[1].garden).toHaveLength(1);
        expect(updatedPlayers[1].garden[0].value).toBe(3);
        expect(updatedPlayers[1].garden.some(c => c.value === 5)).toBe(false);
        // P3 is untouched - we only steal from chosen target
        expect(updatedPlayers[2].garden).toHaveLength(2);
        expect(updatedPlayers[2].garden.every(c => c.value === 5)).toBe(true);
    });

    it('when stealing, target player loses those cards (has none of stolen value left)', () => {
        const c1 = mockCard('c1', 7);
        const c2 = mockCard('c2', 7);
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [c1, c2, mockCard('c3', 2)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 7, 'p2');

        expect(stolenCards).toHaveLength(2);
        expect(stolenCards).toContainEqual(c1);
        expect(stolenCards).toContainEqual(c2);
        // Target no longer has c1 or c2
        expect(updatedPlayers[1].garden).not.toContainEqual(c1);
        expect(updatedPlayers[1].garden).not.toContainEqual(c2);
        expect(updatedPlayers[1].garden).toHaveLength(1);
        expect(updatedPlayers[1].garden[0].value).toBe(2);
    });

    it('should not steal when targetPlayerId does not match any player', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 5, 'nonexistent');

        expect(stolenCards).toHaveLength(0);
        expect(updatedPlayers[1].garden).toHaveLength(1);
    });

    it('should not steal when target has no matching cards', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 3), mockCard('c2', 4)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 5, 'p2');

        expect(stolenCards).toHaveLength(0);
        expect(updatedPlayers[1].garden).toHaveLength(2);
    });
});
