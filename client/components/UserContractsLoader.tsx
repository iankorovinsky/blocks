import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserContract, fetchUserContracts, deleteUserContract } from '@/lib/supabase'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface UserContractsLoaderProps {
  isActive: boolean
  userEmail: string
}

export function UserContractsLoader({ isActive, userEmail }: UserContractsLoaderProps) {
  const [contracts, setContracts] = useState<UserContract[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isActive && userEmail) {
      loadContracts()
    }
  }, [isActive, userEmail])

  async function loadContracts() {
    try {
      setIsLoading(true)
      console.log('Loading contracts for:', userEmail)
      const data = await fetchUserContracts(userEmail)
      console.log('Loaded contracts:', data)
      setContracts(data)
    } catch (error) {
      console.error('Failed to load contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function loadContract(contract: UserContract) {
    console.log('Loading contract:', contract)

    // First clear the editor
    window.dispatchEvent(new CustomEvent('clearEditor'))

    // Then load the contract data
    if (contract.data) {
      window.dispatchEvent(new CustomEvent('loadExample', {
        detail: {
          nodes: contract.data.nodeData,
          edges: contract.data.edgeData
        }
      }))
    }
  }

  async function handleDelete(e: React.MouseEvent, contract: UserContract) {
    e.stopPropagation() // Prevent triggering the loadContract
    try {
      await deleteUserContract(contract.id)
      setContracts(contracts.filter(c => c.id !== contract.id))
      toast({
        title: "Contract deleted",
        variant: "success",
        description: `Successfully deleted "${contract.name}"`,
      })
    } catch (error) {
      console.error('Failed to delete contract:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete contract. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Saved Contracts</h3>
      <ScrollArea className="h-[450px]">
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-sm text-muted-foreground p-4">
              Loading your contracts...
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-sm text-muted-foreground p-4">
              No saved contracts found. Press CTRL + Shift + S to save your current contract.
            </div>
          ) : (
            contracts.map((contract) => (
              <div key={contract.id} className="group relative">
                <Button
                  onClick={() => loadContract(contract)}
                  variant="outline"
                  className="w-full text-left flex flex-col items-start gap-1 h-auto p-4"
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{contract.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {contract.description && (
                    <span className="text-sm text-muted-foreground">{contract.description}</span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(e, contract)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 