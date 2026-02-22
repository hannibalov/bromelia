import { describe, it, expect } from 'vitest';
import { actionDrawCard, actionStealCards, actionKeepCard, actionEndTurn, actionContinueTurn, actionAcknowledgeLoss } from './turnActions';
import { actionCollectGarden } from './drawLogic';
import type { GameState, Card, CardValue } from '@/types/game';

describe('Game Turn Integration', () => {
    const mockCard = (id: string, value: CardValue): Card => ({ id, value, imageUrl: '' });

    const createInitialState = (): GameState => ({
        gameId: null,
        players: [
            { id: 'p1', name: 'P1', isAI: false, garden: [], savedCards: [], score: 0 },
            { id: 'p2', name: 'P2', isAI: false, garden: [], savedCards: [], score: 0 },
        ],
        currentPlayerIndex: 0,
        deck: [
            mockCard('d1', 5), // First draw
            mockCard('d2', 3), // Second draw
            mockCard('d_extra', 2), // Extra card to make garden.length >= 3
            mockCard('d3', 5), // Third draw (bust if P1 has 3+ cards and 5)
        ],
        discardPile: [],
        gamePhase: 'playing',
        turnPhase: 'collect',
        drawnCard: null,
        isFirstDraw: true,
        notification: null,
    });

    it('should simulate a successful multi-step turn with stealing', () => {
        let state = createInitialState();

        // P2 has a 5 in garden
        state.players[1].garden = [mockCard('p2c1', 5)];

        // 1. P1 Draws 5
        state = actionDrawCard(state);
        expect(state.turnPhase).toBe('steal');
        expect(state.drawnCard?.value).toBe(5);

        // 2. P1 Steals from P2
        state = actionStealCards(state);
        expect(state.players[0].garden).toHaveLength(2); // drawn 5 + stolen 5
        expect(state.players[1].garden).toHaveLength(0);
        expect(state.turnPhase).toBe('decide');

        // 3. P1 Continues turn
        state = actionContinueTurn(state);
        expect(state.turnPhase).toBe('draw');
        expect(state.drawnCard).toBeNull();

        // 4. P1 Draws 3
        state = actionDrawCard(state);
        expect(state.turnPhase).toBe('decide'); // No one has 3

        // 5. P1 Keeps 3
        state = actionKeepCard(state);
        expect(state.players[0].garden).toHaveLength(3); // (5,5) + 3

        // 6. P1 Ends turn
        state = actionEndTurn(state);
        expect(state.currentPlayerIndex).toBe(1);
        expect(state.turnPhase).toBe('collect');
        expect(state.isFirstDraw).toBe(true);
    });

    it('should simulate a turn ending in a bust', () => {
        let state = createInitialState();

        // 1. P1 Draws 5
        state = actionDrawCard(state);
        state = actionKeepCard(state);
        expect(state.players[0].garden).toHaveLength(1);

        // 3. P1 Draws 3
        state = actionDrawCard(state);
        state = actionKeepCard(state);
        expect(state.players[0].garden).toHaveLength(2);

        // 4. P1 Continues
        state = actionContinueTurn(state);
        expect(state.turnPhase).toBe('draw');

        // 5. P1 Draws 2
        state = actionDrawCard(state);
        state = actionKeepCard(state);
        expect(state.players[0].garden).toHaveLength(3);

        // 6. P1 Continues
        state = actionContinueTurn(state);
        expect(state.turnPhase).toBe('draw');

        // 7. P1 Draws 5 (BUST!)
        state = actionDrawCard(state);
        expect(state.turnPhase).toBe('lost');

        // 8. P1 Acknowledges loss
        state = actionAcknowledgeLoss(state);
        expect(state.players[0].garden).toHaveLength(0);
        expect(state.discardPile).toHaveLength(4); // 5, 3, 2 + the final 5
        expect(state.currentPlayerIndex).toBe(1);
    });

    it('should secure previous garden on the first draw of a new turn', () => {
        let state = createInitialState();

        // P1 already has some cards in garden from a "previous turn" (simulation)
        state.players[0].garden = [mockCard('old1', 10)];
        state.isFirstDraw = true;

        // 1. P1 Draws
        state = actionDrawCard(state);

        // Garden should be secured (previous points)
        expect(state.players[0].savedCards).toHaveLength(1);
        expect(state.players[0].savedCards[0].value).toBe(10);
        expect(state.players[0].score).toBe(10);

        // However, the new card (5) is added immediately because NO ONE HAS A 5.
        expect(state.players[0].garden).toHaveLength(1);
        expect(state.players[0].garden[0].value).toBe(5);
        expect(state.drawnCard).toBeNull();
    });

    it('should correctly transition state between two consecutive AI players', () => {
        let state = createInitialState();
        state.players[0].isAI = true;
        state.players[1].isAI = true;
        state.currentPlayerIndex = 0;

        // P1 ends turn
        state = actionEndTurn(state);

        expect(state.currentPlayerIndex).toBe(1);
        expect(state.players[1].isAI).toBe(true);
        expect(state.turnPhase).toBe('collect');
        expect(state.drawnCard).toBeNull();

        // Simulate P2's first action logic (Collect)
        // This confirms the STATE is ready for P2 to act, even if the Hook fails.
        const stateAfterCollect = actionCollectGarden(state);
        expect(stateAfterCollect.turnPhase).toBe('draw');
    });
});
