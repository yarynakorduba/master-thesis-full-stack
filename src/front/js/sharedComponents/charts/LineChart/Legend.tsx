import React, { ReactElement, useCallback, useMemo } from 'react';
import { Legend, LegendItem } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { useTheme, styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import { isNil } from 'lodash';
import Box from '@mui/material/Box';
import { Stack, Tooltip } from '@mui/material';
import { TLineChartData, TLineChartDatapoint } from '../../../types';
import { getHiddenLineColor, getMaxValue, getMinValue } from './utils';
import { LEGEND_HEIGHT, LEGEND_Y_PADDING } from './consts';
import { formatNumber } from '../../../utils/formatters';

const StyledMarker = styled('svg')`
  margin: 0 5px;
`;
export type TChartLegendLabel = {
  readonly id: string | number;
  readonly label: string;
  readonly color: string;
  readonly width: number;
  readonly height: number;
  readonly datapoints: TLineChartDatapoint[];
};

type TLegendMarkerProps = {
  readonly fill: string;
  readonly height?: number;
  readonly width?: number;
};

const LegendMarker = ({
  fill,
  height = 10,
  width = 10,
}: TLegendMarkerProps) => {
  return (
    <StyledMarker height={height} width={width}>
      <rect height={height} width={width} fill={fill} />
    </StyledMarker>
  );
};

const LegendItemName = ({ label, color }: any) => {
  return (
    <Typography
      noWrap
      variant="body1"
      color={color}
      sx={{ fontSize: 14, display: 'block' }}
    >
      {label}
    </Typography>
  );
};

type TCustomLegendProps = {
  readonly data: TLineChartData;
  readonly maxWidth: number;
  readonly handleHide: (dataSerieId) => void;
};

export const CustomLegend = ({
  data = [],
  maxWidth,
  handleHide,
}: TCustomLegendProps) => {
  const items = useMemo(() => {
    return (
      data?.map(
        (legendItem): TChartLegendLabel => ({
          width: 20,
          height: 4,
          ...legendItem,
        }),
      ) || []
    );
  }, [data]);

  const legendScale = useMemo(
    () =>
      scaleOrdinal({
        domain: items.map(({ id, label, color, datapoints }) => {
          return {
            id,
            label,
            color,
            dataLength: datapoints.length,
            min: getMinValue(datapoints),
            max: getMaxValue(datapoints),
          };
        }),
        range: items.map(
          ({ color, width: markerWidth, height: markerHeight }) => {
            return (
              <LegendMarker
                key={color}
                fill={color}
                width={markerWidth}
                height={markerHeight}
              />
            );
          },
        ),
      }),
    [items],
  );

  const { palette } = useTheme();
  const hiddenColor = getHiddenLineColor(palette);

  const renderItems = useCallback(
    (legendItems) => {
      return (
        <Stack direction="row" justifyContent="flex-start" width="auto">
          {legendItems.map((legendItem) => {
            const datum = legendItem?.datum;
            const shape = legendScale(datum);
            const isValidElement = React.isValidElement(shape);
            const isHidden = datum?.color === hiddenColor;

            const tooltipTitle = (
              <Box display="block">
                <LegendItemName label={datum?.label} />
                <Typography variant="body2" component="span">
                  {formatNumber(datum?.dataLength)} entries, min:{' '}
                  {!isNil(datum?.min?.valueY)
                    ? formatNumber(datum?.min?.valueY)
                    : 'N/A'}
                  , max:{' '}
                  {!isNil(datum?.max?.valueY)
                    ? formatNumber(legendItem?.datum?.max?.valueY)
                    : 'N/A'}
                </Typography>
              </Box>
            );
            return (
              <LegendItem
                onClick={() => handleHide(datum?.id)}
                style={{
                  margin: '0 16px',
                  fontSize: '0.875rem',
                  flexShrink: 2,
                  flexGrow: 0,
                  flexBasis: 'auto',
                  maxWidth: 'calc(33%)',
                }}
                key={datum?.label}
              >
                <Tooltip title={tooltipTitle} key={datum?.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    maxWidth={'100%'}
                    width="fit-content"
                  >
                    {isValidElement &&
                      React.cloneElement(shape as ReactElement)}
                    <LegendItemName
                      color={
                        isHidden ? palette.text.disabled : palette.text.primary
                      }
                      label={datum?.label}
                    />
                    {isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Box>
                </Tooltip>
              </LegendItem>
            );
          })}
        </Stack>
      );
    },
    [
      hiddenColor,
      legendScale,
      palette.text.disabled,
      palette.text.primary,
      handleHide,
    ],
  );
  return (
    <div
      style={{ maxWidth, paddingTop: LEGEND_Y_PADDING, height: LEGEND_HEIGHT }}
    >
      <Legend scale={legendScale}>{renderItems}</Legend>
    </div>
  );
};

export default CustomLegend;
