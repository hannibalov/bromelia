import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePlatform from './HomePlatform';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('HomePlatform', () => {
  it('renders the platform title', () => {
    render(<HomePlatform />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows a Plantas game card', () => {
    render(<HomePlatform />);
    expect(screen.getAllByText(/Plantas/i).length).toBeGreaterThan(0);
  });

  it('has a link to /plantas for the Plantas game', () => {
    render(<HomePlatform />);
    const link = screen.getByRole('link', { name: /Plantas/i });
    expect(link).toHaveAttribute('href', '/plantas');
  });
});
