import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  CloudUpload,
  Code2,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  Github,
  Globe,
  GraduationCap,
  Grid2X2,
  HelpCircle,
  Home,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Lightbulb,
  List,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Maximize2,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  Users,
  Wrench,
  X as XIcon,
} from "lucide-react";

import { achievements, growthAreas } from "../data/achievements";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  CONFIG + ADMIN AUTH                                                */
/* ------------------------------------------------------------------ */

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const AUTH_LOGIN_ENDPOINT = `${API_BASE}/api/v1/auth/login`;
const VAULT_DOCUMENTS_ENDPOINT = `${API_BASE}/api/v1/vault/documents`;
const GITHUB_PROFILE = "https://github.com/Suraj1819";

const ADMIN_SESSION_KEY = "suraj-vault-admin-session";
const ADMIN_SESSION_DURATION = 1000 * 60 * 60 * 4; // 4 hours

function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setAdminSession(token) {
  try {
    localStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ token, expiresAt: Date.now() + ADMIN_SESSION_DURATION })
    );
  } catch {
    /* storage blocked */
  }
}

function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* storage blocked */
  }
}

/* Token is sent with every admin request (backend can verify it). */
function authHeaders(extra = {}) {
  const session = getAdminSession();
  return session?.token ? { ...extra, Authorization: `Bearer ${session.token}` } : extra;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const CATEGORIES = [
  "Certificate",
  "Achievement",
  "Project",
  "Assignment",
  "Internship",
  "Workshop",
  "Course",
  "Report",
  "Other",
];

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

const EMPTY_FORM = {
  title: "",
  category: "Certificate",
  description: "",
  organization: "",
  date: "",
  tags: "",
  featured: false,
  certificateNumber: "",
  issueDate: "",
  startDate: "",
  endDate: "",
  expiryDate: "",
  credentialUrl: "",
  scoreGrade: "",
  duration: "",
  location: "",
  mode: "",
  mentorInstructor: "",
  teamSize: "",
  rolePosition: "",
};

const DATE_KEYS = ["date", "issueDate", "startDate", "endDate", "expiryDate"];

const CATEGORY_FIELDS = {
  Certificate: ["certificateNumber", "issueDate", "expiryDate", "credentialUrl", "scoreGrade"],
  Achievement: ["issueDate", "scoreGrade"],
  Project: ["startDate", "endDate", "rolePosition", "teamSize", "credentialUrl"],
  Assignment: ["startDate", "endDate", "scoreGrade", "mentorInstructor"],
  Internship: ["startDate", "endDate", "duration", "location", "mode", "mentorInstructor", "rolePosition"],
  Workshop: ["issueDate", "duration", "location", "mode", "mentorInstructor"],
  Course: ["startDate", "endDate", "scoreGrade", "credentialUrl", "mentorInstructor"],
  Report: ["startDate", "endDate", "mentorInstructor"],
  Other: ["issueDate"],
};

const PRIMARY_NAV = [
  { id: "all", title: "All Documents", icon: Grid2X2, kind: "documents" },
  { id: "recent", title: "Recent", icon: CalendarDays, kind: "documents" },
  { id: "starred", title: "Starred", icon: Star, kind: "documents" },
];

const VAULTS = [
  { id: "certificates", title: "Certificates", icon: Award, categories: ["Certificate", "Course", "Workshop"], kind: "documents" },
  { id: "skills", title: "Skill Vault", icon: Sparkles, categories: [], kind: "skills" },
  { id: "projects", title: "Projects", icon: Code2, categories: ["Project", "Report"], kind: "documents" },
  { id: "assignments", title: "Assignments", icon: BookOpen, categories: ["Assignment"], kind: "documents" },
  { id: "achievements", title: "Achievements", icon: Trophy, categories: ["Achievement"], kind: "achievements" },
  { id: "internships", title: "Internships", icon: Briefcase, categories: ["Internship"], kind: "documents" },
  { id: "academic", title: "Academic", icon: GraduationCap, categories: ["Assignment", "Report", "Course"], kind: "documents" },
  { id: "other", title: "Other Documents", icon: Folder, categories: ["Other"], kind: "documents" },
];

const ALL_NAV_ITEMS = [...PRIMARY_NAV, ...VAULTS];

/* Which vault a category opens when clicked in the breakdown */
const CATEGORY_VAULT = {
  Certificate: "certificates",
  Course: "certificates",
  Workshop: "certificates",
  Project: "projects",
  Report: "projects",
  Assignment: "assignments",
  Achievement: "achievements",
  Internship: "internships",
  Other: "other",
};

const FAQ_ITEMS = [
  {
    question: "What is this vault?",
    answer:
      "A single place for my certificates, projects, assignments, internships and achievements. Everything is searchable, filterable by year and category, and can be previewed without leaving the page.",
  },
  {
    question: "Where are the files stored?",
    answer:
      "Files live in a Supabase Storage bucket and their details (title, dates, credential ID, tags and so on) live in PostgreSQL. Any file can be opened from any device with an internet connection.",
  },
  {
    question: "Who can upload, edit or delete documents?",
    answer:
      "Only the admin. The password is checked by the backend, and the admin session expires automatically after 4 hours. Visitors can browse, preview and download everything.",
  },
  {
    question: "How does the page stay up to date?",
    answer:
      "It checks the server every 5 seconds and again whenever you return to the tab. If something is added or removed in Supabase, the list updates by itself. The Refresh button forces an immediate check.",
  },
  {
    question: "Which file types are supported?",
    answer: "PDF, JPG, JPEG, PNG and WebP, up to 25 MB per file.",
  },
];

/* ------------------------------------------------------------------ */
/*  SHARED CLASSES (same tokens as the project detail page)            */
/* ------------------------------------------------------------------ */

const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox = "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";
const hoverCard = "transition hover:border-neutral-900 dark:hover:border-white";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";
const inputClassName =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white dark:focus:ring-white/5";

const TONES = {
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Safely format a byte count into a human-readable size string.
 * Handles: invalid input (null/undefined/NaN/string), negative numbers,
 * and very large values (KB / MB / GB / TB / PB / EB). Caps absurd
 * values so the UI never shows overflow numbers like 2.6e16 MB.
 */
function formatSize(bytes = 0) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }
  if (bytes < 1) return "0 B";

  const safe = Math.min(bytes, Number.MAX_SAFE_INTEGER);
  const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  const STEP = 1024;

  let value = safe;
  let unitIndex = 0;
  while (value >= STEP && unitIndex < UNITS.length - 1) {
    value /= STEP;
    unitIndex++;
  }

  if (unitIndex === 0) return `${Math.round(value)} ${UNITS[0]}`;
  const formatted = value.toFixed(2).replace(/\.?0+$/, "");
  return `${formatted} ${UNITS[unitIndex]}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getYear(value) {
  if (!value) return "";
  return String(value).match(/\b20\d{2}\b/)?.[0] || "";
}

function getFileKind(item) {
  const name = item?.fileName || item?.name || "";
  const type = item?.mimeType || item?.type || "";
  if (type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (type.startsWith("image/")) return "image";
  return "file";
}

function getCategoryIcon(category) {
  const icons = {
    Certificate: Award,
    Achievement: Trophy,
    Project: Code2,
    Assignment: BookOpen,
    Internship: Briefcase,
    Workshop: GraduationCap,
    Course: BookOpen,
    Report: FileText,
    Other: Folder,
  };
  return icons[category] || File;
}

function inferAchievementCategory(item) {
  const text = `${item.title || ""} ${item.organization || ""}`.toLowerCase();
  if (/internship|intern/.test(text)) return "Internship";
  if (/project|application|website|development/.test(text)) return "Project";
  if (/workshop|seminar/.test(text)) return "Workshop";
  if (/assignment|coursework/.test(text)) return "Assignment";
  if (/leetcode|streak|problem|coding|achievement/.test(text)) return "Achievement";
  return "Certificate";
}

/* The most meaningful date of an item */
function itemDateValue(item) {
  return item.issueDate || item.endDate || item.date || item.startDate || "";
}

function itemTime(item) {
  const t = new Date(itemDateValue(item)).getTime();
  return Number.isNaN(t) ? item.createdAt || 0 : t;
}

function getExpiry(item) {
  if (!item?.expiryDate) return null;
  const t = new Date(item.expiryDate).getTime();
  if (Number.isNaN(t)) return null;
  const days = Math.ceil((t - Date.now()) / 86400000);
  if (days < 0) return { days, label: "Expired", tone: "red" };
  if (days <= 90) return { days, label: `Expires in ${days}d`, tone: "amber" };
  return { days, label: "Valid", tone: "green" };
}

function getDetailEntries(item) {
  return [
    [ShieldCheck, "Credential ID", item.certificateNumber],
    [Award, "Score / grade", item.scoreGrade],
    [Briefcase, "Role", item.rolePosition],
    [CalendarDays, "Issued", formatDate(item.issueDate)],
    [CalendarDays, "Start", formatDate(item.startDate)],
    [CalendarDays, "End", formatDate(item.endDate)],
    [CalendarDays, "Expires", formatDate(item.expiryDate)],
    [Clock, "Duration", item.duration],
    [Users, "Team", item.teamSize],
    [GraduationCap, "Mentor", item.mentorInstructor],
    [MapPin, "Location", item.location],
    [Globe, "Mode", item.mode],
  ]
    .filter((entry) => entry[2])
    .map(([icon, label, value]) => ({ icon, label, value }));
}

function formFromItem(item) {
  const form = { ...EMPTY_FORM };
  Object.keys(EMPTY_FORM).forEach((key) => {
    const value = item[key];
    if (value === undefined || value === null) return;
    if (key === "tags") form.tags = Array.isArray(value) ? value.join(", ") : String(value);
    else if (key === "featured") form.featured = Boolean(value);
    else if (DATE_KEYS.includes(key)) form.date = form[key] = String(value).slice(0, 10), (form[key] = String(value).slice(0, 10));
    else form[key] = value;
  });
  form.date = item.date ? String(item.date).slice(0, 10) : "";
  return form;
}

/**
 * Polling helper — true if both lists are equivalent, so we skip re-renders.
 */
function documentsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const sortA = [...a].sort((x, y) => String(x.id).localeCompare(String(y.id)));
  const sortB = [...b].sort((x, y) => String(x.id).localeCompare(String(y.id)));
  return sortA.every((doc, i) => {
    const other = sortB[i];
    return (
      other &&
      String(doc.id) === String(other.id) &&
      Boolean(doc.featured) === Boolean(other.featured) &&
      (doc.title || "") === (other.title || "") &&
      (doc.category || "") === (other.category || "")
    );
  });
}

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
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
        if (el && el.getBoundingClientRect().top + window.scrollY <= pos) {
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
/*  SMALL SHARED COMPONENTS                                            */
/* ------------------------------------------------------------------ */

/* Brand logos for skill names (same source as the project page) */
const LOGOS = {
  react: ["react", "61DAFB"], vite: ["vite", "646CFF"], tailwindcss: ["tailwindcss", "06B6D4"],
  javascript: ["javascript", "F7DF1E"], typescript: ["typescript", "3178C6"], nodejs: ["nodedotjs", "5FA04E"],
  express: ["express", "000000"], postgresql: ["postgresql", "4169E1"], mongodb: ["mongodb", "47A248"],
  supabase: ["supabase", "3FCF8E"], git: ["git", "F05032"], github: ["github", "181717"],
  python: ["python", "3776AB"], docker: ["docker", "2496ED"], html: ["html5", "E34F26"],
  html5: ["html5", "E34F26"], css: ["css3", "1572B6"], css3: ["css3", "1572B6"], nextjs: ["nextdotjs", "000000"],
  firebase: ["firebase", "FFCA28"], mysql: ["mysql", "4479A1"], redis: ["redis", "DC382D"],
  "c++": ["cplusplus", "00599C"], socketio: ["socketdotio", "010101"], webrtc: ["webrtc", "333333"],
  postman: ["postman", "FF6C37"], figma: ["figma", "F24E1E"],
};
const norm = (n) => String(n ?? "").toLowerCase().replace(/[\s._-]/g, "");

function Logo({ name, size = "h-6 w-6" }) {
  const logo = LOGOS[norm(name)];
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 dark:ring-white/10 ${size}`}>
      {logo ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className="h-[60%] w-[60%]"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <Code2 size={14} className="text-neutral-500" />
      )}
    </span>
  );
}

function Block({ id, icon: Icon, title, count, action, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className={`h-11 w-11 rounded-xl ${iconBox}`}>
            <Icon size={20} />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          {count != null && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
              {count}
            </span>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Btn({ href, to, onClick, variant = "primary", disabled, title, children }) {
  const base = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${focus}`;
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : variant === "danger"
        ? "border border-neutral-300 hover:border-red-400 hover:text-red-600 dark:border-white/15 dark:hover:border-red-900 dark:hover:text-red-400"
        : "border border-neutral-300 hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5";
  const cls = `${base} ${styles}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
}

function ExpiryBadge({ item }) {
  const expiry = getExpiry(item);
  if (!expiry) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[expiry.tone]}`}>
      <ShieldCheck size={12} /> {expiry.label}
    </span>
  );
}

function ProgressBar({ value, label }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-neutral-900 dark:bg-white" style={{ width: `${pct}%` }} />
    </div>
  );
}

function EmptyState({ title, description, onUpload, showUpload }) {
  return (
    <div className={`${card} flex min-h-64 flex-col items-center justify-center border-dashed px-6 py-12 text-center`}>
      <span className={`h-14 w-14 rounded-2xl ${iconBox}`}><FolderOpen size={24} /></span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className={`mt-2 max-w-sm text-sm leading-7 ${muted}`}>{description}</p>
      {showUpload && (
        <div className="mt-5">
          <Btn onClick={onUpload}><Plus size={16} /> Upload a document</Btn>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LIGHTBOX + SHOWCASE + GALLERY (full image, never cropped)          */
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
          <a href={cur.src} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Open original image"><ExternalLink size={18} /></a>
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
          alt={cur.caption || "Document image"}
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

function PreviewShowcase({ slides }) {
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

  if (!total) return null;
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
            <img src={s.src} alt={s.caption || `Preview ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} className="relative h-full w-full object-contain p-2 sm:p-5" />
          </div>
        ))}
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100 print:hidden">
          <Maximize2 size={17} />
        </span>
      </button>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{cur.caption || "Preview"}</p>
          <p className={`mt-0.5 text-xs ${soft}`}>{index + 1} of {total}</p>
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
                className={`h-16 w-28 overflow-hidden rounded-xl border-2 bg-neutral-100 dark:bg-white/5 ${i === index ? "border-neutral-900 dark:border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
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

const GALLERY_INITIAL = 6;

function Gallery({ images }) {
  const [open, setOpen] = useState(null);
  const [broken, setBroken] = useState(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const closeLightbox = useCallback(() => setOpen(null), []);

  const visible = useMemo(() => images.filter((im) => !broken.has(im.src)), [images, broken]);
  const shown = expanded ? visible : visible.slice(0, GALLERY_INITIAL);
  const hidden = visible.length - shown.length;
  if (!visible.length) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((im, i) => (
          <li key={`${im.src}-${i}`} className={i === 0 && visible.length > 2 ? "sm:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={im.caption ? `View: ${im.caption}` : `View image ${i + 1}`}
              className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:border-white ${focus}`}
            >
              <img src={im.src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl" />
              <img
                src={im.src}
                alt={im.caption || `Document ${i + 1}`}
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
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <ul className="space-y-3">
      {items.map((f, i) => {
        const isOpen = openIdx === i;
        return (
          <li key={f.question} className={`${card} overflow-hidden`}>
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
/*  VAULT SIDEBAR (stays on the left)                                  */
/* ------------------------------------------------------------------ */

function VaultNavItem({ item, active, onClick, count, mobile }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex shrink-0 items-center gap-2.5 text-left text-sm transition-colors",
        mobile ? "rounded-full border px-3.5 py-1.5 text-xs font-medium" : "w-full rounded-lg px-3 py-2",
        focus,
        active
          ? mobile
            ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
            : "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
          : mobile
            ? "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
      )}
    >
      <Icon size={mobile ? 13 : 14} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.title}</span>
      {typeof count === "number" && count > 0 && (
        <span className={cn("shrink-0 text-[11px] tabular-nums", active ? "opacity-80" : soft)}>{count}</span>
      )}
    </button>
  );
}

function VaultSidebar({ activeVault, onSelect, counts, mobile = false }) {
  if (mobile) {
    return (
      <nav aria-label="Vault navigation" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ALL_NAV_ITEMS.map((item) => (
          <VaultNavItem key={item.id} item={item} active={activeVault === item.id} onClick={() => onSelect(item.id)} count={counts[item.id]} mobile />
        ))}
      </nav>
    );
  }
  return (
    <nav aria-label="Vault navigation" className="flex flex-col gap-0.5">
      <p className="px-3 pb-2 pt-1 text-sm font-semibold">Library</p>
      {PRIMARY_NAV.map((item) => (
        <VaultNavItem key={item.id} item={item} active={activeVault === item.id} onClick={() => onSelect(item.id)} count={counts[item.id]} />
      ))}
      <div className="my-2 h-px bg-neutral-200 dark:bg-white/10" />
      <p className="px-3 pb-2 pt-1 text-sm font-semibold">Vaults</p>
      {VAULTS.map((vault) => (
        <VaultNavItem key={vault.id} item={vault} active={activeVault === vault.id} onClick={() => onSelect(vault.id)} count={counts[vault.id]} />
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  DOCUMENT CARD                                                      */
/* ------------------------------------------------------------------ */

function DocumentCard({ item, onPreview, onDelete, onEdit, onToggleFeatured, isAdmin }) {
  const isUploaded = item.source === "upload";
  const kind = getFileKind(item);
  const CategoryIcon = getCategoryIcon(item.category);
  const [imgFailed, setImgFailed] = useState(false);
  const entries = getDetailEntries(item);
  const primaryDate = itemDateValue(item);

  const handleDownload = () => {
    if (isUploaded && item.fileUrl) {
      const anchor = document.createElement("a");
      anchor.href = item.fileUrl;
      anchor.download = item.fileName || item.title;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return;
    }
    if (item.link) window.open(item.link, "_blank", "noopener,noreferrer");
  };

  const showImage = kind === "image" && item.fileUrl && !imgFailed;

  return (
    <article className={`group flex h-full min-w-0 flex-col overflow-hidden ${card} ${hoverCard}`}>
      <button
        type="button"
        onClick={() => onPreview(item)}
        aria-label={`Preview ${item.title}`}
        className={`relative flex h-40 items-center justify-center overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/5 ${focus}`}
      >
        {showImage ? (
          <>
            <img src={item.fileUrl} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl" />
            <img src={item.fileUrl} alt={item.title} loading="lazy" onError={() => setImgFailed(true)} className="relative h-full w-full object-contain p-3" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <span className={`h-14 w-14 rounded-2xl ${iconBox}`}>
              {kind === "pdf" ? <FileText size={24} /> : kind === "image" ? <FileImage size={24} /> : <CategoryIcon size={24} />}
            </span>
            <span className={`text-xs font-medium ${soft}`}>{kind === "pdf" ? "PDF document" : item.category}</span>
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100">
          <Eye size={16} />
        </span>
        {item.featured && (
          <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <Star size={14} fill="currentColor" />
          </span>
        )}
        {item.scoreGrade && (
          <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {item.scoreGrade}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-300">
            <CategoryIcon size={12} className="shrink-0" />
            <span className="truncate">{item.category}</span>
          </span>
          {isUploaded && isAdmin && (
            <button
              type="button"
              onClick={() => onToggleFeatured(item)}
              className={cn("rounded-lg p-1.5 transition-colors", focus, item.featured ? "text-neutral-900 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
              title={item.featured ? "Remove featured status" : "Feature document"}
              aria-label={item.featured ? "Unfeature document" : "Feature document"}
            >
              <Star size={16} fill={item.featured ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 break-words font-semibold leading-6">{item.title}</h3>
        {item.organization && <p className={`mt-1 text-xs font-medium ${muted}`}>{item.organization}</p>}
        {item.description && <p className={`mt-2 line-clamp-3 text-sm leading-6 ${muted}`}>{item.description}</p>}

        {getExpiry(item) && <div className="mt-3"><ExpiryBadge item={item} /></div>}

        {entries.length > 0 && (
          <dl className="mt-4 grid grid-cols-2 gap-2">
            {entries.slice(0, 6).map((e) => (
              <div key={e.label} className="min-w-0 rounded-xl bg-neutral-50 p-3 dark:bg-white/5">
                <dt className={`flex items-center gap-1.5 text-[11px] ${soft}`}>
                  <e.icon size={12} /> {e.label}
                </dt>
                <dd className="mt-1 break-words text-xs font-semibold">{e.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.credentialUrl && (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm font-medium transition hover:border-neutral-900 dark:border-white/10 dark:hover:border-white ${focus}`}
          >
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Verify credential</span>
            <ArrowUpRight size={15} className="text-neutral-400" />
          </a>
        )}

        {item.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-white/10 dark:text-neutral-400">
                <Tag size={11} /> {tag}
              </span>
            ))}
            {item.tags.length > 4 && <span className={`px-1 py-1 text-xs ${soft}`}>+{item.tags.length - 4}</span>}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className={`mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${soft}`}>
            {primaryDate && (
              <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {formatDate(primaryDate)}</span>
            )}
            {item.size > 0 && <span>{formatSize(item.size)}</span>}
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={() => onPreview(item)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-3 py-2 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 ${focus}`}
            >
              <Eye size={14} /> View
            </button>
            {(isUploaded || item.link) && (
              <button
                type="button"
                onClick={handleDownload}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 ${focus}`}
              >
                {isUploaded ? <Download size={14} /> : <ExternalLink size={14} />}
                {isUploaded ? "Download" : "Credential"}
              </button>
            )}
            {isUploaded && isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className={`rounded-full border border-neutral-300 p-2 text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-white/15 dark:hover:border-white dark:hover:text-white ${focus}`}
                  aria-label={`Edit ${item.title}`}
                  title="Edit document"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className={`rounded-full border border-neutral-300 p-2 text-neutral-500 transition hover:border-red-400 hover:text-red-600 dark:border-white/15 dark:hover:border-red-900 dark:hover:text-red-400 ${focus}`}
                  aria-label={`Delete ${item.title}`}
                  title="Delete document"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* List-view row */
function DocumentRow({ item, onPreview, onDelete, onEdit, onToggleFeatured, isAdmin }) {
  const kind = getFileKind(item);
  const CategoryIcon = getCategoryIcon(item.category);
  const Icon = kind === "pdf" ? FileText : kind === "image" ? FileImage : CategoryIcon;
  const isUploaded = item.source === "upload";
  const date = itemDateValue(item);
  const ghost = `rounded-full border border-neutral-300 p-2 text-neutral-500 transition dark:border-white/15 ${focus}`;

  return (
    <div className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5 ${hoverCard}`}>
      <span className={`h-12 w-12 rounded-xl ${iconBox}`}><Icon size={20} /></span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="break-words font-semibold">{item.title}</h3>
          <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-600 dark:border-white/10 dark:text-neutral-400">{item.category}</span>
          {item.featured && <Star size={13} fill="currentColor" />}
          <ExpiryBadge item={item} />
        </div>
        <p className={`mt-1 line-clamp-2 text-sm leading-6 ${muted}`}>{item.description || item.organization || "No description added"}</p>
        <p className={`mt-2 flex flex-wrap items-center gap-x-3 text-xs ${soft}`}>
          {item.organization && item.description && <span>{item.organization}</span>}
          <span>{date ? formatDate(date) : "Date not specified"}</span>
          {item.size > 0 && <span>{formatSize(item.size)}</span>}
          {item.scoreGrade && <span>Grade: {item.scoreGrade}</span>}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button type="button" onClick={() => onPreview(item)} className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 ${focus}`}>
          <Eye size={14} /> View
        </button>
        {isUploaded && isAdmin && (
          <>
            <button type="button" onClick={() => onToggleFeatured(item)} className={`${ghost} hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-white dark:hover:text-white`} aria-label="Toggle featured">
              <Star size={15} fill={item.featured ? "currentColor" : "none"} />
            </button>
            <button type="button" onClick={() => onEdit(item)} className={`${ghost} hover:border-neutral-900 hover:text-neutral-900 dark:hover:border-white dark:hover:text-white`} aria-label="Edit document">
              <Pencil size={15} />
            </button>
            <button type="button" onClick={() => onDelete(item)} className={`${ghost} hover:border-red-400 hover:text-red-600 dark:hover:border-red-900 dark:hover:text-red-400`} aria-label="Delete document">
              <Trash2 size={15} />
            </button>
          </>
        )}
        {!isUploaded && item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${ghost} hover:border-neutral-900 dark:hover:border-white`} aria-label="Open credential">
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN DIALOG                                                       */
/* ------------------------------------------------------------------ */

function LoginDialog({ onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(AUTH_LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setAdminSession(data.token);
        onSuccess();
      } else {
        setError(data.message || "Incorrect password. Please try again.");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Unable to connect to the server. Please check your connection and try again.");
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="login-title" className="w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-neutral-900 sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`h-11 w-11 rounded-xl ${iconBox}`}><Lock size={19} /></span>
            <div>
              <h2 id="login-title" className="text-lg font-semibold">Admin access</h2>
              <p className={`mt-0.5 text-xs ${soft}`}>Required to upload, edit, delete or feature documents.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={`rounded-lg p-2 ${soft} transition hover:bg-neutral-100 dark:hover:bg-white/10 ${focus}`} aria-label="Close login">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium">Password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                ref={inputRef}
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                className={`${inputClassName} !rounded-2xl !py-3 pl-11 pr-11`}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <ShieldAlert size={15} /> {error}
            </p>
          )}

          <p className={`flex items-start gap-2 rounded-xl bg-neutral-50 p-3 text-xs leading-5 dark:bg-white/5 ${soft}`}>
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            Password is verified by the backend. The session expires after 4 hours.
          </p>

          <button
            type="submit"
            disabled={submitting || !password}
            className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 ${focus}`}
          >
            {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Lock size={16} />}
            {submitting ? "Verifying..." : "Unlock admin access"}
          </button>
        </form>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  UPLOAD / EDIT DIALOG (one wizard for both)                         */
/* ------------------------------------------------------------------ */

function FormField({ label, required = false, hint = "", children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className={`mt-1.5 text-xs ${soft}`}>{hint}</p>}
    </div>
  );
}

const DATE_FIELDS = [
  ["issueDate", "Issue date", "date"],
  ["date", "General date", "date"],
  ["startDate", "Start date", "date"],
  ["endDate", "End date", "date"],
  ["expiryDate", "Expiry date", "date"],
  ["duration", "Duration", "text", "e.g. 3 months, 6 weeks"],
];

const CRED_FIELDS = [
  ["certificateNumber", "Certificate number / Credential ID", "text", "e.g. CISCO-2024-XX12345"],
  ["scoreGrade", "Score / Grade", "text", "e.g. A+, 92%, Distinction"],
  ["credentialUrl", "Credential URL", "url", "https://verify.example.com/credential/123"],
  ["rolePosition", "Role / Position", "text", "e.g. Frontend Developer Intern"],
  ["teamSize", "Team size", "text", "e.g. 5 members"],
  ["mentorInstructor", "Mentor / Instructor", "text", "e.g. Dr. Rajesh Kumar"],
];

function FieldGrid({ fields, form, update }) {
  const relevant = CATEGORY_FIELDS[form.category] || [];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type, placeholder]) => (
        <FormField key={key} label={label} hint={relevant.includes(key) ? "Recommended for this category" : ""}>
          <input type={type} value={form[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className={inputClassName} />
        </FormField>
      ))}
    </div>
  );
}

function StepHeading({ title, text }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className={`mt-1 text-xs ${soft}`}>{text}</p>
    </div>
  );
}

function FormDialog({ mode, item, onClose, onSave, saving, error, initialCategory }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() =>
    isEdit ? formFromItem(item) : { ...EMPTY_FORM, category: initialCategory || "Certificate" }
  );
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [localError, setLocalError] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const sections = [
    ...(isEdit ? [] : [{ id: "file", label: "File", icon: CloudUpload }]),
    { id: "basic", label: "Basic info", icon: FileText },
    { id: "dates", label: "Dates", icon: CalendarDays },
    { id: "credentials", label: "Credentials", icon: ShieldCheck },
    { id: "additional", label: "Additional", icon: Briefcase },
  ];
  const current = sections[active].id;
  const isLast = active === sections.length - 1;
  const basicIndex = sections.findIndex((s) => s.id === "basic");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    setFileError("");
    setFile(selected || null);
    if (!selected) return;
    const extension = selected.name.split(".").pop()?.toLowerCase();
    const allowedExtension = ["pdf", "jpg", "jpeg", "png", "webp"].includes(extension);
    if (!ACCEPTED_TYPES.includes(selected.type) && !allowedExtension) {
      setFileError("Choose a PDF, JPG, JPEG, PNG or WebP file.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("File size must be 25 MB or less.");
      setFile(null);
      return;
    }
    if (!form.title.trim()) update("title", selected.name.replace(/\.[^.]+$/, ""));
  }

  async function submit(event) {
    event.preventDefault();
    if (!isLast) {
      setActive((s) => s + 1);
      return;
    }
    setLocalError("");
    if (!isEdit && !file) {
      setFileError("Please select a document first.");
      setActive(0);
      return;
    }
    if (!form.title.trim()) {
      setLocalError("Document title is required.");
      setActive(basicIndex);
      return;
    }
    const clean = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      organization: form.organization.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    await onSave(isEdit ? clean : { ...clean, file, fileName: file.name, mimeType: file.type || "", size: file.size });
  }

  const shownError = localError || fileError || error;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="form-dialog-title" className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-neutral-200 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900 sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 p-5 dark:border-white/10 sm:p-6">
          <div className="flex items-center gap-3">
            <span className={`h-11 w-11 rounded-xl ${iconBox}`}>{isEdit ? <Pencil size={19} /> : <CloudUpload size={19} />}</span>
            <div>
              <h2 id="form-dialog-title" className="text-lg font-semibold">{isEdit ? "Edit document" : "Upload document"}</h2>
              <p className={`mt-0.5 text-xs ${soft}`}>
                {isEdit ? "Update details. Changes are saved to Supabase." : "PDF or image, up to 25 MB. Saved securely to Supabase."}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className={`rounded-lg p-2 ${soft} transition hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-white/10 ${focus}`} aria-label="Close form">
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-neutral-200 bg-neutral-50 p-2 dark:border-white/10 dark:bg-white/[0.02] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                focus,
                active === idx
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
              )}
            >
              <s.icon size={14} />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />

            {current === "file" && (
              <div className="space-y-5">
                <StepHeading title="Choose a file to upload" text="Select a PDF document or an image from your device." />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center transition hover:border-neutral-900 dark:border-white/20 dark:bg-white/[0.02] dark:hover:border-white ${focus}`}
                >
                  <span className={`h-14 w-14 rounded-2xl ${iconBox}`}>
                    {file && getFileKind(file) === "image" ? <ImageIcon size={24} /> : file && getFileKind(file) === "pdf" ? <FileText size={24} /> : <Upload size={24} />}
                  </span>
                  <span className="mt-3 break-all text-sm font-medium">{file ? file.name : "Click to choose a file"}</span>
                  <span className={`mt-1 text-xs ${soft}`}>{file ? `${formatSize(file.size)} · Click to change` : "PDF, JPG, JPEG, PNG or WebP"}</span>
                </button>
                <ul className={`space-y-1.5 rounded-xl bg-neutral-50 p-4 text-xs dark:bg-white/5 ${muted}`}>
                  {["File types: PDF, JPG, JPEG, PNG, WebP", "Maximum file size: 25 MB", "Files are stored in Supabase Storage"].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Check size={12} className="mt-0.5 shrink-0 text-emerald-500" /> {t}</li>
                  ))}
                </ul>
              </div>
            )}

            {current === "basic" && (
              <div className="space-y-5">
                <StepHeading title="Basic information" text="Title and category are required." />
                <FormField label="Document title" required>
                  <input type="text" maxLength={150} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Cisco Networking Essentials Certificate" className={inputClassName} />
                </FormField>
                <FormField label="Category" required>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} className={cn(inputClassName, "cursor-pointer")}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Issuing organization / platform">
                  <input type="text" maxLength={150} value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="e.g. Cisco, LeetCode, college" className={inputClassName} />
                </FormField>
                <FormField label="Description" hint="Brief summary of what this document is about.">
                  <textarea rows={3} maxLength={1000} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Add details about the certificate, project or assignment..." className={cn(inputClassName, "resize-y leading-6")} />
                </FormField>
                <FormField label="Tags" hint="Separate tags with commas.">
                  <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="Python, Networking, College" className={inputClassName} />
                </FormField>
              </div>
            )}

            {current === "dates" && (
              <div className="space-y-5">
                <StepHeading title="Dates" text="Fill in the dates that apply to this document." />
                <FieldGrid fields={DATE_FIELDS} form={form} update={update} />
              </div>
            )}

            {current === "credentials" && (
              <div className="space-y-5">
                <StepHeading title="Credential details" text="Identification and verification details." />
                <FieldGrid fields={CRED_FIELDS} form={form} update={update} />
              </div>
            )}

            {current === "additional" && (
              <div className="space-y-5">
                <StepHeading title="Additional information" text="Location, mode and featured status." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Location">
                    <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Bangalore, India" className={inputClassName} />
                  </FormField>
                  <FormField label="Mode">
                    <select value={form.mode} onChange={(e) => update("mode", e.target.value)} className={cn(inputClassName, "cursor-pointer")}>
                      <option value="">Select mode (optional)</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline (in-person)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </FormField>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-900 dark:border-white/10 dark:hover:border-white">
                  <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-neutral-900 dark:accent-white" />
                  <span>
                    <span className="block text-sm font-medium">Mark as featured</span>
                    <span className={`mt-0.5 block text-xs ${soft}`}>Featured documents get a star and appear under Starred and in the spotlight.</span>
                  </span>
                </label>

                <dl className="grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-4 text-xs dark:bg-white/5">
                  <div><dt className={soft}>Title</dt><dd className="mt-1 font-semibold">{form.title || "—"}</dd></div>
                  <div><dt className={soft}>Category</dt><dd className="mt-1 font-semibold">{form.category}</dd></div>
                  <div><dt className={soft}>Organization</dt><dd className="mt-1 font-semibold">{form.organization || "—"}</dd></div>
                  <div><dt className={soft}>File</dt><dd className="mt-1 break-all font-semibold">{isEdit ? item.fileName || "—" : file ? file.name : "—"}</dd></div>
                </dl>
              </div>
            )}

            {shownError && (
              <p role="alert" className="mt-5 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <ShieldAlert size={15} /> {shownError}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-neutral-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <Btn variant="secondary" disabled={active === 0 || saving} onClick={() => setActive((s) => Math.max(0, s - 1))}>
              <ChevronRight size={16} className="rotate-180" /> Previous
            </Btn>
            <p className={`text-center text-xs ${soft}`}>
              Step {active + 1} of {sections.length} · <span className="font-medium text-neutral-900 dark:text-white">{sections[active].label}</span>
            </p>
            {isLast ? (
              <button
                type="submit"
                disabled={saving || (!isEdit && !file)}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
              >
                {saving ? <LoaderCircle size={16} className="animate-spin" /> : isEdit ? <Check size={16} /> : <Upload size={16} />}
                {saving ? (isEdit ? "Saving..." : "Uploading...") : isEdit ? "Save changes" : "Upload to Supabase"}
              </button>
            ) : (
              <Btn disabled={saving} onClick={() => setActive((s) => s + 1)}>
                Next <ChevronRight size={16} />
              </Btn>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PREVIEW DIALOG (file on the left, full details on the right)       */
/* ------------------------------------------------------------------ */

function PreviewDialog({ item, onClose, onNext, onPrevious, canNavigate }) {
  const previewUrl = item.fileUrl || item.link || "";
  const kind = getFileKind(item);
  const entries = getDetailEntries(item);
  const date = itemDateValue(item);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && canNavigate) onNext();
      if (event.key === "ArrowLeft" && canNavigate) onPrevious();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrevious, canNavigate]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, []);

  const navBtn = "absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 p-2.5 transition hover:bg-white/15";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white backdrop-blur-md" role="dialog" aria-modal="true" aria-label={item.title}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-900">
            {kind === "pdf" ? <FileText size={18} /> : kind === "image" ? <FileImage size={18} /> : <File size={18} />}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{item.title}</h2>
            <p className="mt-0.5 truncate text-xs text-neutral-400">
              {item.category}{item.fileName ? ` · ${item.fileName}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {previewUrl && (
            <a href={previewUrl} download={item.fileName || item.title} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:bg-white/10">
              <Download size={15} /> <span className="hidden sm:inline">Download</span>
            </a>
          )}
          {item.link && item.source !== "upload" && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 p-2 transition hover:bg-white/10" aria-label="Open credential link">
              <ExternalLink size={16} />
            </a>
          )}
          <button type="button" onClick={onClose} className="rounded-full p-2 text-neutral-300 transition hover:bg-white/10" aria-label="Close preview">
            <XIcon size={20} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
          {canNavigate && (
            <>
              <button type="button" onClick={onPrevious} className={`${navBtn} left-2 sm:left-5`} aria-label="Previous document"><ArrowLeft size={20} /></button>
              <button type="button" onClick={onNext} className={`${navBtn} right-2 sm:right-5`} aria-label="Next document"><ArrowRight size={20} /></button>
            </>
          )}
          {previewUrl && kind === "pdf" ? (
            <iframe src={previewUrl} title={item.title} className="h-full min-h-[65vh] w-full max-w-5xl rounded-lg bg-white" />
          ) : previewUrl && kind === "image" ? (
            <img src={previewUrl} alt={item.title} className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="max-w-lg px-8 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-neutral-900"><FileText size={36} /></span>
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">
                {item.description || "A file preview is not available for this item. If a credential link is provided, open it to view the original."}
              </p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900">
                  Open credential <ExternalLink size={15} />
                </a>
              )}
            </div>
          )}
        </div>

        <aside className="max-h-[38vh] shrink-0 overflow-y-auto border-t border-white/10 p-5 lg:max-h-none lg:w-80 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-xs font-medium">{item.category}</span>
            {item.featured && <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-900"><Star size={11} fill="currentColor" /> Featured</span>}
            <ExpiryBadge item={item} />
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-snug">{item.title}</h3>
          {item.organization && <p className="mt-1 text-sm text-neutral-400">{item.organization}</p>}
          {item.description && <p className="mt-4 text-sm leading-7 text-neutral-300">{item.description}</p>}

          <dl className="mt-5 grid grid-cols-2 gap-2.5">
            {date && (
              <div className="col-span-2 rounded-xl bg-white/5 p-3.5">
                <dt className="flex items-center gap-1.5 text-xs text-neutral-400"><CalendarDays size={13} /> Date</dt>
                <dd className="mt-1.5 text-sm font-semibold">{formatDate(date)}</dd>
              </div>
            )}
            {entries.map((e) => (
              <div key={e.label} className="min-w-0 rounded-xl bg-white/5 p-3.5">
                <dt className="flex items-center gap-1.5 text-xs text-neutral-400"><e.icon size={13} /> {e.label}</dt>
                <dd className="mt-1.5 break-words text-sm font-semibold">{e.value}</dd>
              </div>
            ))}
            {item.size > 0 && (
              <div className="rounded-xl bg-white/5 p-3.5">
                <dt className="flex items-center gap-1.5 text-xs text-neutral-400"><File size={13} /> File size</dt>
                <dd className="mt-1.5 text-sm font-semibold">{formatSize(item.size)}</dd>
              </div>
            )}
          </dl>

          {item.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs text-neutral-300"><Tag size={11} /> {t}</span>
              ))}
            </div>
          )}

          {item.credentialUrl && (
            <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium transition hover:bg-white/10">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} /> Verify credential</span>
              <ArrowUpRight size={15} className="text-neutral-400" />
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const FIELD_KEYS = [
  "title", "category", "description", "organization", "date",
  "certificateNumber", "issueDate", "startDate", "endDate", "expiryDate", "credentialUrl",
  "scoreGrade", "duration", "location", "mode", "mentorInstructor", "teamSize", "rolePosition",
];

export default function Achievements() {
  const [documents, setDocuments] = useState([]);
  const [activeVault, setActiveVault] = useState("certificates");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pageError, setPageError] = useState("");
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => !!getAdminSession());

  const toastTimer = useRef(null);
  const isInteractingRef = useRef(false);
  const previewItemRef = useRef(null);
  const uploadOpenRef = useRef(false);
  const loginOpenRef = useRef(false);
  const editTargetRef = useRef(null);

  useEffect(() => { previewItemRef.current = previewItem; }, [previewItem]);
  useEffect(() => { uploadOpenRef.current = uploadOpen; }, [uploadOpen]);
  useEffect(() => { loginOpenRef.current = loginOpen; }, [loginOpen]);
  useEffect(() => { editTargetRef.current = editTarget; }, [editTarget]);

  /* ---------- Fetch documents ---------- */
  const fetchDocuments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await fetch(VAULT_DOCUMENTS_ENDPOINT);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) setDocuments(data.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      if (!silent) setPageError("Could not load documents from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Vaults & Achievements — Suraj Kumar";
    fetchDocuments();
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [fetchDocuments]);

  /* ---------- Auto-polling every 5s (+ on focus / tab visible) ---------- */
  useEffect(() => {
    const poll = async () => {
      if (isInteractingRef.current) return;
      if (previewItemRef.current || uploadOpenRef.current || loginOpenRef.current || editTargetRef.current) return;
      try {
        const response = await fetch(VAULT_DOCUMENTS_ENDPOINT);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setDocuments((prev) => (documentsEqual(prev, data.data) ? prev : data.data));
        }
      } catch (err) {
        console.warn("Polling fetch failed:", err.message);
      }
    };
    const intervalId = setInterval(poll, 5000);
    const onVisible = () => document.visibilityState === "visible" && poll();
    window.addEventListener("focus", poll);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3000);
  }, []);

  /* ---------- Derived data ---------- */
  const achievementItems = useMemo(
    () =>
      (Array.isArray(achievements) ? achievements : []).map((item, index) => ({
        ...item,
        id: `achievement-${item.id ?? index}`,
        source: "achievement",
        category: inferAchievementCategory(item),
        title: item.title || "Achievement",
        organization: item.organization || "",
        description: item.description || "",
        date: item.date || "",
        link: item.link || "",
        tags: [],
        featured: false,
        size: 0,
        createdAt: 0,
      })),
    []
  );

  const skillItems = useMemo(
    () => (Array.isArray(growthAreas) ? growthAreas : []).map((skill) => String(skill)),
    []
  );

  const activeVaultData = ALL_NAV_ITEMS.find((v) => v.id === activeVault) || ALL_NAV_ITEMS[0];

  const counts = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const c = {
      all: documents.length + achievementItems.length,
      recent: documents.filter((d) => (d.createdAt || 0) >= weekAgo).length,
      starred: documents.filter((d) => d.featured).length,
    };
    VAULTS.forEach((v) => {
      const inVault = documents.filter((d) => v.categories.includes(d.category)).length;
      c[v.id] = v.kind === "skills" ? skillItems.length : v.kind === "achievements" ? achievementItems.length + inVault : inVault;
    });
    return c;
  }, [documents, achievementItems, skillItems]);

  const vaultItems = useMemo(() => {
    if (activeVault === "skills") return [];
    if (activeVault === "achievements") return [...achievementItems, ...documents.filter((i) => i.category === "Achievement")];
    if (activeVault === "all") return [...documents, ...achievementItems];
    if (activeVault === "recent") {
      const weekAgo = Date.now() - 7 * 86400000;
      return documents.filter((i) => (i.createdAt || 0) >= weekAgo);
    }
    if (activeVault === "starred") return documents.filter((i) => i.featured);
    return documents.filter((i) => activeVaultData.categories?.includes(i.category));
  }, [activeVault, activeVaultData, documents, achievementItems]);

  const years = useMemo(
    () => [...new Set(vaultItems.map((i) => getYear(itemDateValue(i))).filter(Boolean))].sort((a, b) => Number(b) - Number(a)),
    [vaultItems]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vaultItems
      .filter((item) => {
        const matchesYear = yearFilter === "All" || getYear(itemDateValue(item)) === yearFilter;
        const matchesFeatured = !featuredOnly || item.featured;
        const searchable = [item.title, item.description, item.organization, item.category, item.certificateNumber, ...(item.tags || [])]
          .join(" ")
          .toLowerCase();
        return matchesYear && matchesFeatured && (!query || searchable.includes(query));
      })
      .sort((a, b) => {
        if (sortOrder === "title") return a.title.localeCompare(b.title);
        if (sortOrder === "category") return a.category.localeCompare(b.category);
        if (sortOrder === "oldest") return itemTime(a) - itemTime(b);
        return itemTime(b) - itemTime(a);
      });
  }, [vaultItems, search, yearFilter, featuredOnly, sortOrder]);

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skillItems.filter((s) => !q || s.toLowerCase().includes(q));
  }, [skillItems, search]);

  const insights = useMemo(() => {
    const all = [...documents, ...achievementItems];
    const byCategory = CATEGORIES.map((category) => ({ category, count: all.filter((i) => i.category === category).length })).filter((x) => x.count > 0);
    const countBy = (list) => {
      const map = new Map();
      list.forEach((v) => v && map.set(v, (map.get(v) || 0) + 1));
      return [...map].sort((a, b) => b[1] - a[1]);
    };
    const issuers = countBy(all.map((i) => (i.organization || "").trim())).slice(0, 8);
    const tags = countBy(documents.flatMap((i) => i.tags || [])).slice(0, 14);
    const yearList = [...new Set(all.map((i) => getYear(itemDateValue(i))).filter(Boolean))].sort();
    const pdfs = documents.filter((d) => getFileKind(d) === "pdf").length;
    const images = documents.filter((d) => getFileKind(d) === "image").length;
    const safeSize = (d) => {
      const s = typeof d?.size === "number" ? d.size : Number(d?.size);
      return Number.isFinite(s) && s > 0 ? s : 0;
    };
    const storage = documents.reduce((sum, d) => sum + safeSize(d), 0);
    const largest = documents.reduce((best, d) => (safeSize(d) > safeSize(best) ? d : best), null);
    const latestUpload = documents.reduce((max, d) => Math.max(max, d.createdAt || 0), 0);
    const expiring = all
      .map((item) => ({ item, expiry: getExpiry(item) }))
      .filter((x) => x.expiry)
      .sort((a, b) => a.expiry.days - b.expiry.days);
    const timeline = all.filter((i) => itemTime(i) > 0).sort((a, b) => itemTime(b) - itemTime(a)).slice(0, 8);
    return {
      all,
      total: all.length,
      byCategory,
      issuers,
      tags,
      years: yearList,
      pdfs,
      images,
      storage,
      largest,
      latestUpload,
      expiring,
      timeline,
      featured: documents.filter((d) => d.featured).length,
      certificates: all.filter((i) => i.category === "Certificate").length,
      projects: all.filter((i) => i.category === "Project").length,
      achievements: all.filter((i) => i.category === "Achievement").length,
      internships: all.filter((i) => i.category === "Internship").length,
      assignments: all.filter((i) => i.category === "Assignment").length,
    };
  }, [documents, achievementItems]);

  const imageDocs = useMemo(() => documents.filter((d) => getFileKind(d) === "image" && d.fileUrl), [documents]);
  const galleryImages = useMemo(() => imageDocs.map((d) => ({ src: d.fileUrl, caption: d.title })), [imageDocs]);
  const spotlight = useMemo(() => {
    const featured = imageDocs.filter((d) => d.featured);
    return (featured.length ? featured : imageDocs.slice(0, 5)).slice(0, 8).map((d) => ({ src: d.fileUrl, caption: d.title }));
  }, [imageDocs]);

  const sections = useMemo(
    () =>
      [
        { id: "overview", label: "Overview", icon: Lightbulb, show: true },
        { id: "spotlight", label: "Spotlight", icon: Sparkles, show: spotlight.length > 0 },
        { id: "vault", label: "Vaults", icon: Folder, show: true },
        { id: "gallery", label: "Gallery", icon: ImageIcon, show: galleryImages.length > 0 },
        { id: "breakdown", label: "Breakdown", icon: Layers, show: insights.total > 0 },
        { id: "credentials", label: "Credential health", icon: ShieldCheck, show: insights.expiring.length > 0 },
        { id: "timeline", label: "Timeline", icon: Calendar, show: insights.timeline.length > 0 },
        { id: "issuers", label: "Issuers & tags", icon: Briefcase, show: insights.issuers.length > 0 || insights.tags.length > 0 },
        { id: "skills", label: "Skills", icon: Wrench, show: skillItems.length > 0 },
        { id: "faq", label: "FAQ", icon: HelpCircle, show: true },
        { id: "connect", label: "Connect", icon: Mail, show: true },
      ].filter((s) => s.show),
    [spotlight.length, galleryImages.length, insights, skillItems.length]
  );

  const activeSection = useScrollSpy(sections.map((s) => s.id));

  /* ---------- Admin actions ---------- */
  function handleLoginSuccess() {
    setIsAdmin(true);
    setLoginOpen(false);
    notify("Admin access unlocked. You can upload, edit and delete documents.");
  }

  function handleLogout() {
    clearAdminSession();
    setIsAdmin(false);
    setUploadOpen(false);
    setEditTarget(null);
    setDeleteTarget(null);
    notify("Logged out. Visitors can still browse and download.");
  }

  async function handleSaveDocument(data) {
    if (!isAdmin) return;
    isInteractingRef.current = true;
    setSaving(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      FIELD_KEYS.forEach((key) => formData.append(key, data[key] || ""));
      formData.append("tags", (data.tags || []).join(","));
      formData.append("featured", String(data.featured || false));

      const response = await fetch(VAULT_DOCUMENTS_ENDPOINT, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setUploadOpen(false);
        await fetchDocuments(true);
        setSearch("");
        setYearFilter("All");
        setFeaturedOnly(false);
        const matchingVault = VAULTS.find((v) => v.kind === "documents" && v.categories?.includes(data.category));
        if (matchingVault) setActiveVault(matchingVault.id);
        notify("Document uploaded successfully.");
      } else {
        setUploadError(result.message || "Failed to upload document.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Unable to connect to server. Please try again.");
    } finally {
      setSaving(false);
      isInteractingRef.current = false;
    }
  }

  async function handleDeleteDocument() {
    if (!isAdmin || !deleteTarget || deleteTarget.source !== "upload") return;
    isInteractingRef.current = true;
    try {
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        setDocuments((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        if (previewItem?.id === deleteTarget.id) setPreviewItem(null);
        notify(result.message || "Document deleted.");
      } else {
        setPageError(result.message || "Could not delete document.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setPageError("Could not delete document. Please try again.");
    } finally {
      setDeleteTarget(null);
      isInteractingRef.current = false;
    }
  }

  async function handleEditDocument(data) {
    if (!isAdmin || !editTarget) return;
    isInteractingRef.current = true;
    setEditSaving(true);
    setEditError("");
    try {
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${editTarget.id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        setEditTarget(null);
        await fetchDocuments(true);
        notify("Document updated successfully.");
      } else {
        setEditError(result.message || "Failed to update document.");
      }
    } catch (err) {
      console.error("Edit failed:", err);
      setEditError("Unable to connect to server. Please try again.");
    } finally {
      setEditSaving(false);
      isInteractingRef.current = false;
    }
  }

  async function handleToggleFeatured(item) {
    if (!isAdmin || item.source !== "upload") return;
    const next = !item.featured;
    const setFeatured = (value) =>
      setDocuments((prev) => prev.map((d) => (d.id === item.id ? { ...d, featured: value } : d)));
    setFeatured(next);
    try {
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${item.id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ featured: next }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setFeatured(item.featured);
        setPageError("Could not update the featured status.");
      }
    } catch (err) {
      console.error("Toggle featured failed:", err);
      setFeatured(item.featured);
      setPageError("Could not update the featured status.");
    }
  }

  function handleManualRefresh() {
    notify("Refreshing vault...");
    fetchDocuments(true);
  }

  const scrollToVault = () => document.getElementById("vault")?.scrollIntoView({ behavior: "smooth" });

  function selectVault(id, scroll = false) {
    setActiveVault(id);
    setSearch("");
    setYearFilter("All");
    setFeaturedOnly(false);
    setPageError("");
    if (scroll) scrollToVault();
  }

  function openUpload() {
    setUploadError("");
    setUploadOpen(true);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Vaults & Achievements — Suraj Kumar", url: window.location.href });
      } catch {
        /* cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  const previewIndex = filteredItems.findIndex((item) => item.id === previewItem?.id);
  const navigatePreview = useCallback(
    (direction) => {
      if (!filteredItems.length || previewIndex < 0) return;
      setPreviewItem(filteredItems[(previewIndex + direction + filteredItems.length) % filteredItems.length]);
    },
    [filteredItems, previewIndex]
  );
  const closePreview = useCallback(() => setPreviewItem(null), []);

  const hasFilters = search || yearFilter !== "All" || featuredOnly;
  const maxCategory = Math.max(1, ...insights.byCategory.map((c) => c.count));
  const maxIssuer = Math.max(1, ...insights.issuers.map((i) => i[1]));
  const yearRange =
    insights.years.length > 1 ? `${insights.years[0]} – ${insights.years[insights.years.length - 1]}` : insights.years[0] || "";

  const metrics = [
    { icon: Folder, label: "Total records", value: insights.total, description: "Saved documents and achievements" },
    { icon: Award, label: "Certificates", value: insights.certificates, description: "Credentials and completed courses" },
    { icon: Code2, label: "Projects", value: insights.projects, description: "Project records and reports" },
    { icon: Trophy, label: "Achievements", value: insights.achievements, description: "Milestones and accomplishments" },
    { icon: Briefcase, label: "Internships", value: insights.internships, description: "Work experience and offer letters" },
    { icon: BookOpen, label: "Assignments", value: insights.assignments, description: "College coursework and submissions" },
    { icon: Star, label: "Featured", value: insights.featured, description: "Starred documents shown in the spotlight" },
    { icon: Cloud, label: "Storage used", value: formatSize(insights.storage), description: `${documents.length} files in cloud storage` },
  ];

  const briefRows = [
    { icon: Folder, label: "Records", value: insights.total },
    { icon: Award, label: "Certificates", value: insights.certificates },
    { icon: Code2, label: "Projects", value: insights.projects },
    { icon: Trophy, label: "Achievements", value: insights.achievements },
    { icon: Briefcase, label: "Internships", value: insights.internships },
    { icon: BookOpen, label: "Assignments", value: insights.assignments },
    { icon: Star, label: "Featured", value: insights.featured },
    { icon: Cloud, label: "Storage", value: formatSize(insights.storage) },
    { icon: FileText, label: "PDF files", value: insights.pdfs },
    { icon: ImageIcon, label: "Images", value: insights.images },
    { icon: Briefcase, label: "Issuers", value: insights.issuers.length || "" },
    { icon: Calendar, label: "Years covered", value: yearRange },
    { icon: Clock, label: "Last upload", value: insights.latestUpload ? formatDate(insights.latestUpload) : "" },
    { icon: isAdmin ? ShieldCheck : Lock, label: "Access", value: isAdmin ? "Admin" : "Visitor" },
  ].filter((r) => r.value !== "" && r.value !== 0 && r.value != null);

  const featuredRatio = documents.length ? (insights.featured / documents.length) * 100 : 0;

  const cardProps = {
    onPreview: setPreviewItem,
    onDelete: setDeleteTarget,
    onEdit: (item) => { setEditError(""); setEditTarget(item); },
    onToggleFeatured: handleToggleFeatured,
    isAdmin,
  };

  const uploadButton = isAdmin ? (
    <Btn onClick={openUpload}><Upload size={16} /> Upload</Btn>
  ) : (
    <Btn variant="secondary" onClick={() => setLoginOpen(true)}><Lock size={16} /> Login to upload</Btn>
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <ReadingProgress />
      <BackToTop />

      {/* ============ HERO ============ */}
      <section id="overview" className="scroll-mt-28 border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <nav aria-label="Breadcrumb" className={`mb-8 flex flex-wrap items-center gap-1.5 text-sm ${soft} print:hidden`}>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"><Home size={14} /> Home</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Vaults</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                  <Sparkles size={12} /> Personal knowledge hub
                </span>
                {yearRange && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium dark:border-white/10 dark:bg-white/5">
                    <Calendar size={12} /> {yearRange}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-white/10 dark:text-neutral-300">
                  <Cloud size={12} /> Live cloud sync
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                My vaults.<br />My progress.
              </h1>
              <p className={`mt-5 max-w-xl text-lg leading-8 ${muted}`}>
                Certificates, skills, projects, college assignments and achievements — organized in one clean workspace.
              </p>

              {insights.byCategory.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {insights.byCategory.map(({ category, count }) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <li key={category} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                        <span className={`h-5 w-5 rounded-full ${iconBox}`}><Icon size={11} /></span>
                        {category} · {count}
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                <Btn onClick={scrollToVault}><Folder size={16} /> Browse vaults</Btn>
                <Btn variant="secondary" onClick={handleManualRefresh} disabled={refreshing} title="Refresh vault">
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing..." : "Refresh"}
                </Btn>
                {isAdmin ? (
                  <>
                    <Btn variant="secondary" onClick={openUpload}><Plus size={16} /> Add document</Btn>
                    <Btn variant="danger" onClick={handleLogout} title="End admin session"><LogOut size={16} /> Logout</Btn>
                  </>
                ) : (
                  <Btn variant="secondary" onClick={() => setLoginOpen(true)}><Lock size={16} /> Admin login</Btn>
                )}
                <Btn variant="secondary" onClick={handleShare}>
                  {copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? "Link copied" : "Share"}
                </Btn>
                <Btn variant="secondary" onClick={() => window.print()}><Printer size={16} /> Print</Btn>
              </div>
            </div>

            {/* Brief card */}
            <div className={`${card} h-fit p-6 sm:p-7`}>
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-10 w-10 rounded-xl ${iconBox}`}><Layers size={19} /></span>
                <div>
                  <h2 className="font-semibold leading-tight">Vault brief</h2>
                  <p className={`text-xs ${soft}`}>At a glance</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {briefRows.map((b) => (
                  <div key={b.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                    <dt className={`flex items-center gap-1.5 text-xs ${soft}`}><b.icon size={13} /> {b.label}</dt>
                    <dd className="mt-1.5 break-words text-sm font-semibold">{b.value}</dd>
                  </div>
                ))}
              </dl>

              {documents.length > 0 && (
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className={soft}>Featured documents</span>
                    <span className="font-semibold">{Math.round(featuredRatio)}%</span>
                  </div>
                  <ProgressBar value={featuredRatio} label="Featured documents" />
                </div>
              )}

              {insights.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {insights.tags.slice(0, 8).map(([t]) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-white/10 dark:text-neutral-400">
                      <Tag size={11} /> {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 grid gap-2 border-t border-neutral-200 pt-5 dark:border-white/10 print:hidden">
                {[VAULTS[0], VAULTS[2], VAULTS[5], VAULTS[4]].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectVault(v.id, true)}
                    className={`flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm font-medium transition hover:border-neutral-900 dark:border-white/10 dark:hover:border-white ${focus}`}
                  >
                    <span className="inline-flex items-center gap-2"><v.icon size={15} /> {v.title}</span>
                    <span className={`inline-flex items-center gap-2 text-xs ${soft}`}>{counts[v.id]} <ArrowUpRight size={15} /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPOTLIGHT ============ */}
      {spotlight.length > 0 && (
        <section id="spotlight" className="scroll-mt-28 border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
            <PreviewShowcase slides={spotlight} />
          </div>
        </section>
      )}

      {/* ============ METRICS ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {metrics.map((m) => (
              <div key={m.label} className={`${card} p-5 sm:p-6`}>
                <m.icon size={18} className={soft} />
                <dd className="mt-3 text-3xl font-semibold tracking-tight">{m.value}</dd>
                <dt className="mt-2 text-sm font-medium">{m.label}</dt>
                <p className={`mt-1 text-xs leading-5 ${soft}`}>{m.description}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Mobile section nav */}
      <nav aria-label="Sections" className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden print:hidden">
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                  activeSection === s.id
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
          <div className="grid gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
            {/* ----- LEFT SIDEBAR: vaults ----- */}
            <aside className="hidden lg:block print:hidden">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-5 overflow-y-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className={`${card} p-3`}>
                  <VaultSidebar activeVault={activeVault} onSelect={(id) => selectVault(id, true)} counts={counts} />
                  <div className="mt-3 border-t border-neutral-200 px-3 pt-3 dark:border-white/10">
                    <p className={`flex items-center gap-2 text-xs ${soft}`}><ShieldCheck size={14} /> Cloud storage</p>
                    <p className={`mt-1.5 text-xs ${soft}`}>{documents.length} files · {formatSize(insights.storage)}</p>
                    <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${isAdmin ? TONES.green : "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {isAdmin ? "Admin" : "Visitor"}
                    </p>
                  </div>
                </div>

                <nav aria-label="On this page" className={`${card} p-3`}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            activeSection === s.id
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
              </div>
            </aside>

            {/* ----- ARTICLE ----- */}
            <div className="min-w-0 space-y-20">
              {/* VAULT */}
              <Block id="vault" icon={activeVaultData.icon} title={activeVaultData.title} count={activeVault === "skills" ? skillItems.length : filteredItems.length}
                action={
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <button type="button" onClick={handleManualRefresh} disabled={refreshing} className={`flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 transition hover:bg-neutral-100 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5 ${focus}`} title="Refresh vault" aria-label="Refresh">
                      <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    </button>
                    {uploadButton}
                  </div>
                }
              >
                <div className="mb-5 lg:hidden">
                  <VaultSidebar mobile activeVault={activeVault} onSelect={selectVault} counts={counts} />
                </div>

                <p className={`mb-5 text-sm ${soft}`}>Workspace / {activeVaultData.title}</p>

                <dl className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: Folder, label: "Items", value: activeVault === "skills" ? skillItems.length : vaultItems.length },
                    { icon: Star, label: "Featured", value: vaultItems.filter((i) => i.featured).length },
                    { icon: Cloud, label: "Storage", value: formatSize(vaultItems.reduce((sum, i) => sum + (Number.isFinite(i.size) && i.size > 0 ? i.size : 0), 0)) },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl bg-neutral-100 p-3.5 dark:bg-white/5">
                      <dt className={`flex items-center gap-1.5 text-xs ${soft}`}><m.icon size={13} /> {m.label}</dt>
                      <dd className="mt-1.5 text-lg font-semibold tabular-nums">{m.value}</dd>
                    </div>
                  ))}
                </dl>

                {pageError && (
                  <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
                    <span>{pageError}</span>
                    <button type="button" onClick={() => setPageError("")} aria-label="Dismiss error"><XIcon size={17} /></button>
                  </div>
                )}

                {/* Toolbar */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="relative min-w-0 flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`Search ${activeVaultData.title.toLowerCase()}...`}
                      aria-label="Search current vault"
                      className={`${inputClassName} !rounded-full pl-10`}
                    />
                  </div>

                  {activeVault !== "skills" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} aria-label="Filter by year" className={`${inputClassName} !w-auto !rounded-full`}>
                        <option value="All">All years</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Sort documents" className={`${inputClassName} !w-auto !rounded-full`}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="title">Title A–Z</option>
                        <option value="category">Category</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setFeaturedOnly((v) => !v)}
                        aria-pressed={featuredOnly}
                        className={cn(
                          "inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
                          focus,
                          featuredOnly
                            ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                            : "border-neutral-300 hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5"
                        )}
                      >
                        <Star size={14} /> Featured
                      </button>
                      <div className="flex rounded-full border border-neutral-300 p-1 dark:border-white/15">
                        {[["grid", Grid2X2, "Grid view"], ["list", List, "List view"]].map(([mode, Icon, label]) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setViewMode(mode)}
                            aria-label={label}
                            aria-pressed={viewMode === mode}
                            className={cn("rounded-full p-2 transition", viewMode === mode ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : `${soft} hover:text-neutral-900 dark:hover:text-white`)}
                          >
                            <Icon size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className={`text-sm ${soft}`}>
                    {activeVault === "skills" ? filteredSkills.length : filteredItems.length}{" "}
                    {(activeVault === "skills" ? filteredSkills.length : filteredItems.length) === 1 ? "item" : "items"}
                    {search ? ` matching "${search}"` : ""}
                  </p>
                  {hasFilters && (
                    <button type="button" onClick={() => { setSearch(""); setYearFilter("All"); setFeaturedOnly(false); }} className={`inline-flex items-center gap-1 text-xs font-medium ${muted} hover:text-neutral-900 dark:hover:text-white`}>
                      <XIcon size={12} /> Clear filters
                    </button>
                  )}
                </div>

                {/* Content */}
                {loading ? (
                  <div className={`${card} flex min-h-72 flex-col items-center justify-center`}>
                    <LoaderCircle size={28} className="animate-spin text-neutral-500" />
                    <p className={`mt-3 text-sm ${soft}`}>Loading vault...</p>
                  </div>
                ) : activeVault === "skills" ? (
                  filteredSkills.length === 0 ? (
                    <EmptyState title={search ? "No matching skills" : "No skills to display"} description={search ? "Try a different search term." : "Skills load from your achievements data file."} showUpload={false} />
                  ) : (
                    <div className={`${card} p-5 sm:p-6`}>
                      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))]">
                        {filteredSkills.map((s) => (
                          <li key={s} className="flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5">
                            <Logo name={s} size="h-11 w-11" />
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : filteredItems.length === 0 ? (
                  <EmptyState
                    title={hasFilters ? "No matching items" : "This vault is ready"}
                    description={hasFilters ? "Try a different search term or clear the filters." : "Documents added to this category will appear here."}
                    onUpload={openUpload}
                    showUpload={isAdmin && !hasFilters}
                  />
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => <DocumentCard key={`${item.source}-${item.id}`} item={item} {...cardProps} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredItems.map((item) => <DocumentRow key={`${item.source}-${item.id}`} item={item} {...cardProps} />)}
                  </div>
                )}
              </Block>

              {/* GALLERY */}
              {galleryImages.length > 0 && (
                <Block id="gallery" icon={ImageIcon} title="Gallery" count={galleryImages.length}>
                  <Gallery images={galleryImages} />
                </Block>
              )}

              {/* BREAKDOWN */}
              {insights.total > 0 && (
                <Block id="breakdown" icon={Layers} title="Category breakdown" count={insights.byCategory.length}>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className={`${card} p-6`}>
                      <p className="mb-5 flex items-center gap-2 text-sm font-semibold"><TrendingUp size={16} /> Records by category</p>
                      <ul className="space-y-4">
                        {insights.byCategory.map(({ category, count }) => {
                          const Icon = getCategoryIcon(category);
                          return (
                            <li key={category}>
                              <button type="button" onClick={() => selectVault(CATEGORY_VAULT[category] || "all", true)} className={`group block w-full text-left ${focus} rounded-lg`}>
                                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                  <span className="inline-flex items-center gap-2.5 font-medium">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/10"><Icon size={15} /></span>
                                    {category}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                                    {count}
                                    <ArrowUpRight size={14} className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                  </span>
                                </div>
                                <ProgressBar value={(count / maxCategory) * 100} label={`${category} share`} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className={`${card} p-6`}>
                        <p className="mb-4 flex items-center gap-2 text-sm font-semibold"><Cloud size={16} /> Storage</p>
                        <dl className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Total used", value: formatSize(insights.storage) },
                            { label: "Files", value: documents.length },
                            { label: "Average size", value: documents.length ? formatSize(Math.round(insights.storage / documents.length)) : "—" },
                            { label: "Largest file", value: insights.largest ? formatSize(insights.largest.size) : "—" },
                          ].map((r) => (
                            <div key={r.label} className="rounded-xl bg-neutral-50 p-3.5 dark:bg-white/5">
                              <dt className={`text-xs ${soft}`}>{r.label}</dt>
                              <dd className="mt-1.5 text-sm font-semibold">{r.value}</dd>
                            </div>
                          ))}
                        </dl>
                        {insights.largest && <p className={`mt-3 truncate text-xs ${soft}`}>Largest: {insights.largest.title}</p>}
                      </div>

                      <div className={`${card} p-6`}>
                        <p className="mb-4 flex items-center gap-2 text-sm font-semibold"><File size={16} /> File types</p>
                        {[["PDF documents", insights.pdfs, FileText], ["Images", insights.images, FileImage]].map(([label, n, Icon]) => (
                          <div key={label} className="mb-4 last:mb-0">
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                              <span className="inline-flex items-center gap-2 font-medium"><Icon size={15} /> {label}</span>
                              <span className="font-semibold tabular-nums">{n}</span>
                            </div>
                            <ProgressBar value={documents.length ? (n / documents.length) * 100 : 0} label={label} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Block>
              )}

              {/* CREDENTIAL HEALTH */}
              {insights.expiring.length > 0 && (
                <Block id="credentials" icon={ShieldCheck} title="Credential health" count={insights.expiring.length}>
                  <ul className="space-y-3">
                    {insights.expiring.map(({ item, expiry }) => {
                      const Icon = getCategoryIcon(item.category);
                      return (
                        <li key={item.id}>
                          <button type="button" onClick={() => setPreviewItem(item)} className={`${card} ${hoverCard} flex w-full items-center gap-4 p-5 text-left ${focus}`}>
                            <span className={`h-11 w-11 rounded-xl ${iconBox}`}><Icon size={19} /></span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold">{item.title}</span>
                              <span className={`block truncate text-xs ${soft}`}>
                                {item.organization ? `${item.organization} · ` : ""}Expires {formatDate(item.expiryDate)}
                              </span>
                            </span>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[expiry.tone]}`}>{expiry.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Block>
              )}

              {/* TIMELINE */}
              {insights.timeline.length > 0 && (
                <Block id="timeline" icon={Calendar} title="Timeline" count={insights.timeline.length}>
                  <ol>
                    {insights.timeline.map((item, i) => {
                      const Icon = getCategoryIcon(item.category);
                      return (
                        <li key={item.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-6 last:pb-0">
                          {i < insights.timeline.length - 1 && (
                            <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20" />
                          )}
                          <span className={`relative z-10 h-10 w-10 rounded-full ${iconBox}`}><Icon size={16} /></span>
                          <button type="button" onClick={() => setPreviewItem(item)} className={`${card} ${hoverCard} p-5 text-left ${focus}`}>
                            <p className={`text-xs font-medium ${soft}`}>{formatDate(itemDateValue(item)) || "Recently added"}</p>
                            <h3 className="mt-0.5 font-semibold">{item.title}</h3>
                            <p className={`mt-1.5 text-sm leading-7 ${muted}`}>
                              {item.category}{item.organization ? ` · ${item.organization}` : ""}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </Block>
              )}

              {/* ISSUERS & TAGS */}
              {(insights.issuers.length > 0 || insights.tags.length > 0) && (
                <Block id="issuers" icon={Briefcase} title="Issuers & tags" count={insights.issuers.length || insights.tags.length}>
                  {insights.issuers.length > 0 && (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {insights.issuers.map(([name, count]) => (
                        <li key={name} className={`${card} p-5`}>
                          <div className="flex items-center gap-3.5">
                            <span className={`h-11 w-11 rounded-xl text-base font-semibold ${iconBox}`}>{name.charAt(0).toUpperCase()}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold">{name}</p>
                              <p className={`text-xs ${soft}`}>{count} {count === 1 ? "record" : "records"}</p>
                            </div>
                          </div>
                          <div className="mt-4"><ProgressBar value={(count / maxIssuer) * 100} label={`${name} share`} /></div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {insights.tags.length > 0 && (
                    <div className={`${card} mt-4 p-6`}>
                      <p className="mb-4 flex items-center gap-2 text-sm font-semibold"><Tag size={15} /> Popular tags</p>
                      <div className="flex flex-wrap gap-2">
                        {insights.tags.map(([t, n]) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => { setSearch(t); setActiveVault("all"); scrollToVault(); }}
                            className={`inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white ${focus}`}
                          >
                            {t} <span className={soft}>{n}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Block>
              )}

              {/* SKILLS */}
              {skillItems.length > 0 && (
                <Block id="skills" icon={Wrench} title="Skills & learning" count={skillItems.length}>
                  <div className={`${card} p-5 sm:p-6`}>
                    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))]">
                      {skillItems.map((s) => (
                        <li key={s} className="flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5">
                          <Logo name={s} size="h-11 w-11" />
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className={`mt-4 flex items-start gap-2 text-sm leading-7 ${muted}`}>
                    <ShieldCheck size={16} className="mt-1.5 shrink-0" />
                    Keep every milestone organized: certificates, learning records and portfolio documents stay easy to find as these skills grow.
                  </p>
                </Block>
              )}

              {/* FAQ */}
              <Block id="faq" icon={HelpCircle} title="FAQ" count={FAQ_ITEMS.length}>
                <Faq items={FAQ_ITEMS} />
              </Block>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONNECT ============ */}
      <section id="connect" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 print:hidden">
        <div className="rounded-[2rem] bg-neutral-900 px-7 py-12 text-white dark:bg-white dark:text-neutral-900 sm:px-12 sm:py-14">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Want to see more of my work?</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 opacity-80 sm:text-base">
            Explore my projects, or get in touch directly. I&apos;m open to internships, junior roles and collaborations involving full-stack work, real-time systems or practical product delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700">
              <Mail size={16} /> Get in touch
            </Link>
            <Link to="/projects" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Code2 size={16} /> Explore projects
            </Link>
            <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10">
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ============ DIALOGS ============ */}
      {loginOpen && <LoginDialog onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />}

      {uploadOpen && isAdmin && (
        <FormDialog
          mode="upload"
          onClose={() => { if (!saving) { setUploadOpen(false); setUploadError(""); } }}
          onSave={handleSaveDocument}
          saving={saving}
          error={uploadError}
          initialCategory={activeVaultData.categories?.[0] || (activeVault === "achievements" ? "Achievement" : "Certificate")}
        />
      )}

      {editTarget && isAdmin && (
        <FormDialog
          mode="edit"
          item={editTarget}
          onClose={() => { if (!editSaving) { setEditTarget(null); setEditError(""); } }}
          onSave={handleEditDocument}
          saving={editSaving}
          error={editError}
        />
      )}

      {previewItem && (
        <PreviewDialog
          item={previewItem}
          onClose={closePreview}
          onNext={() => navigatePreview(1)}
          onPrevious={() => navigatePreview(-1)}
          canNavigate={filteredItems.length > 1 && previewIndex >= 0}
        />
      )}

      {deleteTarget && isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 backdrop-blur-md sm:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-neutral-900 sm:rounded-3xl sm:p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white"><Trash2 size={19} /></span>
            <h2 id="delete-title" className="mt-4 text-lg font-semibold">Delete this document?</h2>
            <p className={`mt-2 break-words text-sm leading-7 ${soft}`}>
              &quot;{deleteTarget.title}&quot; will be permanently removed from Supabase (Storage and Database). This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Btn variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Btn>
              <button type="button" onClick={handleDeleteDocument} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 ${focus}`}>
                <Trash2 size={16} /> Delete document
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium shadow-xl dark:border-white/10 dark:bg-neutral-900 dark:text-white">
          <Check size={16} className="text-emerald-500" /> {toast}
        </div>
      )}
    </main>
  );
}