import { type FC, useState, useRef } from 'react'
import { useResume } from '../../context/ResumeContext'
import { parseResumeFromPDF } from '../../services/resumeParser'

export const ResumeUploadSection: FC = () => {
  const { setResumeData, state } = useResume()
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }

    try {
      setIsParsing(true)
      setError(null)
      const parsedData = await parseResumeFromPDF(file)
      
      // Merge parsed data into existing state to keep the structure intact
      const merged = { ...state.resumeData }
      if (parsedData.personalInfo) {
        merged.personalInfo = { ...merged.personalInfo, ...parsedData.personalInfo }
      }
      if (parsedData.experience && parsedData.experience.length > 0) {
        merged.experience = parsedData.experience.map(e => ({ ...e, id: crypto.randomUUID() })) as any
      }
      if (parsedData.education && parsedData.education.length > 0) {
        merged.education = parsedData.education.map(e => ({ ...e, id: crypto.randomUUID() })) as any
      }
      if (parsedData.skills) {
        merged.skills = {
          technical: parsedData.skills.technical || [],
          soft: parsedData.skills.soft || []
        }
      }
      if (parsedData.projects && parsedData.projects.length > 0) {
        merged.projects = parsedData.projects.map(p => ({ ...p, id: crypto.randomUUID() })) as any
      }
      if (parsedData.certifications && parsedData.certifications.length > 0) {
        merged.certifications = parsedData.certifications.map(c => ({ ...c, id: crypto.randomUUID() })) as any
      }

      setResumeData(merged)
      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume.')
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <div className="cos-upload-section">
      <div className="cos-upload-card">
        <div className="cos-upload-icon">📤</div>
        <h4>Upload Existing Resume</h4>
        <p>We'll extract your details and populate the form.</p>
        
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <button 
          className="lp-btn secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isParsing}
        >
          {isParsing ? 'Parsing PDF...' : 'Select PDF File'}
        </button>

        {error && <div className="cos-upload-error">{error}</div>}
      </div>
    </div>
  )
}
