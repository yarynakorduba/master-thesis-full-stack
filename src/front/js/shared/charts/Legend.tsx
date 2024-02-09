import React, { ReactElement, useCallback } from 'react';
import { Legend, LegendItem } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledMarker = styled.svg`
  margin: 0 5px;
`;
export type TChartLegendLabel = {
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
  readonly items: TChartLegendLabel[];
  readonly maxWidth: number;
};

export const CustomLegend = ({ items = [], maxWidth }: TCustomLegendProps) => {
  const legendScale = scaleOrdinal({
    domain: items.map(({ label }) => label),
    range: items.map(({ color, width: markerWidth, height: markerHeight }) => {
      return <LegendMarker key={color} fill={color} width={markerWidth} height={markerHeight} />;
    })
  });

  const renderItems = useCallback(
    (legendItems) => {
      return (
        <StyledContainer>
          {legendItems.map((legendItem) => {
            const shape = legendScale(legendItem.datum);
            const isValidElement = React.isValidElement(shape);
            return (
              <LegendItem margin={10} style={{ fontSize: '0.875rem' }} key={legendItem.text}>
                {isValidElement && React.cloneElement(shape as ReactElement)}
                {legendItem?.datum}
              </LegendItem>
            );
          })}
        </StyledContainer>
      );
    },
    [legendScale]
  );
  return (
    <div style={{ maxWidth }}>
      <Legend scale={legendScale}>{renderItems}</Legend>
    </div>
  );
};

export default CustomLegend;
