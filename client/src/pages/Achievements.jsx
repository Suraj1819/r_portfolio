import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  CloudUpload,
  Code2,
  Download,
  ExternalLink,
  Eye,
  File,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  GraduationCap,
  Grid2X2,
  Image as ImageIcon,
  List,
  LoaderCircle,
  Clock,
  Users,
  MapPin,
  Globe,
  Lock,
  LogOut,
  Plus,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Upload,
  X,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Home as HomeIcon,
  ShieldAlert,
  KeyRound,
  Eye as EyeIcon,
  EyeOff,
} from "lucide-react";

import { achievements, growthAreas } from "../data/achievements";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const AUTH_LOGIN_ENDPOINT = `${API_BASE}/api/v1/auth/login`;
const VAULT_DOCUMENTS_ENDPOINT = `${API_BASE}/api/v1/vault/documents`;

/* ------------------------------------------------------------------ */
/*  ADMIN AUTH (server-verified password)                              */
/* ------------------------------------------------------------------ */

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
  const data = { token, expiresAt: Date.now() + ADMIN_SESSION_DURATION };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
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

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const EMPTY_FORM = {
  // Basic
  title: "",
  category: "Certificate",
  description: "",
  organization: "",
  date: "",
  tags: "",
  featured: false,
  // Detailed fields
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

// Category-specific field hints (shows which fields are most relevant per category)
const CATEGORY_FIELDS = {
  Certificate: ["certificateNumber", "issueDate", "expiryDate", "credentialUrl", "scoreGrade"],
  Achievement: ["issueDate", "scoreGrade", "rank", "competition"],
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
  {
    id: "certificates",
    title: "Certificates",
    icon: Award,
    categories: ["Certificate", "Course", "Workshop"],
    kind: "documents",
  },
  { id: "skills", title: "Skill Vault", icon: Sparkles, categories: [], kind: "skills" },
  {
    id: "projects",
    title: "Projects",
    icon: Code2,
    categories: ["Project", "Report"],
    kind: "documents",
  },
  {
    id: "assignments",
    title: "Assignments",
    icon: BookOpen,
    categories: ["Assignment"],
    kind: "documents",
  },
  {
    id: "achievements",
    title: "Achievements",
    icon: Trophy,
    categories: ["Achievement"],
    kind: "achievements",
  },
  {
    id: "internships",
    title: "Internships",
    icon: BriefcaseBusiness,
    categories: ["Internship"],
    kind: "documents",
  },
  {
    id: "academic",
    title: "Academic",
    icon: GraduationCap,
    categories: ["Assignment", "Report", "Course"],
    kind: "documents",
  },
  {
    id: "other",
    title: "Other Documents",
    icon: Folder,
    categories: ["Other"],
    kind: "documents",
  },
];

const ALL_NAV_ITEMS = [...PRIMARY_NAV, ...VAULTS];

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "vault", label: "Vaults", icon: Folder },
  { id: "growth", label: "Growth", icon: Trophy },
  { id: "connect", label: "Connect", icon: ArrowRight },
];

/* ------------------------------------------------------------------ */
/*  HOOKS                                                              */
/* ------------------------------------------------------------------ */

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

function useReadingProgress() {
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
  return progress;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getYear(value) {
  if (!value) return "";
  const match = String(value).match(/\b20\d{2}\b/);
  return match?.[0] || "";
}

function getFileKind(item) {
  const name = item?.fileName || item?.name || "";
  const type = item?.mimeType || item?.type || "";
  if (type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  if (type.startsWith("image/")) return "image";
  return "file";
}

function getCategoryIcon(category) {
  const icons = {
    Certificate: Award,
    Achievement: Trophy,
    Project: Code2,
    Assignment: BookOpen,
    Internship: BriefcaseBusiness,
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
  if (/leetcode|streak|problem|coding|achievement/.test(text)) {
    return "Achievement";
  }
  return "Certificate";
}

/**
 * Compare two documents arrays — return true if they are equivalent
 * (same length, same IDs, same featured/title/category).
 * Used by polling to avoid unnecessary re-renders.
 */
function documentsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  // Sort both arrays the SAME way (ascending by id) before comparing
  const sortA = [...a].sort((x, y) => String(x.id).localeCompare(String(y.id)));
  const sortB = [...b].sort((x, y) => String(x.id).localeCompare(String(y.id)));
  return sortA.every((doc, i) => {
    const other = sortB[i];
    if (!other) return false;
    return (
      String(doc.id) === String(other.id) &&
      Boolean(doc.featured) === Boolean(other.featured) &&
      (doc.title || "") === (other.title || "") &&
      (doc.category || "") === (other.category || "")
    );
  });
}

/* ------------------------------------------------------------------ */
/*  SHARED UI                                                           */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
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

function MetaPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
      <Icon className="h-3.5 w-3.5" />
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
/*  SIDEBAR                                                            */
/* ------------------------------------------------------------------ */

function VaultSidebarItem({ item, active, onClick, count, mobile = false }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-11 shrink-0 items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors duration-150",
        mobile ? "min-w-[140px]" : "w-full",
        active
          ? "bg-neutral-100 text-neutral-900 dark:bg-white/[0.07] dark:text-white"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.035] dark:hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          active
            ? "text-neutral-900 dark:text-white"
            : "text-neutral-500 dark:text-neutral-400"
        )}
      >
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
        {item.title}
      </span>
      {typeof count === "number" && count > 0 && (
        <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400">
          {count}
        </span>
      )}
    </button>
  );
}

function VaultSidebar({
  activeVault,
  onSelect,
  documents,
  achievementItems,
  mobile = false,
}) {
  function getPrimaryCount(item) {
    if (item.id === "all") return documents.length + achievementItems.length;
    if (item.id === "recent") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return documents.filter((d) => (d.createdAt || 0) >= weekAgo).length;
    }
    if (item.id === "starred") {
      return documents.filter((d) => d.featured).length;
    }
    return 0;
  }

  function getVaultCount(vault) {
    if (vault.kind === "skills") return growthAreas.length;
    if (vault.kind === "achievements") {
      return (
        achievementItems.length +
        documents.filter((item) => vault.categories.includes(item.category))
          .length
      );
    }
    return documents.filter((item) =>
      vault.categories.includes(item.category)
    ).length;
  }

  if (mobile) {
    return (
      <nav
        aria-label="Vault navigation"
        className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PRIMARY_NAV.map((item) => (
          <VaultSidebarItem
            key={item.id}
            item={item}
            active={activeVault === item.id}
            onClick={() => onSelect(item.id)}
            count={getPrimaryCount(item)}
            mobile
          />
        ))}
        <span className="mx-1 w-px shrink-0 self-stretch bg-neutral-200 dark:bg-white/10" />
        {VAULTS.map((vault) => (
          <VaultSidebarItem
            key={vault.id}
            item={vault}
            active={activeVault === vault.id}
            onClick={() => onSelect(vault.id)}
            count={getVaultCount(vault)}
            mobile
          />
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Vault navigation" className="flex flex-col gap-1">
      <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        Library
      </p>
      {PRIMARY_NAV.map((item) => (
        <VaultSidebarItem
          key={item.id}
          item={item}
          active={activeVault === item.id}
          onClick={() => onSelect(item.id)}
          count={getPrimaryCount(item)}
        />
      ))}
      <div className="my-2 h-px bg-neutral-200/80 dark:bg-white/[0.08]" />
      <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        Vaults
      </p>
      {VAULTS.map((vault) => (
        <VaultSidebarItem
          key={vault.id}
          item={vault}
          active={activeVault === vault.id}
          onClick={() => onSelect(vault.id)}
          count={getVaultCount(vault)}
        />
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  DOCUMENT IMAGE / CARD                                              */
/* ------------------------------------------------------------------ */

function DocumentImage({ item, className = "" }) {
  const [url, setUrl] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (!item.fileUrl || getFileKind(item) !== "image") {
      setUrl("");
      return;
    }
    setUrl(item.fileUrl);
  }, [item.fileUrl]);

  // Image load fail hone pe fallback icon dikhao, error throw mat karo
  if (!url || hasError) return null;

  return (
    <img
      src={url}
      alt={item.title}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

/* Helper: render a single detail row with label + value */
function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon size={12} className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          {label}
        </p>
        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function DocumentCard({ item, onPreview, onDelete, onEdit, onToggleFeatured, isAdmin }) {
  const isUploaded = item.source === "upload";
  const kind = getFileKind(item);
  const CategoryIcon = getCategoryIcon(item.category);

  // Collect detailed fields (skip empty ones)
  const hasDetails =
    item.certificateNumber ||
    item.issueDate ||
    item.startDate ||
    item.endDate ||
    item.expiryDate ||
    item.scoreGrade ||
    item.rolePosition ||
    item.teamSize ||
    item.mentorInstructor ||
    item.location ||
    item.mode ||
    item.duration ||
    item.credentialUrl;

  // Determine which date to show as primary
  const primaryDate = item.issueDate || item.endDate || item.date || item.startDate;

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
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25">
      {/* === Preview area === */}
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="relative flex h-36 items-center justify-center overflow-hidden border-b border-neutral-200/80 bg-neutral-50 dark:border-white/[0.08] dark:bg-white/[0.02]"
        aria-label={`Preview ${item.title}`}
      >
        {kind === "image" && item.fileUrl ? (
          <DocumentImage item={item} className="h-full w-full object-contain p-3" />
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <IconBox icon={kind === "pdf" ? FileText : kind === "image" ? FileImage : CategoryIcon} className="h-14 w-14 rounded-2xl" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              {kind === "pdf" ? "PDF DOCUMENT" : item.category}
            </span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-lg border border-neutral-200 bg-white/95 p-2 text-neutral-700 opacity-0 transition-opacity group-hover:opacity-100 dark:border-white/10 dark:bg-[#101011]/95 dark:text-neutral-200">
          <Eye className="h-4 w-4" />
        </span>
        {item.featured && (
          <span className="absolute left-3 top-3 rounded-lg border border-neutral-200 bg-white/95 p-2 text-neutral-800 dark:border-white/10 dark:bg-[#101011]/95 dark:text-neutral-200">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
          </span>
        )}
        {/* Score/Grade badge on top of image */}
        {item.scoreGrade && (
          <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
            {item.scoreGrade}
          </span>
        )}
      </button>

      {/* === Card body === */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category + Featured toggle */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:border-white/10 dark:text-neutral-300">
            <CategoryIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.category}</span>
          </span>
          {isUploaded && isAdmin && (
            <button
              type="button"
              onClick={() => onToggleFeatured(item)}
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                item.featured
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              )}
              title={item.featured ? "Remove featured status" : "Feature document"}
              aria-label={item.featured ? "Unfeature document" : "Feature document"}
            >
              <Star className="h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 line-clamp-2 break-words text-sm font-semibold leading-6 text-neutral-900 dark:text-white">
          {item.title}
        </h3>

        {/* Organization */}
        {item.organization && (
          <p className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {item.organization}
          </p>
        )}

        {/* Description */}
        {item.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            {item.description}
          </p>
        )}

        {/* === Detailed fields section === */}
        {hasDetails && (
          <div className="mt-3 space-y-2 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
            {/* Certificate number + Role */}
            <div className="grid grid-cols-1 gap-2">
              {item.certificateNumber && (
                <DetailRow
                  icon={ShieldCheck}
                  label="Credential ID"
                  value={item.certificateNumber}
                />
              )}
              {item.rolePosition && (
                <DetailRow
                  icon={BriefcaseBusiness}
                  label="Role"
                  value={item.rolePosition}
                />
              )}
            </div>

            {/* Dates grid */}
            {(item.startDate || item.endDate || item.issueDate || item.expiryDate || item.duration) && (
              <div className="grid grid-cols-2 gap-2 border-t border-neutral-200/60 pt-2 dark:border-white/[0.06]">
                {item.startDate && (
                  <DetailRow icon={CalendarDays} label="Start" value={formatDate(item.startDate)} />
                )}
                {item.endDate && (
                  <DetailRow icon={CalendarDays} label="End" value={formatDate(item.endDate)} />
                )}
                {item.issueDate && (
                  <DetailRow icon={CalendarDays} label="Issued" value={formatDate(item.issueDate)} />
                )}
                {item.expiryDate && (
                  <DetailRow icon={CalendarDays} label="Expires" value={formatDate(item.expiryDate)} />
                )}
                {item.duration && (
                  <DetailRow icon={Clock} label="Duration" value={item.duration} />
                )}
              </div>
            )}

            {/* Additional details */}
            {(item.teamSize || item.mentorInstructor || item.location || item.mode) && (
              <div className="grid grid-cols-2 gap-2 border-t border-neutral-200/60 pt-2 dark:border-white/[0.06]">
                {item.teamSize && (
                  <DetailRow icon={Users} label="Team" value={item.teamSize} />
                )}
                {item.mentorInstructor && (
                  <DetailRow icon={GraduationCap} label="Mentor" value={item.mentorInstructor} />
                )}
                {item.location && (
                  <DetailRow icon={MapPin} label="Location" value={item.location} />
                )}
                {item.mode && (
                  <DetailRow icon={Globe} label="Mode" value={item.mode} />
                )}
              </div>
            )}

            {/* Credential URL */}
            {item.credentialUrl && (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-1 flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25"
              >
                <ExternalLink size={12} className="shrink-0" />
                <span className="truncate">Verify Credential</span>
              </a>
            )}
          </div>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] text-neutral-600 dark:bg-white/[0.07] dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500 dark:bg-white/[0.07] dark:text-neutral-400">
                +{item.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* === Footer with date + size + actions === */}
        <div className="mt-auto pt-3">
          {/* Meta line */}
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            {primaryDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formatDate(primaryDate)}
              </span>
            )}
            {item.size > 0 && <span>{formatSize(item.size)}</span>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 border-t border-neutral-200/80 pt-3 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>

            {(isUploaded || item.link) && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                {isUploaded ? (
                  <Download className="h-3.5 w-3.5" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                {isUploaded ? "Download" : "Credential"}
              </button>
            )}

            {isUploaded && isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:hover:border-blue-900 dark:hover:text-blue-400"
                  aria-label={`Edit ${item.title}`}
                  title="Edit document"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition-colors hover:border-red-300 hover:text-red-600 dark:border-white/10 dark:hover:border-red-900 dark:hover:text-red-400"
                  aria-label={`Delete ${item.title}`}
                  title="Delete document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN DIALOG — calls backend API to verify password                */
/* ------------------------------------------------------------------ */

function LoginDialog({ onClose, onSuccess, error: externalError }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    setLocalError("");
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
        setLocalError(data.message || "Incorrect password. Please try again.");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("❌ Login fetch error:", err);
      setLocalError(
        "Unable to connect to the server. Please check your connection and try again."
      );
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#121214] sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconBox icon={Lock} />
            <div>
              <h2 id="login-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
                Admin access
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Required to upload, delete, or feature documents.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-white/[0.07] dark:hover:text-white"
            aria-label="Close login"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Password
            </label>
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
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {(localError || externalError) && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <ShieldAlert size={15} />
              {localError || externalError}
            </p>
          )}

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-white/[0.02]">
            <p className="flex items-start gap-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              Password verified securely via backend. Session expires after 4 hours.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {submitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {submitting ? "Verifying..." : "Unlock admin access"}
          </button>
        </form>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  UPLOAD DIALOG — Professional multi-section form                    */
/*  Sections: File → Basic Info → Dates → Credentials → Additional     */
/* ------------------------------------------------------------------ */

/* Reusable input component for consistency */
function FormField({ label, required = false, hint = "", children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
      )}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:focus:ring-white/5";

function UploadDialog({ onClose, onSave, saving, error, initialCategory }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    category: initialCategory || "Certificate",
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const inputRef = useRef(null);

  // Sections definition
  const sections = [
    { id: "file", label: "File", icon: CloudUpload },
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "dates", label: "Dates", icon: CalendarDays },
    { id: "credentials", label: "Credentials", icon: ShieldCheck },
    { id: "additional", label: "Additional", icon: BriefcaseBusiness },
  ];

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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
    if (!form.title.trim()) {
      updateForm("title", selected.name.replace(/\.[^.]+$/, ""));
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) {
      setFileError("Please select a document first.");
      setActiveSection(0);
      return;
    }
    if (fileError) return;

    // Debug: Log entire form state before submit
    console.log("📋 Form state at submit time:", form);
    console.log("📋 Form keys present:", Object.keys(form));
    console.log("📋 Detailed fields check:", {
      certificateNumber: form.certificateNumber,
      issueDate: form.issueDate,
      startDate: form.startDate,
      endDate: form.endDate,
      expiryDate: form.expiryDate,
      credentialUrl: form.credentialUrl,
      scoreGrade: form.scoreGrade,
      duration: form.duration,
      location: form.location,
      mode: form.mode,
      mentorInstructor: form.mentorInstructor,
      teamSize: form.teamSize,
      rolePosition: form.rolePosition,
    });

    const payload = {
      ...form,
      title: (form.title || "").trim(),
      description: (form.description || "").trim(),
      organization: (form.organization || "").trim(),
      file,
      fileName: file.name,
      mimeType: file.type || "",
      size: file.size,
      tags: (form.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    console.log("📤 Payload being sent to handleSaveDocument:", payload);
    await onSave(payload);
  }

  // Check if a field is relevant for the current category
  const isFieldRelevant = (fieldName) => {
    const relevantFields = CATEGORY_FIELDS[form.category] || [];
    return relevantFields.includes(fieldName);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-neutral-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121214] sm:rounded-3xl"
      >
        {/* === Header === */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200/80 p-5 dark:border-white/[0.08] sm:p-6">
          <div className="flex items-center gap-3">
            <IconBox icon={CloudUpload} />
            <div>
              <h2 id="upload-dialog-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
                Upload Document
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                PDF or image · Max 25 MB · Saved securely to Supabase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-white/[0.07]"
            aria-label="Close upload form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* === Section tabs === */}
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-neutral-200/80 bg-neutral-50/50 p-2 dark:border-white/[0.08] dark:bg-white/[0.02] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section, idx) => {
            const SectionIcon = section.icon;
            const isActive = activeSection === idx;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(idx)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/[0.05]"
                )}
              >
                <SectionIcon size={14} />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* === Form body (scrollable) === */}
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* ============ Section 0: File ============ */}
            {activeSection === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Choose a file to upload
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Select a PDF document or image file from your device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center transition-colors hover:border-neutral-500 dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-white/30"
                >
                  <IconBox
                    icon={
                      file && getFileKind(file) === "image"
                        ? ImageIcon
                        : file && getFileKind(file) === "pdf"
                          ? FileText
                          : Upload
                    }
                    className="h-14 w-14"
                  />
                  <span className="mt-3 break-all text-sm font-medium text-neutral-900 dark:text-white">
                    {file ? file.name : "Click to choose a file"}
                  </span>
                  <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {file
                      ? `${formatSize(file.size)} · Click to change`
                      : "PDF, JPG, JPEG, PNG or WebP"}
                  </span>
                </button>

                {(fileError || error) && (
                  <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                    {fileError || error}
                  </p>
                )}

                {/* File requirements info */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Requirements
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                      File types: PDF, JPG, JPEG, PNG, WebP
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                      Maximum file size: 25 MB
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                      Files are stored securely in Supabase Storage
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ============ Section 1: Basic Info ============ */}
            {activeSection === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Title and category are required.
                  </p>
                </div>

                <FormField label="Document title" required>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="e.g. Cisco Networking Essentials Certificate"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className={cn(inputClassName, "cursor-pointer")}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Issuing organization / platform">
                  <input
                    type="text"
                    maxLength={150}
                    value={form.organization}
                    onChange={(e) => updateForm("organization", e.target.value)}
                    placeholder="e.g. Cisco, LeetCode, learnX, college"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Description" hint="Brief summary of what this document is about.">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Add details about the certificate, project or assignment..."
                    className={cn(inputClassName, "resize-y leading-6")}
                  />
                </FormField>

                <FormField label="Tags" hint="Separate tags with commas.">
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => updateForm("tags", e.target.value)}
                    placeholder="Python, Networking, College"
                    className={inputClassName}
                  />
                </FormField>
              </div>
            )}

            {/* ============ Section 2: Dates ============ */}
            {activeSection === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Dates
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Fill in the dates relevant to this document.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Issue date"
                    hint={isFieldRelevant("issueDate") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="date"
                      value={form.issueDate}
                      onChange={(e) => updateForm("issueDate", e.target.value)}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="General date" hint="Fallback date field (legacy)">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => updateForm("date", e.target.value)}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Start date"
                    hint={isFieldRelevant("startDate") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="End date"
                    hint={isFieldRelevant("endDate") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => updateForm("endDate", e.target.value)}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Expiry date"
                    hint={isFieldRelevant("expiryDate") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => updateForm("expiryDate", e.target.value)}
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Duration" hint="e.g. 3 months, 6 weeks, 2 years">
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => updateForm("duration", e.target.value)}
                      placeholder="e.g. 3 months"
                      className={inputClassName}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* ============ Section 3: Credentials ============ */}
            {activeSection === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Credential Details
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Identification details for verification.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Certificate number / Credential ID"
                    hint={isFieldRelevant("certificateNumber") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="text"
                      value={form.certificateNumber}
                      onChange={(e) => updateForm("certificateNumber", e.target.value)}
                      placeholder="e.g. CISCO-2024-XX12345"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Score / Grade"
                    hint={isFieldRelevant("scoreGrade") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="text"
                      value={form.scoreGrade}
                      onChange={(e) => updateForm("scoreGrade", e.target.value)}
                      placeholder="e.g. A+, 92%, Distinction"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Credential URL"
                    hint="Link to verify this credential online"
                  >
                    <input
                      type="url"
                      value={form.credentialUrl}
                      onChange={(e) => updateForm("credentialUrl", e.target.value)}
                      placeholder="https://verify.example.com/credential/123"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Role / Position"
                    hint={isFieldRelevant("rolePosition") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="text"
                      value={form.rolePosition}
                      onChange={(e) => updateForm("rolePosition", e.target.value)}
                      placeholder="e.g. Frontend Developer Intern"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Team size"
                    hint={isFieldRelevant("teamSize") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="text"
                      value={form.teamSize}
                      onChange={(e) => updateForm("teamSize", e.target.value)}
                      placeholder="e.g. 5 members"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField
                    label="Mentor / Instructor"
                    hint={isFieldRelevant("mentorInstructor") ? "Recommended for this category" : ""}
                  >
                    <input
                      type="text"
                      value={form.mentorInstructor}
                      onChange={(e) => updateForm("mentorInstructor", e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className={inputClassName}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* ============ Section 4: Additional ============ */}
            {activeSection === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Additional Information
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Location, mode, and final touches.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Location">
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => updateForm("location", e.target.value)}
                      placeholder="e.g. Bangalore, India"
                      className={inputClassName}
                    />
                  </FormField>

                  <FormField label="Mode">
                    <select
                      value={form.mode}
                      onChange={(e) => updateForm("mode", e.target.value)}
                      className={cn(inputClassName, "cursor-pointer")}
                    >
                      <option value="">Select mode (optional)</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline (in-person)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </FormField>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-white/10 dark:hover:border-white/25">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateForm("featured", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 accent-neutral-900 focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:accent-white"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Mark as featured
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      Featured documents appear with a star badge and show up in the "Starred" filter.
                    </p>
                  </div>
                </label>

                {/* Summary preview */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Summary
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <dt className="text-neutral-500 dark:text-neutral-400">Title:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      {form.title || "—"}
                    </dd>
                    <dt className="text-neutral-500 dark:text-neutral-400">Category:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      {form.category}
                    </dd>
                    <dt className="text-neutral-500 dark:text-neutral-400">Organization:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      {form.organization || "—"}
                    </dd>
                    <dt className="text-neutral-500 dark:text-neutral-400">File:</dt>
                    <dd className="font-medium text-neutral-900 dark:text-white">
                      {file ? file.name : "—"}
                    </dd>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {/* === Footer with navigation + submit === */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-neutral-200/80 p-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {/* Previous button */}
            <button
              type="button"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0 || saving}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25"
            >
              <ChevronRight size={16} className="rotate-180" />
              Previous
            </button>

            {/* Section indicator */}
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              Step {activeSection + 1} of {sections.length} ·{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                {sections[activeSection].label}
              </span>
            </p>

            {/* Next OR Submit button */}
            {activeSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveSection((s) => Math.min(sections.length - 1, s + 1))}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving || !file}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {saving ? "Uploading..." : "Upload to Supabase"}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EDIT DIALOG — edit existing document metadata                      */
/*  Same wizard layout as UploadDialog but pre-filled + no file select */
/* ------------------------------------------------------------------ */

function EditDialog({ item, onClose, onSave, saving, error }) {
  const [form, setForm] = useState({
    title: item.title || "",
    category: item.category || "Certificate",
    description: item.description || "",
    organization: item.organization || "",
    date: item.date || "",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || ""),
    featured: item.featured || false,
    certificateNumber: item.certificateNumber || "",
    issueDate: item.issueDate || "",
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    expiryDate: item.expiryDate || "",
    credentialUrl: item.credentialUrl || "",
    scoreGrade: item.scoreGrade || "",
    duration: item.duration || "",
    location: item.location || "",
    mode: item.mode || "",
    mentorInstructor: item.mentorInstructor || "",
    teamSize: item.teamSize || "",
    rolePosition: item.rolePosition || "",
  });
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "dates", label: "Dates", icon: CalendarDays },
    { id: "credentials", label: "Credentials", icon: ShieldCheck },
    { id: "additional", label: "Additional", icon: BriefcaseBusiness },
  ];

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isFieldRelevant = (fieldName) => {
    const relevantFields = CATEGORY_FIELDS[form.category] || [];
    return relevantFields.includes(fieldName);
  };

  async function submit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      title: (form.title || "").trim(),
      description: (form.description || "").trim(),
      organization: (form.organization || "").trim(),
      tags: (form.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    console.log("📝 Edit payload:", payload);
    await onSave(payload);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-neutral-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#121214] sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200/80 p-5 dark:border-white/[0.08] sm:p-6">
          <div className="flex items-center gap-3">
            <IconBox icon={Pencil} />
            <div>
              <h2 id="edit-dialog-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
                Edit Document
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Update details · Changes saved to Supabase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-white/[0.07]"
            aria-label="Close edit form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-neutral-200/80 bg-neutral-50/50 p-2 dark:border-white/[0.08] dark:bg-white/[0.02] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section, idx) => {
            const SectionIcon = section.icon;
            const isActive = activeSection === idx;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(idx)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/[0.05]"
                )}
              >
                <SectionIcon size={14} />
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Form body */}
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">

            {/* Section 0: Basic Info */}
            {activeSection === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Basic Information</h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Update title, category, and description.</p>
                </div>
                <FormField label="Document title" required>
                  <input type="text" required maxLength={150} value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="e.g. Cisco Networking Essentials Certificate" className={inputClassName} />
                </FormField>
                <FormField label="Category" required>
                  <select value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className={cn(inputClassName, "cursor-pointer")}>
                    {CATEGORIES.map((category) => (<option key={category} value={category}>{category}</option>))}
                  </select>
                </FormField>
                <FormField label="Issuing organization / platform">
                  <input type="text" maxLength={150} value={form.organization}
                    onChange={(e) => updateForm("organization", e.target.value)}
                    placeholder="e.g. Cisco, LeetCode, learnX, college" className={inputClassName} />
                </FormField>
                <FormField label="Description" hint="Brief summary of what this document is about.">
                  <textarea rows={3} maxLength={1000} value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Add details..." className={cn(inputClassName, "resize-y leading-6")} />
                </FormField>
                <FormField label="Tags" hint="Separate tags with commas.">
                  <input type="text" value={form.tags}
                    onChange={(e) => updateForm("tags", e.target.value)}
                    placeholder="Python, Networking, College" className={inputClassName} />
                </FormField>
              </div>
            )}

            {/* Section 1: Dates */}
            {activeSection === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Dates</h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Update the dates relevant to this document.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Issue date" hint={isFieldRelevant("issueDate") ? "Recommended" : ""}>
                    <input type="date" value={form.issueDate}
                      onChange={(e) => updateForm("issueDate", e.target.value)} className={inputClassName} />
                  </FormField>
                  <FormField label="General date">
                    <input type="date" value={form.date}
                      onChange={(e) => updateForm("date", e.target.value)} className={inputClassName} />
                  </FormField>
                  <FormField label="Start date" hint={isFieldRelevant("startDate") ? "Recommended" : ""}>
                    <input type="date" value={form.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)} className={inputClassName} />
                  </FormField>
                  <FormField label="End date" hint={isFieldRelevant("endDate") ? "Recommended" : ""}>
                    <input type="date" value={form.endDate}
                      onChange={(e) => updateForm("endDate", e.target.value)} className={inputClassName} />
                  </FormField>
                  <FormField label="Expiry date" hint={isFieldRelevant("expiryDate") ? "Recommended" : ""}>
                    <input type="date" value={form.expiryDate}
                      onChange={(e) => updateForm("expiryDate", e.target.value)} className={inputClassName} />
                  </FormField>
                  <FormField label="Duration" hint="e.g. 3 months, 6 weeks">
                    <input type="text" value={form.duration}
                      onChange={(e) => updateForm("duration", e.target.value)}
                      placeholder="e.g. 3 months" className={inputClassName} />
                  </FormField>
                </div>
              </div>
            )}

            {/* Section 2: Credentials */}
            {activeSection === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Credential Details</h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Update identification details.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Certificate number / Credential ID" hint={isFieldRelevant("certificateNumber") ? "Recommended" : ""}>
                    <input type="text" value={form.certificateNumber}
                      onChange={(e) => updateForm("certificateNumber", e.target.value)}
                      placeholder="e.g. CISCO-2024-XX12345" className={inputClassName} />
                  </FormField>
                  <FormField label="Score / Grade" hint={isFieldRelevant("scoreGrade") ? "Recommended" : ""}>
                    <input type="text" value={form.scoreGrade}
                      onChange={(e) => updateForm("scoreGrade", e.target.value)}
                      placeholder="e.g. A+, 92%, Distinction" className={inputClassName} />
                  </FormField>
                  <FormField label="Credential URL" hint="Link to verify online">
                    <input type="url" value={form.credentialUrl}
                      onChange={(e) => updateForm("credentialUrl", e.target.value)}
                      placeholder="https://verify.example.com/credential/123" className={inputClassName} />
                  </FormField>
                  <FormField label="Role / Position" hint={isFieldRelevant("rolePosition") ? "Recommended" : ""}>
                    <input type="text" value={form.rolePosition}
                      onChange={(e) => updateForm("rolePosition", e.target.value)}
                      placeholder="e.g. Frontend Developer Intern" className={inputClassName} />
                  </FormField>
                  <FormField label="Team size" hint={isFieldRelevant("teamSize") ? "Recommended" : ""}>
                    <input type="text" value={form.teamSize}
                      onChange={(e) => updateForm("teamSize", e.target.value)}
                      placeholder="e.g. 5 members" className={inputClassName} />
                  </FormField>
                  <FormField label="Mentor / Instructor" hint={isFieldRelevant("mentorInstructor") ? "Recommended" : ""}>
                    <input type="text" value={form.mentorInstructor}
                      onChange={(e) => updateForm("mentorInstructor", e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar" className={inputClassName} />
                  </FormField>
                </div>
              </div>
            )}

            {/* Section 3: Additional */}
            {activeSection === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Additional Information</h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Location, mode, and featured status.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Location">
                    <input type="text" value={form.location}
                      onChange={(e) => updateForm("location", e.target.value)}
                      placeholder="e.g. Bangalore, India" className={inputClassName} />
                  </FormField>
                  <FormField label="Mode">
                    <select value={form.mode}
                      onChange={(e) => updateForm("mode", e.target.value)}
                      className={cn(inputClassName, "cursor-pointer")}>
                      <option value="">Select mode (optional)</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline (in-person)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </FormField>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-white/10 dark:hover:border-white/25">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => updateForm("featured", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 accent-neutral-900 focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:accent-white" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Mark as featured</p>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Featured documents appear with a star badge.</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="shrink-0 border-t border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-neutral-200/80 p-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <button type="button"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0 || saving}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25">
              <ChevronRight size={16} className="rotate-180" />
              Previous
            </button>
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              Step {activeSection + 1} of {sections.length} ·{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{sections[activeSection].label}</span>
            </p>
            {activeSection < sections.length - 1 ? (
              <button type="button"
                onClick={() => setActiveSection((s) => Math.min(sections.length - 1, s + 1))}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PREVIEW DIALOG                                                     */
/* ------------------------------------------------------------------ */

function PreviewDialog({ item, onClose, onNext, onPrevious, canNavigate }) {
  const previewUrl = item.fileUrl || item.link || "";

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && canNavigate) onNext();
      if (event.key === "ArrowLeft" && canNavigate) onPrevious();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const kind = getFileKind(item);
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white backdrop-blur-md">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <IconBox
            icon={kind === "pdf" ? FileText : kind === "image" ? FileImage : File}
            className="border-white/15 bg-white/5 text-white dark:border-white/15 dark:bg-white/5 dark:text-white"
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{item.title}</h2>
            <p className="mt-0.5 text-xs text-neutral-400">
              {item.category}
              {item.fileName ? ` · ${item.fileName}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {previewUrl && (
            <a
              href={previewUrl}
              download={item.fileName || item.title}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
          {item.link && item.source !== "upload" && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 p-2 transition hover:bg-white/10"
              aria-label="Open credential link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-300 transition hover:bg-white/10"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
        {canNavigate && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 p-2.5 transition hover:bg-white/15 sm:left-5"
              aria-label="Previous document"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 p-2.5 transition hover:bg-white/15 sm:right-5"
              aria-label="Next document"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {previewUrl && kind === "pdf" ? (
          <iframe
            src={previewUrl}
            title={item.title}
            className="h-full min-h-[65vh] w-full max-w-5xl rounded-lg bg-white"
          />
        ) : previewUrl && kind === "image" ? (
          <img
            src={previewUrl}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="max-w-lg px-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
              <FileText className="h-9 w-9 text-neutral-300" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              {item.description ||
                "A file preview is not available for this item. If a credential link is provided, open it to view the original."}
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
              >
                Open credential
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {item.description && (
        <footer className="border-t border-white/10 px-5 py-3 text-center text-xs text-neutral-400">
          {item.description}
        </footer>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EMPTY STATE                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ title, description, onUpload, showUpload = true, isAdmin }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 py-12 text-center dark:border-white/15">
      <IconBox icon={FolderOpen} className="h-14 w-14 rounded-2xl" />
      <h3 className="mt-5 text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      {showUpload && isAdmin && (
        <button
          type="button"
          onClick={onUpload}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          Upload a document
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

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
  const [loginError, setLoginError] = useState("");
  const [pageError, setPageError] = useState("");
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileVaultsOpen, setMobileVaultsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => !!getAdminSession());

  const activeSection = useScrollSpy(SECTIONS.map((s) => s.id));
  const readingProgress = useReadingProgress();

  const toastTimer = useRef(null);
  // Track if user is interacting (upload/delete/login) — pause polling during these
  const isInteractingRef = useRef(false);
  // Use refs to always have latest state inside polling (avoids stale closure)
  const previewItemRef = useRef(null);
  const uploadOpenRef = useRef(false);
  const loginOpenRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { previewItemRef.current = previewItem; }, [previewItem]);
  useEffect(() => { uploadOpenRef.current = uploadOpen; }, [uploadOpen]);
  useEffect(() => { loginOpenRef.current = loginOpen; }, [loginOpen]);

  /* ---------- Fetch documents from backend ---------- */
  const fetchDocuments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const response = await fetch(VAULT_DOCUMENTS_ENDPOINT);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setDocuments(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      if (!silent) setPageError("Could not load documents from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ---------- Initial load ---------- */
  useEffect(() => {
    document.title = "Vaults & Achievements — Suraj Kumar";
    fetchDocuments();
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [fetchDocuments]);

  /* ---------- AUTO-POLLING: Check Supabase every 5 seconds ---------- */
  /* Agar Supabase dashboard se koi file delete/add ho, to UI automatically update ho */
  useEffect(() => {
    const POLL_INTERVAL = 5000; // 5 seconds

    const pollDocuments = async () => {
      // Skip polling if user is uploading/deleting/logging in (use refs — always latest)
      if (isInteractingRef.current) return;
      // Skip polling if preview/upload/login dialog is open (use refs)
      if (previewItemRef.current || uploadOpenRef.current || loginOpenRef.current) return;

      try {
        const response = await fetch(VAULT_DOCUMENTS_ENDPOINT);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          console.log("🔍 Polling check — server count:", data.data.length);
          // Sirf tab update karo jab documents change hue ho
          setDocuments((prev) => {
            if (!documentsEqual(prev, data.data)) {
              console.log("🔄 Documents changed in Supabase — auto-updating UI", {
                prevCount: prev.length,
                newCount: data.data.length,
              });
              return data.data;
            }
            return prev;
          });
        }
      } catch (err) {
        // Silent fail — network error pe UI disturb na ho
        console.warn("Polling fetch failed:", err.message);
      }
    };

    console.log(`⏰ Auto-polling started (every ${POLL_INTERVAL / 1000}s)`);
    const intervalId = setInterval(pollDocuments, POLL_INTERVAL);

    // Window focus pe bhi instant check
    const handleFocus = () => {
      console.log("🔄 Window focused — instant refresh");
      pollDocuments();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Tab visible — instant refresh");
        pollDocuments();
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("⏹️ Auto-polling stopped");
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // Empty deps — start once on mount, use refs inside for current values
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3000);
  }, []);

  const achievementItems = useMemo(() => {
    return (Array.isArray(achievements) ? achievements : []).map((item, index) => ({
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
    }));
  }, []);

  const skillItems = useMemo(() => {
    return (Array.isArray(growthAreas) ? growthAreas : []).map((skill, index) => ({
      id: `skill-${index}`,
      source: "skill",
      title: skill,
      category: "Skill",
      organization: "Learning & Development",
      description: "A technical area included in my ongoing learning journey.",
      date: "",
      tags: ["Learning", "Skills"],
      featured: false,
      createdAt: 0,
      size: 0,
    }));
  }, []);

  const activeVaultData =
    ALL_NAV_ITEMS.find((vault) => vault.id === activeVault) || ALL_NAV_ITEMS[0];

  const vaultItems = useMemo(() => {
    if (activeVault === "skills") return skillItems;
    if (activeVault === "achievements") {
      return [
        ...achievementItems,
        ...documents.filter((item) => item.category === "Achievement"),
      ];
    }
    if (activeVault === "all") return [...documents, ...achievementItems];
    if (activeVault === "recent") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return documents.filter((item) => (item.createdAt || 0) >= weekAgo);
    }
    if (activeVault === "starred") {
      return documents.filter((item) => item.featured);
    }
    return documents.filter((item) =>
      activeVaultData.categories?.includes(item.category)
    );
  }, [activeVault, activeVaultData, documents, achievementItems, skillItems]);

  const years = useMemo(() => {
    return [
      ...new Set(vaultItems.map((item) => getYear(item.date)).filter(Boolean)),
    ].sort((a, b) => Number(b) - Number(a));
  }, [vaultItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vaultItems
      .filter((item) => {
        const matchesYear = yearFilter === "All" || getYear(item.date) === yearFilter;
        const matchesFeatured = !featuredOnly || item.featured;
        const searchable = [
          item.title,
          item.description,
          item.organization,
          item.category,
          ...(item.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return matchesYear && matchesFeatured && (!query || searchable.includes(query));
      })
      .sort((a, b) => {
        if (sortOrder === "title") return a.title.localeCompare(b.title);
        if (sortOrder === "category") return a.category.localeCompare(b.category);
        if (sortOrder === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [vaultItems, search, yearFilter, featuredOnly, sortOrder]);

  const stats = useMemo(() => {
    const allItems = [...documents, ...achievementItems];
    return {
      total: allItems.length,
      certificates: allItems.filter((item) => item.category === "Certificate").length,
      projects: allItems.filter((item) => item.category === "Project").length,
      achievements: allItems.filter((item) => item.category === "Achievement").length,
      storage: documents.reduce((total, item) => total + (item.size || 0), 0),
    };
  }, [documents, achievementItems]);

  const categoryCount = vaultItems.length;

  /* ---------- Admin actions ---------- */

  function handleLoginSuccess() {
    setIsAdmin(true);
    setLoginOpen(false);
    setLoginError("");
    notify("Admin access unlocked. You can upload and delete documents.");
  }

  function handleLogout() {
    clearAdminSession();
    setIsAdmin(false);
    setUploadOpen(false);
    setDeleteTarget(null);
    notify("Logged out. Visitors can still browse and download.");
  }

  /* ---------- Upload to Supabase via backend ---------- */
  async function handleSaveDocument(data) {
    if (!isAdmin) return;
    isInteractingRef.current = true; // Pause polling during upload
    setSaving(true);
    setUploadError("");

    // Debug: log all data received from form
    console.log("📥 handleSaveDocument received data:", {
      title: data.title,
      category: data.category,
      certificateNumber: data.certificateNumber,
      issueDate: data.issueDate,
      startDate: data.startDate,
      endDate: data.endDate,
      expiryDate: data.expiryDate,
      credentialUrl: data.credentialUrl,
      scoreGrade: data.scoreGrade,
      duration: data.duration,
      location: data.location,
      mode: data.mode,
      mentorInstructor: data.mentorInstructor,
      teamSize: data.teamSize,
      rolePosition: data.rolePosition,
    });

    try {
      const formData = new FormData();
      // Core fields
      formData.append("file", data.file);
      formData.append("title", data.title || "");
      formData.append("category", data.category || "");
      formData.append("description", data.description || "");
      formData.append("organization", data.organization || "");
      formData.append("date", data.date || "");
      formData.append("tags", (data.tags || []).join(","));
      formData.append("featured", String(data.featured || false));

      // Detailed fields — all 13 fields, with fallback to empty string
      formData.append("certificateNumber", data.certificateNumber || "");
      formData.append("issueDate", data.issueDate || "");
      formData.append("startDate", data.startDate || "");
      formData.append("endDate", data.endDate || "");
      formData.append("expiryDate", data.expiryDate || "");
      formData.append("credentialUrl", data.credentialUrl || "");
      formData.append("scoreGrade", data.scoreGrade || "");
      formData.append("duration", data.duration || "");
      formData.append("location", data.location || "");
      formData.append("mode", data.mode || "");
      formData.append("mentorInstructor", data.mentorInstructor || "");
      formData.append("teamSize", data.teamSize || "");
      formData.append("rolePosition", data.rolePosition || "");

      // Debug: log FormData entries
      console.log("📤 FormData entries being sent to backend:");
      for (let [key, value] of formData.entries()) {
        if (key === "file") {
          console.log(`   ${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`   ${key}: "${value}"`);
        }
      }

      const response = await fetch(VAULT_DOCUMENTS_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      console.log("📥 Upload response:", response.status, result);

      if (response.ok && result.success) {
        setUploadOpen(false);
        await fetchDocuments(true);
        setSearch("");
        setYearFilter("All");
        setFeaturedOnly(false);

        const matchingVault = VAULTS.find(
          (vault) => vault.kind === "documents" && vault.categories?.includes(data.category)
        );
        if (matchingVault) setActiveVault(matchingVault.id);

        notify("Document uploaded to Supabase successfully.");
      } else {
        setUploadError(result.message || "Failed to upload document.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Unable to connect to server. Please try again.");
    } finally {
      setSaving(false);
      isInteractingRef.current = false; // Resume polling
    }
  }

  /* ---------- Delete from Supabase (Storage + DB) ---------- */
  async function handleDeleteDocument() {
    if (!isAdmin || !deleteTarget || deleteTarget.source !== "upload") return;

    isInteractingRef.current = true; // Pause polling during delete
    try {
      console.log("🗑️ Deleting document:", deleteTarget.id);
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));
      console.log("📥 Delete response:", response.status, result);

      if (response.ok && result.success) {
        setDocuments((previous) =>
          previous.filter((item) => item.id !== deleteTarget.id)
        );
        if (previewItem?.id === deleteTarget.id) setPreviewItem(null);
        setDeleteTarget(null);
        notify(result.message || "Document deleted from Supabase.");
      } else {
        setPageError(result.message || "Could not delete document.");
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setPageError("Could not delete document. Please try again.");
      setDeleteTarget(null);
    } finally {
      isInteractingRef.current = false; // Resume polling
    }
  }

  /* ---------- Edit document via backend (PATCH) ---------- */
  async function handleEditDocument(data) {
    if (!isAdmin || !editTarget) return;
    isInteractingRef.current = true;
    setEditSaving(true);
    setEditError("");

    try {
      console.log("📝 Sending edit to backend:", data);
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      console.log("📥 Edit response:", response.status, result);

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

  /* ---------- Toggle featured via backend ---------- */
  async function handleToggleFeatured(item) {
    if (!isAdmin || item.source !== "upload") return;

    const newFeatured = !item.featured;
    setDocuments((previous) =>
      previous.map((doc) =>
        doc.id === item.id ? { ...doc, featured: newFeatured } : doc
      )
    );

    try {
      const response = await fetch(`${VAULT_DOCUMENTS_ENDPOINT}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        setDocuments((previous) =>
          previous.map((doc) =>
            doc.id === item.id ? { ...doc, featured: item.featured } : doc
          )
        );
        setPageError("Could not update the featured status.");
      }
    } catch (err) {
      console.error("Toggle featured failed:", err);
      setDocuments((previous) =>
        previous.map((doc) =>
          doc.id === item.id ? { ...doc, featured: item.featured } : doc
        )
      );
      setPageError("Could not update the featured status.");
    }
  }

  /* ---------- Manual refresh ---------- */
  function handleManualRefresh() {
    notify("Refreshing vault from Supabase...");
    fetchDocuments(true);
  }

  function selectVault(id) {
    setActiveVault(id);
    setSearch("");
    setYearFilter("All");
    setFeaturedOnly(false);
    setPageError("");
    setMobileVaultsOpen(false);
  }

  const previewIndex = filteredItems.findIndex((item) => item.id === previewItem?.id);
  const navigatePreview = useCallback(
    (direction) => {
      if (!filteredItems.length || previewIndex < 0) return;
      const nextIndex =
        (previewIndex + direction + filteredItems.length) % filteredItems.length;
      setPreviewItem(filteredItems[nextIndex]);
    },
    [filteredItems, previewIndex]
  );
  const closePreview = useCallback(() => setPreviewItem(null), []);

  const statCards = [
    { icon: Folder, label: "Total records", value: stats.total, description: "Saved documents and achievements" },
    { icon: Award, label: "Certificates", value: stats.certificates, description: "Credentials and completed courses" },
    { icon: Code2, label: "Projects", value: stats.projects, description: "Project records and reports" },
    { icon: Trophy, label: "Achievements", value: stats.achievements, description: "Milestones and accomplishments" },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none bg-transparent">
        <div
          className="h-full bg-neutral-900 transition-[width] duration-150 ease-out dark:bg-white"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <section
        id="overview"
        className="relative border-b border-neutral-200/80 dark:border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-14">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Vaults</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <Sparkles size={14} />
                Personal Knowledge Hub
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                My vaults.
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  My progress.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg sm:leading-8">
                Certificates, skills, projects, college assignments and
                achievements — organized in one clean workspace.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <MetaPill icon={Folder}>
                  {stats.total} records
                </MetaPill>
                <MetaPill icon={Award}>
                  {stats.certificates} certificates
                </MetaPill>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#vault"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Browse vaults <ArrowDownRight size={16} />
                </a>

                {/* Manual Refresh button — visible to everyone */}
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  title="Refresh vault from Supabase"
                >
                  <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadError("");
                        setUploadOpen(true);
                      }}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                    >
                      <Plus size={16} />
                      Add document
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-red-300 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-red-900 dark:hover:text-red-400"
                      title="End admin session"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError("");
                      setLoginOpen(true);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  >
                    <Lock size={16} />
                    Admin login
                  </button>
                )}
              </div>
            </div>

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

              {isAdmin && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Admin session active
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                    Session expires automatically in 4 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[var(--navbar-height,4rem)] z-30 border-b border-neutral-200/80 bg-[#fafafa]/85 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0b0b0c]/85">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav
            aria-label="Sections"
            className="flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  )}
                >
                  <s.icon size={12} />
                  {s.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <section
        id="vault"
        className="border-b border-neutral-200/80 dark:border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileVaultsOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300"
            >
              <Folder size={14} />
              {mobileVaultsOpen ? "Hide vaults" : "Browse vaults"}
            </button>
            {mobileVaultsOpen && (
              <div className="mt-3">
                <VaultSidebar
                  mobile
                  activeVault={activeVault}
                  onSelect={selectVault}
                  documents={documents}
                  achievementItems={achievementItems}
                />
              </div>
            )}
          </div>

          <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-neutral-200/80 bg-white p-3 dark:border-white/[0.09] dark:bg-white/[0.025]">
                <VaultSidebar
                  activeVault={activeVault}
                  onSelect={selectVault}
                  documents={documents}
                  achievementItems={achievementItems}
                />

                <div className="mt-4 border-t border-neutral-200/80 px-2.5 pt-3 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <ShieldCheck size={14} />
                    <span>Cloud storage</span>
                  </div>
                  <p className="mt-1.5 text-[10px] leading-5 text-neutral-400 dark:text-neutral-500">
                    {documents.length} files · {formatSize(stats.storage)}
                  </p>

                  <div className="mt-3 rounded-lg border border-neutral-200/80 bg-neutral-50 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-1.5">
                      {isAdmin ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </span>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                            Admin
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Visitor
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <IconBox icon={activeVaultData.icon} />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Workspace / {activeVaultData.title}
                      </p>
                      <h2 className="mt-0.5 break-words text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                        {activeVaultData.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Small refresh icon button */}
                    <button
                      type="button"
                      onClick={handleManualRefresh}
                      disabled={refreshing}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                      title="Refresh vault from Supabase"
                      aria-label="Refresh"
                    >
                      <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    </button>

                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadError("");
                          setUploadOpen(true);
                        }}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] sm:text-sm"
                      >
                        <Upload size={14} />
                        <span className="hidden sm:inline">Upload</span>
                        <Plus size={14} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setLoginError("");
                          setLoginOpen(true);
                        }}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] sm:text-sm"
                      >
                        <Lock size={14} />
                        <span className="hidden sm:inline">Login to upload</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl bg-neutral-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Items</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {categoryCount}
                    </p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Featured</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {vaultItems.filter((item) => item.featured).length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-3 dark:bg-white/[0.03]">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Storage</p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900 dark:text-white">
                      {formatSize(
                        vaultItems.reduce((sum, item) => sum + (item.size || 0), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {pageError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300"
                >
                  <span>{pageError}</span>
                  <button type="button" onClick={() => setPageError("")} aria-label="Dismiss error">
                    <X size={17} />
                  </button>
                </div>
              )}

              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative min-w-0 flex-1 sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={`Search ${activeVaultData.title.toLowerCase()}...`}
                    aria-label="Search current vault"
                    className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={yearFilter}
                    onChange={(event) => setYearFilter(event.target.value)}
                    aria-label="Filter by year"
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400 dark:border-white/10 dark:bg-[#121214] dark:text-white sm:text-sm"
                  >
                    <option value="All">All years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    aria-label="Sort documents"
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-neutral-400 dark:border-white/10 dark:bg-[#121214] dark:text-white sm:text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title A–Z</option>
                    <option value="category">Category</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setFeaturedOnly((value) => !value)}
                    aria-pressed={featuredOnly}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs transition-colors sm:text-sm",
                      featuredOnly
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300"
                    )}
                  >
                    <Star size={14} />
                    Featured
                  </button>

                  <div className="flex rounded-2xl border border-neutral-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.035]">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                      className={cn(
                        "rounded-xl p-1.5 transition",
                        viewMode === "grid"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      )}
                    >
                      <Grid2X2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      aria-pressed={viewMode === "list"}
                      className={cn(
                        "rounded-xl p-1.5 transition",
                        viewMode === "list"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      )}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "item" : "items"}
                  {search ? ` matching "${search}"` : ""}
                </p>
                {(search || yearFilter !== "All" || featuredOnly) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setYearFilter("All");
                      setFeaturedOnly(false);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  >
                    <X size={12} />
                    Clear filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <LoaderCircle className="h-7 w-7 animate-spin text-neutral-500" />
                  <p className="mt-3 text-sm text-neutral-500">Loading vault from Supabase...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <EmptyState
                  title={
                    search || yearFilter !== "All" || featuredOnly
                      ? "No matching items"
                      : activeVault === "skills"
                        ? "No skills to display"
                        : "This vault is ready"
                  }
                  description={
                    search || yearFilter !== "All" || featuredOnly
                      ? "Try a different search term or clear the filters."
                      : activeVault === "skills"
                        ? "Skills load from your achievements data file."
                        : "Documents added to this category will appear here."
                  }
                  onUpload={() => {
                    setUploadError("");
                    setUploadOpen(true);
                  }}
                  showUpload={isAdmin && activeVault !== "skills"}
                  isAdmin={isAdmin}
                />
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                      : "flex flex-col gap-3"
                  }
                >
                  {filteredItems.map((item, i) =>
                    viewMode === "grid" ? (
                      <Reveal key={`${item.source}-${item.id}`} delay={(i % 6) * 50}>
                        <DocumentCard
                          item={item}
                          onPreview={setPreviewItem}
                          onDelete={setDeleteTarget}
                          onEdit={(item) => { setEditError(""); setEditTarget(item); }}
                          onToggleFeatured={handleToggleFeatured}
                          isAdmin={isAdmin}
                        />
                      </Reveal>
                    ) : (
                      <Reveal key={`${item.source}-${item.id}`} delay={(i % 6) * 50}>
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-white/[0.09] dark:bg-white/[0.025] sm:flex-row sm:items-center">
                          <IconBox
                            icon={
                              getFileKind(item) === "pdf"
                                ? FileText
                                : getFileKind(item) === "image"
                                  ? FileImage
                                  : getCategoryIcon(item.category)
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="break-words text-sm font-semibold text-neutral-900 dark:text-white">
                                {item.title}
                              </h3>
                              <span className="rounded-md border border-neutral-200 px-2 py-1 text-[10px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                                {item.category}
                              </span>
                              {item.featured && (
                                <Star size={12} className="text-neutral-900 dark:text-white" fill="currentColor" />
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                              {item.description || item.organization || "No description added"}
                            </p>
                            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                              {item.date ? formatDate(item.date) : "Date not specified"}
                              {item.size ? ` · ${formatSize(item.size)}` : ""}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewItem(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium transition hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            {item.source === "upload" && isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatured(item)}
                                  className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035]"
                                  aria-label="Toggle featured"
                                >
                                  <Star size={15} fill={item.featured ? "currentColor" : "none"} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setEditError(""); setEditTarget(item); }}
                                  className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:hover:border-blue-900 dark:hover:text-blue-400"
                                  aria-label="Edit document"
                                  title="Edit document"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(item)}
                                  className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:border-red-300 hover:text-red-600 dark:border-white/10 dark:hover:border-red-900 dark:hover:text-red-400"
                                  aria-label="Delete document"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                            {item.source !== "upload" && item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-neutral-200 p-2 transition hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035]"
                                aria-label="Open credential"
                              >
                                <ExternalLink size={15} />
                              </a>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    )
                  )}
                </div>
              )}

              {activeVault === "skills" && growthAreas.length > 0 && (
                <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <div className="flex items-center gap-3">
                    <IconBox icon={Sparkles} />
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Learning collection
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Skills are currently loaded from your existing achievements data.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {growthAreas.map((area) => (
                      <span key={area} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="growth"
        className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
              <div>
                <SectionLabel>Continuous improvement</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                  Keep every milestone organized.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                  Use your vaults to keep certificates, learning records and
                  portfolio documents easy to find as your skills grow.
                </p>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {growthAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/[0.025] dark:text-neutral-300"
                  >
                    <Check size={14} className="text-neutral-400 dark:text-neutral-500" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Files are stored in Supabase Storage
                </p>
                <p className="mt-1 max-w-3xl text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                  Uploaded files are securely stored in Supabase Storage bucket.
                  Metadata is stored in PostgreSQL. Files are accessible from any
                  device with internet connection.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="connect">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
                    <Sparkles size={21} />
                  </div>
                  <SectionLabel>Let&apos;s connect</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Want to see more of my work?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    Explore my projects and skills, or get in touch directly —
                    I&apos;m open to internships, junior roles and
                    collaborations involving full-stack work, real-time systems
                    or practical product delivery.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    Get in touch <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  >
                    Explore projects <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {loginOpen && (
        <LoginDialog
          onClose={() => {
            setLoginOpen(false);
            setLoginError("");
          }}
          onSuccess={handleLoginSuccess}
          error={loginError}
        />
      )}

      {uploadOpen && isAdmin && (
        <UploadDialog
          onClose={() => {
            if (!saving) {
              setUploadOpen(false);
              setUploadError("");
            }
          }}
          onSave={handleSaveDocument}
          saving={saving}
          error={uploadError}
          initialCategory={
            activeVaultData.categories?.[0] ||
            (activeVault === "achievements" ? "Achievement" : "Certificate")
          }
        />
      )}

      {previewItem && (
        <PreviewDialog
          item={previewItem}
          onClose={closePreview}
          onNext={() => navigatePreview(1)}
          onPrevious={() => navigatePreview(-1)}
          canNavigate={filteredItems.length > 1}
        />
      )}

      {editTarget && isAdmin && (
        <EditDialog
          item={editTarget}
          onClose={() => {
            if (!editSaving) {
              setEditTarget(null);
              setEditError("");
            }
          }}
          onSave={handleEditDocument}
          saving={editSaving}
          error={editError}
        />
      )}

      {deleteTarget && isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 backdrop-blur-md sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#121214] sm:rounded-3xl sm:p-8"
          >
            <IconBox icon={Trash2} className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400" />
            <h2 id="delete-title" className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Delete this document?
            </h2>
            <p className="mt-2 break-words text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              &quot;{deleteTarget.title}&quot; will be permanently removed from
              Supabase (Storage + Database). This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDocument}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete document
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium shadow-xl dark:border-white/10 dark:bg-[#171718] dark:text-white"
        >
          <Check className="h-4 w-4 text-emerald-500" />
          {toast}
        </div>
      )}
    </main>
  );
}
