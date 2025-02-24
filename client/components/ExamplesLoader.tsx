import { useEffect, useState } from 'react'
import { useFlow } from '@/contexts/FlowContext'
import { Example, fetchExamples } from '@/lib/supabase'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

interface ExamplesLoaderProps {
  isActive: boolean;
}

export function ExamplesLoader({ isActive }: ExamplesLoaderProps) {
  const [examples, setExamples] = useState<Example[]>([])
  const { setLocalNodes, setLocalEdges } = useFlow()

  useEffect(() => {
    if (isActive) {
      console.log('Examples tab activated, fetching examples...')
      loadExamples()
    }
  }, [isActive])

  async function loadExamples() {
    try {
      const data = await fetchExamples()
      console.log('Supabase response:', {
        count: data.length,
        examples: data
      })
      setExamples(data)
    } catch (error) {
      console.error('Failed to load examples:', error)
    }
  }

  function loadExample(example: Example) {
    console.log('Loading example:', {
      id: example.id,
      name: example.name,
      nodeCount: example.data?.nodeData?.length || 0,
      edgeCount: example.data?.edgeData?.length || 0
    })

    // First clear the editor
    window.dispatchEvent(new CustomEvent('clearEditor'))

    // Then load the example data
    if (example.data) {
      const { nodeData = [], edgeData = [] } = example.data
      window.dispatchEvent(new CustomEvent('loadExample', {
        detail: {
          nodes: nodeData,
          edges: edgeData
        }
      }))
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Example Contracts</h3>
      <ScrollArea className="h-[450px]">
        <div className="space-y-2">
          {examples.map((example) => (
            <Button
              key={example.id}
              onClick={() => loadExample(example)}
              variant="outline"
              className="w-full text-left flex flex-col items-start gap-1 h-auto p-4"
            >
              <span className="font-medium">{example.name}</span>
              <span className="text-sm text-muted-foreground">{example.description}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 