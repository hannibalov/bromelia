import { type GameState } from '@/types/game';
import ActionPanel from './ActionPanel';
import PlayerGarden from './PlayerGarden';
import Snackbar from './Snackbar';
import { findMatchingCards } from '@/utils/gameLogic';
import { useI18n } from '@/../locales/client';

interface GameScreenProps {
  state: GameState;
  onCollect: () => void;
  onDraw: () => void;
  onKeep: () => void;
  onStealColor: (id: string) => void; // Keeping original signature just in case
  onEndTurn: () => void;
  onContinue: () => void;
  onAcknowledgeLoss: () => void;
  onClearNotification: () => void;
}

export default function GameScreen({
  state,
  onCollect,
  onDraw,
  onKeep,
  onStealColor,
  onEndTurn,
  onContinue,
  onAcknowledgeLoss,
  onClearNotification,
}: GameScreenProps) {
  const t = useI18n();
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Check if anyone has matching cards to steal
  const validStealTargets = state.drawnCard
    ? state.players.filter(
        (p, idx) =>
          idx !== state.currentPlayerIndex &&
          findMatchingCards(p.garden, state.drawnCard!.value).length > 0
      )
    : [];
  const canStealFromAnyone = validStealTargets.length > 0;
  const isStealPhase = state.turnPhase === 'steal' && state.drawnCard;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8 ${
        isStealPhase ? 'pb-28 md:pb-8' : 'pb-48 md:pb-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-800">
          🌱 {t('games.plantas.turnTitle')} 🌱
        </h1>

        <Snackbar 
            message={state.notification?.message || ''}
            type={state.notification?.type || 'info'}
            isOpen={!!state.notification?.visible}
            duration={2500}
            onClose={onClearNotification}
        />

        {/* Players */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 mb-6">
          {state.players.map((player, index) => (
            <PlayerGarden
              key={player.id}
              player={player}
              isCurrentPlayer={index === state.currentPlayerIndex}
              canSteal={
                state.turnPhase === 'steal' &&
                state.drawnCard !== null &&
                index !== state.currentPlayerIndex &&
                findMatchingCards(player.garden, state.drawnCard.value).length > 0
              }
              onStealCards={() => onStealColor(player.id)}
            />
          ))}
        </div>

        <ActionPanel
          currentPlayerName={currentPlayer?.name}
          deckCount={state.deck.length}
          drawnCard={state.drawnCard}
          turnPhase={state.turnPhase}
          canStealFromEveryone={canStealFromAnyone}
          gardenEmpty={state.turnPhase === 'collect' && (currentPlayer?.garden.length ?? 0) === 0}
          onCollect={onCollect}
          onDraw={onDraw}
          onKeep={onKeep}
          onContinue={onContinue}
          onEndTurn={onEndTurn}
          onAcknowledgeLoss={onAcknowledgeLoss}
        />
      </div>
    </div>
  );
}
