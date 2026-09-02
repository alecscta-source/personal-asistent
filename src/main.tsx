import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './extra.css'
import officeImage from './office-image'

const officeStyle=document.createElement('style')
officeStyle.textContent=`
.lux-office{background-image:linear-gradient(90deg,rgba(5,8,12,.34),rgba(5,8,12,.08) 52%,rgba(5,8,12,.22)),url("${officeImage}")!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;min-height:clamp(620px,68vw,820px)!important}
.lux-office:before{display:none!important}
.office-overlay{background:linear-gradient(180deg,rgba(4,7,11,.05),rgba(4,7,11,.08) 58%,rgba(4,7,11,.42))!important;pointer-events:none}
.bianca-hotspot{left:27%!important;bottom:19%!important;width:31%!important;height:58%!important;background:transparent!important;border:0!important;border-radius:42%!important;filter:none!important;z-index:3}
.bianca-hotspot span,.bianca-hotspot small{opacity:0;pointer-events:none}
.desk-tools{bottom:2.5%!important;left:22%!important;right:23%!important;gap:8px!important}
.desk-tools button{background:rgba(9,12,17,.78)!important;backdrop-filter:blur(10px);border-color:rgba(231,185,133,.35)!important;box-shadow:0 10px 24px rgba(0,0,0,.28)}
.notice-stack{top:4%!important;right:2.5%!important;width:min(300px,27%)!important;gap:10px!important}
.notice-balloon{padding:14px 14px 12px!important;border-radius:17px!important;background:rgba(11,17,24,.91)!important;color:#f6f0e8!important;border-color:rgba(231,185,133,.28)!important;backdrop-filter:blur(12px);box-shadow:0 16px 34px rgba(0,0,0,.42)!important}
.notice-balloon:after{display:none!important}.notice-balloon small,.notice-balloon em{color:#b9ad9f!important}.notice-priority{background:rgba(226,166,94,.18)!important;color:#f0c390!important}
.message small{display:block;margin-top:6px;font-size:.64rem;opacity:.58}.message.agent-result{border:1px solid rgba(238,181,136,.32);box-shadow:0 8px 22px rgba(0,0,0,.18)}
@media(max-width:900px){.lux-office{min-height:680px!important;background-position:48% center!important}.bianca-hotspot{left:16%!important;bottom:23%!important;width:48%!important;height:49%!important}.notice-stack{width:47%!important;right:2%!important;top:2%!important}.desk-tools{left:3%!important;right:3%!important;bottom:2%!important}}
`
document.head.appendChild(officeStyle)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
