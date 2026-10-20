import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Search,
  Star,
  X,
  Layers3,
  Code2,
  Network,
  FolderKanban,
  Sparkles,
  Filter,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  Server,
  Database,
  Cpu,
  Globe,
  Wrench,
  Cloud,
  ShieldCheck,
  Terminal,
  Zap,
  GraduationCap,
  Rocket,
  Lightbulb,
  Home as HomeIcon,
  Quote,
  Users,
  Briefcase,
  GitBranch,
} from "lucide-react";
import { projects } from "../data/projects";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const norm = (v) => String(v ?? "").toLowerCase().trim();

function getImages(p) {
  const list = [];
  const main = p?.image ?? p?.cover ?? p?.thumbnail;
  if (main) list.push(main);

  // Prefer dedicated preview[] (used in detail page hero)
  if (Array.isArray(p?.preview)) {
    p.preview.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  // Then gallery[]
  if (Array.isArray(p?.gallery)) {
    p.gallery.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  // Legacy images[]
  if (Array.isArray(p?.images)) {
    p.images.forEach((img) => {
      const src = typeof img === "string" ? img : img?.src ?? img?.url;
      if (src && !list.includes(src)) list.push(src);
    });
  }
  return list;
}

function getLinks(p) {
  return {
    github: p?.links?.github ?? p?.github,
    live: p?.links?.live ?? p?.live ?? p?.demo,
    docs: p?.links?.docs,
    backend: p?.links?.backend,
  };
}

function primaryCategory(p) {
  return String(p?.category ?? "").split(" / ")[0] || p?.filters?.[0] || "";
}

function statusTone(status) {
  const s = norm(status);
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
  prototype: AlertCircle,
  other: AlertCircle,
};

function sortProjects(list, sort) {
  const indexed = list.map((p, i) => ({ p, i }));
  const when = (p) => Number(String(p?.year ?? "0").replace(/[^0-9]/g, "").slice(0, 4) || "0");
  indexed.sort((a, b) => {
    if (sort === "name") return String(a.p.title).localeCompare(String(b.p.title));
    if (sort === "newest") return when(b.p) - when(a.p) || a.i - b.i;
    if (sort === "status") {
      const rank = (p) => {
        const t = statusTone(p.status);
        return t === "done" ? 0 : t === "progress" ? 1 : t === "prototype" ? 2 : 3;
      };
      return rank(a.p) - rank(b.p) || a.i - b.i;
    }
    return Number(!!b.p.featured) - Number(!!a.p.featured) || a.i - b.i;
  });
  return indexed.map((e) => e.p);
}

function featurePreview(p) {
  if (Array.isArray(p?.features)) {
    return p.features
      .map((f) => (typeof f === "string" ? f : f?.name))
      .filter(Boolean)
      .slice(0, 4);
  }
  return (p?.goals ?? []).slice(0, 3);
}

function archSummary(p) {
  if (typeof p?.architecture === "string") return p.architecture;
  return p?.architecture?.summary ?? null;
}

/* ------------------------------------------------------------------ */
/*  Shared UI components (matching Home.jsx)                            */
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

function TechnologyTags({ technologies = [], limit }) {
  if (!Array.isArray(technologies) || technologies.length === 0) return null;
  const visible =
    typeof limit === "number" ? technologies.slice(0, limit) : technologies;
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tech, index) => {
        const name =
          typeof tech === "string" ? tech : tech?.name ?? tech?.label;
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
/*  Status / Filter UI                                                 */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }) {
  if (!status) return null;
  const tone = statusTone(status);
  const Icon = STATUS_ICONS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        STATUS_STYLES[tone]
      )}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition",
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:bg-transparent dark:text-neutral-300 dark:hover:border-white/30"
      )}
    >
      {children}
      {count != null ? (
        <span
          className={cn(
            "tabular-nums",
            active ? "opacity-70" : "text-neutral-400"
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Project cover with fallback                                        */
/* ------------------------------------------------------------------ */

function ProjectCover({ project, className }) {
  const src = getImages(project)[0];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 px-6 text-center dark:from-white/[0.06] dark:to-white/[0.02]",
          className
        )}
      >
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
          <p className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            {project.title}
          </p>
          {project.tagline ? (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {project.tagline}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${project.title} preview`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({ project, onClose }) {
  const images = project ? getImages(project) : [];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [project]);

  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
    };
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, images.length, onClose]);

  if (!project || !images.length) return null;
  const go = (s) => setIndex((i) => (i + s + images.length) % images.length);
  const current = images[index];
  const caption =
    typeof current === "object" ? current?.caption : null;
  const src = typeof current === "object" ? current?.src ?? current?.url : current;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:left-6 sm:top-6">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(images.length).padStart(2, "0")}
      </div>

      {/* Title */}
      <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 text-center sm:top-6">
        <p className="text-sm font-semibold text-white">{project.title}</p>
        {project.tagline && (
          <p className="text-xs text-white/60">{project.tagline}</p>
        )}
      </div>

      {/* Arrows */}
      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      ) : null}

      {/* Image */}
      <figure
        className="flex h-full max-h-[calc(100vh-4rem)] w-full max-w-[calc(100vw-4rem)] flex-col items-center justify-center sm:max-h-[calc(100vh-6rem)] sm:max-w-[calc(100vw-6rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={caption || `${project.title} screenshot`}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
        />
        {caption && (
          <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/80">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

function Actions({ project, variant = "row" }) {
  const { github, live } = getLinks(project);
  return (
    <div
      className={cn(
        "flex gap-2",
        variant === "row" ? "flex-wrap" : "flex-col"
      )}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Case study <ArrowRight size={14} />
      </Link>
      {github ? (
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
        >
          <Github size={14} /> GitHub
        </a>
      ) : null}
      {live ? (
        <a
          href={live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
        >
          <ExternalLink size={14} /> Live
        </a>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tech chips (clickable)                                             */
/* ------------------------------------------------------------------ */

function TechChips({ items, limit = 6, active, onTech }) {
  if (!items?.length) return null;
  const visible = items.slice(0, limit);
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onTech(t)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
            norm(active) === norm(t)
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/30"
          )}
        >
          {t}
        </button>
      ))}
      {items.length > limit ? (
        <span className="px-1 py-1 text-[11px] text-neutral-400">
          +{items.length - limit}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({ stat, index }) {
  const Icon = stat.icon;
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
          {stat.value}
        </p>
        <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {stat.label}
        </p>
        {stat.description && (
          <p className="mt-1 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
            {stat.description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured card                                                      */
/* ------------------------------------------------------------------ */

function FeaturedCard({ project, onGallery, activeTech, onTech }) {
  const points = featurePreview(project);
  const arch = archSummary(project);
  const imgs = getImages(project).length;

  return (
    <Reveal>
      <article className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          {/* Cover */}
          <div className="relative">
            <Link to={`/projects/${project.slug}`} className="block">
              <ProjectCover
                project={project}
                className="aspect-[16/10] w-full lg:aspect-auto lg:min-h-[400px]"
              />
            </Link>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
              <Star size={12} /> Featured
            </span>
            {imgs > 0 ? (
              <button
                type="button"
                onClick={() => onGallery(project)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur transition hover:bg-black/80"
              >
                <ImageIcon size={12} /> {imgs} photos
              </button>
            ) : null}
          </div>

          {/* Body */}
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              {primaryCategory(project) ? (
                <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                  {primaryCategory(project)}
                </span>
              ) : null}
              {project.year && (
                <span className="text-[11px] text-neutral-400">{project.year}</span>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Spotlight
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                {project.title}
              </h2>
              {project.tagline ? (
                <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400">
                  {project.tagline}
                </p>
              ) : null}
            </div>

            <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              {project.shortDescription || project.description}
            </p>

            {arch ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  <Layers3 size={12} /> Architecture
                </p>
                <p className="line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {arch}
                </p>
              </div>
            ) : null}

            {points.length > 0 ? (
              <ul className="space-y-1.5">
                {points.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}

            <TechChips
              items={project.technologies}
              limit={8}
              active={activeTech}
              onTech={onTech}
            />
            <Actions project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card (grid / list)                                         */
/* ------------------------------------------------------------------ */

function ProjectCard({ project, view, onGallery, activeTech, onTech, index }) {
  const list = view === "list";
  const points = featurePreview(project);
  const arch = archSummary(project);
  const imgs = getImages(project).length;

  return (
    <Reveal delay={(index % 4) * 60}>
      <article
        className={cn(
          "group overflow-hidden rounded-3xl border border-neutral-200/80 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25",
          list ? "flex flex-col sm:flex-row" : "flex flex-col"
        )}
      >
        {/* Cover */}
        <div className={cn("relative shrink-0", list && "sm:w-64 lg:w-72")}>
          <Link to={`/projects/${project.slug}`} className="block h-full">
            <ProjectCover
              project={project}
              className={cn(
                "w-full",
                list
                  ? "aspect-[16/9] sm:h-full sm:min-h-[220px] sm:aspect-auto"
                  : "aspect-[16/10]"
              )}
            />
          </Link>
          {project.featured ? (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
              <Star size={10} /> Featured
            </span>
          ) : null}
          {imgs > 0 ? (
            <button
              type="button"
              onClick={() => onGallery(project)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur transition hover:bg-black/85"
              aria-label={`View ${imgs} photos`}
            >
              <ImageIcon size={11} /> {imgs}
            </button>
          ) : null}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {primaryCategory(project)}
              {project.year ? (
                <span className="ml-2 normal-case tracking-normal opacity-70">
                  {project.year}
                </span>
              ) : null}
            </span>
            <StatusBadge status={project.status} />
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
            {project.title}
          </h3>
          {project.tagline ? (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {project.tagline}
            </p>
          ) : null}

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {project.shortDescription}
          </p>

          {list && arch ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Architecture:{" "}
              </span>
              {arch}
            </p>
          ) : null}

          {list && points.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {points.slice(0, 3).map((h) => (
                <li
                  key={h}
                  className="flex gap-2 text-xs text-neutral-500 dark:text-neutral-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4">
            <TechChips
              items={project.technologies}
              active={activeTech}
              onTech={onTech}
              limit={list ? 8 : 5}
            />
          </div>

          <div className="mt-5 flex-1" />
          <div className="mt-4">
            <Actions project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState("");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [gallery, setGallery] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.title = "Projects — Suraj Kumar";
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const update = () =>
      setIsDark(
        root.classList.contains("dark") ||
          body.classList.contains("dark") ||
          root.getAttribute("data-theme") === "dark"
      );
    update();
    const obs = new MutationObserver(update);
    obs.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obs.observe(body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const all = Array.isArray(projects) ? projects : [];

  const filterOptions = useMemo(() => {
    const counts = new Map();
    all.forEach((p) =>
      (p.filters ?? []).forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1))
    );
    return [["All", all.length], ...counts.entries()];
  }, [all]);

  const techOptions = useMemo(() => {
    const counts = new Map();
    all.forEach((p) =>
      (p.technologies ?? []).forEach((t) => {
        const key = norm(t);
        const entry = counts.get(key) ?? { name: t, count: 0 };
        entry.count += 1;
        counts.set(key, entry);
      })
    );
    return [...counts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [all]);

  const stats = useMemo(
    () => ({
      total: all.length,
      completed: all.filter((p) => statusTone(p.status) === "done").length,
      progress: all.filter((p) => statusTone(p.status) === "progress").length,
      techs: new Set(all.flatMap((p) => (p.technologies ?? []).map(norm))).size,
    }),
    [all]
  );

  const filtered = useMemo(() => {
    const q = norm(query);
    const list = all.filter((p) => {
      const byFilter = filter === "All" || (p.filters ?? []).includes(filter);
      const byTech =
        !tech || (p.technologies ?? []).some((t) => norm(t) === norm(tech));
      const byQuery =
        !q ||
        norm(
          [
            p.title,
            p.tagline,
            p.shortDescription,
            p.description,
            p.category,
            archSummary(p),
            ...(p.technologies ?? []),
          ]
            .filter(Boolean)
            .join(" ")
        ).includes(q);
      return byFilter && byTech && byQuery;
    });
    return sortProjects(list, sort);
  }, [all, filter, tech, query, sort]);

  const filtersActive = filter !== "All" || !!tech || !!query;
  const showFeatured =
    !filtersActive && sort === "featured" && filtered[0]?.featured;
  const featured = showFeatured ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  const toggleTech = (t) => setTech((c) => (norm(c) === norm(t) ? "" : t));
  const reset = () => {
    setFilter("All");
    setQuery("");
    setTech("");
    setSort("featured");
  };

  const statCards = [
    {
      value: stats.total,
      label: "Projects",
      description: "Built, shipped & in progress",
      icon: FolderKanban,
    },
    {
      value: stats.completed,
      label: "Completed",
      description: "Production-ready & deployed",
      icon: CheckCircle2,
    },
    {
      value: stats.progress,
      label: "In progress",
      description: "Active development",
      icon: Code2,
    },
    {
      value: stats.techs,
      label: "Technologies",
      description: "Across all projects",
      icon: Network,
    },
  ];

  return (
    <main
      className={cn(
        "min-h-screen overflow-x-clip transition-colors duration-300",
        isDark
          ? "bg-[#0b0b0c] text-neutral-100"
          : "bg-[#fafafa] text-neutral-900"
      )}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Breadcrumb + HERO                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-10 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Projects</span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-500 opacity-40" />
                  <span className="relative h-2 w-2 rounded-full bg-neutral-700 dark:bg-neutral-200" />
                </span>
                Selected Work · Case Studies
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.05em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                Selected work &amp;{" "}
                <span className="text-neutral-400 dark:text-neutral-500">
                  engineering projects.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 dark:text-neutral-400 sm:text-lg">
                Architecture, constraints, and honest feature status — not
                inflated metrics. Filter by category or technology, then open
                a full case study for the engineering details.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Browse projects <ArrowDownRight size={16} />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                >
                  Discuss a project <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-7">
                <TechnologyTags
                  technologies={[
                    "React",
                    "Node.js",
                    "WebRTC",
                    "Socket.IO",
                    "PostgreSQL",
                  ]}
                />
              </div>
            </div>

            {/* Stats card */}
            <div className="relative z-10">
              <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
                <div className="grid grid-cols-2">
                  {statCards.map(
                    ({ value, label, description, icon: Icon }, i) => (
                      <div
                        key={label}
                        className={cn(
                          "px-5 py-5 sm:px-6 sm:py-6",
                          i % 2 === 1 &&
                            "border-l border-neutral-200 dark:border-white/10",
                          i < 2 &&
                            "border-b border-neutral-200 dark:border-white/10"
                        )}
                      >
                        <div className="mb-2 flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                          <Icon size={13} />
                          <span className="text-[11px] uppercase tracking-wide">
                            {label}
                          </span>
                        </div>
                        <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                          {value}
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
                          {description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status legend */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-neutral-200/80 pt-6 text-xs text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400">
            <Filter size={12} />
            <span className="font-medium">Status guide:</span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                STATUS_STYLES.done
              )}
            >
              <CheckCircle2 size={11} /> Completed
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                STATUS_STYLES.progress
              )}
            >
              <Clock size={11} /> In progress
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                STATUS_STYLES.prototype
              )}
            >
              <AlertCircle size={11} /> Prototype
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TECH MARQUEE                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 bg-white/60 py-6 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-12">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            Across the work
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            {techOptions.slice(0, 10).map(({ name, count }) => (
              <span
                key={name}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
              >
                {name}{" "}
                <span className="text-neutral-400 dark:text-neutral-500">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TOOLBAR                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="projects"
        className="border-b border-neutral-200/80 dark:border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl space-y-4 px-5 py-8 sm:px-8 lg:px-12">
          {/* Row 1: search + sort + view */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, stack, architecture..."
                aria-label="Search projects"
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-white"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2 md:ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort"
                className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none dark:border-white/10 dark:bg-[#121214] dark:text-white"
              >
                <option value="featured">Featured first</option>
                <option value="newest">Newest first</option>
                <option value="status">By status</option>
                <option value="name">A – Z</option>
              </select>
              <div className="flex rounded-2xl border border-neutral-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.035]">
                {[
                  { id: "grid", icon: LayoutGrid, label: "Grid" },
                  { id: "list", icon: List, label: "List" },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-label={label}
                    aria-pressed={view === id}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition",
                      view === id
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-500 hover:text-black dark:hover:text-white"
                    )}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map(([name, count]) => (
              <Chip
                key={name}
                active={filter === name}
                onClick={() => setFilter(name)}
                count={count}
              >
                {name}
              </Chip>
            ))}
          </div>

          {/* Row 3: tech filter */}
          {techOptions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Technology:
              </span>
              {techOptions.map(({ name, count }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleTech(name)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition",
                    norm(tech) === norm(name)
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/10 dark:text-neutral-300"
                  )}
                >
                  {name}
                  <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          ) : null}

          {/* Row 4: count + reset */}
          <div className="flex items-center justify-between border-t border-neutral-200/80 pt-4 text-sm text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400">
            <p>
              Showing{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {filtered.length}
              </span>{" "}
              of {all.length}
              {tech ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {tech}
                  </span>
                </>
              ) : null}
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={13} /> Reset filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* LIST                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          {featured ? (
            <FeaturedCard
              project={featured}
              onGallery={setGallery}
              activeTech={tech}
              onTech={toggleTech}
            />
          ) : null}

          {rest.length > 0 ? (
            <div
              className={cn(
                "grid gap-5",
                view === "grid" ? "md:grid-cols-2" : "grid-cols-1"
              )}
            >
              {rest.map((p, i) => (
                <ProjectCard
                  key={p.id ?? p.slug}
                  project={p}
                  view={view}
                  onGallery={setGallery}
                  activeTech={tech}
                  onTech={toggleTech}
                  index={i}
                />
              ))}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-white/15">
              <p className="font-semibold text-neutral-900 dark:text-white">
                No projects match your filters
              </p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Try another keyword, category, or technology.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center gap-1 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/[0.06]"
              >
                <X size={13} /> Reset filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* HOW TO READ                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="How to read this page"
              title="Case studies over screenshots alone"
              description="Each project entry focuses on the engineering decisions, constraints, and honest status — not just a polished demo link."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {[
              {
                icon: Layers3,
                title: "Architecture first",
                text: "Each write-up covers problem, goals, components, and limits — not only a demo link.",
              },
              {
                icon: CheckCircle2,
                title: "Honest status",
                text: "Completed, In Progress, Prototype, and Planned are labeled clearly. Prototypes are never sold as finished products.",
              },
              {
                icon: Network,
                title: "Real constraints",
                text: "Networking and real-time work documents failure modes and environment limits honestly.",
              },
              {
                icon: Code2,
                title: "Code over claims",
                text: "Each case study links to the actual repository and live demo when available, with no inflated metrics.",
              },
              {
                icon: Target,
                title: "Goals & metrics",
                text: "Where possible, projects include measurable goals, key metrics, and how success was evaluated.",
              },
              {
                icon: GraduationCap,
                title: "Learning outcomes",
                text: "Every project documents what was learned — the same way a student engineer would document a real build.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 50}>
                <article className="group h-full rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <IconBox icon={Icon} />
                    <ArrowDownRight
                      size={17}
                      className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PROJECTS BY STATUS                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Status breakdown"
              title="Where each project stands"
              description="A snapshot of progress across the portfolio — useful for understanding what is shipped vs. in progress vs. experimental."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
            {[
              {
                tone: "done",
                icon: CheckCircle2,
                label: "Completed",
                count: stats.completed,
                items: all.filter((p) => statusTone(p.status) === "done"),
              },
              {
                tone: "progress",
                icon: Clock,
                label: "In progress",
                count: stats.progress,
                items: all.filter((p) => statusTone(p.status) === "progress"),
              },
              {
                tone: "prototype",
                icon: AlertCircle,
                label: "Prototype",
                count: all.filter(
                  (p) => statusTone(p.status) === "prototype"
                ).length,
                items: all.filter(
                  (p) => statusTone(p.status) === "prototype"
                ),
              },
            ].map(({ tone, icon: Icon, label, count, items }, i) => (
              <Reveal key={label} delay={i * 60}>
                <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <IconBox icon={Icon} />
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                          Status
                        </p>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {label}
                        </h3>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-white">
                      {count}
                    </p>
                  </div>
                  {items.length > 0 ? (
                    <ul className="space-y-2">
                      {items.map((p) => (
                        <li key={p.id ?? p.slug}>
                          <Link
                            to={`/projects/${p.slug}`}
                            className="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 transition hover:border-neutral-200 hover:bg-neutral-50 dark:hover:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <span className="truncate text-sm text-neutral-700 dark:text-neutral-300">
                              {p.title}
                            </span>
                            <ArrowRight
                              size={13}
                              className="shrink-0 text-neutral-400 transition group-hover:translate-x-0.5"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      No projects in this state.
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section>
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
                    Have an idea worth building?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    I am open to relevant freelance projects, internships, and
                    collaborations involving web development, full-stack
                    applications, and real-time systems.
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
                    to="/about"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  >
                    About me <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Lightbox project={gallery} onClose={() => setGallery(null)} />
    </main>
  );
}
