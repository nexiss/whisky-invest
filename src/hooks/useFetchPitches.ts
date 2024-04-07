import { useCallback } from 'react';

import { Pitch } from '../types';

type VieWMarketResponse = {
  market: {
    pitches: Pitch[];
  };
  updateTimeString: string;
  loggedIn: boolean;
  locale: string;
};

export function useFetchPitches() {
  return useCallback(
    async () =>
      fetch('https://www.whiskyinvestdirect.com/view_market_json.do', {
        mode: 'cors',
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data: VieWMarketResponse) => data.market.pitches),
    []
  );
}
