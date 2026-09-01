import { supabase } from './supabase'
export type BiancaUiState={attention:any[];agents:any[];tasks:any[];approvals:any[];calendar:any[];promises:any[]}
export type PrincipalContext={user_id?:string;display_name?:string;email?:string;founder_of?:string;specialization?:string;companies?:any[]}
export const emptyState:BiancaUiState={attention:[],agents:[],tasks:[],approvals:[],calendar:[],promises:[]}
export async function getSession(){if(!supabase)return null;return (await supabase.auth.getSession()).data.session}
export async function sendLoginLink(email:string){if(!supabase)throw new Error('Supabase nu este configurat');return supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}})}
export async function signOut(){return supabase?.auth.signOut()}
export function onAuthChange(cb:()=>void){return supabase?.auth.onAuthStateChange(()=>cb())}
export async function getPrincipalContext():Promise<PrincipalContext>{if(!supabase)return{};const{data,error}=await supabase.rpc('current_principal_context');if(error)throw error;return(data??{})as PrincipalContext}
export async function getBiancaUiState():Promise<BiancaUiState>{if(!supabase)return emptyState;const{data,error}=await supabase.rpc('get_bianca_ui_state');if(error)throw error;return{...emptyState,...(data??{})}}
export async function getBiancaTaskResults(){if(!supabase)return[];const{data,error}=await supabase.rpc('get_bianca_task_results');if(error)throw error;return(data??[])as any[]}
export async function snoozeAttention(taskId:string,minutes=60){if(!supabase)throw new Error('Supabase nu este configurat');const{error}=await supabase.rpc('snooze_bianca_attention',{p_task_id:taskId,p_minutes:minutes});if(error)throw error}
export async function decideApproval(id:string,status:'approved'|'rejected'|'revision_requested'){if(!supabase)throw new Error('Supabase nu este configurat');const{data,error}=await supabase.rpc('decide_bianca_approval',{p_id:id,p_status:status});if(error)throw error;return data}
export async function submitMessage(message:string,agent='personal_assistant'){if(!supabase)throw new Error('Supabase nu este configurat');const{data,error}=await supabase.rpc('submit_bianca_message',{p_message:message,p_agent:agent});if(error)throw error;return data as string}
