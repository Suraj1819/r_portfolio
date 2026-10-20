export const profile = {
  name: 'Suraj Kumar',
  shortName: 'SK',
  title: 'Full-Stack Web Developer',
  subtitle: 'Computer Science Engineering Student | Real-Time Applications | Web Engineering',
  education: {
    degree: 'B.Tech in Computer Science Engineering',
    institution: 'Government Engineering College Vaishali',
    location: 'Bihar, India',
    status: 'Final-year student (as of October 2026)',
  },
  location: 'Muzaffarpur, Bihar, India',
  email: 'suraj.kumar.dev@example.com', // Placeholder — replace with real email
  github: 'https://github.com/Suraj1819',
  linkedin: null, // Add when available
  portfolio: 'https://surajzxrt.online',
  portfolioAlt: 'https://surajzxrt.netlify.app',
  resumePath: '/resume.pdf', // Place resume.pdf in public/
  tagline: 'Building Digital Experiences That Connect People.',
  bio: "I'm Suraj Kumar, a Computer Science Engineering student and full-stack developer focused on building practical web applications, real-time experiences, and useful digital products.",
};

export const socialLinks = [
  {
    name: 'GitHub',
    href: profile.github,
    label: 'GitHub profile',
  },
  ...(profile.linkedin
    ? [{ name: 'LinkedIn', href: profile.linkedin, label: 'LinkedIn profile' }]
    : []),
];
