import {supabase} from './lib/supabase'

declare global{interface Window{__biancaRoutingGuardInstalled?:boolean}}

if(typeof window!=='undefined'&&supabase&&!window.__biancaRoutingGuardInstalled){
 window.__biancaRoutingGuardInstalled=true
 const client:any=supabase
 const originalRpc=client.rpc.bind(client)
 client.rpc=(fn:string,args:any={},options?:any)=>{
  if(fn==='submit_bianca_message'&&args){
   const noteOpen=!!document.querySelector('.note-live')
   const chatName=document.querySelector('.chat-head strong')?.textContent?.trim()?.split(' — ')[0]||''
   // Într-o notă, orice adresare către „Bianca, ...” rămâne la Bianca.
   // În biroul/conversația Biancăi, simpla menționare a unui specialist nu delegă taskul.
   if(noteOpen||chatName==='Bianca')args={...args,p_agent:'personal_assistant'}
  }
  return originalRpc(fn,args,options)
 }
}

export {}
