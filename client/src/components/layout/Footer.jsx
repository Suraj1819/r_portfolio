
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Heart,
  Home,
  Sparkles,
  Code2,
  ExternalLink,
  BriefcaseBusiness,
  FileText,
  Send,
  Globe,
} from "lucide-react";

import { profile } from "../../data/profile";
import { cn } from "../../lib/utils";

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

const TONES = {
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  violet:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  orange:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  neutral:
    "bg-neutral-100 text-neutral-600 dark:bg-white/[0.07] dark:text-neutral-300",
};

const ICON_TONES = {
  sky: "text-sky-600 dark:text-sky-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  amber: "text-amber-600 dark:text-amber-300",
  violet: "text-violet-600 dark:text-violet-300",
  orange: "text-orange-600 dark:text-orange-300",
  neutral: "text-neutral-600 dark:text-neutral-300",
};

const NAV_LINKS = [
  {
    label: "Home",
    to: "/",
    icon: Home,
    tone: "sky",
  },
  {
    label: "Projects",
    to: "/projects",
    icon: Code2,
    tone: "violet",
  },
  {
    label: "About",
    to: "/about",
    icon: Sparkles,
    tone: "amber",
  },
  {
    label: "Experience",
    to: "/experience",
    icon: BriefcaseBusiness,
    tone: "emerald",
  },
];

const RESOURCE_LINKS = [
  {
    label: "Skills",
    to: "/skills",
    icon: Code2,
    tone: "violet",
  },
  {
    label: "Achievements",
    to: "/achievements",
    icon: Sparkles,
    tone: "amber",
  },
  {
    label: "Contact",
    to: "/contact",
    icon: Mail,
    tone: "sky",
  },
  {
    label: "Uses / Setup",
    to: "/uses",
    icon: Globe,
    tone: "emerald",
  },
];

function SocialIcon({ name, size = 17, className = "" }) {
  const [failed, setFailed] = useState(false);
  const social = SOCIAL_LOGOS[name];

  if (!social || failed) {
    const FallbackIcon = social?.fallback || Globe;

    return (
      <FallbackIcon
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${social.slug}/${social.color}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 dark:invert",
        name === "linkedin" && "dark:invert-0",
        className
      )}
    />
  );
}

function FooterLink({ to, icon: Icon, tone = "neutral", children }) {
  return (
    <Link
      to={to}
      className="group inline-flex w-fit items-center gap-2.5 rounded-lg py-1.5 text-sm text-neutral-600 transition-colors duration-200 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
          TONES[tone] || TONES.neutral
        )}
      >
        <Icon size={14} aria-hidden="true" />
      </span>

      <span>{children}</span>

      <ArrowUpRight
        size={13}
        className="ml-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60"
        aria-hidden="true"
      />
    </Link>
  );
}

function SocialLink({ href, label, children }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  const name = profile.name || "Suraj Kumar";
  const title = profile.title || "Full-Stack Web Developer";
  const email = profile.email || "";
  const location = profile.location || "India";

  const githubUrl =
    profile.github || "https://github.com/Suraj1819";

  const linkedinUrl =
    profile.linkedin || "https://www.linkedin.com/in/suraj1819";

  const resumePath = profile.resumePath || "/resume.pdf";

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-900 transition-colors duration-300 dark:border-white/[0.08] dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        {/* Contact CTA */}
        <section className="relative mb-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7 dark:border-white/10 dark:bg-neutral-900/60">
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-sky-400/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-violet-400/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-violet-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-violet-300">
                <Send size={21} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                  Let&apos;s connect
                </p>

                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl dark:text-white">
                  Have something to build?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  Let&apos;s discuss your idea, collaborate on a project,
                  or build something useful together.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-700 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Get in touch
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand and social links */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label={`${name} - Home`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                <Code2 size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
                  {name}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {title}
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              Building practical web applications, real-time experiences,
              and useful digital products with a focus on clean design
              and reliable functionality.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <SocialLink
                href={githubUrl}
                label="GitHub profile"
              >
                <SocialIcon name="github" size={17} />
              </SocialLink>

              <SocialLink
                href={linkedinUrl}
                label="LinkedIn profile"
              >
                <SocialIcon name="linkedin" size={17} />
              </SocialLink>

              {email && (
                <SocialLink
                  href={`mailto:${email}`}
                  label="Send an email"
                >
                  <Mail
                    size={17}
                    className={ICON_TONES.sky}
                    aria-hidden="true"
                  />
                </SocialLink>
              )}

              <SocialLink
                href={resumePath}
                label="View resume"
              >
                <FileText
                  size={17}
                  className={ICON_TONES.violet}
                  aria-hidden="true"
                />
              </SocialLink>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
              <span className="h-5 w-1 rounded-full bg-sky-500" />
              Navigation
            </h3>

            <nav
              aria-label="Footer navigation"
              className="flex flex-col items-start gap-1"
            >
              {NAV_LINKS.map((item) => (
                <FooterLink
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  tone={item.tone}
                >
                  {item.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
              <span className="h-5 w-1 rounded-full bg-violet-500" />
              Explore
            </h3>

            <nav
              aria-label="Footer resources"
              className="flex flex-col items-start gap-1"
            >
              {RESOURCE_LINKS.map((item) => (
                <FooterLink
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  tone={item.tone}
                >
                  {item.label}
                </FooterLink>
              ))}

              <a
                href={resumePath}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-2.5 rounded-lg py-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                  <FileText size={14} aria-hidden="true" />
                </span>

                Resume

                <ExternalLink
                  size={13}
                  className="ml-0.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </nav>
          </div>

          {/* Contact details */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
              <span className="h-5 w-1 rounded-full bg-emerald-500" />
              Get in touch
            </h3>

            <div className="space-y-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-neutral-200 hover:bg-neutral-50 dark:hover:border-white/10 dark:hover:bg-white/[0.03]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    <Mail size={16} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 pt-0.5">
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                      Email
                    </span>

                    <span className="mt-1 block break-all text-sm text-neutral-700 transition-colors group-hover:text-neutral-950 dark:text-neutral-300 dark:group-hover:text-white">
                      {email}
                    </span>
                  </span>
                </a>
              )}

              <div className="flex items-start gap-3 rounded-xl border border-transparent p-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <MapPin size={16} aria-hidden="true" />
                </span>

                <span className="min-w-0 pt-0.5">
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    Location
                  </span>

                  <span className="mt-1 block text-sm text-neutral-700 dark:text-neutral-300">
                    {location}
                  </span>
                </span>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-transparent p-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <BriefcaseBusiness size={16} aria-hidden="true" />
                </span>

                <span className="min-w-0 pt-0.5">
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    Focus
                  </span>

                  <span className="mt-1 block text-sm text-neutral-700 dark:text-neutral-300">
                    Full-Stack Development
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-neutral-200 dark:bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            © {year} {name}. All rights reserved.
          </p>

          <p className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Built with
            <Heart
              size={13}
              className="fill-rose-500 text-rose-500"
              aria-label="love"
            />
            using
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              React
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Tailwind CSS
            </span>
          </p>

          <Link
            to="/"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            Back to home
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
