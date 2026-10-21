import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
  ArrowUpRight,
  Github,
  Linkedin,
  Code2,
  Home as HomeIcon,
  User,
  Cpu,
  Briefcase,
  Trophy,
  Mail,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";
import { profile } from "../../data/profile";

const navItems = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/about", label: "About", icon: User },
  { to: "/skills", label: "Skills", icon: Cpu },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/experience", label: "Experience", icon: Briefcase },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/contact", label: "Contact", icon: Mail },
];

/* Real brand logos (simpleicons.org CDN — same source as About.jsx & ProjectDetail.jsx) */
const SOCIAL_LOGOS = {
  github: { slug: "github", color: "181717", fallback: Github },
  linkedin: { slug: "linkedin", color: "0A66C2", fallback: Linkedin },
};

/* Renders a real brand-coloured logo. Uses dark:invert for GitHub so the
   black logo becomes white on dark backgrounds. LinkedIn stays brand-blue
   on both themes. Falls back to the lucide icon if CDN fails. */
function SocialIcon({ name, size = 16, className = "" }) {
  const meta = SOCIAL_LOGOS[name];
  const [broken, setBroken] = useState(false);
  if (!meta) return null;
  if (broken) {
    const Fallback = meta.fallback;
    return <Fallback size={size} className={className} strokeWidth={1.7} />;
  }
  // GitHub brand color is black — invert in dark mode so it shows on dark bg.
  // LinkedIn is brand-blue — visible on both, no invert.
  const invert = name === "github" ? "dark:invert" : "";
  return (
    <img
      src={`https://cdn.simpleicons.org/${meta.slug}/${meta.color}`}
      alt=""
      loading="lazy"
      width={size}
      height={size}
      className={cn("shrink-0", invert, className)}
      onError={() => setBroken(true)}
    />
  );
}

/* Build initials from the display name (avatar fallback) */
const getInitials = (name) => {
  if (!name) return "S";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const displayName = profile.name || "Suraj Kumar";

  // Track scroll for sticky header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          scrolled
            ? "border-neutral-200/80 bg-[#fafafa]/85 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0b0b0c]/85 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.4)]"
            : "border-transparent bg-[#fafafa] dark:bg-[#0b0b0c]"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-8 lg:px-12">
          {/* Logo — hover lift + icon scale + subtle gradient ring */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa] dark:focus-visible:ring-offset-[#0b0b0c] sm:gap-3"
            aria-label={`${displayName} — home`}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-800 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-neutral-400 group-hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:hover:border-white/25 sm:h-10 sm:w-10 sm:rounded-xl">
              {/* Subtle gradient sheen on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-neutral-100/80 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-white/[0.08] sm:rounded-xl" />
              <Code2
                className="relative h-4 w-4 transition-transform duration-200 group-hover:scale-110 sm:h-5 sm:w-5"
                strokeWidth={1.6}
              />
            </span>
            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200 sm:text-base sm:inline-block lg:text-lg">
              {displayName}
            </span>
          </Link>

          {/* Desktop nav — refined pill with subtle shadow on active */}
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Theme toggle — Sun/Moon cross-fade with rotation */}
            <button
              type="button"
              onClick={toggleTheme}
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              <span className="relative h-4 w-4 sm:h-5 sm:w-5">
                <Sun
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-300 ease-out sm:h-5 sm:w-5",
                    theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.6}
                />
                <Moon
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-300 ease-out sm:h-5 sm:w-5",
                    theme === "light"
                      ? "rotate-0 scale-100 opacity-100"
                      : "rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.6}
                />
              </span>
            </button>

            {/* Social icon buttons — real GitHub + LinkedIn brand logos */}
            <a
              href={profile.github || "https://github.com/Suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/25 sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <SocialIcon name="github" size={16} className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 sm:h-[18px] sm:w-[18px]" />
            </a>
            <a
              href={profile.linkedin || "https://www.linkedin.com/in/suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/25 sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <SocialIcon name="linkedin" size={16} className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 sm:h-[18px] sm:w-[18px]" />
            </a>

            {/* Resume (desktop only) — shine sweep on hover + icon nudge */}
            <a
              href={profile.resumePath || "/resume.pdf"}
              download
              className="group relative hidden min-h-10 items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-neutral-900 sm:inline-flex"
              aria-label="Download resume"
            >
              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/30" />
              <Download
                className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                strokeWidth={1.7}
              />
              <span className="relative">Resume</span>
            </a>

            {/* Mobile menu toggle — Menu/X morph animation */}
            <button
              type="button"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white sm:h-10 sm:w-10 sm:rounded-xl lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <span className="relative h-4 w-4 sm:h-5 sm:w-5">
                <Menu
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-300 ease-out sm:h-5 sm:w-5",
                    open
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  )}
                  strokeWidth={1.6}
                />
                <X
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-300 ease-out sm:h-5 sm:w-5",
                    open
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.6}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay when mobile drawer is open */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 sm:top-16 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer — slide + fade with staggered items */}
      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto bg-[#fafafa] transition-all duration-300 ease-out dark:bg-[#0b0b0c] sm:top-16 lg:hidden",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-8 sm:py-6">
          {/* Profile card — with avatar + initials fallback */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 transition-all duration-300 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-4",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: open ? "60ms" : "0ms" }}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 sm:h-12 sm:w-12">
              {profile.photo ? (
                <>
                  <img
                    src={profile.photo}
                    alt={displayName}
                    className="relative h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fb = e.currentTarget.nextElementSibling;
                      if (fb) fb.classList.remove("hidden");
                    }}
                  />
                  <span className="hidden absolute inset-0 items-center justify-center bg-neutral-100 text-sm font-bold tracking-tight text-neutral-700 dark:bg-white/[0.06] dark:text-neutral-100">
                    {getInitials(displayName)}
                  </span>
                </>
              ) : (
                <Code2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
                {displayName}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 sm:text-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </p>
            </div>
          </div>

          {/* Nav links — staggered entrance */}
          <nav
            className="flex flex-col gap-0.5 sm:gap-1"
            aria-label="Mobile primary"
          >
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Navigation
            </p>
            {navItems.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-3.5 sm:text-[15px]",
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0",
                      isActive
                        ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                    )
                  }
                  style={{
                    transitionDelay: open ? `${120 + i * 40}ms` : "0ms",
                  }}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active left accent bar — subtle indicator */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-current transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <ItemIcon
                        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 sm:h-5 sm:w-5"
                        strokeWidth={1.6}
                      />
                      <span className="flex-1">{item.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 sm:size-4"
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer actions — staggered after nav */}
          <div
            className={cn(
              "space-y-2.5 border-t border-neutral-200/80 pt-5 transition-all duration-300 dark:border-white/[0.08] sm:space-y-3 sm:pt-6",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
            style={{
              transitionDelay: open
                ? `${120 + navItems.length * 40 + 60}ms`
                : "0ms",
            }}
          >
            <a
              href={profile.resumePath || "/resume.pdf"}
              download
              className="group relative flex min-h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-neutral-900 sm:min-h-11 sm:px-5 sm:py-3"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/30" />
              <Download className="relative h-4 w-4" strokeWidth={1.7} />
              <span className="relative">Download Resume</span>
            </a>
            <a
              href={profile.github || "https://github.com/Suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] sm:min-h-11 sm:px-5 sm:py-3"
            >
              <SocialIcon name="github" size={16} className="h-4 w-4" />
              View GitHub Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={profile.linkedin || "https://www.linkedin.com/in/suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] sm:min-h-11 sm:px-5 sm:py-3"
            >
              <SocialIcon name="linkedin" size={16} className="h-4 w-4" />
              Connect on LinkedIn
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 sm:text-xs">
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
