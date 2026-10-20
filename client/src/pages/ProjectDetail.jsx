import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Github,
  Share2,
  Printer,
  Target,
  Lightbulb,
  Layers,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  GraduationCap,
  AlertCircle,
  Rocket,
  Clock,
  User,
  Users,
  Calendar,
  ChevronRight,
  Home,
  Code2,
  Quote,
  Check,
  Sparkles,
  Server,
  Database,
  Network,
  Cpu,
  Globe,
  ShieldCheck,
  Zap,
  GitBranch,
  Terminal,
  FileCode,
  Workflow,
  Image as ImageIcon,
  Play,
  X as XIcon,
  Youtube,
  Film,
  MonitorPlay,
  Monitor,
  Cloud,
  Link2,
  Star,
} from "lucide-react";
import { getProjectBySlug, getAdjacentProjects } from "../data/projects";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  { id: "overview", label: "Overview", icon: Lightbulb },
  { id: "problem", label: "Problem", icon: AlertCircle },
  { id: "goals", label: "Goals", icon: Target },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "features", label: "Features", icon: CheckCircle2 },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "video", label: "Video Demo", icon: Play },
  { id: "tech", label: "Tech Stack", icon: Wrench },
  { id: "challenges", label: "Challenges", icon: AlertTriangle },
  { id: "learnings", label: "Learnings", icon: GraduationCap },
  { id: "limitations", label: "Limitations", icon: AlertCircle },
  { id: "future", label: "Future Roadmap", icon: Rocket },
  { id: "links", label: "Links & Resources", icon: Link2 },
];

/* ------------------------------------------------------------------ */
/* Shared UI Components (matching Home.jsx)                            */
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
      className={`mb-10 max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
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
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 ${className}`}
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
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reading progress bar                                                */
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
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-neutral-900 transition-[width] duration-150 ease-out dark:bg-white"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading with icon                                           */
/* ------------------------------------------------------------------ */
function SectionHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div className="mb-8 flex items-start gap-3">
      <IconBox icon={Icon} />
      <div>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Meta item                                                           */
/* ------------------------------------------------------------------ */
function MetaItem({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
        <Icon size={15} />
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="text-sm font-medium text-neutral-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll spy hook                                                     */
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

/* ------------------------------------------------------------------ */
/* Action button (matching Home.jsx PrimaryLink/SecondaryLink)         */
/* ------------------------------------------------------------------ */
function ActionButton({
  href,
  onClick,
  variant = "primary",
  children,
  type = "button",
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${styles}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Status pill                                                         */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  if (!status) return null;
  const isCompleted = status === "Completed";
  const isInProgress = status === "In Progress";
  const Icon = isCompleted ? CheckCircle2 : isInProgress ? Clock : AlertCircle;

  const styles = isCompleted
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
    : isInProgress
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
      : "border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* YouTube helper                                                      */
/* ------------------------------------------------------------------ */
function getYouTubeEmbed(url) {
  if (!url || typeof url !== "string") return null;
  // youtu.be/ID  OR  youtube.com/watch?v=ID  OR  youtube.com/embed/ID
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{6,})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{6,})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]{6,})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([\w-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return { id: m[1], type: "youtube" };
  }
  // Vimeo
  const vimeo = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeo) return { id: vimeo[1], type: "vimeo" };
  return null;
}

/* ------------------------------------------------------------------ */
/* Gallery (image grid + lightbox)                                     */
/* ------------------------------------------------------------------ */
function GalleryLightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [index, images.length, onClose, onNav]);

  const current = images[index];
  const caption =
    typeof current === "object" ? current?.caption : null;
  const src = typeof current === "object" ? current?.src : current;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20 hover:border-white/40 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <XIcon size={20} />
      </button>

      {/* Counter badge */}
      {images.length > 1 && (
        <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:left-6 sm:top-6">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </div>
      )}

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNav((index - 1 + images.length) % images.length);
          }}
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:bg-white/20 hover:border-white/40 sm:left-4"
          aria-label="Previous image"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNav((index + 1) % images.length);
          }}
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:bg-white/20 hover:border-white/40 sm:right-4"
          aria-label="Next image"
        >
          <ArrowRight size={20} />
        </button>
      )}

      {/* Image container — fills available space, image sized to fit */}
      <figure
        className="flex h-full max-h-[calc(100vh-4rem)] w-full max-w-[calc(100vw-4rem)] flex-col items-center justify-center sm:max-h-[calc(100vh-6rem)] sm:max-w-[calc(100vw-6rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={caption || "Project screenshot"}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
        />
        {caption && (
          <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/80">
            {caption}
            {images.length > 1 && (
              <span className="ml-2 text-white/50">
                · {index + 1} / {images.length}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function GalleryGrid({ images }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!images?.length) return null;

  // First image takes 2 cols + 2 rows (featured), rest fill grid
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
        {images.map((img, i) => {
          const src = typeof img === "object" ? img?.src : img;
          const caption = typeof img === "object" ? img?.caption : null;
          const featured = i === 0;
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 ${
                featured ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : ""
              }`}
              style={{ aspectRatio: featured ? "16 / 10" : "4 / 3" }}
              aria-label={caption ? `View image: ${caption}` : "View image"}
            >
              <img
                src={src}
                alt={caption || "Project screenshot"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs font-medium text-white drop-shadow-sm sm:text-sm">
                    {caption}
                  </p>
                </div>
              )}
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ImageIcon size={14} />
              </div>
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <GalleryLightbox
          images={images}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNav={setOpenIndex}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Video (YouTube / Vimeo / native)                                    */
/* ------------------------------------------------------------------ */
function VideoEmbed({ video }) {
  const url = typeof video === "string" ? video : video?.url;
  const title = typeof video === "object" ? video?.title : null;
  const description = typeof video === "object" ? video?.description : null;
  const poster = typeof video === "object" ? video?.poster : null;

  const embed = getYouTubeEmbed(url);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
      <div className="relative aspect-video w-full bg-neutral-100 dark:bg-white/[0.02]">
        {embed?.type === "youtube" && (
          <iframe
            src={`https://www.youtube.com/embed/${embed.id}`}
            title={title || "Project video demo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        )}
        {embed?.type === "vimeo" && (
          <iframe
            src={`https://player.vimeo.com/video/${embed.id}`}
            title={title || "Project video demo"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        )}
        {!embed && url && (
          <video
            src={url}
            poster={poster}
            controls
            className="absolute inset-0 h-full w-full"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {(title || description) && (
        <div className="p-5 sm:p-6">
          {title && (
            <div className="mb-2 flex items-center gap-2">
              <Film
                size={15}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {title}
              </h3>
            </div>
          )}
          {description && (
            <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero slideshow (auto-rotating preview carousel)                     */
/* ------------------------------------------------------------------ */
function HeroSlideshow({ project }) {
  // Build the slide list: prefer project.preview[], else project.gallery[]
  const rawSlides =
    project.preview?.length > 0
      ? project.preview
      : project.gallery?.length > 0
        ? project.gallery
        : [];

  const slides = rawSlides.map((s) => {
    if (typeof s === "string") return { src: s, caption: null };
    return { src: s?.src ?? s?.url, caption: s?.caption ?? s?.title ?? null };
  });

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  // If no images, fall back to the original "Case Study" text banner
  if (slides.length === 0) {
    return (
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 dark:border-white/[0.09] dark:bg-white/[0.025]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative flex aspect-[21/9] max-h-96 flex-col items-center justify-center px-6 text-center">
              <span className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Case Study
              </span>
              <p className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
                {project.title}
              </p>
              <p className="mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
                {project.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div
          className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 dark:border-white/[0.09] dark:bg-white/[0.025]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides */}
          <div className="relative aspect-[21/9] max-h-[28rem] w-full">
            {slides.map((slide, i) => (
              <div
                key={`${slide.src}-${i}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.caption || `${project.title} preview ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
                {/* Gradient overlay for readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0" />
              </div>
            ))}

            {/* Text overlay (always on top) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                Case Study
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white drop-shadow-sm sm:text-4xl md:text-5xl">
                {project.title}
              </h2>
              {project.tagline && (
                <p className="mt-2 max-w-md text-sm text-white/85 drop-shadow-sm sm:text-base">
                  {project.tagline}
                </p>
              )}
            </div>

            {/* Slide counter (top-right) */}
            {slides.length > 1 && (
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </div>
            )}

            {/* Prev / Next arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setIndex((i) => (i - 1 + slides.length) % slides.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Next slide"
                >
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Dots / progress bar */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);
  const activeSection = useScrollSpy(SECTIONS.map((s) => s.id));

  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Suraj Kumar`;
    }
  }, [project]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.tagline,
          url: window.location.href,
        });
      } catch {
        /* user cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  const handlePrint = () => window.print();

  // Categorize tech stack if `techCategories` exists; else fall back to flat list
  const techCategories = project.techCategories ?? null;
  const flatTech =
    project.technologies ??
    (techCategories
      ? techCategories.flatMap((c) => c.items ?? [])
      : []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      <ReadingProgress />

      {/* ---------------------------------------------------------------- */}
      {/* HERO SECTION                                                      */}
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
              <Home size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link
              to="/projects"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              Projects
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="max-w-[200px] truncate text-neutral-900 dark:text-white sm:max-w-none">
              {project.title}
            </span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="relative z-10">
              {/* Badges */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {project.category && (
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                    {project.category}
                  </span>
                )}
                {project.status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-700 dark:bg-neutral-200" />
                    {project.status}
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.05em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                {project.title}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                {project.tagline}
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
                {project.description}
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                {project.links?.github && (
                  <ActionButton href={project.links.github} variant="secondary">
                    <Github size={16} />
                    Repository
                  </ActionButton>
                )}
                {project.links?.live && (
                  <ActionButton href={project.links.live} variant="primary">
                    <ExternalLink size={16} />
                    Live Demo
                  </ActionButton>
                )}
                <ActionButton onClick={handleShare} variant="secondary">
                  <Share2 size={16} />
                  {copyState === "copied" ? "Link copied" : "Share"}
                </ActionButton>
                <ActionButton onClick={handlePrint} variant="secondary">
                  <Printer size={16} />
                  Print
                </ActionButton>
              </div>

              <Link
                to="/projects"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-500 dark:text-neutral-300 dark:hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to all projects
              </Link>
            </div>

            {/* Quick facts card */}
            <div className="relative z-10">
              <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <IconBox icon={FileCode} />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Project brief
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Quick reference
                    </p>
                  </div>
                </div>

                <dl className="space-y-4">
                  {project.year && (
                    <MetaItem
                      icon={Calendar}
                      label="Year"
                      value={project.year}
                    />
                  )}
                  {project.duration && (
                    <MetaItem
                      icon={Clock}
                      label="Duration"
                      value={project.duration}
                    />
                  )}
                  {project.role && (
                    <MetaItem
                      icon={User}
                      label="Role"
                      value={project.role}
                    />
                  )}
                  {project.team && (
                    <MetaItem
                      icon={Users}
                      label="Team"
                      value={project.team}
                    />
                  )}
                  {project.category && (
                    <MetaItem
                      icon={Layers}
                      label="Category"
                      value={project.category}
                    />
                  )}
                </dl>

                {flatTech.length > 0 && (
                  <div className="mt-6 border-t border-neutral-200/80 pt-5 dark:border-white/[0.08]">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      Stack
                    </p>
                    <TechnologyTags
                      technologies={flatTech}
                      limit={6}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* HERO VISUAL — AUTO-ROTATING SLIDESHOW                            */}
      {/* ---------------------------------------------------------------- */}
      <HeroSlideshow project={project} />

      {/* ---------------------------------------------------------------- */}
      {/* METRICS / KEY NUMBERS                                             */}
      {/* ---------------------------------------------------------------- */}
      {project.metrics?.length > 0 && (
        <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {project.metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 60}>
                  <div className="group rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                    <p className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                      {m.value}
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {m.label}
                    </p>
                    {m.description && (
                      <p className="mt-1 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                        {m.description}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MAIN CONTENT + SIDEBAR TOC                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-4 pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Contents
                </p>
                <nav className="space-y-1">
                  {SECTIONS.map((s) => {
                    const isActive = activeSection === s.id;
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-white/[0.07] dark:text-white"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.035] dark:hover:text-white"
                        }`}
                      >
                        <s.icon size={14} />
                        {s.label}
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles
                      size={15}
                      className="text-neutral-500 dark:text-neutral-400"
                    />
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      Quick links
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <Github size={14} /> Repository{" "}
                        <ExternalLink size={11} />
                      </a>
                    )}
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <ExternalLink size={14} /> Live Demo{" "}
                        <ExternalLink size={11} />
                      </a>
                    )}
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                    >
                      <ArrowLeft size={14} /> All projects
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main article */}
            <div className="max-w-3xl space-y-16">
              {/* OVERVIEW */}
              <Reveal>
                <article id="overview" className="scroll-mt-24">
                  <SectionHeading
                    icon={Lightbulb}
                    eyebrow="Synopsis"
                    title="Overview"
                  />
                  <p className="text-sm leading-8 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    {project.description}
                  </p>
                </article>
              </Reveal>

              {/* PROBLEM */}
              {project.problem && (
                <Reveal>
                  <article id="problem" className="scroll-mt-24">
                    <SectionHeading
                      icon={AlertCircle}
                      eyebrow="Context"
                      title="Problem"
                    />
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                      <p className="text-sm leading-8 text-neutral-600 dark:text-neutral-400 sm:text-base">
                        {project.problem}
                      </p>
                    </div>
                  </article>
                </Reveal>
              )}

              {/* GOALS */}
              {project.goals?.length > 0 && (
                <Reveal>
                  <article id="goals" className="scroll-mt-24">
                    <SectionHeading
                      icon={Target}
                      eyebrow="Objectives"
                      title="Goals"
                    />
                    <ol className="space-y-3">
                      {project.goals.map((g, i) => (
                        <li
                          key={g}
                          className="flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6"
                        >
                          <span className="font-semibold tabular-nums text-neutral-300 dark:text-neutral-600 text-2xl tracking-tight shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                              Goal {String(i + 1).padStart(2, "0")}
                            </p>
                            <p className="mt-1 text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
                              {g}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </article>
                </Reveal>
              )}

              {/* ARCHITECTURE */}
              {project.architecture && (
                <Reveal>
                  <article id="architecture" className="scroll-mt-24">
                    <SectionHeading
                      icon={Layers}
                      eyebrow="Design"
                      title="Architecture"
                    />
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                        <div className="mb-4 flex items-center gap-2">
                          <Workflow
                            size={16}
                            className="text-neutral-500 dark:text-neutral-400"
                          />
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Summary
                          </p>
                        </div>
                        <p className="text-sm leading-8 text-neutral-600 dark:text-neutral-400 sm:text-base">
                          {project.architecture.summary}
                        </p>
                      </div>

                      {project.architecture.components?.length > 0 && (
                        <div>
                          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Components &amp; services
                          </p>
                          <ul className="grid gap-3 sm:grid-cols-2">
                            {project.architecture.components.map((c, i) => {
                              const icons = [
                                Server,
                                Database,
                                Network,
                                Code2,
                                Cpu,
                                Globe,
                                ShieldCheck,
                                Terminal,
                              ];
                              const CmpIcon = icons[i % icons.length];
                              const label =
                                typeof c === "string"
                                  ? c
                                  : c?.name ?? c?.title ?? `Component ${i + 1}`;
                              const desc =
                                typeof c === "object" ? c?.description : null;
                              return (
                                <li
                                  key={label}
                                  className="rounded-2xl border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                                >
                                  <div className="mb-3 flex items-start gap-3">
                                    <IconBox
                                      icon={CmpIcon}
                                      className="!h-9 !w-9"
                                    />
                                    <p className="pt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                                      {label}
                                    </p>
                                  </div>
                                  {desc && (
                                    <p className="text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                                      {desc}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {project.architecture.dataFlow && (
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                          <div className="mb-4 flex items-center gap-2">
                            <GitBranch
                              size={16}
                              className="text-neutral-500 dark:text-neutral-400"
                            />
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                              Data flow
                            </p>
                          </div>
                          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            {project.architecture.dataFlow}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              )}

              {/* FEATURES */}
              {project.features?.length > 0 && (
                <Reveal>
                  <article id="features" className="scroll-mt-24">
                    <SectionHeading
                      icon={CheckCircle2}
                      eyebrow="Capabilities"
                      title="Features"
                    />
                    <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                      {project.features.map((f, i) => {
                        const name =
                          typeof f === "string" ? f : f?.name ?? `Feature ${i + 1}`;
                        const desc =
                          typeof f === "object" ? f?.description : null;
                        const status =
                          typeof f === "object" ? f?.status : null;
                        return (
                          <div
                            key={name}
                            className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6"
                          >
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <IconBox icon={CheckCircle2} className="!h-9 !w-9" />
                              {status && <StatusBadge status={status} />}
                            </div>
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              {name}
                            </h3>
                            {desc && (
                              <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                                {desc}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </Reveal>
              )}

              {/* GALLERY */}
              {project.gallery?.length > 0 && (
                <Reveal>
                  <article id="gallery" className="scroll-mt-24">
                    <SectionHeading
                      icon={ImageIcon}
                      eyebrow="Visuals"
                      title="Gallery"
                    />
                    <GalleryGrid images={project.gallery} />
                  </article>
                </Reveal>
              )}

              {/* VIDEO DEMO */}
              {project.video && (
                <Reveal>
                  <article id="video" className="scroll-mt-24">
                    <SectionHeading
                      icon={Play}
                      eyebrow="In action"
                      title="Video demo"
                    />
                    <VideoEmbed video={project.video} />
                  </article>
                </Reveal>
              )}

              {/* TECH STACK */}
              {flatTech.length > 0 && (
                <Reveal>
                  <article id="tech" className="scroll-mt-24">
                    <SectionHeading
                      icon={Wrench}
                      eyebrow="Tooling"
                      title="Technology stack"
                    />
                    {techCategories ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {techCategories.map((cat, i) => {
                          const icons = [
                            Monitor,
                            Server,
                            Database,
                            Network,
                            Cpu,
                            Wrench,
                            Cloud,
                            ShieldCheck,
                          ];
                          const CatIcon = icons[i % icons.length];
                          return (
                            <div
                              key={cat.category}
                              className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6"
                            >
                              <div className="mb-4 flex items-start gap-3">
                                <IconBox icon={CatIcon} />
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {cat.category}
                                  </h3>
                                  {cat.description && (
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                      {cat.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <TechnologyTags technologies={cat.items} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                        <div className="mb-4 flex items-center gap-2">
                          <Code2
                            size={16}
                            className="text-neutral-500 dark:text-neutral-400"
                          />
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Stack
                          </p>
                        </div>
                        <TechnologyTags technologies={flatTech} />
                      </div>
                    )}
                  </article>
                </Reveal>
              )}

              {/* CHALLENGES */}
              {project.challenges?.length > 0 && (
                <Reveal>
                  <article id="challenges" className="scroll-mt-24">
                    <SectionHeading
                      icon={AlertTriangle}
                      eyebrow="Hurdles"
                      title="Challenges"
                    />
                    <ul className="space-y-3">
                      {project.challenges.map((c, i) => {
                        const title =
                          typeof c === "object" ? c?.title : null;
                        const desc =
                          typeof c === "string"
                            ? c
                            : c?.description ?? c?.solution;
                        return (
                          <li
                            key={i}
                            className="rounded-2xl border-l-2 border-neutral-300 bg-white p-5 dark:border-white/15 dark:bg-white/[0.025] sm:p-6"
                          >
                            {title && (
                              <p className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
                                {title}
                              </p>
                            )}
                            <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                              {desc}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                </Reveal>
              )}

              {/* LEARNINGS */}
              {project.learnings?.length > 0 && (
                <Reveal>
                  <article id="learnings" className="scroll-mt-24">
                    <SectionHeading
                      icon={GraduationCap}
                      eyebrow="Takeaways"
                      title="Learning outcomes"
                    />
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {project.learnings.map((l, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6"
                        >
                          <Check
                            size={15}
                            className="mt-1 shrink-0 text-neutral-500 dark:text-neutral-300"
                          />
                          <p className="text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                            {typeof l === "string" ? l : l?.text ?? l?.title}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              )}

              {/* LIMITATIONS */}
              {project.limitations?.length > 0 && (
                <Reveal>
                  <article id="limitations" className="scroll-mt-24">
                    <SectionHeading
                      icon={AlertCircle}
                      eyebrow="Constraints"
                      title="Limitations"
                    />
                    <ul className="space-y-3">
                      {project.limitations.map((l, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-5 dark:border-white/15 dark:bg-white/[0.015] sm:p-6"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                          <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            {typeof l === "string" ? l : l?.text ?? l?.title}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              )}

              {/* FUTURE */}
              {project.future?.length > 0 && (
                <Reveal>
                  <article id="future" className="scroll-mt-24">
                    <SectionHeading
                      icon={Rocket}
                      eyebrow="Roadmap"
                      title="Future improvements"
                    />
                    <ol className="relative ml-2 border-l border-neutral-200 dark:border-white/[0.1]">
                      {project.future.map((f, i) => {
                        const title =
                          typeof f === "object" ? f?.title : null;
                        const desc =
                          typeof f === "string" ? f : f?.description;
                        return (
                          <li
                            key={i}
                            className="relative pb-6 pl-8 last:pb-0"
                          >
                            <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-neutral-900 bg-[#fafafa] dark:border-white dark:bg-[#0b0b0c]">
                              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />
                            </span>
                            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                              Phase {String(i + 1).padStart(2, "0")}
                            </p>
                            {title && (
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {title}
                              </p>
                            )}
                            <p
                              className={`text-sm leading-7 text-neutral-600 dark:text-neutral-400 ${
                                title ? "mt-1" : ""
                              }`}
                            >
                              {desc}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  </article>
                </Reveal>
              )}

              {/* LINKS & RESOURCES */}
              {(project.links?.github ||
                project.links?.live ||
                project.links?.docs ||
                project.links?.design ||
                project.links?.blog) && (
                <Reveal>
                  <article id="links" className="scroll-mt-24">
                    <SectionHeading
                      icon={Link2}
                      eyebrow="Resources"
                      title="Links & access"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <IconBox icon={Github} />
                            <ArrowUpRight
                              size={18}
                              className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                            />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Source code
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                            GitHub Repository
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            Browse the source code, commit history, issues and
                            contribute to the project.
                          </p>
                        </a>
                      )}

                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <IconBox icon={Globe} />
                            <ArrowUpRight
                              size={18}
                              className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                            />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Production
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                            Live Demo
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            Try the deployed application live in your browser
                            and explore the actual product.
                          </p>
                        </a>
                      )}

                      {project.links?.docs && (
                        <a
                          href={project.links.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <IconBox icon={FileCode} />
                            <ArrowUpRight
                              size={18}
                              className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                            />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Reference
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                            Documentation
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            Read the project&apos;s technical documentation,
                            API references and usage guide.
                          </p>
                        </a>
                      )}

                      {project.links?.design && (
                        <a
                          href={project.links.design}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <IconBox icon={Layers} />
                            <ArrowUpRight
                              size={18}
                              className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                            />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Design
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                            Design Files
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            Explore the design system, wireframes and mockups
                            behind the project.
                          </p>
                        </a>
                      )}

                      {project.links?.blog && (
                        <a
                          href={project.links.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <IconBox icon={Code2} />
                            <ArrowUpRight
                              size={18}
                              className="text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                            />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Write-up
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                            Case Study Blog
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            Read the full story behind the build, decisions and
                            lessons learned.
                          </p>
                        </a>
                      )}
                    </div>

                    {/* Direct URL display row */}
                    {(project.links?.github ||
                      project.links?.live) && (
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                          >
                            <Github size={15} />
                            <span className="truncate">
                              {project.links.github.replace(
                                /^https?:\/\//,
                                ""
                              )}
                            </span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                        {project.links.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                          >
                            <ExternalLink size={15} />
                            <span className="truncate">
                              {project.links.live.replace(/^https?:\/\//, "")}
                            </span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                </Reveal>
              )}

              {/* TESTIMONIAL / QUOTE */}
              {project.testimonial && (
                <Reveal>
                  <article className="rounded-3xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-10">
                    <Quote
                      size={32}
                      className="mb-5 text-neutral-300 dark:text-neutral-600"
                    />
                    <p className="text-base leading-8 text-neutral-700 italic dark:text-neutral-300 sm:text-lg">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-4 border-t border-neutral-200/80 pt-5 dark:border-white/[0.08]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5">
                        <User
                          size={18}
                          className="text-neutral-500 dark:text-neutral-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {project.testimonial.author}
                        </p>
                        {project.testimonial.role && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {project.testimonial.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PREV / NEXT                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <Reveal>
            <div className="mb-8">
              <SectionLabel>Continue exploring</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-3xl">
                More projects
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {prev ? (
              <Reveal>
                <Link to={`/projects/${prev.slug}`} className="group block">
                  <article className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-7">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors group-hover:border-neutral-900 group-hover:text-neutral-900 dark:border-white/10 dark:text-neutral-300 dark:group-hover:border-white dark:group-hover:text-white">
                      <ArrowLeft size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                        Previous project
                      </p>
                      <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                        {prev.title}
                      </p>
                      {prev.category && (
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                          {prev.category}
                        </p>
                      )}
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="ml-auto shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                    />
                  </article>
                </Link>
              </Reveal>
            ) : (
              <div />
            )}
            {next ? (
              <Reveal delay={80}>
                <Link to={`/projects/${next.slug}`} className="group block">
                  <article className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6 text-right transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-7">
                    <ArrowUpRight
                      size={18}
                      className="mr-auto shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
                    />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                        Next project
                      </p>
                      <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                        {next.title}
                      </p>
                      {next.category && (
                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                          {next.category}
                        </p>
                      )}
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors group-hover:border-neutral-900 group-hover:text-neutral-900 dark:border-white/10 dark:text-neutral-300 dark:group-hover:border-white dark:group-hover:text-white">
                      <ArrowRight size={18} />
                    </div>
                  </article>
                </Link>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT CTA                                                       */}
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
                    Interested in this project?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    I am open to collaborations, freelance work and internships
                    involving web development, full-stack applications and
                    real-time systems.
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
                    All projects <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
