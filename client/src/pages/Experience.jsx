
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  Database,
  ExternalLink,
  FileText,
  GraduationCap,
  Github,
  Globe,
  Handshake,
  Home,
  Layers,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Workflow,
  Wrench,
  Clock3,
} from "lucide-react";

import { experiences, practicalExperience } from "../data/experience";
import { cn } from "../lib/utils";

/* ---------------------------------------------------------
   Shared design system
--------------------------------------------------------- */

const card =
  "rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-900/[0.02] dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-none";

const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";

const hoverCard =
  "transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:hover:border-white/20";

const TONES = {
  sky: "bg-sky-50 text-sky-700 ring-sky-200/70 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-200/70 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  orange:
    "bg-orange-50 text-orange-700 ring-orange-200/70 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-400/20",
  neutral:
    "bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-white/[0.07] dark:text-neutral-300 dark:ring-white/10",
};

const norm = (value) =>
  String(value ?? "").toLowerCase().replace(/[\s._-]/g, "");

/* ---------------------------------------------------------
   Technology logos
--------------------------------------------------------- */

const LOGOS = {
  react: ["react", "61DAFB"],
  reactjs: ["react", "61DAFB"],
  vite: ["vite", "646CFF"],
  tailwindcss: ["tailwindcss", "06B6D4"],
  tailwind: ["tailwindcss", "06B6D4"],
  javascript: ["javascript", "F7DF1E"],
  js: ["javascript", "F7DF1E"],
  typescript: ["typescript", "3178C6"],
  ts: ["typescript", "3178C6"],
  nodejs: ["nodedotjs", "5FA04E"],
  node: ["nodedotjs", "5FA04E"],
  express: ["express", "000000"],
  expressjs: ["express", "000000"],
  postgresql: ["postgresql", "4169E1"],
  postgres: ["postgresql", "4169E1"],
  mongodb: ["mongodb", "47A248"],
  mongo: ["mongodb", "47A248"],
  socketio: ["socketdotio", "010101"],
  webrtc: ["webrtc", "333333"],
  git: ["git", "F05032"],
  github: ["github", "181717"],
  vercel: ["vercel", "000000"],
  render: ["render", "46E3B7"],
  html: ["html5", "E34F26"],
  html5: ["html5", "E34F26"],
  css: ["css3", "1572B6"],
  css3: ["css3", "1572B6"],
  python: ["python", "3776AB"],
  numpy: ["numpy", "013243"],
  pandas: ["pandas", "150458"],
  matplotlib: ["matplotlib", "11557C"],
  jupyter: ["jupyter", "F37626"],
  scikitlearn: ["scikitlearn", "F7931E"],
  tensorflow: ["tensorflow", "FF6F00"],
  pytorch: ["pytorch", "EE4C2C"],
  kaggle: ["kaggle", "20BEFF"],
};

const FALLBACK_ICONS = {
  webdevelopment: Globe,
  responsiveui: MonitorSmartphone,
  productionmaintenance: Wrench,
  datascience: Database,
  machinelearning: Brain,
  ai: Brain,
};

function Logo({ name, size = "h-6 w-6", round = false }) {
  const [failed, setFailed] = useState(false);
  const key = norm(name);
  const logo = LOGOS[key];
  const Fallback = FALLBACK_ICONS[key] ?? Code2;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-white ring-1 ring-neutral-200 dark:bg-white/[0.06] dark:ring-white/10",
        round ? "rounded-full" : "rounded-xl",
        size
      )}
    >
      {logo && !failed ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className="h-[58%] w-[58%] object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Fallback size={15} className="text-neutral-500" />
      )}
    </span>
  );
}

function TechPill({ name }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1.5 pr-3 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5" round />
      {name}
    </li>
  );
}

function TechGrid({ items }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((name, index) => (
        <li
          key={name}
          className={cn(
            "group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 transition hover:border-neutral-200 hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.025] dark:hover:border-white/15 dark:hover:bg-white/[0.05]"
          )}
        >
          <Logo name={name} size="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className={cn("mt-0.5 text-[11px]", soft)}>
              Technology {String(index + 1).padStart(2, "0")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------
   Reusable UI components
--------------------------------------------------------- */

function IconBox({ icon: Icon, tone = "neutral", size = "h-11 w-11" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
        size,
        TONES[tone] ?? TONES.neutral
      )}
    >
      <Icon size={19} strokeWidth={1.8} />
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  count,
  tone = "neutral",
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3.5">
        <IconBox icon={Icon} tone={tone} />
        <div className="min-w-0 pt-0.5">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className={cn("mt-1 text-sm leading-6", soft)}>{subtitle}</p>
          )}
        </div>
      </div>
      {count != null && (
        <span className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium tabular-nums text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
          {count}
        </span>
      )}
    </div>
  );
}

function Block({
  id,
  icon,
  title,
  subtitle,
  count,
  children,
  tone = "neutral",
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <SectionHeading
        icon={icon}
        title={title}
        subtitle={subtitle}
        count={count}
        tone={tone}
      />
      {children}
    </section>
  );
}

function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition",
        focus,
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/25"
      )}
    >
      {children}
      {count != null && (
        <span className={cn("tabular-nums", active ? "opacity-70" : soft)}>
          {count}
        </span>
      )}
    </button>
  );
}

function Pill({ icon: Icon, children, tone = "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONES[tone] ?? TONES.neutral
      )}
    >
      <Icon size={12} />
      {children}
    </span>
  );
}

function BulletList({ label, icon: Icon = CheckCircle2, items, tone = "emerald" }) {
  if (!items?.length) return null;

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <IconBox icon={Icon} tone={tone} size="h-8 w-8" />
        {label}
      </p>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className={cn("flex items-start gap-3 text-sm leading-7", muted)}
          >
            <CheckCircle2
              size={15}
              className="mt-1.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------
   Page navigation and scroll utilities
--------------------------------------------------------- */

function useScrollSpy(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return undefined;

    const handler = () => {
      const position = window.scrollY + 180;

      for (let index = ids.length - 1; index >= 0; index -= 1) {
        const element = document.getElementById(ids[index]);

        if (element && element.offsetTop <= position) {
          setActive(ids[index]);
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

      setProgress(
        total > 0
          ? Math.min(100, Math.max(0, (window.scrollY / total) * 100))
          : 0
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
    >
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
    const onScroll = () => setShow(window.scrollY > 700);

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
        "fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800",
        focus
      )}
    >
      <ArrowUp size={18} />
    </button>
  );
}

/* ---------------------------------------------------------
   Experience cards
--------------------------------------------------------- */

const KIND = {
  work: { label: "Professional experience", icon: BriefcaseBusiness, tone: "sky" },
  learning: { label: "Learning", icon: GraduationCap, tone: "violet" },
};

function ExperienceCard({ exp, index, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const kind = KIND[exp.kind] ?? KIND.work;
  const KindIcon = kind.icon;
  const techs = exp.technologies ?? [];
  const detailsId = `exp-details-${exp.id}`;

  const brief = [
    { icon: CalendarDays, label: "Period", value: exp.period, tone: "sky" },
    { icon: MapPin, label: "Location", value: exp.location, tone: "orange" },
    {
      icon: Code2,
      label: "Technologies",
      value: techs.length ? `${techs.length} technologies` : "",
      tone: "emerald",
    },
  ].filter((item) => item.value);

  const links = [
    exp.website && {
      href: exp.website,
      icon: Globe,
      label: exp.websiteLabel || "Website",
    },
    exp.github && { href: exp.github, icon: Github, label: "Source code" },
    exp.link && { href: exp.link, icon: FileText, label: "Related document" },
  ].filter(Boolean);

  return (
    <li id={`role-${exp.id}`} className="relative scroll-mt-32 pb-5 last:pb-0">
      <article className={cn(card, "overflow-hidden", hoverCard)}>
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
              <IconBox
                icon={KindIcon}
                tone={kind.tone}
                size="h-12 w-12"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill icon={KindIcon} tone={kind.tone}>
                    {kind.label}
                  </Pill>
                  {exp.type && (
                    <span className={cn("text-xs", soft)}>{exp.type}</span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">
                  {exp.role}
                </h3>

                <p className={cn("mt-1.5 text-sm leading-6", muted)}>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {exp.organization}
                  </span>
                  {exp.website && (
                    <>
                      {" · "}
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline decoration-neutral-300 underline-offset-4 transition hover:decoration-neutral-900 dark:decoration-neutral-600 dark:hover:decoration-white"
                      >
                        {exp.websiteLabel || "Visit website"}
                        <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={detailsId}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-neutral-200 px-3.5 text-xs font-semibold transition hover:bg-neutral-50 dark:border-white/15 dark:hover:bg-white/[0.06]",
                focus
              )}
            >
              {open ? "Hide details" : "View details"}
              <ChevronDown
                size={14}
                className={cn("transition-transform", open && "rotate-180")}
              />
            </button>
          </div>

          {brief.length > 0 && (
            <dl className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {brief.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                  <IconBox
                    icon={item.icon}
                    tone={item.tone}
                    size="h-8 w-8"
                  />
                  <div className="min-w-0">
                    <dt className={cn("text-xs", soft)}>{item.label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          )}

          {exp.summary && (
            <p className={cn("mt-5 text-sm leading-7", muted)}>
              {exp.summary}
            </p>
          )}

          {techs.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {techs.map((technology) => (
                <TechPill key={technology} name={technology} />
              ))}
            </ul>
          )}
        </div>

        {open && (
          <div
            id={detailsId}
            className="space-y-7 border-t border-neutral-200 bg-neutral-50/60 p-5 dark:border-white/10 dark:bg-white/[0.015] sm:p-7"
          >
            <BulletList
              label="Responsibilities"
              icon={ListChecks}
              items={exp.responsibilities}
              tone="sky"
            />
            <BulletList
              label="Outcomes"
              icon={Trophy}
              items={exp.outcomes}
              tone="emerald"
            />
            <BulletList
              label="Key achievements"
              icon={Award}
              items={exp.achievements}
              tone="amber"
            />
            <BulletList
              label="Skills developed"
              icon={Sparkles}
              items={exp.skills}
              tone="violet"
            />

            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-5 dark:border-white/10">
                {links.map((link) => {
                  const Icon = link.icon;
                  const external = /^https?:\/\//i.test(link.href);

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-semibold transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25",
                        focus
                      )}
                    >
                      <Icon size={14} />
                      {link.label}
                      <ArrowUpRight size={12} className={soft} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </article>
    </li>
  );
}

/* ---------------------------------------------------------
   Page content
--------------------------------------------------------- */

const STRENGTHS = [
  {
    icon: Target,
    tone: "sky",
    title: "Problem solving",
    text: "Breaking down ambiguous requirements into clear, testable steps before writing code.",
  },
  {
    icon: Rocket,
    tone: "orange",
    title: "Shipping mindset",
    text: "Favoring working, iterative solutions over perfect, delayed ones.",
  },
  {
    icon: Users,
    tone: "emerald",
    title: "Collaboration",
    text: "Comfortable with clear communication, code reviews, and handoffs.",
  },
  {
    icon: Lightbulb,
    tone: "amber",
    title: "Learning fast",
    text: "Picking up new stacks and tools while building practical understanding.",
  },
  {
    icon: ShieldCheck,
    tone: "violet",
    title: "Reliability",
    text: "Maintaining clear documentation and communicating progress accurately.",
  },
  {
    icon: GraduationCap,
    tone: "sky",
    title: "Fundamentals",
    text: "Applying web, networking, and software engineering principles.",
  },
  {
    icon: Brain,
    tone: "violet",
    title: "Systems thinking",
    text: "Understanding how components interact, not just how they behave individually.",
  },
  {
    icon: Handshake,
    tone: "emerald",
    title: "Ownership",
    text: "Taking responsibility for outcomes, not just tasks assigned.",
  },
  {
    icon: Compass,
    tone: "orange",
    title: "Direction",
    text: "Building toward long-term goals rather than chasing short-term trends.",
  },
];

const WORKFLOW = [
  {
    title: "Understand",
    icon: Target,
    tone: "sky",
    description:
      "Clarify the requirements, users, constraints, and expected outcome.",
  },
  {
    title: "Plan",
    icon: Workflow,
    tone: "violet",
    description:
      "Break the work into manageable tasks with clear implementation boundaries.",
  },
  {
    title: "Build",
    icon: Code2,
    tone: "emerald",
    description:
      "Implement complete features, validate inputs, and handle edge cases.",
  },
  {
    title: "Iterate",
    icon: Rocket,
    tone: "orange",
    description:
      "Test, observe feedback, fix issues, and improve the next iteration.",
  },
];

const PROJECT_STACK = [
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

const GITHUB_PROFILE = "https://github.com/Suraj1819";

/* ---------------------------------------------------------
   Main page
--------------------------------------------------------- */

export default function Experience() {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Experience — Suraj Kumar";

    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  const list = useMemo(
    () => (Array.isArray(experiences) ? experiences : []),
    []
  );

  const stats = useMemo(() => {
    const technologies = new Set();

    list.forEach((experience) => {
      (experience.technologies ?? []).forEach((technology) =>
        technologies.add(technology)
      );
    });

    PROJECT_STACK.forEach((technology) => technologies.add(technology));

    return {
      roles: list.length,
      work: list.filter((experience) => experience.kind !== "learning").length,
      learning: list.filter((experience) => experience.kind === "learning").length,
      technologies: technologies.size,
      allTech: [...technologies],
      responsibilities: list.reduce(
        (total, experience) =>
          total + (experience.responsibilities?.length ?? 0),
        0
      ),
      outcomes: list.reduce(
        (total, experience) => total + (experience.outcomes?.length ?? 0),
        0
      ),
    };
  }, [list]);

  const visible = list.filter(
    (experience) =>
      filter === "all" ||
      (experience.kind ?? "work") === filter
  );

  const current = list.find((experience) =>
    /present/i.test(experience.period ?? "")
  );

  const sections = useMemo(
    () =>
      [
        {
          id: "overview",
          label: "Overview",
          icon: Lightbulb,
          tone: "amber",
          show: list.length > 0,
        },
        {
          id: "roles",
          label: "Experience",
          icon: BriefcaseBusiness,
          tone: "sky",
          show: true,
        },
        {
          id: "practical",
          label: "Practical work",
          icon: Wrench,
          tone: "orange",
          show: !!practicalExperience,
        },
        {
          id: "tech",
          label: "Tech stack",
          icon: Code2,
          tone: "emerald",
          show: stats.allTech.length > 0,
        },
        {
          id: "workflow",
          label: "Workflow",
          icon: Workflow,
          tone: "violet",
          show: true,
        },
        {
          id: "strengths",
          label: "Strengths",
          icon: Star,
          tone: "amber",
          show: true,
        },
      ].filter((section) => section.show),
    [list.length, stats.allTech.length]
  );

  const active = useScrollSpy(sections.map((section) => section.id));

  const brief = [
    { icon: BriefcaseBusiness, label: "Entries", value: stats.roles, tone: "sky" },
    { icon: Rocket, label: "Work", value: stats.work, tone: "emerald" },
    { icon: GraduationCap, label: "Learning", value: stats.learning, tone: "violet" },
    { icon: Code2, label: "Technologies", value: stats.technologies, tone: "orange" },
    {
      icon: ListChecks,
      label: "Responsibilities",
      value: stats.responsibilities,
      tone: "sky",
    },
    { icon: Trophy, label: "Outcomes", value: stats.outcomes, tone: "amber" },
  ].filter((item) => item.value > 0);

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* Hero */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className={cn("mb-8 flex flex-wrap items-center gap-2 text-sm", soft)}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 transition hover:text-neutral-900 dark:hover:text-white"
            >
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-neutral-900 dark:text-white">
              Experience
            </span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold dark:border-white/10 dark:bg-white/[0.04]">
                  <IconBox icon={BriefcaseBusiness} tone="sky" size="h-6 w-6" />
                  Experience & growth
                </span>

                {current && (
                  <Pill icon={Clock3} tone="emerald">
                    Currently active
                  </Pill>
                )}
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Experience that goes{" "}
                <span className="text-neutral-400 dark:text-neutral-500">
                  beyond tutorials.
                </span>
              </h1>

              <p className={cn("mt-5 max-w-2xl text-base leading-8 sm:text-lg", muted)}>
                A record of production work, hands-on learning, and project-based
                engineering — with the responsibilities, technologies, and outcomes
                behind each experience.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {["React", "Node.js", "PostgreSQL", "Python"].map((technology) => (
                  <TechPill key={technology} name={technology} />
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#roles"
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
                    focus
                  )}
                >
                  Explore experience
                  <ArrowRight size={16} />
                </a>

                <Link
                  to="/contact"
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]",
                    focus
                  )}
                >
                  <Mail size={16} />
                  Get in touch
                </Link>
              </div>

              {current && (
                <div className="mt-8 flex items-start gap-3 border-t border-neutral-200 pt-5 dark:border-white/10">
                  <IconBox icon={BriefcaseBusiness} tone="emerald" size="h-9 w-9" />
                  <div>
                    <p className="text-sm font-semibold">Current position</p>
                    <p className={cn("mt-1 text-sm leading-6", muted)}>
                      {current.role} at {current.organization}
                    </p>
                    <p className={cn("mt-0.5 text-xs", soft)}>
                      {current.period}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            <aside className={cn(card, "p-5 sm:p-6")}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconBox icon={Layers} tone="violet" />
                  <div>
                    <h2 className="font-semibold tracking-tight">
                      Experience overview
                    </h2>
                    <p className={cn("mt-0.5 text-xs", soft)}>
                      Based on available records
                    </p>
                  </div>
                </div>
                <Sparkles size={17} className="text-neutral-400" />
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {brief.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]"
                  >
                    <dt className={cn("flex items-center gap-2 text-xs", soft)}>
                      <item.icon size={14} />
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-xl border border-neutral-100 p-4 dark:border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium">Practical, project-led learning</p>
                </div>
                <p className={cn("mt-1.5 pl-6 text-xs leading-6", soft)}>
                  Focused on building, maintaining, and improving real applications.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile section navigation */}
      <nav
        aria-label="Experience sections"
        className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/95 lg:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition",
                  active === section.id
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300"
                )}
              >
                <section.icon size={13} />
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    On this page
                  </p>

                  <ul className="space-y-1">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition",
                            active === section.id
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/[0.06]"
                          )}
                        >
                          <section.icon size={15} />
                          {section.label}
                          {active === section.id && (
                            <ChevronRight size={14} className="ml-auto" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 border-t border-neutral-200 px-3 pt-4 dark:border-white/10">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    >
                      Explore projects
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main sections */}
            <div className="min-w-0 space-y-16 sm:space-y-20">
              {list.length > 0 && (
                <Block
                  id="overview"
                  icon={Lightbulb}
                  title="Career overview"
                  subtitle="A quick summary of the experiences recorded on this page."
                  count={list.length}
                  tone="amber"
                >
                  <ul className={cn(card, "divide-y divide-neutral-200 overflow-hidden dark:divide-white/10")}>
                    {list.map((experience) => {
                      const kind = KIND[experience.kind] ?? KIND.work;
                      const KindIcon = kind.icon;

                      return (
                        <li key={experience.id}>
                          <a
                            href={`#role-${experience.id}`}
                            className="group flex items-center gap-3.5 p-4 transition hover:bg-neutral-50 dark:hover:bg-white/[0.035] sm:gap-4 sm:p-5"
                          >
                            <IconBox icon={KindIcon} tone={kind.tone} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {experience.role}
                              </p>
                              <p className={cn("mt-1 truncate text-xs", soft)}>
                                {experience.organization}
                              </p>
                            </div>
                            <span className={cn("hidden shrink-0 text-xs sm:block", soft)}>
                              {experience.period}
                            </span>
                            <ArrowUpRight
                              size={16}
                              className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900 dark:group-hover:text-white"
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              <Block
                id="roles"
                icon={BriefcaseBusiness}
                title="Experience & learning"
                subtitle="Explore each entry for responsibilities, outcomes, and skills."
                count={visible.length}
                tone="sky"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Chip active={filter === "all"} onClick={() => setFilter("all")} count={stats.roles}>
                      All entries
                    </Chip>
                    <Chip active={filter === "work"} onClick={() => setFilter("work")} count={stats.work}>
                      Professional
                    </Chip>
                    <Chip active={filter === "learning"} onClick={() => setFilter("learning")} count={stats.learning}>
                      Learning
                    </Chip>
                  </div>
                  <p className={cn("text-xs", soft)}>
                    Showing {visible.length} of {list.length}
                  </p>
                </div>

                {visible.length === 0 ? (
                  <div className={cn(card, "border-dashed px-6 py-12 text-center")}>
                    <IconBox icon={BriefcaseBusiness} tone="neutral" size="h-12 w-12" />
                    <p className="mt-4 font-medium">No entries in this category</p>
                    <p className={cn("mt-1 text-sm", soft)}>
                      Try selecting a different filter.
                    </p>
                  </div>
                ) : (
                  <ol>
                    {visible.map((experience, index) => (
                      <ExperienceCard
                        key={experience.id}
                        exp={experience}
                        index={index}
                        defaultOpen={index === 0}
                      />
                    ))}
                  </ol>
                )}
              </Block>

              {practicalExperience && (
                <Block
                  id="practical"
                  icon={Wrench}
                  title={practicalExperience.title}
                  subtitle="Additional hands-on work beyond formal roles."
                  tone="orange"
                >
                  <div className={cn(card, "mb-4 p-5 sm:p-7")}>
                    <div className="flex items-start gap-3">
                      <IconBox icon={Wrench} tone="orange" />
                      <p className={cn("text-sm leading-7", muted)}>
                        {practicalExperience.description}
                      </p>
                    </div>
                  </div>

                  <ul className="grid gap-3 sm:grid-cols-2">
                    {(practicalExperience.highlights ?? []).map((highlight) => (
                      <li
                        key={highlight}
                        className={cn(card, "flex items-start gap-3.5 p-4 sm:p-5", hoverCard)}
                      >
                        <IconBox icon={Layers} tone="violet" size="h-9 w-9" />
                        <p className={cn("text-sm leading-7", muted)}>
                          {highlight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {stats.allTech.length > 0 && (
                <Block
                  id="tech"
                  icon={Code2}
                  title="Technologies across my work"
                  subtitle="Tools and frameworks represented in experience and project records."
                  count={stats.allTech.length}
                  tone="emerald"
                >
                  <div className={cn(card, "p-4 sm:p-6")}>
                    <TechGrid items={stats.allTech} />
                  </div>
                </Block>
              )}

              <Block
                id="workflow"
                icon={Workflow}
                title="How I approach a project"
                subtitle="A repeatable process from understanding the problem to improving the result."
                tone="violet"
              >
                <ol className="grid gap-3 sm:grid-cols-2">
                  {WORKFLOW.map((step, index) => (
                    <li key={step.title} className={cn(card, "p-5 sm:p-6", hoverCard)}>
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-3xl font-semibold tracking-tight text-neutral-200 dark:text-neutral-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <IconBox icon={step.icon} tone={step.tone} size="h-10 w-10" />
                      </div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className={cn("mt-2 text-sm leading-7", muted)}>
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </Block>

              <Block
                id="strengths"
                icon={Star}
                title="Strengths developed through practice"
                subtitle="Working habits that guide how I build and collaborate."
                count={STRENGTHS.length}
                tone="amber"
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {STRENGTHS.map((strength) => (
                    <li
                      key={strength.title}
                      className={cn(card, "flex items-start gap-3.5 p-4 sm:p-5", hoverCard)}
                    >
                      <IconBox icon={strength.icon} tone={strength.tone} size="h-10 w-10" />
                      <div>
                        <h3 className="text-sm font-semibold">{strength.title}</h3>
                        <p className={cn("mt-1.5 text-sm leading-7", muted)}>
                          {strength.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Block>
            </div>
          </div>
        </div>
      </section>

      {/* Contact call to action */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 px-6 py-10 text-white dark:border-white/10 dark:bg-white/[0.06] sm:px-10 sm:py-12 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-white/10"
          />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/80">
              <Sparkles size={13} />
              Let&apos;s build something useful
            </span>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Have a project or opportunity in mind?
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              I&apos;m open to internships, junior roles, and collaborations
              involving full-stack development, real-time applications, and
              practical product engineering.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200",
                  focus
                )}
              >
                <Mail size={16} />
                Contact me
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/projects"
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10",
                  focus
                )}
              >
                <Code2 size={16} />
                View projects
              </Link>

              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10",
                  focus
                )}
              >
                <Github size={16} />
                GitHub
                <ArrowUpRight size={14} />
              </a>

              <Link
                to="/about"
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10",
                  focus
                )}
              >
                <BookOpen size={16} />
                About me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
