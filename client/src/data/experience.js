/*
  Experience data.

  NOTE: the two "learning" entries (Python for Data Science, AI / ML) use
  "Self-paced learning" as the organization and generic periods on purpose.
  Replace `organization`, `period`, `website` and the lists with the real
  institute / platform / dates / projects before publishing, so everything on
  the page stays accurate.
*/

export const experiences = [
  {
    id: 'ai-ml',
    kind: 'learning',
    organization: 'Self-paced learning',
    role: 'AI / Machine Learning',
    period: '2025–Present',
    type: 'Training & hands-on learning',
    location: 'Remote',
    summary:
      'Learning the fundamentals of machine learning and applying them in small, practical experiments: preparing data, training models, evaluating results and understanding where models fail.',
    responsibilities: [
      'Studying supervised and unsupervised learning fundamentals',
      'Building small models for classification and regression problems',
      'Splitting data, cross-validating and comparing models with proper metrics',
      'Exploring how trained models can be exposed through simple REST APIs',
      'Reading documentation and papers to understand why an approach works',
    ],
    outcomes: [
      'Working understanding of the end-to-end ML workflow',
      'Practice experiments completed in Jupyter notebooks',
    ],
    achievements: [],
    skills: [
      'Model evaluation and metrics',
      'Feature engineering basics',
      'Reading and applying library documentation',
      'Connecting ML code with web backends',
    ],
    technologies: ['Python', 'scikit-learn', 'NumPy', 'Pandas', 'Jupyter', 'TensorFlow', 'PyTorch'],
  },

  {
    id: 'python-data-science',
    kind: 'learning',
    organization: 'Self-paced learning',
    role: 'Python for Data Science',
    period: '2025',
    type: 'Training & hands-on learning',
    location: 'Remote',
    summary:
      'Hands-on study of Python for data work: cleaning raw datasets, exploring them with Pandas and NumPy, and communicating findings with clear visualisations.',
    responsibilities: [
      'Writing Python for data cleaning, transformation and analysis',
      'Exploring datasets with Pandas and NumPy',
      'Creating charts and visual summaries to explain patterns in data',
      'Working in Jupyter notebooks with reproducible, readable steps',
      'Practising exploratory data analysis on public datasets',
    ],
    outcomes: [
      'Comfortable moving from a raw CSV to a cleaned dataset and a clear chart',
      'Foundation for the machine learning work that followed',
    ],
    achievements: [],
    skills: [
      'Data cleaning and wrangling',
      'Exploratory data analysis',
      'Data visualisation',
      'Writing readable analysis notebooks',
    ],
    technologies: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Jupyter'],
  },

  {
    id: 'happylamb',
    kind: 'work',
    organization: 'HappyLamb',
    role: 'Senior Web Developer',
    period: '2025–Present',
    type: 'Production website development and maintenance',
    website: 'https://happylamb.in',
    websiteLabel: 'happylamb.in',
    summary:
      'Responsible for production website development, feature implementation, responsive UI, and ongoing maintenance for HappyLamb.',
    responsibilities: [
      'Production website development and feature delivery',
      'Responsive UI implementation and refinement',
      'Website maintenance and code maintainability',
      'Frontend and backend integration where applicable',
      'Practical delivery of production-ready changes',
    ],
    technologies: ['Web development', 'Responsive UI', 'Production maintenance'],
    outcomes: [
      'Delivered and maintained production website at happylamb.in',
    ],
    achievements: [],
    skills: [],
  },
];

export const practicalExperience = {
  title: 'Practical Engineering Experience',
  description:
    'Project-based learning through building multi-component applications: peer-to-peer file transfer (WebDrop), real-time messaging (Bambi), nearby transfer prototypes (BambiSync), and this portfolio stack (React, Express, PostgreSQL, email).',
  highlights: [
    'WebRTC DataChannels and signaling design',
    'Socket.IO real-time messaging patterns',
    'REST API design with validation and rate limiting',
    'PostgreSQL schema design and migrations',
    'Responsive, accessible UI systems',
  ],
};