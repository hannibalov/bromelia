import { VirusCard, AnimalColor, CardType, VirusPlayer, BodyPartState } from '@/types/virus';

export function createVirusDeck(): VirusCard[] {
    const deck: VirusCard[] = [];
    const colors: AnimalColor[] = ['red', 'blue', 'yellow', 'green'];

    // Animals (20): 5 of each color
    colors.forEach(color => {
        for (let i = 0; i < 5; i++) {
            deck.push({ id: `a-${color}-${i}`, type: 'animal', color, name: `${color} animal`, imageUrl: `/virus/${color}.png` });
        }
    });

    // Viruses (16): 4 of each color
    colors.forEach(color => {
        for (let i = 0; i < 4; i++) {
            deck.push({ id: `v-${color}-${i}`, type: 'virus', color, name: `${color} virus`, imageUrl: `/virus/${color}_ill.png` });
        }
    });

    // Medicines (16): 4 of each color
    colors.forEach(color => {
        for (let i = 0; i < 4; i++) {
            deck.push({ id: `m-${color}-${i}`, type: 'medicine', color, name: `${color} medicine`, imageUrl: `/virus/${color}_med.png` });
        }
    });

    // Special cards (16) - Simplified for now: 4 wild animals, 4 wild viruses, 4 wild medicines, 4 actions
    // Wild animals
    for (let i = 0; i < 4; i++) {
        deck.push({ id: `a-wild-${i}`, type: 'animal', color: 'multicolor', name: `Wild animal`, imageUrl: `/virus/wild-animal.png` });
    }
    // Wild viruses
    for (let i = 0; i < 4; i++) {
        deck.push({ id: `v-wild-${i}`, type: 'virus', color: 'multicolor', name: `Wild virus`, imageUrl: `/virus/wild-virus.png` });
    }
    // Wild medicines
    for (let i = 0; i < 4; i++) {
        deck.push({ id: `m-wild-${i}`, type: 'medicine', color: 'multicolor', name: `Wild medicine`, imageUrl: `/virus/wild-medicine.png` });
    }
    // Actions (4) - Simplified as special
    for (let i = 0; i < 4; i++) {
        deck.push({ id: `s-action-${i}`, type: 'special', color: 'multicolor', name: `Special action`, imageUrl: `/virus/special.png` });
    }

    return shuffleDeck(deck);
}

function shuffleDeck(deck: VirusCard[]): VirusCard[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function canPlayCard(card: VirusCard, player: VirusPlayer, targetPlayer: VirusPlayer): boolean {
    if (card.type === 'animal') {
        // Can only play on yourself
        if (player.id !== targetPlayer.id) return false;
        // Cannot have two animals of same color (unless multicolor?)
        return !targetPlayer.board.some(bp => bp.animal.color === card.color);
    }

    if (card.type === 'virus') {
        // Can play on others or yourself (though usually on others)
        // Find animal of matching color on target board
        const targetBodyPart = targetPlayer.board.find(bp =>
            bp.animal.color === card.color ||
            card.color === 'multicolor' ||
            bp.animal.color === 'multicolor'
        );
        if (!targetBodyPart) return false;
        // Cannot play on immunized animal
        return targetBodyPart.status !== 'immunized';
    }

    if (card.type === 'medicine') {
        // Can only play on yourself (usually)
        if (player.id !== targetPlayer.id) return false;
        const targetBodyPart = targetPlayer.board.find(bp =>
            bp.animal.color === card.color ||
            card.color === 'multicolor' ||
            bp.animal.color === 'multicolor'
        );
        if (!targetBodyPart) return false;
        // Cannot play on immunized animal
        return targetBodyPart.status !== 'immunized';
    }

    return true; // Special cards logic can be complex
}

export function applyCard(card: VirusCard, targetPlayer: VirusPlayer): void {
    const bpIndex = targetPlayer.board.findIndex(bp =>
        bp.animal.color === card.color ||
        card.color === 'multicolor' ||
        bp.animal.color === 'multicolor'
    );

    if (card.type === 'animal') {
        targetPlayer.board.push({
            animal: card,
            viruses: [],
            medicines: [],
            status: 'healthy'
        });
    } else if (card.type === 'virus' && bpIndex !== -1) {
        const bp = targetPlayer.board[bpIndex];
        if (bp.medicines.length > 0) {
            // Remove medicine
            bp.medicines.pop();
            bp.status = bp.medicines.length > 0 ? 'vaccinated' : 'healthy';
        } else if (bp.viruses.length > 0) {
            // Second virus: animal dies
            targetPlayer.board.splice(bpIndex, 1);
        } else {
            // First virus
            bp.viruses.push(card);
            bp.status = 'infected';
        }
    } else if (card.type === 'medicine' && bpIndex !== -1) {
        const bp = targetPlayer.board[bpIndex];
        if (bp.viruses.length > 0) {
            // Remove virus
            bp.viruses.pop();
            bp.status = bp.viruses.length > 0 ? 'infected' : 'healthy';
        } else if (bp.medicines.length > 0) {
            // Second medicine: immunized
            bp.medicines.push(card);
            bp.status = 'immunized';
        } else {
            // First medicine
            bp.medicines.push(card);
            bp.status = 'vaccinated';
        }
    }
}

export function checkWinCondition(player: VirusPlayer): boolean {
    const healthyAnimals = player.board.filter(bp =>
        bp.status === 'healthy' || bp.status === 'vaccinated' || bp.status === 'immunized'
    );
    // Need 4 different colors
    const colors = new Set(healthyAnimals.map(bp => bp.animal.color));
    return colors.size >= 4;
}
