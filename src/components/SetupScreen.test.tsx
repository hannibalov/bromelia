import { render, screen, fireEvent } from '@testing-library/react';
import SetupScreen from './SetupScreen';
import { describe, it, expect, vi } from 'vitest';

// Mock locales/client
vi.mock('@/../locales/client', () => ({
  useI18n: () => (key: string) => {
    const messages: Record<string, string> = {
      'games.setup.players': 'Jugadores ({count})',
      'games.setup.noPlayers': 'Añade al menos 2 jugadores para empezar',
      'games.setup.start': 'Empezar Juego',
      'games.setup.add': 'Añadir',
      'games.setup.ai': 'AI',
      'games.setup.human': 'Humano',
      'games.setup.remove': 'Eliminar',
      'games.setup.addPlayer': 'Añadir Jugador',
      'games.setup.namePlaceholder': 'Nombre',
    };
    
    // Simple mock for parameters
    if (key === 'games.setup.players') return 'Jugadores (0)';
    
    return messages[key] || key;
  },
}));

describe('SetupScreen', () => {
  it('should start with an empty player list and disabled start button', () => {
    const onStartGame = vi.fn();
    render(<SetupScreen onStartGame={onStartGame} />);
    
    expect(screen.getByRole('heading', { name: /Jugadores/i })).toBeInTheDocument();
    expect(screen.getByText(/Añade al menos 2 jugadores/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Empezar Juego/i })).toBeDisabled();
  });

  it('should allow adding human and AI players', () => {
    const onStartGame = vi.fn();
    render(<SetupScreen onStartGame={onStartGame} />);
    
    const input = screen.getByPlaceholderText(/Nombre/i);
    // Find button by role and text
    const addButton = screen.getByRole('button', { name: /Añadir/i });
    
    // Toggle button is the one with 👤 or 🤖
    const typeToggle = screen.getByRole('button', { name: /👤/i });

    // Add Human
    fireEvent.change(input, { target: { value: 'Rodrigo' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Rodrigo')).toBeInTheDocument();

    // Toggle to AI and add
    fireEvent.click(typeToggle);
    fireEvent.change(input, { target: { value: 'Bot' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Bot')).toBeInTheDocument();
    expect(screen.getAllByText(/AI/i).length).toBeGreaterThan(0);
  });

  it('should enable start button when 2 players are added', () => {
    const onStartGame = vi.fn();
    render(<SetupScreen onStartGame={onStartGame} />);
    
    const input = screen.getByPlaceholderText(/Nombre/i);
    const addButton = screen.getByRole('button', { name: /Añadir/i });

    fireEvent.change(input, { target: { value: 'P1' } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: 'P2' } });
    fireEvent.click(addButton);

    const startButton = screen.getByRole('button', { name: /Empezar Juego/i });
    expect(startButton).toBeEnabled();
    
    fireEvent.click(startButton);
    expect(onStartGame).toHaveBeenCalledWith([
      { name: 'P1', isAI: false },
      { name: 'P2', isAI: false }
    ]);
  });
});
