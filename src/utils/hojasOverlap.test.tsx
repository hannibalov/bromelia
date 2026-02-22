import { describe, it, expect } from 'vitest';
import { isLeafCovered } from '@/utils/hojasOverlap';
import { Leaf } from '@/types/hojas';

describe('Hojas Overlap Logic', () => {
  const leafBase: Leaf = {
    id: 'base', color: 'green', type: 'plain',
    x: 50, y: 50, rotation: 0, zIndex: 0
  };

  it('leaf is not covered if it is the only one', () => {
    expect(isLeafCovered(leafBase.id, [leafBase])).toBe(false);
  });

  it('leaf is covered if another leaf with higher zIndex overlaps its bounding box', () => {
    const coveringLeaf: Leaf = {
      ...leafBase,
      id: 'top',
      zIndex: 1,
      x: 51, y: 51 // Very close overlap
    };
    expect(isLeafCovered(leafBase.id, [leafBase, coveringLeaf])).toBe(true);
  });

  it('leaf is NOT covered if another leaf is BELOW it (lower zIndex)', () => {
    const bottomLeaf: Leaf = {
      ...leafBase,
      id: 'bottom',
      zIndex: -1,
      x: 50, y: 50
    };
    expect(isLeafCovered(leafBase.id, [leafBase, bottomLeaf])).toBe(false);
  });

  it('leaf is NOT covered if another leaf is far away', () => {
    const farLeaf: Leaf = {
      ...leafBase,
      id: 'far',
      zIndex: 1,
      x: 10, y: 10
    };
    expect(isLeafCovered(leafBase.id, [leafBase, farLeaf])).toBe(false);
  });
});
