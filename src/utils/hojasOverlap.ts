import { Leaf } from '@/types/hojas';

// Approximate size of a leaf for overlap calculations
const LEAF_WIDTH = 15; // Percent of table width
const LEAF_HEIGHT = 15; // Percent of table height
// Hitbox factor to account for transparency at the edges
const HITBOX_FACTOR = 0.7;

export function isLeafCovered(leafId: string, allLeaves: Leaf[]): boolean {
    const targetLeaf = allLeaves.find(l => l.id === leafId);
    if (!targetLeaf) return false;

    const targetBox = getHitbox(targetLeaf);

    // Check all leaves with a higher zIndex
    return allLeaves.some(otherLeaf => {
        if (otherLeaf.id === targetLeaf.id) return false;
        if (otherLeaf.zIndex <= targetLeaf.zIndex) return false;

        const otherBox = getHitbox(otherLeaf);
        return boxesOverlap(targetBox, otherBox);
    });
}

interface Box {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

function getHitbox(leaf: Leaf): Box {
    const w = LEAF_WIDTH * HITBOX_FACTOR;
    const h = LEAF_HEIGHT * HITBOX_FACTOR;
    return {
        x1: leaf.x - w / 2,
        y1: leaf.y - h / 2,
        x2: leaf.x + w / 2,
        y2: leaf.y + h / 2,
    };
}

function boxesOverlap(a: Box, b: Box): boolean {
    return !(a.x1 > b.x2 || a.x2 < b.x1 || a.y1 > b.y2 || a.y2 < b.y1);
}
