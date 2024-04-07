import { Pitch, WhiskyDealsRecord } from './types';

type LoadingData<T> = {
  data: T;
  loading: boolean;
};

export type WhiskyContextState = {
  pitches: LoadingData<Pitch[]>;
  whiskyDeals: LoadingData<WhiskyDealsRecord>;
};

export const INITIAL_STATE: WhiskyContextState = {
  pitches: {
    loading: false,
    data: [],
  },
  whiskyDeals: {
    loading: false,
    data: {},
  },
};
