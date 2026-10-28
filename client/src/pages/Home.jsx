
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Binary,
  BookOpen,
  Boxes,
  Briefcase,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Heart,
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
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";

import { profile } from "../data/profile";
import { projects } from "../data/projects";

/* -------------------------------------------------------------------------- */
/* Data                                                                        */
/* -------------------------------------------------------------------------- */

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
  {
    icon: Layers3,
    value: 10,
    suffix: "+",
    label: "Projects shipped",
    tone: "violet",
  },
  {
    icon: Code2,
    value: 300,
    suffix: "+",
    label: "DSA problems",
    tone: "sky",
  },
  {
    icon: Trophy,
    value: 100,
    suffix: "",
    label: "Day streak",
    tone: "amber",
  },
  {
    icon: Globe,
    value: 0,
    suffix: "",
    label: "Live sites",
    textValue: "Live",
    tone: "emerald",
  },
];

const layers = [
  {
    icon: Monitor,
    title: "Frontend",
    tone: "sky",
    items: ["React", "Vite", "Tailwind CSS", "JavaScript"],
  },
  {
    icon: Server,
    title: "Backend",
    tone: "emerald",
    items: ["Node.js", "Express", "REST APIs"],
  },
  {
    icon: Database,
    title: "Database",
    tone: "violet",
    items: ["PostgreSQL", "MongoDB", "Supabase", "SQL"],
  },
];

const groups = [
  {
    icon: Zap,
    title: "Real-time",
    tone: "amber",
    items: ["Socket.IO", "WebSockets", "WebRTC"],
  },
  {
    icon: Cloud,
    title: "Deployment",
    tone: "sky",
    items: ["Vercel", "Render"],
  },
  {
    icon: Wrench,
    title: "Dev tools",
    tone: "orange",
    items: ["Git", "GitHub", "Postman"],
  },
  {
    icon: Cpu,
    title: "Computer science",
    tone: "violet",
    items: ["C++", "DSA", "OOP", "DBMS", "Networks"],
  },
];

const services = [
  {
    icon: Layers3,
    title: "Full-stack apps",
    text: "End-to-end web applications with connected interfaces, APIs and databases.",
    tone: "sky",
  },
  {
    icon: Zap,
    title: "Real-time features",
    text: "Chat, live synchronization and peer-to-peer transfers using WebRTC and Socket.IO.",
    tone: "amber",
  },
  {
    icon: Wrench,
    title: "Site improvements",
    text: "Bug fixes, performance improvements and incremental feature development.",
    tone: "emerald",
  },
  {
    icon: Code2,
    title: "Landing pages",
    text: "Responsive, accessible interfaces built around clear user experiences.",
    tone: "violet",
  },
];

const journey = [
  {
    icon: GraduationCap,
    tone: "violet",
    when: "Ongoing",
    title: "B.Tech, Computer Science",
    place: "Government Engineering College Vaishali",
    tags: ["C++", "DSA", "DBMS", "Networks"],
  },
  {
    icon: Briefcase,
    tone: "emerald",
    when: "2025–Present",
    title: "Web Developer at HappyLamb",
    place: "Production website and ongoing development",
    tags: ["New features", "Bug fixes", "Reliability"],
  },
  {
    icon: Trophy,
    tone: "amber",
    when: "Consistent practice",
    title: "Problem solving",
    place: "LeetCode and GeeksforGeeks",
    tags: ["300+ problems", "100-day streak"],
  },
];

const jumpLinks = [
  { href: "#stack", icon: Layers3, label: "Tech stack", tone: "violet" },
  { href: "#projects", icon: Code2, label: "Projects", tone: "sky" },
  { href: "#services", icon: Briefcase, label: "Services", tone: "emerald" },
  { href: "#about", icon: GraduationCap, label: "Background", tone: "amber" },
  { href: "#contact", icon: Mail, label: "Contact", tone: "orange" },
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
    tone: "sky",
  },
  {
    quote:
      "We gave Suraj a vague spec for a dashboard and he came back with something better than what we'd imagined. Communication was clear, deadlines were hit, and the post-launch support was great.",
    name: "Product Manager",
    role: "Stealth startup",
    initial: "T",
    tone: "violet",
  },
];

/* -------------------------------------------------------------------------- */
/* Shared design system                                                        */
/* -------------------------------------------------------------------------- */

const card =
  "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900/60";

const muted = "text-neutral-500 dark:text-neutral-400";

const iconBox =
  "flex shrink-0 items-center justify-center rounded-xl";

const TONES = {
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  orange:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  neutral:
    "bg-neutral-100 text-neutral-600 dark:bg-white/[0.07] dark:text-neutral-300",
};

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";

const hoverCard =
  "transition duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 dark:hover:border-white/20 dark:hover:shadow-black/20";

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-white/[0.05]";

const headingClass =
  "text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl";

const statusIcon = (status) => {
  const value = String(status ?? "").toLowerCase();

  if (/(complete|done|live|deployed)/.test(value)) return CheckCircle2;
  if (/(progress|ongoing|building|wip)/.test(value)) return Clock;

  return Sparkles;
};

/* -------------------------------------------------------------------------- */
/* Animated counter                                                            */
/* -------------------------------------------------------------------------- */

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

    if (typeof IntersectionObserver === "undefined") {
      setStart(true);
      return undefined;
    }

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

/* -------------------------------------------------------------------------- */
/* Reading progress and back-to-top                                            */
/* -------------------------------------------------------------------------- */

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
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-1">
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 transition-[width] duration-150"
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
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:h-12 sm:w-12 ${focus}`}
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Technology logos                                                            */
/* -------------------------------------------------------------------------- */

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
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5 !rounded-full" />
      {name}
    </li>
  );
}

function TechTile({ name }) {
  return (
    <li
      className={`flex flex-col items-center gap-2.5 rounded-xl border border-transparent bg-neutral-50 px-2 py-4 text-center dark:bg-white/[0.04] ${hoverCard}`}
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

/* -------------------------------------------------------------------------- */
/* Reusable section layout                                                     */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  icon: Icon,
  tone = "violet",
  title,
  subtitle,
  link,
  children,
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span
            className={`${iconBox} h-11 w-11 rounded-xl sm:h-12 sm:w-12 ${TONES[tone]}`}
          >
            <Icon size={20} />
          </span>

          <div className="min-w-0">
            <h2 className={headingClass}>{title}</h2>
            {subtitle && (
              <p className={`mt-1 hidden text-sm sm:block ${muted}`}>
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
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-700 underline-offset-4 transition hover:text-violet-600 hover:underline dark:text-neutral-300 dark:hover:text-violet-300 ${focus}`}
    >
      {children}
    </Link>
  );
}

function GroupLabel({ icon: Icon, children }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
      <Icon size={16} />
      {children}
      <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
    </div>
  );
}

function FloatBadge({ name, className }) {
  const logo = LOGOS[name];

  return (
    <div
      className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900 sm:h-14 sm:w-14 ${className}`}
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

/* -------------------------------------------------------------------------- */
/* Technology stack                                                            */
/* -------------------------------------------------------------------------- */

function StackSection() {
  return (
    <div>
      <GroupLabel icon={ArrowLeftRight}>
        Core stack: how data moves through an app
      </GroupLabel>

      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {layers.map((layer, index) => (
          <Fragment key={layer.title}>
            <div className={`${card} p-5 sm:p-6 ${hoverCard}`}>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`${iconBox} h-10 w-10 ${TONES[layer.tone]}`}
                >
                  <layer.icon size={20} />
                </span>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {layer.title}
                </h3>
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
        <GroupLabel icon={Wrench}>Tools and specializations</GroupLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div
              key={group.title}
              className={`${card} p-5 ${hoverCard}`}
            >
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={`${iconBox} h-10 w-10 ${TONES[group.tone]}`}
                >
                  <group.icon size={20} />
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {group.title}
                </h3>
              </div>

              <TechGrid items={group.items} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <GroupLabel icon={Sparkles}>Currently learning</GroupLabel>

        <ul className="flex flex-wrap gap-2.5">
          {learning.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 dark:border-white/20 dark:bg-white/[0.03] dark:text-neutral-300"
            >
              <Sparkles size={14} className="text-violet-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project cards                                                               */
/* -------------------------------------------------------------------------- */

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
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-white/20 dark:hover:shadow-black/20 ${focus}`}
    >
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 sm:h-40">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]"
        />

        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-white/20" />
        <div className="absolute -bottom-12 -left-5 h-32 w-32 rounded-full border border-white/20" />

        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-sm transition duration-300 group-hover:scale-110">
          <Icon size={34} strokeWidth={1.6} />
        </span>

        {project?.status && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-2.5 py-1 text-xs font-medium text-neutral-800">
            <StatusIcon size={13} />
            {project.status}
          </span>
        )}

        {project?.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-xs font-semibold text-amber-950">
            <Star size={12} className="fill-amber-950" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
            {title}
          </h3>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition group-hover:bg-violet-50 group-hover:text-violet-700 dark:bg-white/[0.06] dark:text-neutral-400 dark:group-hover:bg-violet-500/10 dark:group-hover:text-violet-300">
            <ArrowUpRight size={17} />
          </span>
        </div>

        {description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}

        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tech.map((item) => (
              <Tech key={item} name={item} />
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-white/[0.07] sm:mt-5">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Explore project
          </span>
          <ArrowRight
            size={16}
            className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-300"
          />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Service cards                                                               */
/* -------------------------------------------------------------------------- */

function ServiceCard({ service }) {
  const Icon = service.icon;

  return (
    <article className={`${card} group p-5 sm:p-6 ${hoverCard}`}>
      <div className="mb-5 flex items-center justify-between">
        <span
          className={`${iconBox} h-12 w-12 ${TONES[service.tone]}`}
        >
          <Icon size={22} />
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 transition group-hover:bg-neutral-100 group-hover:text-neutral-800 dark:bg-white/[0.04] dark:text-neutral-500 dark:group-hover:bg-white/10 dark:group-hover:text-white">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <h3 className="font-semibold text-neutral-900 dark:text-white">
        {service.title}
      </h3>

      <p className={`mt-2 text-sm leading-6 ${muted}`}>
        {service.text}
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Photo component                                                             */
/* -------------------------------------------------------------------------- */

function Photo({ src, alt, className = "" }) {
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

/* -------------------------------------------------------------------------- */
/* Main page                                                                   */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Suraj Kumar — Full-stack web developer";

    const timer = setTimeout(() => setLoading(false), 1800);

    return () => {
      document.title = previousTitle;
      clearTimeout(timer);
    };
  }, []);

  const location = profile?.location || "India";
  const allProjects = Array.isArray(projects) ? projects : [];

  const pickedProjects = featuredProjectIds
    .map((id) => allProjects.find((project) => project?.id === id))
    .filter(Boolean);

  const featured = (
    pickedProjects.length > 0 ? pickedProjects : allProjects.slice(0, 4)
  ).slice(0, 4);

  const facts = [
    { icon: MapPin, text: location, tone: "orange" },
    { icon: GraduationCap, text: "B.Tech CSE", tone: "violet" },
    { icon: Briefcase, text: "HappyLamb", tone: "emerald" },
  ];

  const primaryBtn = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:min-h-12 sm:px-6 ${focus}`;

  const outlineBtn = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/15 dark:bg-transparent dark:text-neutral-200 dark:hover:bg-white/[0.05] sm:min-h-12 sm:px-6 ${focus}`;

  /* Professional loading screen — white UI with circular profile photo + animations */
  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex min-h-screen flex-col items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
        {/* Keyframe animation styles */}
        <style>{`
          @keyframes loadingSlide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
          @keyframes photoPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3); }
            50% { box-shadow: 0 0 0 14px rgba(99, 102, 241, 0); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(16px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0.85); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes techWobble {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-3deg); }
            75% { transform: translateY(-4px) rotate(3deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes orbitSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Soft gradient backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-1/4 h-72 w-72 animate-pulse rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
          <div className="absolute right-1/4 bottom-1/4 h-72 w-72 animate-pulse rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/10" style={{ animationDelay: "300ms" }} />
          <div className="absolute left-1/3 top-1/3 h-56 w-56 animate-pulse rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-500/8" style={{ animationDelay: "600ms" }} />
        </div>

        {/* Grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Circular profile photo with orbiting tech logos */}
          <div className="relative mb-6 flex items-center justify-center" style={{ width: "180px", height: "180px" }}>
            {/* Orbiting ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-neutral-200 dark:border-white/10"
              style={{ animation: "orbitSpin 12s linear infinite" }}
            >
              {/* Tech logos positioned on the orbit */}
              {["React", "Node.js", "WebRTC", "PostgreSQL"].map((tech, i) => {
              const logo = LOGOS[tech];
              if (!logo) return null;
              const angle = (i * 90) - 90;
              const radius = 90;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              return (
                <div
                  key={tech}
                  className="absolute flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    /* Counter-rotate so logos stay upright */
                    animation: "orbitSpin 12s linear infinite reverse",
                  }}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
                    alt={tech}
                    className="h-4 w-4"
                    loading="eager"
                  />
                </div>
              );
            })}
            </div>

            {/* Inner pulsing ring */}
            <div
              className="absolute rounded-full"
              style={{ animation: "photoPulse 2.5s ease-out infinite", width: "112px", height: "112px" }}
            />

            {/* Photo container — scales in on mount */}
            <div
              className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-sky-200 ring-4 ring-sky-50 dark:border-sky-500/30 dark:ring-sky-500/5 sm:h-28 sm:w-28"
              style={{ animation: "scaleIn 0.5s ease-out" }}
            >
              <img
                src="/suraj.jpg"
                alt="Suraj Kumar"
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fb = e.currentTarget.nextElementSibling;
                  if (fb) fb.classList.remove("hidden");
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center bg-neutral-100 text-2xl font-bold text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300">
                SK
              </div>
            </div>
          </div>

          {/* Name — fades in with slight delay */}
          <h1
            className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl"
            style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
          >
            Suraj Kumar
          </h1>

          {/* Role — fades in with more delay */}
          <p
            className="mt-1 text-sm text-sky-600 dark:text-sky-400"
            style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}
          >
            Full-stack web developer
          </p>

          {/* Loading bar — fades in */}
          <div
            className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10"
            style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
          >
            <div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500"
              style={{ animation: "loadingSlide 1.5s ease-in-out infinite" }}
            />
          </div>

          {/* Loading text with bouncing dots */}
          <div
            className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
            style={{ animation: "fadeInUp 0.6s ease-out 0.8s both" }}
          >
            <span>Loading portfolio</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500"
                  style={{ animationDelay: `${dot * 150}ms` }}
                />
              ))}
            </span>
          </div>

          {/* Tech logos floating — wobble animation */}
          <div
            className="mt-10 flex items-center gap-4 opacity-50"
            style={{ animation: "fadeInUp 0.6s ease-out 1s both" }}
          >
            {["React", "Node.js", "Tailwind CSS", "Vite"].map((tech, i) => {
              const logo = LOGOS[tech];
              return logo ? (
                <div
                  key={tech}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900"
                  style={{ animation: "techWobble 2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
                    alt={tech}
                    className="h-5 w-5"
                    loading="eager"
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Bottom branding — subtle float */}
        <div
          className="absolute bottom-8 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-600"
          style={{ animation: "floatY 3s ease-in-out infinite" }}
        >
          <Sparkles size={12} />
          <span>Built with React, Vite & Tailwind CSS</span>
        </div>
      </div>
    );
  }

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
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
          <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/10" />
        </div>

        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to internships and freelance
          </p>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Suraj Kumar,
            <span className="mt-1 block text-neutral-400 dark:text-neutral-500">
              full-stack developer.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:mt-6 sm:text-lg sm:leading-8">
            From interface to database to deployment, I build web applications
            that are responsive, reliable and designed for real users.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
            {facts.map((fact) => (
              <li
                key={fact.text}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300 sm:px-3.5 sm:text-sm"
              >
                <fact.icon
                  size={15}
                  className={
                    fact.tone === "orange"
                      ? "text-orange-600 dark:text-orange-300"
                      : fact.tone === "violet"
                        ? "text-violet-600 dark:text-violet-300"
                        : "text-emerald-600 dark:text-emerald-300"
                  }
                />
                {fact.text}
              </li>
            ))}

            <li>
              <a
                href="https://github.com/Suraj1819"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:border-white/30 sm:px-3.5 sm:text-sm ${focus}`}
              >
                <Github size={15} />
                Suraj1819
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <Link to="/projects" className={primaryBtn}>
              <Layers3 size={17} />
              View projects
              <ArrowRight size={15} />
            </Link>

            <Link to="/contact" className={outlineBtn}>
              <Mail size={17} />
              Get in touch
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 sm:mt-10">
            <div className="flex -space-x-2">
              {[
                { initial: "R", tone: "sky" },
                { initial: "I", tone: "violet" },
                { initial: "T", tone: "emerald" },
                { initial: "U", tone: "amber" },
              ].map((item) => (
                <span
                  key={item.initial}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-50 text-xs font-semibold dark:border-neutral-950 ${TONES[item.tone]}`}
                >
                  {item.initial}
                </span>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Building and learning every day
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Full-stack development · Problem solving
              </p>
            </div>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-xs px-4 sm:max-w-sm">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-violet-500/15 via-transparent to-sky-500/15 blur-xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-gradient-to-br from-violet-100 via-neutral-100 to-sky-100 p-2 shadow-xl dark:border-white/10 dark:from-violet-500/10 dark:via-neutral-900 dark:to-sky-500/10">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/[0.06]">
              <img
                src="/suraj.jpg"
                alt="Suraj Kumar"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <FloatBadge
            name="React"
            className="-left-2 top-10 sm:-left-4"
          />
          <FloatBadge
            name="Node.js"
            className="-right-2 top-20 sm:-right-4"
          />
          <FloatBadge
            name="PostgreSQL"
            className="-left-4 top-[52%]"
          />
          <FloatBadge
            name="Socket.IO"
            className="-right-3 top-[60%] sm:-right-5"
          />

          <div className="absolute -bottom-5 left-1/2 flex w-[84%] -translate-x-1/2 items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-neutral-900 sm:p-3.5">
            <span className={`${iconBox} h-11 w-11 ${TONES.violet}`}>
              <GraduationCap size={21} />
            </span>

            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                B.Tech CSE
              </p>
              <p className={`mt-1 truncate text-xs ${muted}`}>
                GEC Vaishali
              </p>
            </div>
            <span className="ml-auto">
              <CheckCircle2
                size={18}
                className="text-emerald-600 dark:text-emerald-300"
              />
            </span>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION */}
      <nav
        aria-label="Page sections"
        className="mx-auto max-w-6xl px-4 pb-8 sm:px-8"
      >
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {jumpLinks.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:bg-white/[0.06] sm:px-4 sm:text-sm ${focus}`}
              >
                <item.icon
                  size={15}
                  className={
                    item.tone === "violet"
                      ? "text-violet-600 dark:text-violet-300"
                      : item.tone === "sky"
                        ? "text-sky-600 dark:text-sky-300"
                        : item.tone === "emerald"
                          ? "text-emerald-600 dark:text-emerald-300"
                          : item.tone === "amber"
                            ? "text-amber-600 dark:text-amber-300"
                            : "text-orange-600 dark:text-orange-300"
                  }
                />
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
              <span
                className={`${iconBox} h-11 w-11 ${TONES[stat.tone]} sm:h-12 sm:w-12`}
              >
                <stat.icon size={20} />
              </span>

              <div className="min-w-0">
                <dd className="text-xl font-semibold leading-none text-neutral-900 dark:text-white sm:text-2xl">
                  {stat.textValue ?? (
                    <Counter value={stat.value} suffix={stat.suffix} />
                  )}
                </dd>

                <dt className={`mt-1.5 text-xs ${muted} sm:text-sm`}>
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
        tone="violet"
        title="My tech stack"
        subtitle="The tools I use and how they fit together."
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
          tone="sky"
          title="Selected projects"
          subtitle="A selection of applications and tools I've worked on."
          link={
            <TextLink to="/projects">
              View all <ArrowRight size={14} />
            </TextLink>
          }
        >
          {featured.length > 0 ? (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {featured.map((project, index) => (
                <ProjectTile
                  key={project.id ?? project.slug ?? index}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={`${card} px-5 py-12 text-center`}>
              <span
                className={`${iconBox} mx-auto h-12 w-12 ${TONES.sky}`}
              >
                <Code2 size={22} />
              </span>
              <h3 className="mt-4 font-semibold text-neutral-900 dark:text-white">
                Projects coming soon
              </h3>
              <p className={`mt-2 text-sm ${muted}`}>
                Check the projects page for updates.
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* SERVICES */}
      <Section
        id="services"
        icon={Briefcase}
        tone="emerald"
        title="What I can build"
        subtitle="Areas where I can contribute to your next project."
      >
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <div className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <Section
          id="testimonials"
          icon={Heart}
          tone="orange"
          title="What people say"
          subtitle="Feedback and experiences from project collaborations."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.initial}
                className={`${card} flex h-full flex-col p-5 sm:p-6 ${hoverCard}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`${iconBox} h-10 w-10 ${TONES[testimonial.tone]}`}
                  >
                    <MessageSquare size={19} />
                  </span>

                  <div
                    className="flex gap-0.5 text-amber-500"
                    aria-label="5 out of 5 stars"
                  >
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        className="fill-amber-400"
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="flex-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-neutral-100 pt-4 dark:border-white/[0.07]">
                  <span
                    className={`${iconBox} h-10 w-10 rounded-full ${TONES[testimonial.tone]}`}
                  >
                    <UserRound size={18} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className={`mt-0.5 text-xs ${muted}`}>
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
      <div
        id="about"
        className="border-b border-neutral-200 dark:border-white/10"
      >
        <Section
          icon={GraduationCap}
          tone="violet"
          title="Background"
          subtitle="Education, work and the habits behind the progress."
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
                  className="relative grid grid-cols-[2.75rem_1fr] gap-3 pb-5 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-4 sm:pb-6"
                >
                  {index < journey.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-5 top-12 w-px -translate-x-1/2 bg-neutral-200 dark:bg-white/15 sm:left-6"
                    />
                  )}

                  <span
                    className={`${iconBox} relative z-10 h-10 w-10 rounded-xl ${TONES[item.tone]} sm:h-12 sm:w-12`}
                  >
                    <item.icon size={19} />
                  </span>

                  <div className={`${card} p-4 sm:p-5 ${hoverCard}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white sm:text-lg">
                        {item.title}
                      </h3>

                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${TONES[item.tone]}`}
                      >
                        {item.when}
                      </span>
                    </div>

                    <p className={`mt-1.5 text-sm leading-6 ${muted}`}>
                      {item.place}
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className={`${card} p-3 sm:p-4`}>
              <div className="mb-3 flex items-center gap-3 px-1 pt-1">
                <span
                  className={`${iconBox} h-10 w-10 ${TONES.sky}`}
                >
                  <BookOpen size={19} />
                </span>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Beyond the code
                  </h3>
                  <p className={`mt-0.5 text-xs ${muted}`}>
                    Learning, building and problem solving
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
          </div>
        </Section>
      </div>

      {/* CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24"
      >
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 px-5 py-9 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-white/10 dark:bg-neutral-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
          </div>

          <div className="relative">
            <p className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-medium text-neutral-200">
              <Sparkles size={14} className="text-amber-300" />
              Let's collaborate
            </p>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Let's build something meaningful.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
              I'm open to internships, freelance work and development
              opportunities. Tell me about your idea or project.
            </p>

            <ul className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {[
                {
                  icon: Briefcase,
                  tone: "emerald",
                  label: "Open to",
                  value: "Internships and freelance",
                },
                {
                  icon: MapPin,
                  tone: "orange",
                  label: "Based in",
                  value: location,
                },
                {
                  icon: Github,
                  tone: "violet",
                  label: "GitHub",
                  value: "Suraj1819",
                },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 sm:p-4"
                >
                  <span
                    className={`${iconBox} h-10 w-10 rounded-xl bg-white text-neutral-900 sm:h-11 sm:w-11`}
                  >
                    <item.icon size={19} />
                  </span>

                  <div className="min-w-0 leading-tight">
                    <p className="text-xs text-neutral-400">{item.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
              <Link
                to="/contact"
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 sm:min-h-12 sm:px-6 ${focus}`}
              >
                <Mail size={17} />
                Send a message
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://github.com/Suraj1819"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10 sm:min-h-12 sm:px-6 ${focus}`}
              >
                <Github size={17} />
                GitHub
                <ExternalLink size={14} />
              </a>

              <Link
                to="/projects"
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10 sm:min-h-12 sm:px-6 ${focus}`}
              >
                <Code2 size={17} />
                Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-7 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row sm:px-8 sm:py-8 sm:text-sm">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Suraj Kumar. Built with React, Vite
            and Tailwind CSS.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Suraj1819"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 transition hover:text-violet-600 dark:hover:text-violet-300 ${focus}`}
            >
              <Github size={15} />
              GitHub
            </a>

            <Link
              to="/projects"
              className={`inline-flex items-center gap-1.5 transition hover:text-sky-600 dark:hover:text-sky-300 ${focus}`}
            >
              <Code2 size={15} />
              Projects
            </Link>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-1.5 transition hover:text-emerald-600 dark:hover:text-emerald-300 ${focus}`}
            >
              <Mail size={15} />
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
