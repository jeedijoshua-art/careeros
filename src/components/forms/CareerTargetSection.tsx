import { type FC, type ChangeEvent, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { EXPERIENCE_LEVELS } from '../../config/constants'

export const CareerTargetSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateField(`careerTarget.${e.target.name}`, e.target.value)
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">🎯</span>
          <h3>Career Target</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          <div className="cos-form-row">
            <div className="cos-form-group">
              <label htmlFor="targetJobTitle">Target Job Title</label>
              <input
                type="text"
                id="targetJobTitle"
                name="targetJobTitle"
                value={state.resumeData.careerTarget.targetJobTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className={`cos-input ${state.errors['careerTarget.targetJobTitle'] ? 'cos-input-error' : ''}`}
              />
              {state.errors['careerTarget.targetJobTitle'] && (
                <span className="cos-validation-error-text">
                  {state.errors['careerTarget.targetJobTitle']}
                </span>
              )}
            </div>
            <div className="cos-form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={state.resumeData.careerTarget.experienceLevel}
                onChange={handleChange}
                className="cos-input"
              >
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="cos-form-group">
            <label htmlFor="targetJobDescription">Target Job Description (Optional)</label>
            <p className="cos-input-hint">Paste the JD here for ATS optimization</p>
            <textarea
              id="targetJobDescription"
              name="targetJobDescription"
              value={state.resumeData.careerTarget.targetJobDescription}
              onChange={handleChange}
              placeholder="Paste the job description here..."
              className="cos-textarea"
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  )
}
