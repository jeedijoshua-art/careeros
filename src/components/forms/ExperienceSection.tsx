import { type FC, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { createExperience } from '../../types/resume'

export const ExperienceSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAdd = () => {
    updateField('experience', [...state.resumeData.experience, createExperience()])
  }

  const handleRemove = (id: string) => {
    updateField(
      'experience',
      state.resumeData.experience.filter(exp => exp.id !== id)
    )
  }

  const handleChange = (id: string, field: string, value: any) => {
    updateField(
      'experience',
      state.resumeData.experience.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    )
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">💼</span>
          <h3>Work Experience</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          {state.resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="cos-form-item-card">
              <div className="cos-item-header">
                <h4>Experience #{index + 1}</h4>
                <button 
                  className="cos-btn-icon danger" 
                  onClick={() => handleRemove(exp.id)}
                  title="Remove Experience"
                >
                  ✕
                </button>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                    placeholder="Acme Corp"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleChange(exp.id, 'role', e.target.value)}
                    placeholder="Software Engineer"
                    className="cos-input"
                  />
                </div>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                    placeholder="Present"
                    className="cos-input"
                    disabled={exp.current}
                  />
                </div>
              </div>
              
              <div className="cos-form-group checkbox-group">
                <label className="cos-checkbox-label">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
                  />
                  I currently work here
                </label>
              </div>
              
              <div className="cos-form-group">
                <label>Work Notes</label>
                <p className="cos-input-hint">Write rough notes. Gemini will transform them into professional ATS-ready resume bullets.</p>
                <textarea
                  value={exp.notes}
                  onChange={(e) => handleChange(exp.id, 'notes', e.target.value)}
                  placeholder={`Built dashboard.
Managed team.
Created APIs.
Fixed bugs.
Improved performance.`}
                  className="cos-textarea"
                  rows={5}
                />
              </div>
            </div>
          ))}
          
          <button className="cos-add-btn" onClick={handleAdd}>
            + Add Experience
          </button>
        </div>
      )}
    </div>
  )
}
