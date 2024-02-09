import { format } from 'date-fns';
import { isNumber } from 'lodash';

export const formatUnixToDate = (d) => {
  if (isNumber(d)) {
    return format(new Date(d), 'dd/MM/yyyy');
  }
  return d;
};

export const formatNumber = (d: number): string => {
  const MILLION = 1000 * 1000;
  const BILLION = 1000 * MILLION;
  const TRILLION = 1000 * BILLION;

  if (d >= TRILLION) {
    return `${d / TRILLION}T`;
  }
  if (d >= BILLION) {
    return `${d / BILLION}B`;
  }
  if (d >= MILLION) {
    // one million
    return `${d / MILLION}MM`;
  }
  if (d >= 1000) {
    return `${d / 1000}K`;
  }
  return `${d}`;
};
