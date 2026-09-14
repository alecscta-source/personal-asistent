import {useEffect,useMemo,useState} from 'react'
import {createPortal} from 'react-dom'
import {supabase} from './lib/supabase'

type WorkRow={task_id?:string;job_id?:string;at?:string;from_agent?:string;to_agent?:string;kind?:string;body?:string;job_type?:string;status?:string;task_title?:string}
const names:Record<string,string>={owner:'Tu',system:'Sistem',personal_assistant:'Bianca',secretara:'Ana',inginer:'Dorin',vlad_instalatii:'Vlad',sorin_tratare:'Sorin',catalin_sauna_hammam:'Cătălin',radu_constructii:'Radu',elena_normative:'Elena',economist:'Irina',contabil:'Ioana',marketing:'Diana'}
const label=(k?:string)=>k?names[k]||k:'—'
const kindLabel=(k?:string)=>({delegation:'CERINȚĂ PRIMITĂ',task:'TASK CREAT',result:'REZULTAT',subdelegation:'SUBDELEGARE'} as Record<string,string>)[k||'']||String(k||'ACTIVITATE').toUpperCase()

export default function AgentWorkTrace(){
 const[target,setTarget]=useState<HTMLElement|null>(null)
 const[agent,setAgent]=useState('')
 const[rows,setRows]=useState<WorkRow[]>([])
 const[loading,setLoading]=useState(false)
 const[error,setError]=useState('')
 useEffect(()=>{const sync=()=>{const chat=document.querySelector('.chat-layout[data-agent]') as HTMLElement|null;const messages=chat?.querySelector('.messages') as HTMLElement|null;const key=chat?.dataset.agent||'';setTarget(messages);setAgent(key)};const o=new MutationObserver(sync);o.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-agent']});addEventListener('hashchange',sync);addEventListener('popstate',sync);sync();return()=>{o.disconnect();removeEventListener('hashchange',sync);removeEventListener('popstate',sync)}},[])
 useEffect(()=>{if(!agent||agent==='personal_assistant'||!supabase){setRows([]);setError('');return}let dead=false;const load=async()=>{setLoading(true);try{const{data,error}=await supabase.rpc('get_agent_work_feed',{p_agent:agent,p_limit:100});if(error)throw error;if(!dead){setRows((data??[])as WorkRow[]);setError('')}}catch(e:any){if(!dead)setError(e?.message||'Nu am putut încărca fluxul agentului.')}finally{if(!dead)setLoading(false)}};void load();const t=setInterval(load,5000);return()=>{dead=true;clearInterval(t)}},[agent])
 const content=useMemo(()=>{if(!agent||agent==='personal_assistant')return null;if(loading&&!rows.length)return <div className="agent-trace-state">Se încarcă fluxul de lucru…</div>;if(error)return <div className="agent-trace-state error">{error}</div>;if(!rows.length)return <div className="agent-trace-state">Nu există încă task-uri sau delegări pentru {label(agent)}.</div>;return <div className="agent-work-trace">{rows.map((r,i)=>{const from=label(r.from_agent),to=r.to_agent?label(r.to_agent):'';return <article className={`agent-trace-row kind-${r.kind||'activity'}`} key={`${r.job_id||r.task_id||i}-${r.kind}-${r.at||i}`} title={r.task_id?`Task ${r.task_id}`:undefined}><div className="agent-trace-meta"><span className="agent-trace-kind">{kindLabel(r.kind)}</span><span>{from}{to?` → ${to}`:''}</span><span className={`agent-trace-status status-${r.status||'unknown'}`}>{r.status||''}</span></div><div className="agent-trace-body">{r.body||'—'}</div><footer>{r.task_title&&<span>{r.task_title}</span>}{r.at&&<time>{new Date(r.at).toLocaleString('ro-RO',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</time>}</footer></article>})}</div>},[agent,rows,loading,error])
 if(!target||!content)return null
 return createPortal(content,target)
}
