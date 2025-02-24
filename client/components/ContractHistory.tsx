import { UserContractsLoader } from './UserContractsLoader'
import { useSaveContract } from '@/lib/hooks/useSaveContract'

interface ContractHistoryProps {
  isActive: boolean
  userEmail: string
}

export function ContractHistory({ isActive, userEmail }: ContractHistoryProps) {
  console.log('ContractHistory component rendering with:', { isActive, userEmail })
  
  // Set up save shortcut
  useSaveContract()

  return (
    <div className="p-4">
      <UserContractsLoader isActive={isActive} userEmail={userEmail} />
    </div>
  )
} 