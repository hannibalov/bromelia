import type { Leaf, HojasGameState, HojasPlayer } from '@/types/hojas';
import { isLeafCovered } from './hojasOverlap';

export const TOTAL_LEAVES = 60;
export const COLORS: Leaf['color'][] = ['red', 'green', 'yellow', 'blue'];

export function createHojasDeck(): Leaf[] {
    const leaves: Leaf[] = [];
    const types: Leaf['type'][] = ['plain', 'fruit', 'bug'];

    for (let i = 0; i < TOTAL_LEAVES; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const type = types[Math.floor(Math.random() * types.length)];

        leaves.push({
            id: `leaf-${i}`,
            color,
            type,
            x: 10 + Math.random() * 80, // 10% to 90%
            y: 10 + Math.random() * 80, // 10% to 90%
            rotation: Math.random() * 360,
            zIndex: i,
        });
    }
    return leaves;
}

export function canPickLeaf(leaf: Leaf, state: HojasGameState): boolean {
    return !isLeafCovered(leaf.id, state.leaves);
}

export function processSelection(leaf: Leaf, state: HojasGameState): HojasGameState {
    const newState = { ...state, leaves: [...state.leaves], players: [...state.players] };
    const currentPlayer = newState.players[newState.currentPlayerIndex];
    const updatedPlayer = { ...currentPlayer, collectedPairs: [...currentPlayer.collectedPairs], singleLeaves: [...currentPlayer.singleLeaves] };
    newState.players[newState.currentPlayerIndex] = updatedPlayer;

    if (!canPickLeaf(leaf, state)) return state;

    // Remove leaf from table
    newState.leaves = newState.leaves.filter(l => l.id !== leaf.id);

    if (!state.selection) {
        // First pick of the turn
        if (leaf.type === 'plain') {
            updatedPlayer.singleLeaves.push(leaf);
            return endTurn(newState);
        } else {
            // It's a bug or a fruit
            return { ...newState, selection: leaf };
        }
    } else {
        // Second pick of the turn
        const firstLeaf = state.selection;

        // Check if it completes a pair
        const isPair = (
            firstLeaf.color === leaf.color &&
            ((firstLeaf.type === 'bug' && leaf.type === 'fruit') ||
                (firstLeaf.type === 'fruit' && leaf.type === 'bug'))
        );

        if (isPair) {
            updatedPlayer.collectedPairs.push({
                bug: firstLeaf.type === 'bug' ? firstLeaf : leaf,
                fruit: firstLeaf.type === 'fruit' ? firstLeaf : leaf,
            });
            return endTurn({ ...newState, selection: null });
        } else {
            // Not a valid pair - according to requirements, we only pick the second one if it matches the color and "the other type"
            // "Si la hoja que ha escogido tiene un bicho, puede escoger otra hoja del mismo color que no este pisada que tenga una fruta."
            // If they pick something else, we ignore it or finish turn?
            // Re-reading: "Despues de escoger una hoja suelta o una pareja, acaba tu turno"
            // This implies if they pick a bug, then something that IS NOT a fruit of same color, they can't pick it?
            // Or they pick it and it doesn't count as a pair?
            // Actually, if they picked a bug, they CAN pick a fruit of same color. If they pick something else, let's say they just keep the first one as single and end turn.
            // But the rules say: "Si solo consigues una hoja, la pones en una pila por separado."

            // Let's assume if they click an invalid second card, nothing happens, they must click a valid one or we could add a "Finish Turn" button.
            // But let's stay simple: if they click something that doesn't form a pair, we just don't let them pick it.
            return state;
        }
    }
}

function endTurn(state: HojasGameState): HojasGameState {
    const newState = { ...state };
    // Update scores for all players
    newState.players = newState.players.map(p => ({
        ...p,
        score: (p.collectedPairs.length * 100) + p.singleLeaves.length
    }));

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    return {
        ...newState,
        currentPlayerIndex: nextPlayerIndex,
        selection: null,
    };
}

export function calculateWinner(players: HojasPlayer[]): HojasPlayer | null {
    if (players.length === 0) return null;

    return [...players].sort((a, b) => {
        if (b.collectedPairs.length !== a.collectedPairs.length) {
            return b.collectedPairs.length - a.collectedPairs.length;
        }
        return b.singleLeaves.length - a.singleLeaves.length;
    })[0];
}
