import React, { ReactElement, useCallback, useMemo } from 'react';
import { Legend, LegendItem } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import { TLineChartData } from 'front/js/types';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledMarker = styled.svg`
  margin: 0 5px;
`;
export type TChartLegendLabel = {
  readonly id: string | number;
  readonly label: string;
  readonly color: string;
  readonly width: number;
  readonly height: number;
};

type TLegendMarkerProps = {
  readonly fill: string;
  readonly height?: number;
  readonly width?: number;
};

const LegendMarker = ({ fill, height = 10, width = 10 }: TLegendMarkerProps) => {
  return (
    <StyledMarker height={height} width={width}>
      <rect height={height} width={width} fill={fill} />
    </StyledMarker>
  );
};

type TCustomLegendProps = {
  readonly data: TLineChartData;
  readonly maxWidth: number;
  readonly handleHide: (dataSerieId) => void;
};

export const CustomLegend = ({ data = [], maxWidth, handleHide }: TCustomLegendProps) => {
  const items = useMemo(() => {
    return (
      data?.map(
        (legendItem): TChartLegendLabel => ({
          width: 20,
          height: 4,
          ...legendItem
        })
      ) || []
    );
  }, [data]);

  console.log('---->>> ITEM DAATA -- > ', items);

  const legendScale = useMemo(
    () =>
      scaleOrdinal({
        domain: items.map(({ id, label, color }) => ({ id, label, color })),
        range: items.map(({ color, width: markerWidth, height: markerHeight }) => {
          return (
            <LegendMarker key={color} fill={color} width={markerWidth} height={markerHeight} />
          );
        })
      }),
    [items]
  );

  const { palette } = useTheme();
  const hiddenColor = palette.grey[300];

  const renderItems = useCallback(
    (legendItems) => {
      return (
        <StyledContainer>
          {legendItems.map((legendItem) => {
            const shape = legendScale(legendItem.datum);
            const isValidElement = React.isValidElement(shape);
            const isHidden = legendItem?.datum?.color === hiddenColor;
            return (
              <LegendItem
                onClick={() => handleHide(legendItem?.datum?.id)}
                style={{
                  margin: '0 16px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                key={legendItem?.datum?.label}
              >
                {isValidElement && React.cloneElement(shape as ReactElement)}
                <Typography color={isHidden ? palette.text.disabled : palette.text.primary}>
                  {legendItem?.datum?.label}
                </Typography>
                {isHidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </LegendItem>
            );
          })}
        </StyledContainer>
      );
    },
    [hiddenColor, legendScale, palette.text.disabled, palette.text.primary, handleHide]
  );
  return (
    <div style={{ maxWidth }}>
      <Legend scale={legendScale}>{renderItems}</Legend>
    </div>
  );
};

export default CustomLegend;
