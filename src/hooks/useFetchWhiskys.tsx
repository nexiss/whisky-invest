import fs from 'node:fs';
import { useCallback } from 'react';

import whiskys from '../assets/whiskys.json';
import { Deal, Pitch, Whisky, WhiskyDeal, WhiskyDealsRecord } from '../types';

const regex =
  /Chart.drawChart\( *\$\('#chartContainer'\), *(?<deals>\[[\s\S]*\]), *'\w*', *(false|true)\);/g;

const EMPTY_ENDPOINTS: Whisky[] = [];

function getEndpoints(pitches: Pitch[]) {
  if (pitches.length < 1) {
    return EMPTY_ENDPOINTS;
  }

  return [
    ...pitches
      .filter((pitch) => !pitch.soldOut && !pitch.suspended)
      .reduce((acc, pitch) => {
        const key =
          pitch.distillery +
          '\\' +
          pitch.bondYear +
          '\\' +
          pitch.bondQuarter +
          '\\' +
          pitch.categoryName +
          '\\' +
          pitch.barrelTypeCode;

        if (!acc.has(key)) {
          acc.set(key, {
            distillery: pitch.distillery.replaceAll('_', '-'),
            bondYear: pitch.bondYear,
            bondQuarter: pitch.bondQuarter,
            barrelTypeCode: pitch.barrelTypeCode,
            categoryName: pitch.categoryName,
          });
        }
        return acc;
      }, new Map<string, Whisky>())
      .values(),
  ];
}

// Función para llamar a los endpoints y buscar el texto específico
async function fetchDeals(sources: Whisky[]) {
  const whiskyDealsRecord: WhiskyDealsRecord = {};

  for (const {
    distillery,
    bondYear,
    bondQuarter,
    barrelTypeCode,
    categoryName,
  } of sources) {
    const endpoint = `https://www.whiskyinvestdirect.com/${distillery.toLowerCase()}/${bondYear}/${bondQuarter}/${barrelTypeCode}/chart.do`;
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Error al cargar ${endpoint}: ${response.status}`);
      }
      const text = await response.text();

      const match = new RegExp(regex).exec(text);
      const dealsText = match?.groups?.['deals'];
      if (dealsText) {
        const deals: Deal[] = JSON.parse(dealsText);
        whiskyDealsRecord[endpoint] = {
          data: {
            distillery,
            bondYear,
            bondQuarter,
            barrelTypeCode,
            categoryName,
          },
          deals,
        } as WhiskyDeal;
      } else {
        console.error('Could not find list of deals for endpoint: ' + endpoint);
      }
    } catch (error) {
      console.error(`Error processing ${endpoint}: ${error}`);
    }
  }

  return whiskyDealsRecord;
}

// Función para escribir los datos en un archivo JSON
async function writeToFile(whiskys: WhiskyDealsRecord) {
  const fileName = 'whiskys.json';
  try {
    fs.writeFile(fileName, JSON.stringify(whiskys, null, 2), (error) => {
      if (error) {
        throw error;
      }

      console.log('Created file ' + fileName);
    });
  } catch (error) {
    console.error('Error writting ' + fileName + ' file:', error);
  }
}

export function useFetchDeals() {
  return useCallback(async (pitches: Pitch[]) => {
    try {
      if (whiskys) {
        return whiskys as WhiskyDealsRecord;
      }
    } catch (error) {
      console.log(error);
    }

    const endpoints = getEndpoints(pitches);
    const whiskyDeals = await fetchDeals(endpoints);

    writeToFile(whiskyDeals);

    return whiskyDeals;
  }, []);
}
