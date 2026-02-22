import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout from './layout';
import React from 'react';

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

// Mock I18nProviderClient to check if it receives the locale
vi.mock('../../../locales/client', () => ({
  I18nProviderClient: ({ children, locale }: { children: React.ReactNode; locale: string }) => (
    <div data-testid="i18n-provider" data-locale={locale}>
      {children}
    </div>
  ),
}));

// Mock NavigationBar
vi.mock('@/components/NavigationBar', () => ({
  default: () => <nav>NavigationBar</nav>,
}));

describe('Localized RootLayout', () => {
  it('correctly passes the locale to I18nProviderClient', async () => {
    // Mock the params as a promise since it's an async layout in Next.js 15
    const params = Promise.resolve({ locale: 'en' });
    
    // @ts-ignore - Next.js 15 layout params type complexity
    const { container } = render(await RootLayout({ 
      children: <div>Content</div>, 
      params 
    }));

    const provider = container.querySelector('[data-testid="i18n-provider"]');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveAttribute('data-locale', 'en');
  });

  it('renders children correctly', async () => {
    const params = Promise.resolve({ locale: 'es' });
    
    // @ts-ignore
    const { getByText } = render(await RootLayout({ 
      children: <div>Test Content</div>, 
      params 
    }));

    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
