'use client'

import * as React from "react"
import { Loader2, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AISearch() {
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    try {
      // Simulate API call - replace with your actual AI endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Submitted:", input)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

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
  )
}
