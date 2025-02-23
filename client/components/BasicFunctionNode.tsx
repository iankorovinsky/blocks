import { Handle, Position, useReactFlow, Node } from "@xyflow/react";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  data: { 
    label: string; 
    storage_variable: string;
    returnType?: string;
    parameters?: Array<{name: string, type: string}>;
    name?: string;
    type: string;
    identifier: string;
  };
  id: string;
};

const BasicFunctionNode = ({ data, id }: Props) => {
  const [inputValue, setInputValue] = useState(data.name || "");
  const [parameters, setParameters] = useState<Array<{name: string, type: string}>>(data.parameters || []);
  const [returnType, setReturnType] = useState(data.returnType || "");
  const [hasCodeNode, setHasCodeNode] = useState(false);
  const { getNodes, getEdges, setNodes } = useReactFlow();

  useEffect(() => {
    // Ensure the node has the correct type identifier
    setNodes(nodes => nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            type: 'BASIC_FUNCTION',
            identifier: 'BASIC_FUNCTION'
          }
        };
      }
      return node;
    }));
  }, [id, setNodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      const edges = getEdges();
      const nodes = getNodes();
      
      // Get all connected nodes
      const connectedEdges = edges.filter((edge) => edge.target === id || edge.source === id);
      const connectedNodeIds = connectedEdges.map((edge) => 
        edge.target === id ? edge.source : edge.target
      );

      // Process parameters (TypedVariable nodes)
      const paramNodes = nodes.filter(
        (node) => connectedNodeIds.includes(node.id) && node.type === "typedVariable"
      );
      
      const newParams = paramNodes.map(node => {
        // Find the primitive type connected to this typed variable
        const typeEdge = edges.find(edge => edge.target === node.id);
        const typeNode = typeEdge ? nodes.find(n => n.id === typeEdge.source) : null;
        return {
          name: (node.data?.label as string) || "",
          type: (typeNode?.data?.identifier as string) || "unknown"
        };
      });

      // Process return type (direct Primitive node connection)
      const returnTypeNode = nodes.find(
        (node) => connectedNodeIds.includes(node.id) && node.type === "primitive"
      );
      const newReturnType = (returnTypeNode?.data?.identifier as string) || "";

      // Check for code node
      const codeNodes = nodes.filter(
        (node) => connectedNodeIds.includes(node.id) && node.type === "code"
      );
      setHasCodeNode(codeNodes.length > 0);

      // Update state and node data if changes detected
      if (JSON.stringify(parameters) !== JSON.stringify(newParams) || returnType !== newReturnType) {
        setParameters(newParams);
        setReturnType(newReturnType);
        
        // Update node data
        setNodes(nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                parameters: newParams,
                returnType: newReturnType,
                name: inputValue
              }
            };
          }
          return node;
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getNodes, getEdges, id, setNodes, parameters, returnType, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // Update node data
    setNodes(nodes => nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            name: newValue
          }
        };
      }
      return node;
    }));
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[280px] text-white border border-gray-800 relative">
      <Handle
        type="target"
        position={Position.Right}
        className="!absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 !bg-blue-400 border-2 border-[#1a1a1a]"
      />

      {/* Triangle with F label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-pink-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          F
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <label className="text-sm text-gray-400">Name</label>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="nodrag w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter value..."
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <label className="text-sm text-gray-400">Parameters</label>
          </div>
          <div className={`w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border ${parameters.length > 0 ? 'border-blue-700 text-white-500' : 'border-gray-800 text-gray-500'}`}>
            {parameters.length > 0 
              ? parameters.map((param, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{param.name} ({param.type})</span>
                  </div>
                ))
              : 'Connect to add parameters'
            }
          </div>
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <label className="text-sm text-gray-400">Return Type</label>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border border-gray-800 text-gray-500">
            <span className={returnType ? "text-white" : ""}>
              {returnType ? `Returns ${returnType}` : 'Connect to add return type'}
            </span>
          </div>
        </div>

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <label className="text-sm text-gray-400">Logic</label>
          </div>
          <div className={`w-full bg-[#2a2a2a] rounded-md px-3 py-1.5 text-sm border ${hasCodeNode ? 'border-pink-700 text-white' : 'border-gray-800 text-gray-500'}`}>
            {hasCodeNode ? 'Code implementation connected' : 'Connect to add logic'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicFunctionNode;
