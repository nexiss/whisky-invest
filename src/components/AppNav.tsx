import { Nav } from 'react-bootstrap';

export function AppNav() {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/home">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/pitches">Pitches</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/deals">Deals</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
