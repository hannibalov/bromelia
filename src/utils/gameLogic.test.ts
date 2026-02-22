import { describe, it, expect } from 'vitest';
import { calculateScore, findMatchingCards, groupGardenCards } from './gameLogic';
import { type Card } from '@/types/game';

describe('gameLogic', () => {
    it('should calculate score correctly', () => {
        const cards: Card[] = [
            { id: '1', value: 5, imageUrl: '' },
            { id: '2', value: 3, imageUrl: '' },
        ];
        expect(calculateScore(cards)).toBe(8);
    });

    it('should find matching cards in garden', () => {
        const garden: Card[] = [
            { id: '1', value: 5, imageUrl: '' },
            { id: '2', value: 3, imageUrl: '' },
            { id: '3', value: 5, imageUrl: '' },
        ];
        const matches = findMatchingCards(garden, 5);
        expect(matches).toHaveLength(2);
        expect(matches[0].value).toBe(5);
        expect(matches[1].value).toBe(5);
    });

    it('should group cards by value', () => {
        const garden: Card[] = [
            { id: '1', value: 5, imageUrl: '' },
            { id: '2', value: 3, imageUrl: '' },
            { id: '3', value: 5, imageUrl: '' },
        ];
        const grouped = groupGardenCards(garden);
        expect(grouped[5]).toHaveLength(2);
        expect(grouped[3]).toHaveLength(1);
    });
});
