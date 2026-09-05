import {useEffect,useRef,useState} from 'react'
import {Mic,Send,Square} from 'lucide-react'
import {submitMessage} from './lib/data'

const agentMap:Record<string,string>={Bianca:'personal_assistant',Ana:'secretara',Dorin:'inginer',Vlad:'vlad_instalatii',Sorin:'sorin_tratare','Cătălin':'catalin_sauna_hammam',Catalin:'catalin_sauna_hammam',Radu:'radu_constructii',Elena:'elena_normative',Irina:'economist',Ioana:'contabil',Diana:'marketing'}
const personFromPage=()=>{if((location.hash||'#home')==='#home')return'Bianca';const label=document.querySelector('.chat-head strong')?.textContent?.trim()||'Bianca';return label.split(' — ')[0]||'Bianca'}

export default function HomeCommand(){
 const [visible,setVisible]=useState((location.hash||'#home')==='#home'||location.hash==='#chat')
 const [person,setPerson]=useState(personFromPage())
 const [text,setText]=useState('')
 const [busy,setBusy]=useState(false)
 const [listening,setListening]=useState(false)
 const [status,setStatus]=useState('')
 const recognition=useRef<any>(null)
 useEffect(()=>{const sync=()=>{const h=location.hash||'#home';setVisible(h==='#home'||h==='#chat');setTimeout(()=>setPerson(personFromPage()),0)};const observer=new MutationObserver(()=>setPerson(personFromPage()));observer.observe(document.body,{subtree:true,childList:true,characterData:true});addEventListener('hashchange',sync);addEventListener('popstate',sync);sync();return()=>{observer.disconnect();removeEventListener('hashchange',sync);removeEventListener('popstate',sync);try{recognition.current?.abort()}catch{}}},[])
 if(!visible)return null
 const agent=agentMap[person]||'personal_assistant'
 const send=async()=>{const message=text.trim();if(!message||busy)return;setBusy(true);setStatus('');try{await submitMessage(message,agent);setText('');setStatus(`${person} a primit cererea.`)}catch(e:any){setStatus(`Nu am putut trimite: ${e?.message||'eroare'}`)}finally{setBusy(false)}}
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
 return <div className="home-command" role="region" aria-label={`Spune-i ${person==='Bianca'?'Biancăi':`lui ${person}`}`}>
   <div className="home-command-title">{person==='Bianca'?'Spune-i Biancăi':`Spune-i lui ${person}`}</div>
   <div className="home-command-row">
    <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder={`Scrie sau spune ce vrei să facă ${person}…`} aria-label={`Cerere pentru ${person}`}/>
    <button className={listening?'listening':''} onClick={toggleMic} title={listening?'Oprește microfonul':`Vorbește cu ${person}`}>{listening?<Square size={18}/>:<Mic size={20}/>}</button>
    <button onClick={send} disabled={busy||!text.trim()} title={`Trimite către ${person}`}><Send size={20}/></button>
   </div>
   {status&&<div className="home-command-status">{status}</div>}
  </div>
}
