import { render, waitFor } from '@testing-library/react';
import PlantasPage from '../app/[locale]/plantas/page';
import { useGame } from '../hooks/useGame';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock locales/client
vi.mock('../../locales/client', () => ({
  useI18n: () => (key: string) => key,
  useScopedI18n: () => (key: string) => key,
  useChangeLocale: () => vi.fn(),
  useCurrentLocale: () => 'es',
  I18nProviderClient: ({ children }: { children: unknown }) => <>{children}</>,
}));

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
    notification: null,
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
    clearNotification: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReturnType<typeof useSearchParams>);
  });

  it('should update the URL when gameId is generated', async () => {
    const gameId = 'test-uuid-123';
    // Initially gameId is null, then it becomes 'test-uuid-123'
    const stateWithId = { ...mockState, gameId, gamePhase: 'playing' };
    
    (useGame as unknown as { mockReturnValue: (v: unknown) => void }).mockReturnValue({ ...mockActions, state: stateWithId });

    render(<PlantasPage />);

    await waitFor(() => {
      const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1];
      expect(lastCall[0]).toContain(`id=${gameId}`);
    });
  });
});
