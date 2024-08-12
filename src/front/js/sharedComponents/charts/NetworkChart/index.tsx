import React, { useEffect, useState } from 'react';
import { Graph } from '@visx/network';
import {
  forceLink,
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
} from 'd3-force';
import { ParentSize } from '@visx/responsive';
import { isEqual } from 'lodash';
import { CustomLink, CustomNode, NetworkProps } from './types';

const RADIUS = 50;
const LINK_DISTANCE = 70;
const FORCE_RADIUS_FACTOR = 1.5;
const NODE_STRENGTH = 5;

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
        ...simulation.nodes().map((node) => ({
          ...node,
          x: Math.max(
            (node.label.length * 8) / 2,
            Math.min(width - (node.label.length * 8) / 2, node.x),
          ),
          y: Math.max(16, Math.min(height - 16, node.y)),
        })),
      ]);
      setEdges([...initEdges]);
    });

    setTimeout(() => {
      simulation.stop();
    }, 2000);

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
        graph={graph}
        top={0}
        left={0}
        nodeComponent={({ node: { color, label } }) => {
          return color ? (
            <text stroke="black" fill="black">
              {trimText(label, 300)}
            </text>
          ) : (
            <>
              <text
                stroke="black"
                fill="black"
                transform={`translate(-${(8 * label.length) / 2} 0)`}
              >
                {trimText(label, 300)}
              </text>
            </>
          );
        }}
        linkComponent={({ link: { source, target } }) => {
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
              markerEnd="url(#head)"
            />
          );
        }}
      />
    </svg>
  );
};

const ResponsiveNetworkChart = (props: NetworkProps) => (
  <ParentSize
    parentSizeStyles={{
      width: 'auto',
      maxWidth: '100%',
      minHeight: 100,
      height: props?.height || 'auto',
      margin: 8,
    }}
  >
    {(parent) => (
      <NetworkChart {...props} width={parent.width} height={parent.height} />
    )}
  </ParentSize>
);

export default React.memo(
  ResponsiveNetworkChart,
  (prev, current) =>
    isEqual(prev.nodes, current.nodes) && isEqual(prev.edges, current.edges),
);
