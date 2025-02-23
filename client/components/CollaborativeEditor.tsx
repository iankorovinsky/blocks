"use client";

import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import * as monaco from 'monaco-editor-core/esm/vs/editor/editor.api';
import { registerCairoLanguageSupport } from '../utils/cairoLanguage';


export interface EditorRef {
  getContent: () => string;
}

interface CollaborativeEditorProps {
  initialValue?: string;
  onClose?: () => void;
}

// Collaborative text editor with simple rich text, live cursors, and live avatars
export const CollaborativeEditor = forwardRef<EditorRef, CollaborativeEditorProps>(
  ({ initialValue = "", onClose }, ref) => {
    const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();

    const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor, monaco: any) => {
      setEditorRef(e);
      registerCairoLanguageSupport(monaco);
    }, []);

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef?.getValue() || "",
    }));

    return (
      <div className="flex flex-col h-full">
        <Editor
          onMount={handleOnMount}
          height="100%"
          width="100%"
          theme="vs-light"
          defaultLanguage="cairo"
          defaultValue={initialValue}
          options={{
            tabSize: 2,
            readOnly: false,
          }}
        />
      </div>
    );
  }
);