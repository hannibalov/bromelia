import { describe, it, expect } from 'vitest';
import { actionDrawCard, actionStealCards, actionKeepCard, actionEndTurn } from './turnActions';
import { createDeck, MAX_CARD } from './gameLogic';
import type { GameState, Card, CardValue } from '@/types/game';

describe('turnActions', () => {
    const mockCard = (id: string, value: CardValue): Card => ({ id, value, imageUrl: '' });

    describe('Deck and Constants', () => {
        it('should have MAX_CARD as 10', () => {
            expect(MAX_CARD).toBe(10);
        });

        it('should create a deck of 200 cards', () => {
            const deck = createDeck();
            expect(deck).toHaveLength(200);
        });

        it('should have 20 copies of each card value', () => {
            const deck = createDeck();
            const counts: Record<number, number> = {};
            deck.forEach(c => {
                counts[c.value] = (counts[c.value] || 0) + 1;
            });
            for (let i = 1; i <= MAX_CARD; i++) {
                expect(counts[i]).toBe(20);
            }
        });
    });

    const createInitialState = (): GameState => ({
        gameId: null,
        players: [
            { id: 'p1', name: 'P1', isAI: false, garden: [], savedCards: [], score: 0 },
            { id: 'p2', name: 'P2', isAI: false, garden: [], savedCards: [], score: 0 },
        ],
        currentPlayerIndex: 0,
        deck: [mockCard('d1', 5)],
        discardPile: [],
        gamePhase: 'playing',
        turnPhase: 'collect',
        drawnCard: null,
        isFirstDraw: true,
        notification: null,
    });

    describe('Start of Turn Logic', () => {
        it('should move garden cards to savedCards on the first draw', () => {
            const state = createInitialState();
            state.players[0].garden = [mockCard('old1', 1), mockCard('old2', 2)];
            state.isFirstDraw = true;

            const newState = actionDrawCard(state);

            expect(newState.players[0].savedCards).toHaveLength(2);
            expect(newState.players[0].garden).toHaveLength(1); // The new card is added immediately (no steal target)
        });

        it('should add the card to the garden even if it is not the first draw (if no steal/bust)', () => {
            const state = createInitialState();
            state.players[0].garden = [mockCard('old1', 1)];
            state.isFirstDraw = false;
            state.deck = [mockCard('new', 3)];
            state.turnPhase = 'draw'; // Not collect phase
            state.players[1].garden = []; // No '3' to steal

            const newState = actionDrawCard(state);

            expect(newState.players[0].savedCards).toHaveLength(0);
            expect(newState.players[0].garden).toHaveLength(2); // old1 + new
        });
    });

    describe('Bust Logic', () => {
        it('should not bust if player has less than 3 cards in garden, even if value matches', () => {
            const state = createInitialState();
            state.players[0].garden = [mockCard('g1', 5)]; // 1 card
            state.deck = [mockCard('d1', 5)]; // Matching value
            state.isFirstDraw = false; // Already drew once

            const newState = actionDrawCard(state);
            expect(newState.turnPhase).not.toBe('lost');
        });

        it('should not bust if player has exactly 2 cards in garden, even if value matches', () => {
            const state = createInitialState();
            state.players[0].garden = [mockCard('g1', 5), mockCard('g2', 1)]; // 2 cards
            state.deck = [mockCard('d1', 5)]; // Matching value
            state.isFirstDraw = false;

            const newState = actionDrawCard(state);
            expect(newState.turnPhase).not.toBe('lost');
        });

        it('should bust if player has 3 or more cards and value matches', () => {
            const state = createInitialState();
            state.players[0].garden = [mockCard('g1', 5), mockCard('g2', 1), mockCard('g3', 2)]; // 3 cards
            state.deck = [mockCard('d1', 5)]; // Matching value
            state.isFirstDraw = false;
            state.turnPhase = 'draw'; // Not collect phase

            const newState = actionDrawCard(state);
            expect(newState.turnPhase).toBe('lost');
        });
    });

    describe('Steal Logic Refined', () => {
        it('should add the drawn card to the garden immediately if no steal is available', () => {
            const state = createInitialState();
            const cardToDraw = mockCard('d1', 5);
            state.deck = [cardToDraw];
            state.players[1].garden = []; // No '5's to steal

            const newState = actionDrawCard(state);

            expect(newState.players[0].garden).toContainEqual(cardToDraw);
            expect(newState.drawnCard).toBeNull();
            expect(newState.turnPhase).toBe('decide');
        });

        it('should NOT add to garden immediately if a steal IS available', () => {
            const state = createInitialState();
            const cardToDraw = mockCard('d1', 5);
            state.deck = [cardToDraw];
            state.players[1].garden = [mockCard('stolen1', 5)]; // Steal target
            state.turnPhase = 'draw'; // Not collect phase

            const newState = actionDrawCard(state);

            expect(newState.players[0].garden).toHaveLength(0); // Card should NOT be in garden yet
            expect(newState.drawnCard).toEqual(cardToDraw);
            expect(newState.turnPhase).toBe('steal');
        });

        it('should allow skipping a steal (optional steal)', () => {
            const state = createInitialState();
            const cardToDraw = mockCard('drawn', 5);
            state.drawnCard = cardToDraw;
            state.players[1].garden = [mockCard('stolen1', 5)];
            state.turnPhase = 'steal';

            // User chooses to Keep instead of Steal
            const newState = actionKeepCard(state);

            expect(newState.players[0].garden).toContainEqual(cardToDraw);
            expect(newState.players[1].garden).toHaveLength(1); // Stolen card still there
            expect(newState.turnPhase).toBe('decide');
            expect(newState.drawnCard).toBeNull();
        });

        it('should steal ALL cards of matching value from ALL players', () => {
            const state = createInitialState();
            state.drawnCard = mockCard('drawn', 5);
            state.players = [
                { id: 'p1', name: 'P1', isAI: false, garden: [], savedCards: [], score: 0 },
                { id: 'p2', name: 'P2', isAI: false, garden: [mockCard('p2c1', 5), mockCard('p2c2', 5)], savedCards: [], score: 0 },
                { id: 'p3', name: 'P3', isAI: false, garden: [mockCard('p3c1', 5)], savedCards: [], score: 0 },
            ];

            const newState = actionStealCards(state);

            expect(newState.players[0].garden).toHaveLength(4); // 1 drawn + 2 from P2 + 1 from P3
            expect(newState.players[1].garden).toHaveLength(0);
            expect(newState.players[2].garden).toHaveLength(0);
            expect(newState.players[0].garden.every(c => c.value === 5)).toBe(true);
        });
    });

    describe('Turn Flow Simulation', () => {
        it('should simulate a full sequence: Draw (auto-keep) -> Draw (steal) -> End Turn', () => {
            let state = createInitialState();
            state.deck = [mockCard('d1', 5), mockCard('d2', 1)];
            state.players[1].garden = [mockCard('p2c1', 1)];

            // 1. First Draw (value 5)
            state = actionDrawCard(state);
            expect(state.players[0].garden).toHaveLength(1); // Added immediately
            expect(state.turnPhase).toBe('decide');
            expect(state.drawnCard).toBeNull();

            // 2. Clear deck for next draw simulation
            state.deck = [mockCard('d2', 1)];

            // 3. Draw again (value 1)
            state = actionDrawCard(state);
            expect(state.players[0].garden).toHaveLength(1); // Still 1 (new one is in drawnCard)
            expect(state.drawnCard?.value).toBe(1);
            expect(state.turnPhase).toBe('steal'); // P2 has a '1'

            // 4. Steal cards
            state = actionStealCards(state);
            expect(state.players[0].garden).toHaveLength(3); // 1st draw(5) + 2nd draw(1) + stolen(1)
            expect(state.players[1].garden).toHaveLength(0);
            expect(state.turnPhase).toBe('decide');

            // 5. End Turn
            state = actionEndTurn(state);
            expect(state.currentPlayerIndex).toBe(1);
            expect(state.players[0].garden).toHaveLength(3); // Cards stay in garden
            expect(state.isFirstDraw).toBe(true);
        });
    });

    it('should transition to steal phase if available', () => {
        const state = createInitialState();
        state.players[1].garden = [mockCard('p2c1', 5)];

        const newState = actionDrawCard(state);
        expect(newState.turnPhase).toBe('steal');
    });

    it('should transition to decide phase if no steal available', () => {
        const state = createInitialState();
        state.deck = [mockCard('d1', 3)];

        const newState = actionDrawCard(state);
        expect(newState.turnPhase).toBe('decide');
    });

    it('should add stolen cards to current player garden', () => {
        const state = createInitialState();
        state.drawnCard = mockCard('drawn', 5);
        state.players[1].garden = [mockCard('p2c1', 5)];

        const newState = actionStealCards(state);
        expect(newState.players[0].garden).toHaveLength(2); // drawn + stolen
        expect(newState.players[1].garden).toHaveLength(0);
        expect(newState.turnPhase).toBe('decide');
    });

    describe('Card Garden Placement', () => {
        it('should add the drawn card to the garden after actionKeepCard', () => {
            const state = createInitialState();
            const cardToDraw = mockCard('d1', 5);
            state.drawnCard = cardToDraw;
            state.turnPhase = 'decide';

            const newState = actionKeepCard(state);

            expect(newState.players[0].garden).toContainEqual(cardToDraw);
            expect(newState.drawnCard).toBeNull();
            expect(newState.turnPhase).toBe('decide');
        });

        it('should add the drawn card AND stolen cards to the garden after actionStealCards', () => {
            const state = createInitialState();
            const cardToDraw = mockCard('drawn', 5);
            state.drawnCard = cardToDraw;
            state.players[1].garden = [mockCard('stolen1', 5)];
            state.turnPhase = 'steal';

            const newState = actionStealCards(state);

            expect(newState.players[0].garden).toContainEqual(cardToDraw);
            expect(newState.players[0].garden.some(c => c.id === 'stolen1')).toBe(true);
            expect(newState.drawnCard).toBeNull();
            expect(newState.turnPhase).toBe('decide');
        });
    });
});
