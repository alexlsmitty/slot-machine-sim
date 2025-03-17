import VideoPokerVariant from './videoPokerVariant';

export const videoPokerVariants = [
  new VideoPokerVariant('jacksOrBetter', 'Jacks or Better', 'standard', {
    royalFlush: 250,
    straightFlush: 50,
    fourOfAKind: 25,
    fullHouse: 9,
    flush: 6,
    straight: 4,
    threeOfAKind: 3,
    twoPair: 2,
    jacksOrBetter: 1,
  }),
  new VideoPokerVariant('deucesWild', 'Deuces Wild', 'standard', {
    royalFlush: 800,
    straightFlush: 50,
    fourOfAKind: 25,
    fullHouse: 9,
    flush: 6,
    straight: 4,
    threeOfAKind: 3,
    twoPair: 2,
    deucesWild: 1,
  }),
  new VideoPokerVariant('jokerPoker', 'Joker Poker', 'joker', {
    royalFlush: 1000,
    straightFlush: 75,
    fourOfAKind: 50,
    fullHouse: 10,
    flush: 7,
    straight: 5,
    threeOfAKind: 4,
    twoPair: 3,
    jokerPoker: 2,
  }),
];