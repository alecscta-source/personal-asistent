import { supabase } from './supabase'

export type BiancaUiState = {
  attention: any[]
  agents: any[]
  tasks: any[]
  approvals: any[]
  calendar: any[]
  promises: any[]
}

const emptyState: BiancaUiState = { attention: [], agents: [], tasks: [], approvals: [], calendar: [], promises: [] }

export async function getBiancaUiState(): Promise<BiancaUiState> {
  if (!supabase) return emptyState
  const { data, error } = await supabase.rpc('get_bianca_ui_state')
  if (error) {
    console.error('Bianca UI state:', error.message)
    return emptyState
  }
  return { ...emptyState, ...(data ?? {}) }
}

export async function getDashboardData() {
  const state = await getBiancaUiState()
  return { tasks: state.tasks, approvals: state.approvals, events: state.calendar, promises: state.promises, notifications: state.attention, agents: state.agents }
}

export async function getTaskResults(taskId: string) {
  if (!supabase) return []
  const { data } = await supabase.from('agent_jobs').select('id,agent_name,job_type,status,result_payload,error_text,created_at,completed_at').eq('task_id', taskId).order('created_at', { ascending: true })
  return data ?? []
}

export async function decideApproval(id: string, status: 'approved' | 'rejected' | 'revision_requested') {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase.from('approval_requests').update({ status, decided_at: new Date().toISOString() }).eq('id', id).select().single()
}
