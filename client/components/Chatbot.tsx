'use client'

import React from 'react'
import { Bot, SendHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatBot() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called')
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      console.log('Sending request to chatbot API...')
      const response = await fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          force_regenerate: false
        }),
      })

      const data = await response.json()
      console.log('Received response data:', data)

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred')
      }

      // Add the assistant's response to messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer 
      }])
      
    } catch (error) {
      console.error('Error in chatbot:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error instanceof Error ? error.message : 'Sorry, there was an error processing your request.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 p-4 rounded-lg",
                  message.role === 'assistant'
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.role === 'assistant' && (
                  <Bot className="w-6 h-6 mt-1" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4 rounded-lg bg-muted">
                <Bot className="w-6 h-6 mt-1" />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Cairo..."
              className="flex-1 p-2 bg-background border rounded-md"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading}
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}