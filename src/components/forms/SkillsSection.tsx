import { type FC, useState, useEffect, type KeyboardEvent } from 'react'
import { useResume } from '../../context/ResumeContext'
import { getSkillsForRole } from '../../config/skillDatabase'

export const SkillsSection: FC = () => {
  const { state, updateField } = useResume()
  const [isExpanded, setIsExpanded] = useState(true)
  const [techInput, setTechInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  
  const [recommendedTech, setRecommendedTech] = useState<string[]>([])
  const [recommendedSoft, setRecommendedSoft] = useState<string[]>([])

  useEffect(() => {
    const title = state.resumeData.careerTarget.targetJobTitle
    if (title) {
      const recs = getSkillsForRole(title)
      if (recs) {
        // Filter out already added skills
        setRecommendedTech(recs.technical.filter(s => !state.resumeData.skills.technical.includes(s)))
        setRecommendedSoft(recs.soft.filter(s => !state.resumeData.skills.soft.includes(s)))
      } else {
        setRecommendedTech([])
        setRecommendedSoft([])
      }
    }
  }, [state.resumeData.careerTarget.targetJobTitle, state.resumeData.skills.technical, state.resumeData.skills.soft])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: 'technical' | 'soft') => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = type === 'technical' ? techInput.trim() : softInput.trim()
      if (val) {
        handleAddSkill(val, type)
        type === 'technical' ? setTechInput('') : setSoftInput('')
      }
    }
  }

  const handleAddSkill = (skill: string, type: 'technical' | 'soft') => {
    const current = state.resumeData.skills[type]
    if (!current.includes(skill)) {
      updateField(`skills.${type}`, [...current, skill])
    }
  }

  const handleRemoveSkill = (skill: string, type: 'technical' | 'soft') => {
    const current = state.resumeData.skills[type]
    updateField(
      `skills.${type}`,
      current.filter(s => s !== skill)
    )
  }

  return (
    <div className="cos-form-section">
      <div 
        className="cos-section-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cos-section-title">
          <span className="cos-section-icon">⚡</span>
          <h3>Skills</h3>
        </div>
        <button className="cos-section-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="cos-section-content">
          <div className="cos-form-group">
            <label>Technical Skills</label>
            <div className="cos-tags-input">
              <div className="cos-tags-list">
                {state.resumeData.skills.technical.map(skill => (
                  <span key={skill} className="cos-tag">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill, 'technical')}>✕</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'technical')}
                placeholder="Type a skill and press Enter..."
                className="cos-input-borderless"
              />
            </div>
            
            {recommendedTech.length > 0 && (
              <div className="cos-recommendations">
                <span className="cos-rec-label">Suggested:</span>
                <div className="cos-rec-list">
                  {recommendedTech.slice(0, 8).map(skill => (
                    <button 
                      key={skill} 
                      className="cos-rec-tag"
                      onClick={() => handleAddSkill(skill, 'technical')}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cos-form-group" style={{ marginTop: '24px' }}>
            <label>Soft Skills</label>
            <div className="cos-tags-input">
              <div className="cos-tags-list">
                {state.resumeData.skills.soft.map(skill => (
                  <span key={skill} className="cos-tag soft">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill, 'soft')}>✕</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={softInput}
                onChange={(e) => setSoftInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'soft')}
                placeholder="Type a skill and press Enter..."
                className="cos-input-borderless"
              />
            </div>
            
            {recommendedSoft.length > 0 && (
              <div className="cos-recommendations">
                <span className="cos-rec-label">Suggested:</span>
                <div className="cos-rec-list">
                  {recommendedSoft.slice(0, 6).map(skill => (
                    <button 
                      key={skill} 
                      className="cos-rec-tag soft"
                      onClick={() => handleAddSkill(skill, 'soft')}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
