export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5-10 years)' },
  { value: 'lead', label: 'Lead / Staff (10+ years)' },
  { value: 'executive', label: 'Executive / Director' }
] as const

export const SECTION_LABELS = {
  careerTarget: 'Career Target',
  personalInfo: 'Personal Information',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  upload: 'Resume Upload'
} as const

export const APP_NAME = 'CareerOS'
export const APP_TAGLINE = 'Your AI Career Operating System'
export const APP_VERSION = '1.0.0'

export const COMING_SOON_FEATURES = [
  { name: 'Cover Letter Generator', icon: '✉️', description: 'AI-powered cover letters tailored to each application' },
  { name: 'Interview Prep', icon: '🎙️', description: 'Practice with AI-generated interview questions' },
  { name: 'LinkedIn Optimizer', icon: '💼', description: 'Optimize your LinkedIn profile for visibility' },
  { name: 'Career Roadmap', icon: '🗺️', description: 'Plan your career trajectory with AI insights' },
  { name: 'Application Tracker', icon: '📊', description: 'Track and manage all your job applications' }
] as const
