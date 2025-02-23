import { Editor } from "@monaco-editor/react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Code2 } from "lucide-react";
import { useCallback, useState } from "react";
import { editor } from "monaco-editor";
import { registerCairoLanguageSupport } from '../utils/cairoLanguage';

type Props = {
  data: { label: string; code: string };
  id: string;
};

const CodeNode = ({ data, id }: Props) => {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const { setNodes } = useReactFlow();

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor, monaco: any) => {
    setEditorRef(e);
    registerCairoLanguageSupport(monaco);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, code: value || "" };
        }
        return node;
      })
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg w-[400px] text-white border border-gray-800 relative">
      {/* Triangle with C label */}
      <div
        className="absolute -top-px -right-px w-0 h-0 
        border-t-[30px] border-l-[30px] 
        border-t-pink-500 border-l-transparent
        overflow-visible rounded"
      >
        <span className="absolute -top-[27px] -left-[12px] text-[11px] font-sm text-white">
          C
        </span>
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-medium">{data.label}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="h-[200px] w-full">
          <Editor
            height="100%"
            defaultLanguage="cairo"
            defaultValue={data.code || ""}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              tabSize: 2,
            }}
            onChange={handleEditorChange}
            onMount={handleOnMount}
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-400 border-2 border-[#1a1a1a]"
      />
    </div>
  );
};

export default CodeNode; 