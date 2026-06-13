import { type FC, useState, useEffect } from 'react'
import { useResume } from '../../context/ResumeContext'
import { downloadResumePDF } from '../../services/pdfService'
import './ResumePreview.css'

export const ResumePreview: FC = () => {
  const { state } = useResume()
  const { generatedResume, generationStatus } = state

  const [loadingStep, setLoadingStep] = useState(0)
  const loadingMessages = [
    '🤖 Understanding your profile…',
    '📝 Writing ATS-optimized content…',
    '🎯 Tailoring for your target role…',
    '✨ Building your professional resume…'
  ]

  useEffect(() => {
    if (generationStatus !== 'generating') {
      setLoadingStep(0)
      return
    }
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev))
    }, 2000)
    return () => clearInterval(timer)
  }, [generationStatus])

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
          <p className="cos-empty-text">Complete your information and click Generate Professional Resume.</p>
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
          <h3>AI Assistant Working</h3>
          <div className="cos-loading-steps">
            {loadingMessages.map((msg, idx) => {
              let status = 'pending'
              if (loadingStep > idx) status = 'completed'
              else if (loadingStep === idx) status = 'active'

              return (
                <div key={idx} className={`cos-loading-step ${status}`}>
                  <span className="cos-step-bullet">
                    {status === 'completed' ? '✓' : status === 'active' ? '●' : '○'}
                  </span>
                  <span className="cos-step-text">{msg}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!generatedResume) return null

  const { personalInfo, experience, education, skills, projects, certifications } = generatedResume

  const hasSummary = Boolean(personalInfo.summary && personalInfo.summary.trim())
  const hasExperience = experience.length > 0 && experience.some(e => e.role?.trim() || e.company?.trim() || e.notes?.trim())
  const hasProjects = projects.length > 0 && projects.some(p => p.name?.trim() || p.notes?.trim())
  const hasEducation = education.length > 0 && education.some(e => e.institution?.trim() || e.degree?.trim())
  const hasSkills = skills.technical.some(s => s && s.trim()) || skills.soft.some(s => s && s.trim())
  const hasCertifications = certifications.length > 0 && certifications.some(c => c.name?.trim())

  return (
    <div className="cos-preview-container">
      <div className="cos-preview-header">
        <div className="cos-preview-title">
          <h2>Live Preview</h2>
          {generationStatus === 'success' && <span className="cos-success-badge">✅ Resume Generated Successfully</span>}
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
          {hasSummary && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Professional Summary</h2>
              <p className="cos-paper-text">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {hasExperience && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Experience</h2>
              <div className="cos-paper-list">
                {experience.map((exp, i) => {
                  if (!exp.role?.trim() && !exp.company?.trim() && !exp.notes?.trim()) return null
                  return (
                    <div key={exp.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">{exp.role || 'Role'}</div>
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
          {hasProjects && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Projects</h2>
              <div className="cos-paper-list">
                {projects.map((proj, i) => {
                  if (!proj.name?.trim() && !proj.notes?.trim()) return null
                  return (
                    <div key={proj.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">
                          {proj.name || 'Project Name'}
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
          {hasEducation && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Education</h2>
              <div className="cos-paper-list">
                {education.map((edu, i) => {
                  if (!edu.institution?.trim() && !edu.degree?.trim()) return null
                  return (
                    <div key={edu.id || i} className="cos-paper-item">
                      <div className="cos-paper-item-header">
                        <div className="cos-paper-item-title">{edu.institution || 'Institution'}</div>
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
          {hasSkills && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Skills</h2>
              <div className="cos-paper-skills">
                {skills.technical.some(s => s && s.trim()) && (
                  <div className="cos-paper-skill-row">
                    <strong>Technical:</strong> {skills.technical.filter(s => s && s.trim()).join(', ')}
                  </div>
                )}
                {skills.soft.some(s => s && s.trim()) && (
                  <div className="cos-paper-skill-row">
                    <strong>Soft Skills:</strong> {skills.soft.filter(s => s && s.trim()).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasCertifications && (
            <div className="cos-paper-section">
              <h2 className="cos-paper-section-title">Certifications</h2>
              <div className="cos-paper-list">
                {certifications.map((cert, i) => {
                  if (!cert.name?.trim()) return null
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
