import { type FC } from 'react'
import { APP_NAME, COMING_SOON_FEATURES } from '../config/constants'
import './Sidebar.css'

interface SidebarProps {
  onNavigate: (view: string) => void
  activeView: string
}

export const Sidebar: FC<SidebarProps> = ({ onNavigate, activeView }) => {
  return (
    <aside className="cos-sidebar">
      <div className="cos-sidebar-brand" onClick={() => onNavigate('landing')}>
        <div className="cos-sidebar-logo">
          <span className="cos-logo-icon">◆</span>
        </div>
        <div className="cos-sidebar-brand-text">
          <span className="cos-brand-name">{APP_NAME}</span>
          <span className="cos-brand-version">v1.0</span>
        </div>
      </div>

      <nav className="cos-sidebar-nav">
        <div className="cos-nav-section">
          <span className="cos-nav-label">Tools</span>
          <button
            className={`cos-nav-item ${activeView === 'app' ? 'active' : ''}`}
            onClick={() => onNavigate('app')}
          >
            <span className="cos-nav-icon">📄</span>
            <span className="cos-nav-text">Resume Generator</span>
            <span className="cos-nav-badge active-badge">Active</span>
          </button>
        </div>

        <div className="cos-nav-section">
          <span className="cos-nav-label">Coming Soon</span>
          {COMING_SOON_FEATURES.map((feature) => (
            <div key={feature.name} className="cos-nav-item disabled">
              <span className="cos-nav-icon">{feature.icon}</span>
              <span className="cos-nav-text">{feature.name}</span>
              <span className="cos-nav-badge soon-badge">Soon</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="cos-sidebar-footer">
        <div className="cos-sidebar-footer-item" onClick={() => onNavigate('landing')}>
          <span className="cos-nav-icon">🏠</span>
          <span>Home</span>
        </div>
      </div>
    </aside>
  )
}
