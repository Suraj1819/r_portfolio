import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  MessageSquare,
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
  Github,
  Globe,
  GraduationCap,
  Layers,
  Laptop,
  MapPin,
  MonitorSmartphone,
  Network,
  Rocket,
  School,
  Server,
  Sparkles,
  Tag,
  Target,
  Terminal,
  Trophy,
  Cloud,
  GitBranch,
  User,
  ChevronDown,
  Image as ImageIcon,
  Play,
  Film,
  Maximize2,
  X as XIcon,
  Home as HomeIcon,
  ChevronRight,
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
/*  Shared classes — EXACTLY matching ProjectDetail.jsx                */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox =
  "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const hoverCard =
  "transition hover:border-neutral-900 dark:hover:border-white";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

/* ------------------------------------------------------------------ */
/*  Tech logos (official brand colours — from ProjectDetail.jsx)        */
/* ------------------------------------------------------------------ */
const LOGOS = {
  react: ["react", "61DAFB"], reactjs: ["react", "61DAFB"],
  vite: ["vite", "646CFF"],
  tailwindcss: ["tailwindcss", "06B6D4"], tailwind: ["tailwindcss", "06B6D4"],
  javascript: ["javascript", "F7DF1E"], js: ["javascript", "F7DF1E"],
  typescript: ["typescript", "3178C6"], ts: ["typescript", "3178C6"],
  nodejs: ["nodedotjs", "5FA04E"], node: ["nodedotjs", "5FA04E"],
  express: ["express", "000000"], expressjs: ["express", "000000"],
  postgresql: ["postgresql", "4169E1"], postgres: ["postgresql", "4169E1"],
  mongodb: ["mongodb", "47A248"], mongo: ["mongodb", "47A248"],
  supabase: ["supabase", "3FCF8E"],
  socketio: ["socketdotio", "010101"],
  webrtc: ["webrtc", "333333"],
  git: ["git", "F05032"],
  github: ["github", "181717"],
  postman: ["postman", "FF6C37"],
  vercel: ["vercel", "000000"],
  render: ["render", "46E3B7"],
  "c++": ["cplusplus", "00599C"],
  html: ["html5", "E34F26"], html5: ["html5", "E34F26"],
  css: ["css3", "1572B6"], css3: ["css3", "1572B6"],
  plesk: ["plesk", "3B3B3B"],
  python: ["python", "3776AB"],
};

const FALLBACK_ICONS = {
  sql: Database, dbms: Database, restapis: Globe, restapi: Globe, api: Globe,
  websockets: Network, websocket: Network, stun: Network, turn: Network, networks: Network,
  dsa: Cpu, oop: Code2,
};

const norm = (n) => String(n ?? "").toLowerCase().replace(/[\s._-]/g, "");
const techName = (t) => (typeof t === "string" ? t : t?.name ?? t?.label ?? t?.title ?? "");

/* ------------------------------------------------------------------ */
/*  Logo pieces — copied from ProjectDetail.jsx                        */
/* ------------------------------------------------------------------ */
function Logo({ name, size = "h-6 w-6", round = false }) {
  const key = norm(name);
  const logo = LOGOS[key];
  const Fallback = FALLBACK_ICONS[key] ?? Code2;
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-white ring-1 ring-neutral-200 dark:ring-white/10 ${
        round ? "rounded-full" : "rounded-lg"
      } ${size}`}
    >
      {logo ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className="h-[60%] w-[60%]"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <Fallback size={14} className="text-neutral-500" />
      )}
    </span>
  );
}

function Tech({ name }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5" round />
      {name}
    </li>
  );
}

function TechList({ items, limit }) {
  const names = (items ?? []).map(techName).filter(Boolean);
  const shown = typeof limit === "number" ? names.slice(0, limit) : names;
  if (!shown.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {shown.map((n) => <Tech key={n} name={n} />)}
      {names.length > shown.length && (
        <li className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
          +{names.length - shown.length}
        </li>
      )}
    </ul>
  );
}

function TechGrid({ items }) {
  const names = (items ?? []).map(techName).filter(Boolean);
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
      {names.map((n) => (
        <li key={n} className="flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5">
          <Logo name={n} size="h-11 w-11" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{n}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
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
  { value: "300+", label: "DSA problems" },
  { value: "100", label: "Day LeetCode streak" },
  { value: "4", label: "Core projects" },
  { value: "Final yr", label: "CSE · GEC Vaishali" },
];

/* ------------------------------------------------------------------ */
/*  TIMELINE — split by category                                      */
/* ------------------------------------------------------------------ */

const educationTimeline = [
  {
    id: "class-10",
    title: "Class 10 · Secondary School",
    organization: "Bihar Board of Secondary Education",
    location: "Bihar, India",
    period: "2020",
    year: "2020",
    duration: "1 year",
    board: "BSEB",
    stream: "Secondary",
    result: "Passed",
    percentage: "78%",
    scoreLabel: "Percentage",
    description:
      "Completed secondary education with a science and mathematics focus. Built early habits around logical reasoning and consistent study that later supported programming coursework.",
    icon: School,
    tag: "Class 10",
    subjects: ["Mathematics", "Science", "Social Science", "Hindi", "English", "Sanskrit"],
    highlights: ["Science foundation", "Mathematics", "Logical reasoning"],
  },
  {
    id: "class-12",
    title: "Class 12 · Higher Secondary",
    organization: "Bihar Intermediate Education Council",
    location: "Bihar, India",
    period: "2022",
    year: "2022",
    duration: "2 years (2020 – 2022)",
    board: "BIEC",
    stream: "Science (PCM)",
    result: "Passed",
    percentage: "72%",
    scoreLabel: "Percentage",
    description:
      "Completed higher secondary in the science stream with physics, chemistry and mathematics. Strengthened analytical thinking and developed interest in computers and problem-solving that led toward Computer Science Engineering.",
    icon: School,
    tag: "Class 12",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Hindi"],
    highlights: ["Science stream (PCM)", "Physics & mathematics", "Path toward CSE"],
  },
  {
    id: "college",
    title: identity.education,
    organization: identity.college,
    location: "Vaishali / Muzaffarpur region, Bihar",
    period: "2023 – 2027",
    year: "2023 – 2027",
    duration: "4 years (B.Tech)",
    board: "AICTE affiliated",
    stream: "Computer Science & Engineering",
    result: "Final year",
    percentage: "CGPA 7.8 / 10",
    scoreLabel: "Overall CGPA",
    currentSem: "Semester 7 (Final year)",
    description:
      "Pursuing B.Tech in Computer Science Engineering. Coursework covers programming, data structures, algorithms, OOP, databases, operating systems, and computer networks. Alongside academics: consistent DSA practice and multi-component web applications.",
    icon: GraduationCap,
    tag: "Undergraduate",
    subjects: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Web Technologies",
    ],
    highlights: ["Core CS curriculum", "DSA practice", "Web technologies", "Computer networks"],
    // Semester-wise CGPA — shown in expandable dropdown
    semesters: [
      { sem: "Semester 1", sgpa: "7.2", year: "2022" },
      { sem: "Semester 2", sgpa: "7.5", year: "2023" },
      { sem: "Semester 3", sgpa: "7.6", year: "2023" },
      { sem: "Semester 4", sgpa: "7.8", year: "2023" },
      { sem: "Semester 5", sgpa: "8.0", year: "2024" },
      { sem: "Semester 6", sgpa: "8.1", year: "2024" },
      { sem: "Semester 7", sgpa: "In progress", year: "2025", current: true },
      { sem: "Semester 8", sgpa: "Upcoming", year: "2026" },
    ],
    overallCgpa: "7.8 / 10",
  },
];

const experienceTimeline = [
  {
    id: "internship",
    title: "Web Development Intern",
    organization: "UTC",
    location: "Remote",
    period: "Internship",
    year: "Internship",
    duration: "Internship",
    role: "Web Development Intern",
    employment: "Internship",
    description:
      "Gained professional exposure to web development workflows. Worked on implementation, debugging, and understanding delivery processes in a team setting. Strengthened practical frontend and integration skills beyond classroom projects.",
    icon: BriefcaseBusiness,
    tag: "Internship",
    tech: ["HTML5", "CSS3", "JavaScript", "React"],
    highlights: ["Team collaboration", "Implementation practice", "Delivery workflow"],
  },
  {
    id: "happylamb",
    title: "Web Developer",
    organization: "HappyLamb",
    location: "Remote · Production site",
    period: "2025 – Present",
    year: "2025+",
    duration: "Ongoing",
    role: "Web Developer",
    employment: "Freelance / Contract",
    description:
      "Contributing to development and maintenance of the HappyLamb production website. Responsibilities include feature work, responsive UI, maintainability, and practical delivery on a live product — without inventing traffic or revenue metrics.",
    icon: Globe,
    tag: "Production",
    link: "https://happylamb.in",
    tech: ["React", "Node.js", "Express", "Tailwind CSS"],
    highlights: ["Production website", "Responsive UI", "Feature delivery", "Ongoing maintenance"],
  },
  {
    id: "projects",
    title: "Independent full-stack projects",
    organization: "Personal engineering",
    location: "Self-directed",
    period: "Ongoing",
    year: "Projects",
    duration: "Ongoing",
    role: "Full-stack developer",
    employment: "Self-directed",
    description:
      "WebDrop (WebRTC file transfer), Bambi (real-time messaging — in progress), BambiSync (nearby transfer prototype), and this portfolio (React, Express, PostgreSQL, contact API). Case studies document architecture, limits, and honest feature status.",
    icon: Rocket,
    tag: "Projects",
    tech: ["React", "Vite", "Node.js", "Socket.IO", "WebRTC", "PostgreSQL"],
    highlights: ["WebRTC & signaling", "Socket.IO messaging", "Contact API + database", "Case study writing"],
  },
];

/* ------------------------------------------------------------------ */
/*  TIMELINE — single section with left sidebar nav (like ProjectDetail.jsx) */
/* ------------------------------------------------------------------ */

const timelineGroups = [
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    items: educationTimeline,
  },
  {
    id: "experience",
    label: "Experience & work",
    icon: BriefcaseBusiness,
    items: experienceTimeline,
  },
];

/* Semester dropdown — expandable list of semester-wise SGPA */
function SemesterDropdown({ semesters, overallCgpa, currentSem }) {
  const [open, setOpen] = useState(false);
  if (!semesters?.length) return null;

  return (
    <div className="mt-4 hidden border-t border-neutral-200 pt-4 dark:border-white/10 sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl bg-neutral-50 px-4 py-3 text-left transition hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <span className="flex items-center gap-2">
          <GraduationCap size={15} className="text-neutral-500" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            Semester-wise CGPA
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
            Overall: {overallCgpa}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-neutral-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-neutral-200 bg-white p-2 dark:border-white/10 dark:bg-white/[0.03] sm:grid-cols-2">
          {semesters.map((s) => (
            <div
              key={s.sem}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-xs",
                s.current
                  ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                  : "bg-neutral-50 dark:bg-white/[0.04]"
              )}
            >
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {s.sem}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {s.year}
                </p>
              </div>
              <span
                className={cn(
                  "ml-2 shrink-0 font-bold tabular-nums",
                  s.current
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-neutral-900 dark:text-white"
                )}
              >
                {s.sgpa}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Current semester chip — always visible */}
      {currentSem && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Current: {currentSem}
        </div>
      )}
    </div>
  );
}

/* Single timeline item card — detailed */
function TimelineItem({ item, index }) {
  const Icon = item.icon;
  const isEducation = !!item.subjects;

  // Build the detail rows array — different for education vs experience
  const detailRows = isEducation
    ? [
        { icon: Calendar, label: "Year", value: item.year },
        { icon: Clock, label: "Duration", value: item.duration },
        { icon: Building2, label: "Board", value: item.board },
        { icon: Layers, label: "Stream", value: item.stream },
        { icon: CheckCircle2, label: "Result", value: item.result },
        { icon: Award, label: item.scoreLabel || "Score", value: item.percentage },
      ].filter((r) => r.value)
    : [
        { icon: Calendar, label: "Period", value: item.period },
        { icon: Clock, label: "Duration", value: item.duration },
        { icon: User, label: "Role", value: item.role },
        { icon: BriefcaseBusiness, label: "Type", value: item.employment },
        { icon: MapPin, label: "Location", value: item.location },
      ].filter((r) => r.value);

  return (
    <Reveal delay={index * 50}>
      <div className="relative mb-8 pl-8 last:mb-0 sm:mb-12 sm:pl-14">
        {/* Monochrome dark icon marker */}
        <span
          className={cn(
            iconBox,
            "absolute -left-[19px] top-1 flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-neutral-50 dark:ring-neutral-950 sm:-left-[28px] sm:h-12 sm:w-12 sm:rounded-xl"
          )}
        >
          <Icon size={16} className="sm:hidden" />
          <Icon size={20} className="hidden sm:block" />
        </span>

        <div className={cn(card, hoverCard, "p-4 sm:p-6")}>
          {/* Header */}
          <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-700 dark:border-white/10 dark:bg-white/[0.07] dark:text-neutral-300">
                {item.tag}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <Calendar size={13} />
              {item.period}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-lg">
            {item.title}
          </h3>

          {/* Organization + Location */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Building2 size={14} />
              {item.organization}
            </span>
            {item.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} />
                {item.location}
              </span>
            ) : null}
          </div>

          {/* Description — hidden on mobile */}
          <p className="mt-3 hidden text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:block">
            {item.description}
          </p>

          {/* Detail rows — 2-col grid like ProjectDetail.jsx ProjectBrief (hidden on mobile) */}
          {detailRows.length > 0 && (
            <dl className="mt-4 hidden grid-cols-2 gap-2.5 sm:grid sm:gap-3">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl bg-neutral-50 p-3 dark:bg-white/5"
                >
                  <dt className={cn("flex items-center gap-1.5 text-xs", soft)}>
                    <row.icon size={13} /> {row.label}
                  </dt>
                  <dd className="mt-1.5 break-words text-sm font-semibold text-neutral-900 dark:text-white">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Subjects (education only) */}
          {isEducation && item.subjects?.length ? (
            <div className="mt-4 hidden border-t border-neutral-200 pt-4 dark:border-white/10 sm:block">
              <p className={cn("mb-2.5 flex items-center gap-2 text-xs font-semibold", soft)}>
                <BookOpen size={13} /> Subjects
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Semester dropdown (college only) */}
          {isEducation && item.semesters?.length ? (
            <SemesterDropdown
              semesters={item.semesters}
              overallCgpa={item.overallCgpa}
              currentSem={item.currentSem}
            />
          ) : null}

          {/* Tech (experience only) */}
          {!isEducation && item.tech?.length ? (
            <div className="mt-4 hidden border-t border-neutral-200 pt-4 dark:border-white/10 sm:block">
              <p className={cn("mb-2.5 flex items-center gap-2 text-xs font-semibold", soft)}>
                <Tag size={13} /> Technologies
              </p>
              <TechList items={item.tech} />
            </div>
          ) : null}

          {/* Highlights */}
          {item.highlights?.length ? (
            <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
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

          {/* Link */}
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 hidden items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-200 dark:hover:bg-white/[0.06] sm:inline-flex"
            >
              Visit website <ArrowUpRight size={14} />
            </a>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  GALLERY data — milestone photos + project screenshots              */
/* ------------------------------------------------------------------ */

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    caption: "College campus · GEC Vaishali",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    caption: "Hackathon · coding through the night",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    caption: "Workspace · daily development setup",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    caption: "LeetCode streak · 100 days milestone",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    caption: "Team project · classroom delivery",
  },
  {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    caption: "Pair debugging · internship practice",
  },
];

/* ------------------------------------------------------------------ */
/*  VIDEO data — intro / project demo                                  */
/* ------------------------------------------------------------------ */

const aboutVideo = {
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title: "About me — quick intro",
  description:
    "A short walkthrough of who I am, what I build, and the kinds of projects I am currently working on — full-stack, real-time, and P2P.",
    
};

/* ------------------------------------------------------------------ */
/*  Lightbox — full screen image viewer (from ProjectDetail.jsx)        */
/* ------------------------------------------------------------------ */

function Lightbox({ images, index, onClose, onNav }) {
  const [touchX, setTouchX] = useState(null);
  const total = images.length;
  const go = (i) => onNav((i + total) % total);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % total);
      if (e.key === "ArrowLeft") onNav((index - 1 + total) % total);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, total, onClose, onNav]);

  const cur = images[index];
  if (!cur) return null;
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white">
          {index + 1} / {total}
        </span>
        <div className="flex gap-2">
          <a
            href={cur.src}
            target="_blank"
            rel="noopener noreferrer"
            className={btn}
            aria-label="Open original image"
          >
            <ExternalLink size={18} />
          </a>
          <button type="button" onClick={onClose} className={btn} aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onClick={onClose}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          setTouchX(null);
        }}
      >
        {total > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              go(index - 1);
            }}
            className={`${btn} absolute left-3 z-10 sm:left-6`}
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
        )}
        <img
          src={cur.src}
          alt={cur.caption || "Photo"}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        />
        {total > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              go(index + 1);
            }}
            className={`${btn} absolute right-3 z-10 sm:right-6`}
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        {cur.caption && (
          <p className="mb-3 text-center text-sm text-white/80">{cur.caption}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery — uniform tiles, full image visible (ProjectDetail.jsx)    */
/* ------------------------------------------------------------------ */

const GALLERY_INITIAL = 6;

function Gallery({ images }) {
  const [open, setOpen] = useState(null);
  const [broken, setBroken] = useState(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const closeLightbox = useCallback(() => setOpen(null), []);

  const visible = useMemo(
    () => images.filter((im) => !broken.has(im.src)),
    [images, broken]
  );
  const shown = expanded ? visible : visible.slice(0, GALLERY_INITIAL);
  const hidden = visible.length - shown.length;

  if (!visible.length) {
    return (
      <div className={cn(card, "flex flex-col items-center gap-3 border-dashed p-10 text-center")}>
        <ImageIcon size={26} className="text-neutral-400" />
        <p className={cn("text-sm", muted)}>Photos will appear here soon.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((im, i) => (
          <li
            key={`${im.src}-${i}`}
            className={i === 0 && visible.length > 2 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={im.caption ? `View: ${im.caption}` : `View image ${i + 1}`}
              className={cn(
                card,
                "group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 transition hover:border-neutral-900 dark:bg-white/5 dark:hover:border-white"
              )}
            >
              <img
                src={im.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl"
              />
              <img
                src={im.src}
                alt={im.caption || `Photo ${i + 1}`}
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(im.src))}
                className="relative h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-4 text-left text-xs font-medium text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                <span className="line-clamp-2">{im.caption || "View full screen"}</span>
                <Maximize2 size={15} className="shrink-0" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {visible.length > GALLERY_INITIAL && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5"
          >
            {expanded ? "Show less" : `Show ${hidden} more`}
            <ChevronDown size={16} className={cn("transition", expanded && "rotate-180")} />
          </button>
        </div>
      )}

      {open !== null && (
        <Lightbox images={visible} index={open} onClose={closeLightbox} onNav={setOpen} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Video embed (from ProjectDetail.jsx)                                */
/* ------------------------------------------------------------------ */

function getEmbed(url) {
  if (!url || typeof url !== "string") return null;
  const yt = [
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/watch\?v=([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
  ];
  for (const p of yt) {
    const m = url.match(p);
    if (m) return { id: m[1], type: "youtube" };
  }
  const v = url.match(/vimeo\.com\/(\d+)/);
  return v ? { id: v[1], type: "vimeo" } : null;
}

function VideoEmbed({ video }) {
  const url = typeof video === "string" ? video : video?.url;
  const title = typeof video === "object" ? video?.title : null;
  const description = typeof video === "object" ? video?.description : null;
  const embed = getEmbed(url);

  return (
    <div className={cn(card, "overflow-hidden")}>
      <div className="relative aspect-video w-full bg-neutral-100 dark:bg-white/5">
        {embed?.type === "youtube" && (
          <iframe
            src={`https://www.youtube.com/embed/${embed.id}`}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        )}
        {embed?.type === "vimeo" && (
          <iframe
            src={`https://player.vimeo.com/video/${embed.id}`}
            title={title || "Video"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        )}
        {!embed && url && (
          <video src={url} controls className="absolute inset-0 h-full w-full bg-black">
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {(title || description) && (
        <div className="p-5 sm:p-6">
          {title && (
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Film size={15} className="text-neutral-500" /> {title}
            </h3>
          )}
          {description && (
            <p className={cn("mt-2 text-sm leading-7", muted)}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section block wrapper — like ProjectDetail.jsx Block                */
/* ------------------------------------------------------------------ */

function Block({ id, icon: Icon, title, count, children }) {
  return (
    <div id={id} className="scroll-mt-28">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className={cn(iconBox, "flex h-11 w-11 items-center justify-center rounded-xl")}>
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            {title}
          </h3>
        </div>
        {count != null && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {count}
          </span>
        )}
      </header>
      {children}
    </div>
  );
}

/* The single combined timeline section — sidebar nav + content (like ProjectDetail.jsx) */
function TimelineSection() {
  // Build sidebar nav items: timeline groups + gallery + video
  const navItems = [
    ...timelineGroups.map((g) => ({ id: g.id, label: g.label, icon: g.icon })),
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "video", label: "Video demo", icon: Play },
  ];
  const sectionIds = navItems.map((n) => n.id);
  const active = useScrollSpy(sectionIds);

  return (
    <section className="border-b border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Section header */}
        <Reveal>
          <div className="mb-8 flex items-center gap-3 sm:mb-12 sm:gap-4">
            <span className={cn(iconBox, "flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl")}>
              <Calendar size={20} strokeWidth={1.6} />
            </span>
            <div>
              <SectionLabel>Path</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                Education &amp; experience timeline
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Mobile section nav (sticky chips, ProjectDetail style) */}
        <nav
          aria-label="Timeline sections"
          className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden print:hidden"
        >
          <ul className="flex gap-2 overflow-x-auto px-5 py-3">
            {navItems.map((n) => {
              const NIcon = n.icon;
              const isActive = active === n.id;
              return (
                <li key={n.id} className="shrink-0">
                  <a
                    href={`#${n.id}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium",
                      isActive
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
                    )}
                  >
                    <NIcon size={13} /> {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar + content grid (ProjectDetail.jsx style) */}
        <div className="grid gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <nav aria-label="On this page" className={cn(card, "p-3")}>
                <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                <ul>
                  {navItems.map((n) => {
                    const NIcon = n.icon;
                    const isActive = active === n.id;
                    return (
                      <li key={n.id}>
                        <a
                          href={`#${n.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                          )}
                        >
                          <NIcon size={14} /> {n.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Quick stats card (ProjectDetail style) */}
              <div className={cn(card, "p-4")}>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sparkles size={14} /> Quick stats
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className={cn(soft)}>Education</span>
                    <span className="font-semibold">{educationTimeline.length}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className={cn(soft)}>Experience</span>
                    <span className="font-semibold">{experienceTimeline.length}</span>
                  </li>
                  <li className="flex items-center justify-between border-t border-neutral-200 pt-2 dark:border-white/10">
                    <span className={cn(soft)}>Total</span>
                    <span className="font-semibold">{educationTimeline.length + experienceTimeline.length}</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main content — grouped timelines + gallery + video */}
          <div className="min-w-0 max-w-3xl space-y-16">
            {timelineGroups.map((group) => (
              <div key={group.id} id={group.id} className="scroll-mt-28">
                {/* Group subheader with icon */}
                <div className="mb-6 flex items-center gap-3">
                  <span className={cn(iconBox, "flex h-10 w-10 items-center justify-center rounded-xl")}>
                    <group.icon size={18} strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                      {group.id === "education" ? "Education" : "Work"}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                      {group.label}
                    </h3>
                  </div>
                </div>

                {/* Timeline rail */}
                <div className="relative ml-3 border-l-2 border-neutral-200 dark:border-white/10 sm:ml-4">
                  {group.items.map((item, idx) => (
                    <TimelineItem key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            ))}

            {/* ============ GALLERY ============ */}
            <Block id="gallery" icon={ImageIcon} title="Gallery" count={galleryImages.length}>
              <Gallery images={galleryImages} />
            </Block>

            {/* ============ VIDEO DEMO ============ */}
            <Block id="video" icon={Play} title="Video demo">
              <VideoEmbed video={aboutVideo} />
            </Block>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SKILLS — each category has its own tech list (brand logos)         */
/* ------------------------------------------------------------------ */

const technicalSkills = [
  {
    title: "Programming",
    icon: Terminal,
    skills: ["C++", "JavaScript", "Python", "SQL"],
  },
  {
    title: "Frontend",
    icon: MonitorSmartphone,
    skills: ["HTML5", "CSS3", "React", "Vite", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Networking & realtime",
    icon: Network,
    skills: ["WebRTC", "Socket.IO"],
  },
  {
    title: "Dev tools",
    icon: GitBranch,
    skills: ["Git", "GitHub", "Postman"],
  },
  {
    title: "Deployment",
    icon: Cloud,
    skills: ["Vercel", "Render"],
  },
];

/* ------------------------------------------------------------------ */
/*  PROJECTS — with brand-colored tech tags                           */
/* ------------------------------------------------------------------ */

const featuredProjects = [
  {
    name: "WebDrop",
    category: "P2P file transfer",
    icon: Network,
    status: "Completed",
    description:
      "Browser file sharing with room codes or QR pairing — WebRTC DataChannels over Socket.IO signaling.",
    stack: ["React", "Vite", "Node.js", "Socket.IO", "WebRTC"],
    link: "https://github.com/Suraj1819/web-drop",
    live: "https://webdrop-eight.vercel.app",
  },
  {
    name: "Bambi",
    category: "Real-time messaging",
    icon: MessageSquare,
    status: "In progress",
    description:
      "Messaging app with responsive chat UI and Socket.IO events. Status honestly marked per feature.",
    stack: ["React", "Node.js", "Socket.IO", "PostgreSQL"],
    link: "",
    live: "",
  },
  {
    name: "Developer portfolio",
    category: "Personal site",
    icon: Laptop,
    status: "Live",
    description:
      "Multi-page portfolio with theme system, project case studies, and a secure contact API.",
    stack: ["React", "Vite", "Express", "PostgreSQL"],
    link: identity.github,
    live: profile.portfolio || "https://surajzxrt.online",
  },
];

/* ------------------------------------------------------------------ */
/*  CERTIFICATIONS                                                     */
/* ------------------------------------------------------------------ */

const certifications = [
  {
    title: "LeetCode 100 Days Streak",
    description: "Consistency in problem-solving.",
    icon: Trophy,
  },
  {
    title: "300+ DSA problems",
    description: "LeetCode & GeeksforGeeks.",
    icon: Code2,
  },
  {
    title: "learnX Python certificate",
    description: "Structured Python credential.",
    icon: Award,
  },
  {
    title: "Cisco Networking Essentials",
    description: "Foundational networking coursework.",
    icon: Network,
  },
  {
    title: "Python workshops",
    description: "Language fundamentals workshops.",
    icon: BookOpen,
  },
];

/* ------------------------------------------------------------------ */
/*  LEARNING GOALS                                                     */
/* ------------------------------------------------------------------ */

const learningGoals = [
  { topic: "TypeScript", why: "Stronger contracts across the stack." },
  { topic: "Next.js", why: "Server-aware React and routing." },
  { topic: "Advanced React patterns", why: "Cleaner state and composition." },
  { topic: "System design basics", why: "Better choices for realtime." },
  { topic: "Application security", why: "Safer validation habits." },
  { topic: "Testing practices", why: "Regression safety for APIs and UI." },
];

/* ------------------------------------------------------------------ */
/*  INTERESTS                                                          */
/* ------------------------------------------------------------------ */

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
/*  UI PRIMITIVES — matching ProjectDetail.jsx exactly                 */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

/* Monochrome dark icon box — matches ProjectDetail.jsx iconBox */
function IconBox({ icon: Icon, size = "h-11 w-11", iconSize = 20, className = "" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        iconBox,
        size,
        className
      )}
    >
      <Icon size={iconSize} strokeWidth={1.6} />
    </span>
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
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:border-white dark:hover:bg-white/5",
        className
      )}
    >
      {children}
    </Link>
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

/* ScrollSpy — tracks which section is active in viewport (matches ProjectDetail.jsx) */
function useScrollSpy(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!ids.length) return undefined;
    const handler = () => {
      const pos = window.scrollY + 180;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/* ------------------------------------------------------------------ */
/*  Reading progress + Back-to-top (matches ProjectDetail.jsx)         */
/* ------------------------------------------------------------------ */

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 print:hidden">
      <div
        className="h-full bg-neutral-900 transition-[width] duration-150 dark:bg-white"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 print:hidden"
    >
      <ArrowUp size={20} />
    </button>
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
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* ============================================================ */}
      {/* 1. HERO — top padding matches navbar-body gap                */}
      {/* ============================================================ */}
      <section className="relative border-b border-neutral-200 dark:border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          {/* Breadcrumb — exactly matches ProjectDetail.jsx (no layout shift on page change) */}
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "mb-8 flex flex-wrap items-center gap-1.5 text-sm print:hidden",
              soft
            )}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">About</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
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
                I am {identity.name}, a CSE student at {identity.college}. I
                focus on full-stack web development, real-time apps, computer
                networks, and P2P systems.
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

              {/* Hero tech tags with brand logos */}
              <div className="mt-5 hidden sm:block">
                <TechList
                  items={["React", "Node.js", "WebRTC", "PostgreSQL", "Socket.IO"]}
                />
              </div>
            </div>

            {/* Profile card — wider & bigger photo, sticky on desktop so it stays visible */}
            <div className="relative z-10 mx-auto w-full max-w-md lg:sticky lg:top-20 lg:mx-0 lg:max-w-lg">
              <div className={cn(card, "overflow-hidden")}>
                {/* Photo + identity — bigger photo, balanced text */}
                <div className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-white/15 dark:bg-white/[0.06] sm:h-24 sm:w-24">
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
                      className="hidden absolute inset-0 flex items-center justify-center bg-neutral-200 text-base font-semibold tracking-tight text-neutral-600 dark:bg-white/[0.08] dark:text-neutral-300"
                      aria-hidden="true"
                    >
                      {identity.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-lg">
                      {identity.name}
                    </h2>
                    <p className="mt-0.5 truncate text-sm text-neutral-500 dark:text-neutral-400">
                      {identity.role}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin size={11} className="shrink-0" />
                      {identity.location}
                    </p>
                  </div>
                </div>

                {/* Detail rows — 2-column grid for compactness */}
                <div className="grid grid-cols-2 border-t border-neutral-200 dark:border-white/10">
                  {[
                    {
                      icon: GraduationCap,
                      label: "Education",
                      value: "B.Tech CSE · Final yr",
                    },
                    {
                      icon: Building2,
                      label: "College",
                      value: "GEC Vaishali",
                    },
                    {
                      icon: Layers,
                      label: "Branch",
                      value: "CSE",
                    },
                    {
                      icon: Award,
                      label: "CGPA",
                      value: "7.8 / 10",
                    },
                    {
                      icon: Calendar,
                      label: "Batch",
                      value: "2022 – 2026",
                    },
                    {
                      icon: Code2,
                      label: "Focus",
                      value: "React, Node.js",
                    },
                    {
                      icon: Network,
                      label: "Interest",
                      value: "WebRTC · Socket.IO",
                    },
                    {
                      icon: Github,
                      label: "GitHub",
                      value: "@Suraj1819",
                    },
                  ].map((row, i, arr) => {
                    const isRight = i % 2 === 1;
                    const isBottomRow = i < arr.length - 2;
                    return (
                      <div
                        key={row.label}
                        className={cn(
                          "flex items-start gap-2 px-3 py-2 sm:px-4 sm:py-2.5",
                          isRight && "border-l border-neutral-200 dark:border-white/[0.06]",
                          isBottomRow && "border-b border-neutral-200 dark:border-white/[0.06]"
                        )}
                      >
                        <row.icon
                          size={13}
                          className="mt-0.5 shrink-0 text-neutral-400"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] font-medium uppercase tracking-wide text-neutral-400 sm:text-[10px]">
                            {row.label}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-800 dark:text-neutral-200 sm:text-xs">
                            {row.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats — single horizontal row (4 cols) */}
                <div className="grid grid-cols-4 border-t border-neutral-200 dark:border-white/10">
                  {stats.map((s, i) => (
                    <div
                      key={s.label}
                      className={cn(
                        "px-2 py-2 sm:px-3 sm:py-2.5",
                        i > 0 && "border-l border-neutral-200 dark:border-white/10"
                      )}
                    >
                      <p className="text-sm font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white sm:text-base">
                        {s.value}
                      </p>
                      <p className="mt-0.5 truncate text-[9px] text-neutral-500 dark:text-neutral-400 sm:text-[10px]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions — compact */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.02] sm:px-4">
                  <a
                    href={identity.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white"
                  >
                    <Github size={12} />
                    GitHub
                  </a>
                  <a
                    href={identity.resumePath}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white"
                  >
                    <Download size={12} />
                    Resume
                  </a>
                  <Link
                    to="/contact"
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    Contact <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TECH MARQUEE (hidden on mobile)                           */}
      {/* ============================================================ */}
      <section className="hidden overflow-hidden border-b border-neutral-200 bg-white py-6 dark:border-white/10 dark:bg-white/[0.02] sm:block">
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
      {/* 3. TIMELINE — single section, sidebar + content (ProjectDetail.jsx style) */}
      {/* ============================================================ */}
      <TimelineSection />

      {/* ============================================================ */}
      {/* 4. SKILLS — monochrome icon boxes + brand logo tech grid      */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Toolkit</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Technologies I work with
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {technicalSkills.map((item, index) => (
              <Reveal key={item.title} delay={index * 40}>
                <div className={cn(card, hoverCard, "group h-full p-4 sm:p-6")}>
                  <div className="mb-4 flex items-center justify-between sm:mb-5">
                    <IconBox icon={item.icon} />
                    <ArrowUpRight
                      size={17}
                      className="text-neutral-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-base">
                    {item.title}
                  </h3>
                  {/* Brand-colored tech logos grid */}
                  <div className="mt-3 sm:mt-4">
                    <TechGrid items={item.skills} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROJECTS — with brand-colored tech tags                    */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <SectionLabel>Selected work</SectionLabel>
                <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
                  Ideas turned into systems
                </h2>
              </div>
              <Link
                to="/projects"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                All projects <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {featuredProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <Reveal key={project.name} delay={index * 50}>
                  <article className={cn(card, hoverCard, "group flex h-full flex-col p-4 sm:p-7")}>
                    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
                      <IconBox icon={Icon} />
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-lg">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {project.category}
                    </p>
                    <p className="mt-3 hidden text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:block">
                      {project.description}
                    </p>
                    {/* Brand-colored tech logos */}
                    <div className="mt-4 sm:mt-5">
                      <TechList items={project.stack} />
                    </div>
                    <div className="mt-5 hidden flex-wrap gap-3 border-t border-neutral-200 pt-4 dark:border-white/10 sm:flex">
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
      {/* 6. ACHIEVEMENTS — monochrome icons                            */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Milestones</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Consistency &amp; learning
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {certifications.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <div className={cn(card, hoverCard, "group h-full p-4 sm:p-6")}>
                  <div className="mb-4 flex items-center justify-between sm:mb-5">
                    <IconBox icon={item.icon} />
                    <Trophy
                      size={16}
                      className="text-neutral-300 transition group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 hidden text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:block">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. INTERESTS                                                  */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Focus</SectionLabel>
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              Interests
            </h2>
          </Reveal>
          <Reveal delay={40}>
            <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
              {interests.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-700 transition-colors hover:border-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white sm:text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. LEARNING — hidden on mobile                                 */}
      {/* ============================================================ */}
      <section className="hidden border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02] sm:block">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionLabel>Learning</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
              What I am working to improve
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningGoals.map((goal, index) => (
              <Reveal key={goal.topic} delay={index * 40}>
                <div className={cn(card, hoverCard, "h-full p-5")}>
                  <div className="mb-3 flex items-center gap-3">
                    <IconBox icon={Target} size="h-9 w-9" iconSize={16} />
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {goal.topic}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {goal.why}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CTA — monochrome                                            */}
      {/* ============================================================ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className={cn(card, "p-5 sm:p-10 lg:p-12")}>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Sparkles size={20} />
                  </div>
                  <SectionLabel>Let&apos;s connect</SectionLabel>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Have an idea worth building?
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:mt-4 sm:text-base">
                    Open to projects, internships, junior roles, and
                    collaborations that need careful full-stack work.
                  </p>
                  <div className="mt-5 hidden flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400 sm:mt-6 sm:flex">
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
                <div className="flex flex-wrap gap-3 lg:flex-column lg:items-stretch">
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
