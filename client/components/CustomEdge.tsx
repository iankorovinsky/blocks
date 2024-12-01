import React from "react";
import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";

const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
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
      className="edge-path"
      style={{
        strokeWidth: 2,
        stroke: '#94a3b8',
        strokeDasharray: '5,5',
        transition: 'stroke 0.2s, strokeWidth 0.2s',
      }}
    />
  );
};

export default CustomEdge;
