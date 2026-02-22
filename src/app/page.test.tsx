import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '@/app/page';

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
    // The card has both a heading and a description mentioning "Plantas"
    expect(screen.getAllByText(/Plantas/i).length).toBeGreaterThan(0);
  });

  it('shows a link to the Plantas game', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /Plantas/i });
    expect(link).toHaveAttribute('href', '/plantas');
  });
});
