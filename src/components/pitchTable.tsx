import { Table } from 'react-bootstrap';

import { Pitch } from '../types';

export function PitchTable({ pitches }: { pitches: Pitch[] }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Destillery</th>
          <th>Category</th>
          <th>Bbond Year</th>
          <th>Bbond Quarter</th>
          <th>Bbond Size</th>
          <th>Suspended</th>
        </tr>
      </thead>
      <tbody>
        {pitches.map((pitch) => {
          return (
            <tr key={pitch.pitchId}>
              <td>{pitch.pitchId}</td>
              <td>{pitch.distillery}</td>
              <td>{pitch.categoryName}</td>
              <td>{pitch.bondYear}</td>
              <td>{pitch.bondQuarter}</td>
              <td>{pitch.size}</td>
              <td>{pitch.suspended}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
