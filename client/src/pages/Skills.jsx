import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Database,
  ExternalLink,
  FileCode2,
  Github,
  Globe,
  Image as ImageIcon,
  Layers3,
  LayoutGrid,
  List,
  MonitorSmartphone,
  Network,
  Rocket,
  Search,
  Server,
  Sparkles,
  Star,
  Target,
  Terminal,
  Wrench,
  X,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Cpu,
  Cloud,
  GitBranch,
  ShieldCheck,
  Briefcase,
  Zap,
} from "lucide-react";
import * as SimpleIcons from "simple-icons";

import {
  skillCategories,
  learningRoadmap,
  proficiencyPercent,
} from "../data/skills";
import { projects } from "../data/projects";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const CATEGORY_CONFIG = {
  languages: {
    icon: Code2,
    description:
      "Languages I use for programming, scripting and problem-solving.",
  },
  frontend: {
    icon: MonitorSmartphone,
    description:
      "Responsive interfaces, reusable components and accessible UX.",
  },
  backend: {
    icon: Server,
    description:
      "APIs, server-side logic and real-time application functionality.",
  },
  databases: {
    icon: Database,
    description: "Data modelling, queries and application data management.",
  },
  realtime: {
    icon: Network,
    description:
      "Peer-to-peer communication, signaling and connection lifecycle.",
  },
  tools: {
    icon: Wrench,
    description: "Tools used for development, debugging and deployment.",
  },
  ui: {
    icon: Layers3,
    description: "Component libraries and routing tools.",
  },
};

const TECHNOLOGY_LOGOS = {
  javascript: "siJavascript",
  js: "siJavascript",
  python: "siPython",
  react: "siReact",
  "react.js": "siReact",
  vite: "siVite",
  tailwind: "siTailwindcss",
  "tailwind css": "siTailwindcss",
  node: "siNodedotjs",
  "node.js": "siNodedotjs",
  nodejs: "siNodedotjs",
  express: "siExpress",
  "express.js": "siExpress",
  mongodb: "siMongodb",
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
  firebase: "siFirebase",
  "next.js": "siNextdotjs",
  nextjs: "siNextdotjs",
  "socket.io": "siSocketdotio",
  socketio: "siSocketdotio",
  mysql: "siMysql",
  redis: "siRedis",
  figma: "siFigma",
  linux: "siLinux",
};

const LEVEL_FILTERS = ["all", "Used in Projects", "Working Knowledge", "Familiar"];

const SORT_OPTIONS = [
  { id: "default", label: "Default order" },
  { id: "level", label: "Highest level" },
  { id: "name", label: "A – Z" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function normalise(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .replace(/\s+/g, " ");
}

function skillName(skill) {
  if (typeof skill === "string") return skill;
  return skill?.name ?? skill?.title ?? skill?.label ?? "";
}

function categoryName(category) {
  return (
    category?.name ??
    category?.title ??
    category?.label ??
    category?.id ??
    "Other skills"
  );
}

function categoryId(category) {
  return normalise(category?.id ?? category?.slug ?? category?.name);
}

function categoryConfig(category) {
  const id = categoryId(category);
  return (
    CATEGORY_CONFIG[id] ?? {
      icon: Layers3,
      description: "Technologies and concepts used in my development workflow.",
    }
  );
}

function getLogo(name) {
  const iconName = TECHNOLOGY_LOGOS[normalise(name)];
  return iconName ? SimpleIcons[iconName] ?? null : null;
}

function canonical(name) {
  const key = normalise(name);
  return TECHNOLOGY_LOGOS[key] ?? key;
}

function skillPercent(skill) {
  if (!skill || typeof skill !== "object") return null;
  const direct = skill.proficiency ?? skill.percentage ?? skill.percent;
  if (typeof direct === "number") return Math.max(0, Math.min(100, direct));
  if (typeof skill.level === "number") {
    return Math.max(0, Math.min(100, skill.level));
  }
  if (typeof skill.level === "string") {
    return proficiencyPercent[skill.level] ?? null;
  }
  return null;
}

function levelLabel(skill) {
  if (!skill || typeof skill !== "object") return null;
  if (typeof skill.level === "string") return skill.level;
  return null;
}

function techName(technology) {
  return typeof technology === "string"
    ? technology
    : technology?.name ?? technology?.title ?? "";
}

function projectTechs(project) {
  const list = project?.technologies ?? project?.techStack ?? project?.tech ?? [];
  return Array.isArray(list) ? list.map(techName).filter(Boolean) : [];
}

function projectTitle(project) {
  return project?.title ?? project?.name ?? "Project";
}

function projectSlug(project) {
  return project?.slug ?? null;
}

function projectImages(project) {
  const list = [];
  const main = project?.image ?? project?.thumbnail ?? project?.cover;
  if (main) list.push(main);

  if (Array.isArray(project?.preview)) {
    project.preview.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  if (Array.isArray(project?.gallery)) {
    project.gallery.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  if (Array.isArray(project?.images)) {
    project.images.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  return list;
}

function projectLinks(project) {
  return {
    github: project?.links?.github ?? project?.github,
    live: project?.links?.live ?? project?.live ?? project?.demo,
  };
}

function projectStatus(project) {
  const status = normalise(project?.status);
  if (!status) return null;
  if (/(complete|done|live|deployed|launched)/.test(status)) {
    return { label: "Completed", tone: "done" };
  }
  if (/(progress|ongoing|building|develop)/.test(status)) {
    return { label: "In progress", tone: "progress" };
  }
  if (/(prototype|experimental|exploratory)/.test(status)) {
    return { label: "Prototype", tone: "prototype" };
  }
  return { label: project.status, tone: "other" };
}

function roadmapState(item) {
  const status = normalise(item?.status ?? item?.stage ?? "");
  if (/(complete|done|learned|finished)/.test(status)) return "done";
  if (/(progress|learning|current|ongoing|now)/.test(status)) return "progress";
  return "planned";
}

const STATUS_STYLES = {
  done: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20",
  progress:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/20",
  prototype:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-400/20",
  planned:
    "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-white/[0.05] dark:text-neutral-300 dark:border-white/10",
  other:
    "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-white/[0.05] dark:text-neutral-300 dark:border-white/10",
};

const STATUS_ICONS = {
  done: Check,
  progress: Clock,
  prototype: Sparkles,
  planned: Target,
  other: Star,
};

/* ------------------------------------------------------------------ */
/*  SHARED UI (matches Home / About / Projects)                        */
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

function TechnologyLogo({ name, size = "md" }) {
  const logo = getLogo(name);
  const box =
    size === "sm"
      ? "h-7 w-7 rounded-lg"
      : size === "lg"
        ? "h-14 w-14 rounded-2xl"
        : "h-10 w-10 rounded-xl";
  const icon =
    size === "sm"
      ? "h-[15px] w-[15px]"
      : size === "lg"
        ? "h-[28px] w-[28px]"
        : "h-[21px] w-[21px]";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center border border-neutral-200 bg-white text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100",
        box
      )}
    >
      {logo ? (
        <svg
          viewBox="0 0 24 24"
          className={icon}
          role="img"
          aria-label={`${name} logo`}
        >
          <path d={logo.path} fill="currentColor" />
        </svg>
      ) : (
        <Code2 className={icon} strokeWidth={1.7} />
      )}
    </span>
  );
}

function ProgressBar({ value, className }) {
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/[0.07]",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-neutral-900 transition-all duration-700 dark:bg-white"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ProgressRing({ value, size = 72 }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
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
          strokeDashoffset={offset}
          className="stroke-neutral-900 transition-all duration-700 dark:stroke-white"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
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
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition",
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:bg-transparent dark:text-neutral-300 dark:hover:border-white/30"
      )}
    >
      {children}
      {count != null && (
        <span
          className={cn(
            "tabular-nums",
            active ? "opacity-70" : "text-neutral-400"
          )}
        >
          {count}
        </span>
      )}
    </button>
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

function Modal({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-neutral-200 bg-white text-neutral-900 shadow-2xl dark:border-white/10 dark:bg-[#121214] dark:text-neutral-100 sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:bg-white/20"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ProjectImage({ src, alt, className, fallbackIcon: FallbackIcon = ImageIcon }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 dark:from-white/[0.06] dark:to-white/[0.02] dark:text-neutral-600",
          className
        )}
        aria-label={`${alt} (no preview available)`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <FallbackIcon size={30} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const tone = projectStatus({ status })?.tone ?? "other";
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
/*  SKILL CARD                                                         */
/* ------------------------------------------------------------------ */

function TechnologyItem({ skill, usedIn, onOpen, view }) {
  const name = skillName(skill);
  if (!name) return null;

  const percent = skillPercent(skill);
  const label = levelLabel(skill);

  return (
    <button
      type="button"
      onClick={() => onOpen(skill)}
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25",
        view === "list" && "sm:gap-5"
      )}
    >
      <TechnologyLogo name={name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {name}
          </p>
          {label && (
            <span className="shrink-0 text-[11px] text-neutral-500 dark:text-neutral-400">
              {label}
            </span>
          )}
        </div>

        {percent != null ? (
          <ProgressBar value={percent} className="mt-2" />
        ) : (
          <p className="mt-1 text-xs text-neutral-400">Click for details</p>
        )}

        {usedIn > 0 && (
          <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            Used in {usedIn} project{usedIn > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <ArrowDownRight
        size={15}
        className="shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-neutral-600 dark:text-neutral-600 dark:group-hover:text-neutral-300"
      />
    </button>
  );
}

function CategorySection({ category, skills, index, view, projectCount, onOpen }) {
  const config = categoryConfig(category);
  const Icon = config.icon;
  if (!skills.length) return null;

  const percents = skills.map(skillPercent).filter((p) => p != null);
  const average = percents.length
    ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
    : null;

  return (
    <Reveal delay={index * 50}>
      <section className="min-w-0">
        <div className="mb-6 flex items-start gap-4">
          <IconBox icon={Icon} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                {categoryName(category)}
              </h3>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/[0.07] dark:text-neutral-400">
                {skills.length}
              </span>
              {average != null && (
                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                  avg {average}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              {category?.description ?? config.description}
            </p>
          </div>
          <span className="hidden pt-1 text-xs tabular-nums text-neutral-400 sm:block">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-3",
            view === "grid" && "sm:grid-cols-2"
          )}
        >
          {skills.map((skill, i) => (
            <TechnologyItem
              key={`${skillName(skill)}-${i}`}
              skill={skill}
              view={view}
              usedIn={projectCount(skillName(skill))}
              onOpen={(s) => onOpen({ skill: s, category })}
            />
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function SkillDetail({ data, relatedProjects, onOpenProject }) {
  if (!data) return null;
  const { skill, category } = data;
  const name = skillName(skill);
  const percent = skillPercent(skill);
  const label = levelLabel(skill);
  const description = typeof skill === "object" ? skill?.description : null;
  const relatedIds =
    typeof skill === "object" && Array.isArray(skill?.related) ? skill.related : [];

  const directlyRelated = relatedProjects.filter((p) =>
    relatedIds.includes(p?.slug ?? p?.id)
  );
  const relatedList = directlyRelated.length ? directlyRelated : relatedProjects;

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-4 pr-10">
        <TechnologyLogo name={name} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-2xl font-semibold tracking-tight">
            {name}
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {categoryName(category)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Level</p>
          <p className="mt-1 text-sm font-semibold">{label ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Proficiency</p>
          <p className="mt-1 text-sm font-semibold tabular-nums">
            {percent != null ? `${percent}%` : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-white/10">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Projects</p>
          <p className="mt-1 text-sm font-semibold">{relatedList.length}</p>
        </div>
      </div>

      {percent != null && (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Proficiency</span>
            <span className="tabular-nums">{percent}%</span>
          </div>
          <ProgressBar value={percent} />
        </div>
      )}

      {description && (
        <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      <div className="mt-7">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Where I&apos;ve used it
        </h4>
        {relatedList.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            No project lists this skill yet.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {relatedList.map((project, i) => (
              <button
                key={`${projectTitle(project)}-${i}`}
                type="button"
                onClick={() => onOpenProject(project)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-neutral-200 p-2.5 text-left transition hover:border-neutral-400 dark:border-white/10 dark:hover:border-white/25"
              >
                <ProjectImage
                  src={projectImages(project)[0]}
                  alt={projectTitle(project)}
                  className="h-12 w-16 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {projectTitle(project)}
                  </p>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {project?.shortDescription ?? project?.description ?? ""}
                  </p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-neutral-400 transition group-hover:text-neutral-800 dark:group-hover:text-white"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CORE STRENGTHS                                                     */
/* ------------------------------------------------------------------ */

function StrengthsSection({ items, onOpen }) {
  if (!items.length) return null;

  return (
    <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <SectionLabel>Core strengths</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
            Where I&apos;m strongest
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
            The skills I reach for first when starting a new project — marked
            as <span className="font-medium text-neutral-700 dark:text-neutral-300">featured</span> in the toolkit.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map(({ skill, category, percent }, i) => (
            <Reveal key={`${skillName(skill)}-${i}`} delay={i * 60}>
              <button
                type="button"
                onClick={() => onOpen({ skill, category })}
                className="group flex h-full w-full flex-col items-start gap-5 rounded-2xl border border-neutral-200/80 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6"
              >
                <div className="flex w-full items-center justify-between">
                  <TechnologyLogo name={skillName(skill)} />
                  {percent != null && <ProgressRing value={percent} size={56} />}
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {skillName(skill)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {categoryName(category)}
                    {levelLabel(skill) ? ` · ${levelLabel(skill)}` : ""}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ROADMAP                                                            */
/* ------------------------------------------------------------------ */

function RoadmapSection({ items }) {
  const [filter, setFilter] = useState("all");

  const enriched = items.map((item) => ({ item, state: roadmapState(item) }));
  const counts = {
    all: enriched.length,
    progress: enriched.filter((e) => e.state === "progress").length,
    planned: enriched.filter((e) => e.state === "planned").length,
    done: enriched.filter((e) => e.state === "done").length,
  };
  const visible = enriched.filter((e) => filter === "all" || e.state === filter);

  if (!items.length) return null;

  const stateLabel = {
    done: "Completed",
    progress: "In progress",
    planned: "Up next",
  };

  return (
    <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <SectionLabel>Continuous learning</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
            Always learning. Always building.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
            I keep strengthening my fundamentals and exploring tools that help
            me build better, more reliable applications.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal delay={40}>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  count={counts.all}
                >
                  All
                </Chip>
                <Chip
                  active={filter === "progress"}
                  onClick={() => setFilter("progress")}
                  count={counts.progress}
                >
                  In progress
                </Chip>
                <Chip
                  active={filter === "planned"}
                  onClick={() => setFilter("planned")}
                  count={counts.planned}
                >
                  Up next
                </Chip>
                <Chip
                  active={filter === "done"}
                  onClick={() => setFilter("done")}
                  count={counts.done}
                >
                  Completed
                </Chip>
              </div>
            </div>
          </Reveal>

          <div className="divide-y divide-neutral-200 dark:divide-white/[0.08]">
            {visible.length === 0 && (
              <p className="py-6 text-sm text-neutral-500 dark:text-neutral-400">
                Nothing here yet.
              </p>
            )}

            {visible.map(({ item, state }, index) => {
              const title = item?.title ?? item?.name ?? item?.topic ?? "Learning goal";
              const description = item?.description ?? item?.summary ?? "";
              const StateIcon =
                state === "done"
                  ? Check
                  : state === "progress"
                    ? Rocket
                    : Target;

              return (
                <Reveal key={`${title}-${index}`} delay={index * 50}>
                  <div className="flex gap-4 py-5">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        STATUS_STYLES[state]
                      )}
                    >
                      <StateIcon size={16} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {title}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            STATUS_STYLES[state]
                          )}
                        >
                          {item?.status ?? stateLabel[state]}
                        </span>
                      </div>

                      {description && (
                        <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PROJECTS                                                           */
/* ------------------------------------------------------------------ */

function ProjectCard({ project, onOpen, onTech, activeTech }) {
  const title = projectTitle(project);
  const description =
    project?.shortDescription ??
    project?.description ??
    "A project built with modern development tools.";
  const technologies = projectTechs(project);
  const status = projectStatus(project);
  const { github, live } = projectLinks(project);
  const images = projectImages(project);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative block text-left"
        aria-label={`Open ${title}`}
      >
        <ProjectImage
          src={images[0]}
          alt={`${title} preview`}
          className="aspect-[16/10] w-full transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {project?.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/90 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur dark:bg-white/90 dark:text-neutral-900">
              <Star size={10} /> Featured
            </span>
          )}
          {status && (
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur",
                STATUS_STYLES[status.tone]
              )}
            >
              {status.label}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur">
            <ImageIcon size={10} /> {images.length}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {(project?.category || project?.year) && (
              <p className="mb-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {[project?.category, project?.year].filter(Boolean).join(" · ")}
              </p>
            )}
            <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} source code`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                <Github size={16} />
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} live demo`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>

        {technologies.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {technologies.slice(0, 5).map((name, i) => (
              <button
                key={`${name}-${i}`}
                type="button"
                onClick={() => onTech(name)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
                  canonical(activeTech) === canonical(name) && activeTech
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/30"
                )}
              >
                {name}
              </button>
            ))}
            {technologies.length > 5 && (
              <span className="px-1 py-1 text-[10px] text-neutral-400">
                +{technologies.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectDetailModal({ project, onClose }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [project]);

  if (!project) return null;

  const title = projectTitle(project);
  const images = projectImages(project);
  const technologies = projectTechs(project);
  const status = projectStatus(project);
  const { github, live } = projectLinks(project);
  const features = Array.isArray(project?.features) ? project.features : [];
  const href = projectSlug(project) ? `/projects/${project.slug}` : null;

  const go = (step) =>
    setActive((current) => (current + step + images.length) % images.length);

  return (
    <div>
      <div className="relative">
        <ProjectImage
          src={images[active]}
          alt={`${title} screenshot ${active + 1}`}
          className="aspect-[16/9] w-full"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/55"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {status && (
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                STATUS_STYLES[status.tone]
              )}
            >
              {status.label}
            </span>
          )}
          {project?.category && (
            <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              {project.category}
            </span>
          )}
          {project?.year && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <Calendar size={11} /> {project.year}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
          {project?.description ?? project?.shortDescription}
        </p>

        {features.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Key features
            </h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {features.map((feature, i) => {
                const name =
                  typeof feature === "string" ? feature : feature?.name;
                return (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500"
                    />
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {technologies.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Built with
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1 pr-3 text-xs dark:border-white/10"
                >
                  <TechnologyLogo name={name} size="sm" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Live demo <ExternalLink size={15} />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              <Github size={15} /> Source code
            </a>
          )}
          {href && (
            <Link
              to={href}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              Full case study <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ allProjects, onOpen }) {
  const [category, setCategory] = useState("all");
  const [tech, setTech] = useState("");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const map = new Map();
    allProjects.forEach((p) => {
      const c = primaryCategory(p);
      if (c) map.set(c, (map.get(c) ?? 0) + 1);
    });
    return [...map.entries()];
  }, [allProjects]);

  const topTechs = useMemo(() => {
    const map = new Map();
    allProjects.forEach((p) =>
      projectTechs(p).forEach((t) => {
        const key = canonical(t);
        const entry = map.get(key) ?? { name: t, count: 0 };
        entry.count += 1;
        map.set(key, entry);
      })
    );
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  }, [allProjects]);

  const filtered = allProjects.filter((p) => {
    const byCategory = category === "all" || primaryCategory(p) === category;
    const byTech =
      !tech || projectTechs(p).some((t) => canonical(t) === canonical(tech));
    return byCategory && byTech;
  });

  const sorted = [...filtered].sort(
    (a, b) => Number(!!b?.featured) - Number(!!a?.featured)
  );
  const visible = showAll ? sorted : sorted.slice(0, 6);

  if (!allProjects.length) return null;

  return (
    <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Practical application</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                Skills in action.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                Filter by category or technology to see where each skill was
                put to work.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              View all projects <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        {categories.length > 0 && (
          <Reveal>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              <Chip
                active={category === "all"}
                onClick={() => setCategory("all")}
                count={allProjects.length}
              >
                All
              </Chip>
              {categories.map(([name, count]) => (
                <Chip
                  key={name}
                  active={category === name}
                  onClick={() => setCategory(name)}
                  count={count}
                >
                  {name}
                </Chip>
              ))}
            </div>
          </Reveal>
        )}

        {topTechs.length > 0 && (
          <Reveal>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Technology:
              </span>
              {topTechs.map(({ name }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    setTech(canonical(tech) === canonical(name) ? "" : name)
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] transition",
                    tech && canonical(tech) === canonical(name)
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-300"
                  )}
                >
                  {name}
                </button>
              ))}
              {tech && (
                <button
                  type="button"
                  onClick={() => setTech("")}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </Reveal>
        )}

        {visible.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-white/15">
            <FileCode2 size={24} className="mx-auto mb-3 text-neutral-400" />
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              No projects match these filters
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setTech("");
              }}
              className="mt-4 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/[0.06]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {visible.map((project, index) => (
              <Reveal key={`${projectTitle(project)}-${index}`} delay={index * 50}>
                <ProjectCard
                  project={project}
                  onOpen={onOpen}
                  onTech={(name) =>
                    setTech(canonical(tech) === canonical(name) ? "" : name)
                  }
                  activeTech={tech}
                />
              </Reveal>
            ))}
          </div>
        )}

        {sorted.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/[0.06]"
            >
              {showAll ? "Show fewer" : `Show all ${sorted.length} projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function primaryCategory(p) {
  return (
    String(p?.category ?? "").split(" / ")[0] || p?.filters?.[0] || ""
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState("grid");
  const [skillModal, setSkillModal] = useState(null);
  const [projectModal, setProjectModal] = useState(null);

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
      total + (Array.isArray(category?.skills) ? category.skills.length : 0),
    0
  );

  const categoryOptions = categories.map((category) => ({
    id: categoryId(category),
    name: categoryName(category),
    count: Array.isArray(category?.skills) ? category.skills.length : 0,
  }));

  const projectsForSkill = (name) => {
    const key = canonical(name);
    return allProjects.filter((p) =>
      projectTechs(p).some((t) => canonical(t) === key)
    );
  };
  const projectCount = (name) => projectsForSkill(name).length;

  const filteredCategories = useMemo(() => {
    const query = normalise(search);

    return categories
      .map((category) => {
        const allSkills = Array.isArray(category?.skills) ? category.skills : [];
        if (activeCategory !== "all" && categoryId(category) !== activeCategory)
          return null;

        const categoryMatches =
          !!query &&
          normalise(
            `${categoryName(category)} ${category?.description ?? ""}`
          ).includes(query);

        let skills = allSkills.filter((skill) => {
          const text = normalise(
            `${skillName(skill)} ${
              typeof skill === "object" ? skill?.description ?? "" : ""
            }`
          );
          const matchesQuery = !query || categoryMatches || text.includes(query);
          const label = levelLabel(skill);
          const matchesLevel =
            levelFilter === "all" || label === levelFilter;
          return matchesQuery && matchesLevel;
        });

        if (sort === "name") {
          skills = [...skills].sort((a, b) =>
            skillName(a).localeCompare(skillName(b))
          );
        } else if (sort === "level") {
          skills = [...skills].sort(
            (a, b) => (skillPercent(b) ?? -1) - (skillPercent(a) ?? -1)
          );
        }

        return skills.length ? { category, skills } : null;
      })
      .filter(Boolean);
  }, [categories, search, activeCategory, levelFilter, sort]);

  const visibleSkillCount = filteredCategories.reduce(
    (total, entry) => total + entry.skills.length,
    0
  );

  const strengths = useMemo(() => {
    const flat = [];
    categories.forEach((category) =>
      (Array.isArray(category?.skills) ? category.skills : []).forEach((skill) =>
        flat.push({ skill, category, percent: skillPercent(skill) })
      )
    );

    const featured = flat.filter(
      (e) => typeof e.skill === "object" && e.skill?.featured
    );
    if (featured.length) return featured.slice(0, 4);

    const rated = flat
      .filter((e) => e.percent != null)
      .sort((a, b) => b.percent - a.percent);
    return rated.slice(0, 4);
  }, [categories]);

  const ratedPercents = categories
    .flatMap((c) => (Array.isArray(c?.skills) ? c.skills : []))
    .map(skillPercent)
    .filter((p) => p != null);
  const averageLevel = ratedPercents.length
    ? Math.round(ratedPercents.reduce((a, b) => a + b, 0) / ratedPercents.length)
    : null;

  const completedProjects = allProjects.filter(
    (p) => projectStatus(p)?.tone === "done"
  ).length;

  const hasLevels = ratedPercents.length > 0;
  const filtersActive =
    search || activeCategory !== "all" || levelFilter !== "all" || sort !== "default";

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setLevelFilter("all");
    setSort("default");
  };

  const openProjectFromSkill = (project) => {
    setSkillModal(null);
    setProjectModal(project);
  };

  const statCards = [
    {
      value: totalSkillCount,
      label: "Listed skills",
      description: "Across all categories",
      icon: Braces,
    },
    {
      value: String(categories.length).padStart(2, "0"),
      label: "Categories",
      description: "Disciplines I work in",
      icon: Layers3,
    },
    {
      value: allProjects.length,
      label: "Projects built",
      description: "Where skills are applied",
      icon: Briefcase,
    },
    {
      value: averageLevel != null ? `${averageLevel}%` : completedProjects,
      label: averageLevel != null ? "Avg proficiency" : "Completed",
      description: averageLevel != null
        ? "Across all skills"
        : "Production-ready",
      icon: averageLevel != null ? Target : Check,
    },
  ];

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
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-14">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRightIcon size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Skills</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <Sparkles size={14} />
                Skills &amp; expertise
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                My technical
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  toolkit.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg sm:leading-8">
                I&apos;m Suraj Kumar, a Computer Science Engineering student and
                full-stack developer interested in building useful, responsive
                and reliable web applications.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#skills"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Browse skills <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                >
                  Contact me <ArrowDownRight size={16} />
                </Link>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "WebRTC", "PostgreSQL", "Socket.IO"].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="relative z-10">
              <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
                <div className="grid grid-cols-2">
                  {statCards.map(({ value, label, description, icon: Icon }, i) => (
                    <div
                      key={label}
                      className={cn(
                        "px-5 py-5 sm:px-6 sm:py-6",
                        i % 2 === 1 &&
                          "border-l border-neutral-200 dark:border-white/10",
                        i < 2 &&
                          "border-b border-neutral-200 dark:border-white/10"
                      )}
                    >
                      <div className="mb-2 flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                        <Icon size={13} />
                        <span className="text-[11px] uppercase tracking-wide">
                          {label}
                        </span>
                      </div>
                      <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                        {value}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-4 border-t border-neutral-200 bg-neutral-50/60 px-6 py-5 dark:border-white/10 dark:bg-white/[0.02] sm:px-7">
                  <IconBox icon={Braces} />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Current focus
                    </p>
                    <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                      Full-stack web development, REST APIs, real-time
                      applications and networking-focused projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CORE STRENGTHS                                            */}
      {/* ============================================================ */}
      <StrengthsSection items={strengths} onOpen={setSkillModal} />

      {/* ============================================================ */}
      {/* 3. TECHNICAL SKILLS                                          */}
      {/* ============================================================ */}
      <section
        id="skills"
        className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>Technologies &amp; tools</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                  The stack I work with
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
                  Organised by discipline. Click any skill to see my level and
                  the projects where I&apos;ve used it.
                </p>
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {visibleSkillCount}
                </span>{" "}
                of {totalSkillCount} skills
              </p>
            </div>
          </Reveal>

          {/* TOOLBAR */}
          <Reveal>
            <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search JavaScript, React, databases..."
                  aria-label="Search skills"
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 md:ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort skills"
                  className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-400 dark:border-white/10 dark:bg-[#121214] dark:text-white"
                >
                  {SORT_OPTIONS.filter((o) => hasLevels || o.id !== "level").map(
                    (o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    )
                  )}
                </select>

                <div className="flex rounded-2xl border border-neutral-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.035]">
                  {[
                    { id: "grid", icon: LayoutGrid, label: "Grid view" },
                    { id: "list", icon: List, label: "List view" },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setView(id)}
                      aria-label={label}
                      aria-pressed={view === id}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition",
                        view === id
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      )}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* CATEGORY FILTERS */}
          <Reveal>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              <Chip
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                count={totalSkillCount}
              >
                All skills
              </Chip>
              {categoryOptions.map((category) => (
                <Chip
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  count={category.count}
                >
                  {category.name}
                </Chip>
              ))}
            </div>
          </Reveal>

          {/* LEVEL FILTERS */}
          {hasLevels && (
            <Reveal>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Level:
                </span>
                {LEVEL_FILTERS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLevelFilter(level)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] transition",
                      levelFilter === level
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-300"
                    )}
                  >
                    {level === "all" ? "Any" : level}
                  </button>
                ))}
                {filtersActive && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-1 inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <X size={12} /> Reset
                  </button>
                )}
              </div>
            </Reveal>
          )}

          {/* CATEGORY CONTENT */}
          <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-16 xl:grid-cols-2">
            {filteredCategories.map((entry, index) => (
              <CategorySection
                key={categoryId(entry.category)}
                category={entry.category}
                skills={entry.skills}
                index={index}
                view={view}
                projectCount={projectCount}
                onOpen={setSkillModal}
              />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-white/15">
              <Search size={25} className="mx-auto mb-4 text-neutral-400" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                No matching skills
              </h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Try another keyword or reset the filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/[0.06]"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. LEARNING ROADMAP                                          */}
      {/* ============================================================ */}
      <RoadmapSection items={roadmap} />

      {/* ============================================================ */}
      {/* 5. PROJECTS                                                   */}
      {/* ============================================================ */}
      <div id="projects">
        <ProjectsSection allProjects={allProjects} onOpen={setProjectModal} />
      </div>

      {/* ============================================================ */}
      {/* 6. CONTACT CTA                                                */}
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
                  <SectionLabel>Let&apos;s work together</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Have an idea worth building?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    Let&apos;s discuss web development, collaboration or an
                    opportunity to build something useful.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    Get in touch <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  >
                    Explore projects <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MODALS */}
      <Modal
        open={!!skillModal}
        onClose={() => setSkillModal(null)}
        label="Skill details"
      >
        <SkillDetail
          data={skillModal}
          relatedProjects={
            skillModal ? projectsForSkill(skillName(skillModal.skill)) : []
          }
          onOpenProject={openProjectFromSkill}
        />
      </Modal>

      <Modal
        open={!!projectModal}
        onClose={() => setProjectModal(null)}
        label="Project details"
      >
        <ProjectDetailModal
          project={projectModal}
          onClose={() => setProjectModal(null)}
        />
      </Modal>
    </main>
  );
}
