import { describe, it, expect } from 'vitest';
import { calculateWinner } from '@/utils/hojasLogic';
import { HojasPlayer } from '@/types/hojas';

describe('Hojas Game Mechanics', () => {
  it('determines winner based on most pairs', () => {
    const p1: HojasPlayer = { 
        id: '1', name: 'P1', isAI: false, 
        collectedPairs: [{} as any, {} as any], // 2 pairs
        singleLeaves: [], score: 0 
    };
    const p2: HojasPlayer = { 
        id: '2', name: 'P2', isAI: false, 
        collectedPairs: [{} as any], // 1 pair
        singleLeaves: [{} as any, {} as any, {} as any], // 3 singles
        score: 0 
    };
    
    const winner = calculateWinner([p1, p2]);
    expect(winner).toBe(p1);
  });

  it('determines winner based on singles in case of a tie in pairs', () => {
    const p1: HojasPlayer = { 
        id: '1', name: 'P1', isAI: false, 
        collectedPairs: [{} as any], 
        singleLeaves: [{} as any], // 1 single
        score: 0 
    };
    const p2: HojasPlayer = { 
        id: '2', name: 'P2', isAI: false, 
        collectedPairs: [{} as any], 
        singleLeaves: [{} as any, {} as any], // 2 singles
        score: 0 
    };
    
    const winner = calculateWinner([p1, p2]);
    expect(winner).toBe(p2);
  });
});
