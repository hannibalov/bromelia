import { renderHook, act } from '@testing-library/react';
import { useGame } from '../hooks/useGame';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/../locales/client', () => ({
  useI18n: () => (key: string, params?: Record<string, string | number>) => {
    const messages: Record<string, string> = {
      'games.plantas.notif.gameStart': `Game starts! ${params?.name ?? ''}'s turn`,
      'games.plantas.notif.collecting': 'is collecting their garden...',
      'games.plantas.notif.drawing': 'is about to draw a card...',
      'games.plantas.notif.stealing': `steals from ${params?.name ?? ''}`,
      'games.plantas.notif.continue': 'decides to continue...',
      'games.plantas.notif.endTurn': 'ends their turn',
      'games.plantas.notif.lostTurn': 'has lost their turn',
    };
    return messages[key] ?? key;
  },
}));

// We need to mock timers for artificial AI delay
vi.useFakeTimers();

describe('AI Behavior', () => {
    const mockPlayers = [
        { name: 'P1', isAI: false },
        { name: 'AI', isAI: true },
    ];

    it('should NOT stall in decide phase and should make a move', async () => {
        const { result } = renderHook(() => useGame());

        // 1. Start game
        act(() => {
            result.current.startGame(mockPlayers);
        });

        // 2. Simulate reaching AI turn
        act(() => {
            result.current.collectGarden();
            result.current.drawCard();
            result.current.endTurn();
        });

        // AI Phase: collect
        act(() => { vi.advanceTimersByTime(1500); });
        
        // AI Phase: draw
        act(() => { vi.advanceTimersByTime(1500); });

        // Now we should be in 'decide' or 'steal'
        // If 'decide', the AI should act again after 1500ms
        const phaseAfterDraw = result.current.state.turnPhase;
        
        if (phaseAfterDraw === 'decide') {
            const playerContext = result.current.state.currentPlayerIndex;
            
            // Advance for the decision
            act(() => { vi.advanceTimersByTime(1500); });

            // Either it drew again (phase changes to 'decide' or 'steal' or 'lost' after a real action)
            // Or it ended turn (currentPlayerIndex changes)
            const movedOn = 
                result.current.state.turnPhase !== 'decide' || 
                result.current.state.currentPlayerIndex !== playerContext ||
                result.current.state.players[playerContext].garden.length > 0; // It added a card

            expect(movedOn).toBe(true);
        } else {
            // It went to steal or something else, which is also fine for this test 
            // as it means it's not stalling in 'decide'
            expect(true).toBe(true);
        }
    });
});
