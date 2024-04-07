import { useContext } from 'react';

import { WhiskyContext } from '../App';
import { PitchTable } from '../components/PitchTable';

export function PitchesPage() {
  const whiskyContext = useContext(WhiskyContext);

  return (
    <>
      {whiskyContext.pitches.loading ? (
        <div>Loading....</div>
      ) : (
        <PitchTable pitches={whiskyContext.pitches.data}></PitchTable>
      )}
    </>
  );
}
