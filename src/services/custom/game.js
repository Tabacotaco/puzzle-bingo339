import { useMemo } from 'react';
import { useGame } from '../../services/game';

export function useCurrentRound() {
  const { rounds, attacks } = useGame();
  const lastRound = useMemo(() => rounds[rounds.length - 1] || {}, [ rounds ]);
  const lastAttack = useMemo(() => attacks[attacks.length - 1] || {}, [ attacks ]);
  const { finish = false } = lastAttack;

  return {
    ...lastRound,
    ...( finish ? {} : { attack: lastAttack })
  };
}
