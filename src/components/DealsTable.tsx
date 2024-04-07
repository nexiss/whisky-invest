import { Table } from 'react-bootstrap';

import {
  ESTIMATION_DATES,
  useDistilleryEstimations,
} from '../hooks/useDistilleryEstimations';
import { DealsDateTableCell } from './DealsDateTableCell';

type Props = {
  estimations: ReturnType<ReturnType<typeof useDistilleryEstimations>>;
};

export function DealsTable({ estimations }: Props) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Distillery</th>
          <th>BTC</th>
          <th>Category</th>
          {ESTIMATION_DATES.map((date) => (
            <th key={date}>{`${date} ${date === 1 ? 'year' : 'years'}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {estimations
          .filter((estimation) => estimation.data.categoryName !== 'GRAIN')
          .map((estimation) => {
            const id =
              estimation.data.distillery +
              '\\' +
              estimation.data.categoryName +
              '\\' +
              estimation.data.barrelTypeCode;

            return (
              <tr key={id}>
                <td>{estimation.data.distillery}</td>
                <td>{estimation.data.barrelTypeCode}</td>
                <td>{estimation.data.categoryName}</td>
                {ESTIMATION_DATES.map((date) => (
                  <td key={date}>
                    <DealsDateTableCell
                      date={date}
                      estimation={estimation}
                    ></DealsDateTableCell>
                  </td>
                ))}
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}
