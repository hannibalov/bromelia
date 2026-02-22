import Image from 'next/image';
import Card from './Card';
import { type Card as CardType } from '@/types/game';
import { useI18n } from '@/../locales/client';

interface ActionPanelProps {
  currentPlayerName?: string;
  deckCount: number;
  drawnCard: CardType | null;
  turnPhase: 'collect' | 'draw' | 'steal' | 'decide' | 'lost';
  canStealFromEveryone: boolean;
  gardenEmpty?: boolean;
  onCollect: () => void;
  onDraw: () => void;
  onKeep: () => void;
  onContinue: () => void;
  onEndTurn: () => void;
  onAcknowledgeLoss: () => void;
}

function StealAction({ canStealFromEveryone, onKeep }: { canStealFromEveryone: boolean; onKeep: () => void }) {
  const t = useI18n();
  return (
    <div className="flex flex-col gap-2">
      {canStealFromEveryone && (
          <p className="text-center text-sm md:text-base mb-1 text-gray-700 font-semibold">
            {t('games.plantas.stealPromptTap')}
          </p>
      )}
      <button
        onClick={onKeep}
        className="w-full py-2 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm md:text-base shadow-md"
      >
        {t('games.plantas.keepCard')}
      </button>
    </div>
  );
}

function LostAction({ onAcknowledgeLoss }: { onAcknowledgeLoss: () => void }) {
  const t = useI18n();
  return (
    <div className="text-center">
      <div className="mb-4 p-3 md:p-4 bg-red-100 text-red-700 rounded-xl border-2 border-red-300 font-bold text-lg md:text-xl animate-bounce">
        💥 {t('games.plantas.lostTurn')} 💥
        <p className="text-[10px] md:text-xs mt-1 font-normal">{t('games.plantas.lostTurnHint')}</p>
      </div>
      <button
        onClick={onAcknowledgeLoss}
        className="w-full py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-base md:text-xl shadow-md"
      >
        {t('games.plantas.passTurn')}
      </button>
    </div>
  );
}

function DecideAction({ onDraw, onEndTurn }: { onDraw: () => void, onEndTurn: () => void }) {
  const t = useI18n();
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">
      <h2 className="text-base md:text-lg font-bold mb-3 text-center text-gray-700">{t('games.plantas.whatToDo')}</h2>
      <div className="flex gap-2 max-w-xl mx-auto">
        <button
          onClick={onDraw}
          className="flex-1 py-2 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-base md:text-xl shadow-md hover:scale-105 transform active:scale-95"
        >
          {t('games.plantas.drawAnother')}
        </button>
        <button
          onClick={onEndTurn}
          className="flex-1 py-2 md:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition font-bold text-base md:text-xl shadow-md hover:scale-105 transform active:scale-95"
        >
          {t('games.plantas.endTurn')}
        </button>
      </div>
    </div>
  );
}

function CollectAction({ onCollect }: { onCollect: () => void }) {
  const t = useI18n();
  return (
    <div className="text-center mb-2 md:mb-4">
      <button
        onClick={onCollect}
        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-lg md:text-2xl shadow-lg hover:scale-105 transform active:scale-95"
      >
        {t('games.plantas.collectPlants')}
      </button>
      <p className="mt-2 text-xs md:text-sm text-gray-500 italic">{t('games.plantas.collectHint')}</p>
    </div>
  );
}

function DrawAction({ onDraw }: { onDraw: () => void }) {
  const t = useI18n();
  return (
    <div className="text-center mb-2 md:mb-4">
      <button
        onClick={onDraw}
        className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-bold text-lg md:text-2xl shadow-lg hover:scale-105 transform active:scale-95"
      >
        {t('games.plantas.drawFirst')}
      </button>
    </div>
  );
}

export default function ActionPanel({
  currentPlayerName,
  deckCount,
  drawnCard,
  turnPhase,
  canStealFromEveryone,
  gardenEmpty = false,
  onCollect,
  onDraw,
  onKeep,
  onContinue: _onContinue,
  onEndTurn,
  onAcknowledgeLoss,
}: ActionPanelProps) {
  const t = useI18n();
  const isStealPhase = turnPhase === 'steal' && drawnCard;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl border-t border-gray-100 bg-white/95 backdrop-blur-sm shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] md:relative md:z-auto md:mb-6 md:rounded-none md:border-none md:bg-transparent md:shadow-none ${
        isStealPhase ? 'p-2 md:p-3' : 'p-4 md:p-0'
      }`}
    >
      {/* Turn Header - compact in steal phase */}
      <div
        className={`flex justify-between items-center md:bg-white md:p-3 md:rounded-xl md:shadow-sm ${
          isStealPhase ? 'mb-2 md:mb-2' : 'mb-4'
        }`}
      >
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('games.plantas.turnOf')}</p>
          <p className="text-lg md:text-xl font-bold text-green-700">{currentPlayerName}</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-8 h-12 md:w-16 md:h-24 shadow-sm rounded-md md:rounded-lg overflow-hidden shrink-0">
                <Image 
                    src="/plantas/back.png" 
                    alt={t('games.plantas.deckAlt')} 
                    fill
                    className="object-cover"
                />
            </div>
            <div className="bg-red-600 text-white w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold text-xs md:text-sm border-2 border-white shadow-sm shrink-0">
                {deckCount}
            </div>
        </div>
      </div>
      {/* Drawn Card Section - compact horizontal bar in steal phase */}
      {drawnCard && (
        <div
          className={`bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md border-2 border-yellow-400 md:mb-4 ${
            isStealPhase
              ? 'flex flex-row items-center gap-3 p-2 md:p-3'
              : 'p-4 mb-4'
          }`}
        >
          {isStealPhase ? (
            <>
              <Card card={drawnCard} className="w-12 h-16 md:w-16 md:h-24 shrink-0" />
              <div className="flex-1 min-w-0">
                <StealAction canStealFromEveryone={canStealFromEveryone} onKeep={onKeep} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2 text-center text-gray-800">
                {t('games.plantas.drawnCard')}
              </h2>
              <div className="flex justify-center mb-4">
                <Card card={drawnCard} className="w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36" />
              </div>

              {turnPhase === 'lost' && (
                <LostAction onAcknowledgeLoss={onAcknowledgeLoss} />
              )}
            </>
          )}
        </div>
      )}

      {/* Decision Actions (visible when not drawing/stealing) */}
      {!drawnCard && turnPhase === 'decide' && (
        <DecideAction onDraw={onDraw} onEndTurn={onEndTurn} />
      )}

      {/* Collect Phase (skip when garden empty - show draw instead) */}
      {!drawnCard && turnPhase === 'collect' && gardenEmpty && (
        <DrawAction onDraw={onDraw} />
      )}
      {!drawnCard && turnPhase === 'collect' && !gardenEmpty && (
        <CollectAction onCollect={onCollect} />
      )}

      {/* Draw Phase (initial draw) */}
      {!drawnCard && turnPhase === 'draw' && (
        <DrawAction onDraw={onDraw} />
      )}
    </div>
  );
}
