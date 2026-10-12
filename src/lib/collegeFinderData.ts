import type { SelectGroup } from '../components/Field'

export const MAJOR_GROUPS: SelectGroup[] = [
  {
    label: 'Ultra-Competitive (+125 pts)',
    options: [
      { value: 'computer-science', label: 'Computer Science' },
      { value: 'cs-ai', label: 'CS – Artificial Intelligence' },
      { value: 'cs-machine-learning', label: 'CS – Machine Learning' },
      { value: 'nursing', label: 'Nursing' },
    ],
  },
  {
    label: 'Highly Competitive (+85 pts)',
    options: [
      { value: 'electrical-engineering', label: 'Electrical Engineering' },
      { value: 'mechanical-engineering', label: 'Mechanical Engineering' },
      { value: 'chemical-engineering', label: 'Chemical Engineering' },
      { value: 'civil-engineering', label: 'Civil Engineering' },
      { value: 'biomedical-engineering', label: 'Biomedical Engineering' },
      { value: 'biology', label: 'Biology' },
      { value: 'biochemistry', label: 'Biochemistry' },
      { value: 'business', label: 'Business' },
      { value: 'finance', label: 'Finance' },
    ],
  },
  {
    label: 'Competitive (+35 pts)',
    options: [
      { value: 'economics', label: 'Economics' },
      { value: 'architecture', label: 'Architecture' },
      { value: 'cognitive-science', label: 'Cognitive Science' },
      { value: 'cognitive-science-ai-track', label: 'Cognitive Science – AI Track' },
      { value: 'environmental-science', label: 'Environmental Science' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'accounting', label: 'Accounting' },
      { value: 'film', label: 'Film' },
    ],
  },
  {
    label: 'Standard (no adjustment)',
    options: [
      { value: 'liberal-arts', label: 'Liberal Arts' },
      { value: 'education', label: 'Education' },
      { value: 'social-sciences', label: 'Social Sciences' },
      { value: 'history', label: 'History' },
      { value: 'english', label: 'English' },
      { value: 'communications', label: 'Communications' },
      { value: 'political-science', label: 'Political Science' },
      { value: 'philosophy', label: 'Philosophy' },
      { value: 'art', label: 'Art' },
      { value: 'music', label: 'Music' },
    ],
  },
]

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
]
