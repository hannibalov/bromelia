import { render, screen } from '@testing-library/react';
import PlantasPage from '@/app/plantas/page';
import { useGame } from '@/hooks/useGame';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useGame hook
vi.mock('@/hooks/useGame');

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

describe('Plantas Game Page Rendering', () => {
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
    clearNotification: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render SetupScreen when gamePhase is setup', () => {
    (useGame as any).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'setup' } });
    render(<PlantasPage />);
    expect(screen.getByText(/Finalizar Configuración/i)).toBeInTheDocument();
  });

  it('should render GameScreen when gamePhase is playing', () => {
    (useGame as any).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'playing' } });
    render(<PlantasPage />);
    expect(screen.getByText(/Turno de/i)).toBeInTheDocument();
  });

  it('should render FinishedScreen when gamePhase is finished', () => {
    (useGame as any).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'finished' } });
    render(<PlantasPage />);
    expect(screen.getByText(/¡Fin del Juego!/i)).toBeInTheDocument();
  });
});
