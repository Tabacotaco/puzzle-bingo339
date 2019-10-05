import { useMemo } from 'react';
import { useGame } from '../../services/game';

export function useCurrentRound() {
  const { rounds } = useGame();

  return useMemo(() => rounds[rounds.length - 1] || {}, [ rounds ]);
}
