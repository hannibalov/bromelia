import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePlatform from '@/components/HomePlatform';

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

describe('Hojas Navigation', () => {
  it('shows the Hojas game card on the platform home', () => {
    render(<HomePlatform />);
    expect(screen.getByRole('heading', { name: /Hojas/i })).toBeInTheDocument();
  });

  it('has a link to /hojas', () => {
    render(<HomePlatform />);
    const link = screen.getByRole('link', { name: /Hojas/i });
    expect(link).toHaveAttribute('href', '/hojas');
  });
});
