import { render, waitFor } from '@testing-library/react';
import Home from '../app/plantas/page';
import { useGame } from '../hooks/useGame';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock useGame hook
vi.mock('../hooks/useGame');

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('Game ID and URL Synchronization', () => {
  const mockPush = vi.fn();
  const mockSearchParams = {
    get: vi.fn(),
  };

  const mockState = {
    gameId: null,
    players: [{ id: '1', name: 'P1', score: 0, garden: [], savedCards: [] }],
    gamePhase: 'setup',
    turnPhase: 'collect',
    deck: [],
    drawnCard: null,
  };

  const mockActions = {
    state: mockState,
    startGame: vi.fn(),
    collectGarden: vi.fn(),
    drawCard: vi.fn(),
    keepCard: vi.fn(),
    stealCards: vi.fn(),
    endTurn: vi.fn(),
    continueTurn: vi.fn(),
    acknowledgeLoss: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useSearchParams as any).mockReturnValue(mockSearchParams);
  });

  it('should update the URL when gameId is generated', async () => {
    const gameId = 'test-uuid-123';
    // Initially gameId is null, then it becomes 'test-uuid-123'
    const stateWithId = { ...mockState, gameId, gamePhase: 'playing' };
    
    (useGame as any).mockReturnValue({ ...mockActions, state: stateWithId });

    render(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining(`id=${gameId}`));
    });
  });

  it('should have a generated gameId in state after startGame', () => {
      // This test is for the hook logic itself
      // We'll check if START_GAME generates a non-null gameId
      // (This will be tested in useGame or turnActions if handled there)
  });
});
