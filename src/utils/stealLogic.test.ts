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

    it('should execute steal from the targeted player only', () => {
        const players = [
            mockPlayer('p1', []),
            mockPlayer('p2', [mockCard('c1', 5), mockCard('c2', 3)]),
            mockPlayer('p3', [mockCard('c3', 5), mockCard('c4', 5)]),
        ];

        const { updatedPlayers, stolenCards } = executeSteal(players, 0, 5, 'p2');

        expect(stolenCards).toHaveLength(1);
        expect(updatedPlayers[1].garden).toHaveLength(1);
        expect(updatedPlayers[1].garden[0].value).toBe(3);
        expect(updatedPlayers[2].garden).toHaveLength(2); // p3 is untouched
    });
});
