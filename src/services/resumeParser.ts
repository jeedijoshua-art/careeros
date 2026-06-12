import * as pdfjsLib from 'pdfjs-dist'
import type { ResumeData } from '../types/resume'
import { parseResumeText } from './aiService'

// Set up the worker for pdfjs. This is required for it to run in the browser.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  let fullText = ''
  
  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(' ')
    fullText += pageText + '\n'
  }
  
  return fullText
}

export async function parseResumeFromPDF(file: File): Promise<Partial<ResumeData>> {
  try {
    const text = await extractTextFromPDF(file)
    if (!text || text.trim() === '') {
      throw new Error('Could not extract text from the PDF. The file might be an image-based PDF or corrupted.')
    }
    
    // Send the extracted text to Gemini for structured parsing
    const parsedData = await parseResumeText(text)
    return parsedData
  } catch (error) {
    console.error('Error parsing resume PDF:', error)
    throw error
  }
}
