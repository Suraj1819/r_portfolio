import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Binary,
  Boxes,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileCode,
  Film,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  Home,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Link2,
  Mail,
  Maximize2,
  Monitor,
  Network,
  Play,
  Plug,
  Printer,
  Quote,
  Rocket,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  User,
  Users,
  Workflow,
  Wrench,
  X as XIcon,
} from "lucide-react";
import { projects, getProjectBySlug, getAdjacentProjects } from "../data/projects";

/* ------------------------------------------------------------------ */
/* Tech logos (official brand colours, same as the home page)          */
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
  "c++": ["cplusplus", "00599C"],
  html: ["html5", "E34F26"], html5: ["html5", "E34F26"],
  css: ["css3", "1572B6"], css3: ["css3", "1572B6"],
  nextjs: ["nextdotjs", "000000"],
  firebase: ["firebase", "FFCA28"],
  mysql: ["mysql", "4479A1"],
  redis: ["redis", "DC382D"],
  docker: ["docker", "2496ED"],
  python: ["python", "3776AB"],
  figma: ["figma", "F24E1E"],
  npm: ["npm", "CB3837"],
  jwt: ["jsonwebtokens", "000000"],
  nginx: ["nginx", "009639"],
  redux: ["redux", "764ABC"],
  axios: ["axios", "5A29E4"],
  cloudinary: ["cloudinary", "3448C5"],
  stripe: ["stripe", "635BFF"],
};

const FALLBACK_ICONS = {
  sql: Database, dbms: Database, restapis: Globe, restapi: Globe, api: Globe,
  websockets: Plug, websocket: Plug, stun: Network, turn: Network, networks: Network,
  dsa: Binary, oop: Boxes,
};

const norm = (n) => String(n ?? "").toLowerCase().replace(/[\s._-]/g, "");
const techName = (t) => (typeof t === "string" ? t : t?.name ?? t?.label ?? t?.title ?? "");

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */
const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox = "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";
const hoverCard = "transition hover:border-neutral-900 dark:hover:border-white";

/* ------------------------------------------------------------------ */
/* Logo pieces                                                         */
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
/* Small shared components                                             */
/* ------------------------------------------------------------------ */
function Block({ id, icon: Icon, title, count, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className={`h-11 w-11 rounded-xl ${iconBox}`}>
            <Icon size={20} />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        </div>
        {count != null && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {count}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function Btn({ href, to, onClick, variant = "primary", children }) {
  const base = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition ${focus}`;
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : "border border-neutral-300 hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5";
  const cls = `${base} ${styles}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

function statusIcon(status) {
  const s = String(status ?? "").toLowerCase();
  if (/(complete|done|live|deployed)/.test(s)) return CheckCircle2;
  if (/(progress|ongoing|building|wip)/.test(s)) return Clock;
  return Sparkles;
}

function StatusBadge({ status }) {
  if (!status) return null;
  const Icon = statusIcon(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
      <Icon size={12} /> {status}
    </span>
  );
}

function normalizeImages(list) {
  return (Array.isArray(list) ? list : [])
    .map((s) => (typeof s === "string" ? { src: s, caption: null } : { src: s?.src ?? s?.url, caption: s?.caption ?? s?.title ?? null }))
    .filter((s) => s.src);
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
        if (el && el.offsetTop <= pos) { setActive(ids[i]); return; }
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
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 print:hidden ${focus}`}
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox (full photo, never cropped)                                */
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
  const btn = "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white">
          {index + 1} / {total}
        </span>
        <div className="flex gap-2">
          <a href={cur.src} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Open original image">
            <ExternalLink size={18} />
          </a>
          <button type="button" onClick={onClose} className={btn} aria-label="Close"><XIcon size={20} /></button>
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
          <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); go(index - 1); }} className={`${btn} absolute left-3 z-10 sm:left-6`}>
            <ArrowLeft size={20} />
          </button>
        )}
        <img
          src={cur.src}
          alt={cur.caption || "Project screenshot"}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        />
        {total > 1 && (
          <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); go(index + 1); }} className={`${btn} absolute right-3 z-10 sm:right-6`}>
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        {cur.caption && <p className="mb-3 text-center text-sm text-white/80">{cur.caption}</p>}
        {total > 1 && (
          <ul className="mx-auto flex max-w-full justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
            {images.map((im, i) => (
              <li key={`${im.src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNav(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-14 w-20 overflow-hidden rounded-lg border-2 ${i === index ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={im.src} alt="" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview showcase (full image visible + thumbnails)                  */
/* ------------------------------------------------------------------ */
function PreviewShowcase({ slides, title, tagline }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (paused || open || total <= 1) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [paused, open, total]);

  if (total === 0) {
    return (
      <div className="flex aspect-[16/8] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 text-center dark:border-white/20 dark:bg-white/[0.03]">
        <span className={`mb-4 h-14 w-14 rounded-2xl ${iconBox}`}><Layers size={26} /></span>
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</p>
        {tagline && <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">{tagline}</p>}
      </div>
    );
  }

  const cur = slides[index];
  const arrow = "flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/10";

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open image full screen"
        className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 sm:aspect-[16/10] lg:aspect-[16/9] dark:border-white/10 dark:bg-white/5 ${focus}`}
      >
        {slides.map((s, i) => (
          <div key={`${s.src}-${i}`} className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <img src={s.src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl" />
            <img
              src={s.src}
              alt={s.caption || `${title} preview ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="relative h-full w-full object-contain p-2 sm:p-5"
            />
          </div>
        ))}
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100 print:hidden">
          <Maximize2 size={17} />
        </span>
      </button>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{cur.caption || `${title} preview`}</p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {index + 1} of {total}
          </p>
        </div>
        {total > 1 && (
          <div className="flex gap-2 print:hidden">
            <button type="button" className={arrow} aria-label="Previous image" onClick={() => setIndex((index - 1 + total) % total)}><ArrowLeft size={17} /></button>
            <button type="button" className={arrow} aria-label="Next image" onClick={() => setIndex((index + 1) % total)}><ArrowRight size={17} /></button>
          </div>
        )}
      </div>

      {total > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 print:hidden">
          {slides.map((s, i) => (
            <li key={`${s.src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`h-16 w-28 overflow-hidden rounded-xl border-2 bg-neutral-100 dark:bg-white/5 ${
                  i === index ? "border-neutral-900 dark:border-white" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && <Lightbox images={slides} index={index} onClose={() => setOpen(false)} onNav={setIndex} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery (masonry: every photo keeps its real shape)                 */
/* ------------------------------------------------------------------ */
function Gallery({ images }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((im, i) => (
          <button
            key={`${im.src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={im.caption ? `View: ${im.caption}` : `View image ${i + 1}`}
            className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:border-white ${focus}`}
          >
            <img src={im.src} alt={im.caption || `Screenshot ${i + 1}`} loading="lazy" className="block h-auto w-full" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              <span>{im.caption}</span>
              <Maximize2 size={15} className="shrink-0" />
            </span>
          </button>
        ))}
      </div>
      {open !== null && <Lightbox images={images} index={open} onClose={() => setOpen(null)} onNav={setOpen} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Video                                                               */
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
  const poster = typeof video === "object" ? video?.poster : null;
  const embed = getEmbed(url);

  return (
    <div className={`${card} overflow-hidden`}>
      <div className="relative aspect-video w-full bg-neutral-100 dark:bg-white/5">
        {embed?.type === "youtube" && (
          <iframe src={`https://www.youtube.com/embed/${embed.id}`} title={title || "Project video demo"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" className="absolute inset-0 h-full w-full" />
        )}
        {embed?.type === "vimeo" && (
          <iframe src={`https://player.vimeo.com/video/${embed.id}`} title={title || "Project video demo"} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" className="absolute inset-0 h-full w-full" />
        )}
        {!embed && url && (
          <video src={url} poster={poster} controls className="absolute inset-0 h-full w-full bg-black">
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
          {description && <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{description}</p>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Link cards + small cards                                            */
/* ------------------------------------------------------------------ */
const LINK_META = [
  { key: "github", icon: Github, label: "Source code", title: "GitHub repository", text: "Code, commits and issues." },
  { key: "live", icon: Globe, label: "Production", title: "Live demo", text: "Try the deployed app." },
  { key: "docs", icon: FileCode, label: "Reference", title: "Documentation", text: "Guides and API notes." },
  { key: "design", icon: Layers, label: "Design", title: "Design files", text: "Wireframes and mockups." },
  { key: "blog", icon: Code2, label: "Write-up", title: "Case study blog", text: "Decisions and lessons." },
];

const COMPONENT_ICONS = [Server, Database, Network, Code2, Cpu, Globe, ShieldCheck, Terminal];

function MiniProject({ p }) {
  const techs = p.technologies ?? p.techStack ?? [];
  return (
    <Link to={`/projects/${p.slug}`} className={`group flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04] ${hoverCard} ${focus}`}>
      <div>
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={p.status} />
          <ArrowUpRight size={18} className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white" />
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
        {p.category && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{p.category}</p>}
      </div>
      <ul className="mt-5 flex gap-1.5">
        {techs.map(techName).filter(Boolean).slice(0, 5).map((n) => (
          <li key={n} title={n}><Logo name={n} size="h-8 w-8" /></li>
        ))}
      </ul>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);
  const [copied, setCopied] = useState(false);

  const techCategories = project?.techCategories ?? null;
  const flatTech = useMemo(() => {
    if (!project) return [];
    const base = project.technologies ?? (techCategories ? techCategories.flatMap((c) => c.items ?? []) : []);
    return base.map(techName).filter(Boolean);
  }, [project, techCategories]);

  const slides = useMemo(
    () => normalizeImages(project?.preview?.length ? project.preview : project?.gallery),
    [project]
  );
  const gallery = useMemo(() => normalizeImages(project?.gallery), [project]);

  const sections = useMemo(() => {
    if (!project) return [];
    const hasLink = LINK_META.some((l) => project.links?.[l.key]);
    return [
      { id: "overview", label: "Overview", icon: Lightbulb, show: true },
      { id: "problem", label: "Problem", icon: AlertCircle, show: !!project.problem },
      { id: "goals", label: "Goals", icon: Target, show: project.goals?.length > 0 },
      { id: "architecture", label: "Architecture", icon: Layers, show: !!project.architecture },
      { id: "features", label: "Features", icon: CheckCircle2, show: project.features?.length > 0 },
      { id: "gallery", label: "Gallery", icon: ImageIcon, show: gallery.length > 0 },
      { id: "video", label: "Video demo", icon: Play, show: !!project.video },
      { id: "tech", label: "Tech stack", icon: Wrench, show: flatTech.length > 0 },
      { id: "challenges", label: "Challenges", icon: AlertTriangle, show: project.challenges?.length > 0 },
      { id: "learnings", label: "Learnings", icon: GraduationCap, show: project.learnings?.length > 0 },
      { id: "limitations", label: "Limitations", icon: AlertCircle, show: project.limitations?.length > 0 },
      { id: "future", label: "Roadmap", icon: Rocket, show: project.future?.length > 0 },
      { id: "links", label: "Links", icon: Link2, show: hasLink },
    ].filter((s) => s.show);
  }, [project, gallery.length, flatTech.length]);

  const active = useScrollSpy(sections.map((s) => s.id));

  useEffect(() => {
    if (project) document.title = `${project.title} — Suraj Kumar`;
  }, [project]);

  if (!project) return <Navigate to="/projects" replace />;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: project.title, text: project.tagline, url: window.location.href }); } catch { /* cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const brief = [
    { icon: Calendar, label: "Year", value: project.year },
    { icon: Clock, label: "Duration", value: project.duration },
    { icon: User, label: "Role", value: project.role },
    { icon: Users, label: "Team", value: project.team },
    { icon: Layers, label: "Category", value: project.category },
    { icon: CheckCircle2, label: "Status", value: project.status },
  ].filter((b) => b.value);

  const counts = [
    { icon: CheckCircle2, value: project.features?.length, label: "Features" },
    { icon: Wrench, value: flatTech.length, label: "Technologies" },
    { icon: Target, value: project.goals?.length, label: "Goals" },
    { icon: AlertTriangle, value: project.challenges?.length, label: "Challenges" },
  ].filter((c) => c.value > 0);

  const flowSteps = project.architecture?.dataFlow
    ? String(project.architecture.dataFlow).split(/\s*(?:→|->|=>)\s*/).filter(Boolean)
    : [];
  const others = (Array.isArray(projects) ? projects : []).filter((p) => p?.slug && p.slug !== slug).slice(0, 3);
  const actionLinks = LINK_META.filter((l) => project.links?.[l.key]);

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* ============ HERO ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 print:hidden">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"><Home size={14} /> Home</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link to="/projects" className="hover:text-neutral-900 dark:hover:text-white">Projects</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="max-w-[12rem] truncate text-neutral-900 dark:text-white sm:max-w-none">{project.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {project.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                    <Layers size={12} /> {project.category}
                  </span>
                )}
                <StatusBadge status={project.status} />
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
              {project.tagline && <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">{project.tagline}</p>}

              {flatTech.length > 0 && (
                <div className="mt-7">
                  <TechList items={flatTech} limit={8} />
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                {project.links?.live && <Btn href={project.links.live}><ExternalLink size={16} /> Live demo</Btn>}
                {project.links?.github && <Btn href={project.links.github} variant="secondary"><Github size={16} /> Repository</Btn>}
                <Btn onClick={handleShare} variant="secondary">
                  {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? "Link copied" : "Share"}
                </Btn>
                <Btn onClick={() => window.print()} variant="secondary"><Printer size={16} /> Print</Btn>
              </div>
            </div>

            {/* Brief */}
            <div className={`${card} h-fit p-6 sm:p-7`}>
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-10 w-10 rounded-xl ${iconBox}`}><FileCode size={19} /></span>
                <h2 className="font-semibold">Project brief</h2>
              </div>
              {brief.length > 0 && (
                <dl className="grid grid-cols-2 gap-3">
                  {brief.map((b) => (
                    <div key={b.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                      <dt className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <b.icon size={13} /> {b.label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-semibold">{b.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PREVIEW ============ */}
      <section className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <PreviewShowcase slides={slides} title={project.title} tagline={project.tagline} />
        </div>
      </section>

      {/* ============ METRICS ============ */}
      {project.metrics?.length > 0 && (
        <section className="border-b border-neutral-200 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {project.metrics.map((m) => (
                <div key={m.label} className={`${card} p-5 sm:p-6`}>
                  <dd className="text-3xl font-semibold tracking-tight">{m.value}</dd>
                  <dt className="mt-2 text-sm font-medium">{m.label}</dt>
                  {m.description && <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{m.description}</p>}
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Mobile section nav */}
      <nav aria-label="Sections" className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden print:hidden">
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                  active === s.id
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
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
            <aside className="hidden lg:block print:hidden">
              <div className="sticky top-24 space-y-5">
                <nav aria-label="On this page" className={`${card} p-3`}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active === s.id
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                          }`}
                        >
                          <s.icon size={14} /> {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {actionLinks.length > 0 && (
                  <div className={`${card} p-4`}>
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles size={14} /> Quick links</p>
                    <ul className="space-y-2 text-sm">
                      {actionLinks.slice(0, 3).map((l) => (
                        <li key={l.key}>
                          <a href={project.links[l.key]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                            <l.icon size={14} /> {l.title} <ExternalLink size={11} />
                          </a>
                        </li>
                      ))}
                      <li>
                        <Link to="/projects" className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
                          <ArrowLeft size={14} /> All projects
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Article */}
            <div className="min-w-0 max-w-3xl space-y-20">
              {/* OVERVIEW */}
              <Block id="overview" icon={Lightbulb} title="Overview">
                <p className="text-base leading-8 text-neutral-600 dark:text-neutral-400">{project.description}</p>
                {counts.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {counts.map((c) => (
                      <div key={c.label} className={`${card} p-4`}>
                        <c.icon size={18} className="text-neutral-500 dark:text-neutral-400" />
                        <dd className="mt-3 text-2xl font-semibold leading-none">{c.value}</dd>
                        <dt className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{c.label}</dt>
                      </div>
                    ))}
                  </dl>
                )}
              </Block>

              {/* PROBLEM */}
              {project.problem && (
                <Block id="problem" icon={AlertCircle} title="Problem">
                  <div className={`${card} border-l-4 !border-l-neutral-900 p-6 dark:!border-l-white sm:p-8`}>
                    <p className="leading-8 text-neutral-600 dark:text-neutral-400">{project.problem}</p>
                  </div>
                </Block>
              )}

              {/* GOALS */}
              {project.goals?.length > 0 && (
                <Block id="goals" icon={Target} title="Goals" count={project.goals.length}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.goals.map((g, i) => (
                      <li key={i} className={`${card} flex items-start gap-3.5 p-5`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10">
                          <Target size={15} />
                        </span>
                        <p className="pt-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{typeof g === "string" ? g : g?.text ?? g?.title}</p>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* ARCHITECTURE */}
              {project.architecture && (
                <Block id="architecture" icon={Layers} title="Architecture">
                  <div className="space-y-4">
                    {project.architecture.summary && (
                      <div className={`${card} p-6 sm:p-7`}>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Workflow size={16} /> Summary</p>
                        <p className="leading-8 text-neutral-600 dark:text-neutral-400">{project.architecture.summary}</p>
                      </div>
                    )}

                    {project.architecture.components?.length > 0 && (
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {project.architecture.components.map((c, i) => {
                          const Ic = COMPONENT_ICONS[i % COMPONENT_ICONS.length];
                          const label = typeof c === "string" ? c : c?.name ?? c?.title ?? `Component ${i + 1}`;
                          const desc = typeof c === "object" ? c?.description : null;
                          return (
                            <li key={label} className={`${card} p-5`}>
                              <div className="flex items-center gap-3">
                                <span className={`h-10 w-10 rounded-xl ${iconBox}`}><Ic size={18} /></span>
                                <p className="font-semibold">{label}</p>
                              </div>
                              {desc && <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{desc}</p>}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {project.architecture.dataFlow && (
                      <div className={`${card} p-6 sm:p-7`}>
                        <p className="mb-4 flex items-center gap-2 text-sm font-semibold"><GitBranch size={16} /> Data flow</p>
                        {flowSteps.length >= 3 ? (
                          <ol className="flex flex-wrap items-center gap-2">
                            {flowSteps.map((step, i) => (
                              <Fragment key={`${step}-${i}`}>
                                <li className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm font-medium dark:border-white/10 dark:bg-white/5">{step}</li>
                                {i < flowSteps.length - 1 && <ArrowRight size={16} className="text-neutral-400" aria-hidden="true" />}
                              </Fragment>
                            ))}
                          </ol>
                        ) : (
                          <p className="leading-7 text-neutral-600 dark:text-neutral-400">{project.architecture.dataFlow}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Block>
              )}

              {/* FEATURES */}
              {project.features?.length > 0 && (
                <Block id="features" icon={CheckCircle2} title="Features" count={project.features.length}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((f, i) => {
                      const name = typeof f === "string" ? f : f?.name ?? `Feature ${i + 1}`;
                      const desc = typeof f === "object" ? f?.description : null;
                      const status = typeof f === "object" ? f?.status : null;
                      return (
                        <li key={name} className={`${card} flex h-full flex-col p-5 sm:p-6`}>
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10"><CheckCircle2 size={17} /></span>
                            <StatusBadge status={status} />
                          </div>
                          <h3 className="font-semibold">{name}</h3>
                          {desc && <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{desc}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* GALLERY */}
              {gallery.length > 0 && (
                <Block id="gallery" icon={ImageIcon} title="Gallery" count={gallery.length}>
                  <Gallery images={gallery} />
                </Block>
              )}

              {/* VIDEO */}
              {project.video && (
                <Block id="video" icon={Play} title="Video demo">
                  <VideoEmbed video={project.video} />
                </Block>
              )}

              {/* TECH */}
              {flatTech.length > 0 && (
                <Block id="tech" icon={Wrench} title="Tech stack" count={flatTech.length}>
                  {techCategories ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {techCategories.map((cat, i) => {
                        const icons = [Monitor, Server, Database, Network, Cpu, Wrench, Cloud, ShieldCheck];
                        const CatIcon = icons[i % icons.length];
                        return (
                          <div key={cat.category} className={`${card} p-5 sm:p-6`}>
                            <div className="mb-5 flex items-center gap-3">
                              <span className={`h-10 w-10 rounded-xl ${iconBox}`}><CatIcon size={19} /></span>
                              <div className="min-w-0">
                                <h3 className="font-semibold">{cat.category}</h3>
                                {cat.description && <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{cat.description}</p>}
                              </div>
                            </div>
                            <TechGrid items={cat.items} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`${card} p-5 sm:p-6`}>
                      <TechGrid items={flatTech} />
                    </div>
                  )}
                </Block>
              )}

              {/* CHALLENGES */}
              {project.challenges?.length > 0 && (
                <Block id="challenges" icon={AlertTriangle} title="Challenges" count={project.challenges.length}>
                  <ul className="space-y-3">
                    {project.challenges.map((c, i) => {
                      const title = typeof c === "object" ? c?.title : null;
                      const problem = typeof c === "string" ? c : c?.description ?? c?.problem;
                      const solution = typeof c === "object" ? c?.solution : null;
                      return (
                        <li key={i} className={`${card} p-5 sm:p-6`}>
                          <div className="flex items-start gap-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10"><AlertTriangle size={16} /></span>
                            <div className="min-w-0">
                              {title && <h3 className="font-semibold">{title}</h3>}
                              {problem && <p className={`text-sm leading-7 text-neutral-600 dark:text-neutral-400 ${title ? "mt-1.5" : "pt-1.5"}`}>{problem}</p>}
                              {solution && problem && (
                                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                                  <CheckCircle2 size={15} className="mt-1 shrink-0" />
                                  <p className="text-sm leading-7 text-neutral-700 dark:text-neutral-300">{solution}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* LEARNINGS */}
              {project.learnings?.length > 0 && (
                <Block id="learnings" icon={GraduationCap} title="Learnings" count={project.learnings.length}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.learnings.map((l, i) => (
                      <li key={i} className={`${card} flex items-start gap-3.5 p-5`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10"><Lightbulb size={15} /></span>
                        <p className="pt-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{typeof l === "string" ? l : l?.text ?? l?.title}</p>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* LIMITATIONS */}
              {project.limitations?.length > 0 && (
                <Block id="limitations" icon={AlertCircle} title="Limitations" count={project.limitations.length}>
                  <ul className="space-y-3">
                    {project.limitations.map((l, i) => (
                      <li key={i} className="flex items-start gap-3.5 rounded-2xl border border-dashed border-neutral-300 p-5 dark:border-white/20">
                        <AlertCircle size={17} className="mt-1 shrink-0 text-neutral-500" />
                        <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">{typeof l === "string" ? l : l?.text ?? l?.title}</p>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* ROADMAP */}
              {project.future?.length > 0 && (
                <Block id="future" icon={Rocket} title="Roadmap" count={project.future.length}>
                  <ol>
                    {project.future.map((f, i) => {
                      const title = typeof f === "object" ? f?.title : null;
                      const desc = typeof f === "string" ? f : f?.description;
                      return (
                        <li key={i} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-6 last:pb-0">
                          {i < project.future.length - 1 && (
                            <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20" />
                          )}
                          <span className={`relative z-10 h-10 w-10 rounded-full text-sm font-semibold ${iconBox}`}>{i + 1}</span>
                          <div className={`${card} p-5`}>
                            {title && <h3 className="font-semibold">{title}</h3>}
                            {desc && <p className={`text-sm leading-7 text-neutral-600 dark:text-neutral-400 ${title ? "mt-1.5" : ""}`}>{desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Block>
              )}

              {/* LINKS */}
              {actionLinks.length > 0 && (
                <Block id="links" icon={Link2} title="Links">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {actionLinks.map((l) => (
                      <a
                        key={l.key}
                        href={project.links[l.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group ${card} flex items-center gap-4 p-5 ${hoverCard} ${focus}`}
                      >
                        <span className={`h-12 w-12 rounded-xl ${iconBox}`}><l.icon size={21} /></span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{l.label}</p>
                          <p className="font-semibold">{l.title}</p>
                          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{String(project.links[l.key]).replace(/^https?:\/\//, "")}</p>
                        </div>
                        <ArrowUpRight size={18} className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white" />
                      </a>
                    ))}
                  </div>
                </Block>
              )}

              {/* TESTIMONIAL */}
              {project.testimonial && (
                <figure className={`${card} p-6 sm:p-9`}>
                  <Quote size={30} className="mb-4 text-neutral-300 dark:text-neutral-600" />
                  <blockquote className="text-lg leading-8">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-5 dark:border-white/10">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/10"><User size={18} /></span>
                    <span>
                      <span className="block text-sm font-semibold">{project.testimonial.author}</span>
                      {project.testimonial.role && <span className="block text-xs text-neutral-500 dark:text-neutral-400">{project.testimonial.role}</span>}
                    </span>
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PREV / NEXT + MORE ============ */}
      <section className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02] print:hidden">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          {(prev || next) && (
            <div className="mb-12 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link to={`/projects/${prev.slug}`} className={`group flex items-center gap-4 rounded-2xl border border-neutral-200 p-5 dark:border-white/10 ${hoverCard} ${focus}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15"><ArrowLeft size={18} /></span>
                  <span className="min-w-0">
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">Previous</span>
                    <span className="block truncate font-semibold">{prev.title}</span>
                  </span>
                </Link>
              ) : <span />}
              {next && (
                <Link to={`/projects/${next.slug}`} className={`group flex items-center justify-end gap-4 rounded-2xl border border-neutral-200 p-5 text-right dark:border-white/10 ${hoverCard} ${focus}`}>
                  <span className="min-w-0">
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">Next</span>
                    <span className="block truncate font-semibold">{next.title}</span>
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15"><ArrowRight size={18} /></span>
                </Link>
              )}
            </div>
          )}

          {others.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span className={`h-11 w-11 rounded-xl ${iconBox}`}><Code2 size={20} /></span>
                  More projects
                </h2>
                <Link to="/projects" className={`inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${focus}`}>
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {others.map((p) => <MiniProject key={p.slug} p={p} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 print:hidden">
        <div className="rounded-[2rem] bg-neutral-900 px-7 py-12 text-white dark:bg-white dark:text-neutral-900 sm:px-12 sm:py-14">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Interested in this project?</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700">
              <Mail size={16} /> Get in touch
            </Link>
            <a href="https://github.com/Suraj1819" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Github size={16} /> GitHub
            </a>
            <Link to="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Code2 size={16} /> All projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}