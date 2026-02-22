import Card from './Card';
import { type Card as CardType } from '@/types/game';

interface ActionPanelProps {
  drawnCard: CardType | null;
  turnPhase: 'collect' | 'draw' | 'steal' | 'decide' | 'lost';
  canStealFromEveryone: boolean;
  onCollect: () => void;
  onDraw: () => void;
  onKeep: () => void;
  onSteal: () => void;
  onContinue: () => void;
  onEndTurn: () => void;
  onAcknowledgeLoss: () => void;
}

export default function ActionPanel({
  drawnCard,
  turnPhase,
  canStealFromEveryone,
  onCollect,
  onDraw,
  onKeep,
  onSteal,
  onContinue: _onContinue,
  onEndTurn,
  onAcknowledgeLoss,
}: ActionPanelProps) {
  return (
    <div className="mb-6">
      {/* Drawn Card Section */}
      {drawnCard && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md p-4 mb-4 border-2 border-yellow-400">
          <h2 className="text-xl font-bold mb-2 text-center text-gray-800">
            Has sacado:
          </h2>
          <div className="flex justify-center mb-4">
            <Card card={drawnCard} className="w-24 h-32 md:w-28 md:h-38" />
          </div>

          {turnPhase === 'steal' && (
            <div className="flex flex-col gap-2">
              {canStealFromEveryone && (
                <>
                  <p className="text-center text-base mb-1 text-gray-700 font-semibold">
                    ¡Otro jugador tiene esta carta!
                  </p>
                  <button
                    onClick={onSteal}
                    className="w-full py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-md animate-pulse"
                  >
                    🧤 ¡Robar! 🧤
                  </button>
                </>
              )}
              <button
                onClick={onKeep}
                className="w-full py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-md"
              >
                Quedarse Carta
              </button>
            </div>
          )}

          {turnPhase === 'lost' && (
            <div className="text-center">
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl border-2 border-red-300 font-bold text-xl animate-bounce">
                💥 ¡TURNO PERDIDO! 💥
                <p className="text-xs mt-1 font-normal">Ya la tenías en tu jardín.</p>
              </div>
              <button
                onClick={onAcknowledgeLoss}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-xl shadow-md"
              >
                Pasar Turno
              </button>
            </div>
          )}
        </div>
      )}

      {/* Decision Actions (visible when not drawing/stealing) */}
      {!drawnCard && turnPhase === 'decide' && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h2 className="text-lg font-bold mb-3 text-center text-gray-700">¿Qué quieres hacer?</h2>
          <div className="flex gap-2 max-w-xl mx-auto">
            <button
              onClick={onDraw}
              className="flex-1 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-xl shadow-md hover:scale-105 transform active:scale-95"
            >
              Sacar Otra
            </button>
            <button
              onClick={onEndTurn}
              className="flex-1 py-3 md:py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition font-bold text-xl shadow-md hover:scale-105 transform active:scale-95"
            >
              Terminar
            </button>
          </div>
        </div>
      )}

      {/* Collect Phase */}
      {!drawnCard && turnPhase === 'collect' && (
        <div className="text-center mb-4">
          <button
            onClick={onCollect}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-xl md:text-2xl shadow-lg hover:scale-105 transform active:scale-95"
          >
            Recoger Plantas
          </button>
          <p className="mt-2 text-xs md:text-sm text-gray-500 italic">Guarda las plantas en tu zona de puntos</p>
        </div>
      )}

      {/* Draw Phase (initial draw) */}
      {!drawnCard && turnPhase === 'draw' && (
        <div className="text-center mb-4">
          <button
            onClick={onDraw}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-bold text-xl md:text-2xl shadow-lg hover:scale-105 transform active:scale-95"
          >
            Sacar Primera Carta
          </button>
        </div>
      )}
    </div>
  );
}
