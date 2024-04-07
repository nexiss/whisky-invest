import { useContext } from 'react';

import { WhiskyContext } from '../App';
import { DealsTable } from '../components/DealsTable';
import { useDistilleryEstimations } from '../hooks/useDistilleryEstimations';

export function DealsPage() {
  const { whiskyDeals } = useContext(WhiskyContext);

  const estimations = useDistilleryEstimations(whiskyDeals.data)();

  return (
    <>
      {whiskyDeals.loading ? (
        'Fetching deals....'
      ) : (
        <DealsTable estimations={estimations}></DealsTable>
      )}
    </>
  );
}
