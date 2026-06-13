import { createContext, useContext, useReducer, useEffect, type FC, type ReactNode } from 'react'
import { type ResumeData, type ATSScore, type AIProcessingState, type GenerationStatus, createEmptyResume } from '../types/resume'

interface ResumeState {
  resumeData: ResumeData
  generatedResume: ResumeData | null
  generationStatus: GenerationStatus
  atsScore: ATSScore | null
  aiProcessing: AIProcessingState
  isDirty: boolean
  errors: Record<string, string>
  validationError: string | null
  apiError: string | null
}

type ResumeAction =
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'SET_GENERATED_RESUME'; payload: ResumeData | null }
  | { type: 'SET_GENERATION_STATUS'; payload: GenerationStatus }
  | { type: 'UPDATE_FIELD'; payload: { path: string; value: unknown } }
  | { type: 'SET_ATS_SCORE'; payload: ATSScore | null }
  | { type: 'SET_AI_PROCESSING'; payload: { key: string; value: boolean } }
  | { type: 'RESET' }
  | { type: 'SET_VALIDATION_ERRORS'; payload: { errors: Record<string, string>; validationError: string | null } }
  | { type: 'CLEAR_VALIDATION_ERROR'; payload: string }
  | { type: 'SET_API_ERROR'; payload: string | null }

const STORAGE_KEY = 'careeros_resume_data'

interface StorageData {
  resumeData: ResumeData
  generatedResume: ResumeData | null
  generationStatus: GenerationStatus
}

function migrateResumeData(data: any): ResumeData {
  if (!data) return data
  
  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map((exp: any) => {
      if (exp && exp.notes === undefined) {
        const parts = []
        if (exp.responsibilities) parts.push(exp.responsibilities)
        if (exp.accomplishments) parts.push(exp.accomplishments)
        exp.notes = parts.join('\n')
        delete exp.responsibilities
        delete exp.accomplishments
      }
      return exp
    })
  }
  
  if (Array.isArray(data.projects)) {
    data.projects = data.projects.map((proj: any) => {
      if (proj && proj.notes === undefined) {
        proj.notes = proj.description || ''
        delete proj.description
      }
      return proj
    })
  }
  
  return data as ResumeData
}

function loadFromStorage(): StorageData {
  const defaults: StorageData = {
    resumeData: createEmptyResume(),
    generatedResume: null,
    generationStatus: 'idle'
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      let resumeData = defaults.resumeData
      let generatedResume = defaults.generatedResume
      let generationStatus = defaults.generationStatus

      if (parsed.careerTarget) {
        resumeData = migrateResumeData(parsed)
      } else {
        if (parsed.resumeData) {
          resumeData = migrateResumeData(parsed.resumeData)
        }
        if (parsed.generatedResume) {
          generatedResume = migrateResumeData(parsed.generatedResume)
        }
        if (parsed.generationStatus) {
          generationStatus = parsed.generationStatus
        }
      }
      return { resumeData, generatedResume, generationStatus }
    }
  } catch (e) {
    console.error('Failed to load resume from storage:', e)
  }
  return defaults
}

function saveToStorage(state: ResumeState) {
  try {
    const dataToSave: StorageData = {
      resumeData: state.resumeData,
      generatedResume: state.generatedResume,
      generationStatus: state.generationStatus
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (e) {
    console.error('Failed to save resume to storage:', e)
  }
}

function deepSet(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const result = { ...obj }
  let current: Record<string, unknown> = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (Array.isArray(current[key])) {
      current[key] = [...(current[key] as unknown[])]
    } else {
      current[key] = { ...(current[key] as Record<string, unknown>) }
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return result
}

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_RESUME_DATA':
      return { ...state, resumeData: action.payload, isDirty: true }
    case 'UPDATE_FIELD': {
      const updated = deepSet(
        state.resumeData as unknown as Record<string, unknown>,
        action.payload.path,
        action.payload.value
      ) as unknown as ResumeData
      
      const path = action.payload.path
      const newErrors = { ...state.errors }
      delete newErrors[path]
      
      if (
        path === 'personalInfo.summary' ||
        path.startsWith('experience') ||
        path.startsWith('projects') ||
        path.startsWith('skills')
      ) {
        delete newErrors['resumeContent']
      }
      
      let validationError = state.validationError
      if (Object.keys(newErrors).length === 0) {
        validationError = null
      }
      
      return { 
        ...state, 
        resumeData: updated, 
        isDirty: true, 
        errors: newErrors,
        validationError,
        apiError: null
      }
    }
    case 'SET_GENERATED_RESUME':
      return { ...state, generatedResume: action.payload, isDirty: true }
    case 'SET_GENERATION_STATUS':
      return { ...state, generationStatus: action.payload, isDirty: true }
    case 'SET_ATS_SCORE':
      return { ...state, atsScore: action.payload }
    case 'SET_AI_PROCESSING':
      return {
        ...state,
        aiProcessing: { ...state.aiProcessing, [action.payload.key]: action.payload.value }
      }
    case 'RESET':
      return { 
        ...state, 
        resumeData: createEmptyResume(), 
        generatedResume: null, 
        generationStatus: 'idle', 
        atsScore: null, 
        isDirty: false,
        errors: {},
        validationError: null,
        apiError: null
      }
    case 'SET_VALIDATION_ERRORS':
      return { 
        ...state, 
        errors: action.payload.errors, 
        validationError: action.payload.validationError 
      }
    case 'CLEAR_VALIDATION_ERROR': {
      const newErrors = { ...state.errors }
      delete newErrors[action.payload]
      let validationError = state.validationError
      if (Object.keys(newErrors).length === 0) {
        validationError = null
      }
      return { ...state, errors: newErrors, validationError }
    }
    case 'SET_API_ERROR':
      return { ...state, apiError: action.payload }
    default:
      return state
  }
}

interface ResumeContextType {
  state: ResumeState
  dispatch: React.Dispatch<ResumeAction>
  updateField: (path: string, value: unknown) => void
  setResumeData: (data: ResumeData) => void
  setGeneratedResume: (data: ResumeData | null) => void
  setGenerationStatus: (status: GenerationStatus) => void
  setAIProcessing: (key: string, value: boolean) => void
  resetResume: () => void
  setValidationErrors: (errors: Record<string, string>, validationError: string | null) => void
  clearValidationError: (key: string) => void
  setAPIError: (apiError: string | null) => void
}

const ResumeContext = createContext<ResumeContextType | null>(null)

export const ResumeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const initialData = loadFromStorage()
  const [state, dispatch] = useReducer(resumeReducer, {
    resumeData: initialData.resumeData,
    generatedResume: initialData.generatedResume,
    generationStatus: initialData.generationStatus,
    atsScore: null,
    aiProcessing: {},
    isDirty: false,
    errors: {},
    validationError: null,
    apiError: null
  })

  // Auto-save to localStorage
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => saveToStorage(state), 500)
      return () => clearTimeout(timer)
    }
  }, [state.resumeData, state.generatedResume, state.generationStatus, state.isDirty])

  const updateField = (path: string, value: unknown) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value } })
  }

  const setResumeData = (data: ResumeData) => {
    dispatch({ type: 'SET_RESUME_DATA', payload: data })
  }

  const setGeneratedResume = (data: ResumeData | null) => {
    dispatch({ type: 'SET_GENERATED_RESUME', payload: data })
  }

  const setGenerationStatus = (status: GenerationStatus) => {
    dispatch({ type: 'SET_GENERATION_STATUS', payload: status })
  }

  const setAIProcessing = (key: string, value: boolean) => {
    dispatch({ type: 'SET_AI_PROCESSING', payload: { key, value } })
  }

  const resetResume = () => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'RESET' })
  }

  const setValidationErrors = (errors: Record<string, string>, validationError: string | null) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: { errors, validationError } })
  }

  const clearValidationError = (key: string) => {
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: key })
  }

  const setAPIError = (apiError: string | null) => {
    dispatch({ type: 'SET_API_ERROR', payload: apiError })
  }

  return (
    <ResumeContext.Provider value={{ 
      state, 
      dispatch, 
      updateField, 
      setResumeData, 
      setGeneratedResume,
      setGenerationStatus,
      setAIProcessing, 
      resetResume,
      setValidationErrors,
      clearValidationError,
      setAPIError
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
