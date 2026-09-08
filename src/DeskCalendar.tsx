import {useEffect,useMemo,useState} from 'react'

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
  const current=useMemo(()=>dateParts(),[tick])

  useEffect(()=>{
    const sync=()=>setVisible((location.hash||'#home')==='#home')
    addEventListener('hashchange',sync);addEventListener('popstate',sync)
    const timer=setInterval(()=>setTick(x=>x+1),60_000)
    return()=>{removeEventListener('hashchange',sync);removeEventListener('popstate',sync);clearInterval(timer)}
  },[])

  if(!visible)return null
  return <div className="desk-date-calendar" aria-label={`Astăzi este ${current.weekday}, ${current.day} ${current.month} ${current.year}`}>
    <div className="desk-date-weekday">{current.weekday}</div>
    <div className="desk-date-day">{current.day}</div>
    <div className="desk-date-month">{current.month}</div>
    <div className="desk-date-year">{current.year}</div>
  </div>
}
