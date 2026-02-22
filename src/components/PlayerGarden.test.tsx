import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PlayerGarden from './PlayerGarden';
import { type Player } from '@/types/game';

describe('PlayerGarden', () => {
  const mockPlayer: Player = {
    id: 'p1',
    name: 'Player 1',
    isAI: false,
    score: 0,
    garden: [],
    savedCards: []
  };

  beforeEach(() => {
    // Mock scrollIntoView since it's not implemented in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scrolls into view when it becomes the current player', async () => {
    const { rerender } = render(<PlayerGarden player={mockPlayer} isCurrentPlayer={false} />);
    
    // Should not scroll initially if not current player
    expect(window.HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();

    // Rerender as current player
    rerender(<PlayerGarden player={mockPlayer} isCurrentPlayer={true} />);

    // Fast-forward the 100ms timeout
    vi.advanceTimersByTime(150);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest'
    });
  });

  it('scrolls into view on initial render if already current player', () => {
    render(<PlayerGarden player={mockPlayer} isCurrentPlayer={true} />);

    // Fast-forward the 100ms timeout
    vi.advanceTimersByTime(150);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest'
    });
  });
});
