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
  Clock,
  Code2,
  Compass,
  Database,
  ExternalLink,
  FileText,
  GraduationCap,
  Github,
  Globe,
  Handshake,
  Home as HomeIcon,
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
} from "lucide-react";

import { experiences, practicalExperience } from "../data/experience";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Tech logos (official brand colours, same as Project Details)        */
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
  socketio: ["socketdotio", "010101"],
  webrtc: ["webrtc", "333333"],
  git: ["git", "F05032"],
  github: ["github", "181717"],
  vercel: ["vercel", "000000"],
  render: ["render", "46E3B7"],
  html: ["html5", "E34F26"], html5: ["html5", "E34F26"],
  css: ["css3", "1572B6"], css3: ["css3", "1572B6"],
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

const norm = (n) => String(n ?? "").toLowerCase().replace(/[\s._-]/g, "");

/* ------------------------------------------------------------------ */
/* Shared classes (same as Project Details)                            */
/* ------------------------------------------------------------------ */

const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox = "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";
const hoverCard = "transition hover:border-neutral-900 dark:hover:border-white";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Logo({ name, size = "h-6 w-6", round = false }) {
  const [failed, setFailed] = useState(false);
  const key = norm(name);
  const logo = LOGOS[key];
  const Fallback = FALLBACK_ICONS[key] ?? Code2;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-white ring-1 ring-neutral-200 dark:ring-white/10",
        round ? "rounded-full" : "rounded-lg",
        size
      )}
    >
      {logo && !failed ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className="h-[60%] w-[60%]"
          onError={() => setFailed(true)}
        />
      ) : (
        <Fallback size={14} className="text-neutral-500" />
      )}
    </span>
  );
}

function TechPill({ name }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5" round />
      {name}
    </li>
  );
}

function TechGrid({ items }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
      {items.map((n) => (
        <li key={n} className="flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5">
          <Logo name={n} size="h-11 w-11" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{n}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ id, icon: Icon, title, subtitle, count, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className={cn("h-11 w-11 rounded-xl", iconBox)}>
            <Icon size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            {subtitle && <p className={cn("mt-1 text-sm", soft)}>{subtitle}</p>}
          </div>
        </div>
        {count != null && (
          <span className="mt-1 shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {count}
          </span>
        )}
      </header>
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
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
        focus,
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/30"
      )}
    >
      {children}
      {count != null && <span className={cn("tabular-nums", active ? "opacity-70" : "text-neutral-400")}>{count}</span>}
    </button>
  );
}

function Pill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
      <Icon size={12} /> {children}
    </span>
  );
}

function BulletList({ label, icon: Icon = CheckCircle2, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon size={15} /> {label}
      </p>
      <ul className="space-y-2.5">
        {items.map((t, i) => (
          <li key={`${t}-${i}`} className={cn("flex items-start gap-3 text-sm leading-7", muted)}>
            <CheckCircle2 size={14} className="mt-1.5 shrink-0 text-neutral-900 dark:text-white" /> {t}
          </li>
        ))}
      </ul>
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
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5">
      <div className="h-full bg-neutral-900 transition-[width] duration-150 dark:bg-white" style={{ width: `${progress}%` }} />
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
      className={cn("fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200", focus)}
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Experience card                                                     */
/* ------------------------------------------------------------------ */

const KIND = {
  work: { label: "Work", icon: BriefcaseBusiness },
  learning: { label: "Learning", icon: GraduationCap },
};

function ExperienceCard({ exp, index, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const kind = KIND[exp.kind] ?? KIND.work;
  const KindIcon = kind.icon;
  const techs = exp.technologies ?? [];

  const brief = [
    { icon: CalendarDays, label: "Period", value: exp.period },
    { icon: kind.icon, label: "Kind", value: kind.label },
    { icon: MapPin, label: "Location", value: exp.location },
    { icon: Code2, label: "Technologies", value: techs.length ? `${techs.length}` : "" },
  ].filter((b) => b.value);

  const links = [
    exp.website && { href: exp.website, icon: Globe, label: exp.websiteLabel || "Website" },
    exp.github && { href: exp.github, icon: Github, label: "Source code" },
    exp.link && { href: exp.link, icon: FileText, label: "Related document" },
  ].filter(Boolean);

  return (
    <li id={`role-${exp.id}`} className="relative grid scroll-mt-28 grid-cols-[2.5rem_1fr] gap-4 pb-8 last:pb-0">
      {/* timeline rail */}
      <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-neutral-300 last:hidden dark:bg-white/20" />
      <span className={cn("relative z-10 h-10 w-10 rounded-full text-sm font-semibold", iconBox)}>{index + 1}</span>

      <article className={cn(card, "p-5 sm:p-7")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className={cn("hidden h-12 w-12 rounded-xl sm:flex", iconBox)}>
              <KindIcon size={21} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Pill icon={KindIcon}>{kind.label}</Pill>
                {exp.type && <span className={cn("text-xs", soft)}>{exp.type}</span>}
              </div>
              <h3 className="mt-2.5 text-xl font-semibold tracking-tight sm:text-2xl">{exp.role}</h3>
              <p className={cn("mt-1 text-sm", muted)}>
                <span className="font-medium text-neutral-900 dark:text-white">{exp.organization}</span>
                {exp.website && (
                  <>
                    {" · "}
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 dark:decoration-neutral-600 dark:hover:decoration-white"
                    >
                      {exp.websiteLabel || "Visit website"} <ExternalLink size={11} />
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`exp-${exp.id}`}
            className={cn("inline-flex min-h-10 shrink-0 items-center gap-1.5 self-start rounded-full border border-neutral-300 px-4 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
          >
            {open ? "Collapse" : "Expand"}
            <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
          </button>
        </div>

        {brief.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {brief.map((b) => (
              <div key={b.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                <dt className={cn("flex items-center gap-1.5 text-xs", soft)}>
                  <b.icon size={13} /> {b.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold">{b.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className={cn("mt-6 text-sm leading-8", muted)}>{exp.summary}</p>

        {techs.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {techs.map((t) => <TechPill key={t} name={t} />)}
          </ul>
        )}

        {open && (
          <div id={`exp-${exp.id}`} className="mt-7 space-y-7 border-t border-neutral-200 pt-7 dark:border-white/10">
            <BulletList label="Responsibilities" icon={ListChecks} items={exp.responsibilities} />
            <BulletList label="Outcomes" icon={Trophy} items={exp.outcomes} />
            <BulletList label="Key achievements" icon={Award} items={exp.achievements} />
            <BulletList label="Skills developed" icon={Sparkles} items={exp.skills} />

            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-6 dark:border-white/10">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
                  >
                    <l.icon size={14} /> {l.label} <ArrowUpRight size={12} className="text-neutral-400" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */

const STRENGTHS = [
  { icon: Target, title: "Problem solving", text: "Breaking down ambiguous requirements into clear, testable steps before writing any code." },
  { icon: Rocket, title: "Shipping mindset", text: "Favoring working, iterable solutions over perfect, delayed ones." },
  { icon: Users, title: "Collaboration", text: "Comfortable with clear communication, code reviews, and handoffs." },
  { icon: Lightbulb, title: "Learning fast", text: "Picking up new stacks and tools without over-relying on tutorials." },
  { icon: ShieldCheck, title: "Reliability", text: "Accurate documentation and honest reporting of progress." },
  { icon: GraduationCap, title: "Fundamentals", text: "Solid grounding in web, networking, and software principles." },
  { icon: Brain, title: "Systems thinking", text: "Understanding how components interact, not just how they behave in isolation." },
  { icon: Handshake, title: "Ownership", text: "Taking responsibility for outcomes, not just tasks assigned." },
  { icon: Compass, title: "Direction", text: "Building toward long-term goals rather than chasing short-term trends." },
];

const WORKFLOW = [
  { title: "Understand", icon: Target, description: "Read the brief, talk to users, and clarify the outcome before writing code." },
  { title: "Plan", icon: Workflow, description: "Break the work into small, testable units with clear API boundaries." },
  { title: "Build", icon: Code2, description: "Implement end-to-end slices, then harden edges with validation and tests." },
  { title: "Iterate", icon: Rocket, description: "Ship, observe real usage, fix what breaks, and improve the next pass." },
];

const PROJECT_STACK = [
  "React", "Node.js", "Express", "Socket.IO", "PostgreSQL", "MongoDB",
  "WebRTC", "Tailwind CSS", "Vite", "Git", "Vercel", "Render",
];

const GITHUB_PROFILE = "https://github.com/Suraj1819";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Experience — Suraj Kumar";
    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  const list = useMemo(() => (Array.isArray(experiences) ? experiences : []), []);

  const stats = useMemo(() => {
    const techSet = new Set();
    list.forEach((e) => (e.technologies || []).forEach((t) => techSet.add(t)));
    PROJECT_STACK.forEach((t) => techSet.add(t));
    return {
      roles: list.length,
      work: list.filter((e) => e.kind !== "learning").length,
      learning: list.filter((e) => e.kind === "learning").length,
      technologies: techSet.size,
      allTech: [...techSet],
      responsibilities: list.reduce((s, e) => s + (e.responsibilities?.length || 0), 0),
      outcomes: list.reduce((s, e) => s + (e.outcomes?.length || 0), 0),
    };
  }, [list]);

  const visible = list.filter((e) => filter === "all" || (e.kind ?? "work") === filter);
  const current = list.find((e) => /present/i.test(e.period ?? ""));

  const sections = useMemo(
    () =>
      [
        { id: "overview", label: "Overview", icon: Lightbulb, show: list.length > 0 },
        { id: "roles", label: "Roles", icon: BriefcaseBusiness, show: true },
        { id: "practical", label: "Practical work", icon: Wrench, show: !!practicalExperience },
        { id: "tech", label: "Tech used", icon: Code2, show: stats.allTech.length > 0 },
        { id: "workflow", label: "How I work", icon: Workflow, show: true },
        { id: "strengths", label: "Strengths", icon: Star, show: true },
      ].filter((s) => s.show),
    [list.length, stats.allTech.length]
  );
  const active = useScrollSpy(sections.map((s) => s.id));

  const brief = [
    { icon: BriefcaseBusiness, label: "Roles", value: stats.roles },
    { icon: Rocket, label: "Work", value: stats.work },
    { icon: GraduationCap, label: "Learning", value: stats.learning },
    { icon: Code2, label: "Technologies", value: stats.technologies },
    { icon: ListChecks, label: "Responsibilities", value: stats.responsibilities },
    { icon: Trophy, label: "Outcomes", value: stats.outcomes },
  ].filter((b) => b.value > 0);

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* ============ HERO ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <nav aria-label="Breadcrumb" className={cn("mb-8 flex flex-wrap items-center gap-1.5 text-sm", soft)}>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white">
              <HomeIcon size={14} /> Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Experience</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                  <Sparkles size={12} /> Experience
                </span>
                {current && <Pill icon={Clock}>Currently: {current.role}</Pill>}
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Experience that goes <span className="text-neutral-400 dark:text-neutral-500">beyond tutorials.</span>
              </h1>
              <p className={cn("mt-5 max-w-xl text-lg leading-8", muted)}>
                Production work, hands-on learning and project-based engineering, described accurately and in the order it happened.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {["Python", "React", "Node.js", "PostgreSQL", "scikit-learn"].map((t) => (
                  <TechPill key={t} name={t} />
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#roles"
                  className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200", focus)}
                >
                  Browse roles <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
                >
                  <Mail size={16} /> Get in touch
                </Link>
              </div>
            </div>

            {/* Brief */}
            <div className={cn(card, "h-fit p-6 sm:p-7")}>
              <div className="mb-5 flex items-center gap-3">
                <span className={cn("h-10 w-10 rounded-xl", iconBox)}>
                  <BriefcaseBusiness size={19} />
                </span>
                <div>
                  <h2 className="font-semibold leading-tight">Experience at a glance</h2>
                  <p className={cn("text-xs", soft)}>Numbers from my record</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {brief.map((b) => (
                  <div key={b.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                    <dt className={cn("flex items-center gap-1.5 text-xs", soft)}>
                      <b.icon size={13} /> {b.label}
                    </dt>
                    <dd className="mt-1.5 text-xl font-semibold tabular-nums">{b.value}</dd>
                  </div>
                ))}
              </dl>

              {current && (
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-white/5">
                  <Clock size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Current role</p>
                    <p className={cn("mt-1 text-sm leading-6", muted)}>
                      {current.role} at {current.organization} · {current.period}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile section nav */}
      <nav aria-label="Sections" className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden">
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  active === s.id
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
                )}
              >
                <s.icon size={13} /> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ CONTENT ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            active === s.id
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                          )}
                        >
                          <s.icon size={14} /> {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Article */}
            <div className="min-w-0 space-y-20">
              {/* OVERVIEW: compact timeline */}
              {list.length > 0 && (
                <Block id="overview" icon={Lightbulb} title="Overview" subtitle="Everything at a glance, newest first." count={list.length}>
                  <ul className={cn(card, "divide-y divide-neutral-200 dark:divide-white/10")}>
                    {list.map((e) => {
                      const K = (KIND[e.kind] ?? KIND.work).icon;
                      return (
                        <li key={e.id}>
                          <a
                            href={`#role-${e.id}`}
                            className={cn("group flex items-center gap-4 p-4 transition hover:bg-neutral-50 dark:hover:bg-white/5 sm:p-5", focus)}
                          >
                            <span className={cn("h-11 w-11 rounded-xl", iconBox)}><K size={19} /></span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">{e.role}</p>
                              <p className={cn("truncate text-xs", soft)}>{e.organization}</p>
                            </div>
                            <span className={cn("hidden shrink-0 text-xs tabular-nums sm:block", soft)}>{e.period}</span>
                            <ArrowUpRight size={16} className="shrink-0 text-neutral-400 transition group-hover:text-neutral-900 dark:group-hover:text-white" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* ROLES */}
              <Block id="roles" icon={BriefcaseBusiness} title="Roles & learning" subtitle="Each entry expands with responsibilities, outcomes and skills." count={visible.length}>
                <div className="mb-6 flex flex-wrap gap-2">
                  <Chip active={filter === "all"} onClick={() => setFilter("all")} count={stats.roles}>All</Chip>
                  <Chip active={filter === "work"} onClick={() => setFilter("work")} count={stats.work}>Work</Chip>
                  <Chip active={filter === "learning"} onClick={() => setFilter("learning")} count={stats.learning}>Learning</Chip>
                </div>

                {visible.length === 0 ? (
                  <div className={cn(card, "border-dashed px-6 py-12 text-center text-sm", soft)}>
                    No entries in this category yet.
                  </div>
                ) : (
                  <ol>
                    {visible.map((exp, i) => (
                      <ExperienceCard key={exp.id} exp={exp} index={i} defaultOpen={i === 0} />
                    ))}
                  </ol>
                )}
              </Block>

              {/* PRACTICAL */}
              {practicalExperience && (
                <Block id="practical" icon={Wrench} title={practicalExperience.title} subtitle="Beyond formal roles.">
                  <div className={cn(card, "mb-4 p-6 sm:p-7")}>
                    <p className={cn("leading-8", muted)}>{practicalExperience.description}</p>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {practicalExperience.highlights.map((h) => (
                      <li key={h} className={cn(card, "flex items-start gap-3.5 p-5")}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10">
                          <Layers size={15} />
                        </span>
                        <p className="pt-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{h}</p>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* TECH */}
              {stats.allTech.length > 0 && (
                <Block id="tech" icon={Code2} title="Technologies across the work" subtitle="Everything used in roles, learning and projects." count={stats.allTech.length}>
                  <div className={cn(card, "p-5 sm:p-6")}>
                    <TechGrid items={stats.allTech} />
                  </div>
                </Block>
              )}

              {/* WORKFLOW */}
              <Block id="workflow" icon={Workflow} title="From brief to ship" subtitle="A repeatable loop I apply to every project.">
                <ol className="grid gap-3 sm:grid-cols-2">
                  {WORKFLOW.map((s, i) => (
                    <li key={s.title} className={cn(card, "p-5 sm:p-6")}>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-2xl font-semibold tabular-nums text-neutral-300 dark:text-neutral-600">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={cn("h-10 w-10 rounded-xl", iconBox)}><s.icon size={18} /></span>
                      </div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className={cn("mt-1.5 text-sm leading-7", muted)}>{s.description}</p>
                    </li>
                  ))}
                </ol>
              </Block>

              {/* STRENGTHS */}
              <Block id="strengths" icon={Star} title="Strengths developed through practice" subtitle="Each one came from a specific project." count={STRENGTHS.length}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {STRENGTHS.map((s) => (
                    <li key={s.title} className={cn(card, "flex items-start gap-3.5 p-5")}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10">
                        <s.icon size={17} />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold">{s.title}</h3>
                        <p className={cn("mt-1 text-sm leading-7", muted)}>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Block>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="rounded-[2rem] bg-neutral-900 px-7 py-12 text-white dark:bg-white dark:text-neutral-900 sm:px-12 sm:py-14">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Want the full picture?</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 opacity-70">
            I&apos;m open to internships, junior roles and collaborations involving full-stack work, real-time systems or practical product delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700"
            >
              <Mail size={16} /> Contact me
            </Link>
            <Link
              to="/projects"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
            >
              <Code2 size={16} /> View projects
            </Link>
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
            >
              <Github size={16} /> GitHub
            </a>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
            >
              <BookOpen size={16} /> About me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}