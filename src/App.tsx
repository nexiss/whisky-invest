import 'bootstrap/dist/css/bootstrap.min.css';

import { createContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import { AppNav } from './components/AppNav';
import { useFetchPitches } from './hooks/useFetchPitches';
import { useFetchDeals } from './hooks/useFetchWhiskys';
import { router } from './Router';
import { INITIAL_STATE, WhiskyContextState } from './WhiskyContext';

export const WhiskyContext = createContext<WhiskyContextState>(INITIAL_STATE);

function App() {
  const fetchPitches = useFetchPitches();
  const fetchDeals = useFetchDeals();

  const [state, setState] =
    useState<Parameters<typeof WhiskyContext.Provider>[0]['value']>(
      INITIAL_STATE
    );

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      pitches: {
        loading: true,
        data: [],
      },
    }));

    fetchPitches()
      .then((pitches) => {
        setState((prev) => ({
          ...prev,
          whiskyDeals: {
            loading: true,
            data: {},
          },
          pitches: {
            loading: false,
            data: pitches,
          },
        }));

        fetchDeals(pitches)
          .then((deals) => {
            setState((prev) => ({
              ...prev,
              whiskyDeals: {
                loading: false,
                data: deals,
              },
            }));
          })
          .catch(() => {
            setState((prev) => ({
              ...prev,
              whiskyDeals: {
                loading: false,
                data: {},
              },
            }));
            console.error(`Error processing endpoints`);
          })
          .finally(() => {
            setState((prev) => ({
              ...prev,
              whiskyDeals: {
                ...prev.whiskyDeals,
                loading: false,
              },
            }));
          });
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          pitches: {
            ...prev.pitches,
            loading: false,
          },
        }));
      });
  }, [fetchDeals, fetchPitches]);

  return (
    <WhiskyContext.Provider value={state}>
      <AppNav></AppNav>
      <RouterProvider router={router}></RouterProvider>
    </WhiskyContext.Provider>
  );
}

export default App;
