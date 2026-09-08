import {useEffect,useMemo,useState} from 'react'
import {getOrthodoxDay,type OrthodoxDay} from './lib/data'

const bucharestDate=()=>{
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  const get=(t:string)=>parts.find(p=>p.type===t)?.value||''
  return `${get('year')}-${get('month')}-${get('day')}`
}

const dateParts=()=>{
  const d=new Date()
  return {
    day:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',day:'2-digit'}).format(d),
    month:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',month:'long'}).format(d),
    weekday:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',weekday:'long'}).format(d),
    year:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',year:'numeric'}).format(d),
  }
}

export default function DeskCalendar(){
  const[visible,setVisible]=useState((location.hash||'#home')==='#home')
  const[tick,setTick]=useState(0)
  const[orthodox,setOrthodox]=useState<OrthodoxDay|null>(null)
  const[orthodoxError,setOrthodoxError]=useState(false)
  const current=useMemo(()=>dateParts(),[tick])
  const iso=useMemo(()=>bucharestDate(),[tick])

  useEffect(()=>{
    const sync=()=>setVisible((location.hash||'#home')==='#home')
    addEventListener('hashchange',sync);addEventListener('popstate',sync)
    return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync)}
  },[])

  useEffect(()=>{
    let active=true
    const load=async()=>{try{const x=await getOrthodoxDay(iso);if(active){setOrthodox(x);setOrthodoxError(false)}}catch{if(active){setOrthodox(null);setOrthodoxError(true)}}}
    void load()
    const timer=setInterval(()=>setTick(x=>x+1),60_000)
    return()=>{active=false;clearInterval(timer)}
  },[iso])

  if(!visible)return null
  return <div className="desk-date-calendar" aria-label={`Astăzi este ${current.weekday}, ${current.day} ${current.month} ${current.year}`}>
    <div className="desk-date-weekday">{current.weekday}</div>
    <div className="desk-date-day">{current.day}</div>
    <div className="desk-date-month">{current.month} {current.year}</div>
    <div className="desk-date-feast">{orthodox?.feast||(!orthodoxError?'Calendar ortodox se încarcă…':'Calendar ortodox indisponibil')}</div>
  </div>
}
