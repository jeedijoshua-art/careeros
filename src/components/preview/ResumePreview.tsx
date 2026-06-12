import { type FC } from 'react'
import { useResume } from '../../context/ResumeContext'
import { downloadResumePDF } from '../../services/pdfService'
import './ResumePreview.css'

export const ResumePreview: FC = () => {
  const { state } = useResume()
  const { generatedResume, generationStatus } = state

  const handleDownload = () => {
    if (!generatedResume) return
    try {
      downloadResumePDF(generatedResume)
    } catch (e) {
      console.error('PDF generation failed', e)
    }
  }

  // Handle Empty State
  if (!generatedResume && generationStatus !== 'generating') {
    return (
      <div className="cos-preview-container empty">
        <div className="cos-preview-empty-state">
          <div className="cos-empty-icon">📄</div>
          <h3>Ready to build your resume?</h3>
          <p>Complete your information and click <strong>Generate Professional Resume</strong>.</p>
        </div>
      </div>
    )
  }

  // Handle Loading State
  if (generationStatus === 'generating') {
    return (
      <div className="cos-preview-container loading">
        <div className="cos-preview-loading-state">
          <div className="cos-spinner large"></div>
          <h3>Generating ATS-Optimized Resume...</h3>
          <p>Gemini AI is analyzing and enhancing your career data.</p>
        </div>
      </div>
    )
  }

  if (!generatedResume) return null

  const { personalInfo, experience, education, skills, projects, certifications } = generatedResume

  // A4 aspect ratio 1:1.414
  return (
    <div className="cos-preview-container">
      <div className="cos-preview-header">
        <div className="cos-preview-title">
          <h2>Live Preview</h2>
          {generationStatus === 'success' && <span className="cos-success-badge">✓ Generated Successfully</span>}
        </div>
        <button className="lp-btn primary" onClick={handleDownload}>
          Download PDF
        </button>
      </div>

      <div className="cos-preview-scroll-area">
        <div className="cos-paper">
          
          {/* Header */}
          <div className="cos-paper-header">
            {personalInfo.fullName ? (
              <h1 className="cos-paper-name">{personalInfo.fullName}</h1>
            ) : (
              <h1 className="cos-paper-name placeholder">Jane Doe</h1>
            )}
            
            {personalInfo.headline && (
              <div className="cos-paper-headline">{personalInfo.headline}</div>
            )}
            
            <div className="cos-paper-contact">
              {[
                personalInfo.email,
                personalInfo.phone,
                personalInfo.location,
                personalInfo.linkedin,
                personalInfo.github,
                personalInfo.portfolio
              ].filter(Boolean).map((item, i, arr) => (
                <span key={i}>
                  {item}
                  {i < arr.length - 1 && <span className="cos-paper-separator">|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Professional Summary</h2>
              <p className="cos-paper-text">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && experience.some(e => e.role || e.company) && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Experience</h2>
              <div className="cos-paper-list">
                {experience.map((exp, i) => {
                  if (!exp.role && !exp.company) return null
                  return (
                    <div key={exp.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">{exp.role}</div>
                        <div className="cos-paper-item-date">
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                        </div>
                      </div>
                      {exp.company && <div className="cos-paper-item-subtitle">{exp.company}</div>}
                      
                      <ul className="cos-paper-bullets">
                        {(exp.notes || '').split('\n')
                          .filter(b => b.trim())
                          .map((bullet, i) => (
                            <li key={i}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
                          ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && projects.some(p => p.name) && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Projects</h2>
              <div className="cos-paper-list">
                {projects.map((proj, i) => {
                  if (!proj.name) return null
                  return (
                    <div key={proj.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">
                          {proj.name}
                          {proj.technologies && <span style={{ fontWeight: 'normal' }}> | {proj.technologies}</span>}
                        </div>
                      </div>
                      {proj.link && <div className="cos-paper-item-link">{proj.link}</div>}
                      
                      <ul className="cos-paper-bullets">
                        {(proj.notes || '').split('\n')
                          .filter(b => b.trim())
                          .map((bullet, i) => (
                            <li key={i}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
                          ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && education.some(e => e.institution) && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Education</h2>
              <div className="cos-paper-list">
                {education.map((edu, i) => {
                  if (!edu.institution) return null
                  return (
                    <div key={edu.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">{edu.institution}</div>
                        <div className="cos-paper-item-date">{edu.graduationYear}</div>
                      </div>
                      {edu.degree && (
                        <div className="cos-paper-item-subtitle">
                          {edu.degree} {edu.major ? `in ${edu.major}` : ''}
                        </div>
                      )}
                      {edu.gpa && <div className="cos-paper-item-gpa">GPA: {edu.gpa}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Skills */}
          {(skills.technical.length > 0 || skills.soft.length > 0) && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Skills</h2>
              <div className="cos-paper-skills">
                {skills.technical.length > 0 && (
                  <div className="cos-paper-skill-row">
                    <strong>Technical:</strong> {skills.technical.join(', ')}
                  </div>
                )}
                {skills.soft.length > 0 && (
                  <div className="cos-paper-skill-row">
                    <strong>Soft Skills:</strong> {skills.soft.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && certifications.some(c => c.name) && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Certifications</h2>
              <div className="cos-paper-list">
                {certifications.map((cert, i) => {
                  if (!cert.name) return null
                  return (
                    <div key={cert.id || i} className="cos-paper-item certification-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">
                          {cert.name}
                          {cert.issuer && <span style={{ fontWeight: 'normal' }}> — {cert.issuer}</span>}
                        </div>
                        <div className="cos-paper-item-date">{cert.date}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
