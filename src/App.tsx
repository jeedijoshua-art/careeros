import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { LandingPage } from './components/LandingPage'
import { ResumeForm } from './components/forms/ResumeForm'
import { ResumePreview } from './components/preview/ResumePreview'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<'landing' | 'app'>('landing')

  return (
    <div className="cos-app-container">
      {activeView === 'landing' ? (
        <LandingPage onLaunch={() => setActiveView('app')} />
      ) : (
        <>
          <Sidebar onNavigate={(view) => setActiveView(view as 'landing' | 'app')} activeView={activeView} />
          <main className="cos-main-content">
            <div className="cos-app-layout">
              <div className="cos-pane-left">
                <ResumeForm />
              </div>
              <div className="cos-pane-right">
                <ResumePreview />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

export default App
