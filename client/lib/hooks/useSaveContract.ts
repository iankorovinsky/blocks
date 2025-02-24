import { useEffect } from 'react'

export function useSaveContract() {
  console.log('SAVE HOOK INITIALIZED')

  useEffect(() => {
    console.log('SAVE HOOK EFFECT RUNNING')
    
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key)
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
        event.preventDefault()
        console.log('SAVE HOOK TRIGGERED - Ctrl+Shift+S pressed')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
} 