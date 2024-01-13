import { AxisVariant } from "../ChartOverlays/hooks";
import { scaleLinear } from "@visx/scale";

export const formatAxisTick = (handler) => (text) => (handler ? handler(text) : text);

export const getAxisTickLabelProps =
  (variant = AxisVariant.bottom, fontSize = "0.75rem") =>
  () => {
    let textAnchor = "middle";
    if (variant === AxisVariant.left) textAnchor = "end";
    if (variant === AxisVariant.right) textAnchor = "start";
    return {
      fill: "black", //Text.Default,
      fontSize,
      dy: variant === AxisVariant.bottom ? 0 : "0.33em",
      textAnchor,
    };
  };

export const getLinearScale = (values: number[] = [], range): any =>
  scaleLinear({
    domain: [Math.min(...values), Math.max(...values)],
    range,
  });
