'use client';

import { useState } from 'react';
import SetupScreen from '@/components/SetupScreen';
import FinishedScreen from '@/components/FinishedScreen';
import { useI18n, useScopedI18n } from '../../../../locales/client';

export default function VirusPage() {
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [players, setPlayers] = useState<{ name: string; isAI: boolean }[]>([]);
  const t = useI18n();
  const scopedT = useScopedI18n('games.virus.instructions');

  const startGame = (initialPlayers: { name: string; isAI: boolean }[]) => {
    setPlayers(initialPlayers);
    setGamePhase('playing');
  };

  if (gamePhase === 'setup') {
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

  if (gamePhase === 'finished') {
    return (
      <FinishedScreen
        players={players.map(p => ({ ...p, id: p.name, score: 0, garden: [], savedCards: [] }))}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 pt-24 text-center">
      <h1 className="text-4xl font-bold text-green-800 mb-8">🦠 {t('games.virus.name')}</h1>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <p className="text-xl text-gray-700 mb-6">
          {t('games.virus.description')}
        </p>
        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl mb-6">
          <p className="text-yellow-800 font-medium">
            🚧 Game mechanics are under development!
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-bold text-gray-800">Players:</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {players.map((p, i) => (
              <span key={i} className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold">
                {p.isAI ? '🤖' : '👤'} {p.name}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setGamePhase('finished')}
          className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
        >
          End Game (Debug)
        </button>
      </div>
    </div>
  );
}
