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
    for (const line of lines) {
      checkPageOverflow(LINE_HEIGHT)
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
    checkPageOverflow(LINE_HEIGHT)
    doc.text('•', MARGIN_LEFT, y)
    for (let i = 0; i < lines.length; i++) {
      checkPageOverflow(LINE_HEIGHT)
      doc.text(lines[i], bulletIndent, y)
      y += LINE_HEIGHT
    }
  }

  // ===== NAME =====
  const { personalInfo } = data
  if (personalInfo.fullName) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(20, 20, 20)
    doc.text(personalInfo.fullName, MARGIN_LEFT, y)
    y += 8
  }

  // ===== HEADLINE =====
  if (personalInfo.headline) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text(personalInfo.headline, MARGIN_LEFT, y)
    y += 6
  }

  // ===== CONTACT LINE =====
  const contactParts: string[] = []
  if (personalInfo.email) contactParts.push(personalInfo.email)
  if (personalInfo.phone) contactParts.push(personalInfo.phone)
  if (personalInfo.location) contactParts.push(personalInfo.location)
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin)
  if (personalInfo.github) contactParts.push(personalInfo.github)
  if (personalInfo.portfolio) contactParts.push(personalInfo.portfolio)

  if (contactParts.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    const contactLine = contactParts.join('  |  ')
    const contactLines = doc.splitTextToSize(contactLine, CONTENT_WIDTH)
    for (const line of contactLines) {
      doc.text(line, MARGIN_LEFT, y)
      y += 4.5
    }
    y += 2
  }

  // ===== SUMMARY =====
  if (personalInfo.summary) {
    addSectionHeader('Professional Summary')
    addText(personalInfo.summary, 9.5)
  }

  // ===== EXPERIENCE =====
  if (data.experience.length > 0) {
    addSectionHeader('Experience')
    for (const exp of data.experience) {
      if (!exp.role && !exp.company) continue

      checkPageOverflow(15)
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
  if (data.projects.length > 0) {
    addSectionHeader('Projects')
    for (const proj of data.projects) {
      if (!proj.name) continue

      checkPageOverflow(12)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 30, 30)
      let titleLine = proj.name
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
  if (data.education.length > 0) {
    addSectionHeader('Education')
    for (const edu of data.education) {
      if (!edu.institution) continue

      checkPageOverflow(12)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(30, 30, 30)
      doc.text(edu.institution, MARGIN_LEFT, y)

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
  if (data.skills.technical.length > 0 || data.skills.soft.length > 0) {
    addSectionHeader('Skills')
    if (data.skills.technical.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(30, 30, 30)
      doc.text('Technical: ', MARGIN_LEFT, y)
      const techLabelWidth = doc.getTextWidth('Technical: ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      const techText = data.skills.technical.join(', ')
      const techLines = doc.splitTextToSize(techText, CONTENT_WIDTH - techLabelWidth)
      doc.text(techLines[0], MARGIN_LEFT + techLabelWidth, y)
      y += LINE_HEIGHT
      for (let i = 1; i < techLines.length; i++) {
        checkPageOverflow(LINE_HEIGHT)
        doc.text(techLines[i], MARGIN_LEFT, y)
        y += LINE_HEIGHT
      }
    }
    if (data.skills.soft.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(30, 30, 30)
      doc.text('Soft Skills: ', MARGIN_LEFT, y)
      const softLabelWidth = doc.getTextWidth('Soft Skills: ')
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)
      const softText = data.skills.soft.join(', ')
      const softLines = doc.splitTextToSize(softText, CONTENT_WIDTH - softLabelWidth)
      doc.text(softLines[0], MARGIN_LEFT + softLabelWidth, y)
      y += LINE_HEIGHT
      for (let i = 1; i < softLines.length; i++) {
        checkPageOverflow(LINE_HEIGHT)
        doc.text(softLines[i], MARGIN_LEFT, y)
        y += LINE_HEIGHT
      }
    }
  }

  // ===== CERTIFICATIONS =====
  if (data.certifications.length > 0) {
    addSectionHeader('Certifications')
    for (const cert of data.certifications) {
      if (!cert.name) continue
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

  return doc
}

export function downloadResumePDF(data: ResumeData, filename?: string) {
  const doc = generateResumePDF(data)
  const name = filename || `${data.personalInfo.fullName || 'Resume'}_CareerOS.pdf`
  doc.save(name.replace(/\s+/g, '_'))
}
