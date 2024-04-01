import { flatMap, flow, uniq } from 'lodash';
import { AxisVariant } from '../ChartOverlays/hooks';
import { scaleLinear } from '@visx/scale';

export const formatAxisTick = (handler) => (text) => (handler ? handler(text) : text);

export const getAxisTickLabelProps =
  (variant = AxisVariant.bottom, fontSize = '0.75rem') =>
  () => {
    let textAnchor = 'middle';
    if (variant === AxisVariant.left) textAnchor = 'end';
    if (variant === AxisVariant.right) textAnchor = 'start';
    return {
      fill: 'black', //Text.Default,
      fontSize,
      dy: variant === AxisVariant.bottom ? 0 : '0.33em',
      textAnchor
    };
  };

export const getLinearScale = (values: number[] = [], range) =>
  scaleLinear<number>({
    domain: [Math.min(...values), Math.max(...values)],
    range,
    round: true
  });

export const getX = (scale) => (lineDatum) => {
  const x = scale(lineDatum?.valueX);
  const offset = 0; //isVertical ? scale.bandwidth() / 2 : 0;
  return Number(x) + offset;
};

export const getY = (scale) => (lineDatum) => {
  const y = scale(lineDatum?.valueY);
  const offset = 0; //isVertical ? 0 : scale.bandwidth() / 2;
  return Number(y) + offset;
};

export const getUniqueFlatChartValues = (prop, data): number[] =>
  flow(
    (d) => flatMap(d, (lineData) => lineData?.datapoints?.map((datum) => datum?.[prop])),
    uniq
  )(data);

export const getHiddenLineColor = (palette) => palette.grey[300];
