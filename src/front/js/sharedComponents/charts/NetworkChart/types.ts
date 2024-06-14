export type CustomNode = {
  x?: number;
  y?: number;
  id: string | number;
  label: string;
  color?: string;
};

export type CustomLink = {
  source: CustomNode;
  target: CustomNode;
};

export type NetworkProps = {
  width: number;
  height: number;
  nodes: CustomNode[];
  edges: CustomLink[];
};
