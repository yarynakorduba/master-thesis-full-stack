export type TAxisTooltip = {
  readonly tooltipTop?: number;
  readonly tooltipLeft?: number;
  readonly tooltipData?: string | number;
};

export type TPointTooltipDatum = {
  readonly color: string;
  readonly data: { readonly id: string; readonly valueX: number; readonly valueY: number };
};

export type TPointTooltip = {
  readonly tooltipTop?: number;
  readonly tooltipLeft?: number;
  readonly tooltipData?: TPointTooltipDatum[];
};
