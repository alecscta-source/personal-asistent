import {useEffect,useMemo,useState} from 'react'
import {createPortal} from 'react-dom'

const tz='Europe/Bucharest'
const nowParts=()=>{
 const d=new Date()
 const year=Number(new Intl.DateTimeFormat('en',{timeZone:tz,year:'numeric'}).format(d))
 const month=Number(new Intl.DateTimeFormat('en',{timeZone:tz,month:'numeric'}).format(d))
 const day=Number(new Intl.DateTimeFormat('en',{timeZone:tz,day:'numeric'}).format(d))
 const weekday=new Intl.DateTimeFormat('ro-RO',{timeZone:tz,weekday:'long'}).format(d)
 const monthName=new Intl.DateTimeFormat('ro-RO',{timeZone:tz,month:'long'}).format(d)
 return{year,month,day,weekday,monthName}
}

export default function DeskDay(){
 const[target,setTarget]=useState<Element|null>(null)
 const[tick,setTick]=useState(0)
 const current=useMemo(()=>nowParts(),[tick])
 useEffect(()=>{const sync=()=>setTarget((location.hash||'#home')==='#home'?document.querySelector('.lux-office'):null);const observer=new MutationObserver(sync);observer.observe(document.body,{subtree:true,childList:true});addEventListener('hashchange',sync);addEventListener('popstate',sync);sync();const timer=setInterval(()=>setTick(x=>x+1),60_000);return()=>{observer.disconnect();removeEventListener('hashchange',sync);removeEventListener('popstate',sync);clearInterval(timer)}},[])
 if(!target)return null
 const first=(new Date(current.year,current.month-1,1).getDay()+6)%7
 const days=new Date(current.year,current.month,0).getDate()
 const cells=Array.from({length:42},(_,i)=>{const n=i-first+1;return n>=1&&n<=days?n:null})
 return createPortal(<div className="desk-live-calendar" aria-label={`${current.weekday}, ${current.day} ${current.monthName} ${current.year}`}>
   <div className="desk-live-month">{current.monthName} <span>{current.year}</span></div>
   <div className="desk-live-weekday">{current.weekday}</div>
   <div className="desk-live-day">{String(current.day).padStart(2,'0')}</div>
   <div className="desk-live-grid-head"><span>L</span><span>Ma</span><span>Mi</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
   <div className="desk-live-grid">{cells.map((n,i)=><span key={i} className={n===current.day?'today':''}>{n||''}</span>)}</div>
 </div>,target)
}
