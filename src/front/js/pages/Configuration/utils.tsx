import { isEmpty } from 'lodash';

export const isConfigurationDataIncomplete = (
  timeseriesData,
  timeProperty,
  valueProperties,
) => isEmpty(timeseriesData) || !timeProperty || isEmpty(valueProperties);
