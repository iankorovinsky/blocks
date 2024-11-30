import { Handle, Position } from "@xyflow/react";
import React, { useCallback } from "react";

type Props = {};

const SetFunctionNode = (props: Props) => {
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div className="bg-black p-3">
        <p className="text-white">Set</p>

        <label htmlFor="text" className="block">
          Text:
        </label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag border-2 border-black rounded-lg"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default SetFunctionNode;
