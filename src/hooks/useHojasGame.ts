'use client';

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { HojasGameState, HojasGameAction, HojasPlayer, Leaf } from '@/types/hojas';
import { createHojasDeck, processSelection, calculateWinner } from '@/utils/hojasLogic';

const initialState: HojasGameState = {
    gameId: null,
    players: [],
    currentPlayerIndex: 0,
    leaves: [],
    gamePhase: 'setup',
    selection: null,
    notification: null,
};

function hojasReducer(state: HojasGameState, action: HojasGameAction): HojasGameState {
    switch (action.type) {
        case 'START_GAME': {
            const { playersInfo } = action.payload;
            const leaves = createHojasDeck();
            const players: HojasPlayer[] = playersInfo.map((info, index) => ({
                id: `player-${index}`,
                name: info.name,
                isAI: info.isAI,
                collectedPairs: [],
                singleLeaves: [],
                score: 0,
            }));

            return {
                ...state,
                gameId: crypto.randomUUID(),
                players,
                leaves,
                gamePhase: 'playing',
                currentPlayerIndex: 0,
                selection: null,
                notification: {
                    message: `¡Empieza la partida! Turno de ${players[0].name}`,
                    type: 'info',
                    visible: true,
                },
            };
        }

        case 'PICK_LEAF': {
            const leaf = state.leaves.find(l => l.id === action.payload.leafId);
            if (!leaf || state.gamePhase !== 'playing') return state;

            const newState = processSelection(leaf, state);

            // Check if game is over
            if (newState.leaves.length === 0) {
                return {
                    ...newState,
                    gamePhase: 'finished',
                    notification: {
                        message: '¡Juego terminado!',
                        type: 'success',
                        visible: true,
                    }
                };
            }
            return newState;
        }

        case 'END_TURN': {
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return {
                ...state,
                currentPlayerIndex: nextPlayerIndex,
                selection: null,
                notification: null,
            };
        }

        case 'SET_NOTIFICATION': {
            return { ...state, notification: action.payload };
        }

        case 'CLEAR_NOTIFICATION': {
            return {
                ...state,
                notification: state.notification ? { ...state.notification, visible: false } : null,
            };
        }

        default:
            return state;
    }
}

export function useHojasGame() {
    const [state, dispatch] = useReducer(hojasReducer, initialState);
    const processingAiAction = useRef(false);

    const startGame = useCallback((playersInfo: { name: string; isAI: boolean }[]) => {
        dispatch({ type: 'START_GAME', payload: { playersInfo } });
    }, []);

    const pickLeaf = useCallback((leafId: string) => {
        dispatch({ type: 'PICK_LEAF', payload: { leafId } });
    }, []);

    const clearNotification = useCallback(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, []);

    // AI Logic
    useEffect(() => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (state.gamePhase === 'playing' && currentPlayer?.isAI && !processingAiAction.current) {
            processingAiAction.current = true;

            setTimeout(() => {
                // AI selects a random leaf that is not covered
                const availableLeaves = state.leaves.filter(l => !state.leaves.some(other => other.zIndex > l.zIndex && /* simple check for AI */ false));
                // Actually use the logic
                const pickableLeaves = state.leaves.filter(l => {
                    // Check if covered
                    return !state.leaves.some(other => {
                        if (other.zIndex <= l.zIndex) return false;
                        // Simple overlap for AI
                        return Math.abs(other.x - l.x) < 10 && Math.abs(other.y - l.y) < 10;
                    });
                });

                if (pickableLeaves.length > 0) {
                    const target = pickableLeaves[Math.floor(Math.random() * pickableLeaves.length)];
                    pickLeaf(target.id);
                }

                processingAiAction.current = false;
            }, 2000);
        }
    }, [state, pickLeaf]);

    return {
        state,
        startGame,
        pickLeaf,
        clearNotification,
        winner: state.gamePhase === 'finished' ? calculateWinner(state.players) : null,
    };
}
