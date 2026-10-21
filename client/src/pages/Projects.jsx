import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Binary,
  Boxes,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FolderKanban,
  Gauge,
  GitBranch,
  Github,
  Globe,
  Grid3x3,
  Home as HomeIcon,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Lightbulb,
  List,
  Mail,
  Network,
  Plug,
  Rocket,
  Search,
  Server,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { projects, portfolioStats } from "../data/projects";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/* Tech logos (official brand colours)                                 */
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
  mongoose: ["mongoose", "880000"],
  supabase: ["supabase", "3FCF8E"],
  socketio: ["socketdotio", "010101"],
  webrtc: ["webrtc", "333333"],
  git: ["git", "F05032"],
  github: ["github", "181717"],
  postman: ["postman", "FF6C37"],
  vercel: ["vercel", "000000"],
  render: ["render", "46E3B7"],
  netlify: ["netlify", "00C7B7"],
  html: ["html5", "E34F26"], html5: ["html5", "E34F26"],
  css: ["css3", "1572B6"], css3: ["css3", "1572B6"],
  firebase: ["firebase", "FFCA28"],
  mysql: ["mysql", "4479A1"],
  redis: ["redis", "DC382D"],
  docker: ["docker", "2496ED"],
  python: ["python", "3776AB"],
  numpy: ["numpy", "013243"],
  pandas: ["pandas", "150458"],
  scikitlearn: ["scikitlearn", "F7931E"],
  tensorflow: ["tensorflow", "FF6F00"],
  pytorch: ["pytorch", "EE4C2C"],
  jupyter: ["jupyter", "F37626"],
  matplotlib: ["matplotlib", "11557C"],
  fastapi: ["fastapi", "009688"],
  flask: ["flask", "000000"],
  reactrouter: ["reactrouter", "CA4245"],
  threejs: ["threedotjs", "000000"],
  zod: ["zod", "3E67B1"],
  figma: ["figma", "F24E1E"],
  android: ["android", "3DDC84"],
  bluetooth: ["bluetooth", "0082FC"],
  monacoeditor: ["monacoeditor", "000000"],
  d3js: ["d3dotjs", "F9A03C"],
  openai: ["openai", "412991"],
  langchain: ["langchain", "1C3C3C"],
  pgvector: ["postgresql", "4169E1"],
  pymupdf: ["python", "3776AB"],
  stripe: ["stripe", "635BFF"],
  plaid: ["plaid", "000000"],
  distilbert: ["huggingface", "FFD21E"],
  mux: ["mux", "F91C62"],
  esp32: ["espressif", "E7352C"],
  mqtt: ["mqtt", "660066"],
  mediasoup: ["web rtc", "333333"],
  whisper: ["openai", "412991"],
  grafana: ["grafana", "F46800"],
  opentelemetry: ["opentelemetry", "425CC7"],
  clickhouse: ["clickhouse", "FFCC01"],
  kafka: ["apachekafka", "000000"],
  reactnative: ["reactos", "00D8FF"],
  expo: ["expo", "000020"],
  coturn: ["webrtc", "333333"],
  yjs: ["web rtc", "333333"],
};

const FALLBACK_ICONS = {
  sql: Database, dbms: Database, restapis: Globe, restapi: Globe, api: Globe,
  websockets: Plug, websocket: Plug, stun: Network, turn: Network, networks: Network,
  dsa: Binary, oop: Boxes, librosa: Brain, datachannels: Network,
};

const norm = (v) => String(v ?? "").toLowerCase().trim();
const key = (n) => norm(n).replace(/[\s._-]/g, "");
const techName = (t) => (typeof t === "string" ? t : t?.name ?? t?.label ?? t?.title ?? "");

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */

const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox = "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";
const hoverCard = "transition hover:border-neutral-900 hover:shadow-lg hover:shadow-neutral-900/5 dark:hover:border-white dark:hover:shadow-white/5";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

const GITHUB_PROFILE = "https://github.com/Suraj1819";

/* ------------------------------------------------------------------ */
/* Auto-loaded cover photos (Vite build-time via import.meta.glob)     */
/* Same pattern as ProjectDetails.jsx — drop your image files into:    */
/*   src/assets/projects/[slug]/image/                                 */
/* (any filename, any of png/jpg/jpeg/webp/gif/avif/svg)               */
/* The 1st file (alphabetical) becomes the project card's cover.       */
/* If your files live in `public/projects/[slug]/image/`, set the      */
/* project's `image` field in data/projects.js to that public URL     */
/* instead, e.g. image: "/projects/voxsense/image/01.png"             */
/* ------------------------------------------------------------------ */

const IMG_GLOB = import.meta.glob(
  "/src/assets/projects/*/image/*.{png,jpg,jpeg,webp,gif,avif,svg}",
  { eager: true, query: "?url", import: "default" }
);

const imagesBySlug = {};
Object.entries(IMG_GLOB).forEach(([path, url]) => {
  const match = path.match(/\/src\/assets\/projects\/([^/]+)\/image\/(.+)$/);
  if (!match) return;
  const slug = match[1];
  if (!imagesBySlug[slug]) imagesBySlug[slug] = [];
  imagesBySlug[slug].push({ src: url, caption: null });
});

function getAutoImages(slug) {
  return slug ? (imagesBySlug[slug] ?? []) : [];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getImages(p) {
  const out = [];
  const add = (img) => {
    const src = typeof img === "string" ? img : img?.src ?? img?.url;
    if (src && !out.includes(src)) out.push(src);
  };
  add(p?.image ?? p?.cover ?? p?.thumbnail);
  (Array.isArray(p?.preview) ? p.preview : []).forEach(add);
  (Array.isArray(p?.gallery) ? p.gallery : []).forEach(add);
  (Array.isArray(p?.images) ? p.images : []).forEach(add);
  // Fallback: auto-loaded images from src/assets/projects/[slug]/image/
  getAutoImages(p?.slug).forEach((im) => add(im.src));
  return out;
}

/* Resolve the project's own logo URL (optional `project.logo` field). */
function getProjectLogoUrl(p) {
  const logo = p?.logo;
  if (typeof logo === "string") return logo;
  if (logo && typeof logo === "object") return logo.src ?? logo.url ?? "";
  return "";
}

const toUrl = (v) => {
  const raw = typeof v === "string" ? v : v?.url ?? v?.href ?? "";
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return /^(https?:|mailto:)/i.test(s) ? s : `https://${s}`;
};

function getLinks(p) {
  const l = p?.links && !Array.isArray(p.links) ? p.links : {};
  const pick = (...vals) => vals.map(toUrl).find(Boolean) || "";
  return {
    live: pick(l.live, l.demo, l.website, p?.live, p?.demo, p?.website),
    github: pick(l.github, l.repo, l.source, p?.github, p?.repo),
    backend: pick(l.backend, l.api, l.server),
    frontend: pick(l.frontend, l.client),
    docs: pick(l.docs, l.documentation),
    design: pick(l.design, l.figma),
    blog: pick(l.blog, l.caseStudy),
  };
}

const primaryCategory = (p) => String(p?.category ?? "").split(" / ")[0] || p?.filters?.[0] || "";

function statusTone(status) {
  const s = norm(status);
  if (/(complete|done|live|deployed)/.test(s)) return "done";
  if (/(progress|ongoing|building|wip)/.test(s)) return "progress";
  if (/(prototype|experimental|exploratory)/.test(s)) return "prototype";
  return "other";
}

const STATUS_ICONS = { done: CheckCircle2, progress: Clock, prototype: AlertCircle, other: Sparkles };
const STATUS_STYLES = {
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  progress: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  prototype: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30",
  other: "bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-white/10 dark:text-neutral-300 dark:ring-white/20",
};

function sortProjects(list, sort) {
  const indexed = list.map((p, i) => ({ p, i }));
  const when = (p) => Number(String(p?.year ?? "0").replace(/[^0-9]/g, "").slice(0, 4) || "0");
  const rank = (p) => ({ done: 0, progress: 1, prototype: 2, other: 3 }[statusTone(p.status)]);
  indexed.sort((a, b) => {
    if (sort === "name") return String(a.p.title).localeCompare(String(b.p.title));
    if (sort === "newest") return when(b.p) - when(a.p) || a.i - b.i;
    if (sort === "oldest") return when(a.p) - when(b.p) || a.i - b.i;
    if (sort === "status") return rank(a.p) - rank(b.p) || a.i - b.i;
    return Number(!!b.p.featured) - Number(!!a.p.featured) || a.i - b.i;
  });
  return indexed.map((e) => e.p);
}

function featurePreview(p) {
  if (Array.isArray(p?.features)) {
    return p.features.map((f) => (typeof f === "string" ? f : f?.name)).filter(Boolean).slice(0, 4);
  }
  return (p?.goals ?? []).slice(0, 3);
}

const archSummary = (p) => (typeof p?.architecture === "string" ? p.architecture : p?.architecture?.summary ?? null);

/* ------------------------------------------------------------------ */
/* Animated counter                                                   */
/* ------------------------------------------------------------------ */

function useCountUp(target, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();
    const animate = (t) => {
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
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
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && (setStart(true), obs.disconnect()),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const n = useCountUp(value, 1200, start);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function Logo({ name, size = "h-6 w-6", round = false, className }) {
  const [failed, setFailed] = useState(false);
  const k = key(name);
  const logo = LOGOS[k];
  const Fallback = FALLBACK_ICONS[k] ?? Code2;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-white ring-1 ring-neutral-200 dark:ring-white/10",
        round ? "rounded-full" : "rounded-lg",
        size,
        className
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

function StatusBadge({ status }) {
  if (!status) return null;
  const tone = statusTone(status);
  const Icon = STATUS_ICONS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[tone]
      )}
    >
      <Icon size={12} /> {status}
    </span>
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

/* ------------------------------------------------------------------ */
/* Scroll-spy, reading progress & back-to-top (sidebar helpers)        */
/* Mirrors the pattern used in ProjectDetails.jsx                      */
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
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 print:hidden",
        focus
      )}
    >
      <ArrowUp size={20} />
    </button>
  );
}

function ProjectCover({ project, className }) {
  const src = getImages(project)[0];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className={cn("relative flex items-center justify-center overflow-hidden bg-neutral-100 px-6 text-center dark:bg-white/5", className)}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative">
          <span className={cn("mx-auto mb-3 h-12 w-12 rounded-2xl", iconBox)}>
            <Layers size={22} />
          </span>
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</p>
          {project.tagline && <p className={cn("mt-1 text-sm", soft)}>{project.tagline}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-neutral-100 dark:bg-white/5", className)}>
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl" />
      <img
        src={src}
        alt={`${project.title} preview`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="relative h-full w-full object-cover"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project logo — displayed next to the project title                   */
/* 1. project.logo (URL) — explicit brand logo                         */
/* 2. Fallback: first technology's logo via the <Logo> component       */
/* 3. Fallback: <Layers> icon                                          */
/* ------------------------------------------------------------------ */

function ProjectLogo({ project, size = "h-10 w-10", className }) {
  const projectLogo = getProjectLogoUrl(project);
  const techFallback = (project?.technologies ?? []).map(techName).find(Boolean);

  if (projectLogo) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-white/10",
          size,
          className
        )}
      >
        <img
          src={projectLogo}
          alt=""
          loading="lazy"
          className="h-[70%] w-[70%] rounded object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </span>
    );
  }

  if (techFallback) {
    return <Logo name={techFallback} size={size} round className={className} />;
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-400",
        size,
        className
      )}
    >
      <Layers size="50%" />
    </span>
  );
}

function TechRow({ items, limit = 6, active, onTech }) {
  const names = (items ?? []).map(techName).filter(Boolean);
  if (!names.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {names.slice(0, limit).map((t, index) => (
        <li key={t} className={index >= 3 ? "hidden sm:list-item" : "min-w-0"}>
          <button
            type="button"
            onClick={() => onTech(t)}
            aria-pressed={key(active) === key(t)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5 text-[11px] font-medium transition",
              key(active) === key(t)
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/30"
            )}
          >
            <Logo name={t} size="h-5 w-5" round />
            {t}
          </button>
        </li>
      ))}
      {names.length > 3 && (
        <li className="inline-flex items-center px-1.5 text-[11px] text-neutral-400 sm:hidden">+{names.length - 3}</li>
      )}
      {names.length > limit && (
        <li className="hidden items-center px-1.5 text-[11px] text-neutral-400 sm:inline-flex">+{names.length - limit}</li>
      )}
    </ul>
  );
}

/* Metadata badges — duration, team size, role */
function MetaRow({ project }) {
  const items = [];
  if (project.duration) items.push({ icon: Clock, label: project.duration });
  if (project.teamSize) items.push({ icon: Users, label: `${project.teamSize} ${project.teamSize === 1 ? "person" : "people"}` });
  if (project.role) items.push({ icon: GitBranch, label: project.role });

  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
      {items.map((m, i) => (
        <li key={i} className={cn("inline-flex items-center gap-1", soft)}>
          <m.icon size={12} /> {m.label}
        </li>
      ))}
    </ul>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="rounded-lg bg-neutral-50 p-2.5 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{metric.label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{metric.value}</p>
    </div>
  );
}

function Actions({ project, onQuickView }) {
  const l = getLinks(project);
  const secondary =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5";
  const primary =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";
  return (
    <div className="flex flex-wrap gap-2">
      {l.live && (
        <a href={l.live} target="_blank" rel="noopener noreferrer" className={cn(primary, focus)}>
          <ExternalLink size={14} /> Live demo
        </a>
      )}
      <Link to={`/projects/${project.slug}`} className={cn(l.live ? secondary : primary, focus)}>
        Case study <ArrowRight size={14} />
      </Link>
      {l.github && (
        <a href={l.github} target="_blank" rel="noopener noreferrer" className={cn(secondary, focus)}>
          <Github size={14} /> GitHub
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison toggle                                                  */
/* ------------------------------------------------------------------ */

function CompareToggle({ project, isComparing, onToggle, compareMode }) {
  if (!compareMode) return null;
  return (
    <button
      type="button"
      onClick={() => onToggle(project)}
      aria-pressed={isComparing}
      className={cn(
        "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset transition",
        isComparing
          ? "bg-neutral-900 text-white ring-neutral-900 dark:bg-white dark:text-neutral-900 dark:ring-white"
          : "bg-white/90 text-neutral-700 ring-neutral-200 backdrop-blur hover:ring-neutral-400 dark:bg-neutral-900/80 dark:text-neutral-200 dark:ring-white/20",
        focus
      )}
    >
      <Boxes size={12} /> {isComparing ? "In compare" : "Compare"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Featured card                                                       */
/* ------------------------------------------------------------------ */

function FeaturedCard({ project, activeTech, onTech,  compareMode, compareSet, toggleCompare }) {
  const points = featurePreview(project);
  const arch = archSummary(project);
  const imgs = getImages(project).length;
  const metrics = project.metrics ?? [];
  const inCompare = compareSet.has(project.slug);

  return (
    <article className={cn(card, "group relative overflow-hidden", hoverCard)}>
      <CompareToggle
        project={project}
        isComparing={inCompare}
        onToggle={toggleCompare}
        compareMode={compareMode}
      />
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative">
          <Link to={`/projects/${project.slug}`} className="block">
            <ProjectCover project={project} className="aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-full" />
          </Link>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
            <Star size={12} /> Featured
          </span>
          {imgs > 0 && (
            <Link
              to={`/projects/${project.slug}#gallery`}
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/80"
            >
              <ImageIcon size={12} /> {imgs} photos
            </Link>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-3 p-4 sm:justify-center sm:gap-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {primaryCategory(project) && (
              <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                {primaryCategory(project)}
              </span>
            )}
            {project.year && <span className={cn("text-xs", soft)}>{project.year}</span>}
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4">
            <ProjectLogo project={project} size="h-12 w-12 sm:h-14 sm:w-14" />
            <div className="min-w-0">
              <p className={cn("mb-1 hidden text-xs font-semibold uppercase tracking-[0.18em] sm:block", soft)}>Spotlight</p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{project.title}</h2>
              {project.tagline && <p className={cn("mt-1 text-sm sm:mt-2 sm:text-base", soft)}>{project.tagline}</p>}
            </div>
          </div>

          <div className="hidden sm:block"><MetaRow project={project} /></div>

          <p className={cn("text-sm leading-6 sm:text-sm sm:leading-7", muted)}>{project.shortDescription || project.description}</p>

          {metrics.length > 0 && (
            <div className="hidden grid-cols-2 gap-2 sm:grid sm:grid-cols-4">
              {metrics.slice(0, 4).map((m) => (
                <MetricCard key={m.label} metric={m} />
              ))}
            </div>
          )}

          {arch && (
            <div className="hidden rounded-xl bg-neutral-50 p-4 dark:bg-white/5 sm:block">
              <p className={cn("mb-1.5 flex items-center gap-1.5 text-xs font-semibold", soft)}>
                <Layers size={12} /> Architecture
              </p>
              <p className={cn("line-clamp-3 text-sm leading-6", muted)}>{arch}</p>
            </div>
          )}

          {points.length > 0 && (
            <ul className="hidden space-y-1.5 sm:block">
              {points.map((h) => (
                <li key={h} className={cn("flex items-start gap-2 text-sm", muted)}>
                  <CheckCircle2 size={14} className="mt-1 shrink-0 text-neutral-900 dark:text-white" /> {h}
                </li>
              ))}
            </ul>
          )}

          <TechRow items={project.technologies} limit={8} active={activeTech} onTech={onTech} />
          <Actions project={project} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */

function ProjectCard({ project, view, activeTech, onTech,  compareMode, compareSet, toggleCompare }) {
  const list = view === "list";
  const points = featurePreview(project);
  const arch = archSummary(project);
  const imgs = getImages(project).length;
  const metrics = project.metrics ?? [];
  const inCompare = compareSet.has(project.slug);

  return (
    <article className={cn(card, "group relative overflow-hidden", hoverCard, list ? "flex flex-col sm:flex-row" : "flex flex-col")}>
      <CompareToggle
        project={project}
        isComparing={inCompare}
        onToggle={toggleCompare}
        compareMode={compareMode}
      />

      <div className={cn("relative shrink-0", list && "sm:w-72 lg:w-80")}>
        <Link to={`/projects/${project.slug}`} className="block h-full">
          <ProjectCover
            project={project}
            className={cn("w-full", list ? "aspect-[16/9] sm:h-full sm:min-h-[220px] sm:aspect-auto" : "aspect-[16/10] sm:aspect-[16/9]")}
          />
        </Link>
        {project.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
            <Star size={10} /> Featured
          </span>
        )}
        {imgs > 0 && (
          <Link
            to={`/projects/${project.slug}#gallery`}
            aria-label={`View ${imgs} photos`}
            className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/85"
          >
            <ImageIcon size={11} /> {imgs}
          </Link>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={cn("text-xs font-medium", soft)}>
            {primaryCategory(project)}
            {project.year && <span className="ml-2 opacity-70">{project.year}</span>}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <div className="flex items-center gap-2.5">
          <ProjectLogo project={project} size="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
            {project.tagline && <p className={cn("mt-0.5 text-xs", soft)}>{project.tagline}</p>}
          </div>
        </div>

        <div className="mt-2 hidden sm:block">
          <MetaRow project={project} />
        </div>

        <p className={cn("mt-2 line-clamp-2 text-sm leading-5 sm:mt-3 sm:line-clamp-3 sm:leading-6", muted)}>{project.shortDescription || project.description}</p>

        {!list && metrics.length > 0 && (
          <div className="mt-3 hidden grid-cols-2 gap-1.5 sm:grid">
            {metrics.slice(0, 2).map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </div>
        )}

        {list && arch && (
          <p className={cn("mt-2 hidden line-clamp-2 text-xs leading-5 sm:block", soft)}>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Architecture: </span>
            {arch}
          </p>
        )}

        {list && metrics.length > 0 && (
          <div className="mt-2 hidden grid-cols-2 gap-1.5 sm:grid">
            {metrics.slice(0, 4).map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </div>
        )}

        {points.length > 0 && (
          <ul className="mt-3 hidden space-y-1 sm:block">
            {points.slice(0, list ? 3 : 2).map((h) => (
              <li key={h} className={cn("flex items-start gap-2 text-xs", soft)}>
                <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 sm:mt-4">
          <TechRow items={project.technologies} limit={list ? 8 : 5} active={activeTech} onTech={onTech} />
        </div>

        <div className="mt-auto pt-5">
          <Actions project={project} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline card                                                      */
/* ------------------------------------------------------------------ */

function TimelineCard({ project,  activeTech, onTech }) {
  const points = featurePreview(project).slice(0, 2);
  const metrics = project.metrics ?? [];

  return (
    <article className={cn(card, "group relative flex flex-col overflow-hidden p-5 sm:p-6", hoverCard)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
          <Calendar size={12} /> {project.year}
        </span>
        <StatusBadge status={project.status} />
      </div>

      <div className="flex items-center gap-2.5">
        <ProjectLogo project={project} size="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          {project.tagline && <p className={cn("mt-0.5 text-xs", soft)}>{project.tagline}</p>}
        </div>
      </div>

      <div className="mt-2 hidden sm:block">
        <MetaRow project={project} />
      </div>

      <p className={cn("mt-3 line-clamp-2 text-sm leading-6", muted)}>{project.shortDescription || project.description}</p>

      {metrics.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {metrics.slice(0, 2).map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </div>
      )}

      {points.length > 0 && (
        <ul className="mt-3 space-y-1">
          {points.map((h) => (
            <li key={h} className={cn("flex items-start gap-2 text-xs", soft)}>
              <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <TechRow items={project.technologies} limit={5} active={activeTech} onTech={onTech} />
      </div>

      <div className="mt-auto pt-5">
        <Actions project={project} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison Modal                                                   */
/* ------------------------------------------------------------------ */

function ComparisonModal({ projects, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!projects.length) return null;

  const rows = [
    { label: "Status", get: (p) => <StatusBadge status={p.status} /> },
    { label: "Year", get: (p) => p.year ?? "—" },
    { label: "Category", get: (p) => primaryCategory(p) || "—" },
    { label: "Duration", get: (p) => p.duration ?? "—" },
    { label: "Team size", get: (p) => (p.teamSize ? `${p.teamSize} ${p.teamSize === 1 ? "person" : "people"}` : "—") },
    { label: "Role", get: (p) => p.role ?? "—" },
    { label: "Technologies", get: (p) => <TechRow items={p.technologies} limit={8} /> },
    { label: "Featured", get: (p) => (p.featured ? <Star size={14} className="text-amber-500" /> : "—") },
    {
      label: "Live demo",
      get: (p) => {
        const l = getLinks(p);
        return l.live ? (
          <a href={l.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 underline-offset-2 hover:underline dark:text-white">
            <ExternalLink size={12} /> Visit
          </a>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        );
      },
    },
    {
      label: "GitHub",
      get: (p) => {
        const l = getLinks(p);
        return l.github ? (
          <a href={l.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 underline-offset-2 hover:underline dark:text-white">
            <Github size={12} /> Repo
          </a>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        );
      },
    },
    { label: "Tagline", get: (p) => p.tagline ?? "—" },
    {
      label: "Top metrics",
      get: (p) =>
        (p.metrics ?? []).length ? (
          <ul className="space-y-1">
            {p.metrics.slice(0, 3).map((m) => (
              <li key={m.label} className="text-[11px]">
                <span className="font-semibold text-neutral-900 dark:text-white">{m.value}</span>
                <span className="text-neutral-500"> — {m.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Project comparison"
    >
      <div
        className="relative my-4 w-full max-w-6xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-950 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comparison"
          className={cn(
            "absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 ring-1 ring-neutral-200 backdrop-blur transition hover:bg-neutral-100 dark:bg-neutral-900/80 dark:ring-white/20 dark:hover:bg-neutral-800",
            focus
          )}
        >
          <X size={16} />
        </button>

        <header className="mb-6">
          <p className={cn("mb-1 text-xs font-semibold uppercase tracking-[0.18em]", soft)}>Side by side</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Comparing {projects.length} projects</h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-40 p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Attribute
                </th>
                {projects.map((p) => (
                  <th key={p.slug} className="border-l border-neutral-200 p-3 text-left align-bottom dark:border-white/10">
                    <Link to={`/projects/${p.slug}`} className="block">
                      <span className="block text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">{p.title}</span>
                      {p.tagline && <span className={cn("mt-0.5 block text-xs", soft)}>{p.tagline}</span>}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-neutral-200 dark:border-white/10">
                  <td className="p-3 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{r.label}</td>
                  {projects.map((p) => (
                    <td key={p.slug} className="border-l border-neutral-200 p-3 text-sm align-top dark:border-white/10">
                      {r.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [compareMode, setCompareMode] = useState(false);
  const [compareSet, setCompareSet] = useState(new Set());
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    document.title = "Projects — Suraj Kumar";
  }, []);

  // Keyboard shortcut: "/" focuses search, "Esc" clears
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const all = useMemo(() => (Array.isArray(projects) ? projects : []), []);

  const filterOptions = useMemo(() => {
    const counts = new Map();
    all.forEach((p) => (p.filters ?? []).forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1)));
    return [["All", all.length], ...counts.entries()];
  }, [all]);

  const techOptions = useMemo(() => {
    const counts = new Map();
    all.forEach((p) =>
      (p.technologies ?? []).map(techName).filter(Boolean).forEach((t) => {
        const k = key(t);
        const entry = counts.get(k) ?? { name: t, count: 0 };
        entry.count += 1;
        counts.set(k, entry);
      })
    );
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 14);
  }, [all]);

  const statusOptions = useMemo(() => {
    const counts = new Map();
    counts.set("all", all.length);
    all.forEach((p) => {
      const tone = statusTone(p.status);
      counts.set(tone, (counts.get(tone) ?? 0) + 1);
    });
    return [
      { id: "all", label: "All statuses", count: counts.get("all") ?? 0 },
      { id: "done", label: "Completed", count: counts.get("done") ?? 0 },
      { id: "progress", label: "In progress", count: counts.get("progress") ?? 0 },
      { id: "prototype", label: "Prototype", count: counts.get("prototype") ?? 0 },
    ];
  }, [all]);

  const stats = useMemo(() => ({
    ...portfolioStats,
    progress: all.filter((p) => statusTone(p.status) === "progress").length,
    prototype: all.filter((p) => statusTone(p.status) === "prototype").length,
  }), [all]);

  const filtered = useMemo(() => {
    const q = norm(query);
    const list = all.filter((p) => {
      const byFilter = filter === "All" || (p.filters ?? []).includes(filter);
      const byTech = !tech || (p.technologies ?? []).some((t) => key(techName(t)) === key(tech));
      const byStatus = statusFilter === "all" || statusTone(p.status) === statusFilter;
      const byQuery =
        !q ||
        norm(
          [p.title, p.tagline, p.shortDescription, p.description, p.category, archSummary(p), ...(p.technologies ?? []).map(techName)]
            .filter(Boolean)
            .join(" ")
        ).includes(q);
      return byFilter && byTech && byStatus && byQuery;
    });
    return sortProjects(list, sort);
  }, [all, filter, tech, statusFilter, query, sort]);

  // Timeline grouping
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((p) => {
      const y = String(p.year ?? "—");
      if (!map.has(y)) map.set(y, []);
      map.get(y).push(p);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const filtersActive = filter !== "All" || !!tech || !!query || statusFilter !== "all";
  const featured = !filtersActive && sort === "featured" && view !== "timeline" && filtered[0]?.featured ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;
  const liveNow = all.filter((p) => getLinks(p).live);

  const toggleTech = (t) => setTech((c) => (key(c) === key(t) ? "" : t));
  const reset = () => {
    setFilter("All");
    setQuery("");
    setTech("");
    setStatusFilter("all");
    setSort("featured");
  };

  const toggleCompare = (project) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(project.slug)) {
        next.delete(project.slug);
      } else {
        if (next.size >= 3) return prev; // cap at 3
        next.add(project.slug);
      }
      return next;
    });
  };

  const compareList = useMemo(
    () => all.filter((p) => compareSet.has(p.slug)),
    [all, compareSet]
  );

  const brief = [
    { icon: FolderKanban, label: "Projects", value: stats.totalProjects },
    { icon: CheckCircle2, label: "Completed", value: stats.completedProjects },
    { icon: Clock, label: "In progress", value: stats.progress },
    { icon: Network, label: "Technologies", value: stats.totalTechnologies },
    { icon: Globe, label: "Live demos", value: stats.liveDemos },
    { icon: Github, label: "Repositories", value: stats.repositories },
  ];

  /* Sidebar sections — mirrors the ProjectDetails.jsx pattern.
     Each entry maps to an in-page anchor so the scroll-spy can highlight it. */
  const sections = useMemo(
    () => [
      { id: "all-projects", label: "All projects", icon: FolderKanban },
      { id: "links", label: "Project links", icon: Plug },
      { id: "status", label: "Project status", icon: Target },
      { id: "how", label: "How to read", icon: Brain },
      { id: "contact", label: "Get in touch", icon: Mail },
    ],
    []
  );

  const activeSection = useScrollSpy(sections.map((s) => s.id));

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />
      {/* ============ HERO ============ */}
      <section className="hidden border-b border-neutral-200 dark:border-white/10 sm:block">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <nav aria-label="Breadcrumb" className={cn("mb-8 flex flex-wrap items-center gap-1.5 text-sm", soft)}>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white">
              <HomeIcon size={14} /> Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Projects</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                  <Sparkles size={12} /> Selected work · Case studies
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                  <Gauge size={12} /> {stats.yearsActive} years of builds
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Selected work &amp; <span className="text-neutral-400 dark:text-neutral-500">engineering projects.</span>
              </h1>
              <p className={cn("mt-5 max-w-xl text-lg leading-8", muted)}>
                Full-stack apps, real-time systems and AI/ML. Each one ships with a live link where available and a full case study — architecture, challenges, metrics, and an honest status.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {techOptions.slice(0, 8).map(({ name }) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                  >
                    <Logo name={name} size="h-5 w-5" round /> {name}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#all-projects"
                  className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200", focus)}
                >
                  Browse projects <ArrowRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
                >
                  <Mail size={16} /> Discuss a project
                </Link>
              </div>

              {/* Quick stats */}
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6 dark:border-white/10 sm:grid-cols-6">
                {brief.map((b) => (
                  <div key={b.label}>
                    <dt className={cn("flex items-center gap-1.5 text-xs", soft)}>
                      <b.icon size={13} /> <span className="hidden sm:inline">{b.label}</span>
                    </dt>
                    <dd className="mt-1.5 text-2xl font-semibold tabular-nums">
                      <Counter value={b.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Brief card */}
            <div className={cn(card, "h-fit p-6 sm:p-7")}>
              <div className="mb-5 flex items-center gap-3">
                <span className={cn("h-10 w-10 rounded-xl", iconBox)}>
                  <FolderKanban size={19} />
                </span>
                <div>
                  <h2 className="font-semibold leading-tight">Portfolio at a glance</h2>
                  <p className={cn("text-xs", soft)}>Numbers from my work</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {brief.map((b) => (
                  <div key={b.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                    <dt className={cn("flex items-center gap-1.5 text-xs", soft)}>
                      <b.icon size={13} /> {b.label}
                    </dt>
                    <dd className="mt-1.5 text-xl font-semibold tabular-nums">
                      <Counter value={b.value} />
                    </dd>
                  </div>
                ))}
              </dl>

              {liveNow.length > 0 && (
                <div className="mt-5 border-t border-neutral-200 pt-5 dark:border-white/10">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Globe size={15} /> Try them live
                  </p>
                  <ul className="space-y-2">
                    {liveNow.slice(0, 4).map((p) => (
                      <li key={p.slug}>
                        <a
                          href={getLinks(p).live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm font-medium transition hover:border-neutral-900 dark:border-white/10 dark:hover:border-white", focus)}
                        >
                          <span className="truncate">{p.title}</span>
                          <ExternalLink size={14} className="shrink-0 text-neutral-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MOBILE INTRO ============ */}
      <section className="border-b border-neutral-200 px-5 pb-5 pt-7 dark:border-white/10 sm:hidden">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Selected work</p>
        <h1 className="text-2xl font-semibold tracking-tight">Projects &amp; Builds</h1>
        <p className="mt-2 max-w-prose text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Full-stack apps, real-time systems and practical tools I have built. Explore the projects and open a case study or live demo.
        </p>
      </section>

      {/* ============ MOBILE SECTION NAV (sticky) ============ */}
      <nav
        aria-label="Sections"
        className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden print:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  activeSection === s.id
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

      {/* ============ PROJECTS + LINKS + STATUS + HOW (with sidebar) ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
            {/* Sidebar (desktop only) */}
            <aside className="hidden lg:block print:hidden">
              <div className="sticky top-24 space-y-5">
                {/* On this page nav */}
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            activeSection === s.id
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

                {/* Portfolio quick stats */}
                <div className={cn(card, "p-4")}>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Sparkles size={14} /> Portfolio
                  </p>
                  <dl className="space-y-2.5">
                    {brief.slice(0, 4).map((b) => (
                      <div key={b.label} className="flex items-center justify-between gap-2 text-xs">
                        <dt className={cn("flex items-center gap-1.5", soft)}>
                          <b.icon size={13} /> {b.label}
                        </dt>
                        <dd className="font-semibold tabular-nums">{b.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Quick links */}
                <div className={cn(card, "p-4")}>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Plug size={14} /> Quick links
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href={GITHUB_PROFILE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <Github size={14} /> GitHub <ExternalLink size={11} />
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <Mail size={14} /> Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <ArrowUpRight size={14} /> About me
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Content column */}
            <div className="min-w-0 space-y-20">
          <Block
            id="all-projects"
            icon={FolderKanban}
            title="All projects"
            subtitle="Search, filter by category, technology or status. Open a case study or compare side by side."
            count={`${filtered.length} / ${all.length}`}
          >
            {/* Toolbar */}
            <div className={cn(card, "mb-5 space-y-3 p-3 sm:mb-8 sm:space-y-4 sm:p-5")}>
              <div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                <div className="relative w-full min-w-0 lg:max-w-md lg:flex-1">
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects, stack, architecture...  ( / )"
                    aria-label="Search projects"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:ml-auto lg:w-auto lg:flex-nowrap">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort projects"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 text-xs outline-none focus:border-neutral-900 sm:flex-none sm:px-3 sm:text-sm dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
                  >
                    <option value="featured">Featured first</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="status">By status</option>
                    <option value="name">A – Z</option>
                  </select>

                  {/* View toggle */}
                  <div className="flex shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-white/10 dark:bg-white/5">
                    {[
                      { id: "grid", icon: LayoutGrid, label: "Grid view" },
                      { id: "list", icon: List, label: "List view" },
                      { id: "timeline", icon: Calendar, label: "Timeline view" },
                    ].map(({ id, icon: Icon, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setView(id)}
                        aria-label={label}
                        aria-pressed={view === id}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition",
                          view === id
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        )}
                      >
                        <Icon size={15} />
                      </button>
                    ))}
                  </div>

                  {/* Compare toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setCompareMode((v) => !v);
                      if (compareMode) setCompareSet(new Set());
                    }}
                    aria-pressed={compareMode}
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border px-2.5 text-xs font-medium transition sm:gap-1.5 sm:px-3 sm:text-sm",
                      compareMode
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300",
                      focus
                    )}
                  >
                    <Boxes size={15} /> Compare
                    {compareSet.size > 0 && (
                      <span className="ml-0.5 rounded-full bg-white/20 px-1.5 text-xs tabular-nums">{compareSet.size}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Compare tray */}
              {compareMode && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-neutral-900 p-3 text-white dark:bg-white dark:text-neutral-900">
                  <span className="text-xs font-semibold uppercase tracking-wide">Comparing:</span>
                  {compareList.length === 0 ? (
                    <span className="text-xs opacity-70">Click “Compare” on any project card to add it here (up to 3).</span>
                  ) : (
                    <>
                      {compareList.map((p) => (
                        <span key={p.slug} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium dark:bg-neutral-900/10">
                          {p.title}
                          <button
                            type="button"
                            onClick={() => toggleCompare(p)}
                            aria-label={`Remove ${p.title} from comparison`}
                            className="rounded-full p-0.5 hover:bg-white/20 dark:hover:bg-neutral-900/10"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => setComparisonOpen(true)}
                        className={cn(
                          "ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700",
                          focus
                        )}
                      >
                        <Grid3x3 size={12} /> View comparison
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Status filter */}
              <div className="hidden flex-wrap items-center gap-2 sm:flex">
                <span className={cn("text-xs", soft)}>Status:</span>
                {statusOptions.map((s) => (
                  <Chip
                    key={s.id}
                    active={statusFilter === s.id}
                    onClick={() => setStatusFilter(s.id)}
                    count={s.count}
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filterOptions.map(([name, count]) => (
                  <Chip key={name} active={filter === name} onClick={() => setFilter(name)} count={count}>
                    {name}
                  </Chip>
                ))}
              </div>

              {techOptions.length > 0 && (
                <div className="hidden flex-wrap items-center gap-2 border-t border-neutral-200 pt-4 dark:border-white/10 sm:flex">
                  <span className={cn("text-xs", soft)}>Technology:</span>
                  {techOptions.map(({ name, count }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleTech(name)}
                      aria-pressed={key(tech) === key(name)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5 text-[11px] font-medium transition",
                        key(tech) === key(name)
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                      )}
                    >
                      <Logo name={name} size="h-5 w-5" round /> {name}
                      <span className="opacity-60">{count}</span>
                    </button>
                  ))}
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={reset}
                      className={cn("ml-auto inline-flex items-center gap-1 text-xs hover:text-neutral-900 dark:hover:text-white", soft)}
                    >
                      <X size={12} /> Reset filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* List */}
            <div className="space-y-6">
              {featured && (
                <FeaturedCard
                  project={featured}
                  activeTech={tech}
                  onTech={toggleTech}
                 
                  compareMode={compareMode}
                  compareSet={compareSet}
                  toggleCompare={toggleCompare}
                />
              )}

              {view !== "timeline" && rest.length > 0 && (
                <div className={cn("grid gap-5", view === "grid" ? "md:grid-cols-2" : "grid-cols-1")}>
                  {rest.map((p) => (
                    <ProjectCard
                      key={p.id ?? p.slug}
                      project={p}
                      view={view}
                      activeTech={tech}
                      onTech={toggleTech}
                     
                      compareMode={compareMode}
                      compareSet={compareSet}
                      toggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              )}

              {view === "timeline" && grouped.length > 0 && (
                <div className="space-y-10">
                  {grouped.map(([year, items]) => (
                    <div key={year}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className={cn("inline-flex h-8 items-center gap-1.5 rounded-full bg-neutral-900 px-3 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900")}>
                          <Calendar size={12} /> {year}
                        </span>
                        <span className={cn("text-xs", soft)}>{items.length} {items.length === 1 ? "project" : "projects"}</span>
                        <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        {items.map((p) => (
                          <TimelineCard
                            key={p.id ?? p.slug}
                            project={p}
                           
                            activeTech={tech}
                            onTech={toggleTech}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filtered.length === 0 && (
                <div className={cn(card, "border-dashed px-6 py-16 text-center")}>
                  <Search size={24} className="mx-auto mb-3 text-neutral-400" />
                  <p className="font-semibold">No projects match your filters</p>
                  <p className={cn("mt-1 text-sm", soft)}>Try another keyword, category, technology or status.</p>
                  <button
                    type="button"
                    onClick={reset}
                    className={cn("mt-5 inline-flex min-h-11 items-center gap-1 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
                  >
                    <X size={13} /> Reset filters
                  </button>
                </div>
              )}
            </div>
          </Block>

          {/* ============ LINKS OVERVIEW + STATUS + HOW TO READ ============ */}
          <Block id="links" icon={Plug} title="Project links" subtitle="Live demo, repository and API for every project in one place." count={all.length}>
            <ul className={cn(card, "divide-y divide-neutral-200 dark:divide-white/10")}>
              {all.map((p) => {
                const l = getLinks(p);
                const items = [
                  { key: "live", label: "Live demo", icon: ExternalLink, url: l.live },
                  { key: "github", label: "GitHub", icon: Github, url: l.github },
                  { key: "backend", label: "API", icon: Server, url: l.backend },
                  { key: "docs", label: "Docs", icon: Plug, url: l.docs },
                ].filter((i) => i.url);
                return (
                  <li key={p.slug} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <ul className="flex shrink-0 -space-x-2">
                        {(p.technologies ?? []).slice(0, 3).map((t) => (
                          <li key={techName(t)}>
                            <Logo name={techName(t)} size="h-8 w-8" round />
                          </li>
                        ))}
                      </ul>
                      <div className="min-w-0">
                        <Link to={`/projects/${p.slug}`} className="block truncate font-semibold underline-offset-4 hover:underline">
                          {p.title}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-2">
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {items.map((i) => (
                        <a
                          key={i.key}
                          href={i.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5", focus)}
                        >
                          <i.icon size={13} /> {i.label}
                        </a>
                      ))}
                      {!l.live && <span className={cn("text-xs", soft)}>Live link not added yet</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Block>

          <Block id="status" icon={Target} title="Where each project stands" subtitle="What is shipped, in progress or experimental.">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { tone: "done", icon: CheckCircle2, label: "Completed" },
                { tone: "progress", icon: Clock, label: "In progress" },
                { tone: "prototype", icon: AlertCircle, label: "Prototype" },
              ].map(({ tone, icon: Icon, label }) => {
                const items = all.filter((p) => statusTone(p.status) === tone);
                return (
                  <article key={label} className={cn(card, "p-5 sm:p-6")}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={cn("h-10 w-10 rounded-xl", iconBox)}>
                          <Icon size={18} />
                        </span>
                        <h3 className="font-semibold">{label}</h3>
                      </div>
                      <p className="text-2xl font-semibold tabular-nums">
                        <Counter value={items.length} />
                      </p>
                    </div>
                    {items.length > 0 ? (
                      <ul className="space-y-1.5">
                        {items.map((p) => (
                          <li key={p.slug}>
                            <Link
                              to={`/projects/${p.slug}`}
                              className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-white/5"
                            >
                              <span className="truncate">{p.title}</span>
                              <ArrowRight size={13} className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn("text-xs", soft)}>No projects in this state.</p>
                    )}
                  </article>
                );
              })}
            </div>
          </Block>

          <Block id="how" icon={Brain} title="How to read this page" subtitle="Case studies over screenshots alone.">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Layers, title: "Architecture first", text: "Each write-up covers problem, goals, components and limits, not only a demo link." },
                { icon: CheckCircle2, title: "Honest status", text: "Completed, In Progress and Prototype are labelled clearly. Prototypes are never sold as finished products." },
                { icon: Network, title: "Real constraints", text: "Networking and real-time work documents failure modes and environment limits." },
                { icon: Code2, title: "Code over claims", text: "Case studies link to the repository and live demo when available, with no inflated metrics." },
                { icon: Target, title: "Goals & metrics", text: "Where possible, projects list measurable goals and how success was evaluated." },
                { icon: Rocket, title: "Learning outcomes", text: "Every project documents what was learned, the way a real build would be reviewed." },
                { icon: Zap, title: "Clear project details", text: "Open a case study for architecture, implementation details, challenges and outcomes." },
                { icon: Boxes, title: "Side-by-side compare", text: "Toggle Compare mode and select up to 3 projects to compare attributes in one table." },
                { icon: Calendar, title: "Timeline view", text: "Switch to the timeline view to browse projects chronologically by year." },
              ].map((i) => (
                <li key={i.title} className={cn(card, "flex items-start gap-3.5 p-5", hoverCard)}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10">
                    <i.icon size={17} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{i.title}</h3>
                    <p className={cn("mt-1 text-sm leading-7", muted)}>{i.text}</p>
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
      <section id="contact" className="mx-auto hidden max-w-7xl scroll-mt-24 px-5 py-16 sm:block sm:px-8 sm:py-20 lg:px-12">
        <div className="rounded-[2rem] bg-neutral-900 px-7 py-12 text-white dark:bg-white dark:text-neutral-900 sm:px-12 sm:py-14">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Have an idea worth building?</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 opacity-70">
            I&apos;m open to freelance projects, internships and collaborations involving web development, full-stack applications, AI/ML and real-time systems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700"
            >
              <Mail size={16} /> Get in touch
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
              About me <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MODALS ============ */}
      {comparisonOpen && (
        <ComparisonModal projects={compareList} onClose={() => setComparisonOpen(false)} />
      )}
    </main>
  );
}