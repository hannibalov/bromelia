import { render, screen } from '@testing-library/react';
import PlantasPage from '@/app/[locale]/plantas/page';
import { useGame } from '@/hooks/useGame';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock locales/client
vi.mock('@/../locales/client', () => ({
  useI18n: () => (key: string) => {
    const messages: Record<string, string> = {
      'games.setup.title': 'Finalizar Configuración',
      'games.finished.title': '¡Fin del Juego!',
    };
    return messages[key] || key;
  },
  useScopedI18n: (scope: string) => (key: string) => {
    const messages: Record<string, string> = {
      'games.plantas.name': 'Plantas',
    };
    const fullKey = `${scope}.${key}`;
    return messages[fullKey] || key;
  },
}));

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
  });

  it('should render SetupScreen when gamePhase is setup', () => {
    vi.mocked(useGame).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'setup' as const } } as unknown as ReturnType<typeof useGame>);
    render(<PlantasPage />);
    expect(screen.getByText(/Finalizar Configuración/i)).toBeInTheDocument();
  });

  it('should render GameScreen when gamePhase is playing', () => {
    vi.mocked(useGame).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'playing' as const } } as unknown as ReturnType<typeof useGame>);
    render(<PlantasPage />);
    expect(screen.getByText(/Turno de/i)).toBeInTheDocument();
  });

  it('should render FinishedScreen when gamePhase is finished', () => {
    vi.mocked(useGame).mockReturnValue({ ...mockActions, state: { ...mockState, gamePhase: 'finished' as const } } as unknown as ReturnType<typeof useGame>);
    render(<PlantasPage />);
    expect(screen.getByText(/Fin del Juego/i)).toBeInTheDocument();
  });
});
