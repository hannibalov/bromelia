import { useState } from 'react';
import { useI18n } from '../../locales/client';

interface SetupScreenProps {
  onStartGame: (players: { name: string; isAI: boolean }[]) => void;
  initialPlayers?: { name: string; isAI: boolean }[];
  title?: string;
  subtitle?: string;
  instructions?: React.ReactNode;
}

export default function SetupScreen({ 
  onStartGame, 
  initialPlayers = [],
  title = "Bromelia",
  subtitle,
  instructions
}: SetupScreenProps) {
  const t = useI18n();
  const [players, setPlayers] = useState(initialPlayers);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isNewPlayerAI, setIsNewPlayerAI] = useState(false);

  const displaySubtitle = subtitle || t('games.setup.title');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName.trim(), isAI: isNewPlayerAI }]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const toggleAI = (index: number) => {
    setPlayers(players.map((p, i) => i === index ? { ...p, isAI: !p.isAI } : p));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-8 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-6 sm:mb-8 text-green-800">
          {title}
        </h1>
        
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mb-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{displaySubtitle}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              {t('games.setup.players', { count: players.length })}
            </h3>
            {players.length === 0 ? (
                <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">
                  {t('games.setup.noPlayers')}
                </p>
            ) : (
                players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-medium">{player.name}</span>
                        <button
                          onClick={() => toggleAI(index)}
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                            player.isAI 
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-200' 
                            : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                          }`}
                        >
                          {player.isAI ? `🤖 ${t('games.setup.ai')}` : `👤 ${t('games.setup.human')}`}
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                      >
                        {t('games.setup.remove')}
                      </button>
                    </div>
                  ))
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-100 mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
              {t('games.setup.addPlayer')}
            </h4>
            <div className="flex gap-2">
                <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                placeholder={t('games.setup.namePlaceholder')}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                />
                <button
                    onClick={() => setIsNewPlayerAI(!isNewPlayerAI)}
                    className={`px-4 rounded-lg flex items-center gap-2 border-2 transition font-bold ${
                        isNewPlayerAI 
                        ? 'bg-purple-50 border-purple-200 text-purple-700' 
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                >
                    {isNewPlayerAI ? `🤖 ${t('games.setup.ai')}` : '👤'}
                </button>
                <button
                onClick={handleAddPlayer}
                disabled={!newPlayerName.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50"
                >
                {t('games.setup.add')}
                </button>
            </div>
          </div>

          <button
            onClick={() => onStartGame(players)}
            disabled={players.length < 2}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {t('games.setup.start')}
          </button>
        </div>

        {instructions && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{t('games.setup.howToPlay')}</h3>
            <div className="text-gray-700">
              {instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
