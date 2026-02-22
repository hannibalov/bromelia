'use client';

import { HojasGameState, Leaf } from '@/types/hojas';
import { canPickLeaf } from '@/utils/hojasLogic';
import Snackbar from './Snackbar';

interface HojasGameScreenProps {
  state: HojasGameState;
  onPickLeaf: (leafId: string) => void;
  onClearNotification: () => void;
}

export default function HojasGameScreen({ state, onPickLeaf, onClearNotification }: HojasGameScreenProps) {
  const currentPlayer = state.players[state.currentPlayerIndex];

  return (
    <div className="relative min-h-screen bg-stone-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow-md flex justify-between items-center z-50">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🍂 Turno de: <span className="text-green-700">{currentPlayer.name}</span>
          </h2>
          <p className="text-sm text-gray-500">
            {state.selection ? `Has cogido un ${state.selection.type}. Busca la pareja de color ${state.selection.color}.` : 'Selecciona una hoja suelta de la mesa.'}
          </p>
        </div>
        <div className="flex gap-4">
          {state.players.map((p, idx) => (
            <div key={p.id} className={`p-2 rounded-lg border-2 ${idx === state.currentPlayerIndex ? 'border-green-500 bg-green-50' : 'border-transparent'}`}>
              <div className="font-bold">{p.name} {p.isAI ? '🤖' : '👤'}</div>
              <div className="text-xs">Parejas: {p.collectedPairs.length} | Sueltas: {p.singleLeaves.length}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table / Tabletop */}
      <div className="flex-1 relative m-8 bg-green-900/10 rounded-[3rem] border-8 border-amber-900/20 shadow-inner overflow-hidden">
        {state.leaves.map((leaf) => {
          const isPickable = canPickLeaf(leaf, state);
          const isMatchedColor = state.selection && state.selection.color === leaf.color;
          const isMatchedPair = state.selection && (
            (state.selection.type === 'bug' && leaf.type === 'fruit') ||
            (state.selection.type === 'fruit' && leaf.type === 'bug')
          );
          
          let highlightClass = "";
          if (state.selection) {
            if (isMatchedColor && isMatchedPair && isPickable) {
                highlightClass = "ring-4 ring-yellow-400 ring-offset-2 animate-pulse";
            }
          } else if (isPickable) {
              highlightClass = "hover:scale-110 hover:brightness-110 cursor-pointer";
          }

          return (
            <div
              key={leaf.id}
              onClick={() => isPickable && onPickLeaf(leaf.id)}
              className={`absolute transition-all duration-300 ${highlightClass} ${!isPickable ? 'grayscale-[0.5] opacity-90' : ''}`}
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                transform: `translate(-50%, -50%) rotate(${leaf.rotation}deg)`,
                zIndex: leaf.zIndex,
                width: '100px',
                height: '100px',
              }}
            >
              <img
                src={`/leaves/${leaf.type}/${leaf.color}.png`} 
                alt={`${leaf.color} ${leaf.type}`}
                className="w-full h-full object-contain pointer-events-none"
                onError={(e) => {
                    // Fallback to a colored square if user hasn't added images yet
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as any).parentNode.style.backgroundColor = leaf.color;
                    (e.target as any).parentNode.style.borderRadius = '20% 80% 20% 80%';
                    (e.target as any).parentNode.innerHTML = `<div class="flex items-center justify-center h-full text-white font-bold">${leaf.type === 'plain' ? '' : leaf.type === 'bug' ? '🐜' : '🍎'}</div>`;
                }}
              />
            </div>
          );
        })}
      </div>

      {state.notification && (
        <Snackbar
          message={state.notification.message}
          type={state.notification.type}
          isOpen={state.notification.visible}
          onClose={onClearNotification}
        />
      )}
    </div>
  );
}
