import { render, screen, fireEvent } from '@testing-library/react';
import SetupScreen from './SetupScreen';
import { describe, it, expect, vi } from 'vitest';

describe('SetupScreen', () => {
  it('should start with an empty player list and disabled start button', () => {
    const onStartGame = vi.fn();
    render(<SetupScreen onStartGame={onStartGame} />);
    
    expect(screen.getByText(/Jugadores \(0\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Añade al menos 2 jugadores/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Empezar Juego/i })).toBeDisabled();
  });

  it('should allow adding human and AI players', () => {
    const onStartGame = vi.fn();
    render(<SetupScreen onStartGame={onStartGame} />);
    
    const input = screen.getByPlaceholderText(/Nombre/i);
    const addButton = screen.getByRole('button', { name: /Añadir/i });
    const typeToggle = screen.getByTitle(/AI/i);

    // Add Human
    fireEvent.change(input, { target: { value: 'Rodrigo' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Rodrigo')).toBeInTheDocument();
    expect(screen.getByText(/Jugadores \(1\)/i)).toBeInTheDocument();

    // Toggle to AI and add
    fireEvent.click(typeToggle);
    fireEvent.change(input, { target: { value: 'Bot' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Bot')).toBeInTheDocument();
    expect(screen.getAllByText('🤖 AI')).toHaveLength(2); // One in toggle, one in list
    expect(screen.getByText(/Jugadores \(2\)/i)).toBeInTheDocument();
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
