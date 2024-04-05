import { useCallback } from 'react';

import { Deal, Pitch } from '../types';

type Endpoint = string;

type DealSource = Pick<
  Pitch,
  'distillery' | 'bondYear' | 'bondQuarter' | 'barrelTypeCode'
>;

const regex =
  /Chart.drawChart\( *\$\('#chartContainer'\), *(?<list>\[[\s\S]*\]), *'\w*', *(false|true)\);/g;

const EMPTY_ENDPOINTS: DealSource[] = [];

function getEndpoints(pitches: Pitch[]) {
  if (pitches.length < 1) {
    return EMPTY_ENDPOINTS;
  }

  return [
    ...pitches
      .filter((pitch) => !pitch.soldOut && !pitch.suspended)
      /*       // TODO: remove this filter to fetch all data
      .filter((pitch) => {
        return (
          pitch.distillery.toLowerCase() === 'tullibardine' &&
          pitch.bondYear === 2015 &&
          pitch.bondQuarter === 'Q4'
        );
      }) */
      .reduce((acc, pitch) => {
        const key =
          pitch.distillery +
          '\\' +
          pitch.bondYear +
          '\\' +
          pitch.bondQuarter +
          '\\' +
          pitch.barrelTypeCode;

        if (!acc.has(key)) {
          acc.set(key, {
            distillery: pitch.distillery.replaceAll('_', '-'),
            bondYear: pitch.bondYear,
            bondQuarter: pitch.bondQuarter,
            barrelTypeCode: pitch.barrelTypeCode,
          });
        }
        return acc;
      }, new Map<string, DealSource>())
      .values(),
  ];
}

// Función para llamar a los endpoints y buscar el texto específico
async function getDeals(sources: DealSource[]) {
  const deals: Record<Endpoint, Deal[]> = {};

  for (const { distillery, bondYear, bondQuarter, barrelTypeCode } of sources) {
    const endpoint = `https://www.whiskyinvestdirect.com/${distillery.toLowerCase()}/${bondYear}/${bondQuarter}/${barrelTypeCode}/chart.do`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error al cargar ${endpoint}: ${response.status}`);
      }
      const text = await response.text();

      const match = new RegExp(regex).exec(text);
      const listText = match?.groups?.['list'];
      if (listText) {
        const list = JSON.parse(listText);
        deals[endpoint] = list;
      } else {
        console.error('Could not find list of deals for endpoint: ' + endpoint);
      }
    } catch (error) {
      console.error(`Error processing ${endpoint}: ${error}`);
    }
  }

  return deals;
}

export function useFetchDeals() {
  return useCallback((pitches: Pitch[]) => {
    const endpoints = getEndpoints(pitches);
    return getDeals(endpoints);
  }, []);
}
