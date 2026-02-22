import { useEffect, useRef } from 'react';
import { type Player as PlayerType } from '@/types/game';
import Card from './Card';
import { groupGardenCards } from '@/utils/gameLogic';

interface PlayerGardenProps {
  player: PlayerType;
  isCurrentPlayer: boolean;
  onStealCards?: () => void;
  canSteal?: boolean;
}

export default function PlayerGarden({ 
  player, 
  isCurrentPlayer, 
  onStealCards,
  canSteal = false 
}: PlayerGardenProps) {
  const groupedCards = groupGardenCards(player.garden);
  const gardenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentPlayer && gardenRef.current) {
      // Check if we are on a mobile device (using window width < 768px for md breakpoint)
      if (window.innerWidth < 768) {
        setTimeout(() => {
          gardenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [isCurrentPlayer]);

  return (
    <div
      ref={gardenRef}
      className={`
        p-3 md:p-4 rounded-xl border-2 transition-all duration-300
        ${isCurrentPlayer 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-lg' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
        }
        ${canSteal ? 'ring-2 ring-yellow-400 cursor-pointer hover:shadow-xl' : ''}
      `}
      onClick={canSteal ? onStealCards : undefined}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate mr-2">
          {player.name}
          {isCurrentPlayer && <span className="ml-1 text-green-600">★</span>}
        </h3>
        <div className="text-right flex items-center gap-2">
          <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold">Score</p>
          <p className="text-xl md:text-2xl font-bold text-green-700">{player.score}</p>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[10px] md:text-xs text-gray-500 mb-1">
          Garden ({player.garden.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {player.garden.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Empty</p>
          ) : (
            Object.entries(groupedCards).map(([value, cards]) => (
              <div key={value} className="relative group">
                <div className="flex flex-wrap gap-2 min-h-[140px] md:min-h-[160px]">
                  {cards.map((card, idx) => (
                    <div
                      key={card.id}
                      style={{
                        position: idx === 0 ? 'relative' : 'absolute',
                        left: idx === 0 ? 0 : `${idx * 12}px`,
                        top: idx === 0 ? 0 : `${idx * 2}px`,
                        zIndex: idx,
                        transform: `rotate(${idx * 1}deg)`,
                      }}
                      className="transition-all duration-300 group-hover:translate-x-1"
                    >
                      <Card card={card} className="w-20 h-28 md:w-24 md:h-34" />
                    </div>
                  ))}
                </div>
                {cards.length > 1 && (
                  <div className="absolute -top-1 -right-1 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-50">
                    x{cards.length}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <p className="text-[10px] md:text-xs text-gray-500 mb-1">
          Saved ({player.savedCards.length})
        </p>
        <div className="flex gap-1 flex-wrap">
          {player.savedCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold"
            >
              {card.value}
            </div>
          ))}
        </div>
      </div>

      {canSteal && (
        <div className="mt-2 text-center">
          <p className="text-xs text-yellow-700 font-semibold animate-pulse">
            ¡Pulsa para robar!
          </p>
        </div>
      )}
    </div>
  );
}
