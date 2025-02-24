"use client";

import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { registerCairoLanguageSupport } from '../utils/cairoLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface EditorRef {
  getContent: () => string;
}

interface CollaborativeEditorProps {
  initialValue?: string;
  onClose?: () => void;
  name?: string;
  onSave?: (description: string) => void;
}

// Collaborative text editor with simple rich text, live cursors, and live avatars
export const CollaborativeEditor = forwardRef<EditorRef, CollaborativeEditorProps>(
  ({ initialValue = "", onClose, name = "", onSave }, ref) => {
    const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
      console.log("Setting up keyboard listener");
      
      const handleKeyDown = (e: KeyboardEvent) => {
        console.log("Key pressed:", e.key, "Ctrl:", e.ctrlKey, "Shift:", e.shiftKey);
        
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
          console.log("Ctrl+Shift+S detected!");
          e.preventDefault();
          setIsModalOpen(true);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor, monaco: any) => {
      console.log("Editor mounted");
      setEditorRef(e);
      registerCairoLanguageSupport(monaco);
    }, []);

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef?.getValue() || "",
    }));

    const handleSave = () => {
      console.log("Saving with description:", description);
      onSave?.(description);
      setIsModalOpen(false);
    };

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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

CollaborativeEditor.displayName = 'CollaborativeEditor';