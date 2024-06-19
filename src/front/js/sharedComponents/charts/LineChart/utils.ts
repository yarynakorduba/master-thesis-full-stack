import { flatMap, flow, uniq } from 'lodash';
import { ScaleInput, scaleLinear } from '@visx/scale';
import { Palette } from '@mui/material/styles';
import { AxisVariant } from '../ChartOverlays/hooks';
import { TLineChartDatapoint } from 'front/js/types';
import { TickFormatter, TickLabelProps } from '@visx/axis';
import { Scale } from '@visx/brush/lib/types';

export const formatAxisTick =
  (scale): TickFormatter<ScaleInput<Scale>> =>
  (text) =>
    scale ? scale(text) : text;

type TTextAnchor = 'start' | 'middle' | 'end' | 'inherit';
export const getAxisTickLabelProps =
  (
    variant = AxisVariant.bottom,
    fontSize = '0.75rem',
  ): TickLabelProps<ScaleInput<Scale>> =>
  () => {
    let textAnchor: TTextAnchor = 'middle';
    if (variant === AxisVariant.left) textAnchor = 'end';
    if (variant === AxisVariant.right) textAnchor = 'start';
    return {
      fill: 'black',
      fontSize,
      dy: variant === AxisVariant.bottom ? '0' : '0.33em',
      textAnchor,
    };
  };

export const getLinearScale = (values: number[] = [], range) =>
  scaleLinear<number>({
    domain: [Math.min(...values), Math.max(...values)],
    range,
    round: true,
  });

export const getX =
  (scale) =>
  (lineDatum: TLineChartDatapoint): number => {
    const x = scale(lineDatum?.valueX);
    const offset = 0;
    return Number(x) + offset;
  };

export const getY =
  (scale) =>
  (lineDatum: TLineChartDatapoint): number => {
    const y = scale(lineDatum?.valueY);
    const offset = 0;
    return Number(y) + offset;
  };

export const getUniqueFlatChartValues = (prop, data): number[] =>
  flow(
    (d) =>
      flatMap(d, (lineData) =>
        lineData?.datapoints?.map((datum) => datum?.[prop]),
      ),
    uniq,
  )(data);

export const getHiddenLineColor = (palette: Palette): string =>
  palette.grey[300];
