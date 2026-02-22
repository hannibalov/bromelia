import Link from 'next/link';

interface Game {
  id: string;
  name: string;
  emoji: string;
  description: string;
  href: string;
  available: boolean;
}

const games: Game[] = [
  {
    id: 'plantas',
    name: 'Plantas',
    emoji: '🌱',
    description: 'Un juego de cartas con plantas. Recoge tu jardín y acumula puntos antes de que se acabe el mazo.',
    href: '/plantas',
    available: true,
  },
];

export default function HomePlatform() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-green-800 mb-4">🎮 Bromelia</h1>
          <p className="text-xl text-green-700">Plataforma de juegos de mesa</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-6">Juegos disponibles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className="block bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-green-300"
              aria-label={game.name}
            >
              <div className="text-5xl mb-4">{game.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{game.description}</p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Jugar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
