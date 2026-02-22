import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavigationBar from './NavigationBar';

// Mock usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock useI18n from locales/client
vi.mock('../../locales/client', () => ({
  useI18n: () => (key: string) => {
    const messages: Record<string, string> = {
      'nav.back': 'Back to Menu',
    };
    return messages[key] || key;
  },
}));

// Mock LanguageSwitcher
vi.mock('./LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, 'aria-label': ariaLabel, ...props }: any) => (
    <a href={href} aria-label={ariaLabel} {...props}>{children}</a>
  ),
}));

import { usePathname } from 'next/navigation';

describe('NavigationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  });

  it('should not render on the home page (root)', () => {
    (usePathname as any).mockReturnValue('/');
    const { container } = render(<NavigationBar />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render on the home page with locale es', () => {
    (usePathname as any).mockReturnValue('/es');
    const { container } = render(<NavigationBar />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render on the home page with locale en', () => {
    (usePathname as any).mockReturnValue('/en');
    const { container } = render(<NavigationBar />);
    expect(container.firstChild).toBeNull();
  });

  it('should be hidden on desktop by default', () => {
    (usePathname as any).mockReturnValue('/plantas');
    render(<NavigationBar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('-translate-y-full');
    expect(nav.className).toContain('opacity-0');
  });

  it('should reveal on desktop when mouse is near the top', () => {
    (usePathname as any).mockReturnValue('/plantas');
    render(<NavigationBar />);
    
    const nav = screen.getByRole('navigation');
    
    // Simulate mouse move to top
    fireEvent.mouseMove(window, { clientY: 30 });
    
    expect(nav.className).toContain('translate-y-0');
    expect(nav.className).toContain('opacity-100');
    
    // Simulate mouse move away
    fireEvent.mouseMove(window, { clientY: 100 });
    expect(nav.className).toContain('-translate-y-full');
  });

  it('should be always visible on mobile', () => {
    (usePathname as any).mockReturnValue('/plantas');
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    
    render(<NavigationBar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('translate-y-0');
    expect(nav.className).not.toContain('opacity-0');
  });

  it('should show translated label and language switcher', () => {
    (usePathname as any).mockReturnValue('/hojas');
    render(<NavigationBar />);
    
    // Check for the "Back to Menu" text (mocked translation)
    expect(screen.getByText('Back to Menu')).toBeDefined();
    expect(screen.getByText('🏠')).toBeDefined();
    
    // Check for language switcher
    expect(screen.getByTestId('language-switcher')).toBeDefined();
    
    // Check for the link by its accessible name (which comes from aria-label)
    const link = screen.getByRole('link', { name: 'Back to Menu' });
    expect(link.getAttribute('href')).toBe('/');
  });
});
