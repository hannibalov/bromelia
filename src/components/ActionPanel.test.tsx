import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionPanel from './ActionPanel';
import { type Card as CardType } from '@/types/game';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/../locales/client', () => ({
  useI18n: () => (key: string) => {
    const messages: Record<string, string> = {
      'games.plantas.turnOf': 'Turn of',
      'games.plantas.deckAlt': 'Deck',
      'games.plantas.drawnCard': 'You drew:',
      'games.plantas.stealPromptTap': 'Tap a garden to steal, or keep the card.',
      'games.plantas.keepCard': 'Keep Card',
      'games.plantas.lostTurn': 'Turn Lost!',
      'games.plantas.lostTurnHint': 'You already had it in your garden.',
      'games.plantas.passTurn': 'Pass Turn',
      'games.plantas.whatToDo': 'What do you want to do?',
      'games.plantas.drawAnother': 'Draw Another',
      'games.plantas.endTurn': 'End Turn',
      'games.plantas.collectPlants': 'Collect Plants',
      'games.plantas.collectHint': 'Save the plants to your points zone',
      'games.plantas.drawFirst': 'Draw First Card',
    };
    return messages[key] ?? key;
  },
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img src={src} alt={alt} data-testid="deck-image" />
  ),
}));

const mockCard: CardType = {
  id: 'c1',
  value: 5,
  imageUrl: '/plantas/5.png',
};

const defaultProps = {
  currentPlayerName: 'Alice',
  deckCount: 42,
  drawnCard: null,
  turnPhase: 'collect' as const,
  gardenEmpty: false,
  onCollect: vi.fn(),
  onDraw: vi.fn(),
  onKeep: vi.fn(),
  onContinue: vi.fn(),
  onEndTurn: vi.fn(),
  onAcknowledgeLoss: vi.fn(),
};

describe('ActionPanel', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders turn header with player name and deck count', () => {
    render(<ActionPanel {...defaultProps} />);
    expect(screen.getByText('Turn of')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  describe('Collect phase', () => {
    it('shows Collect Plants button when garden is not empty', async () => {
      const onCollect = vi.fn();
      render(
        <ActionPanel
          {...defaultProps}
          turnPhase="collect"
          gardenEmpty={false}
          onCollect={onCollect}
        />
      );
      const button = screen.getByRole('button', { name: /collect plants/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(onCollect).toHaveBeenCalledTimes(1);
    });

    it('shows Draw First Card when garden is empty', async () => {
      const onDraw = vi.fn();
      render(
        <ActionPanel
          {...defaultProps}
          turnPhase="collect"
          gardenEmpty={true}
          onDraw={onDraw}
        />
      );
      const button = screen.getByRole('button', { name: /draw first card/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(onDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Draw phase', () => {
    it('shows Draw First Card button', async () => {
      const onDraw = vi.fn();
      render(
        <ActionPanel {...defaultProps} turnPhase="draw" onDraw={onDraw} />
      );
      const button = screen.getByRole('button', { name: /draw first card/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(onDraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('Decide phase', () => {
    it('shows Draw Another and End Turn buttons', async () => {
      const onDraw = vi.fn();
      const onEndTurn = vi.fn();
      render(
        <ActionPanel
          {...defaultProps}
          turnPhase="decide"
          drawnCard={null}
          onDraw={onDraw}
          onEndTurn={onEndTurn}
        />
      );
      expect(screen.getByText('What do you want to do?')).toBeInTheDocument();
      const drawBtn = screen.getByRole('button', { name: /draw another/i });
      const endBtn = screen.getByRole('button', { name: /end turn/i });
      expect(drawBtn).toBeInTheDocument();
      expect(endBtn).toBeInTheDocument();

      await user.click(drawBtn);
      expect(onDraw).toHaveBeenCalledTimes(1);

      await user.click(endBtn);
      expect(onEndTurn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Steal phase (with drawn card)', () => {
    it('shows Keep Card button when card is drawn', async () => {
      const onKeep = vi.fn();
      render(
        <ActionPanel
          {...defaultProps}
          turnPhase="steal"
          drawnCard={mockCard}
          onKeep={onKeep}
        />
      );
      expect(screen.getByText('Tap a garden to steal, or keep the card.')).toBeInTheDocument();
      const button = screen.getByRole('button', { name: /keep card/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(onKeep).toHaveBeenCalledTimes(1);
    });
  });

  describe('Lost phase', () => {
    it('shows lost message and Pass Turn button', async () => {
      const onAcknowledgeLoss = vi.fn();
      render(
        <ActionPanel
          {...defaultProps}
          turnPhase="lost"
          drawnCard={mockCard}
          onAcknowledgeLoss={onAcknowledgeLoss}
        />
      );
      expect(screen.getByText(/turn lost!/i)).toBeInTheDocument();
      expect(screen.getByText(/you already had it in your garden/i)).toBeInTheDocument();
      const button = screen.getByRole('button', { name: /pass turn/i });
      expect(button).toBeInTheDocument();
      await user.click(button);
      expect(onAcknowledgeLoss).toHaveBeenCalledTimes(1);
    });
  });
});
