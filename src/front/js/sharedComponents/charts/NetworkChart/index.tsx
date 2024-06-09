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

const RADIUS = 50;
const LINK_WIDTH = 3;
const LINK_DISTANCE = 50;
const FORCE_RADIUS_FACTOR = 1.5;
const NODE_STRENGTH = 20;

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

const NetworkChart = ({
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
      .force('center', forceCenter(width / 2, height / 2))
      .force('charge', forceManyBody().strength(NODE_STRENGTH))
      .force('collision', forceCollide(RADIUS * FORCE_RADIUS_FACTOR));

    // update state on every frame
    simulation.on('tick', () => {
      setNodes([
        ...simulation.nodes(),
        // .map((node) => ({
        //   ...node,
        //   x: Math.max(
        //     (node.label * 8) / 2,
        //     Math.min(width - (node.label * 8) / 2, node.x),
        //   ),
        //   y: Math.max(16, Math.min(height - 16, node.y)),
        // })),
      ]);
      setEdges([...initEdges]);
    });

    return () => {
      simulation.stop();
    };
  }, [width, height, initEdges, initNodes]);

  const graph = { nodes, links: edges };

  const trimText = (text, threshold) => {
    if (text.length <= threshold) return text;
    return text.substr(0, threshold).concat('...');
  };
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <defs>
        <marker
          id="head"
          orient="auto"
          viewBox="-0 -5 10 10"
          markerWidth="8"
          markerHeight="13"
          refX="10"
          refY="0"
        >
          <path d="M 0,-5 L 10 ,0 L 0,5" fill="#999" />
        </marker>
      </defs>
      <rect width={width} height={height} rx={14} fill={'white'} />
      <Graph<CustomLink, CustomNode>
        graph={graph as any}
        top={0}
        left={0}
        nodeComponent={({ node: { color, x, y, label, ...props } }) => {
          console.log('PROPS -- > ', props);
          return color ? (
            <text stroke="black" fill="black">
              {trimText(label, 30)}
            </text>
          ) : (
            <>
              <text
                stroke="black"
                fill="black"
                transform={`translate(-${(8 * label.length) / 2} 0)`}
              >
                {trimText(label, 30)}
              </text>
            </>
          );
        }}
        linkComponent={({ link: { source, target, dashed } }) => {
          const sourceX = source.x || 0;
          const sourceY = source.y || 0;
          const targetX = target.x || 0;
          const targetY = target.y || 0;

          return (
            <line
              x1={sourceX}
              y1={sourceY > targetY ? sourceY - 12 : sourceY + 5}
              x2={targetX}
              y2={targetY > sourceY ? targetY - 12 : targetY + 5}
              strokeWidth={2}
              stroke="#999"
              strokeOpacity={1}
              strokeDasharray={dashed ? '8,4' : undefined}
              markerEnd="url(#head)"
            />
          );
        }}
      />
    </svg>
  );
};

const ResponsiveNetworkChart = (props) => (
  <ParentSize
    parentSizeStyles={{ width: 'auto', maxWidth: '100%', minHeight: 300 }}
  >
    {(parent) => (
      <NetworkChart {...props} width={parent.width} height={parent.height} />
    )}
  </ParentSize>
);

export default ResponsiveNetworkChart;
