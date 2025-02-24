import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Example {
  id: number
  name: string
  data: {
    edgeData?: any[]
    nodeData?: any[]
  }
  description: string
}

export interface UserContract {
  id: number
  created_at: string
  name: string
  user: string
  data: {
    edgeData?: any[]
    nodeData?: any[]
  }
  description: string
}

export async function fetchExamples(): Promise<Example[]> {
  try {
    console.log('Fetching examples from Supabase...')
    const { data, error } = await supabase
      .from('examples')
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Raw Supabase response:', { data, error })
    return data || []
  } catch (error) {
    console.error('Error in fetchExamples:', error)
    throw error
  }
}

export async function fetchExampleById(id: number): Promise<Example | null> {
  const { data, error } = await supabase
    .from('examples')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching example:', error)
    throw error
  }

  return data
}

export async function fetchUserContracts(userEmail: string): Promise<UserContract[]> {
  try {
    console.log('Fetching user contracts from Supabase...')
    const { data, error } = await supabase
      .from('user_contracts')
      .select()
      .eq('user', userEmail)
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Raw Supabase response:', { data, error })
    return data || []
  } catch (error) {
    console.error('Error in fetchUserContracts:', error)
    throw error
  }
}

export async function saveUserContract(contract: Omit<UserContract, 'id' | 'created_at'>): Promise<UserContract> {
  console.log('🟡 saveUserContract function entered')
  console.log('🟡 Contract received:', contract)
  
  try {
    if (!supabase) {
      console.error('🔴 Supabase client not initialized')
      throw new Error('Supabase client not initialized')
    }
    console.log('🟡 Supabase client check passed')

    console.log('🟡 Contract details:', {
      name: contract.name,
      user: contract.user,
      description: contract.description,
      nodeCount: contract.data.nodeData?.length,
      edgeCount: contract.data.edgeData?.length
    })

    console.log('🟡 About to call supabase.from("user_contracts")')
    const { data, error } = await supabase
      .from('user_contracts')
      .insert(contract)
      .select()
      .single()
    
    if (error) {
      console.error('🔴 Supabase error in saveUserContract:', error)
      throw error
    }

    console.log('🟡 Supabase saveUserContract response:', data)
    return data
  } catch (error) {
    console.error('🔴 Error in saveUserContract:', error)
    throw error
  }
}

export async function saveContract(name: string, description: string | undefined, userEmail: string, nodeData: any[], edgeData: any[]) {
  console.log('Save triggered with description:', description)
  console.log('Save data:', {
    name,
    description,
    userEmail,
    nodeCount: nodeData?.length || 0,
    edgeCount: edgeData?.length || 0,
    nodes: nodeData,
    edges: edgeData
  })

  const contract = {
    name,
    description: description || '',  // Use empty string if description is undefined
    user: userEmail,
    data: {
      nodeData: nodeData || [],
      edgeData: edgeData || []
    }
  }

  try {
    console.log('Attempting to save contract:', contract)
    const { data, error } = await supabase
      .from('user_contracts')
      .insert(contract)
      .select()
      .single()
    
    if (error) {
      console.error('Error saving contract:', error)
      throw error
    }

    console.log('Contract saved successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to save contract:', error)
    throw error
  }
} 