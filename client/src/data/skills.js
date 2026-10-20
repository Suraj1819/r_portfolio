export const skillCategories = [
  {
    id: 'languages',
    name: 'Programming Languages',
    description:
      'Languages I use for programming, scripting and problem-solving across academics and projects.',
    skills: [
      { name: 'C++', level: 'Used in Projects', related: [] },
      {
        name: 'JavaScript',
        level: 'Used in Projects',
        related: ['webdrop', 'bambi', 'portfolio'],
        featured: true,
      },
      { name: 'Python', level: 'Working Knowledge', related: [] },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    description:
      'Responsive interfaces, reusable components, theme systems and accessible user experiences.',
    skills: [
      { name: 'HTML5', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'] },
      { name: 'CSS3', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'] },
      { name: 'React', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'], featured: true },
      { name: 'Vite', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'] },
      { name: 'Tailwind CSS', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'] },
      { name: 'Responsive layouts', level: 'Used in Projects', related: ['webdrop', 'portfolio'] },
      { name: 'Component-based development', level: 'Used in Projects', related: ['portfolio'] },
      { name: 'Theme systems', level: 'Used in Projects', related: ['portfolio'] },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description:
      'APIs, server-side logic, real-time application functionality and request validation.',
    skills: [
      { name: 'Node.js', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'], featured: true },
      { name: 'Express.js', level: 'Used in Projects', related: ['webdrop', 'bambi', 'portfolio'] },
      { name: 'REST APIs', level: 'Used in Projects', related: ['bambi', 'portfolio'] },
      { name: 'Socket.IO', level: 'Used in Projects', related: ['webdrop', 'bambi'] },
      { name: 'Request validation', level: 'Used in Projects', related: ['portfolio'] },
      { name: 'API integration', level: 'Working Knowledge', related: [] },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Data modelling, queries and persistence for messaging and contact workflows.',
    skills: [
      { name: 'PostgreSQL', level: 'Used in Projects', related: ['bambi', 'portfolio'], featured: true },
      { name: 'MongoDB', level: 'Familiar', related: [] },
      { name: 'Supabase', level: 'Working Knowledge', related: ['bambi'] },
    ],
  },
  {
    id: 'realtime',
    name: 'Real-Time & Network',
    description:
      'Peer-to-peer communication, signaling, data channels and connection lifecycle management.',
    skills: [
      { name: 'WebRTC', level: 'Used in Projects', related: ['webdrop'], featured: true },
      { name: 'WebRTC DataChannels', level: 'Used in Projects', related: ['webdrop'] },
      { name: 'Socket.IO signaling', level: 'Used in Projects', related: ['webdrop', 'bambi'] },
      { name: 'STUN servers', level: 'Used in Projects', related: ['webdrop'] },
      { name: 'Peer-to-peer communication', level: 'Used in Projects', related: ['webdrop'] },
      { name: 'Client-server architecture', level: 'Used in Projects', related: ['webdrop', 'bambi'] },
      { name: 'Connection lifecycle management', level: 'Used in Projects', related: ['webdrop'] },
    ],
  },
  {
    id: 'tools',
    name: 'Developer Tools & Deployment',
    description:
      'Tools used for development, debugging, version control and production deployment.',
    skills: [
      { name: 'Git', level: 'Used in Projects', related: [] },
      { name: 'GitHub', level: 'Used in Projects', related: [] },
      { name: 'Visual Studio Code', level: 'Used in Projects', related: [] },
      { name: 'Postman', level: 'Working Knowledge', related: [] },
      { name: 'Vercel', level: 'Used in Projects', related: ['webdrop', 'portfolio'] },
      { name: 'Render', level: 'Used in Projects', related: ['webdrop'] },
      { name: 'Plesk', level: 'Familiar', related: [] },
    ],
  },
  {
    id: 'ui',
    name: 'UI Libraries',
    description: 'Component libraries and routing tools used across projects.',
    skills: [
      { name: 'lucide-react', level: 'Used in Projects', related: ['bambi', 'portfolio'] },
      { name: 'shadcn/ui', level: 'Familiar', related: [] },
      { name: 'TanStack Router', level: 'Familiar', related: [] },
    ],
  },
];

export const learningRoadmap = [
  {
    topic: 'TypeScript',
    status: 'Currently Learning',
    description: 'Stronger contracts across the stack — types for API payloads, props and shared state.',
  },
  {
    topic: 'Next.js',
    status: 'Currently Learning',
    description: 'Server-aware React, production routing, and data-fetching patterns.',
  },
  {
    topic: 'Advanced React architecture',
    status: 'Currently Learning',
    description: 'Cleaner state, composition, and patterns for larger applications.',
  },
  {
    topic: 'Software engineering practices',
    status: 'Currently Learning',
    description: 'Testing, CI basics, code review habits and maintainable project structures.',
  },
];

// Ordered list of proficiency levels (best → weakest).
// Skills without a `level` are treated as "Working Knowledge" by default.
export const proficiencyLevels = [
  'Used in Projects',
  'Working Knowledge',
  'Familiar',
  'Currently Learning',
];

// Percentage mapping for the visual progress bar.
// These are deliberately honest — not inflated to look impressive.
export const proficiencyPercent = {
  'Used in Projects': 88,
  'Working Knowledge': 65,
  Familiar: 40,
  'Currently Learning': 25,
};