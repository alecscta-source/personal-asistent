import {useEffect,useRef,useState} from 'react'
import {Mic,Send,Square} from 'lucide-react'
import {submitMessage} from './lib/data'

export default function HomeCommand(){
 const [home,setHome]=useState(location.hash===''||location.hash==='#home')
 const [text,setText]=useState('')
 const [busy,setBusy]=useState(false)
 const [listening,setListening]=useState(false)
 const [status,setStatus]=useState('')
 const recognition=useRef<any>(null)
 useEffect(()=>{const sync=()=>setHome(location.hash===''||location.hash==='#home');addEventListener('hashchange',sync);addEventListener('popstate',sync);return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);try{recognition.current?.abort()}catch{}}},[])
 if(!home)return null
 const send=async()=>{const message=text.trim();if(!message||busy)return;setBusy(true);setStatus('');try{await submitMessage(message,'personal_assistant');setText('');setStatus('Bianca a primit cererea.')}catch(e:any){setStatus(`Nu am putut trimite: ${e?.message||'eroare'}`)}finally{setBusy(false)}}
 const toggleMic=()=>{
  if(listening){try{recognition.current?.stop()}catch{};setListening(false);return}
  const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
  if(!SR){setStatus('Recunoașterea vocală nu este disponibilă în acest browser.');return}
  try{window.speechSynthesis?.cancel()}catch{}
  const r=new SR();recognition.current=r;r.lang='ro-RO';r.continuous=true;r.interimResults=true
  r.onstart=()=>{setListening(true);setStatus('Bianca ascultă…')}
  r.onresult=(e:any)=>{let final='',interim='';for(let i=e.resultIndex;i<e.results.length;i++){const s=e.results[i][0]?.transcript||'';if(e.results[i].isFinal)final+=s+' ';else interim+=s}if(final.trim())setText(v=>(v?`${v} `:'')+final.trim());if(interim.trim())setStatus(`Bianca ascultă… ${interim.trim()}`)}
  r.onerror=(e:any)=>{if(e.error!=='no-speech'&&e.error!=='aborted')setStatus('Nu am înțeles. Poți continua sau poți scrie cererea.')}
  r.onend=()=>setListening(false)
  r.start()
 }
 return <div className="home-command" role="region" aria-label="Spune-i Biancăi">
   <div className="home-command-title">Spune-i Biancăi</div>
   <div className="home-command-row">
    <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Scrie sau spune ce vrei să facă Bianca…" aria-label="Cerere pentru Bianca"/>
    <button className={listening?'listening':''} onClick={toggleMic} title={listening?'Oprește microfonul':'Vorbește cu Bianca'}>{listening?<Square size={18}/>:<Mic size={20}/>}</button>
    <button onClick={send} disabled={busy||!text.trim()} title="Trimite către Bianca"><Send size={20}/></button>
   </div>
   {status&&<div className="home-command-status">{status}</div>}
  </div>
}
