'use client'

import { ChatBot } from "./Chatbot"
import { CollaborativeEditor } from "./CollaborativeEditor"
// @ts-ignore
import { useEditorStore } from "./Navbar"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Bot, ChevronLeft, ChevronRight, Code, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export function SidePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [view, setView] = useState<'chat' | 'code'>('chat')
  const { codeContent, isEditorVisible, setEditorVisible } = useEditorStore()

  useEffect(() => {
    if (isEditorVisible) {
      setIsExpanded(true)
      setView('code')
    }
  }, [isEditorVisible])

  if (!isExpanded) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Open panel</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="w-[380px] h-[600px] flex flex-col shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground p-4">
          <div className="flex items-center gap-2">
            {view === 'chat' ? (
              <Bot className="w-5 h-5" />
            ) : (
              <Code className="w-5 h-5" />
            )}
            <span className="font-semibold">{view === 'chat' ? 'CairoGPT' : 'Cairo Editor'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setView(view === 'chat' ? 'code' : 'chat')}
              className="h-8 w-8 hover:bg-primary/80"
            >
              {view === 'chat' ? <Code className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 hover:bg-primary/80"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setEditorVisible(false)
                setIsExpanded(false)
              }}
              className="h-8 w-8 hover:bg-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 transition-transform duration-300 w-full h-full flex",
            view === 'chat' ? 'translate-x-0' : '-translate-x-full'
          )}>
            <div className="w-full h-full flex-shrink-0">
              <ChatBot />
            </div>
            <div className="w-full h-full flex-shrink-0">
              <CollaborativeEditor initialValue={codeContent} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 