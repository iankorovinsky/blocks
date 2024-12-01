import React from "react";
import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";
import { X } from "lucide-react";

const CustomEdge = ({
  // id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  // data,
}: EdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 2,
        stroke: '#94a3b8', // Tailwind slate-400
        strokeDasharray: '5,5',
        transition: 'stroke 0.2s, strokeWidth 0.2s',
        '&:hover': {
          strokeWidth: 3,
          stroke: '#475569', // Tailwind slate-600
        },
      }}
    />
  );
};

export default CustomEdge;
