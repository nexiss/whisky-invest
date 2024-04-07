import { useCallback, useMemo } from 'react';

import { ReducedWhiskyData, WhiskyDealsRecord } from '../types';

export type Estimation = { year: number; days: number; avg: number };

export const ESTIMATION_DATES = [1, 2, 3, 4, 6, 8, 12] as const;
const daysOfMargin = 60;

export function useDistilleryEstimations(whiskys: WhiskyDealsRecord) {
  const memoized = useMemo(() => {
    const groupedPrices = Object.values(whiskys).reduce(
      (acc, { data, deals }) => {
        const id =
          data.distillery +
          '\\' +
          data.categoryName +
          '\\' +
          data.barrelTypeCode;

        if (!acc[id]) {
          acc[id] = {
            data: {
              distillery: data.distillery,
              barrelTypeCode: data.barrelTypeCode,
              categoryName: data.categoryName,
            },
            prices: {},
          };
        }

        deals.forEach((deal) => {
          if (!acc[id].prices[deal.day]) {
            acc[id].prices[deal.day] = [];
          }

          acc[id].prices[deal.day].push(deal.priceAvg);
        });

        return acc;
      },
      {} as Record<
        string,
        { data: ReducedWhiskyData; prices: Record<number, number[]> }
      >
    );

    function getBenefit(price1: number, price2: number): number {
      const benefit = ((price2 - price1) * 100) / price1;
      return Math.round(benefit * 10 ** 2) / 10 ** 2;
    }

    const valuesAvgPrices = Object.values(groupedPrices).reduce(
      (acc, value) => {
        const prices = Object.entries(value.prices).reduce(
          (acc, [day, prices]) => {
            const sum = prices.reduce((acc, price) => (price += acc), 0);
            const avg = prices.length > 0 ? sum / prices.length : 0;

            acc[Number(day)] = avg;

            return acc;
          },
          {} as Record<number, number>
        );

        const pricesEntries = Object.entries(prices);
        const pricePerYear = ESTIMATION_DATES.reduce(
          (acc, date, currentIndex, array) => {
            const daysOfDate = date * 365;

            const filteredPricesEntries = pricesEntries.filter(([strDay]) => {
              const day = Number(strDay);

              return (
                day > daysOfDate - daysOfMargin &&
                day < daysOfDate + daysOfMargin
              );
            });

            const sum = filteredPricesEntries.reduce(
              (acc, [, price]) => (price += acc),
              0
            );
            const avgPriceInYear =
              filteredPricesEntries.length > 0
                ? sum / filteredPricesEntries.length
                : 0;

            let rentAcc = 0;
            let rentYear = 0;
            if (currentIndex > 0) {
              const prevPrice = acc[array[currentIndex - 1]].price;

              if (prevPrice > 0 && avgPriceInYear > 0) {
                rentYear = getBenefit(prevPrice, avgPriceInYear);
                rentAcc = acc[array[currentIndex - 1]].rentAcc + rentYear;
              }
            }

            acc[date] = {
              price: avgPriceInYear,
              rentAcc,
              rentYear,
            };

            return acc;
          },
          {} as Record<
            number,
            { price: number; rentAcc: number; rentYear: number }
          >
        );

        acc.push({
          ...value,
          prices,
          pricePerYear,
        });

        return acc;
      },
      [] as {
        data: ReducedWhiskyData;
        prices: Record<number, number>;
        pricePerYear: Record<
          number,
          { price: number; rentAcc: number; rentYear: number }
        >;
      }[]
    );

    return valuesAvgPrices;
  }, [whiskys]);

  return useCallback(() => memoized, [memoized]);
}
