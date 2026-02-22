'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import SetupScreen from '@/components/SetupScreen';
import FinishedScreen from '@/components/FinishedScreen';
import GameScreen from '@/components/GameScreen';
import { useI18n, useScopedI18n } from '../../../../locales/client';

export default function PlantasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useI18n();
  const scopedT = useScopedI18n('games.plantas.instructions');
  
  const { 
    state, 
    startGame, 
    collectGarden, 
    drawCard, 
    keepCard, 
    stealCards, 
    endTurn, 
    continueTurn,
    acknowledgeLoss,
    clearNotification,
  } = useGame();

  // Sync gameId to URL
  useEffect(() => {
    if (state.gameId && searchParams.get('id') !== state.gameId) {
      router.push(`?id=${state.gameId}`);
    }
  }, [state.gameId, router, searchParams]);

  if (state.gamePhase === 'setup') {
    return (
      <SetupScreen 
        title={`🌱 ${t('games.plantas.name')} 🌱`}
        onStartGame={(players) => startGame(players)} 
        instructions={
          <ul className="space-y-2 text-gray-700">
            <li>• {scopedT('item1')}</li>
            <li>• {scopedT('item2')}</li>
            <li>• {scopedT('item3')}</li>
            <li>• {scopedT('item4')}</li>
            <li>• {scopedT('item5')}</li>
            <li>• {scopedT('item6')}</li>
            <li>• {scopedT('item7')}</li>
            <li>• {scopedT('item8')}</li>
          </ul>
        }
      />
    );
  }

  if (state.gamePhase === 'finished') {
    return (
      <FinishedScreen 
        players={state.players} 
        onRestart={() => window.location.reload()} 
      />
    );
  }

  return (
    <GameScreen
      state={state}
      onCollect={collectGarden}
      onDraw={drawCard}
      onKeep={keepCard}
      onStealColor={stealCards}
      onEndTurn={endTurn}
      onContinue={continueTurn}
      onAcknowledgeLoss={acknowledgeLoss}
      onClearNotification={clearNotification}
    />
  );
}
