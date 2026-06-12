import { type FC, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { createEducation } from '../../types/resume'

export const EducationSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAdd = () => {
    updateField('education', [...state.resumeData.education, createEducation()])
  }

  const handleRemove = (id: string) => {
    updateField(
      'education',
      state.resumeData.education.filter(edu => edu.id !== id)
    )
  }

  const handleChange = (id: string, field: string, value: string) => {
    updateField(
      'education',
      state.resumeData.education.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    )
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">🎓</span>
          <h3>Education</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          {state.resumeData.education.map((edu, index) => (
            <div key={edu.id} className="cos-form-item-card">
              <div className="cos-item-header">
                <h4>Education #{index + 1}</h4>
                <button 
                  className="cos-btn-icon danger" 
                  onClick={() => handleRemove(edu.id)}
                  title="Remove Education"
                >
                  ✕
                </button>
              </div>
              
              <div className="cos-form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                  placeholder="University of Technology"
                  className="cos-input"
                />
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) => handleChange(edu.id, 'major', e.target.value)}
                    placeholder="Computer Science"
                    className="cos-input"
                  />
                </div>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Graduation Year</label>
                  <input
                    type="text"
                    value={edu.graduationYear}
                    onChange={(e) => handleChange(edu.id, 'graduationYear', e.target.value)}
                    placeholder="2022"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>GPA</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8 / 4.0"
                    className="cos-input"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button className="cos-add-btn" onClick={handleAdd}>
            + Add Education
          </button>
        </div>
      )}
    </div>
  )
}
