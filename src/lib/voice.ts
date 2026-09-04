import { supabase } from './supabase'

export async function saveBiancaNote(body:string,title=''){
 if(!supabase)throw new Error('Supabase nu este configurat')
 const{data,error}=await supabase.rpc('save_bianca_note',{p_body:body,p_title:title||null})
 if(error)throw error
 return data as string
}

export async function getBiancaNotes(limit=30){
 if(!supabase)return[]
 const{data,error}=await supabase.rpc('get_bianca_notes',{p_limit:limit})
 if(error)throw error
 return(data??[])as any[]
}
