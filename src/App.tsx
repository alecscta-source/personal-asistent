import { useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Home,
  MessageCircleMore,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

type View = 'home' | 'chat' | 'agenda' | 'calendar' | 'cases' | 'approvals' | 'help'

type NavItem = {
  key: View
  label: string
  icon: typeof Home
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Biroul Biancăi', icon: Home },
  { key: 'chat', label: 'Bianca', icon: MessageCircleMore },
  { key: 'agenda', label: 'Agenda', icon: ClipboardList },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'help', label: 'Ajutor / Analiză', icon: FileSearch },
  { key: 'cases', label: 'Cazuri', icon: Sparkles },
  { key: 'approvals', label: 'Aprobări', icon: ShieldCheck },
]

const agenda = [
  { time: '08:30', title: 'Briefing zilnic', meta: 'Bianca · priorități, termene, follow-up' },
  { time: '10:00', title: 'Verificare ofertă tehnică', meta: 'Dorin → Elena → aprobare' },
  { time: '14:30', title: 'Follow-up client', meta: 'Ana · în așteptarea aprobării' },
]

const cases = [
  { title: 'Solicitare ofertă piscină privată', status: 'În analiză tehnică', agent: 'Dorin — Inginer-șef' },
  { title: 'Audit centru wellness', status: 'Date lipsă', agent: 'Bianca — Asistent Personal' },
  { title: 'Reverificare ofertă expirată', status: 'Așteaptă economist', agent: 'Irina — Economist' },
]

function App() {
  const [view, setView] = useState<View>('home')
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([
    { from: 'bianca', text: 'Bună. Am pregătit agenda, cazurile active și aprobările care cer decizia ta.' },
  ])

  const title = useMemo(() => navItems.find((item) => item.key === view)?.label ?? 'Bianca', [view])

  const sendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    setChat((items) => [...items, { from: 'owner', text: trimmed }, { from: 'bianca', text: 'Am preluat. În V1 acest mesaj va fi trimis către orchestratorul Bianca și transformat automat în caz/task.' }])
    setMessage('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>Bianca</strong>
            <span>Asistent Personal</span>
          </div>
        </div>

        <nav>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={view === key ? 'nav-item active' : 'nav-item'} onClick={() => setView(key)}>
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Orchestrator activ
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">PERSONAL ASSISTANT V1</p>
            <h1>{title}</h1>
          </div>
          <div className="owner-chip">Owner · control final</div>
        </header>

        {view === 'home' && <OfficeHome onOpenChat={() => setView('chat')} onNavigate={setView} />}
        {view === 'chat' && <ChatPanel chat={chat} message={message} setMessage={setMessage} sendMessage={sendMessage} />}
        {view === 'agenda' && <AgendaPanel />}
        {view === 'calendar' && <CalendarPanel />}
        {view === 'help' && <HelpPanel />}
        {view === 'cases' && <CasesPanel />}
        {view === 'approvals' && <ApprovalsPanel />}
      </main>

      <nav className="mobile-nav">
        {navItems.slice(0, 5).map(({ key, label, icon: Icon }) => (
          <button key={key} className={view === key ? 'active' : ''} onClick={() => setView(key)}>
            <Icon size={20} />
            <span>{label === 'Biroul Biancăi' ? 'Birou' : label.replace(' / Analiză', '')}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function OfficeHome({ onOpenChat, onNavigate }: { onOpenChat: () => void; onNavigate: (view: View) => void }) {
  return (
    <section className="office-layout">
      <div className="office-scene">
        <div className="window-glow" />
        <div className="wall-panel wall-panel-left" />
        <div className="wall-panel wall-panel-right" />
        <div className="bianca-stage" onClick={onOpenChat} role="button" tabIndex={0}>
          <div className="bianca-halo" />
          <div className="bianca-avatar placeholder-avatar">
            <div className="hair" />
            <div className="face" />
            <div className="body" />
          </div>
          <div className="bianca-nameplate">
            <strong>Bianca</strong>
            <span>Asistent Personal · online</span>
          </div>
        </div>
        <div className="desk">
          <div className="desk-screen">
            <span>Ce ai de făcut azi?</span>
            <strong>3 priorități · 1 aprobare</strong>
          </div>
          <button className="desk-card card-agenda" onClick={() => onNavigate('agenda')}>Agenda</button>
          <button className="desk-card card-calendar" onClick={() => onNavigate('calendar')}>Calendar</button>
          <button className="desk-card card-help" onClick={() => onNavigate('help')}>Ajutor</button>
          <button className="desk-card card-approvals" onClick={() => onNavigate('approvals')}>Aprobări</button>
        </div>
      </div>

      <div className="dashboard-column">
        <div className="hero-card">
          <span className="pill">Astăzi</span>
          <h2>Ce ai de făcut azi?</h2>
          <p>Bianca concentrează aici doar deciziile, termenele și acțiunile care chiar au nevoie de tine.</p>
          <button className="primary" onClick={onOpenChat}><MessageCircleMore size={18} /> Vorbește cu Bianca</button>
        </div>

        <div className="summary-grid">
          <SummaryCard value="3" label="Priorități" />
          <SummaryCard value="1" label="Aprobare" />
          <SummaryCard value="3" label="Cazuri active" />
          <SummaryCard value="0" label="Blocaje critice" />
        </div>

        <div className="panel compact-list">
          <div className="panel-heading"><h3>Următoarele acțiuni</h3><button onClick={() => onNavigate('agenda')}>Vezi agenda</button></div>
          {agenda.slice(0, 3).map((item) => (
            <div className="list-row" key={item.time + item.title}>
              <strong>{item.time}</strong>
              <div><span>{item.title}</span><small>{item.meta}</small></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return <div className="summary-card"><strong>{value}</strong><span>{label}</span></div>
}

function ChatPanel({ chat, message, setMessage, sendMessage }: any) {
  return (
    <section className="chat-layout panel">
      <div className="chat-head">
        <div className="mini-avatar">B</div>
        <div><strong>Bianca — Asistent Personal</strong><span>Interfața unică spre toată echipa</span></div>
      </div>
      <div className="messages">
        {chat.map((item: any, idx: number) => <div key={idx} className={`message ${item.from}`}>{item.text}</div>)}
      </div>
      <div className="composer">
        <button className="icon-button" title="Atașează"><Paperclip size={20} /></button>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Scrie, dictează sau cere Biancăi să rezolve ceva…" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} />
        <button className="send-button" onClick={sendMessage}><Send size={19} /></button>
      </div>
    </section>
  )
}

function AgendaPanel() {
  return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">FOCUS</p><h2>Agenda de azi</h2></div><span className="pill">Actualizare automată</span></div>{agenda.map((item) => <div className="timeline-row" key={item.time}><div className="time-badge">{item.time}</div><div><strong>{item.title}</strong><p>{item.meta}</p></div><CheckCircle2 size={19} /></div>)}</section>
}

function CalendarPanel() {
  const days = Array.from({ length: 35 }, (_, index) => index - 2)
  return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">CALENDAR</p><h2>Septembrie 2026</h2></div><span className="pill">Google Calendar · pregătit pentru sync</span></div><div className="calendar-grid">{['Lu','Ma','Mi','Jo','Vi','Sâ','Du'].map((d) => <div className="calendar-label" key={d}>{d}</div>)}{days.map((d, i) => <div className={`calendar-day ${d < 1 || d > 30 ? 'muted' : ''}`} key={i}>{d < 1 ? 29 + d : d > 30 ? d - 30 : d}{d === 4 && <span>Vizită șantier</span>}{d === 11 && <span>Deadline ofertă</span>}</div>)}</div></section>
}

function HelpPanel() {
  return <section className="help-grid"><div className="panel upload-panel"><div className="upload-icon"><FileSearch size={34} /></div><h2>Ajutor / Analiză multimodală</h2><p>Încarcă fotografie, PDF, schemă, ofertă, document tehnic sau captură. Bianca decide cine analizează și cere controlul Elenei când este tehnic.</p><label className="dropzone"><Paperclip size={26} /><strong>Alege fișiere</strong><span>sau trage-le aici</span><input type="file" multiple /></label></div><div className="panel"><p className="eyebrow">FLUX AUTOMAT</p><h3>Bianca coordonează</h3><div className="flow-step"><span>1</span><div><strong>Înțelege problema</strong><small>text, voce și fișiere</small></div></div><div className="flow-step"><span>2</span><div><strong>Delegă specialistului</strong><small>Dorin, Vlad, Sorin, Cătălin, Radu etc.</small></div></div><div className="flow-step"><span>3</span><div><strong>Verifică și sintetizează</strong><small>Elena pentru QA tehnic</small></div></div><div className="flow-step"><span>4</span><div><strong>Îți cere doar decizia necesară</strong><small>fără acțiuni externe neaprobate</small></div></div></div></section>
}

function CasesPanel() {
  return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">ORCHESTRARE</p><h2>Cazuri & taskuri</h2></div><span className="pill">Supabase</span></div>{cases.map((item) => <div className="case-row" key={item.title}><div><strong>{item.title}</strong><small>{item.agent}</small></div><span>{item.status}</span></div>)}</section>
}

function ApprovalsPanel() {
  return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">OWNER GATE</p><h2>Aprobări & rezultate</h2></div><span className="pill warning">1 decizie</span></div><div className="approval-card"><div><small>OFERTĂ · AB PROJECT</small><h3>Selecție sistem tratare apă — 48 m³</h3><p>Analiza tehnică a fost parcursă de Dorin și specialist, apoi verificată de Elena. Sunt necesare clarificări înainte de selecția finală.</p><div className="result-meta"><span>Dorin — Inginer-șef</span><span>Elena — Normative & Control Tehnic</span></div></div><div className="approval-actions"><button className="approve">Aprobă</button><button>Respinge</button><button>Cere modificare</button></div></div></section>
}

export default App
