import { type GameState } from '@/types/game';
import { performDraw, checkBust, actionCollectGarden } from './drawLogic';
import { executeSteal, canStealFromAnyone } from './stealLogic';

/**
 * High-level action for drawing a card.
 */
export function actionDrawCard(state: GameState): GameState {
    // If the player is still in collect phase, they MUST collect first
    if (state.turnPhase === 'collect') {
        const collectedState = actionCollectGarden(state);
        // After collecting, we immediately proceed to draw
        return actionDrawCard(collectedState);
    }

    const { drawnCard, remainingDeck, updatedPlayers, isGameOver } = performDraw(state);

    if (isGameOver) {
        return {
            ...state,
            players: updatedPlayers,
            gamePhase: 'finished',
        };
    }

    if (!drawnCard) return state;

    const activePlayer = updatedPlayers[state.currentPlayerIndex];
    if (checkBust(activePlayer, drawnCard.value)) {
        return {
            ...state,
            players: updatedPlayers,
            deck: remainingDeck,
            drawnCard,
            turnPhase: 'lost',
            isFirstDraw: false,
        };
    }

    const stealAvailable = canStealFromAnyone(updatedPlayers, state.currentPlayerIndex, drawnCard.value);

    // If no bust and no steal available, add to garden immediately
    if (!stealAvailable) {
        const finalPlayers = updatedPlayers.map((p, idx) =>
            idx === state.currentPlayerIndex
                ? { ...p, garden: [...p.garden, drawnCard] }
                : p
        );
        return {
            ...state,
            players: finalPlayers,
            deck: remainingDeck,
            drawnCard: null,
            turnPhase: 'decide',
            isFirstDraw: false,
        };
    }

    // If steal IS available, keep it in drawnCard for the player to decide
    return {
        ...state,
        players: updatedPlayers,
        deck: remainingDeck,
        drawnCard,
        turnPhase: 'steal',
        isFirstDraw: false,
    };
}

/**
 * High-level action for stealing cards.
 */
export function actionStealCards(state: GameState): GameState {
    if (!state.drawnCard) return state;

    const { updatedPlayers, stolenCards } = executeSteal(
        state.players,
        state.currentPlayerIndex,
        state.drawnCard.value
    );

    const finalPlayers = updatedPlayers.map((p, idx) => {
        if (idx === state.currentPlayerIndex) {
            return {
                ...p,
                garden: [...p.garden, state.drawnCard!, ...stolenCards],
            };
        }
        return p;
    });

    return {
        ...state,
        players: finalPlayers,
        turnPhase: 'decide',
        drawnCard: null,
    };
}

/**
 * High-level action for keeping a card (skipping or no steal available).
 */
export function actionKeepCard(state: GameState): GameState {
    if (!state.drawnCard) return state;

    const updatedPlayers = state.players.map((p, idx) =>
        idx === state.currentPlayerIndex
            ? { ...p, garden: [...p.garden, state.drawnCard!] }
            : p
    );

    return {
        ...state,
        players: updatedPlayers,
        turnPhase: 'decide',
        drawnCard: null,
    };
}

/**
 * High-level action for acknowledging a loss (passing turn after bust).
 */
export function actionAcknowledgeLoss(state: GameState): GameState {
    const currentPlayer = state.players[state.currentPlayerIndex];
    const updatedPlayers = state.players.map((p, idx) =>
        idx === state.currentPlayerIndex
            ? { ...p, garden: [] }
            : p
    );

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

    return {
        ...state,
        players: updatedPlayers,
        discardPile: [...state.discardPile, state.drawnCard!, ...currentPlayer.garden],
        currentPlayerIndex: nextPlayerIndex,
        turnPhase: 'collect',
        drawnCard: null,
        isFirstDraw: true,
    };
}

/**
 * High-level action for ending a turn.
 */
export function actionEndTurn(state: GameState): GameState {
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

    return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        turnPhase: 'collect',
        drawnCard: null,
        isFirstDraw: true,
    };
}

/**
 * High-level action for continuing a turn (drawing again).
 */
export function actionContinueTurn(state: GameState): GameState {
    return {
        ...state,
        drawnCard: null,
        turnPhase: 'draw',
    };
}
