import './voice-guard'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import HomeCommand from './HomeCommand'
import './styles.css'
import './extra.css'
import './visual-v2.css'
import './team-v2.css'
import './pages-v2.css'
import './office-final.css'
import './voice-mode.css'
import './home-command.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const commandRoot=document.createElement('div')
commandRoot.id='bianca-home-command-root'
document.body.appendChild(commandRoot)
ReactDOM.createRoot(commandRoot).render(<HomeCommand />)
