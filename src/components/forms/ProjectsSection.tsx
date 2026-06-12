import { type FC, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { createProject } from '../../types/resume'

export const ProjectsSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAdd = () => {
    updateField('projects', [...state.resumeData.projects, createProject()])
  }

  const handleRemove = (id: string) => {
    updateField(
      'projects',
      state.resumeData.projects.filter(proj => proj.id !== id)
    )
  }

  const handleChange = (id: string, field: string, value: string) => {
    updateField(
      'projects',
      state.resumeData.projects.map(proj => (proj.id === id ? { ...proj, [field]: value } : proj))
    )
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">🚀</span>
          <h3>Projects</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          {state.resumeData.projects.map((proj, index) => (
            <div key={proj.id} className="cos-form-item-card">
              <div className="cos-item-header">
                <h4>Project #{index + 1}</h4>
                <button 
                  className="cos-btn-icon danger" 
                  onClick={() => handleRemove(proj.id)}
                  title="Remove Project"
                >
                  ✕
                </button>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
                    placeholder="E-commerce Platform"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>Link (Optional)</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => handleChange(proj.id, 'link', e.target.value)}
                    placeholder="github.com/project"
                    className="cos-input"
                  />
                </div>
              </div>
              
              <div className="cos-form-group">
                <label>Technologies Used</label>
                <input
                  type="text"
                  value={proj.technologies}
                  onChange={(e) => handleChange(proj.id, 'technologies', e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className="cos-input"
                />
              </div>
              
              <div className="cos-form-group">
                <label>Project Notes</label>
                <textarea
                  value={proj.notes}
                  onChange={(e) => handleChange(proj.id, 'notes', e.target.value)}
                  placeholder={`AI workflow platform.
Built using React and Gemini.
Allows users to automate tasks.`}
                  className="cos-textarea"
                  rows={4}
                />
              </div>
            </div>
          ))}
          
          <button className="cos-add-btn" onClick={handleAdd}>
            + Add Project
          </button>
        </div>
      )}
    </div>
  )
}
