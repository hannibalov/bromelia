'use client';

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { type GameState, type GameAction, type Player } from '@/types/game';
import { createDeck } from '@/utils/gameLogic';
import { actionDrawCard, actionStealCards, actionKeepCard, actionAcknowledgeLoss, actionEndTurn, actionContinueTurn } from '@/utils/turnActions';
import { actionCollectGarden } from '@/utils/drawLogic';

const initialState: GameState = {
    gameId: null,
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    gamePhase: 'setup',
    turnPhase: 'collect',
    drawnCard: null,
    isFirstDraw: true,
    notification: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME': {
            const { playersInfo } = action.payload;
            const deck = createDeck();
            const gameId = crypto.randomUUID();
            const players: Player[] = playersInfo.map((info, index: number) => ({
                id: `player-${index}`,
                name: info.name,
                isAI: info.isAI,
                garden: [],
                savedCards: [],
                score: 0,
            }));

            return {
                ...state,
                gameId,
                players,
                deck,
                gamePhase: 'playing',
                turnPhase: 'collect',
                currentPlayerIndex: 0,
                isFirstDraw: true,
                notification: {
                    message: `¡Empieza la partida! Turno de ${players[0].name}`,
                    type: 'info',
                    visible: true
                }
            };
        }

        case 'COLLECT_GARDEN': {
            return actionCollectGarden(state);
        }

        case 'DRAW_CARD': {
            return actionDrawCard(state);
        }

        case 'KEEP_CARD': {
            return actionKeepCard(state);
        }

        case 'STEAL_CARDS': {
            return actionStealCards(state);
        }

        case 'ACKNOWLEDGE_LOSS': {
            const newState = actionAcknowledgeLoss(state);
            return {
                ...newState,
                notification: null
            };
        }

        case 'END_TURN': {
            const newState = actionEndTurn(state);
            return {
                ...newState,
                notification: null
            };
        }

        case 'CONTINUE_TURN': {
            return actionContinueTurn(state);
        }

        case 'AI_MOVE_DELAY': {
            return state; // No-op, just to trigger effect re-run if needed or keep alive
        }

        case 'SET_NOTIFICATION': {
            return {
                ...state,
                notification: action.payload
            };
        }

        case 'CLEAR_NOTIFICATION': {
            return {
                ...state,
                notification: state.notification ? { ...state.notification, visible: false } : null
            };
        }

        default:
            return state;
    }
}

export function useGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const processingAiAction = useRef(false);

    const startGame = useCallback((playersInfo: { name: string; isAI: boolean }[]) => {
        dispatch({ type: 'START_GAME', payload: { playersInfo } });
    }, []);

    const collectGarden = useCallback(() => {
        dispatch({ type: 'COLLECT_GARDEN' });
    }, []);

    const drawCard = useCallback(() => {
        dispatch({ type: 'DRAW_CARD' });
    }, []);

    const keepCard = useCallback(() => {
        dispatch({ type: 'KEEP_CARD' });
    }, []);

    const stealCards = useCallback((targetPlayerId: string) => {
        dispatch({ type: 'STEAL_CARDS', payload: { targetPlayerId } });
    }, []);

    const endTurn = useCallback(() => {
        dispatch({ type: 'END_TURN' });
    }, []);

    const continueTurn = useCallback(() => {
        dispatch({ type: 'CONTINUE_TURN' });
    }, []);

    const acknowledgeLoss = useCallback(() => {
        dispatch({ type: 'ACKNOWLEDGE_LOSS' });
    }, []);

    const clearNotification = useCallback(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, []);

    const processAIMove = useCallback(() => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer || !currentPlayer.isAI || state.gamePhase !== 'playing') return;

        // Prevent re-entry if an AI action is already processing
        if (processingAiAction.current) return;

        const AI_DELAY = 1500; // Time to read notification before acting

        const performAction = (actionName: string, actionFn: () => void) => {
            processingAiAction.current = true; // Lock
            dispatch({
                type: 'SET_NOTIFICATION',
                payload: {
                    message: `${currentPlayer.name} ${actionName}`,
                    type: 'info',
                    visible: true
                }
            });

            setTimeout(() => {
                actionFn();
                processingAiAction.current = false; // Unlock after action
            }, AI_DELAY);
        };

        const timeoutId = setTimeout(() => {
            // Re-check lock inside timeout just in case
            if (processingAiAction.current) return;

            if (state.turnPhase === 'collect' && !state.drawnCard) {
                performAction('está recogiendo su jardín...', collectGarden);
            } else if (state.turnPhase === 'draw' && !state.drawnCard) {
                performAction('va a sacar una carta...', drawCard);
            } else if (state.turnPhase === 'steal' && state.drawnCard) {
                performAction('¡te está robando cartas!', () => stealCards(''));
            } else if (state.turnPhase === 'decide') {
                if (currentPlayer.garden.length < 5 && state.deck.length > 0) {
                    performAction('decide continuar...', continueTurn);
                } else {
                    performAction('termina su turno', endTurn);
                }
            } else if (state.turnPhase === 'lost') {
                performAction('ha perdido el turno', acknowledgeLoss);
            }
        }, 1000); // Initial "thinking" delay

        return () => clearTimeout(timeoutId);
    }, [state, collectGarden, drawCard, stealCards, endTurn, continueTurn, acknowledgeLoss]);

    // Reset lock when player changes
    useEffect(() => {
        processingAiAction.current = false;
    }, [state.currentPlayerIndex]);

    // Effect to trigger AI move
    useEffect(() => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer?.isAI && state.gamePhase === 'playing') {
            const cleanup = processAIMove();
            return cleanup;
        }
    }, [state.currentPlayerIndex, state.turnPhase, state.gamePhase, processAIMove, state.players]);

    return {
        state,
        startGame,
        collectGarden,
        drawCard,
        keepCard,
        stealCards,
        endTurn,
        continueTurn,
        acknowledgeLoss,
        clearNotification,
    };
}
