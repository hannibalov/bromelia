'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import SetupScreen from '@/components/SetupScreen';
import FinishedScreen from '@/components/FinishedScreen';
import GameScreen from '@/components/GameScreen';

export default function PlantasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        onStartGame={(players) => startGame(players)} 
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
