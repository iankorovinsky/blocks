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