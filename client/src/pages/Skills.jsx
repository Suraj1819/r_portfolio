
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BarChart3,
  Binary,
  BookOpen,
  Boxes,
  Braces,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  Code2,
  Database,
  ExternalLink,
  Github,
  Globe,
  Home as HomeIcon,
  Layers,
  Lightbulb,
  ListChecks,
  Mail,
  MonitorSmartphone,
  Network,
  Plug,
  Rocket,
  Search,
  Server,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import * as SimpleIcons from "simple-icons";

import {
  skillCategories,
  learningRoadmap,
  proficiencyPercent,
} from "../data/skills";
import * as skillsData from "../data/skills";
import { projects } from "../data/projects";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

const GITHUB_PROFILE = "https://github.com/Suraj1819";
const MOBILE_SKILL_LIMIT = 4;

const CATEGORY_CONFIG = {
  languages: {
    icon: Code2,
    description: "Languages for programming, scripting and problem-solving.",
  },
  frontend: {
    icon: MonitorSmartphone,
    description: "Responsive interfaces, reusable components and accessible UX.",
  },
  backend: {
    icon: Server,
    description: "APIs, server-side logic and real-time functionality.",
  },
  databases: {
    icon: Database,
    description: "Data modelling, queries and application data management.",
  },
  realtime: {
    icon: Network,
    description: "Peer-to-peer communication, signaling and connection lifecycle.",
  },
  tools: {
    icon: Wrench,
    description: "Tools for development, debugging and deployment.",
  },
  ui: {
    icon: Layers,
    description: "Component libraries and routing tools.",
  },
};

const TECHNOLOGY_LOGOS = {
  javascript: "siJavascript",
  js: "siJavascript",
  python: "siPython",
  react: "siReact",
  "react.js": "siReact",
  reactjs: "siReact",
  vite: "siVite",
  tailwind: "siTailwindcss",
  "tailwind css": "siTailwindcss",
  tailwindcss: "siTailwindcss",
  node: "siNodedotjs",
  "node.js": "siNodedotjs",
  nodejs: "siNodedotjs",
  express: "siExpress",
  "express.js": "siExpress",
  expressjs: "siExpress",
  mongodb: "siMongodb",
  mongo: "siMongodb",
  mongoose: "siMongoose",
  postgresql: "siPostgresql",
  postgres: "siPostgresql",
  supabase: "siSupabase",
  git: "siGit",
  github: "siGithub",
  html: "siHtml5",
  html5: "siHtml5",
  css: "siCss3",
  css3: "siCss3",
  npm: "siNpm",
  postman: "siPostman",
  vscode: "siVisualstudiocode",
  "vs code": "siVisualstudiocode",
  "visual studio code": "siVisualstudiocode",
  typescript: "siTypescript",
  ts: "siTypescript",
  "c++": "siCplusplus",
  cpp: "siCplusplus",
  docker: "siDocker",
  vercel: "siVercel",
  render: "siRender",
  netlify: "siNetlify",
  firebase: "siFirebase",
  "next.js": "siNextdotjs",
  nextjs: "siNextdotjs",
  "socket.io": "siSocketdotio",
  socketio: "siSocketdotio",
  webrtc: "siWebrtc",
  mysql: "siMysql",
  redis: "siRedis",
  redux: "siRedux",
  axios: "siAxios",
  jwt: "siJsonwebtokens",
  nginx: "siNginx",
  figma: "siFigma",
  linux: "siLinux",
  cloudinary: "siCloudinary",
  stripe: "siStripe",
};

const FALLBACK_ICONS = {
  sql: Database,
  dbms: Database,
  restapis: Globe,
  restapi: Globe,
  api: Globe,
  apis: Globe,
  websockets: Plug,
  websocket: Plug,
  stun: Network,
  turn: Network,
  networks: Network,
  networking: Network,
  dsa: Binary,
  oop: Boxes,
};

const LEVEL_FILTERS = [
  "all",
  "Used in Projects",
  "Working Knowledge",
  "Familiar",
];

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";

const iconBox =
  "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";

const hoverCard =
  "transition-colors duration-200 hover:border-neutral-900 dark:hover:border-white";

const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

/* Colorful tone palette — matches the design system used across pages.
   Each tone has a light + dark variant. Replaces the all-dark iconBox
   for section headings, sidebar items, mobile nav, brief card, etc. */
const TONES = {
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  orange: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  slate: "bg-neutral-100 text-neutral-700 dark:bg-white/[0.07] dark:text-neutral-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

const TONE_TEXT = {
  sky: "text-sky-600 dark:text-sky-400",
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  orange: "text-orange-600 dark:text-orange-400",
  red: "text-red-600 dark:text-red-400",
  rose: "text-rose-600 dark:text-rose-400",
  slate: "text-neutral-600 dark:text-neutral-400",
  green: "text-emerald-600 dark:text-emerald-400",
};

/* Map page sections to their accent tone — Block headings, sidebar items,
   and the mobile section nav all use the same tone. */
const SECTION_TONES = {
  strengths: "violet",
  toolkit: "sky",
  overview: "amber",
  usage: "emerald",
  learning: "orange",
  certs: "rose",
  approach: "slate",
  projects: "sky",
};

function toneBox(tone = "slate") {
  return `flex shrink-0 items-center justify-center ${TONES[tone] || TONES.slate}`;
}

function toneText(tone = "slate") {
  return TONE_TEXT[tone] || TONE_TEXT.slate;
}

function sectionTone(id) {
  return SECTION_TONES[id] || "slate";
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function normalise(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .replace(/\s+/g, " ");
}

const skillName = (skill) =>
  typeof skill === "string"
    ? skill
    : skill?.name ?? skill?.title ?? skill?.label ?? "";

const categoryName = (category) =>
  category?.name ??
  category?.title ??
  category?.label ??
  category?.id ??
  "Other skills";

const categoryId = (category) =>
  normalise(category?.id ?? category?.slug ?? category?.name);

const categoryConfig = (category) =>
  CATEGORY_CONFIG[categoryId(category)] ?? {
    icon: Layers,
    description: "Technologies and concepts used in my workflow.",
  };

function getLogo(name) {
  const iconName = TECHNOLOGY_LOGOS[normalise(name)];
  return iconName ? SimpleIcons[iconName] ?? null : null;
}

const canonical = (name) => {
  const key = normalise(name);
  return TECHNOLOGY_LOGOS[key] ?? key;
};

function skillPercent(skill) {
  if (!skill || typeof skill !== "object") return null;

  const direct = skill.proficiency ?? skill.percentage ?? skill.percent;

  if (typeof direct === "number") {
    return Math.max(0, Math.min(100, direct));
  }

  if (typeof skill.level === "number") {
    return Math.max(0, Math.min(100, skill.level));
  }

  if (typeof skill.level === "string") {
    return proficiencyPercent?.[skill.level] ?? null;
  }

  return null;
}

const levelLabel = (skill) =>
  skill &&
  typeof skill === "object" &&
  typeof skill.level === "string"
    ? skill.level
    : null;

const techName = (tech) =>
  typeof tech === "string" ? tech : tech?.name ?? tech?.title ?? "";

function projectTechs(project) {
  const list =
    project?.technologies ??
    project?.techStack ??
    project?.tech ??
    [];

  return Array.isArray(list) ? list.map(techName).filter(Boolean) : [];
}

const projectTitle = (project) =>
  project?.title ?? project?.name ?? "Project";

function roadmapState(item) {
  const status = normalise(item?.status ?? item?.stage ?? "");

  if (/(complete|done|learned|finished)/.test(status)) return "done";
  if (/(progress|learning|current|ongoing|now)/.test(status)) {
    return "progress";
  }

  return "planned";
}

const STATE_LABEL = {
  done: "Completed",
  progress: "In progress",
  planned: "Up next",
};

const STATE_ICON = {
  done: Check,
  progress: Clock,
  planned: Target,
};

const toList = (value) =>
  Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
      ? [value]
      : [];

const textOf = (item) =>
  typeof item === "string"
    ? item
    : item?.text ??
      item?.title ??
      item?.name ??
      item?.description ??
      "";

const firstOf = (object, ...keys) => {
  for (const key of keys) {
    const value = object?.[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      return value;
    }
  }

  return undefined;
};

/* ------------------------------------------------------------------ */
/* Small components                                                     */
/* ------------------------------------------------------------------ */

function TechLogo({ name, size = "md" }) {
  const logo = getLogo(name);
  const Fallback =
    FALLBACK_ICONS[normalise(name).replace(/\s/g, "")] ?? Code2;

  const box = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-8 w-8 rounded-lg sm:h-11 sm:w-11 sm:rounded-xl",
    lg: "h-10 w-10 rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl",
  }[size];

  const svg = {
    sm: "h-4 w-4",
    md: "h-4 w-4 sm:h-6 sm:w-6",
    lg: "h-5 w-5 sm:h-8 sm:w-8",
  }[size];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-white ring-1 ring-neutral-200 dark:ring-white/10",
        box,
      )}
    >
      {logo ? (
        <svg
          viewBox="0 0 24 24"
          className={svg}
          role="img"
          aria-label={`${name} logo`}
        >
          <path d={logo.path} fill={`#${logo.hex}`} />
        </svg>
      ) : (
        <Fallback
          className={cn(svg, "text-neutral-500")}
          strokeWidth={1.6}
        />
      )}
    </span>
  );
}

function Block({
  id,
  icon: Icon,
  title,
  subtitle,
  count,
  action,
  children,
}) {
  return (
    <section id={id} className="scroll-mt-32 sm:scroll-mt-28">
      <header className="mb-4 flex items-start justify-between gap-2 sm:mb-6 sm:gap-3">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3.5">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl",
              toneBox(sectionTone(id)),
            )}
          >
            <Icon size={16} className="sm:h-5 sm:w-5" />
          </span>

          <div className="min-w-0 pt-0.5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-2xl lg:text-3xl">
              {title}
            </h2>

            {subtitle && (
              <p className={cn("mt-1 hidden text-sm sm:block", soft)}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1 sm:gap-3">
          {action}

          {count != null && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300 sm:px-3 sm:text-xs">
              {count}
            </span>
          )}
        </div>
      </header>

      {children}
    </section>
  );
}

function Bar({ value }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200/70 dark:bg-white/10 sm:h-1.5">
      <div
        className="h-full rounded-full bg-neutral-900 transition-all duration-700 dark:bg-white"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Ring({ value, size = 56 }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative hidden shrink-0 sm:block"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-neutral-200 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (value / 100) * circumference}
          className="stroke-neutral-900 dark:stroke-white"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
        {Math.round(value)}%
      </span>
    </div>
  );
}

function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        focus,
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/30",
      )}
    >
      {children}
      {count != null && (
        <span
          className={cn(
            "tabular-nums",
            active ? "opacity-70" : "text-neutral-400",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatusBadge({ state, label }) {
  const Icon = STATE_ICON[state] ?? Sparkles;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300 sm:gap-1.5 sm:px-2.5 sm:text-xs">
      <Icon size={11} />
      {label ?? STATE_LABEL[state]}
    </span>
  );
}

function Modal({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100 sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white transition hover:bg-neutral-100 dark:border-white/15 dark:bg-neutral-900 dark:hover:bg-white/10 sm:right-4 sm:top-4 sm:h-10 sm:w-10",
            focus,
          )}
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

function useScrollSpy(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!ids.length) return undefined;

    const handler = () => {
      const position = window.scrollY + 180;

      for (let i = ids.length - 1; i >= 0; i--) {
        const element = document.getElementById(ids[i]);

        if (element && element.offsetTop <= position) {
          setActive(ids[i]);
          return;
        }
      }

      setActive(ids[0]);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, [key]);

  return active;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5">
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
      className={cn(
        "fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:bottom-5 sm:right-5 sm:h-12 sm:w-12",
        focus,
      )}
    >
      <ArrowUp size={19} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

function SkillTile({ skill, usedIn, onOpen }) {
  const name = skillName(skill);

  if (!name) return null;

  const percent = skillPercent(skill);
  const label = levelLabel(skill);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${name} skill details`}
      className={cn(
        "group flex min-h-[66px] w-full min-w-0 items-center gap-2 rounded-xl bg-neutral-50 p-2.5 text-left transition hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10 sm:min-h-[132px] sm:flex-col sm:items-stretch sm:justify-between sm:gap-3 sm:p-4",
        focus,
      )}
    >
      <TechLogo name={name} size="md" />

      <div className="min-w-0 flex-1 sm:flex sm:w-full sm:flex-col sm:gap-2">
        <p className="break-words text-xs font-semibold leading-snug sm:text-sm">
          {name}
        </p>

        {label && (
          <p className={cn("mt-0.5 hidden line-clamp-1 text-[10px] sm:block sm:text-xs", soft)}>
            {label}
          </p>
        )}

        {percent != null && (
          <div className="mt-2 hidden sm:block">
            <Bar value={percent} />
          </div>
        )}

        {usedIn > 0 && (
          <p className={cn("mt-1 hidden text-[11px] sm:block", soft)}>
            {usedIn} project{usedIn > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <ArrowUpRight
        size={14}
        className="hidden shrink-0 text-neutral-300 transition group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-white sm:block"
      />
    </button>
  );
}

function CategoryCard({ category, skills, projectCount, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const config = categoryConfig(category);
  const Icon = config.icon;

  const percents = skills.map(skillPercent).filter((value) => value != null);

  const average = percents.length
    ? Math.round(
        percents.reduce((sum, value) => sum + value, 0) / percents.length,
      )
    : null;

  return (
    <div className={cn(card, "p-3 sm:p-5 lg:p-6")}>
      <div className="mb-3 flex items-center gap-2.5 sm:mb-5 sm:items-start sm:gap-3.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl",
            toneBox(categoryId(category) === "languages" ? "sky" : categoryId(category) === "frontend" ? "violet" : categoryId(category) === "backend" ? "emerald" : categoryId(category) === "databases" ? "amber" : categoryId(category) === "realtime" ? "orange" : categoryId(category) === "tools" ? "rose" : "slate"),
          )}
        >
          <Icon size={16} className="sm:h-[18px] sm:w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="text-sm font-semibold sm:text-base">
              {categoryName(category)}
            </h3>

            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {skills.length}
            </span>

            {average != null && (
              <span className={cn("text-[10px] sm:text-[11px]", soft)}>
                {average}%
              </span>
            )}
          </div>

          <p className={cn("mt-1 hidden text-xs leading-5 sm:block", soft)}>
            {category?.description ?? config.description}
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 xl:grid-cols-3">
        {skills.map((skill, index) => (
          <li
            key={`${skillName(skill)}-${index}`}
            className={cn(
              "min-w-0",
              index >= MOBILE_SKILL_LIMIT && !expanded && "hidden sm:block",
            )}
          >
            <SkillTile
              skill={skill}
              usedIn={projectCount(skillName(skill))}
              onOpen={() => onOpen({ skill, category })}
            />
          </li>
        ))}
      </ul>

      {skills.length > MOBILE_SKILL_LIMIT && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            "mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5 sm:hidden",
            focus,
          )}
        >
          {expanded ? "Show fewer skills" : `Show all ${skills.length} skills`}
          <ArrowRight
            size={13}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </button>
      )}
    </div>
  );
}

function DetailHead({ icon: Icon, children }) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
      <Icon size={15} />
      {children}
    </h4>
  );
}

function BulletList({ items, icon: Icon = Check }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "flex items-start gap-2.5 text-sm leading-6 sm:gap-3 sm:leading-7",
            muted,
          )}
        >
          <Icon
            size={15}
            className="mt-1 shrink-0 text-neutral-900 dark:text-white"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Skill detail modal                                                  */
/* ------------------------------------------------------------------ */

function SkillDetail({
  data,
  relatedProjects,
  siblings,
  onClose,
  onSelect,
}) {
  if (!data) return null;

  const { skill, category } = data;
  const object = typeof skill === "object" && skill ? skill : {};
  const name = skillName(skill);
  const percent = skillPercent(skill);
  const label = levelLabel(skill);

  const about = firstOf(object, "description", "about", "summary");

  const learned = toList(
    firstOf(object, "learned", "learnings", "whatILearned", "learning"),
  )
    .map(textOf)
    .filter(Boolean);

  const topics = toList(
    firstOf(object, "topics", "concepts", "keywords"),
  )
    .map(textOf)
    .filter(Boolean);

  const usedFor = toList(firstOf(object, "usedFor", "useCases"))
    .map(textOf)
    .filter(Boolean);

  const nextUp = toList(firstOf(object, "next", "nextGoal", "goals"))
    .map(textOf)
    .filter(Boolean);

  const since = firstOf(object, "since", "experience", "years");

  const resources = toList(firstOf(object, "resources", "links"))
    .map((resource) =>
      typeof resource === "string"
        ? {
            title: resource,
            url: /^https?:/.test(resource) ? resource : null,
          }
        : {
            title: resource?.title ?? resource?.label ?? resource?.url,
            url: resource?.url ?? resource?.href ?? null,
          },
    )
    .filter((resource) => resource.title);

  const relatedIds = Array.isArray(object.related) ? object.related : [];

  const direct = relatedProjects.filter((project) =>
    relatedIds.includes(project?.slug ?? project?.id),
  );

  const list = direct.length ? direct : relatedProjects;

  const projectLearnings = list
    .flatMap((project) => toList(project?.learnings).map(textOf))
    .filter(Boolean)
    .slice(0, 4);

  const stats = [
    { label: "Level", value: label ?? "—" },
    {
      label: "Proficiency",
      value: percent != null ? `${percent}%` : "—",
    },
    { label: "Projects", value: list.length },
    since ? { label: "Experience", value: String(since) } : null,
  ].filter(Boolean);

  return (
    <div className="space-y-5 p-4 sm:space-y-7 sm:p-8">
      <div className="flex items-center gap-3 pr-9 sm:gap-4 sm:pr-10">
        <TechLogo name={name} size="lg" />

        <div className="min-w-0">
          <h3 className="break-words text-xl font-semibold tracking-tight sm:text-2xl">
            {name}
          </h3>
          <p className={cn("mt-1 text-xs sm:text-sm", soft)}>
            {categoryName(category)}
          </p>
        </div>
      </div>

      <div>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-neutral-50 p-3 dark:bg-white/5 sm:p-3.5"
            >
              <dt className={cn("text-[11px] sm:text-xs", soft)}>
                {stat.label}
              </dt>
              <dd className="mt-1.5 break-words text-sm font-semibold tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {percent != null && (
          <div className="mt-4">
            <Bar value={percent} />
          </div>
        )}
      </div>

      {about && (
        <div>
          <DetailHead icon={Lightbulb}>About</DetailHead>
          <p className={cn("text-sm leading-6 sm:leading-7", muted)}>
            {about}
          </p>
        </div>
      )}

      {learned.length > 0 && (
        <div>
          <DetailHead icon={BookOpen}>What I&apos;ve learned</DetailHead>
          <BulletList items={learned} />
        </div>
      )}

      {topics.length > 0 && (
        <div>
          <DetailHead icon={ListChecks}>Concepts &amp; topics</DetailHead>
          <ul className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <li
                key={`${topic}-${index}`}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-300"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

      {usedFor.length > 0 && (
        <div>
          <DetailHead icon={Target}>What I use it for</DetailHead>
          <BulletList items={usedFor} icon={ArrowRight} />
        </div>
      )}

      {projectLearnings.length > 0 && (
        <div>
          <DetailHead icon={Sparkles}>
            Lessons from building projects
          </DetailHead>
          <BulletList items={projectLearnings} icon={Lightbulb} />
        </div>
      )}

      <div>
        <DetailHead icon={Briefcase}>Where I&apos;ve used it</DetailHead>

        {list.length === 0 ? (
          <p className={cn("text-sm", soft)}>
            No project lists this skill yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {list.map((project, index) => {
              const description =
                project?.tagline ??
                project?.shortDescription ??
                project?.description ??
                "";

              return (
                <li key={`${projectTitle(project)}-${index}`}>
                  <Link
                    to={
                      project?.slug
                        ? `/projects/${project.slug}`
                        : "/projects"
                    }
                    onClick={onClose}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10 sm:p-3.5",
                      hoverCard,
                      focus,
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {projectTitle(project)}
                      </span>

                      {description && (
                        <span
                          className={cn(
                            "mt-0.5 hidden line-clamp-2 text-xs leading-5 sm:block",
                            soft,
                          )}
                        >
                          {description}
                        </span>
                      )}
                    </span>

                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-neutral-400"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {nextUp.length > 0 && (
        <div>
          <DetailHead icon={Rocket}>What&apos;s next</DetailHead>
          <BulletList items={nextUp} icon={ArrowRight} />
        </div>
      )}

      {resources.length > 0 && (
        <div>
          <DetailHead icon={ExternalLink}>Resources I used</DetailHead>
          <ul className="space-y-2">
            {resources.map((resource, index) => (
              <li key={`${resource.title}-${index}`}>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 break-all text-sm font-medium underline-offset-4 hover:underline",
                      focus,
                    )}
                  >
                    {resource.title}
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                ) : (
                  <span className={cn("text-sm", muted)}>
                    {resource.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {siblings.length > 0 && (
        <div>
          <DetailHead icon={Layers}>
            More in {categoryName(category)}
          </DetailHead>

          <ul className="flex flex-wrap gap-2">
            {siblings.slice(0, 10).map((sibling, index) => (
              <li key={`${skillName(sibling)}-${index}`}>
                <button
                  type="button"
                  onClick={() => onSelect({ skill: sibling, category })}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:border-white",
                    focus,
                  )}
                >
                  <TechLogo name={skillName(sibling)} size="sm" />
                  {skillName(sibling)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [skillModal, setSkillModal] = useState(null);

  useEffect(() => {
    document.title = "Skills — Suraj Kumar";

    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  const categories = Array.isArray(skillCategories) ? skillCategories : [];
  const roadmap = Array.isArray(learningRoadmap) ? learningRoadmap : [];
  const allProjects = Array.isArray(projects) ? projects : [];

  const totalSkillCount = categories.reduce(
    (total, category) =>
      total +
      (Array.isArray(category?.skills) ? category.skills.length : 0),
    0,
  );

  const projectsForSkill = (name) => {
    const key = canonical(name);

    return allProjects.filter((project) =>
      projectTechs(project).some((tech) => canonical(tech) === key),
    );
  };

  const projectCount = (name) => projectsForSkill(name).length;

  const filteredCategories = useMemo(() => {
    const query = normalise(search);

    return categories
      .map((category) => {
        if (
          activeCategory !== "all" &&
          categoryId(category) !== activeCategory
        ) {
          return null;
        }

        const allSkills = Array.isArray(category?.skills)
          ? category.skills
          : [];

        const categoryMatches =
          !!query &&
          normalise(
            `${categoryName(category)} ${category?.description ?? ""}`,
          ).includes(query);

        const skills = allSkills.filter((skill) => {
          const searchableText = normalise(
            `${skillName(skill)} ${
              typeof skill === "object" ? skill?.description ?? "" : ""
            }`,
          );

          const matchesQuery =
            !query || categoryMatches || searchableText.includes(query);

          const matchesLevel =
            levelFilter === "all" || levelLabel(skill) === levelFilter;

          return matchesQuery && matchesLevel;
        });

        return skills.length ? { category, skills } : null;
      })
      .filter(Boolean);
  }, [categories, search, activeCategory, levelFilter]);

  const visibleCount = filteredCategories.reduce(
    (total, entry) => total + entry.skills.length,
    0,
  );

  const flatSkills = useMemo(
    () =>
      categories.flatMap((category) =>
        (Array.isArray(category?.skills) ? category.skills : []).map(
          (skill) => ({
            skill,
            category,
            percent: skillPercent(skill),
          }),
        ),
      ),
    [categories],
  );

  const strengths = useMemo(() => {
    const featured = flatSkills.filter(
      (entry) =>
        typeof entry.skill === "object" && entry.skill?.featured,
    );

    if (featured.length) return featured.slice(0, 4);

    return flatSkills
      .filter((entry) => entry.percent != null)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4);
  }, [flatSkills]);

  const heroSkills = useMemo(
    () => (strengths.length ? strengths : flatSkills.slice(0, 5)).slice(0, 5),
    [strengths, flatSkills],
  );

  const rated = flatSkills
    .map((entry) => entry.percent)
    .filter((percent) => percent != null);

  const average = rated.length
    ? Math.round(
        rated.reduce((sum, percent) => sum + percent, 0) / rated.length,
      )
    : null;

  const hasLevels = rated.length > 0;

  const filtersActive =
    Boolean(search) ||
    activeCategory !== "all" ||
    levelFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setLevelFilter("all");
  };

  const featuredProjects = useMemo(
    () =>
      [...allProjects]
        .filter((project) => project?.slug)
        .sort(
          (a, b) => Number(!!b?.featured) - Number(!!a?.featured),
        )
        .slice(0, 3),
    [allProjects],
  );

  const categoryStats = useMemo(
    () =>
      categories
        .map((category) => {
          const skills = Array.isArray(category?.skills)
            ? category.skills
            : [];

          const percentages = skills
            .map(skillPercent)
            .filter((value) => value != null);

          return percentages.length
            ? {
                category,
                count: skills.length,
                avg: Math.round(
                  percentages.reduce((sum, value) => sum + value, 0) /
                    percentages.length,
                ),
              }
            : null;
        })
        .filter(Boolean),
    [categories],
  );

  const levelStats = useMemo(() => {
    const map = new Map();

    flatSkills.forEach(({ skill }) => {
      const level = levelLabel(skill);

      if (level) {
        map.set(level, (map.get(level) ?? 0) + 1);
      }
    });

    const total = [...map.values()].reduce(
      (sum, count) => sum + count,
      0,
    );

    return [...map.entries()].map(([label, count]) => ({
      label,
      count,
      share: total ? Math.round((count / total) * 100) : 0,
    }));
  }, [flatSkills]);

  const topUsed = useMemo(() => {
    const rows = flatSkills
      .map(({ skill, category }) => ({
        skill,
        category,
        n: projectCount(skillName(skill)),
      }))
      .filter((row) => row.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 8);

    const max = rows[0]?.n ?? 1;

    return rows.map((row) => ({
      ...row,
      share: Math.round((row.n / max) * 100),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatSkills, allProjects]);

  const certifications = toList(
    skillsData.certifications ?? skillsData.courses,
  ).filter(Boolean);

  const principles = toList(
    skillsData.principles ??
      skillsData.workflow ??
      skillsData.approach,
  ).filter(Boolean);

  const sections = useMemo(
    () =>
      [
        {
          id: "strengths",
          label: "Strengths",
          icon: Star,
          show: strengths.length > 0,
        },
        {
          id: "toolkit",
          label: "Skills",
          icon: Wrench,
          show: true,
        },
        {
          id: "overview",
          label: "Overview",
          icon: BarChart3,
          show: categoryStats.length > 0,
        },
        {
          id: "usage",
          label: "Most used",
          icon: TrendingUp,
          show: topUsed.length > 0,
        },
        {
          id: "learning",
          label: "Learning",
          icon: Lightbulb,
          show: roadmap.length > 0,
        },
        {
          id: "certs",
          label: "Courses",
          icon: Award,
          show: certifications.length > 0,
        },
        {
          id: "approach",
          label: "Approach",
          icon: ListChecks,
          show: principles.length > 0,
        },
        {
          id: "projects",
          label: "Projects",
          icon: Briefcase,
          show: featuredProjects.length > 0,
        },
      ].filter((section) => section.show),
    [
      strengths.length,
      roadmap.length,
      featuredProjects.length,
      categoryStats.length,
      topUsed.length,
      certifications.length,
      principles.length,
    ],
  );

  const active = useScrollSpy(sections.map((section) => section.id));

  const brief = [
    { icon: Braces, label: "Skills", value: totalSkillCount, tone: "violet" },
    { icon: Layers, label: "Categories", value: categories.length, tone: "sky" },
    { icon: Briefcase, label: "Projects", value: allProjects.length, tone: "emerald" },
    {
      icon: Target,
      label: "Avg level",
      value: average != null ? `${average}%` : null,
      tone: "amber",
    },
  ].filter((item) => item.value != null && item.value !== 0);

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* HERO */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-14 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "mb-5 flex items-center gap-1.5 text-xs sm:mb-8 sm:text-sm",
              soft,
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
            <span className="text-neutral-900 dark:text-white">Skills</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-medium dark:border-white/10 dark:bg-white/5 sm:text-xs">
                  <Sparkles size={12} className={toneText("violet")} />
                  Skills &amp; expertise
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                My technical{" "}
                <span className="text-neutral-400 dark:text-neutral-500">
                  toolkit.
                </span>
              </h1>

              <p className={cn("mt-3 max-w-xl text-sm leading-6 sm:mt-5 sm:text-lg sm:leading-8", muted)}>
                Computer Science Engineering student and full-stack developer
                building useful, responsive and reliable web applications.
              </p>

              {heroSkills.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2 sm:mt-7">
                  {heroSkills.map(({ skill }, index) => (
                    <li
                      key={`${skillName(skill)}-${index}`}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-2.5 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 sm:gap-2 sm:pr-3 sm:text-xs",
                        index >= 3 && "hidden sm:inline-flex",
                      )}
                    >
                      <TechLogo name={skillName(skill)} size="sm" />
                      {skillName(skill)}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
                <a
                  href="#toolkit"
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 text-xs font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:min-h-11 sm:px-5 sm:text-sm",
                    focus,
                  )}
                >
                  Browse skills
                  <ArrowRight size={15} />
                </a>

                <Link
                  to="/contact"
                  className={cn(
                    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 sm:min-h-11 sm:px-5 sm:text-sm",
                    focus,
                  )}
                >
                  <Mail size={15} />
                  Contact me
                </Link>
              </div>
            </div>

            {/* COMPACT SUMMARY */}
            <div className={cn(card, "h-fit p-3.5 sm:p-7")}>
              <div className="mb-3 flex items-center gap-3 sm:mb-5">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl", toneBox("violet"))}>
                  <Braces size={17} />
                </span>

                <div>
                  <h2 className="text-sm font-semibold leading-tight sm:text-base">
                    Skills at a glance
                  </h2>
                  <p className={cn("hidden text-xs sm:block", soft)}>
                    Numbers from my toolkit
                  </p>
                </div>
              </div>

              {brief.length > 0 && (
                <dl className="grid grid-cols-2 gap-2 sm:gap-3">
                  {brief.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-neutral-50 p-2.5 dark:bg-white/5 sm:p-3.5"
                    >
                      <dt className={cn("flex items-center gap-1.5 text-[10px] sm:text-xs", soft)}>
                        <item.icon size={12} className={toneText(item.tone)} />
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold tabular-nums sm:mt-1.5 sm:text-xl">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-3 hidden items-start gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-white/5 sm:flex sm:mt-5">
                <Target size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-semibold">Current focus</p>
                  <p className={cn("mt-1 text-sm leading-6", muted)}>
                    Full-stack development, REST APIs, real-time applications
                    and networking projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE NAV */}
      <nav
        aria-label="Sections"
        className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur dark:border-white/10 dark:bg-neutral-950/95 lg:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-4 py-2">
          {sections
            .filter(
              (section) =>
                section.id !== "overview" && section.id !== "usage",
            )
            .map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                    active === section.id
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5",
                  )}
                >
                  <section.icon size={12} className={active === section.id ? "" : toneText(sectionTone(section.id))} />
                  {section.label}
                </a>
              </li>
            ))}
        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-7 lg:grid-cols-[230px_1fr] lg:gap-16">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">
                    On this page
                  </p>

                  <ul>
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            active === section.id
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5",
                          )}
                        >
                          <section.icon size={14} className={active === section.id ? "" : toneText(sectionTone(section.id))} />
                          {section.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="min-w-0 space-y-10 sm:space-y-20">
              {/* CORE STRENGTHS */}
              {strengths.length > 0 && (
                <Block
                  id="strengths"
                  icon={Star}
                  title="Core strengths"
                  subtitle="The skills I reach for first on a new project."
                  count={strengths.length}
                >
                  <ul className="grid grid-cols-2 gap-2 sm:gap-3">
                    {strengths.map(({ skill, category, percent }, index) => (
                      <li key={`${skillName(skill)}-${index}`}>
                        <button
                          type="button"
                          onClick={() => setSkillModal({ skill, category })}
                          className={cn(
                            card,
                            "flex h-full w-full min-w-0 items-center gap-2 p-2.5 text-left sm:gap-4 sm:p-5",
                            hoverCard,
                            focus,
                          )}
                        >
                          <TechLogo name={skillName(skill)} size="lg" />

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-xs font-semibold sm:text-base">
                              {skillName(skill)}
                            </p>

                            <p className={cn("mt-0.5 hidden truncate text-xs sm:block", soft)}>
                              {categoryName(category)}
                              {levelLabel(skill)
                                ? ` · ${levelLabel(skill)}`
                                : ""}
                            </p>

                            {percent != null && (
                              <div className="mt-2 sm:hidden">
                                <Bar value={percent} />
                              </div>
                            )}
                          </div>

                          {percent != null && <Ring value={percent} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* TOOLKIT */}
              <Block
                id="toolkit"
                icon={Wrench}
                title="My skills"
                subtitle="Select a skill to view details and related projects."
                count={`${visibleCount}/${totalSkillCount}`}
              >
                <div className={cn(card, "mb-3 space-y-3 p-3 sm:mb-6 sm:space-y-4 sm:p-5")}>
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search skills..."
                      aria-label="Search skills"
                      className="min-h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white sm:min-h-11"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <Chip
                      active={activeCategory === "all"}
                      onClick={() => setActiveCategory("all")}
                      count={totalSkillCount}
                    >
                      All
                    </Chip>

                    {categories.map((category) => (
                      <Chip
                        key={categoryId(category)}
                        active={activeCategory === categoryId(category)}
                        onClick={() => setActiveCategory(categoryId(category))}
                        count={
                          Array.isArray(category?.skills)
                            ? category.skills.length
                            : 0
                        }
                      >
                        {categoryName(category)}
                      </Chip>
                    ))}
                  </div>

                  {(hasLevels || filtersActive) && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-3 dark:border-white/10 sm:pt-4">
                      {hasLevels && (
                        <>
                          <span className={cn("text-[11px] sm:text-xs", soft)}>
                            Level:
                          </span>

                          {LEVEL_FILTERS.map((level) => (
                            <Chip
                              key={level}
                              active={levelFilter === level}
                              onClick={() => setLevelFilter(level)}
                            >
                              {level === "all" ? "Any" : level}
                            </Chip>
                          ))}
                        </>
                      )}

                      {filtersActive && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className={cn(
                            "ml-auto inline-flex items-center gap-1 text-xs hover:text-neutral-900 dark:hover:text-white",
                            soft,
                          )}
                        >
                          <X size={12} />
                          Reset
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {filteredCategories.map((entry) => (
                    <CategoryCard
                      key={categoryId(entry.category)}
                      category={entry.category}
                      skills={entry.skills}
                      projectCount={projectCount}
                      onOpen={setSkillModal}
                    />
                  ))}
                </div>

                {filteredCategories.length === 0 && (
                  <div className={cn(card, "border-dashed px-4 py-10 text-center sm:px-6 sm:py-14")}>
                    <Search
                      size={22}
                      className="mx-auto mb-3 text-neutral-400"
                    />
                    <p className="text-sm font-semibold sm:text-base">
                      No matching skills
                    </p>
                    <p className={cn("mt-1 text-xs sm:text-sm", soft)}>
                      Try another keyword or reset the filters.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={cn(
                        "mt-4 inline-flex min-h-10 items-center rounded-full border border-neutral-300 px-4 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 sm:mt-5 sm:min-h-11 sm:px-5 sm:text-sm",
                        focus,
                      )}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </Block>

              {/* OVERVIEW: DESKTOP ONLY */}
              {categoryStats.length > 0 && (
                <div className="hidden sm:block">
                  <Block
                    id="overview"
                    icon={BarChart3}
                    title="Skill overview"
                    subtitle="How my skills are spread across categories and levels."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={cn(card, "p-6")}>
                        <p className="mb-5 flex items-center gap-2 text-sm font-semibold">
                          <TrendingUp size={15} />
                          Average by category
                        </p>

                        <ul className="space-y-4">
                          {categoryStats.map(({ category, avg, count }) => {
                            const CategoryIcon = categoryConfig(category).icon;

                            return (
                              <li key={categoryId(category)}>
                                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                                  <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
                                    <CategoryIcon size={13} className="shrink-0" />
                                    <span className="truncate">
                                      {categoryName(category)}
                                    </span>
                                  </span>

                                  <span className={cn("shrink-0 text-xs tabular-nums", soft)}>
                                    {avg}% · {count}
                                  </span>
                                </div>
                                <Bar value={avg} />
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {levelStats.length > 0 && (
                        <div className={cn(card, "p-6")}>
                          <p className="mb-5 flex items-center gap-2 text-sm font-semibold">
                            <Layers size={15} />
                            Level distribution
                          </p>

                          <ul className="space-y-4">
                            {levelStats.map(({ label, count, share }) => (
                              <li key={label}>
                                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                                  <span className="font-medium">{label}</span>
                                  <span className={cn("text-xs tabular-nums", soft)}>
                                    {count} skills · {share}%
                                  </span>
                                </div>
                                <Bar value={share} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Block>
                </div>
              )}

              {/* MOST USED: DESKTOP ONLY */}
              {topUsed.length > 0 && (
                <div className="hidden sm:block">
                  <Block
                    id="usage"
                    icon={TrendingUp}
                    title="Most used in projects"
                    subtitle="The technologies that show up in most of my builds."
                    count={topUsed.length}
                  >
                    <ul className="grid grid-cols-2 gap-3">
                      {topUsed.map(({ skill, category, n, share }, index) => (
                        <li key={`${skillName(skill)}-${index}`}>
                          <button
                            type="button"
                            onClick={() => setSkillModal({ skill, category })}
                            className={cn(
                              card,
                              "flex w-full items-center gap-4 p-4 text-left",
                              hoverCard,
                              focus,
                            )}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold tabular-nums dark:bg-white/10">
                              {index + 1}
                            </span>

                            <TechLogo name={skillName(skill)} size="md" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-semibold">
                                  {skillName(skill)}
                                </p>
                                <span className={cn("shrink-0 text-xs", soft)}>
                                  {n} project{n > 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="mt-2">
                                <Bar value={share} />
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Block>
                </div>
              )}

              {/* LEARNING ROADMAP */}
              {roadmap.length > 0 && (
                <Block
                  id="learning"
                  icon={Lightbulb}
                  title="Learning roadmap"
                  subtitle="What I'm strengthening and exploring next."
                  count={roadmap.length}
                >
                  <ol className="space-y-2 sm:space-y-0">
                    {roadmap.map((item, index) => {
                      const state = roadmapState(item);
                      const title =
                        item?.title ??
                        item?.name ??
                        item?.topic ??
                        "Learning goal";

                      const description =
                        item?.description ?? item?.summary ?? "";

                      return (
                        <li
                          key={`${title}-${index}`}
                          className="relative grid grid-cols-[1.75rem_1fr] gap-2 sm:grid-cols-[2.5rem_1fr] sm:gap-4 sm:pb-6"
                        >
                          {index < roadmap.length - 1 && (
                            <span
                              aria-hidden="true"
                              className="absolute bottom-0 left-3.5 top-8 hidden w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20 sm:block sm:left-5 sm:top-10"
                            />
                          )}

                          <span
                            className={cn(
                              "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold sm:h-10 sm:w-10 sm:text-sm",
                              toneBox("amber"),
                            )}
                          >
                            {index + 1}
                          </span>

                          <div className={cn(card, "min-w-0 p-3 sm:p-5")}>
                            <div className="flex flex-wrap items-start gap-2">
                              <h3 className="min-w-0 flex-1 text-xs font-semibold sm:text-base">
                                {title}
                              </h3>
                              <StatusBadge
                                state={state}
                                label={item?.status}
                              />
                            </div>

                            {description && (
                              <p className={cn("mt-1.5 hidden text-sm leading-7 sm:block", muted)}>
                                {description}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Block>
              )}

              {/* COURSES */}
              {certifications.length > 0 && (
                <Block
                  id="certs"
                  icon={Award}
                  title="Courses & certifications"
                  subtitle="Formal learning that backs these skills."
                  count={certifications.length}
                >
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    {certifications.map((certification, index) => {
                      const title =
                        typeof certification === "string"
                          ? certification
                          : certification?.title ??
                            certification?.name ??
                            "Course";

                      const issuer =
                        typeof certification === "object"
                          ? certification?.issuer ??
                            certification?.platform ??
                            certification?.provider
                          : null;

                      const when =
                        typeof certification === "object"
                          ? certification?.year ?? certification?.date
                          : null;

                      const url =
                        typeof certification === "object"
                          ? certification?.url ?? certification?.link
                          : null;

                      const content = (
                        <>
                          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl", toneBox("rose"))}>
                            <Award size={16} className="sm:h-[18px] sm:w-[18px]" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-semibold leading-snug sm:text-sm">
                              {title}
                            </p>

                            {(issuer || when) && (
                              <p className={cn("mt-1 hidden line-clamp-1 text-xs sm:block", soft)}>
                                {[issuer, when].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>

                          {url && (
                            <ArrowUpRight
                              size={15}
                              className="shrink-0 text-neutral-400"
                            />
                          )}
                        </>
                      );

                      return (
                        <li key={`${title}-${index}`}>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                card,
                                "flex h-full items-center gap-3 p-3 sm:gap-4 sm:p-5",
                                hoverCard,
                                focus,
                              )}
                            >
                              {content}
                            </a>
                          ) : (
                            <div className={cn(card, "flex h-full items-center gap-3 p-3 sm:gap-4 sm:p-5")}>
                              {content}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* HOW I WORK */}
              {principles.length > 0 && (
                <Block
                  id="approach"
                  icon={ListChecks}
                  title="How I work"
                  subtitle="Habits and principles behind the code."
                  count={principles.length}
                >
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    {principles.map((principle, index) => {
                      const title =
                        typeof principle === "object"
                          ? principle?.title ?? principle?.name
                          : null;

                      const description =
                        typeof principle === "string"
                          ? principle
                          : principle?.description ?? principle?.text;

                      return (
                        <li
                          key={index}
                          className={cn(card, "flex items-start gap-2.5 p-3 sm:gap-3.5 sm:p-5")}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10 sm:h-8 sm:w-8">
                            <Check size={13} />
                          </span>

                          <div className="min-w-0">
                            {title && (
                              <h3 className="text-xs font-semibold sm:text-sm">
                                {title}
                              </h3>
                            )}

                            {description && (
                              <p
                                className={cn(
                                  "text-xs leading-5 sm:text-sm sm:leading-7",
                                  muted,
                                  title ? "mt-1" : "pt-0.5",
                                )}
                              >
                                {description}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* PROJECTS */}
              {featuredProjects.length > 0 && (
                <Block
                  id="projects"
                  icon={Briefcase}
                  title="Skills in action"
                  subtitle="Where these technologies were put to work."
                  action={
                    <Link
                      to="/projects"
                      className={cn(
                        "hidden items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline sm:inline-flex",
                        focus,
                      )}
                    >
                      View all
                      <ArrowRight size={14} />
                    </Link>
                  }
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                    {featuredProjects.map((project) => {
                      const techs = projectTechs(project);

                      return (
                        <Link
                          key={project.slug}
                          to={`/projects/${project.slug}`}
                          className={cn(
                            "group flex min-w-0 items-center gap-3 p-3 sm:h-full sm:flex-col sm:items-stretch sm:justify-between sm:p-5",
                            card,
                            hoverCard,
                            focus,
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate text-sm font-semibold tracking-tight sm:text-lg">
                                {projectTitle(project)}
                              </h3>
                              <ArrowUpRight
                                size={15}
                                className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white sm:hidden"
                              />
                            </div>

                            {project.category && (
                              <p className={cn("mt-1 text-[11px] sm:text-sm", soft)}>
                                {project.category}
                              </p>
                            )}

                            <p className={cn("mt-1 hidden text-xs sm:block", soft)}>
                              {project.status ?? ""}
                            </p>
                          </div>

                          <ul className="flex shrink-0 gap-1.5 sm:mt-4 sm:flex-wrap">
                            {techs.slice(0, 3).map((name) => (
                              <li key={name} title={name}>
                                <TechLogo name={name} size="sm" />
                              </li>
                            ))}
                          </ul>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    to="/projects"
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-4 hover:underline sm:mt-4",
                      focus,
                    )}
                  >
                    View all projects
                    <ArrowRight size={14} />
                  </Link>
                </Block>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-20 lg:px-12">
        <div className="rounded-2xl bg-neutral-900 px-4 py-6 text-white dark:bg-white dark:text-neutral-900 sm:rounded-[2rem] sm:px-12 sm:py-14">
          <h2 className="max-w-xl text-xl font-semibold tracking-tight sm:text-4xl">
            Have an idea worth building?
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-5 opacity-70 sm:mt-3 sm:text-sm sm:leading-7">
            Let&apos;s talk web development, collaboration or an opportunity
            to build something useful.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700 sm:min-h-12 sm:gap-2 sm:px-6 sm:text-sm"
            >
              <Mail size={14} />
              Contact
            </Link>

            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/30 px-3.5 text-xs font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10 sm:min-h-12 sm:gap-2 sm:px-6 sm:text-sm"
            >
              <Github size={14} />
              GitHub
            </a>

            <Link
              to="/projects"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/30 px-3.5 text-xs font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10 sm:min-h-12 sm:gap-2 sm:px-6 sm:text-sm"
            >
              <Rocket size={14} />
              Projects
            </Link>
          </div>
        </div>
      </section>

      {/* SKILL DETAILS MODAL */}
      <Modal
        open={!!skillModal}
        onClose={() => setSkillModal(null)}
        label="Skill details"
      >
        <SkillDetail
          data={skillModal}
          relatedProjects={
            skillModal
              ? projectsForSkill(skillName(skillModal.skill))
              : []
          }
          siblings={
            skillModal
              ? (
                  Array.isArray(skillModal.category?.skills)
                    ? skillModal.category.skills
                    : []
                ).filter(
                  (skill) =>
                    skillName(skill) !== skillName(skillModal.skill),
                )
              : []
          }
          onSelect={setSkillModal}
          onClose={() => setSkillModal(null)}
        />
      </Modal>
    </main>
  );
}
