# CareerOS

A modern, dynamic resume generator and career development workspace. Built with React, TypeScript, Vite, and vanilla CSS.

## Features

- **Interactive Resume Builder**: Live form fields for personal info, experience, education, skills, projects, and certifications.
- **AI-Powered Services**: Built-in AI assistance for resume tailoring and optimizations.
- **PDF Generation**: Direct export to PDF format.
- **Parsing**: Upload existing resumes to parse and populate the builder.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Modern, responsive Vanilla CSS with a customized design system
- **State Management**: React Context (`ResumeContext`)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your API keys to the `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```
