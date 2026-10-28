
export const profile = {
  name: "Suraj Kumar",
  shortName: "SK",
  title: "Full-Stack Web Developer",

  subtitle:
    "Computer Science Engineering Student | Real-Time Applications | Web Engineering",

  education: {
    degree: "B.Tech in Computer Science Engineering",
    institution: "Government Engineering College Vaishali",
    location: "Bihar, India",
    status: "Final-year student (as of October 2026)",
  },

  location: "Muzaffarpur, Bihar, India",

  // Replace this placeholder with your actual email.
  email: "surajkumarraj8888@gmail.com",

  github: "https://github.com/Suraj1819",
  linkedin: null,

  portfolio: "https://suraj-omega.vercel.app",
  portfolioAlt: "https://surajzxrt.netlify.app",

  // Place resume.pdf inside the public/ folder.
  resumePath: "/resume.pdf",

  tagline: "Building Digital Experiences That Connect People.",

  bio: "I'm Suraj Kumar, a Computer Science Engineering student and full-stack developer focused on building practical web applications, real-time experiences, and useful digital products.",

  focusAreas: [
    "Full-Stack Development",
    "Real-Time Applications",
    "Computer Networks",
    "Peer-to-Peer Systems",
  ],

  stats: [
    { value: "300+", label: "DSA problems" },
    { value: "100", label: "Day LeetCode streak" },
    { value: "4", label: "Core projects" },
  ],

  skills: {
    languages: ["C++", "JavaScript", "Python", "SQL"],

    frontend: [
      "HTML5",
      "CSS3",
      "React",
      "Vite",
      "Tailwind CSS",
    ],

    backend: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Socket.IO",
    ],

    databases: [
      "PostgreSQL",
      "MongoDB",
      "Supabase",
    ],

    networking: [
      "WebRTC",
      "DataChannels",
      "STUN",
      "Socket.IO signaling",
    ],

    tools: [
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
      "npm",
    ],

    deployment: [
      "Vercel",
      "Render",
      "Plesk",
      "Environment configuration",
    ],

    coreCS: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],
  },

  projects: [
    {
      id: "webdrop",
      name: "WebDrop",
      description:
        "Browser-based peer-to-peer file sharing using WebRTC DataChannels and Socket.IO signaling.",
      status: "Completed",
      github: "https://github.com/Suraj1819/web-drop",
      live: "https://webdrop-eight.vercel.app",
      stack: [
        "React",
        "Vite",
        "Node.js",
        "Socket.IO",
        "WebRTC",
      ],
    },

    {
      id: "bambi",
      name: "Bambi",
      description:
        "A real-time messaging application with a responsive chat interface and backend event handling.",
      status: "In progress",
      github: null,
      live: null,
      stack: [
        "React",
        "Node.js",
        "Socket.IO",
        "PostgreSQL",
      ],
    },

    {
      id: "bambisync",
      name: "BambiSync",
      description:
        "A nearby-transfer prototype for sharing content between devices.",
      status: "Prototype",
      github: null,
      live: null,
      stack: [
        "React",
        "Desktop development",
        "Device communication",
      ],
    },

    {
      id: "portfolio",
      name: "Developer Portfolio",
      description:
        "A multi-page portfolio showcasing projects, skills, experience, and contact information.",
      status: "Live",
      github: "https://github.com/Suraj1819",
      live: "https://suraj-omega.vercel.app",
      stack: [
        "React",
        "Vite",
        "Tailwind CSS",
        "Express",
        "PostgreSQL",
      ],
    },
  ],

  experience: [
    {
      id: "utc",
      role: "Web Development Intern",
      company: "UTC",
      period: "Internship",
      location: "Remote",
      description:
        "Gained practical experience in web development, implementation, debugging, and collaborative workflows.",
    },

    {
      id: "happylamb",
      role: "Senior Web Developer",
      company: "HappyLamb",
      period: "2025–Present",
      location: "Remote",
      description:
        "Working on a production website, responsive interfaces, feature delivery, and ongoing website maintenance.",
      website: "https://happylamb.in",
    },
  ],

  achievements: [
    "LeetCode 100 Days Streak",
    "300+ DSA problems across LeetCode and GeeksforGeeks",
    "learnX Python certificate",
    "Cisco Networking Essentials",
    "Python workshop participation",
  ],

  interests: [
    "Full-Stack Web Development",
    "Real-Time Applications",
    "Computer Networks",
    "Peer-to-Peer Communication",
    "UI Engineering",
    "Problem-Solving",
    "Data Structures & Algorithms",
    "Software Architecture",
  ],

  hobbies: [
    "Video games",
    "Technology reading",
    "Music while coding",
    "UI observation",
  ],

  languages: [
    {
      name: "Hindi",
      level: "Native / bilingual",
    },
    {
      name: "English",
      level: "Professional working proficiency",
    },
  ],

  learningGoals: [
    "TypeScript",
    "Next.js",
    "Advanced React patterns",
    "System design basics",
    "Application security",
    "Testing practices",
    "WebRTC fundamentals",
    "Backend reliability",
  ],
};

export const socialLinks = [
  {
    name: "GitHub",
    href: profile.github,
    label: "GitHub profile",
  },

  ...(profile.linkedin
    ? [
        {
          name: "LinkedIn",
          href: profile.linkedin,
          label: "LinkedIn profile",
        },
      ]
    : []),
];
