'use client';

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { VirusGameState, VirusCard, VirusPlayer, BodyPartState } from '@/types/virus';
import { VirusAction } from '@/types/virus_actions';
import { createVirusDeck, canPlayCard, applyCard, checkWinCondition } from '../app/[locale]/virus/virusLogic';

// We need to define VirusAction, let's create a separate file for it or include it here
// I'll create a separate file for actions to keep it clean

const initialState: VirusGameState = {
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    gamePhase: 'setup',
    winner: null
};

function virusReducer(state: VirusGameState, action: VirusAction): VirusGameState {
    switch (action.type) {
        case 'START_GAME': {
            const { playersInfo } = action.payload;
            const fullDeck = createVirusDeck();
            const players: VirusPlayer[] = playersInfo.map((info: { name: string; isAI: boolean }, index: number) => ({
                id: `p-${index}`,
                name: info.name,
                isAI: info.isAI,
                hand: [],
                board: []
            }));

            // Deal 3 cards to each player
            const deck = [...fullDeck];
            players.forEach((p: VirusPlayer) => {
                p.hand = deck.splice(0, 3);
            });

            return {
                ...state,
                players,
                deck,
                gamePhase: 'playing',
                currentPlayerIndex: 0,
                winner: null
            };
        }

        case 'PLAY_CARD': {
            const { cardId, targetPlayerId } = action.payload;
            const player = state.players[state.currentPlayerIndex];
            const targetPlayer = state.players.find((p: VirusPlayer) => p.id === targetPlayerId);
            const card = player.hand.find((c: VirusCard) => c.id === cardId);

            if (!card || !targetPlayer || !canPlayCard(card, player, targetPlayer)) {
                return state;
            }

            const newState = { ...state };
            newState.players = state.players.map((p: VirusPlayer) => {
                if (p.id === player.id) {
                    return { ...p, hand: p.hand.filter((c: VirusCard) => c.id !== cardId) };
                }
                return p;
            });

            const newTargetPlayer = newState.players.find((p: VirusPlayer) => p.id === targetPlayerId)!;
            applyCard(card, newTargetPlayer);

            // Check win condition
            if (checkWinCondition(newTargetPlayer)) {
                newState.gamePhase = 'finished';
                newState.winner = newTargetPlayer;
            }

            return newState;
        }

        case 'DISCARD_CARD': {
            const { cardId } = action.payload;
            const player = state.players[state.currentPlayerIndex];
            const card = player.hand.find((c: VirusCard) => c.id === cardId);

            if (!card) return state;

            const newState = { ...state };
            newState.players = state.players.map((p: VirusPlayer) => {
                if (p.id === player.id) {
                    return { ...p, hand: p.hand.filter((c: VirusCard) => c.id !== cardId) };
                }
                return p;
            });
            newState.discardPile = [card, ...state.discardPile];

            return newState;
        }

        case 'DRAW_CARDS': {
            const player = state.players[state.currentPlayerIndex];
            const cardsNeeded = 3 - player.hand.length;
            if (cardsNeeded <= 0) return state;

            const newState = { ...state };
            let currentDeck = [...state.deck];
            let currentDiscard = [...state.discardPile];

            if (currentDeck.length < cardsNeeded) {
                // Re-shuffle discard pile into deck
                currentDeck = [...currentDeck, ...shuffleDeck(currentDiscard)];
                currentDiscard = [];
            }

            const drawnCards = currentDeck.splice(0, cardsNeeded);
            newState.deck = currentDeck;
            newState.discardPile = currentDiscard;
            newState.players = state.players.map((p: VirusPlayer) => {
                if (p.id === player.id) {
                    return { ...p, hand: [...p.hand, ...drawnCards] };
                }
                return p;
            });

            return newState;
        }

        case 'NEXT_TURN': {
            const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return {
                ...state,
                currentPlayerIndex: nextIndex
            };
        }

        default:
            return state;
    }
}

function shuffleDeck(deck: VirusCard[]): VirusCard[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function useVirusGame() {
    const [state, dispatch] = useReducer(virusReducer, initialState);

    const startGame = useCallback((playersInfo: { name: string; isAI: boolean }[]) => {
        dispatch({ type: 'START_GAME', payload: { playersInfo } });
    }, []);

    const playCard = useCallback((cardId: string, targetPlayerId: string) => {
        dispatch({ type: 'PLAY_CARD', payload: { cardId, targetPlayerId } });
        // Automatically draw and end turn if all cards spent or simple flow
        // For Virus, you usually play 1 card then draw back to 3
    }, []);

    const discardCard = useCallback((cardId: string) => {
        dispatch({ type: 'DISCARD_CARD', payload: { cardId } });
    }, []);

    const endTurn = useCallback(() => {
        dispatch({ type: 'DRAW_CARDS' });
        dispatch({ type: 'NEXT_TURN' });
    }, []);

    // AI logic
    useEffect(() => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer?.isAI && state.gamePhase === 'playing') {
            const timer = setTimeout(() => {
                // Simple AI logic:
                // 1. Try to play an animal if we have one and don't have it on board
                const animalToPlay = currentPlayer.hand.find((c: VirusCard) =>
                    c.type === 'animal' && !currentPlayer.board.some((bp: BodyPartState) => bp.animal.color === c.color)
                );
                if (animalToPlay) {
                    playCard(animalToPlay.id, currentPlayer.id);
                    endTurn();
                    return;
                }

                // 2. Try to play a medicine on ourselves
                const medicineToPlay = currentPlayer.hand.find((c: VirusCard) => {
                    if (c.type !== 'medicine') return false;
                    const targetBP = currentPlayer.board.find((bp: BodyPartState) => bp.animal.color === c.color || c.color === 'multicolor');
                    return targetBP && targetBP.status !== 'immunized';
                });
                if (medicineToPlay) {
                    playCard(medicineToPlay.id, currentPlayer.id);
                    endTurn();
                    return;
                }

                // 3. Try to play a virus on an opponent
                for (const opponent of state.players.filter((p: VirusPlayer) => p.id !== currentPlayer.id)) {
                    const virusToPlay = currentPlayer.hand.find((c: VirusCard) => {
                        if (c.type !== 'virus') return false;
                        const targetBP = opponent.board.find((bp: BodyPartState) => bp.animal.color === c.color || c.color === 'multicolor');
                        return targetBP && targetBP.status !== 'immunized';
                    });
                    if (virusToPlay) {
                        playCard(virusToPlay.id, opponent.id);
                        endTurn();
                        return;
                    }
                }

                // 4. If nothing else, discard a random card or first card
                if (currentPlayer.hand.length > 0) {
                    discardCard(currentPlayer.hand[0].id);
                    endTurn();
                    return;
                }

                // 5. If hand empty (shouldn't happen), just end turn
                endTurn();
            }, 2000); // 2 second delay for AI move
            return () => clearTimeout(timer);
        }
    }, [state.currentPlayerIndex, state.gamePhase, state.players, playCard, discardCard, endTurn]);

    return {
        state,
        startGame,
        playCard,
        discardCard,
        endTurn
    };
}
