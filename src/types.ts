export interface Pitch {
  pitchId: number;
  securityId: string;
  distillery: string;
  categoryName: string;
  barrelTypeCode: string;
  bondYear: number;
  bondQuarter: string;
  soldOut: boolean;
  suspended: boolean;
  minorLine: boolean;
  openBtbOrderId?: null;
  considerationCurrency: string;
  prices?: Price[] | null;
  size: number;
  buyPrices?: Price[] | null;
  sellPrices?: Price[] | null;
}
export interface Price {
  actionIndicator: ActionIndicator;
  quantity: number;
  limit: number;
  value: number;
  buy: boolean;
  sell: boolean;
}
export interface ActionIndicator {
  value: string;
  buy: boolean;
  sell: boolean;
}

export type Deal = {
  btbDay: boolean;
  day: number;
  dealDate: number;
  priceAvg: number;
};
