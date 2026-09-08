import {useEffect,useRef,useState} from 'react'
import {ChevronDown,ChevronUp,MessageCircleMore,Mic,Send,Square} from 'lucide-react'
import {getBiancaConversationFeed,submitMessage} from './lib/data'

const agentMap:Record<string,string>={Bianca:'personal_assistant',Ana:'secretara',Dorin:'inginer',Vlad:'vlad_instalatii',Sorin:'sorin_tratare','Cătălin':'catalin_sauna_hammam',Catalin:'catalin_sauna_hammam',Radu:'radu_constructii',Elena:'elena_normative',Irina:'economist',Ioana:'contabil',Diana:'marketing'}
const personFromPage=()=>{if((location.hash||'#home')==='#home')return'Bianca';const label=document.querySelector('.chat-head strong')?.textContent?.trim()||'Bianca';return label.split(' — ')[0]||'Bianca'}

export default function HomeCommand(){
 const [visible,setVisible]=useState((location.hash||'#home')==='#home'||location.hash==='#chat')
 const [person,setPerson]=useState(personFromPage())
 const [text,setText]=useState('')
 const [busy,setBusy]=useState(false)
 const [listening,setListening]=useState(false)
 const [status,setStatus]=useState('')
 const [conversation,setConversation]=useState<any[]>([])
 const [expanded,setExpanded]=useState(false)
 const recognition=useRef<any>(null)
 const dialogueScroll=useRef<HTMLDivElement|null>(null)
 const previousCount=useRef(0)

 useEffect(()=>{const sync=()=>{const h=location.hash||'#home';setVisible(h==='#home'||h==='#chat');setTimeout(()=>setPerson(personFromPage()),0)};const observer=new MutationObserver(()=>setPerson(personFromPage()));observer.observe(document.body,{subtree:true,childList:true,characterData:true});addEventListener('hashchange',sync);addEventListener('popstate',sync);sync();return()=>{observer.disconnect();removeEventListener('hashchange',sync);removeEventListener('popstate',sync);try{recognition.current?.abort()}catch{}}},[])
 useEffect(()=>{if(!visible)return;let dead=false;const load=async()=>{try{const feed=await getBiancaConversationFeed(40);if(dead)return;const rows=feed.filter((x:any)=>x.sender==='owner'||x.sender==='agent'||x.kind==='request'||x.kind==='result').slice(-10);setConversation(rows)}catch{}};void load();const t=setInterval(load,1500);return()=>{dead=true;clearInterval(t)}},[visible])
 useEffect(()=>{if(!expanded)return;const el=dialogueScroll.current;if(!el)return;requestAnimationFrame(()=>{el.scrollTop=el.scrollHeight;requestAnimationFrame(()=>{el.scrollTop=el.scrollHeight})})},[conversation,expanded])
 useEffect(()=>{if(conversation.length>previousCount.current&&previousCount.current>0)setExpanded(true);previousCount.current=conversation.length},[conversation.length])
 if(!visible)return null
 const agent=agentMap[person]||'personal_assistant'
 const send=async()=>{const message=text.trim();if(!message||busy)return;setBusy(true);setStatus('');setExpanded(true);setConversation(c=>[...c,{sender:'owner',kind:'request',body:message,at:new Date().toISOString(),agent,_local:true}].slice(-10));setText('');try{await submitMessage(message,agent);setStatus(`${person} lucrează la răspuns…`)}catch(e:any){setStatus(`Nu am putut trimite: ${e?.message||'eroare'}`)}finally{setBusy(false)}}
 const toggleMic=()=>{if(listening){try{recognition.current?.stop()}catch{};setListening(false);return}const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;if(!SR){setStatus('Recunoașterea vocală nu este disponibilă în acest browser.');return}try{window.speechSynthesis?.cancel()}catch{};const r=new SR();recognition.current=r;r.lang='ro-RO';r.continuous=true;r.interimResults=true;r.onstart=()=>{setListening(true);setStatus(`${person} ascultă…`)};r.onresult=(e:any)=>{let final='',interim='';for(let i=e.resultIndex;i<e.results.length;i++){const s=e.results[i][0]?.transcript||'';if(e.results[i].isFinal)final+=s+' ';else interim+=s}if(final.trim())setText(v=>(v?`${v} `:'')+final.trim());if(interim.trim())setStatus(`${person} ascultă… ${interim.trim()}`)};r.onerror=(e:any)=>{if(e.error!=='no-speech'&&e.error!=='aborted')setStatus('Nu am înțeles. Poți continua sau poți scrie cererea.')};r.onend=()=>setListening(false);r.start()}
 return <div className={`home-conversation-shell ${expanded?'expanded':'collapsed'}`}>
   {expanded&&<div className="home-dialogue" aria-live="polite">
    <button className="home-dialogue-collapse" onClick={()=>setExpanded(false)} title="Ascunde conversația"><span>Conversație cu {person}</span><ChevronDown size={17}/></button>
    <div className="home-dialogue-scroll" ref={dialogueScroll}>{conversation.length?conversation.map((m:any,i:number)=>{const owner=m.sender==='owner'||m.kind==='request';const label=owner?'Tu':(m.agent&&m.agent!=='personal_assistant'?m.agent:'Bianca');return <div className={`home-dialogue-line ${owner?'owner':'bianca'}`} key={`${m.task_id||'local'}-${m.at||i}-${i}`}><strong>{label}</strong><span>{m.body||''}</span></div>}):<div className="home-dialogue-empty">Bianca este aici. Poți începe conversația.</div>}</div>
   </div>}
   <div className="home-command" role="region" aria-label={`Spune-i ${person==='Bianca'?'Biancăi':`lui ${person}`}`}>
    <div className="home-command-head"><div className="home-command-title">{person==='Bianca'?'Spune-i Biancăi':`Spune-i lui ${person}`}</div><button className="conversation-toggle" onClick={()=>setExpanded(v=>!v)} title={expanded?'Ascunde conversația':'Arată conversația'}><MessageCircleMore size={15}/><span>{expanded?'Ascunde':'Conversație'}</span>{expanded?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button></div>
    <div className="home-command-row"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder={`Scrie sau spune ce vrei să facă ${person}…`} aria-label={`Cerere pentru ${person}`}/><button className={listening?'listening':''} onClick={toggleMic} title={listening?'Oprește microfonul':`Vorbește cu ${person}`}>{listening?<Square size={18}/>:<Mic size={20}/>}</button><button onClick={send} disabled={busy||!text.trim()} title={`Trimite către ${person}`}><Send size={20}/></button></div>
    {status&&<div className="home-command-status">{status}</div>}
   </div>
 </div>
}
