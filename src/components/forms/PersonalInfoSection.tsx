import { type FC, type ChangeEvent, useState } from 'react'
import { useResume } from '../../context/ResumeContext'

export const PersonalInfoSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(`personalInfo.${e.target.name}`, e.target.value)
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">👤</span>
          <h3>Personal Information</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          <div className="cos-form-row">
            <div className="cos-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={state.resumeData.personalInfo.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="cos-input"
              />
            </div>
            <div className="cos-form-group">
              <label htmlFor="headline">Professional Headline</label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={state.resumeData.personalInfo.headline}
                onChange={handleChange}
                placeholder="Software Engineer | React Specialist"
                className="cos-input"
              />
            </div>
          </div>
          
          <div className="cos-form-row">
            <div className="cos-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={state.resumeData.personalInfo.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="cos-input"
              />
            </div>
            <div className="cos-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={state.resumeData.personalInfo.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="cos-input"
              />
            </div>
          </div>
          
          <div className="cos-form-row">
            <div className="cos-form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={state.resumeData.personalInfo.location}
                onChange={handleChange}
                placeholder="New York, NY"
                className="cos-input"
              />
            </div>
            <div className="cos-form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={state.resumeData.personalInfo.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/janedoe"
                className="cos-input"
              />
            </div>
          </div>
          
          <div className="cos-form-row">
            <div className="cos-form-group">
              <label htmlFor="github">GitHub URL</label>
              <input
                type="url"
                id="github"
                name="github"
                value={state.resumeData.personalInfo.github}
                onChange={handleChange}
                placeholder="github.com/janedoe"
                className="cos-input"
              />
            </div>
            <div className="cos-form-group">
              <label htmlFor="portfolio">Portfolio URL</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={state.resumeData.personalInfo.portfolio}
                onChange={handleChange}
                placeholder="janedoe.dev"
                className="cos-input"
              />
            </div>
          </div>
          <div className="cos-form-group">
            <label htmlFor="summary">Career Highlights / About Yourself</label>
            <textarea
              id="summary"
              name="summary"
              value={state.resumeData.personalInfo.summary}
              onChange={handleChange}
              placeholder={`Frontend developer passionate about AI.
Built projects using React and TypeScript.
Interested in full-stack development.`}
              className="cos-textarea"
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  )
}
