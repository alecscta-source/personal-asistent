import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'
import {CalendarDays,ExternalLink,Mic,Send,Square} from 'lucide-react'
import {getBiancaConversationFeed,getOrthodoxDay,submitMessage,type OrthodoxDay} from './lib/data'

const agentMap:Record<string,string>={Bianca:'personal_assistant',Ana:'secretara',Dorin:'inginer',Vlad:'vlad_instalatii',Sorin:'sorin_tratare','Cătălin':'catalin_sauna_hammam',Catalin:'catalin_sauna_hammam',Radu:'radu_constructii',Elena:'elena_normative',Irina:'economist',Ioana:'contabil',Diana:'marketing'}
const personFromPage=()=>{if((location.hash||'#home')==='#home')return'Bianca';const label=document.querySelector('.chat-head strong')?.textContent?.trim()||'Bianca';return label.split(' — ')[0]||'Bianca'}
const bucharestDateLabel=()=>new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date())

export default function HomeCommand(){
 const initialHash=location.hash||'#home'
 const [hash,setHash]=useState(initialHash)
 const [visible,setVisible]=useState(initialHash==='#home'||initialHash==='#chat')
 const [person,setPerson]=useState(personFromPage())
 const [text,setText]=useState('')
 const [busy,setBusy]=useState(false)
 const [listening,setListening]=useState(false)
 const [status,setStatus]=useState('')
 const [bridgeReply,setBridgeReply]=useState<any|null>(null)
 const [messagesTarget,setMessagesTarget]=useState<Element|null>(null)
 const [calendarTarget,setCalendarTarget]=useState<Element|null>(null)
 const [orthodox,setOrthodox]=useState<OrthodoxDay|null>(null)
 const [calendarError,setCalendarError]=useState('')
 const recognition=useRef<any>(null)

 useEffect(()=>{const sync=()=>{const h=location.hash||'#home';setHash(h);setVisible(h==='#home'||h==='#chat');setTimeout(()=>{setPerson(personFromPage());setMessagesTarget(h==='#chat'?document.querySelector('.messages'):null);setCalendarTarget(h==='#calendar'?document.querySelector('.main-panel > section.panel'):null)},40)};const observer=new MutationObserver(()=>{setPerson(personFromPage());const h=location.hash||'#home';if(h==='#chat')setMessagesTarget(document.querySelector('.messages'));if(h==='#calendar')setCalendarTarget(document.querySelector('.main-panel > section.panel'))});observer.observe(document.body,{subtree:true,childList:true,characterData:true});addEventListener('hashchange',sync);addEventListener('popstate',sync);sync();return()=>{observer.disconnect();removeEventListener('hashchange',sync);removeEventListener('popstate',sync);try{recognition.current?.abort()}catch{}}},[])

 useEffect(()=>{if(hash!=='#chat'){setBridgeReply(null);return}let dead=false;const load=async()=>{try{const feed=await getBiancaConversationFeed(100);if(dead||!feed.length)return;const owner=[...feed].reverse().find((x:any)=>x.sender==='owner'||x.kind==='request');if(!owner){setBridgeReply(null);return}const replies=feed.filter((x:any)=>x.task_id===owner.task_id&&(x.sender==='agent'||x.kind==='result'));const reply=replies.length?replies[replies.length-1]:null;if(!reply){setBridgeReply(null);return}const body=String(reply.body||'').trim();const native=[...document.querySelectorAll('.messages .message')].some(el=>(el.textContent||'').includes(body.slice(0,Math.min(80,body.length))));setBridgeReply(native?null:{...reply,body})}catch{}};void load();const t=setInterval(load,2000);return()=>{dead=true;clearInterval(t)}},[hash,person])

 useEffect(()=>{if(hash!=='#calendar')return;let dead=false;const load=async()=>{try{setCalendarError('');const d=await getOrthodoxDay();if(!dead)setOrthodox(d)}catch(e:any){if(!dead)setCalendarError(e?.message||'Calendarul ortodox nu a putut fi încărcat.')}};void load();const t=setInterval(load,30*60*1000);return()=>{dead=true;clearInterval(t)}},[hash])

 const agent=agentMap[person]||'personal_assistant'
 const send=async()=>{const message=text.trim();if(!message||busy)return;setBusy(true);setStatus('');try{await submitMessage(message,agent);setText('');setStatus(`${person} a primit cererea. Aștept răspunsul final…`)}catch(e:any){setStatus(`Nu am putut trimite: ${e?.message||'eroare'}`)}finally{setBusy(false)}}
 const toggleMic=()=>{
  if(listening){try{recognition.current?.stop()}catch{};setListening(false);return}
  const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
  if(!SR){setStatus('Recunoașterea vocală nu este disponibilă în acest browser.');return}
  try{window.speechSynthesis?.cancel()}catch{}
  const r=new SR();recognition.current=r;r.lang='ro-RO';r.continuous=true;r.interimResults=true
  r.onstart=()=>{setListening(true);setStatus(`${person} ascultă…`)}
  r.onresult=(e:any)=>{let final='',interim='';for(let i=e.resultIndex;i<e.results.length;i++){const s=e.results[i][0]?.transcript||'';if(e.results[i].isFinal)final+=s+' ';else interim+=s}if(final.trim())setText(v=>(v?`${v} `:'')+final.trim());if(interim.trim())setStatus(`${person} ascultă… ${interim.trim()}`)}
  r.onerror=(e:any)=>{if(e.error!=='no-speech'&&e.error!=='aborted')setStatus('Nu am înțeles. Poți continua sau poți scrie cererea.')}
  r.onend=()=>setListening(false)
  r.start()
 }

 const command=visible?<div className="home-command" role="region" aria-label={`Spune-i ${person==='Bianca'?'Biancăi':`lui ${person}`}`}>
   <div className="home-command-title">{person==='Bianca'?'Spune-i Biancăi':`Spune-i lui ${person}`}</div>
   <div className="home-command-row">
    <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder={`Scrie sau spune ce vrei să facă ${person}…`} aria-label={`Cerere pentru ${person}`}/>
    <button className={listening?'listening':''} onClick={toggleMic} title={listening?'Oprește microfonul':`Vorbește cu ${person}`}>{listening?<Square size={18}/>:<Mic size={20}/>}</button>
    <button onClick={send} disabled={busy||!text.trim()} title={`Trimite către ${person}`}><Send size={20}/></button>
   </div>
   {status&&<div className="home-command-status">{status}</div>}
  </div>:null

 const replyPortal=hash==='#chat'&&messagesTarget&&bridgeReply?createPortal(<div className="message bianca agent-result bridge-reply" data-task-id={bridgeReply.task_id}><div>{bridgeReply.body}</div>{bridgeReply.at&&<small>{new Date(bridgeReply.at).toLocaleString('ro-RO',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})} · răspuns Bianca</small>}</div>,messagesTarget):null

 const calendarPortal=hash==='#calendar'&&calendarTarget?createPortal(<div className="calendar-today-card">
   <div className="calendar-today-icon"><CalendarDays size={26}/></div>
   <div className="calendar-today-main"><span className="calendar-today-label">ASTĂZI · ORA ROMÂNIEI</span><strong>{bucharestDateLabel()}</strong><p>{orthodox?.feast||calendarError||'Se încarcă sărbătoarea ortodoxă a zilei…'}</p>{orthodox?.detail&&orthodox.detail!==orthodox.feast&&<small>{orthodox.detail}</small>}<div className="calendar-source-links">{orthodox?.source_url&&<a href={orthodox.source_url} target="_blank" rel="noreferrer">Detalii Basilica.ro <ExternalLink size={13}/></a>}<a href={orthodox?.official_calendar_url||'https://calendar.patriarhia.ro/'} target="_blank" rel="noreferrer">Calendar oficial Patriarhia Română <ExternalLink size={13}/></a></div></div>
 </div>,calendarTarget):null

 return <>{command}{replyPortal}{calendarPortal}</>
}
