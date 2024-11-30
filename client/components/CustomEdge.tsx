import React from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";
import { X } from "lucide-react";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <foreignObject
        width={20}
        height={20}
        x={labelX - 10}
        y={labelY - 10}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full cursor-pointer hover:bg-red-600">
          <X
            className="w-3 h-3 text-white"
            onClick={(event) => {
              event.stopPropagation();
              // data.onEdgeClick(id);
            }}
          />
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
