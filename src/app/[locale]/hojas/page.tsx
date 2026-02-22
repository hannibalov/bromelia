'use client';

import { useHojasGame } from '@/hooks/useHojasGame';
import SetupScreen from '@/components/SetupScreen';
import HojasGameScreen from '@/components/HojasGameScreen';
import FinishedScreen from '@/components/FinishedScreen';
import { useI18n, useScopedI18n } from '../../../../locales/client';

export default function HojasPage() {
  const { state, startGame, pickLeaf, clearNotification } = useHojasGame();
  const t = useI18n();
  const scopedT = useScopedI18n('games.hojas.instructions');

  if (state.gamePhase === 'setup') {
    return (
      <SetupScreen
        title={`🍂 ${t('games.hojas.name')} 🍂`}
        onStartGame={startGame}
        instructions={
          <ul className="space-y-2">
            <li>• {scopedT('item1')}</li>
            <li>• {scopedT('item2')}</li>
            <li>• {scopedT('item3')}</li>
            <li>• {scopedT('item4')}</li>
            <li>• {scopedT('item5')}</li>
            <li>• {scopedT('item6')}</li>
          </ul>
        }
      />
    );
  }

  if (state.gamePhase === 'finished') {
    return (
      <FinishedScreen
        players={state.players.map(p => ({
          ...p,
          garden: [],
          savedCards: []
        }))}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <HojasGameScreen
      state={state}
      onPickLeaf={pickLeaf}
      onClearNotification={clearNotification}
    />
  );
}
