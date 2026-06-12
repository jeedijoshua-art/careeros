import { type FC, useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { createCertification } from '../../types/resume'

export const CertificationsSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAdd = () => {
    updateField('certifications', [...state.resumeData.certifications, createCertification()])
  }

  const handleRemove = (id: string) => {
    updateField(
      'certifications',
      state.resumeData.certifications.filter(cert => cert.id !== id)
    )
  }

  const handleChange = (id: string, field: string, value: string) => {
    updateField(
      'certifications',
      state.resumeData.certifications.map(cert => (cert.id === id ? { ...cert, [field]: value } : cert))
    )
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">🏆</span>
          <h3>Certifications</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          {state.resumeData.certifications.map((cert, index) => (
            <div key={cert.id} className="cos-form-item-card">
              <div className="cos-item-header">
                <h4>Certification #{index + 1}</h4>
                <button 
                  className="cos-btn-icon danger" 
                  onClick={() => handleRemove(cert.id)}
                  title="Remove Certification"
                >
                  ✕
                </button>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange(cert.id, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    className="cos-input"
                  />
                </div>
              </div>
              
              <div className="cos-form-row">
                <div className="cos-form-group">
                  <label>Issuer</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleChange(cert.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="cos-input"
                  />
                </div>
                <div className="cos-form-group">
                  <label>Date / Year</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => handleChange(cert.id, 'date', e.target.value)}
                    placeholder="2023"
                    className="cos-input"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button className="cos-add-btn" onClick={handleAdd}>
            + Add Certification
          </button>
        </div>
      )}
    </div>
  )
}
