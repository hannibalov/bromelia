import type { Card, CardValue } from '@/types/game';

export const MAX_CARD = 10;
export const CARDS_PER_VALUE = 20;

/**
 * Creates a deck of 120 cards (20 of each value from 1 to MAX_CARD)
 */
export function createDeck(): Card[] {
    const deck: Card[] = [];

    for (let value = 1; value <= MAX_CARD; value++) {
        for (let copy = 0; copy < CARDS_PER_VALUE; copy++) {
            deck.push({
                id: `card-${value}-${copy}`,
                value: value as CardValue,
                imageUrl: `/cards/card_${value}.png`,
            });
        }
    }

    return shuffleDeck(deck);
}

/**
 * Shuffles a deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Checks if a card value already exists in the garden
 */
export function hasCardInGarden(garden: Card[], cardValue: CardValue): boolean {
    return garden.some(card => card.value === cardValue);
}

/**
 * Calculates total score from saved cards
 */
export function calculateScore(cards: Card[]): number {
    return cards.reduce((sum, card) => sum + card.value, 0);
}

/**
 * Finds all cards in a garden that match a specific value
 */
export function findMatchingCards(garden: Card[], cardValue: CardValue): Card[] {
    return garden.filter(card => card.value === cardValue);
}

/**
 * Groups cards in a garden by their value
 */
export function groupGardenCards(garden: Card[]): Record<number, Card[]> {
    return garden.reduce((acc, card) => {
        const val = card.value;
        if (!acc[val]) acc[val] = [];
        acc[val].push(card);
        return acc;
    }, {} as Record<number, Card[]>);
}
