// Pre-built skill recommendations for common job titles
// Used as primary source; AI can supplement these

export const skillDatabase: Record<string, { technical: string[]; soft: string[] }> = {
  'frontend developer': {
    technical: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Next.js', 'Tailwind CSS', 'Redux', 'GraphQL', 'REST APIs', 'Webpack', 'Vite', 'Jest', 'Cypress', 'Git', 'Figma', 'Responsive Design', 'Web Accessibility', 'Performance Optimization', 'CI/CD'],
    soft: ['Problem Solving', 'Communication', 'Collaboration', 'Attention to Detail', 'Time Management', 'Adaptability']
  },
  'backend developer': {
    technical: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Microservices', 'CI/CD', 'Git', 'Linux', 'SQL', 'Message Queues', 'gRPC', 'Terraform', 'Nginx'],
    soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'System Design', 'Debugging', 'Collaboration']
  },
  'full stack developer': {
    technical: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'Git', 'CI/CD', 'Redis', 'Next.js', 'Tailwind CSS', 'Jest', 'Linux', 'Webpack', 'Kubernetes', 'Firebase'],
    soft: ['Problem Solving', 'Communication', 'Versatility', 'Leadership', 'Time Management', 'Adaptability']
  },
  'data scientist': {
    technical: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'Spark', 'Tableau', 'Power BI', 'Statistical Modeling', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'A/B Testing', 'Feature Engineering', 'Git'],
    soft: ['Analytical Thinking', 'Communication', 'Critical Thinking', 'Storytelling', 'Research', 'Collaboration']
  },
  'product manager': {
    technical: ['Jira', 'Confluence', 'Figma', 'SQL', 'A/B Testing', 'Google Analytics', 'Mixpanel', 'Product Analytics', 'Roadmapping', 'User Research', 'Wireframing', 'Agile', 'Scrum', 'Data Analysis', 'API Understanding'],
    soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Stakeholder Management', 'Prioritization', 'Empathy', 'Decision Making', 'Negotiation']
  },
  'ux designer': {
    technical: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Prototyping', 'Wireframing', 'User Research', 'Usability Testing', 'Design Systems', 'HTML/CSS', 'Accessibility', 'Information Architecture', 'Interaction Design', 'Visual Design', 'Miro'],
    soft: ['Empathy', 'Communication', 'Creativity', 'Critical Thinking', 'Collaboration', 'Presentation Skills']
  },
  'ui designer': {
    technical: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'Design Systems', 'Typography', 'Color Theory', 'Responsive Design', 'Motion Design', 'Icon Design', 'Illustration', 'HTML/CSS', 'Accessibility', 'Framer'],
    soft: ['Creativity', 'Attention to Detail', 'Communication', 'Collaboration', 'Visual Storytelling', 'Adaptability']
  },
  'devops engineer': {
    technical: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Linux', 'Bash', 'Python', 'Prometheus', 'Grafana', 'ELK Stack', 'Nginx', 'Helm', 'ArgoCD', 'Infrastructure as Code'],
    soft: ['Problem Solving', 'Communication', 'Automation Mindset', 'Collaboration', 'Incident Management', 'Documentation']
  },
  'machine learning engineer': {
    technical: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'Docker', 'Kubernetes', 'AWS SageMaker', 'Feature Engineering', 'Model Deployment', 'Deep Learning', 'NLP', 'Computer Vision', 'Git', 'SQL', 'Spark', 'MLflow', 'Kubeflow', 'Data Pipelines', 'A/B Testing'],
    soft: ['Research Skills', 'Analytical Thinking', 'Communication', 'Experimentation', 'Problem Solving', 'Collaboration']
  },
  'software engineer': {
    technical: ['JavaScript', 'Python', 'Java', 'C++', 'Git', 'SQL', 'REST APIs', 'Docker', 'AWS', 'Linux', 'CI/CD', 'Data Structures', 'Algorithms', 'System Design', 'Agile', 'Unit Testing', 'Microservices', 'Cloud Services', 'Databases', 'OOP'],
    soft: ['Problem Solving', 'Communication', 'Teamwork', 'Adaptability', 'Time Management', 'Critical Thinking']
  },
  'data analyst': {
    technical: ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI', 'Google Analytics', 'Statistical Analysis', 'Data Visualization', 'ETL', 'Pandas', 'NumPy', 'A/B Testing', 'Looker', 'BigQuery', 'Data Modeling'],
    soft: ['Analytical Thinking', 'Communication', 'Attention to Detail', 'Problem Solving', 'Storytelling', 'Curiosity']
  },
  'data engineer': {
    technical: ['Python', 'SQL', 'Spark', 'Airflow', 'Kafka', 'AWS', 'Snowflake', 'dbt', 'ETL/ELT', 'Data Modeling', 'BigQuery', 'Redshift', 'Docker', 'Kubernetes', 'Terraform', 'Data Warehousing', 'Stream Processing', 'Git'],
    soft: ['Problem Solving', 'Communication', 'System Thinking', 'Collaboration', 'Documentation', 'Reliability']
  },
  'mobile developer': {
    technical: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'TypeScript', 'Firebase', 'REST APIs', 'GraphQL', 'Git', 'App Store Deployment', 'CI/CD', 'Unit Testing', 'UI/UX', 'Push Notifications', 'State Management'],
    soft: ['Problem Solving', 'Attention to Detail', 'User Empathy', 'Communication', 'Adaptability', 'Creativity']
  },
  'cloud engineer': {
    technical: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Networking', 'Security', 'CI/CD', 'Python', 'Bash', 'CloudFormation', 'Serverless', 'Load Balancing', 'IAM', 'Monitoring', 'Cost Optimization'],
    soft: ['Problem Solving', 'Communication', 'Documentation', 'Collaboration', 'Reliability', 'Learning Agility']
  },
  'cybersecurity analyst': {
    technical: ['SIEM', 'Network Security', 'Penetration Testing', 'Vulnerability Assessment', 'Firewalls', 'IDS/IPS', 'Python', 'Linux', 'Incident Response', 'Risk Assessment', 'Compliance', 'Encryption', 'OWASP', 'SOC Operations', 'Threat Intelligence'],
    soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Problem Solving', 'Integrity', 'Continuous Learning']
  },
  'project manager': {
    technical: ['Jira', 'Asana', 'MS Project', 'Confluence', 'Agile', 'Scrum', 'Kanban', 'Gantt Charts', 'Risk Management', 'Budgeting', 'Stakeholder Management', 'Reporting', 'Slack', 'Trello'],
    soft: ['Leadership', 'Communication', 'Organization', 'Negotiation', 'Conflict Resolution', 'Decision Making', 'Time Management', 'Adaptability']
  },
  'technical writer': {
    technical: ['Markdown', 'Git', 'API Documentation', 'DITA', 'Confluence', 'Swagger/OpenAPI', 'HTML/CSS', 'Docs-as-Code', 'Diagramming Tools', 'Content Management Systems', 'Style Guides', 'Version Control'],
    soft: ['Writing', 'Communication', 'Attention to Detail', 'Research', 'Organization', 'Empathy', 'Simplification']
  }
}

// Get skills for a job title (case-insensitive fuzzy match)
export function getSkillsForRole(jobTitle: string): { technical: string[]; soft: string[] } | null {
  const normalizedTitle = jobTitle.toLowerCase().trim()
  
  // Direct match
  if (skillDatabase[normalizedTitle]) {
    return skillDatabase[normalizedTitle]
  }
  
  // Partial match
  for (const [key, skills] of Object.entries(skillDatabase)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      return skills
    }
  }
  
  // Word-level match
  const words = normalizedTitle.split(/\s+/)
  for (const [key, skills] of Object.entries(skillDatabase)) {
    const keyWords = key.split(/\s+/)
    const overlap = words.filter(w => keyWords.includes(w))
    if (overlap.length >= 1 && overlap.length >= keyWords.length * 0.5) {
      return skills
    }
  }
  
  return null
}
