import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './extra.css'
import officeImage from './office-image'

const officeStyle=document.createElement('style')
officeStyle.textContent=`
/* Canonical Bianca office: the photograph is the interface. */
:root{background:#080807!important}
body,.app-shell,.main-panel{background:#080807!important}
.sidebar{background:linear-gradient(180deg,#0b0a09,#12100e)!important;border-right:1px solid rgba(218,177,119,.16)!important;box-shadow:10px 0 40px rgba(0,0,0,.22)!important}
.brand strong{color:#fff7ec!important}.brand span,.sidebar-footer{color:#aa9a88!important}.nav-item{color:#a99a89!important}.nav-item:hover,.nav-item.active{color:#fff8ee!important;background:rgba(219,177,119,.12)!important}.nav-item.active{box-shadow:inset 3px 0 #d6a564!important}
.topbar{margin-bottom:14px!important}.eyebrow{color:#9e8163!important}.topbar h1{color:#f5eadc!important}.owner-chip,.voice-toggle{border-color:rgba(217,179,132,.24)!important;background:rgba(255,246,232,.06)!important;color:#d7c6b2!important}
.office-v2{margin-top:0!important}
.lux-office{position:relative!important;overflow:hidden!important;background:#17130f!important;min-height:clamp(650px,69vw,840px)!important;border-radius:24px!important;border:1px solid rgba(224,183,126,.22)!important;box-shadow:0 30px 90px rgba(0,0,0,.58)!important}
.office-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;z-index:0!important;display:block!important;filter:none!important;transform:none!important}
.lux-office:before{content:''!important;display:block!important;position:absolute!important;inset:0!important;z-index:1!important;background:linear-gradient(90deg,rgba(3,5,8,.25),rgba(3,5,8,.025) 48%,rgba(3,5,8,.16)),linear-gradient(180deg,rgba(0,0,0,.02) 55%,rgba(0,0,0,.34))!important;pointer-events:none!important}
.office-overlay{position:absolute!important;inset:0!important;z-index:2!important;background:radial-gradient(ellipse at 47% 54%,transparent 0 35%,rgba(4,5,6,.03) 62%,rgba(4,5,6,.18) 100%)!important;pointer-events:none!important}
.bianca-hotspot{left:32%!important;bottom:18%!important;width:30%!important;height:64%!important;background:transparent!important;border:0!important;border-radius:42%!important;filter:none!important;box-shadow:none!important;z-index:5!important}
.bianca-hotspot:hover{background:radial-gradient(ellipse at center,rgba(236,190,128,.055),transparent 68%)!important;box-shadow:none!important}
.bianca-hotspot span,.bianca-hotspot small{opacity:0!important;pointer-events:none!important}
/* Desk objects: Agenda and Calendar are physical-looking controls on the desk. */
.desk-tools{position:absolute!important;inset:0!important;left:0!important;right:0!important;bottom:0!important;display:block!important;transform:none!important;width:auto!important;padding:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;z-index:6!important;pointer-events:none!important}
.desk-tools button{pointer-events:auto!important;position:absolute!important;margin:0!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease!important}
.desk-tools button:nth-child(1){left:18.5%!important;bottom:4.5%!important;width:122px!important;height:88px!important;border-radius:8px 11px 11px 8px!important;border:1px solid rgba(229,187,126,.42)!important;background:linear-gradient(90deg,#201813 0 8px,#51351f 9px 11px,#241a13 12px 100%)!important;color:#e7c18c!important;box-shadow:0 15px 26px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,220,170,.05)!important;transform:rotate(-5deg)!important;flex-direction:column!important}
.desk-tools button:nth-child(1):before{content:'';position:absolute;right:7px;top:7px;bottom:7px;width:2px;background:rgba(217,172,108,.35);box-shadow:3px 0 rgba(255,255,255,.04)}
.desk-tools button:nth-child(1) svg{width:21px!important;height:21px!important;opacity:.8!important}.desk-tools button:nth-child(1) span{font-family:Georgia,serif!important;font-size:.78rem!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#e6c18b!important}
.desk-tools button:nth-child(1):hover{transform:rotate(-5deg) translateY(-5px)!important;box-shadow:0 20px 34px rgba(0,0,0,.55),0 0 0 1px rgba(224,180,116,.15)!important}
.desk-tools button:nth-child(2){left:61%!important;bottom:4%!important;width:128px!important;height:96px!important;border-radius:9px 9px 5px 5px!important;border:1px solid rgba(211,179,139,.62)!important;background:linear-gradient(180deg,#30261d 0 19px,#f3eadc 20px 100%)!important;color:#4b3829!important;box-shadow:0 14px 26px rgba(0,0,0,.42)!important;flex-direction:column!important;padding-top:22px!important}
.desk-tools button:nth-child(2):before{content:'••••••';position:absolute;top:1px;left:0;right:0;text-align:center;letter-spacing:6px;color:#d2ab78;font-size:13px;line-height:18px}
.desk-tools button:nth-child(2):after{content:'AZI';font-size:.50rem;letter-spacing:.16em;color:#9b6e3f;position:absolute;bottom:8px}
.desk-tools button:nth-child(2) svg{width:22px!important;height:22px!important}.desk-tools button:nth-child(2) span{font-family:Georgia,serif!important;font-size:.76rem!important;color:#4c3828!important;margin-bottom:10px!important}
.desk-tools button:nth-child(2):hover{transform:translateY(-5px)!important;box-shadow:0 20px 34px rgba(0,0,0,.52)!important}
/* Secondary desk shortcuts stay small and subordinate to Bianca. */
.desk-tools button:nth-child(n+3){bottom:3.2%!important;width:46px!important;height:46px!important;border-radius:14px!important;border:1px solid rgba(230,190,137,.32)!important;background:rgba(12,13,14,.78)!important;color:#f2ddc1!important;backdrop-filter:blur(9px)!important;box-shadow:0 10px 24px rgba(0,0,0,.34)!important;flex-direction:column!important;padding:5px!important}
.desk-tools button:nth-child(3){left:38%!important}.desk-tools button:nth-child(4){left:43.5%!important}.desk-tools button:nth-child(5){left:49%!important}.desk-tools button:nth-child(6){left:54.5%!important}
.desk-tools button:nth-child(n+3) svg{width:16px!important;height:16px!important}.desk-tools button:nth-child(n+3) span{font-size:.50rem!important;line-height:1!important;color:#e7d4bd!important}.desk-tools button:nth-child(n+3):hover{transform:translateY(-4px)!important;background:rgba(35,28,21,.9)!important;border-color:rgba(231,186,124,.52)!important}
/* Maximum three compact notifications on the free right side. */
.notice-stack,.lux-office .mail-notice-stack{z-index:7!important;top:3.5%!important;right:2.4%!important;width:min(318px,29%)!important;gap:9px!important}
.mail-swipe-shell{border-radius:15px!important}.lux-office .mail-notice{min-height:46px!important;padding:11px 12px!important;border-radius:15px!important;background:rgba(246,239,228,.94)!important;color:#33271f!important;border:1px solid rgba(224,190,149,.72)!important;box-shadow:0 12px 28px rgba(0,0,0,.30)!important;backdrop-filter:blur(11px)!important}.mail-one-line svg{color:#9b6a3d!important}.mail-one-line strong{font-size:.70rem!important;font-weight:760!important}.mail-notice.toward-read{box-shadow:-6px 0 0 #4d9276,0 12px 28px rgba(0,0,0,.30)!important}.mail-notice.toward-snooze{box-shadow:6px 0 0 #c18c45,0 12px 28px rgba(0,0,0,.30)!important}
.mail-snooze-menu{background:#f6efe5!important;border-color:#d8bea1!important}.mail-snooze-menu button{background:#eadbca!important;color:#4e3b2d!important;border-color:#d4b797!important}
/* Home is Bianca; no duplicate Bianca destination in navigation. */
.sidebar nav .nav-item:nth-child(2),.mobile-nav button:nth-child(2){display:none!important}
@media(max-width:1100px){.notice-stack,.lux-office .mail-notice-stack{width:min(300px,34%)!important}.desk-tools button:nth-child(1){left:16%!important}.desk-tools button:nth-child(2){left:63%!important}.desk-tools button:nth-child(3){left:36%!important}.desk-tools button:nth-child(4){left:42%!important}.desk-tools button:nth-child(5){left:48%!important}.desk-tools button:nth-child(6){left:54%!important}}
@media(max-width:900px){.main-panel{padding:12px 10px 86px!important}.topbar{margin-bottom:10px!important}.topbar h1{font-size:1.35rem!important}.lux-office{min-height:700px!important;border-radius:18px!important}.office-photo{object-position:48% center!important}.bianca-hotspot{left:19%!important;bottom:24%!important;width:45%!important;height:53%!important}.notice-stack,.lux-office .mail-notice-stack{width:min(76vw,285px)!important;right:2%!important;top:2%!important}.desk-tools button:nth-child(1){left:4%!important;bottom:9%!important;width:90px!important;height:68px!important}.desk-tools button:nth-child(2){left:auto!important;right:4%!important;bottom:9%!important;width:92px!important;height:72px!important}.desk-tools button:nth-child(n+3){bottom:1.5%!important;width:42px!important;height:42px!important}.desk-tools button:nth-child(3){left:29%!important}.desk-tools button:nth-child(4){left:41%!important}.desk-tools button:nth-child(5){left:53%!important}.desk-tools button:nth-child(6){left:65%!important}.desk-tools button:nth-child(n+3) span{display:none!important}.desk-tools button:nth-child(1) span,.desk-tools button:nth-child(2) span{font-size:.64rem!important}}
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
