"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AISearch() {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    console.log('Handling submit event', { input, isLoading });

    setIsLoading(true);
    console.log('Sending request to generate blocks with prompt:', input);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      console.log('Response:', response);

      const data = await response.json();
      console.log('Received response:', data);
      
      if (data.success && data.structure) {
        console.log('Successfully generated structure, clearing editor');
        // First clear the editor
        window.dispatchEvent(new CustomEvent('clearEditor'));
        // Then load the generated structure
        window.dispatchEvent(new CustomEvent('loadExample', {
          detail: {
            nodes: data.structure.nodeData,
            edges: data.structure.edgeData
          }
        }));
        
      } else {
        console.error('Failed to generate structure:', data.error);
        throw new Error(data.error || 'Failed to generate block structure');
      }
    } catch (error) {
      console.error("Error generating blocks:", error);

    } finally {
      console.log('Request completed, resetting loading state');
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key triggered");
      handleSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background border-t max-w-full">
      <form onSubmit={handleSubmit} className="container max-w-full p-4">
        <div className="relative">
          <Textarea
            placeholder="Describe the contract structure you want to create..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-24 max-h-12"
            disabled={isLoading}
          />
          <Button
            size="icon"
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-4 bottom-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
