export default class VideoPokerVariant {
  constructor(id, name, deckType, payTable) {
    this.id = id;
    this.name = name;
    // We'll use deckType values of "standard", "deucesWild", and "joker"
    this.deckType = deckType;
    this.payTable = payTable;
  }

  // Returns the default deck of cards for this variant.
  getDefaultDeck() {
    const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let idCounter = 1;
    let deck = [];
    const toImage = (rank, suit) => `${rank.toLowerCase()}-${suit.toLowerCase()}.png`;

    // Create a standard 52-card deck
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          id: idCounter++,
          suit,
          rank,
          image: toImage(rank, suit),
          isWild: false,
        });
      }
    }

    // Modify deck based on variant type:
    if (this.id === 'deucesWild') {
      // In a Deuces Wild variant, all cards with rank "2" become wild.
      deck = deck.map((card) =>
        card.rank === '2' ? { ...card, isWild: true } : card
      );
    }
    if (this.deckType === 'joker') {
      // For a Joker variant, add two Joker cards that are wild.
      deck.push({
        id: idCounter++,
        suit: 'None',
        rank: 'Joker',
        image: 'joker.png',
        isWild: true,
      });
      deck.push({
        id: idCounter++,
        suit: 'None',
        rank: 'Joker',
        image: 'joker.png',
        isWild: true,
      });
    }
    return deck;
  }
}