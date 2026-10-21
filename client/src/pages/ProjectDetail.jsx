import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileCode,
  Film,
  FlaskConical,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Link2,
  ListChecks,
  Mail,
  Maximize2,
  Monitor,
  Network,
  Package,
  Play,
  Plug,
  Printer,
  Quote,
  Rocket,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Terminal,
  TrendingUp,
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
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */
const GITHUB_PROFILE = "https://github.com/Suraj1819";

const isFilled = (v) =>
  v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);

const pick = (obj, ...keys) => {
  for (const k of keys) if (isFilled(obj?.[k])) return obj[k];
  return undefined;
};

const fmt = (v) => (Array.isArray(v) ? v.map(techName).filter(Boolean).join(", ") : v == null ? "" : String(v));

const textOf = (item) =>
  typeof item === "string" ? item : item?.text ?? item?.title ?? item?.name ?? item?.description ?? "";

const asList = (v) => (Array.isArray(v) ? v : typeof v === "string" && v.trim() ? [v] : []);

function toUrl(v) {
  const raw = typeof v === "string" ? v : v?.url ?? v?.href ?? "";
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return /^(https?:|mailto:|tel:)/i.test(s) ? s : `https://${s}`;
}

const LINK_META = [
  { key: "live", aliases: ["live", "demo", "website", "site", "url", "deployed", "liveUrl", "demoUrl"], icon: Globe, label: "Production", title: "Live demo", text: "Try the deployed app." },
  { key: "github", aliases: ["github", "repo", "repository", "source", "code", "sourceCode", "githubUrl", "repoUrl"], icon: Github, label: "Source code", title: "GitHub repository", text: "Code, commits and issues." },
  { key: "frontend", aliases: ["frontend", "client", "frontendRepo", "frontendUrl"], icon: Monitor, label: "Source code", title: "Frontend repository", text: "UI and client-side code." },
  { key: "backend", aliases: ["backend", "server", "backendRepo", "backendUrl"], icon: Server, label: "Source code", title: "Backend repository", text: "API and server-side code." },
  { key: "docs", aliases: ["docs", "documentation", "readme"], icon: FileCode, label: "Reference", title: "Documentation", text: "Guides and API notes." },
  { key: "design", aliases: ["design", "figma", "designFiles"], icon: Layers, label: "Design", title: "Design files", text: "Wireframes and mockups." },
  { key: "blog", aliases: ["blog", "caseStudy", "article", "writeup"], icon: Code2, label: "Write-up", title: "Case study blog", text: "Decisions and lessons." },
  { key: "download", aliases: ["download", "apk", "release", "releases"], icon: Download, label: "Download", title: "Download / releases", text: "Get a build to run." },
  { key: "package", aliases: ["npm", "package"], icon: Package, label: "Package", title: "Package page", text: "Install it from the registry." },
];

function resolveLinks(project) {
  if (!project) return [];
  const raw = project.links;
  const out = [];
  const used = new Set();

  const addMeta = (meta, url) => {
    if (!url || used.has(meta.key)) return;
    used.add(meta.key);
    out.push({ ...meta, url });
  };

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const url = toUrl(item);
      if (!url) return;
      const hint = norm(item?.type ?? item?.key ?? item?.label ?? item?.title);
      const meta = LINK_META.find((m) => m.key === hint || m.aliases.some((a) => norm(a) === hint));
      if (meta && !used.has(meta.key)) addMeta(meta, url);
      else out.push({ key: `extra-${out.length}`, icon: Link2, label: "Link", title: item?.label ?? item?.title ?? "Related link", text: item?.description ?? "Open in a new tab.", url });
    });
  }

  LINK_META.forEach((meta) => {
    if (used.has(meta.key)) return;
    for (const a of meta.aliases) {
      const v = (raw && !Array.isArray(raw) ? raw[a] : undefined) ?? project[a];
      const url = toUrl(v);
      if (url) { addMeta(meta, url); break; }
    }
  });

  const extras = asList(project.extraLinks ?? (raw && !Array.isArray(raw) ? raw.extra : null));
  extras.forEach((e, i) => {
    const url = toUrl(e);
    if (url) out.push({ key: `more-${i}`, icon: Link2, label: "Link", title: e?.label ?? e?.title ?? "Related link", text: e?.description ?? "Open in a new tab.", url });
  });

  return out;
}

function normalizeImages(...lists) {
  const seen = new Set();
  const out = [];
  lists.forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((s) => {
      const src = typeof s === "string" ? s : s?.src ?? s?.url ?? s?.image;
      if (!src || seen.has(src)) return;
      seen.add(src);
      out.push({ src, caption: typeof s === "string" ? null : s?.caption ?? s?.title ?? s?.alt ?? null });
    });
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Auto-load gallery + video — Vite import.meta.glob (bulletproof)     */
/* ------------------------------------------------------------------ */
/*
  WORKS ON ALL VITE VERSIONS (2, 3, 4, 5, 6).
  Uses relative glob path + module.default — no query/import options.

  FOLDER STRUCTURE (just drop files — any filename works):
    src/
    └── assets/
        └── projects/
            ├── voxsense/
            │   ├── image/
            │   │   ├── dashboard.png
            │   │   └── hero.jpg
            │   └── video/
            │       └── demo.mp4
            └── ... (one folder per project slug)
*/

// Relative path from src/pages/ → ../assets/projects/*/image/*
const IMG_GLOB = import.meta.glob(
  "../assets/projects/*/image/*.{png,jpg,jpeg,webp,gif,avif,svg}",
  { eager: true }
);

const VID_GLOB = import.meta.glob(
  "../assets/projects/*/video/*.{mp4,webm,mov,m4v,ogg}",
  { eager: true }
);

/* Parse slug + filename from a glob path.
   Handles both relative ("../assets/...") and absolute ("/src/assets/...") paths. */
function parseGlobPath(path) {
  const match = path.match(/assets\/projects\/([^/]+)\/(image|video)\/(.+)$/);
  if (!match) return null;
  return { slug: match[1], type: match[2], file: match[3] };
}

/* Extract URL from a Vite module — handles all Vite versions */
function getUrlFromModule(mod) {
  if (typeof mod === "string") return mod;
  if (mod?.default) return mod.default;
  if (typeof mod === "object" && mod !== null) {
    // Some Vite versions put URL on the module directly
    const keys = Object.keys(mod);
    if (keys.length === 1 && typeof mod[keys[0]] === "string") return mod[keys[0]];
  }
  return "";
}

/* Convert "dashboard.png" into "Dashboard" */
function captionFromFilename(file) {
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/* Pre-built lookup map at module scope (build-time, zero runtime cost) */
const imagesBySlug = {};
const videosBySlug = {};

Object.entries(IMG_GLOB).forEach(([path, mod]) => {
  const info = parseGlobPath(path);
  if (!info) return;
  const url = getUrlFromModule(mod);
  if (!url) return;
  if (!imagesBySlug[info.slug]) imagesBySlug[info.slug] = [];
  imagesBySlug[info.slug].push({
    src: url,
    caption: captionFromFilename(info.file),
  });
});

Object.entries(VID_GLOB).forEach(([path, mod]) => {
  const info = parseGlobPath(path);
  if (!info) return;
  const url = getUrlFromModule(mod);
  if (!url) return;
  if (!videosBySlug[info.slug]) videosBySlug[info.slug] = [];
  videosBySlug[info.slug].push({
    url,
    title: captionFromFilename(info.file),
    description: null,
  });
});

// DEBUG: See what Vite detected at build time
console.log("[ProjectDetail] imagesBySlug:", imagesBySlug);
console.log("[ProjectDetail] videosBySlug:", videosBySlug);

/* Hook: returns build-time glob results — zero runtime cost, zero errors */
function useAutoProjectMedia(slug) {
  const images = slug ? (imagesBySlug[slug] ?? []) : [];
  const videos = slug ? (videosBySlug[slug] ?? []) : [];
  return { images, videos, loaded: true };
}

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */
const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox = "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";
const hoverCard = "transition hover:border-neutral-900 dark:hover:border-white";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

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

function ListBlock({ id, icon, title, items, ItemIcon, cols = true }) {
  const list = asList(items).map(textOf).filter(Boolean);
  if (!list.length) return null;
  return (
    <Block id={id} icon={icon} title={title} count={list.length}>
      <ul className={`grid gap-3 ${cols ? "sm:grid-cols-2" : ""}`}>
        {list.map((t, i) => (
          <li key={i} className={`${card} flex items-start gap-3.5 p-5`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10">
              <ItemIcon size={15} />
            </span>
            <p className="pt-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300">{t}</p>
          </li>
        ))}
      </ul>
    </Block>
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

function CopyLine({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch { /* clipboard blocked */ }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-3 font-mono text-xs text-neutral-100 dark:bg-black/50">
      <code className="min-w-0 overflow-x-auto whitespace-pre">{text}</code>
      <button type="button" onClick={copy} aria-label="Copy command" className="shrink-0 rounded-md p-1.5 text-neutral-300 transition hover:bg-white/10 hover:text-white">
        {done ? <Check size={14} /> : <Copy size={14} />}
      </button>
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
  if (!cur) return null;
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
  const closeLightbox = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (index >= total && total > 0) setIndex(0);
  }, [index, total]);

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
        {tagline && <p className={`mt-2 max-w-md text-sm ${soft}`}>{tagline}</p>}
      </div>
    );
  }

  const cur = slides[Math.min(index, total - 1)];
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
          <p className={`mt-0.5 text-xs ${soft}`}>
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

      {open && <Lightbox images={slides} index={index} onClose={closeLightbox} onNav={setIndex} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery: uniform tiles, full image visible (never cropped),         */
/* featured first tile, broken images skipped, show more / less        */
/* ------------------------------------------------------------------ */
const GALLERY_INITIAL = 6;

function Gallery({ images, title }) {
  const [open, setOpen] = useState(null);
  const [broken, setBroken] = useState(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const closeLightbox = useCallback(() => setOpen(null), []);

  const visible = useMemo(() => images.filter((im) => !broken.has(im.src)), [images, broken]);
  const shown = expanded ? visible : visible.slice(0, GALLERY_INITIAL);
  const hidden = visible.length - shown.length;

  if (!visible.length) {
    return (
      <div className={`${card} flex flex-col items-center gap-3 border-dashed p-10 text-center`}>
        <ImageIcon size={26} className="text-neutral-400" />
        <p className={`text-sm ${muted}`}>Screenshots for {title} will appear here soon.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((im, i) => (
          <li key={`${im.src}-${i}`} className={i === 0 && visible.length > 2 ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={im.caption ? `View: ${im.caption}` : `View image ${i + 1}`}
              className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:border-white ${focus}`}
            >
              <img
                src={im.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl"
              />
              <img
                src={im.src}
                alt={im.caption || `${title} screenshot ${i + 1}`}
                loading="lazy"
                onError={() => setBroken((prev) => new Set(prev).add(im.src))}
                className="relative h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-4 text-left text-xs font-medium text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                <span className="line-clamp-2">{im.caption || "View full screen"}</span>
                <Maximize2 size={15} className="shrink-0" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {visible.length > GALLERY_INITIAL && (
        <div className="mt-6 flex justify-center print:hidden">
          <Btn variant="secondary" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less" : `Show ${hidden} more`}
            <ChevronDown size={16} className={`transition ${expanded ? "rotate-180" : ""}`} />
          </Btn>
        </div>
      )}

      {open !== null && <Lightbox images={visible} index={open} onClose={closeLightbox} onNav={setOpen} />}
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
          {description && <p className={`mt-2 text-sm leading-7 ${muted}`}>{description}</p>}
        </div>
      )}
    </div>
  );
}

/* Empty video placeholder — shown when project has no video */
function EmptyVideo({ title }) {
  return (
    <div className={`${card} flex flex-col items-center justify-center gap-3 border-dashed p-10 text-center`}>
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBox}`}>
        <Film size={26} />
      </span>
      <p className="text-sm font-semibold">{title} demo will appear here soon.</p>
      <p className={`text-xs ${soft}`}>A short walkthrough is being recorded.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */
function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <ul className="space-y-3">
      {items.map((f, i) => {
        const isOpen = openIdx === i;
        return (
          <li key={i} className={`${card} overflow-hidden`}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className={`flex w-full items-center justify-between gap-4 p-5 text-left font-semibold ${focus}`}
            >
              <span>{f.question}</span>
              <ChevronDown size={18} className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className={`border-t border-neutral-200 px-5 pb-5 pt-4 text-sm leading-7 dark:border-white/10 ${muted}`}>{f.answer}</p>}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Project brief (detailed) — COMPACT, fits on screen                  */
/* ------------------------------------------------------------------ */
function ProjectBrief({ project, links, flatTech }) {
  const start = pick(project, "startDate", "started");
  const end = pick(project, "endDate", "completed");
  const timeline = start || end ? [start, end ?? "Present"].filter(Boolean).join(" – ") : undefined;
  const responsibilities = asList(pick(project, "responsibilities", "contributions")).map(textOf).filter(Boolean);
  const tags = asList(pick(project, "tags", "keywords")).map(textOf).filter(Boolean);
  const progress = Number(project.progress);

  const rows = [
    { icon: Calendar, label: "Year", value: fmt(project.year) },
    { icon: Clock, label: "Duration", value: fmt(project.duration) },
    { icon: Calendar, label: "Timeline", value: timeline },
    { icon: User, label: "Role", value: fmt(project.role) },
    { icon: Users, label: "Team", value: fmt(pick(project, "team", "teamSize")) },
    { icon: Layers, label: "Category", value: fmt(project.category) },
    { icon: Briefcase, label: "Project type", value: fmt(pick(project, "type", "projectType")) },
    { icon: Monitor, label: "Platform", value: fmt(pick(project, "platform", "platforms")) },
    { icon: Target, label: "Audience", value: fmt(pick(project, "audience", "targetUsers")) },
    { icon: Briefcase, label: "Client", value: fmt(project.client) },
    { icon: Cloud, label: "Hosting", value: fmt(pick(project, "hosting", "deployment")) },
    { icon: GitBranch, label: "Version", value: fmt(project.version) },
    { icon: ShieldCheck, label: "License", value: fmt(project.license) },
    { icon: Clock, label: "Last updated", value: fmt(pick(project, "lastUpdated", "updatedAt")) },
    { icon: Wrench, label: "Technologies", value: flatTech.length ? `${flatTech.length} used` : "" },
    { icon: CheckCircle2, label: "Status", value: fmt(project.status) },
  ].filter((r) => r.value);

  const quick = links.slice(0, 4);

  return (
    <div className={`${card} h-fit p-4 sm:p-5`}>
      {/* Header — more compact */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`h-9 w-9 rounded-lg ${iconBox}`}><FileCode size={17} /></span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">Project brief</h2>
          <p className={`text-[11px] ${soft}`}>At a glance</p>
        </div>
      </div>

      {/* Detail rows — 2-col grid, compact padding/text (was p-3.5, now p-2.5) */}
      {rows.length > 0 && (
        <dl className="grid grid-cols-2 gap-2">
          {rows.map((b) => (
            <div key={b.label} className="rounded-lg bg-neutral-50 p-2.5 dark:bg-white/5">
              <dt className={`flex items-center gap-1 text-[11px] ${soft}`}>
                <b.icon size={12} /> {b.label}
              </dt>
              <dd className="mt-1 break-words text-xs font-semibold sm:text-sm">{b.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Progress — compact */}
      {Number.isFinite(progress) && progress > 0 && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className={soft}>Completion</span>
            <span className="font-semibold">{Math.min(100, progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10" role="progressbar" aria-valuenow={Math.min(100, progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-neutral-900 dark:bg-white" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </div>
      )}

      {/* Responsibilities — compact */}
      {responsibilities.length > 0 && (
        <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-white/10">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold"><ListChecks size={14} /> My responsibilities</p>
          <ul className="space-y-1.5">
            {responsibilities.slice(0, 5).map((r, i) => (
              <li key={i} className={`flex items-start gap-2 text-xs leading-5 ${muted}`}>
                <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-neutral-900 dark:text-white" /> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags — compact */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600 dark:border-white/10 dark:text-neutral-400">
              <Tag size={10} /> {t}
            </span>
          ))}
        </div>
      )}

      {/* Quick links — compact */}
      {quick.length > 0 && (
        <div className="mt-4 grid gap-1.5 border-t border-neutral-200 pt-4 dark:border-white/10 print:hidden">
          {quick.map((l) => (
            <a
              key={l.key}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium transition hover:border-neutral-900 dark:border-white/10 dark:hover:border-white ${focus}`}
            >
              <span className="inline-flex items-center gap-1.5"><l.icon size={13} /> {l.title}</span>
              <ArrowUpRight size={13} className="text-neutral-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini project card                                                   */
/* ------------------------------------------------------------------ */
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
        {p.category && <p className={`mt-1 text-sm ${soft}`}>{p.category}</p>}
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
    const base = project.technologies ?? project.techStack ?? (techCategories ? techCategories.flatMap((c) => c.items ?? []) : []);
    return base.map(techName).filter(Boolean);
  }, [project, techCategories]);

  const links = useMemo(() => resolveLinks(project), [project]);
  const liveLink = links.find((l) => l.key === "live");
  const repoLink = links.find((l) => l.key === "github") ?? links.find((l) => l.key === "frontend");

  /* Links section always has something: falls back to the author's GitHub */
  const displayLinks = useMemo(
    () =>
      links.length
        ? links
        : [{ key: "profile", icon: Github, label: "Profile", title: "GitHub profile", text: "Browse all my repositories.", url: GITHUB_PROFILE }],
    [links]
  );

  const previewList = project?.preview;
  const galleryList = project?.gallery ?? project?.screenshots ?? project?.images;

  // Auto-load from /public/project/[slug]/image and /public/project/[slug]/video
  const autoMedia = useAutoProjectMedia(slug);

  // Merge: project data first, then auto-loaded folder assets (deduplicated)
  const slides = useMemo(
    () => normalizeImages(previewList, galleryList, autoMedia.images),
    [previewList, galleryList, autoMedia.images]
  );

  const gallery = useMemo(() => {
    const g = normalizeImages(galleryList);
    const merged = g.length ? g : normalizeImages(previewList);
    // Append any auto-loaded images not already present
    const seen = new Set(merged.map((m) => m.src));
    autoMedia.images.forEach((im) => {
      if (!seen.has(im.src)) {
        merged.push(im);
        seen.add(im.src);
      }
    });
    return merged;
  }, [galleryList, previewList, autoMedia.images]);

  // Video: use project.video first, else first auto-loaded video file
  const video = useMemo(() => {
    if (project?.video) return project.video;
    if (autoMedia.videos.length > 0) {
      return { url: autoMedia.videos[0].url, title: `${project.title} — demo`, description: null };
    }
    return null;
  }, [project, autoMedia.videos]);

  // List of all videos: project.video + project.videos array + auto-loaded folder videos
  const videoList = useMemo(() => {
    const list = [];
    // 1. Single video field (legacy)
    if (project?.video) {
      const url = typeof project.video === "string" ? project.video : project.video?.url;
      if (url) list.push(project.video);
    }
    // 2. Videos array (new — supports multiple videos per project)
    if (Array.isArray(project?.videos)) {
      project.videos.forEach((v) => {
        const url = typeof v === "string" ? v : v?.url;
        if (!url) return;
        const exists = list.some((item) => (typeof item === "string" ? item : item?.url) === url);
        if (!exists) list.push(v);
      });
    }
    // 3. Auto-loaded videos from src/assets folder
    autoMedia.videos.forEach((v) => {
      const url = typeof v === "string" ? v : v.url ?? v.src;
      if (!url) return;
      const exists = list.some((item) => (typeof item === "string" ? item : item?.url) === url);
      if (!exists) list.push({ url, title: `${project.title} — demo` });
    });
    return list;
  }, [project, autoMedia.videos]);

  const highlights = useMemo(() => asList(pick(project ?? {}, "highlights", "keyPoints")).map(textOf).filter(Boolean), [project]);
  const responsibilities = useMemo(() => asList(pick(project ?? {}, "responsibilities", "contributions")).map(textOf).filter(Boolean), [project]);
  const results = useMemo(() => asList(pick(project ?? {}, "results", "outcomes", "impact")).map(textOf).filter(Boolean), [project]);
  const testing = useMemo(() => asList(pick(project ?? {}, "testing", "quality")).map(textOf).filter(Boolean), [project]);
  const timeline = useMemo(() => asList(project?.timeline ?? project?.milestones).filter((t) => t && (typeof t === "string" || t.title || t.description || t.phase)), [project]);
  const faq = useMemo(() => asList(project?.faq).filter((f) => f?.question && f?.answer), [project]);

  const setup = useMemo(() => {
    const s = project?.setup ?? project?.installation;
    if (!s) return null;
    if (Array.isArray(s)) return { steps: s.map(textOf).filter(Boolean) };
    if (typeof s === "string") return { steps: [s] };
    return {
      requirements: asList(s.requirements ?? s.prerequisites).map(textOf).filter(Boolean),
      steps: asList(s.steps ?? s.commands).map(textOf).filter(Boolean),
      env: asList(s.env ?? s.environment).map(textOf).filter(Boolean),
    };
  }, [project]);
  const hasSetup = !!setup && (setup.steps?.length || setup.requirements?.length || setup.env?.length);

  const hasGallery = gallery.length > 0;
  const hasVideo = videoList.length > 0;

  const sections = useMemo(() => {
    if (!project) return [];
    return [
      { id: "overview", label: "Overview", icon: Lightbulb, show: true },
      { id: "problem", label: "Problem", icon: AlertCircle, show: !!project.problem },
      { id: "goals", label: "Goals", icon: Target, show: project.goals?.length > 0 },
      { id: "role", label: "My role", icon: Briefcase, show: responsibilities.length > 0 },
      { id: "architecture", label: "Architecture", icon: Layers, show: !!project.architecture },
      { id: "features", label: "Features", icon: CheckCircle2, show: project.features?.length > 0 },
      // Gallery + Video — ALWAYS shown so every project has them in sidebar
      { id: "gallery", label: "Gallery", icon: ImageIcon, show: true },
      { id: "video", label: "Video demo", icon: Play, show: true },
      { id: "tech", label: "Tech stack", icon: Wrench, show: flatTech.length > 0 },
      { id: "timeline", label: "Timeline", icon: Calendar, show: timeline.length > 0 },
      { id: "challenges", label: "Challenges", icon: AlertTriangle, show: project.challenges?.length > 0 },
      { id: "results", label: "Results", icon: TrendingUp, show: results.length > 0 },
      { id: "testing", label: "Testing", icon: FlaskConical, show: testing.length > 0 },
      { id: "learnings", label: "Learnings", icon: GraduationCap, show: project.learnings?.length > 0 },
      { id: "limitations", label: "Limitations", icon: AlertCircle, show: project.limitations?.length > 0 },
      { id: "future", label: "Roadmap", icon: Rocket, show: project.future?.length > 0 },
      { id: "setup", label: "Run locally", icon: Terminal, show: !!hasSetup },
      { id: "faq", label: "FAQ", icon: HelpCircle, show: faq.length > 0 },
      { id: "links", label: "Links", icon: Link2, show: true },
    ].filter((s) => s.show);
  }, [project, flatTech.length, responsibilities.length, timeline.length, results.length, testing.length, hasSetup, faq.length]);

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

  const counts = [
    { icon: CheckCircle2, value: project.features?.length, label: "Features" },
    { icon: Wrench, value: flatTech.length, label: "Technologies" },
    { icon: Target, value: project.goals?.length, label: "Goals" },
    { icon: AlertTriangle, value: project.challenges?.length, label: "Challenges" },
    { icon: ImageIcon, value: gallery.length, label: "Screenshots" },
    { icon: Rocket, value: project.future?.length, label: "Roadmap items" },
  ].filter((c) => c.value > 0);

  const flowSteps = project.architecture?.dataFlow
    ? String(project.architecture.dataFlow).split(/\s*(?:→|->|=>)\s*/).filter(Boolean)
    : [];
  const others = (Array.isArray(projects) ? projects : []).filter((p) => p?.slug && p.slug !== slug).slice(0, 3);
  const audience = fmt(pick(project, "audience", "targetUsers"));

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* ============ HERO ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <nav aria-label="Breadcrumb" className={`mb-8 flex flex-wrap items-center gap-1.5 text-sm ${soft} print:hidden`}>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"><Home size={14} /> Home</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link to="/projects" className="hover:text-neutral-900 dark:hover:text-white">Projects</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="max-w-[12rem] truncate text-neutral-900 dark:text-white sm:max-w-none">{project.title}</span>
          </nav>

          {/* Wider card: grid changed from [1.15fr_0.85fr] to [1fr_1fr] (50/50) */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {project.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                    <Layers size={12} /> {project.category}
                  </span>
                )}
                {project.year && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                    <Calendar size={12} /> {project.year}
                  </span>
                )}
                <StatusBadge status={project.status} />
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
              {project.tagline && <p className={`mt-5 max-w-xl text-lg leading-8 ${muted}`}>{project.tagline}</p>}

              {audience && (
                <p className={`mt-4 flex max-w-xl items-start gap-2 text-sm ${soft}`}>
                  <Users size={15} className="mt-0.5 shrink-0" /> Built for: {audience}
                </p>
              )}

              {flatTech.length > 0 && (
                <div className="mt-7">
                  <TechList items={flatTech} limit={8} />
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                {liveLink && <Btn href={liveLink.url}><ExternalLink size={16} /> Live demo</Btn>}
                {repoLink && <Btn href={repoLink.url} variant={liveLink ? "secondary" : "primary"}><Github size={16} /> Repository</Btn>}
                {links.length > 2 && (
                  <a href="#links" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 ${focus}`}>
                    <Link2 size={16} /> All links
                  </a>
                )}
                <Btn onClick={handleShare} variant="secondary">
                  {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? "Link copied" : "Share"}
                </Btn>
                <Btn onClick={() => window.print()} variant="secondary"><Printer size={16} /> Print</Btn>
              </div>
            </div>

            <ProjectBrief project={project} links={links} flatTech={flatTech} />
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
                  {m.description && <p className={`mt-1 text-xs leading-5 ${soft}`}>{m.description}</p>}
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

                <div className={`${card} p-4`}>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles size={14} /> Quick links</p>
                  <ul className="space-y-2 text-sm">
                    {displayLinks.slice(0, 4).map((l) => (
                      <li key={l.key}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
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
              </div>
            </aside>

            {/* Article */}
            <div className="min-w-0 max-w-3xl space-y-20">
              {/* OVERVIEW */}
              <Block id="overview" icon={Lightbulb} title="Overview">
                <p className={`text-base leading-8 ${muted}`}>{project.description}</p>

                {highlights.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                        <Sparkles size={15} className="mt-1.5 shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                )}

                {counts.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {counts.map((c) => (
                      <div key={c.label} className={`${card} p-4`}>
                        <c.icon size={18} className={soft} />
                        <dd className="mt-3 text-2xl font-semibold leading-none">{c.value}</dd>
                        <dt className={`mt-1.5 text-xs ${soft}`}>{c.label}</dt>
                      </div>
                    ))}
                  </dl>
                )}
              </Block>

              {/* PROBLEM */}
              {project.problem && (
                <Block id="problem" icon={AlertCircle} title="Problem">
                  <div className={`${card} border-l-4 !border-l-neutral-900 p-6 dark:!border-l-white sm:p-8`}>
                    <p className={`leading-8 ${muted}`}>{project.problem}</p>
                  </div>
                </Block>
              )}

              {/* GOALS */}
              <ListBlock id="goals" icon={Target} title="Goals" items={project.goals} ItemIcon={Target} />

              {/* ROLE */}
              <ListBlock id="role" icon={Briefcase} title="My role & contributions" items={responsibilities} ItemIcon={ListChecks} />

              {/* ARCHITECTURE */}
              {project.architecture && (
                <Block id="architecture" icon={Layers} title="Architecture">
                  <div className="space-y-4">
                    {project.architecture.summary && (
                      <div className={`${card} p-6 sm:p-7`}>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Workflow size={16} /> Summary</p>
                        <p className={`leading-8 ${muted}`}>{project.architecture.summary}</p>
                      </div>
                    )}

                    {project.architecture.components?.length > 0 && (
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {project.architecture.components.map((c, i) => {
                          const Ic = COMPONENT_ICONS[i % COMPONENT_ICONS.length];
                          const label = typeof c === "string" ? c : c?.name ?? c?.title ?? `Component ${i + 1}`;
                          const desc = typeof c === "object" ? c?.description : null;
                          return (
                            <li key={`${label}-${i}`} className={`${card} p-5`}>
                              <div className="flex items-center gap-3">
                                <span className={`h-10 w-10 rounded-xl ${iconBox}`}><Ic size={18} /></span>
                                <p className="font-semibold">{label}</p>
                              </div>
                              {desc && <p className={`mt-3 text-sm leading-6 ${soft}`}>{desc}</p>}
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
                          <p className={`leading-7 ${muted}`}>{project.architecture.dataFlow}</p>
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
                      const name = typeof f === "string" ? f : f?.name ?? f?.title ?? `Feature ${i + 1}`;
                      const desc = typeof f === "object" ? f?.description : null;
                      const status = typeof f === "object" ? f?.status : null;
                      return (
                        <li key={`${name}-${i}`} className={`${card} flex h-full flex-col p-5 sm:p-6`}>
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10"><CheckCircle2 size={17} /></span>
                            <StatusBadge status={status} />
                          </div>
                          <h3 className="font-semibold">{name}</h3>
                          {desc && <p className={`mt-2 text-sm leading-7 ${muted}`}>{desc}</p>}
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* GALLERY — always shown, empty placeholder if no images */}
              <Block id="gallery" icon={ImageIcon} title="Gallery" count={hasGallery ? gallery.length : 0}>
                {hasGallery ? (
                  <Gallery images={gallery} title={project.title} />
                ) : (
                  <div className={`${card} flex flex-col items-center gap-3 border-dashed p-10 text-center`}>
                    <ImageIcon size={26} className="text-neutral-400" />
                    <p className={`text-sm ${muted}`}>Screenshots for {project.title} will appear here soon.</p>
                  </div>
                )}
              </Block>

              {/* VIDEO — always shown, empty placeholder if no video */}
              <Block id="video" icon={Play} title="Video demo" count={videoList.length > 1 ? videoList.length : null}>
                {hasVideo ? (
                  <div className="space-y-4">
                    {videoList.map((v, i) => (
                      <VideoEmbed key={i} video={v} />
                    ))}
                  </div>
                ) : (
                  <EmptyVideo title={project.title} />
                )}
              </Block>

              {/* TECH */}
              {flatTech.length > 0 && (
                <Block id="tech" icon={Wrench} title="Tech stack" count={flatTech.length}>
                  {techCategories ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {techCategories.map((cat, i) => {
                        const icons = [Monitor, Server, Database, Network, Cpu, Wrench, Cloud, ShieldCheck];
                        const CatIcon = icons[i % icons.length];
                        return (
                          <div key={cat.category ?? i} className={`${card} p-5 sm:p-6`}>
                            <div className="mb-5 flex items-center gap-3">
                              <span className={`h-10 w-10 rounded-xl ${iconBox}`}><CatIcon size={19} /></span>
                              <div className="min-w-0">
                                <h3 className="font-semibold">{cat.category}</h3>
                                {cat.description && <p className={`mt-0.5 text-xs ${soft}`}>{cat.description}</p>}
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

              {/* TIMELINE */}
              {timeline.length > 0 && (
                <Block id="timeline" icon={Calendar} title="Build timeline" count={timeline.length}>
                  <ol>
                    {timeline.map((t, i) => {
                      const when = typeof t === "object" ? t.date ?? t.phase ?? t.when : null;
                      const title = typeof t === "object" ? t.title ?? t.name : null;
                      const desc = typeof t === "string" ? t : t.description;
                      return (
                        <li key={i} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-6 last:pb-0">
                          {i < timeline.length - 1 && (
                            <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20" />
                          )}
                          <span className={`relative z-10 h-10 w-10 rounded-full ${iconBox}`}><Calendar size={16} /></span>
                          <div className={`${card} p-5`}>
                            {when && <p className={`text-xs font-medium ${soft}`}>{when}</p>}
                            {title && <h3 className="mt-0.5 font-semibold">{title}</h3>}
                            {desc && <p className={`mt-1.5 text-sm leading-7 ${muted}`}>{desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
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
                              {problem && <p className={`text-sm leading-7 ${muted} ${title ? "mt-1.5" : "pt-1.5"}`}>{problem}</p>}
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

              {/* RESULTS */}
              <ListBlock id="results" icon={TrendingUp} title="Results & impact" items={results} ItemIcon={TrendingUp} />

              {/* TESTING */}
              <ListBlock id="testing" icon={FlaskConical} title="Testing & quality" items={testing} ItemIcon={ShieldCheck} />

              {/* LEARNINGS */}
              <ListBlock id="learnings" icon={GraduationCap} title="Learnings" items={project.learnings} ItemIcon={Lightbulb} />

              {/* LIMITATIONS */}
              {project.limitations?.length > 0 && (
                <Block id="limitations" icon={AlertCircle} title="Limitations" count={project.limitations.length}>
                  <ul className="space-y-3">
                    {project.limitations.map((l, i) => (
                      <li key={i} className="flex items-start gap-3.5 rounded-2xl border border-dashed border-neutral-300 p-5 dark:border-white/20">
                        <AlertCircle size={17} className="mt-1 shrink-0 text-neutral-500" />
                        <p className={`text-sm leading-7 ${muted}`}>{textOf(l)}</p>
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
                            {desc && <p className={`text-sm leading-7 ${muted} ${title ? "mt-1.5" : ""}`}>{desc}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Block>
              )}

              {/* SETUP */}
              {hasSetup && (
                <Block id="setup" icon={Terminal} title="Run it locally">
                  <div className="space-y-4">
                    {setup.requirements?.length > 0 && (
                      <div className={`${card} p-5 sm:p-6`}>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><ListChecks size={15} /> Requirements</p>
                        <ul className="space-y-2">
                          {setup.requirements.map((r, i) => (
                            <li key={i} className={`flex items-start gap-2.5 text-sm leading-6 ${muted}`}>
                              <Check size={14} className="mt-1 shrink-0" /> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {setup.steps?.length > 0 && (
                      <div className={`${card} p-5 sm:p-6`}>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Terminal size={15} /> Steps</p>
                        <div className="space-y-2">
                          {setup.steps.map((s, i) => <CopyLine key={i} text={s} />)}
                        </div>
                      </div>
                    )}
                    {setup.env?.length > 0 && (
                      <div className={`${card} p-5 sm:p-6`}>
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15} /> Environment variables</p>
                        <div className="space-y-2">
                          {setup.env.map((s, i) => <CopyLine key={i} text={s} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </Block>
              )}

              {/* FAQ */}
              {faq.length > 0 && (
                <Block id="faq" icon={HelpCircle} title="FAQ" count={faq.length}>
                  <Faq items={faq} />
                </Block>
              )}

              {/* LINKS */}
              <Block id="links" icon={Link2} title="Links" count={displayLinks.length}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {displayLinks.map((l) => (
                    <a
                      key={l.key}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group ${card} flex items-center gap-4 p-5 ${hoverCard} ${focus}`}
                    >
                      <span className={`h-12 w-12 rounded-xl ${iconBox}`}><l.icon size={21} /></span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs ${soft}`}>{l.label}</p>
                        <p className="font-semibold">{l.title}</p>
                        <p className={`truncate text-xs ${soft}`}>{l.url.replace(/^https?:\/\//, "")}</p>
                      </div>
                      <ArrowUpRight size={18} className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </Block>

              {/* TESTIMONIAL */}
              {project.testimonial && (
                <figure className={`${card} p-6 sm:p-9`}>
                  <Quote size={30} className="mb-4 text-neutral-300 dark:text-neutral-600" />
                  <blockquote className="text-lg leading-8">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-5 dark:border-white/10">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/10"><User size={18} /></span>
                    <span>
                      <span className="block text-sm font-semibold">{project.testimonial.author}</span>
                      {project.testimonial.role && <span className={`block text-xs ${soft}`}>{project.testimonial.role}</span>}
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
                    <span className={`block text-xs ${soft}`}>Previous</span>
                    <span className="block truncate font-semibold">{prev.title}</span>
                  </span>
                </Link>
              ) : <span />}
              {next && (
                <Link to={`/projects/${next.slug}`} className={`group flex items-center justify-end gap-4 rounded-2xl border border-neutral-200 p-5 text-right dark:border-white/10 ${hoverCard} ${focus}`}>
                  <span className="min-w-0">
                    <span className={`block text-xs ${soft}`}>Next</span>
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
            <a href={repoLink?.url ?? GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Github size={16} /> {repoLink ? "View repository" : "GitHub"}
            </a>
            {liveLink && (
              <a href={liveLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
                <ExternalLink size={16} /> Live demo
              </a>
            )}
            <Link to="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Code2 size={16} /> All projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
