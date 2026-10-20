import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Book,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Gamepad2,
  Github,
  Globe,
  GraduationCap,
  Layers3,
  Laptop,
  MapPin,
  MonitorSmartphone,
  Music,
  Network,
  Palette,
  Quote,
  Rocket,
  School,
  Server,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  Cloud,
  GitBranch,
  Workflow,
  ShieldCheck,
  FileCode2,
  Bug,
  Lightbulb,
  LayoutDashboard,
  Eye,
  RefreshCw,
  MessageSquare,
  Wrench,
  Users,
  Compass,
  Home as HomeIcon,
  ChevronRight,
  Zap,
} from "lucide-react";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  PROFILE                                                            */
/* ------------------------------------------------------------------ */

const identity = {
  name: profile.name || "Suraj Kumar",
  role: profile.title || "Full-Stack Web Developer",
  education:
    profile.education?.degree || "B.Tech in Computer Science Engineering",
  college:
    profile.education?.institution ||
    "Government Engineering College Vaishali",
  location: profile.location || "Muzaffarpur, Bihar, India",
  resumePath: profile.resumePath || "/resume.pdf",
  github: profile.github || "https://github.com/Suraj1819",
  photo: profile.photo || "/profile.jpg",
};

/* ------------------------------------------------------------------ */
/*  Shared helpers (matching Home.jsx / Projects.jsx)                   */
/* ------------------------------------------------------------------ */

function statusTone(status) {
  const s = String(status ?? "").toLowerCase().trim();
  if (/(complete|done|live|deployed)/.test(s)) return "done";
  if (/(progress|ongoing|building|wip)/.test(s)) return "progress";
  if (/(prototype|experimental|exploratory)/.test(s)) return "prototype";
  return "other";
}

const STATUS_STYLES = {
  done: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20",
  progress:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/20",
  prototype:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-400/20",
  other:
    "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-white/[0.04] dark:text-neutral-400 dark:border-white/10",
};

const STATUS_ICONS = {
  done: CheckCircle2,
  progress: Clock,
  prototype: Sparkles,
  other: BookOpen,
};

function StatusBadge({ status }) {
  if (!status) return null;
  const tone = statusTone(status);
  const Icon = STATUS_ICONS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        STATUS_STYLES[tone]
      )}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  STATS                                                              */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "300+", label: "DSA problems practiced" },
  { value: "100", label: "Day LeetCode streak" },
  { value: "4", label: "Core projects shipped" },
  { value: "Final year", label: "CSE · GEC Vaishali" },
];

/* ------------------------------------------------------------------ */
/*  TIMELINE — chronological (oldest → newest)                         */
/* ------------------------------------------------------------------ */

const timelineData = [
  {
    id: "class-10",
    type: "education",
    title: "Secondary School (Class 10)",
    organization: "Board of Secondary Education",
    location: "Bihar, India",
    period: "Completed",
    year: "Class 10",
    description:
      "Completed secondary education with a focus on science and mathematics. Built early habits around logical reasoning and consistent study that later supported programming and engineering coursework.",
    icon: School,
    tag: "Class 10",
    highlights: ["Science foundation", "Mathematics", "Logical reasoning"],
  },
  {
    id: "class-12",
    type: "education",
    title: "Higher Secondary (Class 12)",
    organization: "Intermediate / Higher Secondary Board",
    location: "Bihar, India",
    period: "Completed",
    year: "Class 12",
    description:
      "Completed higher secondary education in the science stream. Strengthened physics and mathematics foundations and developed interest in computers and problem-solving that led toward Computer Science Engineering.",
    icon: School,
    tag: "Class 12",
    highlights: ["Science stream", "Physics & mathematics", "Path toward CSE"],
  },
  {
    id: "college",
    type: "education",
    title: identity.education,
    organization: identity.college,
    location: "Vaishali / Muzaffarpur region, Bihar",
    period: "Final year as of October 2026",
    year: "B.Tech",
    description:
      "Pursuing B.Tech in Computer Science Engineering. Coursework covers programming, data structures, algorithms, OOP, databases, operating systems, and computer networks. Alongside academics: consistent DSA practice and multi-component web applications.",
    icon: GraduationCap,
    tag: "Undergraduate",
    highlights: [
      "Core CS curriculum",
      "DSA practice",
      "Web technologies",
      "Computer networks",
    ],
  },
  {
    id: "internship",
    type: "experience",
    title: "Web Development Intern",
    organization: "UTC",
    location: "Remote",
    period: "Internship",
    year: "Internship",
    description:
      "Gained professional exposure to web development workflows. Worked on implementation, debugging, and understanding delivery processes in a team setting. Strengthened practical frontend and integration skills beyond classroom projects.",
    icon: BriefcaseBusiness,
    tag: "Internship",
    highlights: [
      "Team collaboration",
      "Implementation practice",
      "Delivery workflow",
    ],
  },
  {
    id: "happylamb",
    type: "experience",
    title: "Web Developer",
    organization: "HappyLamb",
    location: "Remote · Production site",
    period: "2025 – Present",
    year: "2025+",
    description:
      "Contributing to development and maintenance of the HappyLamb production website. Responsibilities include feature work, responsive UI, maintainability, and practical delivery on a live product — without inventing traffic or revenue metrics.",
    icon: Globe,
    tag: "Production",
    link: "https://happylamb.in",
    highlights: [
      "Production website",
      "Responsive UI",
      "Feature delivery",
      "Ongoing maintenance",
    ],
  },
  {
    id: "projects",
    type: "experience",
    title: "Independent full-stack projects",
    organization: "Personal engineering",
    location: "Self-directed",
    period: "Ongoing",
    year: "Projects",
    description:
      "WebDrop (WebRTC file transfer), Bambi (real-time messaging — in progress), BambiSync (nearby transfer prototype), and this portfolio (React, Express, PostgreSQL, contact API). Case studies document architecture, limits, and honest feature status.",
    icon: Rocket,
    tag: "Projects",
    highlights: [
      "WebRTC & signaling",
      "Socket.IO messaging",
      "Contact API + database",
      "Case study writing",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SKILLS                                                             */
/* ------------------------------------------------------------------ */

const technicalSkills = [
  {
    title: "Programming languages",
    icon: Terminal,
    skills: ["C++", "JavaScript", "Python", "SQL"],
    description:
      "C++ for DSA, JavaScript for application logic, Python for scripting, SQL for relational data.",
  },
  {
    title: "Frontend development",
    icon: MonitorSmartphone,
    skills: ["HTML5", "CSS3", "React", "Vite", "Tailwind CSS"],
    description:
      "Component-driven UIs, responsive layouts, theme systems, and client-side routing.",
  },
  {
    title: "Backend development",
    icon: Server,
    skills: ["Node.js", "Express.js", "REST APIs", "Socket.IO"],
    description:
      "API design, validation, real-time events, and predictable server-side flows.",
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "Supabase"],
    description:
      "Schema design, queries, and persistence for messaging and contact workflows.",
  },
  {
    title: "Networking & real-time",
    icon: Network,
    skills: ["WebRTC", "DataChannels", "STUN", "Socket.IO signaling"],
    description:
      "Peer discovery, connection negotiation, chunked transfer, and browser P2P limits.",
  },
  {
    title: "Developer tools",
    icon: GitBranch,
    skills: ["Git", "GitHub", "VS Code", "Postman", "npm"],
    description: "Version control, API testing, and day-to-day development workflow.",
  },
  {
    title: "Deployment",
    icon: Cloud,
    skills: ["Vercel", "Render", "Plesk", "Environment config"],
    description:
      "Frontend and backend hosting, environment separation, production troubleshooting.",
  },
  {
    title: "Core computer science",
    icon: Cpu,
    skills: ["DSA", "OOP", "DBMS", "OS", "Computer Networks"],
    description:
      "Foundations that shape how I structure code and reason about systems.",
  },
];

/* ------------------------------------------------------------------ */
/*  PROJECTS                                                           */
/* ------------------------------------------------------------------ */

const featuredProjects = [
  {
    name: "WebDrop",
    category: "Networks · Peer-to-peer file transfer",
    icon: Network,
    status: "Completed",
    description:
      "Browser-based file sharing with room codes or QR pairing. Signaling on Node.js + Socket.IO; file bytes over WebRTC DataChannels when a connection can be established.",
    features: [
      "Room codes and QR pairing",
      "Max two devices per room",
      "Chunked transfer with backpressure",
      "Connection and transfer status UI",
    ],
    stack: ["React", "Vite", "Node.js", "Socket.IO", "WebRTC"],
    link: "https://github.com/Suraj1819/web-drop",
    live: "https://webdrop-eight.vercel.app",
  },
  {
    name: "Bambi",
    category: "Full-stack · Real-time messaging",
    icon: MessageSquare,
    status: "In progress",
    description:
      "Messaging app with responsive chat UI and real-time events. Features marked Completed, In Progress, or Planned — no claims of calls or E2E encryption until implemented.",
    features: [
      "React chat interface",
      "Express + Socket.IO layer",
      "PostgreSQL / Supabase",
      "Presence and delivery (in progress)",
    ],
    stack: ["React", "Node.js", "Socket.IO", "PostgreSQL"],
    link: "",
    live: "",
  },
  {
    name: "Developer portfolio",
    category: "Full-stack · Personal site",
    icon: Laptop,
    status: "Live",
    description:
      "Multi-page portfolio with theme system, project case studies, and a contact form backed by validation, rate limiting, and PostgreSQL.",
    features: [
      "React Router multi-page app",
      "Light / dark theme",
      "Project case studies",
      "Secure contact API",
    ],
    stack: ["React", "Vite", "Express", "PostgreSQL"],
    link: identity.github,
    live: profile.portfolio || "https://surajzxrt.online",
  },
];

/* ------------------------------------------------------------------ */
/*  PRINCIPLES / PROCESS / OTHER                                       */
/* ------------------------------------------------------------------ */

const principles = [
  {
    title: "Clear architecture",
    icon: Layers3,
    text: "Separate responsibilities and keep data flow understandable.",
  },
  {
    title: "Reusable components",
    icon: Workflow,
    text: "Compose UI and logic without unnecessary coupling.",
  },
  {
    title: "Accessible interfaces",
    icon: ShieldCheck,
    text: "Labels, focus states, keyboard paths, and readable contrast.",
  },
  {
    title: "Honest feature status",
    icon: CheckCircle2,
    text: "Completed, In Progress, or Planned — no inflated claims.",
  },
  {
    title: "Maintainable code",
    icon: FileCode2,
    text: "Clarity over cleverness; structure that supports change.",
  },
  {
    title: "Practical testing",
    icon: Bug,
    text: "Critical paths, empty states, and failure modes before “done”.",
  },
];

const workStyle = [
  {
    title: "Start from the problem",
    icon: Lightbulb,
    text: "Clarify users and failure modes before picking libraries.",
  },
  {
    title: "Thin vertical slices",
    icon: LayoutDashboard,
    text: "Ship an end-to-end path early, then harden edges.",
  },
  {
    title: "Document honestly",
    icon: Eye,
    text: "Write what works, what is partial, and what is planned.",
  },
  {
    title: "Iterate on reality",
    icon: RefreshCw,
    text: "Connection failures, mobile layout, and empty states matter.",
  },
];

const softSkills = [
  {
    title: "Clear written updates",
    icon: MessageSquare,
    text: "Structured notes on blockers, decisions, and next steps.",
  },
  {
    title: "Ownership of bugs",
    icon: Wrench,
    text: "Reproduce, isolate, fix, and note the root cause.",
  },
  {
    title: "Learning in public",
    icon: Users,
    text: "Projects and write-ups as a record of growth.",
  },
  {
    title: "Respect for constraints",
    icon: Compass,
    text: "Time, networks, and browsers shape design — not only diagrams.",
  },
];

const certifications = [
  {
    title: "LeetCode 100 Days Streak",
    description: "Consistency in problem-solving practice.",
    icon: Trophy,
  },
  {
    title: "300+ DSA problems",
    description: "Practice across LeetCode and GeeksforGeeks.",
    icon: Code2,
  },
  {
    title: "learnX Python certificate",
    description: "Structured Python learning credential.",
    icon: Award,
  },
  {
    title: "Cisco Networking Essentials",
    description: "Foundational networking coursework.",
    icon: Network,
  },
  {
    title: "Python workshops",
    description: "Workshop participation for language fundamentals.",
    icon: BookOpen,
  },
];

const learningGoals = [
  { topic: "TypeScript", why: "Stronger contracts across the stack." },
  { topic: "Next.js", why: "Server-aware React and production routing." },
  { topic: "Advanced React patterns", why: "Cleaner state and composition." },
  {
    topic: "System design basics",
    why: "Better choices for real-time systems.",
  },
  {
    topic: "Application security",
    why: "Safer validation and production habits.",
  },
  { topic: "Testing practices", why: "Regression safety for APIs and UI." },
  { topic: "WebRTC depth", why: "TURN, reliability, harder networks." },
  { topic: "Backend reliability", why: "Retries, queues, honest failures." },
];

const hobbies = [
  {
    title: "Video games",
    icon: Gamepad2,
    description: "Interactive systems and storytelling outside the editor.",
  },
  {
    title: "Tech reading",
    icon: Book,
    description: "Docs and articles on web platforms and networking.",
  },
  {
    title: "Music while coding",
    icon: Music,
    description: "Lo-fi and instrumental tracks during long sessions.",
  },
  {
    title: "UI observation",
    icon: Palette,
    description: "How spacing and hierarchy affect everyday products.",
  },
];

const languages = [
  { name: "Hindi", level: "Native / bilingual", percent: 100 },
  { name: "English", level: "Professional working proficiency", percent: 85 },
];

const interests = [
  "Full-stack web development",
  "Real-time applications",
  "Computer networks",
  "Peer-to-peer communication",
  "UI engineering",
  "Problem-solving",
  "Data structures & algorithms",
  "Software architecture",
];

const quotes = [
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
];

const techMarquee = [
  "React",
  "Node.js",
  "Express",
  "Socket.IO",
  "PostgreSQL",
  "MongoDB",
  "WebRTC",
  "Tailwind CSS",
  "Vite",
  "Git",
  "Vercel",
  "Render",
];

/* ------------------------------------------------------------------ */
/*  UI PRIMITIVES (matching Home.jsx style)                            */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

function Eyebrow({ children }) {
  return <SectionLabel>{children}</SectionLabel>;
}

function IconBox({ icon: Icon, className = "" }) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100",
        className
      )}
    >
      <Icon size={20} strokeWidth={1.6} />
    </div>
  );
}

function PrimaryLink({ to, href, download, children, className = "" }) {
  const cls = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
    className
  );
  if (href) {
    return (
      <a href={href} download={download || undefined} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

function SecondaryLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]",
        className
      )}
    >
      {children}
    </Link>
  );
}

function TechnologyTags({ technologies = [], limit }) {
  if (!Array.isArray(technologies) || technologies.length === 0) return null;
  const visibleTechnologies =
    typeof limit === "number" ? technologies.slice(0, limit) : technologies;
  return (
    <div className="flex flex-wrap gap-2">
      {visibleTechnologies.map((technology, index) => {
        const name =
          typeof technology === "string"
            ? technology
            : technology?.name ?? technology?.title ?? technology?.label;
        if (!name) return null;
        return (
          <span
            key={`${name}-${index}`}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400"
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function About() {
  useEffect(() => {
    document.title = "About — Suraj Kumar";
    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-14 sm:pt-8 lg:px-12 lg:pb-16 lg:pt-10">
          {/* Breadcrumb */}
          <nav className="mb-10 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">About</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <Sparkles size={14} />
                About me
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.045em] text-neutral-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Building useful products through
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  code, curiosity &amp; consistency.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base sm:leading-8">
                I am {identity.name}, a Computer Science Engineering student at{" "}
                {identity.college}. I focus on full-stack web development,
                real-time applications, computer networks, and peer-to-peer
                systems.
              </p>

              <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
                I like taking an idea from structure to a working application —
                interface, API, state, database, and deployment — and
                understanding how it behaves when connections fail or inputs
                are messy.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PrimaryLink href={identity.resumePath} download>
                  <Download size={16} />
                  Download resume
                </PrimaryLink>
                <SecondaryLink to="/projects">
                  Explore projects <ArrowRight size={16} />
                </SecondaryLink>
              </div>

              <div className="mt-5">
                <TechnologyTags
                  technologies={[
                    "React",
                    "Node.js",
                    "WebRTC",
                    "PostgreSQL",
                    "Socket.IO",
                  ]}
                />
              </div>
            </div>

            {/* Profile card */}
            <div className="relative z-10 mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025]">
                {/* Photo + identity */}
                <div className="flex flex-col items-center gap-3 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100 dark:border-white/15 dark:bg-white/[0.06] sm:h-28 sm:w-28">
                    <img
                      src={identity.photo}
                      alt={`${identity.name} profile`}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fb = e.currentTarget.nextElementSibling;
                        if (fb) fb.classList.remove("hidden");
                      }}
                    />
                    <div
                      className="hidden absolute inset-0 flex items-center justify-center bg-neutral-200 text-2xl font-semibold tracking-tight text-neutral-600 dark:bg-white/[0.08] dark:text-neutral-300"
                      aria-hidden="true"
                    >
                      {identity.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                      {identity.name}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {identity.role}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin size={12} className="shrink-0" />
                      {identity.location}
                    </p>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="border-t border-neutral-200 dark:border-white/10">
                  {[
                    {
                      icon: GraduationCap,
                      label: "Education",
                      value: "B.Tech CSE · Final year",
                    },
                    {
                      icon: Code2,
                      label: "Focus",
                      value: "React, Node.js, real-time & P2P",
                    },
                    {
                      icon: Network,
                      label: "Interest",
                      value: "WebRTC · Socket.IO · Networks",
                    },
                  ].map((row, i, arr) => (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3.5 sm:px-6",
                        i < arr.length - 1 &&
                          "border-b border-neutral-100 dark:border-white/[0.06]"
                      )}
                    >
                      <row.icon
                        size={16}
                        className="mt-0.5 shrink-0 text-neutral-400"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                          {row.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 border-t border-neutral-200 dark:border-white/10">
                  {stats.map(({ value, label }, i) => (
                    <div
                      key={label}
                      className={cn(
                        "px-4 py-3 sm:px-5 sm:py-4",
                        i % 2 === 1 &&
                          "border-l border-neutral-200 dark:border-white/10",
                        i < 2 &&
                          "border-b border-neutral-200 dark:border-white/10"
                      )}
                    >
                      <p className="text-xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                        {value}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 bg-neutral-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.02] sm:px-5">
                  <a
                    href={identity.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                  >
                    <Github size={13} />
                    GitHub
                  </a>
                  <a
                    href={identity.resumePath}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                  >
                    <Download size={13} />
                    Resume
                  </a>
                  <Link
                    to="/contact"
                    className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    Contact <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TECH MARQUEE                                              */}
      {/* ============================================================ */}
      <section className="overflow-hidden border-b border-neutral-200/80 bg-white/60 py-6 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-12">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            Core Stack
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            {techMarquee.map((tech) => (
              <span
                key={tech}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TIMELINE                                                  */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Path</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Education &amp; experience timeline
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
              From secondary school through higher secondary, undergraduate
              study, internship, production work, and independent projects —
              in order.
            </p>
          </Reveal>

          <div className="relative mt-12 ml-3 border-l-2 border-neutral-200 dark:border-white/10 sm:ml-4">
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              const isEducation = item.type === "education";
              return (
                <Reveal key={item.id} delay={index * 50}>
                  <div className="relative mb-12 pl-8 last:mb-0 sm:pl-12">
                    <span className="absolute -left-[22px] top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-200 bg-white text-neutral-700 shadow-sm dark:border-white/20 dark:bg-[#111112] dark:text-neutral-300 sm:-left-[26px] sm:h-12 sm:w-12">
                      <Icon size={18} className="sm:hidden" />
                      <Icon size={20} className="hidden sm:block" />
                    </span>

                    <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 transition hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-7">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                              isEducation
                                ? "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-white/10 dark:bg-white/[0.07] dark:text-neutral-300"
                                : "border-neutral-300 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                            )}
                          >
                            {item.tag}
                          </span>
                          <span className="text-[11px] tabular-nums text-neutral-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          <Calendar size={13} />
                          {item.period}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                        {item.title}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Building2 size={14} />
                          {item.organization}
                        </span>
                        {item.location ? (
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <MapPin size={13} />
                            {item.location}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                        {item.description}
                      </p>

                      {item.highlights?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.highlights.map((h) => (
                            <span
                              key={h}
                              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                            >
                              <Check size={11} />
                              {h}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/[0.06]"
                        >
                          Visit website <ArrowUpRight size={14} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TECHNICAL SKILLS                                          */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Toolkit</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Technologies I work with
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
              Organised by discipline. Labels reflect real project and
              coursework use — not arbitrary percentage bars.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technicalSkills.map((item, index) => (
              <Reveal key={item.title} delay={index * 40}>
                <div className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <IconBox icon={item.icon} />
                    <ArrowDownRight
                      size={17}
                      className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600 dark:border-white/10 dark:text-neutral-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-7">
              <IconBox icon={Sparkles} />
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Primary stack
                </h3>
                <p className="mt-2 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                  React and Vite on the client; Tailwind for layout; Node.js
                  and Express for APIs; Socket.IO for real-time events;
                  PostgreSQL for structured data; WebRTC when the problem
                  needs peer-to-peer transfer rather than pure client-server
                  upload.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROJECTS                                                  */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Selected work</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
                  Ideas turned into systems
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                  Summaries only — full case studies live on the Projects
                  pages.
                </p>
              </div>
              <Link
                to="/projects"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                All projects <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {featuredProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <Reveal key={project.name} delay={index * 50}>
                  <article className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-7">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <IconBox icon={Icon} />
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {project.category}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                      {project.description}
                    </p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {project.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-neutral-400"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3 border-t border-neutral-200/80 pt-4 dark:border-white/[0.08]">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                        >
                          <Github size={14} />
                          Source <ExternalLink size={12} />
                        </a>
                      ) : null}
                      {project.live ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          <Globe size={14} />
                          Live <ExternalLink size={12} />
                        </a>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ACHIEVEMENTS                                              */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Milestones</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Consistency &amp; learning
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
              Practice streaks and coursework — no invented rankings or scores.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <div className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <IconBox icon={item.icon} />
                    <Trophy
                      size={16}
                      className="text-neutral-300 transition group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. PRINCIPLES                                                */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Values</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Principles behind the work
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 40}>
                <div className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <IconBox icon={item.icon} />
                    <ArrowUpRight
                      size={17}
                      className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. PROCESS + COLLABORATION                                   */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <Reveal>
                <SectionLabel>Process</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
                  How I approach a build
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {workStyle.map((item, index) => (
                  <Reveal key={item.title} delay={index * 50}>
                    <div className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                      <div className="mb-4">
                        <IconBox icon={item.icon} />
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal>
                <SectionLabel>Collaboration</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
                  Working with others
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {softSkills.map((item, index) => (
                  <Reveal key={item.title} delay={index * 50}>
                    <div className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                      <div className="mb-4">
                        <IconBox icon={item.icon} />
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. INTERESTS + HOBBIES + LANGUAGES                           */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Focus</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Interests
            </h2>
          </Reveal>
          <Reveal delay={40}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {interests.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-300 dark:hover:border-white/25"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <SectionLabel>Beyond code</SectionLabel>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Hobbies
                </h3>
              </Reveal>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {hobbies.map((hobby, index) => (
                  <Reveal key={hobby.title} delay={index * 50}>
                    <div className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                      <div className="mb-4">
                        <IconBox icon={hobby.icon} />
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {hobby.title}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                        {hobby.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal>
                <SectionLabel>Communication</SectionLabel>
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Languages
                </h3>
              </Reveal>
              <Reveal delay={40}>
                <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-7">
                  {languages.map((lang) => (
                    <div key={lang.name} className="mb-6 last:mb-0">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {lang.name}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {lang.level}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-neutral-900 dark:bg-white"
                          style={{ width: `${lang.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. LEARNING                                                 */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Learning</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              What I am working to improve
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
              Learning goals — not claims of expert-level mastery.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <IconBox icon={BookOpen} />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Roadmap topics
                  </h3>
                </div>
                <ul className="space-y-4">
                  {learningGoals.map((goal) => (
                    <li
                      key={goal.topic}
                      className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0 dark:border-white/[0.06]"
                    >
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {goal.topic}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {goal.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <IconBox icon={Target} />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Near-term steps
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Improve architecture clarity on active apps.",
                    "Keep DSA practice consistent alongside features.",
                    "Harden real-time paths: reconnect and presence.",
                    "Learn testing and production debugging habits.",
                    "Document limitations as carefully as features.",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-7 text-neutral-600 dark:text-neutral-400"
                    >
                      <ArrowRight
                        size={15}
                        className="mt-1 shrink-0 text-neutral-400"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. QUOTES                                                   */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Philosophy</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Lines that keep the work grounded
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {quotes.map((quote, index) => (
              <Reveal key={quote.text} delay={index * 60}>
                <div className="flex h-full flex-col justify-center rounded-2xl border border-neutral-200/80 bg-white p-6 text-center dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                  <Quote
                    size={22}
                    className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600"
                  />
                  <p className="text-sm font-medium italic leading-7 text-neutral-800 dark:text-neutral-200">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    — {quote.author}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. CTA                                                      */}
      {/* ============================================================ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
                    <Sparkles size={21} />
                  </div>
                  <SectionLabel>Let&apos;s connect</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Have an idea worth building?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    Open to projects, internships, junior roles, and
                    collaborations that need careful full-stack work —
                    especially real-time and practical product delivery.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <a
                      href={identity.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Github size={15} /> GitHub <ExternalLink size={12} />
                    </a>
                    <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
                    <a
                      href="https://happylamb.in"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Globe size={15} /> HappyLamb <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <PrimaryLink to="/contact">
                    Get in touch <ArrowRight size={16} />
                  </PrimaryLink>
                  <SecondaryLink to="/projects">
                    View work <ArrowUpRight size={16} />
                  </SecondaryLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}