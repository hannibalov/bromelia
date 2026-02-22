import { type GameState, type Card, type Player } from '@/types/game';
import { calculateScore } from './gameLogic';

/**
 * Handles the logic for drawing a card from the deck.
 * Does NOT secure the garden anymore (handled by actionCollectGarden).
 */
export function performDraw(state: GameState): {
    drawnCard: Card | null;
    remainingDeck: Card[];
    updatedPlayers: Player[];
    isGameOver: boolean;
} {
    if (state.deck.length === 0) {
        const playersWithFinalScores = state.players.map(p => ({
            ...p,
            score: calculateScore([...p.savedCards, ...p.garden]),
        }));
        return {
            drawnCard: null,
            remainingDeck: [],
            updatedPlayers: playersWithFinalScores,
            isGameOver: true,
        };
    }

    const [drawnCard, ...remainingDeck] = state.deck;

    return {
        drawnCard,
        remainingDeck,
        updatedPlayers: state.players,
        isGameOver: false,
    };
}

/**
 * Explicitly moves a player's garden to their savedCards (points).
 */
export function actionCollectGarden(state: GameState): GameState {
    const updatedPlayers = state.players.map((p, idx) =>
        idx === state.currentPlayerIndex
            ? {
                ...p,
                savedCards: [...p.savedCards, ...p.garden],
                garden: [],
                score: calculateScore([...p.savedCards, ...p.garden]),
            }
            : p
    );

    return {
        ...state,
        players: updatedPlayers,
        turnPhase: 'draw', // Move to draw phase after collecting
        isFirstDraw: true,
    };
}

/**
 * Checks if drawing a specific card value results in a bust for the current player.
 * A bust occurs if the player has 3 or more cards in their garden AND one of
 * them has the same value as the drawn card.
 */
export function checkBust(player: Player, cardValue: number): boolean {
    if (player.garden.length < 3) return false;
    return player.garden.some(c => c.value === cardValue);
}
