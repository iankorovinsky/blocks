import { Handle, Position } from "@xyflow/react";
import React, { useCallback } from "react";

type Props = {};

const TextNode = (props: Props) => {
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="bg-gray-200 p-3">
        <label htmlFor="text" className="ml-3">
          Text:
        </label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag bg-gray-200 border-2 border-black rounded-lg"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default TextNode;
