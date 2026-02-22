'use client';

import { useState } from 'react';
import Image from 'next/image';
import SetupScreen from '@/components/SetupScreen';
import FinishedScreen from '@/components/FinishedScreen';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { useVirusGame } from '@/hooks/useVirusGame';
import { VirusCard, VirusPlayer, BodyPartState } from '@/types/virus';

export default function VirusPage() {
  const t = useI18n();
  const scopedT = useScopedI18n('games.virus.instructions');
  const { state, startGame, playCard, discardCard, endTurn } = useVirusGame();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const currentPlayer = state.players[state.currentPlayerIndex];

  if (state.gamePhase === 'setup') {
    return (
      <SetupScreen
        title={`🦠 ${t('games.virus.name')} 🦠`}
        onStartGame={startGame}
        instructions={
          <ul className="space-y-2">
            <li>• {scopedT('item1')}</li>
            <li>• {scopedT('item2')}</li>
            <li>• {scopedT('item3')}</li>
            <li>• {scopedT('item4')}</li>
            <li>• {scopedT('item5')}</li>
          </ul>
        }
      />
    );
  }

  if (state.gamePhase === 'finished' && state.winner) {
    return (
      <FinishedScreen
        players={state.players.map(p => ({
          ...p,
          score: p.board.filter(bp => bp.status === 'healthy' || bp.status === 'vaccinated' || bp.status === 'immunized').length * 100,
          garden: [],
          savedCards: []
        }))}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4 pt-20 flex flex-col items-center">
      {/* Game Info Header */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 mb-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Turno de</p>
          <p className="text-2xl font-black text-emerald-700">{currentPlayer.name}</p>
        </div>
        <div className="flex gap-4">
          {state.players.map((p, idx) => (
            <div key={p.id} className={`p-2 rounded-lg border-2 ${idx === state.currentPlayerIndex ? 'border-emerald-500 bg-emerald-50' : 'border-transparent opacity-60'}`}>
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-xs flex gap-1">
                {p.board.map((bp, i) => (
                   <span key={i} className={`w-3 h-3 rounded-full ${bp.status === 'healthy' ? 'bg-green-500' : bp.status === 'infected' ? 'bg-red-500' : bp.status === 'vaccinated' ? 'bg-blue-500' : 'bg-yellow-400 border border-yellow-600'}`}></span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Boards Area */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-32">
        {state.players.map(player => (
          <div 
            key={player.id} 
            onClick={() => {
              if (selectedCardId && player.id) {
                playCard(selectedCardId, player.id);
                setSelectedCardId(null);
              }
            }}
            className={`bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-4 transition-all ${selectedCardId ? 'border-emerald-300 cursor-cell hover:bg-emerald-50' : 'border-transparent'}`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {player.isAI ? '🤖' : '👤'} {player.name}
              {player.id === currentPlayer.id && <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}
            </h3>
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-4 h-48">
              {player.board.map((bp, bpIdx) => (
                <div key={bpIdx} className="relative group">
                   <div className={`aspect-[3/4] rounded-xl border-2 shadow-sm overflow-hidden flex flex-col items-center justify-center relative ${getStatusColor(bp.status)}`}>
                      <span className="text-4xl">{getAnimalEmoji(bp.animal.color)}</span>
                      <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                         {bp.viruses.map((v, idx) => <span key={idx} className="text-lg">🦠</span>)}
                         {bp.medicines.map((m, idx) => <span key={idx} className="text-lg">💊</span>)}
                      </div>
                   </div>
                   <p className="mt-1 text-[10px] text-center font-bold uppercase text-gray-500">{bp.status}</p>
                </div>
              ))}
              {player.board.length === 0 && (
                <div className="col-span-full flex items-center justify-center text-gray-400 italic text-sm">
                  Sin animales en el tablero
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Current Player Hand & Actions (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex gap-2">
             {currentPlayer.hand.map(card => (
               <button
                 key={card.id}
                 onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
                 className={`relative w-24 h-32 md:w-32 md:h-44 rounded-xl border-4 transition-all shadow-lg overflow-hidden flex flex-col items-center justify-center bg-white ${selectedCardId === card.id ? 'border-emerald-600 -translate-y-4 scale-105' : 'border-stone-200 hover:border-stone-300'}`}
               >
                 <span className="text-5xl">{getTypeIcon(card.type, card.color)}</span>
                 <p className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-700">{card.name}</p>
                 <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${getColorHex(card.color)}`}></div>
               </button>
             ))}
          </div>

          <div className="flex-1 flex gap-2 w-full sm:w-auto">
            <button 
              disabled={!selectedCardId}
              onClick={() => {
                if (selectedCardId) {
                  discardCard(selectedCardId);
                  setSelectedCardId(null);
                }
              }}
              className="flex-1 py-4 px-6 bg-stone-200 text-stone-700 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-300 disabled:opacity-50 transition"
            >
              Descartar
            </button>
            <button 
              onClick={() => {
                setSelectedCardId(null);
                endTurn();
              }}
              className="flex-1 py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition"
            >
              Pasar Turno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAnimalEmoji(color: string) {
  switch (color) {
    case 'red': return '🦁';
    case 'blue': return '🐘';
    case 'yellow': return '🦒';
    case 'green': return '🦓';
    case 'multicolor': return '🦄';
    default: return '🐾';
  }
}

function getTypeIcon(type: string, color: string) {
  if (type === 'animal') return getAnimalEmoji(color);
  if (type === 'virus') return '🦠';
  if (type === 'medicine') return '💊';
  return '✨';
}

function getColorHex(color: string) {
  switch (color) {
    case 'red': return 'bg-red-500';
    case 'blue': return 'bg-blue-500';
    case 'yellow': return 'bg-yellow-400';
    case 'green': return 'bg-green-500';
    case 'multicolor': return 'bg-gradient-to-tr from-red-400 via-emerald-400 to-indigo-400';
    default: return 'bg-stone-400';
  }
}

function getStatusColor(status: BodyPartState['status']) {
  switch (status) {
    case 'healthy': return 'bg-green-50 border-green-200';
    case 'infected': return 'bg-red-50 border-red-200';
    case 'vaccinated': return 'bg-blue-50 border-blue-200';
    case 'immunized': return 'bg-yellow-50 border-yellow-400';
    default: return 'bg-stone-50 border-stone-200';
  }
}
