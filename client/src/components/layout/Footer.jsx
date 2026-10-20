import { Link } from "react-router-dom";
import {
  Github,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Heart,
  Home,
  Sparkles,
  Code2,
  ExternalLink,
} from "lucide-react";

import { profile } from "../../data/profile";
import { cn } from "../../lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/", icon: Home },
  { label: "Projects", to: "/projects", icon: Code2 },
  { label: "About", to: "/about", icon: Sparkles },
  { label: "Experience", to: "/experience", icon: ArrowRight },
];

const RESOURCE_LINKS = [
  { label: "Skills", to: "/skills" },
  { label: "Achievements", to: "/achievements" },
  { label: "Contact", to: "/contact" },
  { label: "Uses / Setup", to: "/uses" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const name = profile.name || "Suraj Kumar";
  const title = profile.title || "Full-Stack Web Developer";

  return (
    <footer className="border-t border-neutral-200/80 bg-white transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0b0b0c]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        {/* Top CTA strip */}
        <div className="mb-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-neutral-200/80 bg-neutral-50/60 p-6 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100">
              <Sparkles size={20} strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Let&apos;s connect
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                Have something to build?
              </h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Open to freelance, internships, and collaborations.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-neutral-900 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-200"
            >
              {name}
            </Link>
            <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              Building practical web applications, real-time experiences, and
              useful digital products.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white"
              >
                <Github size={16} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white"
              >
                <Mail size={16} />
              </a>
              <a
                href={profile.resumePath || "/resume.pdf"}
                download
                aria-label="Resume"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-400 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/25 dark:hover:text-white"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Navigation
            </p>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Resources
            </p>
            <ul className="space-y-3 text-sm">
              {RESOURCE_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={profile.resumePath || "/resume.pdf"}
                  download
                  className="group inline-flex items-center gap-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  <span>Resume</span>
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Connect
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Github className="h-4 w-4 shrink-0" />
                  GitHub
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-2 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">Email</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{profile.location || "India"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-neutral-200/80 pt-6 dark:border-white/[0.08] sm:flex-row sm:items-center">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            © {year} {name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Built with
            <Heart size={12} className="fill-current text-red-500 dark:text-red-400" />
            using React, Node.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
