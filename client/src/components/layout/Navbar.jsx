
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

const SOCIAL_LOGOS = {
  github: {
    slug: "github",
    color: "181717",
    fallback: Github,
  },
  linkedin: {
    slug: "linkedin",
    color: "0A66C2",
    fallback: Linkedin,
  },
};

const getInitials = (name) => {
  if (!name) return "S";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function SocialIcon({ name, size = 16, className = "" }) {
  const [broken, setBroken] = useState(false);
  const meta = SOCIAL_LOGOS[name];

  if (!meta) return null;

  if (broken) {
    const Fallback = meta.fallback;

    return (
      <Fallback
        size={size}
        className={className}
        strokeWidth={1.7}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${meta.slug}/${meta.color}`}
      alt=""
      loading="lazy"
      width={size}
      height={size}
      className={cn(
        "shrink-0",
        name === "github" && "dark:invert",
        className
      )}
      onError={() => setBroken(true)}
    />
  );
}

function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-950 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <span className="relative h-5 w-5">
        <Sun
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
          strokeWidth={1.7}
        />

        <Moon
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300",
            !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          )}
          strokeWidth={1.7}
        />
      </span>
    </button>
  );
}

function SocialButton({ href, name, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
    >
      <SocialIcon
        name={name}
        size={18}
        className="transition-transform duration-200 group-hover:scale-110"
      />
    </a>
  );
}

function ResumeButton({ mobile = false }) {
  return (
    <a
      href={profile.resumePath || "/resume.pdf"}
      download
      className={cn(
        "group relative inline-flex min-h-10 items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
        mobile ? "w-full min-h-11 px-5" : "hidden sm:inline-flex"
      )}
      aria-label="Download resume"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <Download
        size={16}
        className="relative transition-transform duration-200 group-hover:translate-y-0.5"
        strokeWidth={1.7}
      />

      <span className="relative">
        {mobile ? "Download Resume" : "Resume"}
      </span>
    </a>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const displayName = profile.name || "Suraj Kumar";
  const githubUrl =
    profile.github || "https://github.com/Suraj1819";
  const linkedinUrl =
    profile.linkedin || "https://www.linkedin.com/in/suraj1819";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
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
          {/* Brand */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 sm:gap-3"
            aria-label={`${displayName} - Home`}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-800 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-neutral-400 group-hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 sm:h-10 sm:w-10 sm:rounded-xl">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-100/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-white/[0.08]" />

              <Code2
                className="relative h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={1.6}
              />
            </span>

            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-200 sm:text-base lg:text-lg">
              {displayName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 xl:px-3.5",
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

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <SocialButton
              href={githubUrl}
              name="github"
              label="GitHub profile"
            />

            <SocialButton
              href={linkedinUrl}
              name="linkedin"
              label="LinkedIn profile"
            />

            <ResumeButton />

            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <span className="relative h-5 w-5">
                <Menu
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-300",
                    open
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  )}
                  strokeWidth={1.7}
                />

                <X
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-300",
                    open
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.7}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 sm:top-16 lg:hidden",
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-neutral-200/80 bg-[#fafafa] transition-all duration-300 ease-out dark:border-white/[0.08] dark:bg-[#0b0b0c] sm:top-16 lg:hidden",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        )}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-8 sm:py-6">
          {/* Profile card */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 transition-all duration-300 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-4",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
            style={{ transitionDelay: open ? "60ms" : "0ms" }}
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-100">
              {profile.photo ? (
                <>
                  <img
                    src={profile.photo}
                    alt={displayName}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.nextElementSibling;

                      if (fallback) {
                        fallback.classList.remove("hidden");
                        fallback.classList.add("flex");
                      }
                    }}
                  />

                  <span className="absolute inset-0 hidden items-center justify-center text-sm font-bold tracking-tight">
                    {getInitials(displayName)}
                  </span>
                </>
              ) : (
                <Code2 size={23} strokeWidth={1.6} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
                {displayName}
              </p>

              <p className="mt-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Portfolio & Projects
              </p>
            </div>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
              <Code2 size={16} aria-hidden="true" />
            </span>
          </div>

          {/* Mobile navigation */}
          <nav
            className="flex flex-col gap-1"
            aria-label="Mobile primary navigation"
          >
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Navigation
            </p>

            {navItems.map((item, index) => {
              const ItemIcon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
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
                    transitionDelay: open
                      ? `${100 + index * 35}ms`
                      : "0ms",
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-current transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />

                      <ItemIcon
                        size={19}
                        className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                        strokeWidth={1.7}
                      />

                      <span className="flex-1">{item.label}</span>

                      <ArrowUpRight
                        size={15}
                        className="shrink-0 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile actions */}
          <div
            className={cn(
              "space-y-2.5 border-t border-neutral-200/80 pt-5 transition-all duration-300 dark:border-white/[0.08] sm:pt-6",
              open
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
            style={{
              transitionDelay: open
                ? `${100 + navItems.length * 35 + 50}ms`
                : "0ms",
            }}
          >
            <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Quick links
            </p>

            <ResumeButton mobile />

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              <SocialIcon name="github" size={17} />
              View GitHub Profile
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>

            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              <SocialIcon name="linkedin" size={17} />
              Connect on LinkedIn
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          {/* Mobile copyright */}
          <div className="border-t border-neutral-200/80 pt-4 text-center dark:border-white/[0.08]">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} {displayName}. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
