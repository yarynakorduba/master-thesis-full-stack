import React, { useEffect, useState } from 'react';
import { DefaultNode, Graph } from '@visx/network';
import {
  forceLink,
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
} from 'd3-force';
import { ParentSize } from '@visx/responsive';

export type NetworkProps = {
  width: number;
  height: number;
  nodes: any;
  edges: any;
};

interface CustomNode {
  x?: number;
  y?: number;
  id: string | number;
  label: string;
  color?: string;
}

interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

const RADIUS = 8;
const LINK_WIDTH = 3;
const LINK_DISTANCE = 100;
const FORCE_RADIUS_FACTOR = 2.5;
const NODE_STRENGTH = 250;

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

const Example = ({
  width,
  height,
  nodes: initNodes,
  edges: initEdges,
}: NetworkProps) => {
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);

  useEffect(() => {
    const simulation = forceSimulation<CustomNode, CustomLink>(initNodes)
      .force(
        'link',
        forceLink<CustomNode, CustomLink>(initEdges)
          .id((d) => d.id)
          .distance(LINK_DISTANCE),
      )
      .force('center', forceCenter(width / 3, height / 2))
      .force('charge', forceManyBody().strength(-NODE_STRENGTH))
      .force('collision', forceCollide(RADIUS * FORCE_RADIUS_FACTOR));

    // update state on every frame
    simulation.on('tick', () => {
      setNodes([...simulation.nodes()]);
      setEdges([...initEdges]);
    });

    return () => {
      simulation.stop();
    };
  }, [width, height, initEdges, initNodes]);

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

const ResponsiveExample = (props) => (
  <ParentSize
    parentSizeStyles={{ width: 'auto', maxWidth: '100%', minHeight: 300 }}
  >
    {(parent) => (
      <Example {...props} width={parent.width} height={parent.height} />
    )}
  </ParentSize>
);

export default ResponsiveExample;
