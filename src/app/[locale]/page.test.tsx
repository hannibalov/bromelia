import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '@/app/[locale]/page';

// Mock locales/client
vi.mock('@/../locales/client', () => ({
  useI18n: () => (key: string) => {
    const messages: Record<string, string> = {
      'home.description': 'Plataforma de juegos de mesa',
      'home.selectGame': 'Juegos disponibles',
      'games.play': 'Jugar',
    };
    return messages[key] || key;
  },
  useScopedI18n: (scope: string) => (key: string) => {
    const messages: Record<string, string> = {
      'games.plantas.name': 'Plantas',
      'games.plantas.description': 'Un juego de cartas con plantas.',
      'games.hojas.name': 'Hojas',
      'games.hojas.description': '¡Recoge hojas de la mesa!',
    };
    const fullKey = `${scope}.${key}`;
    return messages[fullKey] || key;
  },
  useChangeLocale: () => vi.fn(),
  useCurrentLocale: () => 'es',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Platform Home Page', () => {
  it('renders the platform homepage', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows the Plantas game card', () => {
    render(<Home />);
    expect(screen.getAllByText(/Plantas/i).length).toBeGreaterThan(0);
  });

  it('shows a link to the Plantas game', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /Plantas/i });
    expect(link).toHaveAttribute('href', '/plantas');
  });
});
