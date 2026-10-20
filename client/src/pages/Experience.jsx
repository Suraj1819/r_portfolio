import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Sparkles,
  Trophy,
  Layers3,
  Code2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Award,
  GraduationCap,
  Users,
  Target,
  Rocket,
  Github,
  Mail,
  FileText,
  Star,
  Lightbulb,
  ShieldCheck,
  ListChecks,
  Handshake,
  Compass,
  Brain,
  BookOpen,
  Home as HomeIcon,
  ChevronRight,
  Workflow,
  FileCode2,
  Zap,
  Clock,
  Cloud,
  Wrench,
  Network,
} from "lucide-react";

import { experiences, practicalExperience } from "../data/experience";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Shared UI primitives (matching Home / About / Skills)              */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" ? "mx-auto text-center" : ""
      )}
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
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

function PrimaryLink({ to, href, children, className = "" }) {
  const cls = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
    className
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
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

function MetaPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400">
      {children}
    </span>
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
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, label, value, description, index }) {
  return (
    <Reveal delay={index * 60}>
      <div className="group rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <IconBox icon={Icon} />
          <ArrowUpRight
            size={17}
            className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
        <p className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          {value}
        </p>
        <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </p>
        <p className="mt-1 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Bullet list (Responsibilities / Outcomes / Skills)                  */
/* ------------------------------------------------------------------ */

function BulletList({ items, icon: Icon = CheckCircle2, label }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      {label && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
      )}
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-sm leading-6 text-neutral-600 dark:text-neutral-400"
          >
            <Icon className="mt-1 h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience card                                                     */
/* ------------------------------------------------------------------ */

function ExperienceCard({ exp, index }) {
  const [open, setOpen] = useState(true);

  const summaryItems = exp.responsibilities?.length
    ? exp.responsibilities.slice(0, 2)
    : [];

  return (
    <Reveal delay={index * 50}>
      <li className="relative md:pl-12">
        <span className="absolute left-0 top-1 hidden h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-900 bg-white text-xs font-semibold text-neutral-900 dark:border-white dark:bg-[#101011] dark:text-white md:flex">
          {index + 1}
        </span>

        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition duration-200 hover:border-neutral-400 hover:shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                    {exp.role}
                  </h3>
                  {exp.type && (
                    <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-white/10 dark:bg-white/[0.07] dark:text-neutral-300">
                      {exp.type}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {exp.organization}
                  </span>
                  {exp.website && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600">
                        ·
                      </span>
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-700 dark:text-neutral-300 dark:decoration-neutral-700 dark:hover:text-white dark:hover:decoration-neutral-300"
                      >
                        {exp.websiteLabel || "Visit website"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <MetaPill icon={CalendarDays}>{exp.period}</MetaPill>
                  {exp.location && (
                    <MetaPill icon={MapPin}>{exp.location}</MetaPill>
                  )}
                  {exp.technologies?.length > 0 && (
                    <MetaPill icon={Code2}>
                      {exp.technologies.length} technolog
                      {exp.technologies.length === 1 ? "y" : "ies"}
                    </MetaPill>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {exp.website && (
                  <a
                    href={exp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {exp.websiteLabel || "Website"}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  aria-expanded={open}
                  aria-controls={`exp-details-${exp.id}`}
                >
                  {open ? "Collapse" : "Expand"}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              {exp.summary}
            </p>

            {!open && summaryItems.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {summaryItems.map((r) => (
                  <span
                    key={r}
                    className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600 dark:bg-white/[0.07] dark:text-neutral-300"
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}

            {open && (
              <div id={`exp-details-${exp.id}`} className="mt-6 space-y-6">
                <BulletList
                  label="Responsibilities"
                  items={exp.responsibilities}
                  icon={CheckCircle2}
                />
                <BulletList
                  label="Outcomes"
                  items={exp.outcomes}
                  icon={Trophy}
                />
                {exp.achievements?.length > 0 && (
                  <BulletList
                    label="Key achievements"
                    items={exp.achievements}
                    icon={Award}
                  />
                )}
                {exp.skills?.length > 0 && (
                  <BulletList
                    label="Skills developed"
                    items={exp.skills}
                    icon={Sparkles}
                  />
                )}

                {exp.technologies?.length > 0 && (
                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200/80 pt-4 dark:border-white/[0.08]">
                  {exp.website && (
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open project
                    </a>
                  )}
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Related document
                    </a>
                  )}
                  {exp.github && (
                    <a
                      href={exp.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source code
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </li>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Strengths / Process / Values                                        */
/* ------------------------------------------------------------------ */

const STRENGTHS = [
  {
    icon: Target,
    title: "Problem solving",
    text: "Breaking down ambiguous requirements into clear, testable steps before writing any code.",
  },
  {
    icon: Rocket,
    title: "Shipping mindset",
    text: "Favoring working, iterable solutions over perfect, delayed ones.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "Comfortable with clear communication, code reviews, and handoffs.",
  },
  {
    icon: Lightbulb,
    title: "Learning fast",
    text: "Picking up new stacks and tools without over-relying on tutorials.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    text: "Accurate documentation and honest reporting of progress.",
  },
  {
    icon: GraduationCap,
    title: "Fundamentals",
    text: "Solid grounding in web, networking, and software principles.",
  },
  {
    icon: Brain,
    title: "Systems thinking",
    text: "Understanding how components interact, not just how they behave in isolation.",
  },
  {
    icon: Handshake,
    title: "Ownership",
    text: "Taking responsibility for outcomes, not just tasks assigned.",
  },
  {
    icon: Compass,
    title: "Direction",
    text: "Building toward long-term goals rather than chasing short-term trends.",
  },
];

const WORKFLOW = [
  {
    number: "01",
    title: "Understand",
    description:
      "Read the brief, talk to users, and clarify the outcome before writing code.",
    icon: Target,
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Break the work into small, testable units with clear API boundaries.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Build",
    description:
      "Implement end-to-end slices, then harden edges with validation and tests.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Iterate",
    description:
      "Ship, observe real usage, fix what breaks, and improve the next pass.",
    icon: Rocket,
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Experience() {
  useEffect(() => {
    document.title = "Experience — Suraj Kumar";
    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  const stats = useMemo(() => {
    const total = experiences.length;
    const techSet = new Set();
    experiences.forEach((exp) => {
      (exp.technologies || []).forEach((t) => techSet.add(t));
    });
    const outcomes = experiences.reduce(
      (sum, exp) => sum + (exp.outcomes?.length || 0),
      0
    );
    const responsibilities = experiences.reduce(
      (sum, exp) => sum + (exp.responsibilities?.length || 0),
      0
    );
    return {
      roles: total,
      technologies: techSet.size,
      outcomes,
      responsibilities,
    };
  }, []);

  const statCards = [
    {
      icon: BriefcaseBusiness,
      label: "Total roles",
      value: stats.roles,
      description: "Formal positions and engagements",
    },
    {
      icon: Code2,
      label: "Technologies",
      value: stats.technologies,
      description: "Tools and frameworks used",
    },
    {
      icon: ListChecks,
      label: "Responsibilities",
      value: stats.responsibilities,
      description: "Documented duties across roles",
    },
    {
      icon: Trophy,
      label: "Outcomes",
      value: stats.outcomes,
      description: "Documented results and milestones",
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
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Experience</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <Sparkles size={14} />
                Experience
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                Experience that goes
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  beyond tutorials.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg sm:leading-8">
                Production work and project-based engineering — described
                accurately, without invented metrics or team claims. Every
                entry below is something I actually did, in the order I did it.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <MetaPill icon={BriefcaseBusiness}>
                  {stats.roles} {stats.roles === 1 ? "role" : "roles"}
                </MetaPill>
                <MetaPill icon={Code2}>
                  {stats.technologies} technologies
                </MetaPill>
                <MetaPill icon={Sparkles}>
                  Hands-on, real projects
                </MetaPill>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#roles"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Browse roles <ArrowDownRight size={16} />
                </a>
                <SecondaryLink to="/contact">
                  Get in touch <ArrowRight size={16} />
                </SecondaryLink>
              </div>
            </div>

            {/* Stats grid */}
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {statCards.map((stat, i) => (
                  <StatCard
                    key={stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    description={stat.description}
                    index={i}
                  />
                ))}
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
            Across the work
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
      {/* 3. ROLES TIMELINE                                            */}
      {/* ============================================================ */}
      <section
        id="roles"
        className="border-b border-neutral-200/80 dark:border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>Career timeline</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                  Roles
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                  Each role below expands with responsibilities, outcomes,
                  key achievements and the technologies used.
                </p>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {experiences.length}{" "}
                {experiences.length === 1 ? "entry" : "entries"} · most recent
                first
              </p>
            </div>
          </Reveal>

          {experiences.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500 dark:border-white/15 dark:text-neutral-400">
              No experience entries yet.
            </div>
          ) : (
            <div className="relative">
              <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-neutral-200 dark:bg-white/10 md:block" />
              <ul className="space-y-6">
                {experiences.map((exp, index) => (
                  <ExperienceCard key={exp.id} exp={exp} index={index} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PRACTICAL EXPERIENCE                                      */}
      {/* ============================================================ */}
      {practicalExperience && (
        <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <Reveal>
              <SectionLabel>Beyond formal roles</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                {practicalExperience.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                {practicalExperience.description}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {practicalExperience.highlights.map((h, i) => (
                <Reveal key={h} delay={i * 50}>
                  <li className="flex h-full items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                    <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    <span className="text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                      {h}
                    </span>
                  </li>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. WORKFLOW                                                  */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="How I work"
              title="From brief to ship"
              description="A simple, repeatable loop I apply across every project — whether it's a one-day prototype or a multi-month engagement."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {WORKFLOW.map((step, i) => (
              <Reveal key={step.number} delay={i * 60}>
                <article className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-2xl font-semibold tracking-tight text-neutral-300 dark:text-neutral-600">
                      {step.number}
                    </span>
                    <IconBox icon={step.icon} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-neutral-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STRENGTHS                                                 */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="What I bring"
              title="Strengths developed through practice"
              description="These are not abstract traits. Each one came from a specific project where the alternative turned out to be worse."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {STRENGTHS.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <article className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <IconBox icon={item.icon} />
                    <ArrowDownRight
                      size={17}
                      className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. CONTACT CTA                                                */}
      {/* ============================================================ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
                    <Star size={21} />
                  </div>
                  <SectionLabel>Let&apos;s work together</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Want the full picture?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    Explore my projects and skills, or get in touch directly —
                    I&apos;m open to internships, junior roles and
                    collaborations involving full-stack work, real-time systems
                    or practical product delivery.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <PrimaryLink to="/contact">
                    Contact me <ArrowRight size={16} />
                  </PrimaryLink>
                  <SecondaryLink to="/projects">
                    View projects <ArrowUpRight size={16} />
                  </SecondaryLink>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200/80 pt-6 text-sm text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400">
                <a
                  href="https://github.com/Suraj1819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <Github size={15} /> GitHub <ExternalLink size={12} />
                </a>
                <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <BookOpen size={15} /> About me <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
