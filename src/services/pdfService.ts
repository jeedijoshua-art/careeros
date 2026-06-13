import { jsPDF } from 'jspdf'
import type { ResumeData } from '../types/resume'

const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const MARGIN_TOP = 20
const PAGE_WIDTH = 210
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const LINE_HEIGHT = 5
const SECTION_GAP = 8

export function generateResumePDF(data: ResumeData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  let y = MARGIN_TOP

  // Helper: check page overflow and add new page if needed
  const checkPageOverflow = (needed: number) => {
    if (y + needed > 280) {
      doc.addPage()
      y = MARGIN_TOP
    }
  }

  // Helper: add section header
  const addSectionHeader = (title: string) => {
    checkPageOverflow(12)
    y += SECTION_GAP
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(30, 30, 30)
    doc.text(title.toUpperCase(), MARGIN_LEFT, y)
    y += 2
    doc.setDrawColor(60, 60, 60)
    doc.setLineWidth(0.4)
    doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
    y += 4
  }

  // Helper: add text with word wrap
  const addText = (text: string, fontSize: number, style: string = 'normal', color: number[] = [50, 50, 50]) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    doc.setTextColor(color[0], color[1], color[2])
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH)
    const needed = LINE_HEIGHT * lines.length
    checkPageOverflow(needed)
    for (const line of lines) {
      doc.text(line, MARGIN_LEFT, y)
      y += LINE_HEIGHT
    }
  }

  // Helper: add a bullet point
  const addBullet = (text: string) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(50, 50, 50)
    const bulletIndent = MARGIN_LEFT + 4
    const bulletWidth = CONTENT_WIDTH - 4
    const lines = doc.splitTextToSize(text, bulletWidth)
    
    // Group characters and line outputs to prevent split lines on page boundaries
    const needed = LINE_HEIGHT * lines.length
    checkPageOverflow(needed)

    doc.text('•', MARGIN_LEFT, y)
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], bulletIndent, y)
      y += LINE_HEIGHT
    }
  }

  // ===== NAME =====
  const { personalInfo } = data
  if (personalInfo.fullName && personalInfo.fullName.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(20, 20, 20)
    doc.text(personalInfo.fullName, MARGIN_LEFT, y)
    y += 8
  }

  // ===== HEADLINE =====
  if (personalInfo.headline && personalInfo.headline.trim()) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text(personalInfo.headline, MARGIN_LEFT, y)
    y += 6
  }

  // ===== CONTACT LINE =====
  const contactParts: string[] = []
  if (personalInfo.email && personalInfo.email.trim()) contactParts.push(personalInfo.email.trim())
  if (personalInfo.phone && personalInfo.phone.trim()) contactParts.push(personalInfo.phone.trim())
  if (personalInfo.location && personalInfo.location.trim()) contactParts.push(personalInfo.location.trim())
  if (personalInfo.linkedin && personalInfo.linkedin.trim()) contactParts.push(personalInfo.linkedin.trim())
  if (personalInfo.github && personalInfo.github.trim()) contactParts.push(personalInfo.github.trim())
  if (personalInfo.portfolio && personalInfo.portfolio.trim()) contactParts.push(personalInfo.portfolio.trim())

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    const contactLine = contactParts.join('  |  ')
    const contactLines = doc.splitTextToSize(contactLine, CONTENT_WIDTH)
    const needed = 4.5 * contactLines.length + 2
    checkPageOverflow(needed)
    for (const line of contactLines) {
      doc.text(line, MARGIN_LEFT, y)
      y += 4.5
    }
    y += 2
  }

  // ===== SUMMARY =====
  if (personalInfo.summary && personalInfo.summary.trim()) {
    addSectionHeader('Professional Summary')
    addText(personalInfo.summary, 9.5)
  }

  // ===== EXPERIENCE =====
  const hasExperience = data.experience.length > 0 && data.experience.some(e => e.role?.trim() || e.company?.trim() || e.notes?.trim())
  if (hasExperience) {
    addSectionHeader('Experience')
    for (const exp of data.experience) {
      if (!exp.role?.trim() && !exp.company?.trim() && !exp.notes?.trim()) continue

      checkPageOverflow(18) // Ensure header text block fits
      
      // Role and Company
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 30, 30)
      doc.text(exp.role || 'Role', MARGIN_LEFT, y)

      // Dates on right
      if (exp.startDate || exp.endDate) {
        const dateStr = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        const dateWidth = doc.getTextWidth(dateStr)
        doc.text(dateStr, PAGE_WIDTH - MARGIN_RIGHT - dateWidth, y)
      }
      y += 5

      // Company
      if (exp.company) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.setTextColor(70, 70, 70)
        doc.text(exp.company, MARGIN_LEFT, y)
        y += 5
      }

      // Bullets
      const bullets = (exp.notes || '').split('\n').filter(b => b.trim())
      for (const bullet of bullets) {
        addBullet(bullet)
      }
      y += 3
    }
  }

  // ===== PROJECTS =====
  const hasProjects = data.projects.length > 0 && data.projects.some(p => p.name?.trim() || p.notes?.trim())
  if (hasProjects) {
    addSectionHeader('Projects')
    for (const proj of data.projects) {
      if (!proj.name?.trim() && !proj.notes?.trim()) continue

      checkPageOverflow(15)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 30, 30)
      let titleLine = proj.name || 'Project Name'
      if (proj.technologies) titleLine += `  |  ${proj.technologies}`
      const titleLines = doc.splitTextToSize(titleLine, CONTENT_WIDTH)
      for (const line of titleLines) {
        doc.text(line, MARGIN_LEFT, y)
        y += 5
      }

      if (proj.link) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(80, 80, 160)
        doc.text(proj.link, MARGIN_LEFT, y)
        y += 4.5
      }

      if (proj.notes) {
        const descBullets = proj.notes.split('\n').filter(b => b.trim())
        for (const bullet of descBullets) {
          addBullet(bullet)
        }
      }
      y += 3
    }
  }

  // ===== EDUCATION =====
  const hasEducation = data.education.length > 0 && data.education.some(e => e.institution?.trim() || e.degree?.trim())
  if (hasEducation) {
    addSectionHeader('Education')
    for (const edu of data.education) {
      if (!edu.institution?.trim() && !edu.degree?.trim()) continue

      checkPageOverflow(15)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 30, 30)
      doc.text(edu.institution || 'Institution', MARGIN_LEFT, y)

      if (edu.graduationYear) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        const yearWidth = doc.getTextWidth(edu.graduationYear)
        doc.text(edu.graduationYear, PAGE_WIDTH - MARGIN_RIGHT - yearWidth, y)
      }
      y += 5

      const degreeLine = [edu.degree, edu.major].filter(Boolean).join(' in ')
      if (degreeLine) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.setTextColor(50, 50, 50)
        doc.text(degreeLine, MARGIN_LEFT, y)
        y += 5
      }

      if (edu.gpa) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(80, 80, 80)
        doc.text(`GPA: ${edu.gpa}`, MARGIN_LEFT, y)
        y += 5
      }
      y += 2
    }
  }

  // ===== SKILLS =====
  const hasSkills = data.skills.technical.some(s => s && s.trim()) || data.skills.soft.some(s => s && s.trim())
  if (hasSkills) {
    addSectionHeader('Skills')
    
    const techSkills = data.skills.technical.filter(s => s && s.trim())
    if (techSkills.length > 0) {
      checkPageOverflow(10)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(30, 30, 30)
      doc.text('Technical: ', MARGIN_LEFT, y)
      const techLabelWidth = doc.getTextWidth('Technical: ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      const techText = techSkills.join(', ')
      const techLines = doc.splitTextToSize(techText, CONTENT_WIDTH - techLabelWidth)
      
      // Print first line with label
      doc.text(techLines[0], MARGIN_LEFT + techLabelWidth, y)
      y += LINE_HEIGHT
      
      // Print remaining wrapped lines
      for (let i = 1; i < techLines.length; i++) {
        checkPageOverflow(LINE_HEIGHT)
        doc.text(techLines[i], MARGIN_LEFT, y)
        y += LINE_HEIGHT
      }
    }
    
    const softSkills = data.skills.soft.filter(s => s && s.trim())
    if (softSkills.length > 0) {
      checkPageOverflow(10)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(30, 30, 30)
      doc.text('Soft Skills: ', MARGIN_LEFT, y)
      const softLabelWidth = doc.getTextWidth('Soft Skills: ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      const softText = softSkills.join(', ')
      const softLines = doc.splitTextToSize(softText, CONTENT_WIDTH - softLabelWidth)
      
      // Print first line with label
      doc.text(softLines[0], MARGIN_LEFT + softLabelWidth, y)
      y += LINE_HEIGHT
      
      // Print remaining wrapped lines
      for (let i = 1; i < softLines.length; i++) {
        checkPageOverflow(LINE_HEIGHT)
        doc.text(softLines[i], MARGIN_LEFT, y)
        y += LINE_HEIGHT
      }
    }
  }

  // ===== CERTIFICATIONS =====
  const hasCertifications = data.certifications.length > 0 && data.certifications.some(c => c.name?.trim())
  if (hasCertifications) {
    addSectionHeader('Certifications')
    for (const cert of data.certifications) {
      if (!cert.name?.trim()) continue
      checkPageOverflow(8)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(30, 30, 30)
      let certLine = cert.name
      if (cert.issuer) certLine += ` — ${cert.issuer}`
      doc.text(certLine, MARGIN_LEFT, y)

      if (cert.date) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        const dateWidth = doc.getTextWidth(cert.date)
        doc.text(cert.date, PAGE_WIDTH - MARGIN_RIGHT - dateWidth, y)
      }
      y += 6
    }
  }

  // Add Page Numbers at the bottom center of all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH / 2, 287, { align: 'center' })
  }

  return doc
}

export function downloadResumePDF(data: ResumeData, filename?: string) {
  const doc = generateResumePDF(data)
  const name = filename || `${data.personalInfo.fullName || 'Resume'}_CareerOS.pdf`
  doc.save(name.replace(/\s+/g, '_'))
}
