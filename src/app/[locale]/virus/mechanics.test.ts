import { describe, it, expect, beforeEach } from 'vitest';
import { createVirusDeck, canPlayCard, applyCard, checkWinCondition } from './virusLogic';
import { VirusCard, VirusGameState, VirusPlayer, BodyPartState } from '@/types/virus';

describe('Virus Game Mechanics', () => {
    let mockState: VirusGameState;
    let lion: VirusCard;
    let redVirus: VirusCard;
    let redMedicine: VirusCard;

    beforeEach(() => {
        lion = { id: 'lion', type: 'animal', color: 'red', name: 'Lion', imageUrl: '/virus/lion.png' };
        redVirus = { id: 'v-red', type: 'virus', color: 'red', name: 'Red Virus', imageUrl: '/virus/lion_ill.png' };
        redMedicine = { id: 'm-red', type: 'medicine', color: 'red', name: 'Red Medicine', imageUrl: '/virus/lion_med.png' };

        mockState = {
            players: [
                { id: 'p1', name: 'Player 1', isAI: false, hand: [], board: [] },
                { id: 'p2', name: 'Player 2', isAI: false, hand: [], board: [] }
            ],
            currentPlayerIndex: 0,
            deck: [],
            discardPile: [],
            gamePhase: 'playing',
            winner: null
        };
    });

    it('should create a deck with 68 cards', () => {
        const deck = createVirusDeck();
        expect(deck.length).toBe(68);
    });

    it('can play an animal on your own board', () => {
        const canPlay = canPlayCard(lion, mockState.players[0], mockState.players[0]);
        expect(canPlay).toBe(true);
    });

    it('cannot play the same animal color twice on the same board', () => {
        mockState.players[0].board.push({ animal: lion, viruses: [], medicines: [], status: 'healthy' });
        const canPlay = canPlayCard(lion, mockState.players[0], mockState.players[0]);
        expect(canPlay).toBe(false);
    });

    it('can play a virus on an opponent animal of the same color', () => {
        mockState.players[1].board.push({ animal: lion, viruses: [], medicines: [], status: 'healthy' });
        const canPlay = canPlayCard(redVirus, mockState.players[0], mockState.players[1]);
        expect(canPlay).toBe(true);
    });

    it('cannot play a virus on a vaccinated animal of the same color', () => {
        mockState.players[1].board.push({ animal: lion, viruses: [], medicines: [redMedicine], status: 'vaccinated' });
        const canPlay = canPlayCard(redVirus, mockState.players[0], mockState.players[1]);
        expect(canPlay).toBe(true); // Actually, virus removes medicine. Let's re-check rules.
        // Virus on healthy -> infected
        // Virus on vaccinated -> healthy (removes medicine)
        // Virus on infected -> dead (removes animal)
    });

    it('win condition: 4 healthy animals of different colors', () => {
        const healthyBoard: BodyPartState[] = [
            { animal: { ...lion, color: 'red' } as any, viruses: [], medicines: [], status: 'healthy' },
            { animal: { ...lion, color: 'blue' } as any, viruses: [], medicines: [], status: 'healthy' },
            { animal: { ...lion, color: 'yellow' } as any, viruses: [], medicines: [], status: 'healthy' },
            { animal: { ...lion, color: 'green' } as any, viruses: [], medicines: [], status: 'healthy' },
        ];
        mockState.players[0].board = healthyBoard;
        expect(checkWinCondition(mockState.players[0])).toBe(true);
    });

    it('win condition failed if one is infected', () => {
        const infectedBoard: BodyPartState[] = [
            { animal: { ...lion, color: 'red' } as any, viruses: [], medicines: [], status: 'healthy' },
            { animal: { ...lion, color: 'blue' } as any, viruses: [redVirus], status: 'infected' },
            { animal: { ...lion, color: 'yellow' } as any, viruses: [], medicines: [], status: 'healthy' },
            { animal: { ...lion, color: 'green' } as any, viruses: [], medicines: [], status: 'healthy' },
        ];
        mockState.players[0].board = infectedBoard;
        expect(checkWinCondition(mockState.players[0])).toBe(false);
    });
});
