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
  Code2,
  Home as HomeIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../hooks/useTheme";
import { profile } from "../../data/profile";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/achievements", label: "Achievements" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          "sticky top-0 z-50 w-full border-b transition-colors duration-300",
          scrolled
            ? "border-neutral-200/80 bg-[#fafafa]/85 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0b0b0c]/85"
            : "border-transparent bg-[#fafafa] dark:bg-[#0b0b0c]"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-8 lg:px-12">
          {/* Logo — compact on mobile */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 sm:gap-3"
            aria-label="Suraj Kumar — home"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:hover:border-white/25 sm:h-10 sm:w-10 sm:rounded-xl">
              <Code2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
            </span>
            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200 sm:text-base sm:inline-block lg:text-lg">
              {profile.name || "Suraj Kumar"}
            </span>
          </Link>

          {/* Desktop nav */}
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
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions — compact on mobile */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Theme toggle — smaller on mobile */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
              )}
            </button>

            {/* Resume (desktop only — hidden on mobile to save space, available in drawer) */}
            <a
              href={profile.resumePath || "/resume.pdf"}
              download
              className="hidden min-h-10 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:inline-flex"
              aria-label="Download resume"
            >
              <Download className="h-4 w-4" strokeWidth={1.7} />
              Resume
            </a>

            {/* Mobile menu toggle — smaller on mobile */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white sm:h-10 sm:w-10 sm:rounded-xl lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              {open ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
              )}
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

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto bg-[#fafafa] transition-all duration-300 dark:bg-[#0b0b0c] sm:top-16 lg:hidden",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-8 sm:py-6">
          {/* Profile card — compact */}
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 sm:p-4 dark:border-white/[0.09] dark:bg-white/[0.025]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 sm:h-12 sm:w-12">
              <Code2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
                {profile.name || "Suraj Kumar"}
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

          {/* Nav links — compact */}
          <nav className="flex flex-col gap-0.5 sm:gap-1" aria-label="Mobile primary">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Navigation
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors sm:rounded-xl sm:px-4 sm:py-3.5 sm:text-[15px]",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  )
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight
                  size={14}
                  className="shrink-0 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 sm:size-4"
                />
              </NavLink>
            ))}
          </nav>

          {/* Footer actions */}
          <div className="space-y-2.5 border-t border-neutral-200/80 pt-5 dark:border-white/[0.08] sm:space-y-3 sm:pt-6">
            <a
              href={profile.resumePath || "/resume.pdf"}
              download
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:min-h-11 sm:px-5 sm:py-3"
            >
              <Download className="h-4 w-4" strokeWidth={1.7} />
              Download Resume
            </a>
            <a
              href={profile.github || "https://github.com/Suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07] sm:min-h-11 sm:px-5 sm:py-3"
            >
              <Github className="h-4 w-4" strokeWidth={1.7} />
              View GitHub Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 sm:text-xs">
            © {new Date().getFullYear()}{" "}
            {profile.name || "Suraj Kumar"}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
