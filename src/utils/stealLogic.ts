import { type Card, type Player } from '@/types/game';
import { findMatchingCards } from './gameLogic';

/**
 * Executes a steal operation: removes matching cards from all other players
 * and returns them along with the updated player list.
 */
export function executeSteal(
    players: Player[],
    currentPlayerIndex: number,
    cardValue: number
): { updatedPlayers: Player[]; stolenCards: Card[] } {
    const stolenCards: Card[] = [];

    const updatedPlayers = players.map((p, idx) => {
        if (idx === currentPlayerIndex) return p;

        const matches = findMatchingCards(p.garden, cardValue as any);
        if (matches.length > 0) {
            stolenCards.push(...matches);
            return {
                ...p,
                garden: p.garden.filter(c => c.value !== cardValue),
            };
        }
        return p;
    });

    return { updatedPlayers, stolenCards };
}

/**
 * Checks if any player (other than the current one) has cards matching the given value.
 */
export function canStealFromAnyone(
    players: Player[],
    currentPlayerIndex: number,
    cardValue: number
): boolean {
    return players.some((p, idx) =>
        idx !== currentPlayerIndex &&
        p.garden.some(c => c.value === cardValue)
    );
}
