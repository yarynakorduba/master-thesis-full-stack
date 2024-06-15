import { camelCase, flow, map, mapKeys, sortBy } from 'lodash';

export const processConfiguration = (config) => {
  const mappedConfig = mapKeys(config || {}, (v, key) => camelCase(key));
  const mappedData = flow(
    (data) =>
      map(data, (value) => ({
        ...value,
        [mappedConfig.timeProperty.value]: new Date(
          value[mappedConfig.timeProperty.value],
        ).getTime(),
      })),
    (data) => sortBy(data, (d) => d[mappedConfig.timeProperty.value]),
  )(mappedConfig.data);

  return { ...mappedConfig, data: mappedData };
};