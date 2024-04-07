import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';

import { useDistilleryEstimations } from '../hooks/useDistilleryEstimations';

const renderTooltip = (
  tooltipProps: OverlayInjectedProps,
  {
    price,
    rentYear,
    rentAcc,
  }: {
    price: number;
    rentAcc: number;
    rentYear: number;
  }
) => (
  <Tooltip {...tooltipProps}>
    <Container>
      <Row>
        <Col>
          <span>price: </span>
          <span>£</span>
          <span>{price}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>rentYear: </span>
          <span>{rentYear}</span>
          <span>%</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>rentAcc: </span>
          <span>{rentAcc}</span>
          <span>%</span>
        </Col>
      </Row>
    </Container>
  </Tooltip>
);

function getColor(n: number) {
  if (n === 0) {
    return 'blue';
  }
  if (n > 0) {
    return 'green';
  }
  return 'red';
}

function roundDecimals(n: number, decimals: number): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

export function DealsDateTableCell({
  estimation,
  date,
}: {
  estimation: ReturnType<ReturnType<typeof useDistilleryEstimations>>[number];
  date: number;
}) {
  return (
    <Container>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={(tooltipProps) =>
          renderTooltip(tooltipProps, estimation.pricePerYear[date])
        }
      >
        <Row>
          <Col>
            <span
              style={{
                color: getColor(estimation.pricePerYear[date].price),
              }}
            >
              £{roundDecimals(estimation.pricePerYear[date].price, 2)}
            </span>
          </Col>
          <Col>
            <span
              style={{
                color: getColor(estimation.pricePerYear[date].rentYear),
              }}
            >
              {roundDecimals(estimation.pricePerYear[date].rentYear, 2)}%
            </span>
          </Col>
          <Col>
            <span
              style={{
                color: getColor(estimation.pricePerYear[date].rentAcc),
              }}
            >
              {roundDecimals(estimation.pricePerYear[date].rentAcc, 2)}%
            </span>
          </Col>
        </Row>
      </OverlayTrigger>
    </Container>
  );
}
