import Image from "next/image";

interface GameHeaderProps {
  currentPlayerName: string;
  deckCount: number;
}

export default function GameHeader({ currentPlayerName, deckCount }: GameHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Turno de</p>
          <p className="text-xl font-bold text-green-700">{currentPlayerName}</p>
        </div>
        <div className="relative">
             <div className="relative w-16 h-24 md:w-20 md:h-28 shadow-md rounded-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <Image 
                    src="/cards/back.png" 
                    alt="Mazo" 
                    fill
                    className="object-cover"
                />
             </div>
             <div className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm z-10">
                {deckCount}
             </div>
        </div>
      </div>
    </div>
  );
}
