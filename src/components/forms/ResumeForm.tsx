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
  const { state, setGeneratedResume, setGenerationStatus, setValidationErrors, setAPIError } = useResume()

  const isFormCompletelyEmpty = () => {
    const data = state.resumeData
    const hasName = Boolean(data.personalInfo.fullName?.trim())
    const hasJobTitle = Boolean(data.careerTarget.targetJobTitle?.trim())
    const hasSummary = Boolean(data.personalInfo.summary?.trim())
    const hasExperience = data.experience.some(e => e.role?.trim() || e.company?.trim() || e.notes?.trim())
    const hasProjects = data.projects.some(p => p.name?.trim() || p.notes?.trim())
    const hasSkills = data.skills.technical.some(s => s && s.trim()) || data.skills.soft.some(s => s && s.trim())
    const hasEducation = data.education.some(edu => edu.institution?.trim() || edu.degree?.trim())
    const hasCertifications = data.certifications.some(c => c.name?.trim())

    return !hasName && !hasJobTitle && !hasSummary && !hasExperience && !hasProjects && !hasSkills && !hasEducation && !hasCertifications
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    let validationError: string | null = null

    const fullName = state.resumeData.personalInfo.fullName?.trim()
    const targetJobTitle = state.resumeData.careerTarget.targetJobTitle?.trim()

    // 1. Validate Full Name
    if (!fullName) {
      errors['personalInfo.fullName'] = 'Please enter your Full Name.'
      if (!validationError) {
        validationError = 'Please enter your Full Name.'
      }
    }

    // 2. Validate Target Job Title
    if (!targetJobTitle) {
      errors['careerTarget.targetJobTitle'] = 'Please enter a Target Job Title.'
      if (!validationError) {
        validationError = 'Please enter a Target Job Title.'
      }
    }

    // 3. Validate at least one resume content section is filled
    const hasSummary = Boolean(state.resumeData.personalInfo.summary?.trim())
    const hasExperience = state.resumeData.experience.some(e => e.role?.trim() || e.company?.trim() || e.notes?.trim())
    const hasProjects = state.resumeData.projects.some(p => p.name?.trim() || p.notes?.trim())
    const hasSkills = state.resumeData.skills.technical.some(s => s && s.trim())

    if (!hasSummary && !hasExperience && !hasProjects && !hasSkills) {
      errors['resumeContent'] = 'Please add at least one experience, project, summary, or skill before generating.'
      if (!validationError) {
        validationError = 'Please add at least one experience, project, summary, or skill before generating.'
      }
    }

    setValidationErrors(errors, validationError)
    return Object.keys(errors).length === 0
  }

  const handleGenerate = async () => {
    setAPIError(null)
    setValidationErrors({}, null)

    if (!validateForm()) {
      return
    }

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
    } catch (error: any) {
      console.error(error)
      setGenerationStatus('error')
      
      const msg = String(error?.message || error || '').toLowerCase()
      let mappedError = 'Something went wrong while generating your resume. Please try again.'
      if (msg.includes('429') || msg.includes('quota') || msg.includes('limit') || msg.includes('resourceexhausted')) {
        mappedError = 'AI service is temporarily unavailable due to usage limits. Please try again later.'
      } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('offline') || msg.includes('connect')) {
        mappedError = 'Unable to connect to AI service. Check your internet connection.'
      }
      setAPIError(mappedError)
    }
  }

  const isGenerating = state.generationStatus === 'generating'
  const isSuccess = state.generationStatus === 'success'
  const isEmpty = isFormCompletelyEmpty()

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
        {state.validationError && (
          <div className="cos-validation-error-banner">{state.validationError}</div>
        )}
        {isSuccess && (
          <div className="cos-generation-success">Resume generated successfully.</div>
        )}
        <button 
          className="cos-btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating || isEmpty}
        >
          {isGenerating ? (
            <><span className="cos-spinner"></span> Generating Resume...</>
          ) : isEmpty ? (
            <>Complete Required Fields</>
          ) : isSuccess ? (
            <>🔄 Regenerate Resume</>
          ) : (
            <>✨ Generate Professional Resume</>
          )}
        </button>
        {state.generationStatus === 'error' && (
          <div className="cos-generation-error">
            {state.apiError || 'Something went wrong while generating your resume. Please try again.'}
          </div>
        )}
      </div>
    </div>
  )
}
