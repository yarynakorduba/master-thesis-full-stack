import { format } from 'date-fns';
import { isArray, isNil, isNumber, mapValues, round } from 'lodash';
import { PRECISION } from '../consts';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const formatUnixToDate = (extent?: [number, number]) => (d) => {
  try {
    if (!isNumber(d)) return d;
    const date = new Date(d);

    if (extent) {
      const delta = extent[1] - extent[0];
      if (delta < DAY_IN_MS) {
        return format(date, 'HH:mm');
      } else if (delta < 7 * DAY_IN_MS) {
        return format(date, 'dd/MM/yyyy\n HH:mm');
      }
      return format(date, 'dd/MM/yyyy');
    }
    return format(date, 'dd/MM/yyyy\n HH:mm');
  } catch (e) {
    console.error('Error converting date: ', e, d);
    return '';
  }
};

export const formatDateToDateTime = (d) => {
  try {
    return format(new Date(d), 'dd/MM/yyyy, HH:mm');
  } catch (e) {
    console.error('Error converting date: ', e, d);
    return '';
  }
};

export const formatNumber = (d: number): string => {
  const MILLION = 1000 * 1000;
  const BILLION = 1000 * MILLION;
  const TRILLION = 1000 * BILLION;

  if (d >= TRILLION) {
    return `${round(d / TRILLION, PRECISION)}T`;
  }
  if (d >= BILLION) {
    return `${round(d / BILLION, PRECISION)}B`;
  }
  if (d >= MILLION) {
    // one million
    return `${round(d / MILLION, PRECISION)}MM`;
  }
  if (d >= 1000) {
    return `${round(d / 1000, PRECISION)}K`;
  }
  return `${round(d, PRECISION)}`;
};

// ARIMA params order
export const formatOrder = (order?: number[] | number): number | string => {
  if (isArray(order)) return `[${order.join(', ')}]`;
  return isNil(order) ? 'N/A' : order;
};

export const formatFormFields = (formFields, numericFields) =>
  mapValues(formFields, (value, key) => (numericFields[key] ? +value : value));
