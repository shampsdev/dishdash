import { getMatchStoreMethods } from '@/modules/swipes/match/match.store';
import { Match } from '@/modules/swipes/interfaces/match.interface';
import { Event } from '../event';
import { getServerRouteMethods } from '@/shared/stores/server-route.store';
import { getResultStoreMethods } from '../../results/result.store';

class MatchEvent extends Event {
  handle(data: Match) {
    const { setMatchCard } = getMatchStoreMethods();
    const { setRoute } = getServerRouteMethods();
    const { result } = getResultStoreMethods();

    setMatchCard({
      card: data.card
    });

    const lobbyUsers = Array.from(
      new Map(
        result?.top.flatMap((x) => x.likes).map((user) => [user.id, user])
      ).values()
    );

    if (lobbyUsers.length > 1) setRoute('match');
  }
}

export const matchEvent = new MatchEvent();
