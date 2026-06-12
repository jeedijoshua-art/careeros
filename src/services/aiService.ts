import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ResumeData } from '../types/resume'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

function getModel() {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.')
  }
  const genAI = new GoogleGenerativeAI(API_KEY)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

async function generateContent(prompt: string): Promise<string> {
  try {
    const model = getModel()
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('AI generation error:', error)
    throw error
  }
}

export async function generateProfessionalResume(rawData: ResumeData): Promise<ResumeData> {
  const prompt = `You are a world-class ATS Resume Writer and Career Coach.

Your responsibility is to transform raw resume information into a professional ATS-optimized resume.

Follow modern recruiting standards.
Use powerful action verbs.
Use achievement-driven writing.
Use measurable impact whenever possible.
Use concise and professional language.
Tailor the resume toward the target job title: "${rawData.careerTarget.targetJobTitle || 'Not specified'}" and target experience level: "${rawData.careerTarget.experienceLevel || 'Not specified'}".

INPUT DATA DETAILS:
- "personalInfo.summary" represents rough career highlights or about yourself notes.
- "experience[].notes" represents rough work experience notes.
- "projects[].notes" represents rough project notes.

INSTRUCTIONS:
1. Rewrite "personalInfo.summary" into a polished, powerful, ATS-optimized Professional Summary paragraph (2-3 concise sentences highlighting years of experience, domain expertise, and core value).
2. For each work experience entry in "experience", transform its rough "notes" into 3-4 professional, ATS-optimized bullet points separated by newlines (\\n). Follow the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" and start each bullet with a STRONG action verb (Led, Engineered, Optimized, Spearheaded, etc.).
3. For each project in "projects", transform its rough "notes" into 2-3 impact-driven project description bullets separated by newlines (\\n). Start each with a strong action verb and highlight the technical complexity, tools used, and results.
4. Keep the other fields (like company names, job titles, start/end dates, institution names, GPA, links, technical and soft skills lists, certifications) intact or optimized slightly if appropriate, but ensure they remain functionally identical and all IDs are kept exactly intact.
5. In the final returned JSON, these rewritten fields must populate "personalInfo.summary", "experience[].notes", and "projects[].notes" respectively. Do not include legacy fields like responsibilities, accomplishments, or description.

RAW RESUME DATA:
${JSON.stringify(rawData, null, 2)}

Return ONLY a valid JSON object matching the exact structure of the input ResumeData. Keep IDs intact. Enhance the text content. Do not invent fake jobs or fake degrees.`

  const text = await generateContent(prompt)
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned) as ResumeData
  } catch (error) {
    console.error('Failed to parse generated resume JSON:', error)
    throw new Error('AI generation failed to produce valid JSON')
  }
}



export async function getAISkillRecommendations(
  jobTitle: string
): Promise<{ technical: string[]; soft: string[] }> {
  const prompt = `You are a career advisor. For the role "${jobTitle}", list the most important skills.

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{"technical": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8", "skill9", "skill10"], "soft": ["skill1", "skill2", "skill3", "skill4", "skill5"]}`

  const text = await generateContent(prompt)
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { technical: [], soft: [] }
  }
}

export async function analyzeATSScore(
  resumeData: ResumeData
): Promise<{ score: number; missingKeywords: string[]; suggestions: string[] }> {
  const jd = resumeData.careerTarget.targetJobDescription
  if (!jd) {
    return { score: 0, missingKeywords: [], suggestions: ['Add a target job description to get ATS analysis'] }
  }

  const resumeText = [
    resumeData.personalInfo.summary,
    resumeData.personalInfo.headline,
    ...resumeData.experience.map(e => `${e.role} ${e.company} ${e.notes}`),
    ...resumeData.projects.map(p => `${p.name} ${p.technologies} ${p.notes}`),
    resumeData.skills.technical.join(', '),
    resumeData.skills.soft.join(', ')
  ].join(' ')

  const prompt = `You are an ATS (Applicant Tracking System) optimization expert. Analyze resume-job description alignment.

JOB DESCRIPTION:
${jd}

RESUME CONTENT:
${resumeText}

Analyze keyword match and provide optimization suggestions.

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{"score": 75, "missingKeywords": ["keyword1", "keyword2"], "suggestions": ["suggestion1", "suggestion2"]}`

  const text = await generateContent(prompt)
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { score: 0, missingKeywords: [], suggestions: ['Failed to analyze. Please try again.'] }
  }
}

export async function parseResumeText(
  rawText: string
): Promise<Partial<ResumeData>> {
  const prompt = `You are a resume parser. Extract structured data from this resume text.

RESUME TEXT:
${rawText}

Rules:
1. In experience, merge any extracted responsibilities, achievements, and accomplishments into a single newline-separated text field named 'notes'.
2. In projects, place the project description/details into 'notes'.

Return ONLY a JSON object with this format (no markdown, no code blocks). Include only fields that you can extract:
{
  "personalInfo": {
    "fullName": "",
    "headline": "",
    "summary": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "notes": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "major": "",
      "graduationYear": "",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1"]
  },
  "projects": [
    {
      "name": "",
      "technologies": "",
      "notes": "",
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ]
}`

  const text = await generateContent(prompt)
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse resume. Please try again or enter information manually.')
  }
}

export function isAPIKeyConfigured(): boolean {
  return Boolean(API_KEY)
}
