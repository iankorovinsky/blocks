"use client";

import { Editor } from "@monaco-editor/react";
import { useRoom, useOthers } from "@liveblocks/react";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";

interface CollaborativeEditorProps {
  initialValue?: string;
}

// Collaborative text editor with simple rich text, live cursors, and live avatars
export function CollaborativeEditor({ initialValue = "" }: CollaborativeEditorProps) {
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
  const others = useOthers();

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e);
  }, []);

  return (
    <Editor
      onMount={handleOnMount}
      height="100vh"
      width="100%"
      theme="vs-light"
      defaultLanguage="cairo"
      defaultValue={initialValue}
      options={{
        tabSize: 2,
        readOnly: false,
      }}
    />
  );
}