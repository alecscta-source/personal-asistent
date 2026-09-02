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
export async function getBiancaRecentDecisions(){if(!supabase)return[];const{data,error}=await supabase.rpc('get_bianca_recent_decisions');if(error)throw error;return(data??[])as any[]}
export async function getBiancaTaskTimeline(taskId:string){if(!supabase)return{};const{data,error}=await supabase.rpc('get_bianca_task_timeline',{p_task_id:taskId});if(error)throw error;return(data??{})as any}
export async function getBiancaConversationFeed(limit=60){if(!supabase)return[];const{data,error}=await supabase.rpc('get_bianca_conversation_feed',{p_limit:limit});if(error)throw error;return(data??[])as any[]}
export async function snoozeAttention(taskId:string,minutes=60){if(!supabase)throw new Error('Supabase nu este configurat');const{error}=await supabase.rpc('snooze_bianca_attention',{p_task_id:taskId,p_minutes:minutes});if(error)throw error}
export async function decideApproval(id:string,status:'approved'|'rejected'|'revision_requested'){if(!supabase)throw new Error('Supabase nu este configurat');const{data,error}=await supabase.rpc('decide_bianca_approval',{p_id:id,p_status:status});if(error)throw error;return data}
export async function submitMessage(message:string,agent='personal_assistant'){if(!supabase)throw new Error('Supabase nu este configurat');const{data,error}=await supabase.rpc('submit_bianca_message',{p_message:message,p_agent:agent});if(error)throw error;return data as string}
export async function uploadBiancaFiles(files:File[],message='',agent='personal_assistant'){
 if(!supabase)throw new Error('Supabase nu este configurat');const session=(await supabase.auth.getSession()).data.session;if(!session)throw new Error('Autentificare necesară');const out:any[]=[]
 for(const file of files){const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const path=`${session.user.id}/${Date.now()}-${crypto.randomUUID()}-${safe}`;const{error:upErr}=await supabase.storage.from('bianca-files').upload(path,file,{contentType:file.type||undefined,upsert:false});if(upErr)throw upErr;const{data,error}=await supabase.rpc('register_bianca_upload',{p_path:path,p_name:file.name,p_mime:file.type||'application/octet-stream',p_size:file.size,p_message:message,p_agent:agent});if(error)throw error;out.push({task_id:data,path,name:file.name})}return out
}
export async function getPrivateFileUrl(path:string,expiresIn=300){if(!supabase)throw new Error('Supabase nu este configurat');const{data,error}=await supabase.storage.from('bianca-files').createSignedUrl(path,expiresIn);if(error)throw error;return data.signedUrl}
