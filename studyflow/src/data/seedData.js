// Realistic sample data used the first time the app loads (no backend).
// All of this becomes editable, persisted state once the app boots — see AppContext.

const iso = (daysFromToday, hour = 17) => {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString()
}

export const seedCourses = [
  { id: 'c1', name: 'Operating Systems', code: 'CS 301', color: '#635BFF', instructor: 'Dr. Nour Haddad' },
  { id: 'c2', name: 'Web Development', code: 'CS 342', color: '#22C55E', instructor: 'Dr. Layla Amin' },
  { id: 'c3', name: 'Digital Image Processing', code: 'CS 415', color: '#F59E0B', instructor: 'Dr. Omar Saleh' },
  { id: 'c4', name: 'Database Systems', code: 'CS 320', color: '#0EA5E9', instructor: 'Dr. Rana Kfoury' },
  { id: 'c5', name: 'Software Engineering', code: 'CS 360', color: '#EC4899', instructor: 'Dr. Yusuf Barakat' },
]

export const seedTasks = [
  {
    id: 't1',
    title: 'Review OS Chapter 3',
    courseId: 'c1',
    dueDate: iso(0, 18),
    priority: 'high',
    estimateMinutes: 45,
    notes: 'Focus on process scheduling algorithms — Round Robin and Priority scheduling will be on the quiz.',
    completed: false,
    completedAt: null,
  },
  {
    id: 't2',
    title: 'Complete React Assignment',
    courseId: 'c2',
    dueDate: iso(1, 23),
    priority: 'medium',
    estimateMinutes: 90,
    notes: 'Build the product filtering UI from the assignment brief. Use controlled components.',
    completed: false,
    completedAt: null,
  },
  {
    id: 't3',
    title: 'Database Assignment 2',
    courseId: 'c4',
    dueDate: iso(2, 23),
    priority: 'high',
    estimateMinutes: 60,
    notes: 'Normalize the schema to 3NF and submit the ER diagram.',
    completed: false,
    completedAt: null,
  },
  {
    id: 't4',
    title: 'Image Processing Quiz Prep',
    courseId: 'c3',
    dueDate: iso(4, 12),
    priority: 'medium',
    estimateMinutes: 40,
    notes: 'Review histogram equalization and spatial filtering.',
    completed: false,
    completedAt: null,
  },
  {
    id: 't5',
    title: 'Software Engineering Report',
    courseId: 'c5',
    dueDate: iso(6, 23),
    priority: 'low',
    estimateMinutes: 75,
    notes: 'Draft the requirements section for the group project.',
    completed: false,
    completedAt: null,
  },
  {
    id: 't6',
    title: 'OS Lab 4 — Threads',
    courseId: 'c1',
    dueDate: iso(-1, 18),
    priority: 'high',
    estimateMinutes: 50,
    notes: 'Implement producer-consumer with mutex locks.',
    completed: true,
    completedAt: iso(-1, 16),
  },
  {
    id: 't7',
    title: 'Read Web Dev Ch. 7 — Forms',
    courseId: 'c2',
    dueDate: iso(-2, 20),
    priority: 'low',
    estimateMinutes: 30,
    completed: true,
    completedAt: iso(-2, 19),
  },
  {
    id: 't8',
    title: 'ERD Practice Set',
    courseId: 'c4',
    dueDate: iso(0, 20),
    priority: 'medium',
    estimateMinutes: 35,
    completed: true,
    completedAt: iso(0, 10),
  },
]

export const seedStudySessions = [
  { id: 's1', courseId: 'c1', taskId: 't1', topic: 'Process Scheduling', durationMinutes: 25, date: iso(-1, 19) },
  { id: 's2', courseId: 'c2', taskId: 't2', topic: 'React Component Structure', durationMinutes: 50, date: iso(-1, 21) },
  { id: 's3', courseId: 'c4', taskId: 't3', topic: 'Schema Normalization', durationMinutes: 25, date: iso(-2, 17) },
  { id: 's4', courseId: 'c1', taskId: null, topic: 'Deadlock Review', durationMinutes: 25, date: iso(-3, 20) },
  { id: 's5', courseId: 'c5', taskId: 't5', topic: 'Requirements Draft', durationMinutes: 45, date: iso(-4, 15) },
]

export const defaultProfile = {
  name: 'Raghad',
  role: 'Computer Science Student',
  avatarSeed: 'raghad',
  notifications: true,
  appearance: 'light',
  language: 'English',
}
