import { type FC } from 'react'
import { motion } from 'framer-motion'
import { APP_NAME, COMING_SOON_FEATURES } from '../config/constants'
import './LandingPage.css'

interface LandingPageProps {
  onLaunch: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
}

const features = [
  {
    icon: '📤',
    title: 'Resume Parsing',
    desc: 'Upload an existing PDF and auto-extract your experience, skills, education, and projects.'
  },
  {
    icon: '🎯',
    title: 'Smart Skill Recommendations',
    desc: 'Enter your target role and receive curated skill suggestions with one-click insertion.'
  },
  {
    icon: '✨',
    title: 'AI Enhancement',
    desc: 'Transform rough notes into polished ATS-ready bullets using action verbs and the XYZ formula.'
  },
  {
    icon: '📝',
    title: 'Project Description Generator',
    desc: 'Provide a project name and technologies — get a professional description instantly.'
  },
  {
    icon: '🔍',
    title: 'ATS Optimization',
    desc: 'Compare your resume against a job description and get keyword alignment analysis.'
  },
  {
    icon: '📄',
    title: 'PDF Export',
    desc: 'Generate text-based, searchable, ATS-compatible PDFs with professional formatting.'
  }
]

export const LandingPage: FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="lp-root">
      <div className="lp-noise-overlay" />

      {/* Ambient Background */}
      <div className="lp-ambient">
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />
      </div>

      {/* Nav */}
      <motion.header
        className="lp-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <span className="lp-nav-logo">◆</span>
            <span className="lp-nav-brand-text">{APP_NAME}</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#roadmap" className="lp-nav-link">Roadmap</a>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="lp-nav-cta"
            onClick={onLaunch}
          >
            Launch App
          </motion.button>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="lp-hero-badge">
              <span className="lp-badge-dot" /> AI-Powered Career Intelligence
            </motion.div>

            <motion.h1 variants={fadeUp} className="lp-hero-title">
              Build Better Resumes.<br />Land Better Opportunities.
            </motion.h1>

            <motion.p variants={fadeUp} className="lp-hero-subtitle">
              CareerOS transforms your rough career notes into polished, ATS-optimized resumes with AI-powered enhancement, smart skill recommendations, and professional PDF export.
            </motion.p>

            <motion.div variants={fadeUp} className="lp-hero-actions">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="lp-btn primary"
                onClick={onLaunch}
              >
                Start Building Your Resume
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#features"
                className="lp-btn secondary"
              >
                Explore Features
              </motion.a>
            </motion.div>

            <motion.div variants={fadeUp} className="lp-hero-stats">
              <div className="lp-stat">
                <span className="lp-stat-value">6</span>
                <span className="lp-stat-label">AI Features</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-value">ATS</span>
                <span className="lp-stat-label">Optimized</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-value">PDF</span>
                <span className="lp-stat-label">Export</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="lp-section">
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="lp-eyebrow">Core Features</span>
            <h2 className="lp-section-title">Everything You Need to Stand Out</h2>
            <p className="lp-section-desc">
              From resume parsing to ATS optimization — CareerOS handles every step of crafting a winning resume.
            </p>
          </motion.div>

          <motion.div
            className="lp-features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="lp-eyebrow">Workflow</span>
            <h2 className="lp-section-title">From Rough Notes to Perfect Resume</h2>
          </motion.div>

          <motion.div
            className="lp-steps"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {[
              { step: '01', title: 'Input Your Data', desc: 'Upload an existing resume or manually enter your experience, skills, and projects.' },
              { step: '02', title: 'AI Enhancement', desc: 'Let AI transform your rough notes into powerful, ATS-optimized professional content.' },
              { step: '03', title: 'Live Preview', desc: 'See your resume update in real time as you make changes. Perfect formatting guaranteed.' },
              { step: '04', title: 'Export PDF', desc: 'Download a text-based, searchable PDF ready to submit to any ATS or recruiter.' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="lp-step-card">
                <div className="lp-step-number">{item.step}</div>
                <h4 className="lp-step-title">{item.title}</h4>
                <p className="lp-step-desc">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="lp-section">
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="lp-eyebrow">Roadmap</span>
            <h2 className="lp-section-title">What's Coming Next</h2>
            <p className="lp-section-desc">
              CareerOS is growing into a complete career intelligence platform.
            </p>
          </motion.div>

          <motion.div
            className="lp-roadmap-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {COMING_SOON_FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="lp-roadmap-card">
                <div className="lp-roadmap-icon">{f.icon}</div>
                <div className="lp-roadmap-info">
                  <h4>{f.name}</h4>
                  <p>{f.description}</p>
                </div>
                <span className="lp-roadmap-badge">Coming Soon</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-section-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lp-cta-content"
          >
            <h2 className="lp-cta-title">Ready to Build Your Perfect Resume?</h2>
            <p className="lp-cta-desc">Join CareerOS and let AI help you land your next opportunity.</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="lp-btn primary lg"
              onClick={onLaunch}
            >
              Launch Resume Generator
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-section-inner">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <span className="lp-nav-logo">◆</span>
              <span className="lp-nav-brand-text">{APP_NAME}</span>
            </div>
            <span className="lp-footer-copy">© 2026 CareerOS. Part of the FlowForge Ecosystem.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
