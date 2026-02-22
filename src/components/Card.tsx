import { type Card as CardType } from '@/types/game';
import Image from 'next/image';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
}

export default function Card({ card, onClick, className = '' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-32 md:w-32 md:h-44 rounded-xl overflow-hidden shadow-lg
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        cursor-pointer bg-white border-4 border-green-600
        ${className}
      `}
    >
      <Image
        src={card.imageUrl}
        alt={`Card ${card.value}`}
        fill
        className="object-cover"
      />
    </div>
  );
}
