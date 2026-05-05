import { getLobbyStoreMethods } from '@/modules/swipes/lobby/lobby.store';
import { Event } from '../event';
import { Card } from '@/modules/swipes/interfaces/card.interface';

class CardEvent extends Event {
  handle(data: { cards: Card[] }) {
    const { setCards, cards } = getLobbyStoreMethods();

    data.cards.forEach(card => {
      card.images.forEach(imageUrl => {
        this.prefetchImage(imageUrl);
      });
    });

    const flippedCards = [...data.cards].reverse();
    setCards([...flippedCards, ...cards]);
  }

  prefetchImage(imageUrl: string) {
    const img = new Image();
    img.src = imageUrl;
  }
}

export const cardEvent = new CardEvent();
