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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-label="Suraj Kumar — home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:hover:border-white/25">
            <Code2 className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200 sm:text-lg sm:inline-block">
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

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Availability pill (xl only) */}
          <div className="mr-1 hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 xl:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white"
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" strokeWidth={1.6} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.6} />
            )}
          </button>

          {/* Resume (desktop) */}
          <a
            href={profile.resumePath || "/resume.pdf"}
            download
            className="hidden min-h-10 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:inline-flex"
            aria-label="Download resume"
          >
            <Download className="h-4 w-4" strokeWidth={1.7} />
            Resume
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.6} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>
      </header>

      {/* Backdrop overlay when mobile drawer is open — OUTSIDE header so backdrop-filter on header doesn't create a containing block */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer — OUTSIDE header so backdrop-filter on header doesn't break fixed positioning */}
      <div
        id="mobile-drawer"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-[#fafafa] transition-all duration-300 dark:bg-[#0b0b0c] lg:hidden",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
          {/* Profile card */}
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-white/[0.09] dark:bg-white/[0.025]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
              <Code2 className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-neutral-900 dark:text-white">
                {profile.name || "Suraj Kumar"}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for work
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Navigation
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors",
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  )
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight
                  size={16}
                  className={cn(
                    "shrink-0 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100",
                    "opacity-50"
                  )}
                />
              </NavLink>
            ))}
          </nav>

          {/* Footer actions */}
          <div className="space-y-3 border-t border-neutral-200/80 pt-6 dark:border-white/[0.08]">
            <a
              href={profile.resumePath || "/resume.pdf"}
              download
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-4 w-4" strokeWidth={1.7} />
              Download Resume
            </a>
            <a
              href={profile.github || "https://github.com/Suraj1819"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
            >
              <Github className="h-4 w-4" strokeWidth={1.7} />
              View GitHub Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()}{" "}
            {profile.name || "Suraj Kumar"}. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
