import 'bootstrap/dist/css/bootstrap.min.css';

import { createContext, useEffect, useState } from 'react';

import { PitchTable } from './components/pitchTable';
import { useFetchDeals } from './hooks/useFetchDeals';
import { useFetchPitches } from './hooks/useFetchPitches';
import { Deal, Pitch } from './types';

const WhiskyContext = createContext({
  deals: {},
});

function App() {
  const fetchPitches = useFetchPitches();
  const [loadingPitches, setLoadingPitches] = useState<boolean>(false);
  const fetchDeals = useFetchDeals();
  const [loadingDeals, setLoadingDeals] = useState<boolean>(false);

  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [deals, setDeals] = useState<Record<string, Deal[]>>({});

  useEffect(() => {}, []);

  useEffect(() => {
    setLoadingPitches(true);
    fetchPitches()
      .then((pitches) => {
        setPitches(pitches);

        setLoadingDeals(true);
        fetchDeals(pitches)
          .then((result) => {
            setDeals(result);
          })
          .catch(() => {
            setDeals({});
            console.error(`Error processing endpoints`);
          })
          .finally(() => {
            setLoadingDeals(false);
          });
      })
      .finally(() => {
        setLoadingPitches(false);
      });
  }, [fetchDeals, fetchPitches]);

  useEffect(() => {
    console.log(deals);
  }, [deals]);

  return (
    <WhiskyContext.Provider value={{ deals }}>
      {loadingDeals ? 'Fetching deals....' : 'Deals are fetched'}
      {loadingPitches ? (
        <div>Loading....</div>
      ) : (
        <PitchTable pitches={pitches}></PitchTable>
      )}
    </WhiskyContext.Provider>
  );
}

export default App;
