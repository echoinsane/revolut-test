export const EUR = {
  name: 'EUR',
  cash: 100,
  type: '€',
  USD: null,
  GBP: null
};

export const USD = {
  name: 'USD',
  cash: 100,
  type: '$',
  EUR: null,
  GBP: null
};

export const GBP = {
  name: 'GBP',
  cash: 100,
  type: '£',
  EUR: null,
  USD: null
};

export interface ICurrency {
  name: string;
  cash: number;
  transferCash: number;
  type: string;
  EUR?: any;
  GBP?: any;
  USD?: any;
}
