import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Users,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Gamepad2,
  Github,
  Globe,
  GraduationCap,
  Layers3,
  MapPin,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Workflow,
  Wrench,
  Zap,
  ZoomIn,
  X,
  Quote,
  Star,
  Clock,
  Briefcase,
  Home as HomeIcon,
  ChevronRight,
  ChevronLeft,
  Terminal,
} from "lucide-react";

import { profile } from "../data/profile";
import { projects } from "../data/projects";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const featuredProjectIds = ["webdrop", "bambi", "bambisync", "portfolio"];
const projectIcons = [Network, Layers3, Briefcase, Code2];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[tone]}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Content Data                                                        */
/* ------------------------------------------------------------------ */
const statistics = [
  { value: "300+", label: "DSA Problems", description: "LeetCode & GeeksforGeeks", icon: Code2 },
  { value: "100", label: "Day Streak", description: "Consistent daily practice", icon: Trophy },
  { value: "10+", label: "Projects Built", description: "Production & prototype work", icon: Layers3 },
  { value: "Real-time", label: "Systems", description: "WebRTC & Socket.IO", icon: Network },
];

const capabilities = [
  {
    title: "Frontend Engineering",
    description:
      "Responsive interfaces built with React, Vite and Tailwind CSS — focused on accessibility, performance and clean component architecture.",
    icon: Monitor,
    technologies: ["React", "Vite", "Tailwind CSS", "JavaScript"],
  },
  {
    title: "Backend & APIs",
    description:
      "Node.js and Express services with REST APIs, authentication flows and clean data modeling for production applications.",
    icon: Server,
    technologies: ["Node.js", "Express", "REST APIs", "Socket.IO"],
  },
  {
    title: "Real-Time Systems",
    description:
      "Live applications using WebSockets and WebRTC — covering signaling, data channels and synchronized multi-user interfaces.",
    icon: Zap,
    technologies: ["WebRTC", "Socket.IO", "WebSockets", "STUN"],
  },
  {
    title: "Data & Databases",
    description:
      "Schema design and integration with PostgreSQL, MongoDB and Supabase — choosing the right store for each problem.",
    icon: Database,
    technologies: ["PostgreSQL", "MongoDB", "Supabase", "SQL"],
  },
  {
    title: "Computer Science",
    description:
      "Strong fundamentals in C++, data structures, algorithms, OOP, DBMS and computer networks supporting every project.",
    icon: Cpu,
    technologies: ["C++", "DSA", "OOP", "DBMS", "Networks"],
  },
  {
    title: "Tools & Deployment",
    description:
      "Modern developer workflow with Git, GitHub, Postman, Vercel and Render — from local development to live deployment.",
    icon: Wrench,
    technologies: ["Git", "GitHub", "Postman", "Vercel", "Render"],
  },
];

const highlights = [
  {
    title: "Computer Science Engineering",
    subtitle: "Government Engineering College Vaishali",
    description:
      "Building a foundation in programming, algorithms, databases and computer networks through formal study and applied projects.",
    icon: GraduationCap,
    period: "B.Tech · Ongoing",
  },
  {
    title: "Production Web Development",
    subtitle: "HappyLamb",
    description:
      "Maintaining and extending a live production website — shipping features, fixing issues and improving reliability.",
    icon: Globe,
    period: "Professional work",
  },
  {
    title: "Consistent Problem Solving",
    subtitle: "LeetCode & GeeksforGeeks",
    description:
      "A 100+ day streak of daily DSA practice to strengthen analytical thinking and algorithmic problem-solving skills.",
    icon: Trophy,
    period: "Daily practice",
  },
];

const workflow = [
  {
    number: "01",
    title: "Understand",
    description: "Identify the real problem, map requirements and define the outcome the application should deliver.",
    icon: Target,
  },
  {
    number: "02",
    title: "Plan",
    description: "Break the application into components, define API boundaries and sketch the data flow before writing code.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Build",
    description: "Develop responsive interfaces, implement backend functionality and integrate required services end-to-end.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Test & Ship",
    description: "Validate user flows, troubleshoot edge cases, improve reliability and deploy with a clean rollout plan.",
    icon: ShieldCheck,
  },
];

const principles = [
  "Solve a real problem",
  "Understand the architecture",
  "Build accessible interfaces",
  "Handle errors gracefully",
  "Test important flows",
  "Improve through iteration",
];

const learningTopics = [
  "TypeScript",
  "Advanced React",
  "Next.js",
  "System Design",
  "Application Security",
  "Testing",
  "Scalable APIs",
  "Real-Time Systems",
];

const coreStack = [
  "React", "TypeScript", "Node.js", "Express", "PostgreSQL",
  "MongoDB", "Socket.IO", "WebRTC", "Tailwind CSS", "Vite",
];

const interests = [
  {
    icon: Network,
    title: "Connected systems",
    description:
      "Understanding how browsers, servers, databases and protocols work together — the motivation behind my real-time and peer-to-peer work.",
  },
  {
    icon: Gamepad2,
    title: "Video games & UX",
    description:
      "Games as a study of interaction design, responsive controls and feedback loops — lessons that translate directly into product UX.",
  },
  {
    icon: BookOpen,
    title: "Open source & learning",
    description:
      "Reading source code from open-source projects to learn patterns, conventions and architectural decisions made by experienced engineers.",
  },
  {
    icon: Terminal,
    title: "Tools & workflows",
    description:
      "Experimenting with build tools, terminal workflows and developer-experience improvements — a good toolchain changes how a project feels.",
  },
];

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`mb-12 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}

function IconBox({ icon: Icon, className = "" }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 ${className}`}
    >
      <Icon size={20} strokeWidth={1.6} />
    </div>
  );
}

function PrimaryLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] ${className}`}
    >
      {children}
    </Link>
  );
}

function TechnologyTags({ technologies = [], limit }) {
  if (!Array.isArray(technologies) || technologies.length === 0) return null;
  const visible = typeof limit === "number" ? technologies.slice(0, limit) : technologies;
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tech, index) => {
        const name = typeof tech === "string" ? tech : tech?.name ?? tech?.title ?? tech?.label;
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wallet-style Photo Card Stack                                       */
/* Black wallet container with cards fanning out — click to preview    */
/* ------------------------------------------------------------------ */
const PHOTOS = [
  {
    src: "/suraj.jpg",
    brand: "Suraj",
    title: "Suraj Kumar",
    description: "Full-stack web developer building real-time apps with React, Node.js and WebRTC.",
    balance: "Full-Stack",
    balanceSub: "Web Developer",
    cardStyle: "purple",
  },
  {
    src: "/suraj-2.jpg",
    brand: "Build",
    title: "Engineering",
    description: "From responsive interfaces to backend APIs — turning ideas into working products.",
    balance: "10+ Projects",
    balanceSub: "Shipped & maintained",
    cardStyle: "white",
  },
  {
    src: "/suraj-3.jpg",
    brand: "Learn",
    title: "Always Learning",
    description: "Reading source code, exploring protocols and strengthening fundamentals daily.",
    balance: "100+ Days",
    balanceSub: "DSA practice streak",
    cardStyle: "dark",
  },
];

const CARD_GRADIENTS = {
  purple:
    "bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-600 text-white shadow-[0_18px_40px_-12px_rgba(99,102,241,0.55)]",
  white:
    "bg-white text-neutral-900 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5",
  dark:
    "bg-gradient-to-br from-neutral-800 via-neutral-900 to-black text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/5",
};

function PhotoStack({ onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const total = PHOTOS.length;
  const setLoaded = (i, val) => setLoadedMap((p) => ({ ...p, [i]: val }));
  const setError = (i, val) => {
    setErrorMap((p) => ({ ...p, [i]: val }));
    setLoadedMap((p) => ({ ...p, [i]: true }));
  };

  // Collapsed: cards peek out from wallet top (in px above wallet's top edge)
  // Lower index = more peek (front card), higher z-index for back card to cover front
  const collapsedPeek = [-32, -18, -4];

  // Expanded: cards fan out above wallet (translateX, translateY, rotation)
  const expandedFan = [
    { x: -110, y: -200, rotate: -13, z: 25 }, // left
    { x: 0, y: -230, rotate: 0, z: 35 }, // center (top)
    { x: 110, y: -200, rotate: 13, z: 25 }, // right
  ];

  const getCardStyle = (i) => {
    if (expanded) {
      const fan = expandedFan[i] ?? expandedFan[0];
      return {
        transform: `translate(${fan.x}px, ${fan.y}px) rotate(${fan.rotate}deg)`,
        transformOrigin: "bottom center",
        zIndex: fan.z,
        opacity: 1,
      };
    }
    // Collapsed: card z-index reversed (back card on top so it covers front card's lower visible strip)
    // i=0 (front, peeks most) → lowest z
    // i=2 (back, peeks least) → highest z
    const zMap = [10, 20, 30];
    return {
      transform: `translateY(${collapsedPeek[i] ?? -32}px)`,
      zIndex: zMap[i] ?? 10,
      opacity: 1,
    };
  };

  const activePhoto = PHOTOS[activeIndex];

  return (
    <div
      className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Wallet + cards container */}
      <div className="relative">
        {/* Cards layer — absolutely positioned, peeks above wallet */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
          style={{ height: "0px" }}
        >
          <div className="relative w-[88%]">
            {PHOTOS.map((photo, i) => {
              const isActive = i === activeIndex;
              const style = getCardStyle(i);
              const loaded = loadedMap[i];
              const errored = errorMap[i];

              return (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expanded) {
                      if (isActive) onOpen(i);
                      else setActiveIndex(i);
                    } else {
                      setExpanded(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open "${photo.title}"`}
                  className="group pointer-events-auto absolute inset-x-0 top-0 block w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  style={{
                    ...style,
                    aspectRatio: "1.586 / 1",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex(i);
                      if (expanded) onOpen(i);
                      else setExpanded(true);
                    }
                  }}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl ${
                      CARD_GRADIENTS[photo.cardStyle] ?? CARD_GRADIENTS.purple
                    }`}
                  >
                    {/* Image — top portion of card, no border, no frame */}
                    <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden">
                      {!loaded && !errored && (
                        <div className="absolute inset-0 animate-pulse bg-black/20" />
                      )}
                      {!errored ? (
                        <img
                          src={photo.src}
                          alt={photo.title}
                          onLoad={() => setLoaded(i, true)}
                          onError={() => setError(i, true)}
                          loading={isActive ? "eager" : "lazy"}
                          className={`h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-[1.05] ${
                            loaded ? "opacity-95" : "opacity-0"
                          }`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/30">
                          <GraduationCap size={28} className="text-white/60" />
                        </div>
                      )}
                      {/* Blend image bottom into card color */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 ${
                          photo.cardStyle === "white"
                            ? "bg-gradient-to-t from-white to-transparent"
                            : photo.cardStyle === "dark"
                              ? "bg-gradient-to-t from-neutral-900 to-transparent"
                              : "bg-gradient-to-t from-indigo-600/60 to-transparent"
                        }`}
                      />
                    </div>

                    {/* Brand mark — top right */}
                    <div className="absolute right-4 top-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md ${
                          photo.cardStyle === "white"
                            ? "bg-black/10 text-neutral-700"
                            : "bg-white/20 text-white"
                        }`}
                      >
                        <Sparkles size={10} />
                        {photo.brand}
                      </span>
                    </div>

                    {/* Bottom content — balance + label */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <p
                        className={`text-xl font-bold leading-tight tracking-tight sm:text-2xl ${
                          photo.cardStyle === "white" ? "text-neutral-900" : "text-white"
                        }`}
                      >
                        {photo.balance}
                      </p>
                      <p
                        className={`mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] ${
                          photo.cardStyle === "white" ? "text-neutral-500" : "text-white/70"
                        }`}
                      >
                        {photo.balanceSub}
                      </p>
                    </div>

                    {/* Glossy top edge highlight */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
                        photo.cardStyle === "white" ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wallet container — opaque black, covers cards' lower portion */}
        <div className="relative z-30 mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-neutral-950 p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:p-7">
          {/* Top inner divider — like a wallet's card slot edge */}
          <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="mb-6 h-1.5 w-full rounded-full bg-black/40" />

          {/* Wallet body content — overview of active card */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {expanded ? "Selected card" : "Overview"}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {activePhoto.balance}
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-400">
              {activePhoto.title} · {activePhoto.balanceSub}
            </p>
            <p className="mt-3 max-w-sm text-[13px] leading-6 text-neutral-400">
              {activePhoto.description}
            </p>
          </div>

          {/* CTA + dot navigation */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(activeIndex);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-purple-400 hover:shadow-indigo-500/50 sm:text-sm"
            >
              View full photo
              <ArrowUpRight size={14} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {PHOTOS.map((_, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                      setExpanded(true);
                    }}
                    aria-label={`Go to photo ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-7 bg-gradient-to-r from-indigo-400 to-purple-400"
                        : "w-2 bg-white/15 hover:bg-white/30"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom hint */}
          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={11} />
              {expanded ? "Click a card to preview" : "Hover to fan out cards"}
            </span>
            <span className="tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Wallet ambient ground shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none mx-auto -mt-2 h-8 w-[80%] rounded-[100%] bg-black/15 blur-xl dark:bg-black/40"
        />
      </div>
    </div>
  );
}

function PhotoLightbox({ startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const photos = PHOTOS;
  const photo = photos[index] ?? photos[0];

  const goNext = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i + 1) % photos.length);
  };
  const goPrev = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [onClose, photos.length]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
            {photo.brand}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{photo.title}</p>
        </div>
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur sm:bottom-8">
          <span className="tabular-nums">
            {index + 1} / {photos.length}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */
function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <IconBox icon={Icon} />
        <ArrowUpRight
          size={17}
          className="text-neutral-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
        />
      </div>
      <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
        {stat.value}
      </p>
      <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">{stat.label}</p>
      <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{stat.description}</p>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const Icon = projectIcons[index % projectIcons.length];
  const title = project?.title ?? project?.name ?? "Project";
  const description =
    project?.shortDescription ??
    project?.description ??
    "A practical software project built with modern web technologies.";
  const projectPath = project?.slug ? `/projects/${project.slug}` : "/projects";
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : Array.isArray(project?.techStack)
      ? project.techStack
      : [];

  return (
    <Link
      to={projectPath}
      aria-label={`Explore ${title} project`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
    >
      <article className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_14px_50px_-20px_rgba(0,0,0,0.18)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <IconBox icon={Icon} />
          {project?.status && <StatusBadge status={project.status} />}
        </div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
          Selected · {String(index + 1).padStart(2, "0")}
        </p>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h3>
          <ArrowUpRight
            size={19}
            className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-800 dark:group-hover:text-white"
          />
        </div>
        <p className="mb-6 flex-1 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
        <TechnologyTags technologies={technologies} limit={5} />
        <div className="mt-6 flex items-center gap-2 border-t border-neutral-200/80 pt-4 text-sm font-medium text-neutral-800 dark:border-white/[0.08] dark:text-neutral-200">
          Explore project
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}

function CapabilityCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      <div className="mb-6 flex items-center justify-between">
        <IconBox icon={Icon} />
        <span className="text-xs font-medium tabular-nums text-neutral-300 dark:text-neutral-600">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
      <p className="mb-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{item.description}</p>
      <TechnologyTags technologies={item.technologies} />
    </article>
  );
}

function HighlightCard({ highlight }) {
  const Icon = highlight.icon;
  return (
    <article className="h-full rounded-2xl border border-neutral-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      <div className="mb-6 flex items-start justify-between">
        <IconBox icon={Icon} />
        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
          {highlight.period}
        </span>
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{highlight.title}</h3>
      <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">{highlight.subtitle}</p>
      <p className="mt-3 text-sm leading-7 text-neutral-500 dark:text-neutral-400">{highlight.description}</p>
    </article>
  );
}

function WorkflowCard({ step }) {
  const Icon = step.icon;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-3xl font-semibold tracking-tight text-neutral-200 transition-colors group-hover:text-neutral-300 dark:text-neutral-700 dark:group-hover:text-neutral-500">
          {step.number}
        </span>
        <IconBox icon={Icon} />
      </div>
      <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
      <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">{step.description}</p>
    </article>
  );
}

function InterestCard({ icon: Icon, title, description }) {
  return (
    <article className="group flex h-full gap-5 rounded-2xl border border-neutral-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.12)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      <IconBox icon={Icon} />
      <div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{description}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openPhoto = (index) => {
    setPhotoIndex(index);
    setPhotoOpen(true);
  };

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Suraj Kumar — Full-Stack Web Developer";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const location = profile?.location || "India";
  const allProjects = Array.isArray(projects) ? projects : [];
  const selectedWork = featuredProjectIds
    .map((id) => allProjects.find((project) => project?.id === id))
    .filter(Boolean);
  const featuredWork = selectedWork.length > 0 ? selectedWork : allProjects.slice(0, 4);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      {/* ============ HERO ============ */}
      <section className="relative border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
          {/* Breadcrumb */}
          <nav className="mb-12 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Introduction</span>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div className="relative z-10">
              {/* Status pill */}
              <div className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 sm:text-sm">
                  Open to internships & freelance work
                </span>
              </div>

              <h1 className="max-w-3xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.05em] text-neutral-900 dark:text-white sm:text-6xl xl:text-[4.5rem]">
                Full-stack developer
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  building real-time
                </span>
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">web experiences.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-neutral-600 dark:text-neutral-400 sm:text-lg">
                I'm Suraj Kumar — a Computer Science Engineering student focused on
                full-stack web development, real-time applications and peer-to-peer
                communication systems.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryLink to="/projects">
                  Explore my work <ArrowRight size={16} />
                </PrimaryLink>
                <SecondaryLink to="/about">
                  More about me <ArrowDownRight size={16} />
                </SecondaryLink>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} /> {location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap size={17} /> B.Tech CSE
                </span>
                <span className="inline-flex items-center gap-2">
                  <Github size={16} /> Suraj1819
                </span>
              </div>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-sm px-6 sm:max-w-md sm:px-10 lg:max-w-none lg:px-12">
              <PhotoStack onOpen={openPhoto} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CORE STACK STRIP ============ */}
      <section className="overflow-hidden border-b border-neutral-200/80 bg-white/60 py-7 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 sm:px-8 lg:px-12">
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            Core stack
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {coreStack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-5">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{tech}</span>
                {i < coreStack.length - 1 && (
                  <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:inline-block dark:bg-neutral-700" />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <SectionHeader
            eyebrow="At a glance"
            title="Learning through practice"
            description="A snapshot of what I've been building, studying and shipping — the numbers behind the work."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60}>
                <StatCard stat={stat} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTRODUCTION ============ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12 lg:py-28">
          <Reveal>
            <div>
              <SectionHeader
                eyebrow="Introduction"
                title="Engineering with intent"
                description="I care about both the user experience and the engineering decisions behind it."
              />
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 transition hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-400"
              >
                Read my full story <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-5">
              <p className="text-[15px] leading-8 text-neutral-600 dark:text-neutral-400 sm:text-base">
                My journey combines computer science fundamentals with practical application
                development. I work with React on the frontend and Node.js on the backend, while
                exploring how databases, APIs and network communication bring an application
                together into a complete product.
              </p>
              <p className="text-[15px] leading-8 text-neutral-600 dark:text-neutral-400 sm:text-base">
                Through projects like WebDrop and Bambi, I've tackled engineering challenges
                including peer-to-peer file transfer, real-time messaging, responsive interfaces
                and server-side integration — each one teaching me something new about how
                modern web applications actually work.
              </p>

              <div className="grid gap-4 pt-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <IconBox icon={Code2} />
                  <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Build with purpose
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    Focus on useful functionality, understandable architecture and practical
                    outcomes — not just shipping features.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <IconBox icon={BookOpen} />
                  <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                    Learn continuously
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    Strengthen fundamentals through implementation, debugging and
                    experimentation with new tools and patterns.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURED WORK ============ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow="Selected work"
                title="Projects built to solve problems"
                description="Practical projects exploring modern web technologies, application architecture and communication systems."
              />
              <Link
                to="/projects"
                className="mb-12 inline-flex w-fit shrink-0 items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-500 dark:text-neutral-300 dark:hover:text-white"
              >
                View all projects <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          {featuredWork.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {featuredWork.map((project, index) => (
                <Reveal key={project.id ?? project.slug ?? index} delay={index * 60}>
                  <ProjectCard project={project} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-white/15">
              <IconBox icon={Code2} className="mx-auto" />
              <p className="mt-4 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Projects are being organized.
              </p>
              <Link
                to="/projects"
                className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                Browse projects <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ CAPABILITIES (merged toolkit + what I build) ============ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionHeader
              eyebrow="Capabilities"
              title="What I build and how I build it"
              description="The technologies, tools and concepts I use across frontend, backend, data, real-time systems and computer science fundamentals."
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <CapabilityCard item={item} index={index} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-7 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
              <div className="flex items-start gap-5">
                <IconBox icon={Braces} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    My development approach
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    I prefer React with Vite for current frontend projects and Node.js with
                    Express for backend APIs. I choose databases and communication technologies
                    according to each project's requirements instead of forcing every
                    application into the same architecture.
                  </p>
                  <Link
                    to="/skills"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-400"
                  >
                    Explore all skills <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BACKGROUND ============ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionHeader
              eyebrow="Background"
              title="Education, experience & consistency"
              description="My development journey combines formal education, professional web work and ongoing technical practice."
            />
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 60}>
                <HighlightCard highlight={highlight} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-6 flex flex-wrap gap-3">
              <SecondaryLink to="/about">
                Explore my background <ArrowRight size={16} />
              </SecondaryLink>
              <SecondaryLink to="/contact">
                Discuss an opportunity <ArrowUpRight size={16} />
              </SecondaryLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionHeader
              eyebrow="My process"
              title="From an idea to a working product"
              description="A structured approach to turning requirements into useful, reliable and maintainable software."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => (
              <Reveal key={step.number} delay={index * 60}>
                <WorkflowCard step={step} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-7 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <IconBox icon={CheckCircle2} />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Engineering principles
                </h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((principle) => (
                  <li
                    key={principle}
                    className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <Check size={15} className="shrink-0 text-neutral-500 dark:text-neutral-300" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ LEARNING (currently) ============ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12 lg:py-28">
          <Reveal>
            <div>
              <SectionHeader
                eyebrow="Always learning"
                title="Currently exploring"
                description="Topics I'm actively deepening — to grow as an engineer, not just check boxes."
              />
              <p className="mb-7 max-w-xl text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
                These areas represent where I want to strengthen my understanding next. My
                priority is to learn the fundamentals deeply and apply them in real projects
                rather than chasing every new framework.
              </p>
              <SecondaryLink to="/about">
                Learn about my journey <ArrowRight size={16} />
              </SecondaryLink>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-7 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <IconBox icon={BookOpen} />
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Learning roadmap
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Areas for continued development
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {learningTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 border-t border-neutral-200/80 pt-5 dark:border-white/[0.08]">
                <Zap size={18} className="mt-0.5 shrink-0 text-neutral-500 dark:text-neutral-300" />
                <p className="text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                  My objective is to become a stronger engineer through consistent practice,
                  better architectural decisions and reliable implementation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ INTERESTS ============ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionHeader
              eyebrow="Beyond development"
              title="What keeps me curious"
              description="Technology, problem-solving and interactive experiences shape what I enjoy learning outside the editor."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {interests.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <InterestCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] dark:border-white/[0.09] dark:bg-white/[0.025] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] sm:p-12 lg:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(115,115,115,0.08),transparent_60%)]"
              />
              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
                    <Sparkles size={21} />
                  </div>
                  <SectionLabel>Let's connect</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Have an idea? Let's build something useful.
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    I'm open to relevant freelance projects, internships and collaborations
                    involving web development, full-stack applications and real-time systems.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <PrimaryLink to="/contact">
                    Get in touch <ArrowRight size={16} />
                  </PrimaryLink>
                  <SecondaryLink to="/projects">
                    Explore projects <ArrowUpRight size={16} />
                  </SecondaryLink>
                </div>
              </div>
              <div className="relative mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200/80 pt-6 text-sm text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400">
                <a
                  href="https://github.com/Suraj1819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <Github size={16} /> GitHub <ExternalLink size={13} />
                </a>
                <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <BookOpen size={16} /> About me <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {photoOpen && (
        <PhotoLightbox startIndex={photoIndex} onClose={() => setPhotoOpen(false)} />
      )}
    </main>
  );
}
