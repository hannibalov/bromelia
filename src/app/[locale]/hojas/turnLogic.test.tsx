import { describe, it, expect } from 'vitest';
import { processSelection, canPickLeaf } from '@/utils/hojasLogic';
import type { HojasGameState, Leaf } from '@/types/hojas';

const createMockLeaf = (id: string, color: Leaf['color'], type: Leaf['type'], zIndex: number): Leaf => ({
  id, color, type, x: 0, y: 0, rotation: 0, zIndex
});

const createMockState = (leaves: Leaf[] = []): HojasGameState => ({
  gameId: 'test-game',
  players: [
    { id: '1', name: 'P1', isAI: false, collectedPairs: [], singleLeaves: [], score: 0 },
    { id: '2', name: 'AI', isAI: true, collectedPairs: [], singleLeaves: [], score: 0 }
  ],
  currentPlayerIndex: 0,
  leaves,
  gamePhase: 'playing',
  selection: null,
  notification: null
});

describe('Hojas Turn Logic', () => {
  it('cannot pick a leaf that is covered by another', () => {
    const leaf1 = createMockLeaf('1', 'red', 'plain', 0);
    const leaf2 = createMockLeaf('2', 'red', 'plain', 1); // Overlaps leaf1 in logic (to be implemented)
    // For now, we manually mock the overlap dependency or simulate it
    const state = createMockState([leaf1, leaf2]);
    
    // We expect canPickLeaf to use an overlap detection utility
    // Since we haven't implemented overlap detection yet, this test will fail
    expect(canPickLeaf(leaf1, state)).toBe(false); 
    expect(canPickLeaf(leaf2, state)).toBe(true);
  });

  it('finishes turn after picking a plain leaf', () => {
    const leaf = createMockLeaf('1', 'red', 'plain', 0);
    const state = createMockState([leaf]);
    
    const newState = processSelection(leaf, state);
    expect(newState.currentPlayerIndex).toBe(1);
    expect(newState.players[0].singleLeaves).toContain(leaf);
  });

  it('allows picking a fruit after picking a bug of the same color', () => {
    const bug = createMockLeaf('bug1', 'blue', 'bug', 0);
    const fruit = createMockLeaf('fruit1', 'blue', 'fruit', 0);
    const state = createMockState([bug, fruit]);
    
    // First pick bug
    const stateAfterBug = processSelection(bug, state);
    expect(stateAfterBug.selection).toBe(bug);
    expect(stateAfterBug.currentPlayerIndex).toBe(0); // Still P1's turn
    
    // Pick fruit
    const stateAfterFruit = processSelection(fruit, stateAfterBug);
    expect(stateAfterFruit.currentPlayerIndex).toBe(1); // Turn ends
    expect(stateAfterFruit.players[0].collectedPairs).toHaveLength(1);
    expect(stateAfterFruit.players[0].collectedPairs[0]).toEqual({ bug, fruit });
  });

  it('cannot pick a fruit of different color after picking a bug', () => {
    const bug = createMockLeaf('bug1', 'blue', 'bug', 0);
    const fruit = createMockLeaf('fruit1', 'red', 'fruit', 0);
    const state = createMockState([bug, fruit]);
    
    const stateAfterBug = processSelection(bug, state);
    // Trying to pick fruit of different color should not work or not end in a pair
    // The requirement says: "puede escoger otra hoja del mismo color que no este pisada que tenga una fruta"
    // If they can't pick it, the UI should prevent it or the logic should ignore it.
    const stateAfterInvalidFruit = processSelection(fruit, stateAfterBug);
    expect(stateAfterInvalidFruit.selection).toBe(bug); // Still bug selected
    expect(stateAfterInvalidFruit.players[0].collectedPairs).toHaveLength(0);
  });
});
