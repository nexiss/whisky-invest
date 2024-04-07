import fs from 'node:fs';

const regex =
  /Chart.drawChart\( *\$\('#chartContainer'\), *(?<list>\[[\s\S]*\]), *'\w*', *(false|true)\);/g;
const EMPTY_ENDPOINTS = [];
function getEndpoints(pitches) {
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
      }, new Map())
      .values(),
  ];
}
// Función para llamar a los endpoints y buscar el texto específico
async function getDeals(sources) {
  const deals = {};
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
      const listText = match?.groups?.['list'];
      if (listText) {
        const list = JSON.parse(listText);

        deals[endpoint] = {
          data: {
            distillery,
            bondYear,
            bondQuarter,
            categoryName,
            barrelTypeCode,
          },
          deals: list,
        };
      } else {
        console.error('Could not find list of deals for endpoint: ' + endpoint);
      }
    } catch (error) {
      console.error(`Error processing ${endpoint}: ${error}`);
    }
  }
  return deals;
}

async function writeToFile(deals) {
  const fileName = 'whiskys.json';
  try {
    fs.writeFile(
      './src/assets/' + fileName,
      JSON.stringify(deals, null, 2),
      (error) => {
        if (error) {
          throw error;
        }

        console.log('Created file ' + fileName);
      }
    );
  } catch (error) {
    console.error('Error writting ' + fileName + ' file:', error);
  }
}
async function fetchPitches() {
  return fetch('https://www.whiskyinvestdirect.com/view_market_json.do', {
    mode: 'cors',
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => data.market.pitches);
}
const pitches = await fetchPitches();
const endpoints = getEndpoints(pitches);
const deals = await getDeals(endpoints);
writeToFile(deals);
