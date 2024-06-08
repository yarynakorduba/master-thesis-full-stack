import React from 'react';
import { DefaultNode, Graph } from '@visx/network';

export type NetworkProps = {
  width: number;
  height: number;
  nodes: any;
  edges: any;
};

interface CustomNode {
  x: number;
  y: number;
  id: string | number;
  label: string;
  color?: string;
}

interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

// const nodes: CustomNode[] = [
//   { x: 50, y: 20 },
//   { x: 200, y: 250 },
//   { x: 300, y: 40, color: '#26deb0' },
// ];

// const links: CustomLink[] = [
//   { source: nodes[0], target: nodes[1] },
//   { source: nodes[1], target: nodes[2] },
//   { source: nodes[2], target: nodes[0], dashed: true },
// ];

const Example = ({ width, height, nodes, edges }: NetworkProps) => {
  const graph = { nodes, links: edges };
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={'#272b4d'} />
      <Graph<CustomLink, CustomNode>
        graph={graph as any}
        top={20}
        left={100}
        nodeComponent={({ node: { color } }) =>
          color ? <DefaultNode fill={color} /> : <DefaultNode />
        }
        linkComponent={({ link: { source, target, dashed } }) => (
          <line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            strokeWidth={2}
            stroke="#999"
            strokeOpacity={1}
            strokeDasharray={dashed ? '8,4' : undefined}
          />
        )}
      />
    </svg>
  );
};

export default Example;
