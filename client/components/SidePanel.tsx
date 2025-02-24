'use client'

import { ChatBot } from "./Chatbot"
import { CollaborativeEditor } from "./CollaborativeEditor"
import { useEditorStore } from "@/stores/editorStore"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Bot, ChevronLeft, ChevronRight, Code, History, BookOpen, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function SidePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('chatbot')
  const { codeContent, isEditorVisible, setEditorVisible } = useEditorStore()

  useEffect(() => {
    if (isEditorVisible) {
      setIsExpanded(true)
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
            <Bot className="w-5 h-5" />
            <span className="font-semibold">Cairo Assistant</span>
          </div>
          <div className="flex items-center gap-2">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="sticky top-0 z-10 bg-background border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chatbot" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>Chatbot</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger value="examples" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Examples</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="chatbot" className="flex-1 mt-0 h-full">
                <ChatBot />
              </TabsContent>
              <TabsContent value="history" className="flex-1 mt-0">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">History</h3>
                  {/* History content will go here */}
                </div>
              </TabsContent>
              <TabsContent value="examples" className="flex-1 mt-0">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Examples</h3>
                  {/* Examples content will go here */}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 