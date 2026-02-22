
import { render, screen, act } from '@testing-library/react';
import Snackbar from '@/components/Snackbar';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Snackbar Auto-Close', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call onClose after the specified duration', () => {
    const onClose = vi.fn();
    render(
      <Snackbar 
        message="Test Message" 
        type="info" 
        isOpen={true} 
        duration={2000} 
        onClose={onClose} 
      />
    );

    // Should be visible initially
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('should NOT call onClose if onClose prop is missing', () => {
    // This reproduces the current "bug" / missing feature if the prop is not passed
    render(
      <Snackbar 
        message="Test Message" 
        type="info" 
        isOpen={true} 
        duration={2000} 
        // No onClose
      />
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // We can't spy on a missing prop, but this confirms the component doesn't crash
  });
});
