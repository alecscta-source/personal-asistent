import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './extra.css'
import officeImage from './office-image'

const officeStyle=document.createElement('style')
officeStyle.textContent=`
/* Canonical Bianca office: the photograph is the interface, not a decorative dashboard background. */
.lux-office{position:relative!important;overflow:hidden!important;background:#17130f!important;min-height:clamp(620px,68vw,820px)!important}
.office-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:0;display:block;filter:none!important}
.lux-office:before{content:''!important;display:block!important;position:absolute!important;inset:0!important;z-index:1!important;background:linear-gradient(90deg,rgba(5,8,12,.24),rgba(5,8,12,.02) 52%,rgba(5,8,12,.18))!important;pointer-events:none!important}
.office-overlay{position:absolute!important;inset:0!important;z-index:2!important;background:linear-gradient(180deg,rgba(4,7,11,.02),rgba(4,7,11,.03) 60%,rgba(4,7,11,.30))!important;pointer-events:none}
.bianca-hotspot{left:32%!important;bottom:18%!important;width:30%!important;height:64%!important;background:transparent!important;border:0!important;border-radius:42%!important;filter:none!important;z-index:4!important}
.bianca-hotspot span,.bianca-hotspot small{opacity:0!important;pointer-events:none!important}
.desk-tools{z-index:6!important;bottom:2.5%!important;left:22%!important;right:23%!important;gap:8px!important}
.desk-tools button{background:rgba(9,12,17,.76)!important;color:#f7efe5!important;backdrop-filter:blur(10px);border-color:rgba(231,185,133,.35)!important;box-shadow:0 10px 24px rgba(0,0,0,.28)}
.notice-stack{z-index:7!important;top:4%!important;right:2.5%!important;width:min(300px,27%)!important;gap:9px!important}
.notice-balloon,.lux-office .mail-notice{background:rgba(12,15,18,.88)!important;color:#f7f0e8!important;border-color:rgba(231,185,133,.30)!important;backdrop-filter:blur(11px);box-shadow:0 12px 30px rgba(0,0,0,.32)!important}
/* Home already IS Bianca. Do not duplicate Bianca as a second navigation destination. */
.sidebar nav .nav-item:nth-child(2),.mobile-nav button:nth-child(2){display:none!important}
@media(max-width:900px){.lux-office{min-height:680px!important}.office-photo{object-position:48% center}.bianca-hotspot{left:19%!important;bottom:24%!important;width:45%!important;height:53%!important}.notice-stack{width:min(78vw,300px)!important;right:2%!important;top:2%!important}.desk-tools{left:3%!important;right:3%!important;bottom:2%!important}}
`
document.head.appendChild(officeStyle)

const mountOfficePhoto=()=>{
  document.querySelectorAll<HTMLElement>('.lux-office').forEach(office=>{
    if(office.querySelector('.office-photo'))return
    const img=document.createElement('img')
    img.className='office-photo'
    img.src=officeImage
    img.alt='Biroul Biancăi'
    img.setAttribute('aria-hidden','true')
    office.prepend(img)
  })
}
const officeObserver=new MutationObserver(mountOfficePhoto)
officeObserver.observe(document.documentElement,{childList:true,subtree:true})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
queueMicrotask(mountOfficePhoto)
