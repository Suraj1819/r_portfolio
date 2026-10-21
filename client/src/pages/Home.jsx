
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Binary,
  Boxes,
  Briefcase,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Network,
  Plug,
  Server,
  Sparkles,
  Star,
  Trophy,
  Wrench,
  Zap,
  ArrowUp,
  Heart,
} from "lucide-react";

import { profile } from "../data/profile";
import { projects } from "../data/projects";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const featuredProjectIds = ["webdrop", "bambi", "bambisync", "portfolio"];
const projectIcons = [Layers3, MessageSquare, Briefcase, Code2];

const LOGOS = {
  React: ["react", "61DAFB"],
  Vite: ["vite", "646CFF"],
  "Tailwind CSS": ["tailwindcss", "06B6D4"],
  JavaScript: ["javascript", "F7DF1E"],
  TypeScript: ["typescript", "3178C6"],
  "Node.js": ["nodedotjs", "5FA04E"],
  Express: ["express", "000000"],
  PostgreSQL: ["postgresql", "4169E1"],
  MongoDB: ["mongodb", "47A248"],
  Supabase: ["supabase", "3FCF8E"],
  "Socket.IO": ["socketdotio", "010101"],
  WebRTC: ["webrtc", "333333"],
  Git: ["git", "F05032"],
  GitHub: ["github", "181717"],
  Postman: ["postman", "FF6C37"],
  Vercel: ["vercel", "000000"],
  Render: ["render", "46E3B7"],
  "C++": ["cplusplus", "00599C"],
};

const FALLBACK_ICONS = {
  SQL: Database,
  "REST APIs": Globe,
  WebSockets: Plug,
  DSA: Binary,
  OOP: Boxes,
  DBMS: Database,
  Networks: Network,
};

const stats = [
  { icon: Layers3, value: 10, suffix: "+", label: "Projects shipped" },
  { icon: Code2, value: 300, suffix: "+", label: "DSA problems" },
  { icon: Trophy, value: 100, suffix: "", label: "Day streak" },
  { icon: Globe, value: 0, suffix: "", label: "Live sites", textValue: "Live" },
];

const layers = [
  {
    icon: Monitor,
    title: "Frontend",
    items: ["React", "Vite", "Tailwind CSS", "JavaScript"],
  },
  {
    icon: Server,
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs"],
  },
  {
    icon: Database,
    title: "Database",
    items: ["PostgreSQL", "MongoDB", "Supabase", "SQL"],
  },
];

const groups = [
  { icon: Zap, title: "Real-time", items: ["Socket.IO", "WebSockets", "WebRTC"] },
  { icon: Cloud, title: "Deployment", items: ["Vercel", "Render"] },
  { icon: Wrench, title: "Dev tools", items: ["Git", "GitHub", "Postman"] },
  { icon: Cpu, title: "Computer science", items: ["C++", "DSA", "OOP", "DBMS", "Networks"] },
];

const services = [
  {
    icon: Layers3,
    title: "Full-stack apps",
    text: "End-to-end builds — interface, API, and database wired together.",
    accent: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Real-time features",
    text: "Chat, live sync, peer-to-peer — built on WebRTC and Socket.IO.",
    accent: "text-amber-500",
  },
  {
    icon: Wrench,
    title: "Site improvements",
    text: "Bug fixes, performance tuning, and incremental new features.",
    accent: "text-emerald-500",
  },
  {
    icon: Code2,
    title: "Landing pages",
    text: "Fast, responsive pages designed for real users.",
    accent: "text-violet-500",
  },
];

const journey = [
  {
    icon: GraduationCap,
    when: "Ongoing",
    title: "B.Tech, Computer Science",
    place: "Government Engineering College Vaishali",
    tags: ["C++", "DSA", "DBMS", "Networks"],
  },
  {
    icon: Briefcase,
    when: "2025–Present",
    title: "Web Developer at HappyLamb",
    place: "Live production website",
    tags: ["New features", "Bug fixes", "Reliability"],
  },
  {
    icon: Trophy,
    when: "Consistent practice",
    title: "Problem solving",
    place: "LeetCode and GeeksforGeeks",
    tags: ["300+ problems", "100-day streak"],
  },
];

const jumpLinks = [
  { href: "#stack", icon: Layers3, label: "Stack" },
  { href: "#projects", icon: Code2, label: "Projects" },
  { href: "#services", icon: Briefcase, label: "Services" },
  { href: "#about", icon: GraduationCap, label: "Background" },
  { href: "#contact", icon: Mail, label: "Contact" },
];

const learning = [
  "TypeScript",
  "Next.js",
  "System design",
  "Testing",
  "Web security",
];

const testimonials = [
  {
    quote:
      "Suraj shipped our real-time chat feature in half the time we'd estimated. The code was clean, well-tested, and the latency was actually lower than what we were aiming for.",
    name: "Project Lead",
    role: "HappyLamb",
    initial: "U",
  },
  {
    quote:
      "We gave Suraj a vague spec for a dashboard and he came back with something better than what we'd imagined. Communication was clear, deadlines were hit, and the post-launch support was great.",
    name: "Product Manager",
    role: "Stealth startup",
    initial: "T",
  },
];

const statusIcon = (status) => {
  const value = String(status ?? "").toLowerCase();

  if (/(complete|done|live|deployed)/.test(value)) return CheckCircle2;
  if (/(progress|ongoing|building|wip)/.test(value)) return Clock;

  return Sparkles;
};

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";

const iconBox =
  "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";

const hoverCard =
  "transition duration-300 hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-900/5 dark:hover:border-white dark:hover:shadow-white/5";

const soft = "text-neutral-500 dark:text-neutral-400";

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */

function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || target === 0) return undefined;

    let raf;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

function Counter({ value, suffix = "" }) {
  const [start, setStart] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const number = useCountUp(value, 1400, start);

  return (
    <span ref={ref} className="tabular-nums">
      {number}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Reading progress + back to top                                      */
/* ------------------------------------------------------------------ */

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
        className="h-full bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 transition-[width] duration-150 dark:from-white dark:via-neutral-300 dark:to-white"
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
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:h-12 sm:w-12 ${focus}`}
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tech logo pieces                                                    */
/* ------------------------------------------------------------------ */

function Logo({ name, size = "h-6 w-6", imgSize = "h-[62%] w-[62%]" }) {
  const logo = LOGOS[name];
  const Fallback = FALLBACK_ICONS[name] ?? Code2;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 dark:ring-white/10 ${size}`}
    >
      {logo ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className={imgSize}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Fallback size={16} className="text-neutral-500" />
      )}
    </span>
  );
}

function Tech({ name }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5 !rounded-full" />
      {name}
    </li>
  );
}

function TechTile({ name }) {
  return (
    <li
      className={`flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5 ${hoverCard}`}
    >
      <Logo name={name} size="h-11 w-11" />
      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
        {name}
      </span>
    </li>
  );
}

function TechGrid({ items }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
      {items.map((tech) => (
        <TechTile key={tech} name={tech} />
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

function Section({ id, icon: Icon, title, subtitle, link, children }) {
  return (
    <section
      id={id}
      className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${iconBox}`}
          >
            <Icon size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {title}
            </h2>

            {subtitle && (
              <p className={`mt-1 hidden text-sm sm:block ${soft}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {link}
      </div>

      {children}
    </section>
  );
}

function TextLink({ to, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${focus}`}
    >
      {children}
    </Link>
  );
}

function FloatBadge({ name, className }) {
  const logo = LOGOS[name];

  return (
    <div
      className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-neutral-200 dark:ring-white/10 sm:h-14 sm:w-14 ${className}`}
    >
      {logo && (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt={name}
          loading="lazy"
          className="h-6 w-6 sm:h-7 sm:w-7"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

function GroupLabel({ icon: Icon, children }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
      <Icon size={16} />
      {children}
      <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
    </div>
  );
}

function StackSection() {
  return (
    <div>
      <GroupLabel icon={ArrowLeftRight}>
        Core stack: how data moves through an app
      </GroupLabel>

      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {layers.map((layer, index) => (
          <Fragment key={layer.title}>
            <div className={`${card} p-5 ${hoverCard}`}>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}
                >
                  <layer.icon size={20} />
                </span>
                <h3 className="text-lg font-semibold">{layer.title}</h3>
              </div>

              <TechGrid items={layer.items} />
            </div>

            {index < layers.length - 1 && (
              <div
                className="flex items-center justify-center text-neutral-400"
                aria-hidden="true"
              >
                <ArrowLeftRight size={24} className="hidden md:block" />
                <ArrowRight size={22} className="md:hidden" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="mt-8">
        <GroupLabel icon={Wrench}>Around the core</GroupLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title} className={`${card} p-5 ${hoverCard}`}>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}
                >
                  <group.icon size={20} />
                </span>
                <h3 className="font-semibold">{group.title}</h3>
              </div>

              <TechGrid items={group.items} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <GroupLabel icon={Sparkles}>Learning next</GroupLabel>

        <ul className="flex flex-wrap gap-2.5">
          {learning.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-neutral-400 px-4 py-2 text-sm font-medium text-neutral-700 dark:border-white/25 dark:text-neutral-300"
            >
              <Sparkles size={13} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

function ProjectTile({ project, index }) {
  const Icon = projectIcons[index % projectIcons.length];
  const title = project?.title ?? project?.name ?? "Project";
  const description =
    project?.shortDescription ?? project?.description ?? "";
  const path = project?.slug ? `/projects/${project.slug}` : "/projects";

  const rawTech = Array.isArray(project?.technologies)
    ? project.technologies
    : project?.techStack ?? [];

  const tech = rawTech
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.name ?? item?.title ?? item?.label
    )
    .filter(Boolean)
    .slice(0, 4);

  const StatusIcon = statusIcon(project?.status);

  return (
    <Link
      to={path}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-900/5 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white dark:hover:shadow-white/5 ${focus}`}
    >
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-800 dark:to-neutral-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]"
        />

        <Icon
          size={44}
          strokeWidth={1.5}
          className="relative text-white/90 transition group-hover:scale-110"
        />

        {project?.status && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-800">
            <StatusIcon size={12} />
            {project.status}
          </span>
        )}

        {project?.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-xs font-semibold text-amber-950">
            <Star size={11} className="fill-amber-950" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h3>

          <ArrowUpRight
            size={20}
            className="mt-1 shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white"
          />
        </div>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}

        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
            {tech.map((item) => (
              <Tech key={item} name={item} />
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

function Photo({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
      className={`w-full rounded-2xl bg-neutral-200 object-cover dark:bg-white/10 ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Service card                                                        */
/* ------------------------------------------------------------------ */

function ServiceCard({ service }) {
  const Icon = service.icon;

  const gradient =
    service.accent === "text-blue-500"
      ? "from-blue-500 to-blue-300"
      : service.accent === "text-amber-500"
        ? "from-amber-500 to-amber-300"
        : service.accent === "text-emerald-500"
          ? "from-emerald-500 to-emerald-300"
          : "from-violet-500 to-violet-300";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04] ${hoverCard}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${gradient} transition-transform duration-300 group-hover:scale-x-100`}
      />

      <span
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/10 ${service.accent}`}
      >
        <Icon size={22} />
      </span>

      <h3 className="font-semibold">{service.title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        {service.text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Suraj Kumar — Full-stack web developer";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const location = profile?.location || "India";
  const allProjects = Array.isArray(projects) ? projects : [];

  const pickedProjects = featuredProjectIds
    .map((id) => allProjects.find((project) => project?.id === id))
    .filter(Boolean);

  const featured =
    (pickedProjects.length > 0 ? pickedProjects : allProjects.slice(0, 4)).slice(
      0,
      4
    );

  const facts = [
    { icon: MapPin, text: location },
    { icon: GraduationCap, text: "B.Tech CSE" },
    { icon: Briefcase, text: "HappyLamb" },
  ];

  const primaryBtn = `inline-flex min-h-11 items-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:min-h-12 sm:px-6 ${focus}`;

  const outlineBtn = `inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 sm:min-h-12 sm:px-6 ${focus}`;

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />
          <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
        </div>

        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium dark:border-white/10 dark:bg-white/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to internships and freelance
          </p>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Suraj Kumar,
            <span className="block text-neutral-400 dark:text-neutral-500">
              full-stack developer.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:mt-6 sm:text-lg sm:leading-8">
            From interface to database to deployment — I build web apps that
            are fast, reliable, and actually ship.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
            {facts.map((fact) => (
              <li
                key={fact.text}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-200/70 px-3 py-1.5 text-xs font-medium sm:px-3.5 sm:py-2 sm:text-sm dark:bg-white/10"
              >
                <fact.icon size={14} />
                {fact.text}
              </li>
            ))}

            <li>
              <a
                href="https://github.com/Suraj1819"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-neutral-200/70 px-3 py-1.5 text-xs font-medium hover:bg-neutral-300/70 sm:px-3.5 sm:py-2 sm:text-sm dark:bg-white/10 dark:hover:bg-white/15 ${focus}`}
              >
                <Github size={14} />
                Suraj1819
              </a>
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <Link to="/projects" className={primaryBtn}>
              <Layers3 size={16} />
              View projects
            </Link>

            <Link to="/contact" className={outlineBtn}>
              <Mail size={16} />
              Get in touch
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 sm:mt-10">
            <div className="flex -space-x-2">
              {["R", "I", "T", "U"].map((initial) => (
                <span
                  key={initial}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-xs font-semibold text-neutral-700 ring-2 ring-neutral-50 dark:bg-white/10 dark:text-neutral-300 dark:ring-neutral-950"
                >
                  {initial}
                </span>
              ))}
            </div>

            <p className={`text-xs ${soft}`}>
              Trusted by{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                4+ teams
              </span>{" "}
              for shipping product
            </p>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-xs px-4 sm:max-w-sm">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 blur-xl" />

          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-neutral-200 to-neutral-300 shadow-2xl dark:from-white/10 dark:to-white/5">
            <img
              src="/suraj.jpg"
              alt="Suraj Kumar"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <FloatBadge name="React" className="-left-2 top-10 sm:-left-4" />
          <FloatBadge name="Node.js" className="-right-2 top-20 sm:-right-4" />
          <FloatBadge name="PostgreSQL" className="-left-4 top-[52%]" />
          <FloatBadge name="Socket.IO" className="-right-3 top-[60%] sm:-right-5" />

          <div className="absolute -bottom-5 left-1/2 flex w-[80%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-white p-3 text-neutral-900 shadow-xl ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-white dark:ring-white/10 sm:p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <GraduationCap size={20} />
            </span>

            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold">B.Tech CSE</p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                GEC Vaishali
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JUMP NAVIGATION */}
      <nav
        aria-label="Page sections"
        className="mx-auto max-w-6xl px-4 pb-8 sm:px-8"
      >
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {jumpLinks.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium transition hover:border-neutral-900 sm:px-4 sm:py-2 sm:text-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-white ${focus}`}
              >
                <item.icon size={14} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8">
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${card} flex items-center gap-3 p-4 sm:gap-4 sm:p-5 ${hoverCard}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/10 sm:h-12 sm:w-12">
                <stat.icon size={18} />
              </span>

              <div className="min-w-0">
                <dd className="text-xl font-semibold leading-none sm:text-2xl">
                  {stat.textValue ?? (
                    <Counter value={stat.value} suffix={stat.suffix} />
                  )}
                </dd>

                <dt className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* STACK */}
      <Section
        id="stack"
        icon={Layers3}
        title="My stack"
        subtitle="The tools I reach for first — and how they fit together."
        link={
          <TextLink to="/skills">
            All skills <ArrowRight size={14} />
          </TextLink>
        }
      >
        <StackSection />
      </Section>

      {/* PROJECTS */}
      <div className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <Section
          id="projects"
          icon={Code2}
          title="Selected projects"
          subtitle="A few builds I'm proud of — each one shipped and live where possible."
          link={
            <TextLink to="/projects">
              View all <ArrowRight size={14} />
            </TextLink>
          }
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {featured.map((project, index) => (
              <ProjectTile
                key={project.id ?? project.slug ?? index}
                project={project}
                index={index}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* SERVICES */}
      <Section
        id="services"
        icon={Briefcase}
        title="What I can build"
        subtitle="Where I can plug in and add value from day one."
      >
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <div className="border-t border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <Section
          id="testimonials"
          icon={Heart}
          title="What people say"
          subtitle="Words from folks I've worked with."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.initial}
                className={`${card} flex h-full flex-col p-6 ${hoverCard}`}
              >
                <div
                  className="mb-4 flex gap-0.5 text-amber-400"
                  aria-label="5 out of 5 stars"
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className="fill-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="flex-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-neutral-200 pt-4 dark:border-white/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
                    {testimonial.initial}
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {testimonial.role}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      </div>

      {/* BACKGROUND */}
      <div id="about" className="border-t border-neutral-200 dark:border-white/10">
        <Section
          icon={GraduationCap}
          title="Background"
          subtitle="Education, work, and the daily habits that compound."
          link={
            <TextLink to="/about">
              About me <ArrowRight size={14} />
            </TextLink>
          }
        >
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <ol className="relative">
              {journey.map((item, index) => (
                <li
                  key={item.title}
                  className="relative grid grid-cols-[2.75rem_1fr] gap-4 pb-7 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:pb-8"
                >
                  {index < journey.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-5 top-12 w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20 sm:left-6"
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${iconBox}`}
                  >
                    <item.icon size={18} />
                  </span>

                  <div className={`${card} p-4 sm:p-5 ${hoverCard}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-semibold sm:text-lg">
                        {item.title}
                      </h3>

                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                        {item.when}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {item.place}
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:text-neutral-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Photo
                src="/suraj-2.jpg"
                alt="Suraj at work"
                className="col-span-2 aspect-[16/10]"
              />
              <Photo
                src="/suraj-3.jpg"
                alt="Suraj studying"
                className="aspect-square"
              />
              <Photo
                src="/suraj.jpg"
                alt="Suraj Kumar"
                className="aspect-square"
              />
            </div>
          </div>
        </Section>
      </div>

      {/* CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-8 lg:pb-28"
      >
        <div className="relative overflow-hidden rounded-[1.5rem] bg-neutral-900 px-6 py-12 text-white sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14 lg:py-16 dark:bg-white dark:text-neutral-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/10" />
          </div>

          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium dark:bg-neutral-900/10">
              <Sparkles size={12} />
              Let's collaborate
            </p>

            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Let's build something.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 opacity-70 sm:text-base">
              I'm open to internships, freelance, and full-time opportunities.
              Tell me what you're building.
            </p>

            <ul className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {[
                {
                  icon: Briefcase,
                  label: "Open to",
                  value: "Internships, freelance",
                },
                { icon: MapPin, label: "Based in", value: location },
                { icon: Github, label: "GitHub", value: "Suraj1819" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 dark:bg-neutral-900/5 sm:p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white sm:h-11 sm:w-11">
                    <item.icon size={18} />
                  </span>

                  <div className="min-w-0 leading-tight">
                    <p className="text-xs opacity-60">{item.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-12 sm:px-6 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700"
              >
                <Mail size={16} />
                Send a message
              </Link>

              <a
                href="https://github.com/Suraj1819"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-12 sm:px-6 dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
              >
                <Github size={16} />
                GitHub
              </a>

              <Link
                to="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-12 sm:px-6 dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
              >
                <Code2 size={16} />
                Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row sm:px-8 sm:text-sm">
          <p>
            © {new Date().getFullYear()} Suraj Kumar. Built with React, Vite
            &amp; Tailwind.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Suraj1819"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white ${focus}`}
            >
              <Github size={14} />
              GitHub
            </a>

            <Link
              to="/projects"
              className={`inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white ${focus}`}
            >
              <Code2 size={14} />
              Projects
            </Link>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white ${focus}`}
            >
              <Mail size={14} />
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
