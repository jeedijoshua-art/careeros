export interface CareerTarget {
  targetJobTitle: string
  targetJobDescription: string
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
}

export interface PersonalInfo {
  fullName: string
  headline: string
  summary: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  notes: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  major: string
  graduationYear: string
  gpa: string
}

export interface Project {
  id: string
  name: string
  technologies: string
  notes: string
  link: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
}

export interface Skills {
  technical: string[]
  soft: string[]
}

export interface ResumeData {
  careerTarget: CareerTarget
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skills
  projects: Project[]
  certifications: Certification[]
}

export interface ATSScore {
  overall: number
  keywordMatch: number
  formatting: number
  missingKeywords: string[]
  suggestions: string[]
}

export type AIProcessingState = {
  [key: string]: boolean
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export const createEmptyResume = (): ResumeData => ({
  careerTarget: {
    targetJobTitle: '',
    targetJobDescription: '',
    experienceLevel: 'mid'
  },
  personalInfo: {
    fullName: '',
    headline: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  projects: [],
  certifications: []
})

export const createExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  notes: ''
})

export const createEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: '',
  degree: '',
  major: '',
  graduationYear: '',
  gpa: ''
})

export const createProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  technologies: '',
  notes: '',
  link: ''
})

export const createCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: ''
})
