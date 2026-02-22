import { type Player } from '@/types/game';

interface FinishedScreenProps {
  players: Player[];
  onRestart: () => void;
}

export default function FinishedScreen({ players, onRestart }: FinishedScreenProps) {
  const winner = players.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-8 text-green-800">
          🏆 ¡Fin del Juego! 🏆
        </h1>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-4xl font-bold text-center mb-6 text-green-700">
            ¡{winner.name} Gana!
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-600">
            Puntuación Final: {winner.score} puntos
          </p>

          <div className="space-y-4">
            {players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="text-xl font-semibold">{player.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-green-700">
                    {player.score} pts
                  </span>
                </div>
              ))}
          </div>

          <button
            onClick={onRestart}
            className="w-full mt-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-xl shadow-lg"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
