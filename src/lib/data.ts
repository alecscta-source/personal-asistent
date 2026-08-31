import { supabase } from './supabase'

export async function getDashboardData() {
  if (!supabase) return { tasks: [], approvals: [], events: [], promises: [], notifications: [] }

  const [tasks, approvals, events, promises, notifications] = await Promise.all([
    supabase.from('tasks').select('*').order('priority', { ascending: false }).order('due_at', { ascending: true }).limit(20),
    supabase.from('approval_requests').select('*').eq('status', 'pending').order('requested_at', { ascending: false }).limit(20),
    supabase.from('calendar_events').select('*').order('starts_at', { ascending: true }).limit(30),
    supabase.from('promises').select('*').neq('status', 'completed').order('due_at', { ascending: true }).limit(20),
    supabase.from('notifications').select('*').neq('status', 'dismissed').order('created_at', { ascending: false }).limit(20),
  ])

  return {
    tasks: tasks.data ?? [],
    approvals: approvals.data ?? [],
    events: events.data ?? [],
    promises: promises.data ?? [],
    notifications: notifications.data ?? [],
  }
}

export async function getTaskResults(taskId: string) {
  if (!supabase) return []
  const { data } = await supabase
    .from('agent_jobs')
    .select('id,agent_name,job_type,status,result_payload,error_text,created_at,completed_at')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function decideApproval(id: string, status: 'approved' | 'rejected' | 'revision_requested') {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
    .from('approval_requests')
    .update({ status, decided_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}
