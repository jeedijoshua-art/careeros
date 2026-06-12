import { type FC } from 'react'
import { CareerTargetSection } from './CareerTargetSection'
import { PersonalInfoSection } from './PersonalInfoSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { CertificationsSection } from './CertificationsSection'
import { ResumeUploadSection } from './ResumeUploadSection'
import { useResume } from '../../context/ResumeContext'
import { generateProfessionalResume } from '../../services/aiService'
import './ResumeForm.css'

export const ResumeForm: FC = () => {
  const { state, setGeneratedResume, setGenerationStatus } = useResume()

  const handleGenerate = async () => {
    try {
      setGenerationStatus('generating')
      const result = await generateProfessionalResume(state.resumeData)
      
      // Sanitize and restore/generate unique IDs for sub-items
      if (result.experience) {
        result.experience = result.experience.map((e, idx) => ({
          ...e,
          id: e.id || state.resumeData.experience[idx]?.id || crypto.randomUUID()
        }))
      }
      if (result.projects) {
        result.projects = result.projects.map((p, idx) => ({
          ...p,
          id: p.id || state.resumeData.projects[idx]?.id || crypto.randomUUID()
        }))
      }
      if (result.education) {
        result.education = result.education.map((edu, idx) => ({
          ...edu,
          id: edu.id || state.resumeData.education[idx]?.id || crypto.randomUUID()
        }))
      }
      if (result.certifications) {
        result.certifications = result.certifications.map((c, idx) => ({
          ...c,
          id: c.id || state.resumeData.certifications[idx]?.id || crypto.randomUUID()
        }))
      }

      setGeneratedResume(result)
      setGenerationStatus('success')
    } catch (error) {
      console.error(error)
      setGenerationStatus('error')
    }
  }

  const isGenerating = state.generationStatus === 'generating'
  const isSuccess = state.generationStatus === 'success'

  return (
    <div className="cos-resume-form">
      <div className="cos-form-header">
        <h2>Resume Editor</h2>
        <p>Fill in your details or upload an existing resume.</p>
      </div>
      
      <ResumeUploadSection />
      
      <div className="cos-form-sections">
        <CareerTargetSection />
        <PersonalInfoSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificationsSection />
      </div>

      <div className="cos-form-actions">
        <button 
          className="cos-btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <><span className="cos-spinner"></span> Processing AI Data...</>
          ) : isSuccess ? (
            <>🔄 Regenerate Resume</>
          ) : (
            <>✨ Generate Professional Resume</>
          )}
        </button>
        {state.generationStatus === 'error' && (
          <div className="cos-generation-error">Failed to generate resume. Ensure your API key is set.</div>
        )}
      </div>
    </div>
  )
}
