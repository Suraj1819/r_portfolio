import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Send,
  MessageSquare,
  BriefcaseBusiness,
  Code2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  Clock,
  Sparkles,
  Home as HomeIcon,
  ChevronRight,
  Zap,
  Network,
  Globe,
  ExternalLink,
  Quote,
  Star,
  Users,
  Target,
} from "lucide-react";

import { profile } from "../data/profile";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const inquiryTypes = [
  { value: "", label: "Select type (optional)" },
  { value: "freelance", label: "Freelance project" },
  { value: "job", label: "Job opportunity" },
  { value: "internship", label: "Internship opportunity" },
  { value: "collaboration", label: "Collaboration" },
  { value: "technical", label: "Technical question" },
  { value: "other", label: "Other" },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  inquiryType: "",
  message: "",
  privacyAccepted: false,
  website: "", // honeypot
};

/**
 * Backend base URL.
 * - In dev: set VITE_API_URL in .env (e.g. http://localhost:3001)
 * - In prod: set VITE_API_URL to your deployed API origin
 * - If unset, falls back to same-origin "/api/v1/contact"
 */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const CONTACT_ENDPOINT = `${API_BASE}/api/v1/contact`;

const topics = [
  "Full-stack applications",
  "Real-time systems",
  "WebRTC / P2P",
  "React & Node.js",
];

const techMarquee = [
  "React",
  "Node.js",
  "Express",
  "Socket.IO",
  "PostgreSQL",
  "MongoDB",
  "WebRTC",
  "Tailwind CSS",
  "Vite",
  "Git",
];

const stats = [
  { value: "24h", label: "Avg response time", description: "During business days", icon: Clock },
  { value: "Open", label: "To opportunities", description: "Freelance, internships, jobs", icon: BriefcaseBusiness },
  { value: "4+", label: "Featured projects", description: "Production-ready work", icon: Code2 },
  { value: "Remote", label: "Working model", description: "India · IST timezone", icon: Globe },
];

const testimonials = [
  {
    quote:
      "Suraj responds quickly, communicates clearly, and ships what he promises. Easy to recommend.",
    author: "Project Mentor",
    role: "Senior Engineer",
    icon: BriefcaseBusiness,
  },
  {
    quote:
      "Working with Suraj was seamless — he understood the brief, asked the right questions, and delivered.",
    author: "Hackathon Teammate",
    role: "Full-Stack Developer",
    icon: Users,
  },
];

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or less.";

  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Email is too long.";
  }

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length < 3) errors.subject = "Subject is too short.";
  else if (subject.length > 180) {
    errors.subject = "Subject must be 180 characters or less.";
  }

  if (!message) errors.message = "Message is required.";
  else if (message.length < 10) {
    errors.message = "Please write a more detailed message.";
  } else if (message.length > 5000) {
    errors.message = "Message must be 5000 characters or less.";
  }

  if (!form.privacyAccepted) {
    errors.privacyAccepted = "Please acknowledge the privacy notice.";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Shared UI primitives (matches Home / About / Skills / Experience) */
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
        <p className="mt-1 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
          {stat.description}
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Form                                                               */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 dark:bg-white/[0.035] dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-white/30";

function Field({ id, label, error, required = false, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
        {required && (
          <span className="ml-1 text-neutral-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactInfoCard({ href, icon: Icon, label, value, external = false }) {
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? {
        href,
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};

  return (
    <Tag
      {...linkProps}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 transition-colors dark:border-white/[0.09] dark:bg-white/[0.025]",
        href && "hover:border-neutral-400 dark:hover:border-white/25"
      )}
    >
      <IconBox icon={Icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <span className="mt-1 block break-all text-sm font-medium text-neutral-900 dark:text-white">
          {value}
        </span>
      </span>
      {href && (
        <ArrowUpRight
          size={16}
          className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-white"
        />
      )}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverMessage, setServerMessage] = useState("");

  // Countdown — seconds remaining before we return to the form
  const [successSecondsLeft, setSuccessSecondsLeft] = useState(5);
  const successTimerRef = useRef(null);

  useEffect(() => {
    document.title = "Contact — Suraj Kumar";
    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  // Cleanup any pending success timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearInterval(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, []);

  /**
   * Start a 5-second countdown shown on the success screen.
   * When it hits 0, automatically return to the form (idle state).
   */
  function startSuccessCountdown() {
    setSuccessSecondsLeft(5);
    if (successTimerRef.current) clearInterval(successTimerRef.current);

    successTimerRef.current = setInterval(() => {
      setSuccessSecondsLeft((prev) => {
        if (prev <= 1) {
          // Countdown finished → return to the contact form
          if (successTimerRef.current) {
            clearInterval(successTimerRef.current);
            successTimerRef.current = null;
          }
          setStatus("idle");
          setServerMessage("");
          setErrors({});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function resetToForm() {
    if (successTimerRef.current) {
      clearInterval(successTimerRef.current);
      successTimerRef.current = null;
    }
    setStatus("idle");
    setServerMessage("");
    setErrors({});
  }

  function handleChange(event) {
  const { name, value, type, checked } = event.target;
  const nextValue = type === "checkbox" ? checked : value;

  setForm((previous) => ({ ...previous, [name]: nextValue }));

  if (errors[name]) {
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }
}

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("🚀 Form submitted!");
    console.log("Form values:", form);
    console.log("Endpoint:", CONTACT_ENDPOINT);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    console.log("Validation errors:", nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      console.log("❌ Validation failed — fix the errors and try again");
      return;
    }

    // Honeypot: silently succeed for bots without hitting the API.
    if (form.website) {
      setStatus("success");
      setServerMessage(
        "Thank you for reaching out. Your message has been received."
      );
      setForm(initialForm);
      startSuccessCountdown();
      return;
    }

    // === Show "Sending..." state immediately ===
    setStatus("loading");
    setServerMessage("");

    try {
      console.log("📡 Sending request to:", CONTACT_ENDPOINT);
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          inquiryType: form.inquiryType || undefined,
          message: form.message.trim(),
          privacyAccepted: form.privacyAccepted,
        }),
      });

      const data = await response.json().catch(() => ({}));
      console.log("📥 Response:", response.status, data);

      if (response.ok && data.success) {
        setStatus("success");
        setServerMessage(
          data.message ||
            "Thank you for reaching out. Your message has been received."
        );
        setForm(initialForm);
        // === Start 5-second countdown, then return to form ===
        startSuccessCountdown();
      } else {
        setStatus("error");
        setServerMessage(
          data.message ||
            "Your message could not be submitted. Please try again or use the contact links."
        );
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setStatus("error");
      setServerMessage(
        "Unable to connect to the server. Please try again or contact me directly by email."
      );
    }
  }

  const fieldClass = (name, extra = "") =>
    cn(
      inputBase,
      errors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-red-800 dark:focus:border-red-500 dark:focus:ring-red-950"
        : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20",
      extra
    );

  const responseTime = useMemo(() => "Usually within 24–48 hours", []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fafafa] text-neutral-900 transition-colors duration-300 dark:bg-[#0b0b0c] dark:text-neutral-100">
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-14">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-neutral-900 dark:text-white">Contact</span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300">
                <Sparkles size={14} />
                Get in touch
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                Let&apos;s build something
                <br />
                <span className="text-neutral-400 dark:text-neutral-500">
                  meaningful together.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg sm:leading-8">
                Have a project idea, development opportunity, or something
                technical to discuss? Tell me what you&apos;re working on.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Send a message <ArrowDownRight size={16} />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                >
                  <Mail size={16} />
                  Email directly
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-400"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TECH MARQUEE                                              */}
      {/* ============================================================ */}
      <section className="overflow-hidden border-b border-neutral-200/80 bg-white/60 py-6 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-12">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
            Working with
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            {techMarquee.map((tech) => (
              <span
                key={tech}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CONTACT DETAILS + FORM                                    */}
      {/* ============================================================ */}
      <section
        id="contact-form"
        className="border-b border-neutral-200/80 dark:border-white/[0.08]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            {/* Left: Info */}
            <Reveal>
              <aside className="space-y-8">
                <div>
                  <SectionLabel>Get in touch</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                    Have something in mind?
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    I&apos;m open to freelance projects, internships and
                    collaborations involving full-stack web development,
                    networking and real-time applications.
                  </p>
                </div>

                <div className="space-y-3">
                  <ContactInfoCard
                    href={`mailto:${profile.email}`}
                    icon={Mail}
                    label="Email"
                    value={profile.email}
                  />
                  <ContactInfoCard
                    href={profile.github}
                    icon={Github}
                    label="GitHub"
                    value="Explore my projects"
                    external
                  />
                  <ContactInfoCard
                    icon={MapPin}
                    label="Location"
                    value={profile.location || "India"}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    Areas of interest
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
                  <div className="flex items-start gap-3">
                    <IconBox icon={BriefcaseBusiness} />
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        What can we discuss?
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                        Web applications, API development, peer-to-peer file
                        sharing, real-time communication and software projects.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-neutral-500 dark:text-neutral-400" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      Response time
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {responseTime}. I usually respond faster on weekdays.
                    For urgent matters, please mention it in the subject line.
                  </p>
                </div>
              </aside>
            </Reveal>

            {/* Right: Form */}
            <Reveal delay={80}>
              <div>
                <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:border-white/[0.09] dark:bg-white/[0.025]">
                  <div className="border-b border-neutral-200/80 px-5 py-5 dark:border-white/[0.08] sm:px-7 sm:py-6">
                    <div className="flex items-center gap-3">
                      <IconBox icon={Send} />
                      <div>
                        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                          Send a message
                        </h2>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Fields marked with * are required.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    {status === "success" ? (
                      <div
                        role="status"
                        aria-live="polite"
                        className="flex min-h-[380px] flex-col items-center justify-center text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                          Successfully sent
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                          {serverMessage}
                        </p>

                        {/* Countdown indicator */}
                        <div className="mt-6 w-full max-w-xs">
                          <div className="mb-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={12} />
                              Returning to form
                            </span>
                            <span className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                              {successSecondsLeft}s
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-linear"
                              style={{
                                width: `${((5 - successSecondsLeft) / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={resetToForm}
                          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                          Send another message
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Honeypot */}
                        <div
                          className="absolute -left-[9999px] h-px w-px overflow-hidden"
                          aria-hidden="true"
                        >
                          <label htmlFor="website">Website</label>
                          <input
                            id="website"
                            name="website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.website}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field id="name" label="Full name" required error={errors.name}>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              placeholder="Your name"
                              value={form.name}
                              onChange={handleChange}
                              className={fieldClass("name")}
                              aria-invalid={!!errors.name}
                              aria-describedby={errors.name ? "name-error" : undefined}
                              maxLength={100}
                            />
                          </Field>

                          <Field id="email" label="Email address" required error={errors.email}>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={handleChange}
                              className={fieldClass("email")}
                              aria-invalid={!!errors.email}
                              aria-describedby={errors.email ? "email-error" : undefined}
                              maxLength={254}
                            />
                          </Field>
                        </div>

                        <Field id="subject" label="Subject" required error={errors.subject}>
                          <input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What would you like to discuss?"
                            value={form.subject}
                            onChange={handleChange}
                            className={fieldClass("subject")}
                            aria-invalid={!!errors.subject}
                            aria-describedby={errors.subject ? "subject-error" : undefined}
                            maxLength={180}
                          />
                        </Field>

                        <Field id="inquiryType" label="Inquiry type">
                          <select
                            id="inquiryType"
                            name="inquiryType"
                            value={form.inquiryType}
                            onChange={handleChange}
                            className={cn(fieldClass("inquiryType"), "cursor-pointer")}
                          >
                            {inquiryTypes.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field id="message" label="Your message" required error={errors.message}>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            placeholder="Share a little context about your idea, project, or opportunity..."
                            value={form.message}
                            onChange={handleChange}
                            className={fieldClass("message", "min-h-[150px] resize-y leading-6")}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            maxLength={5000}
                          />
                          <p className="mt-1.5 text-right text-xs text-neutral-400 dark:text-neutral-500">
                            {form.message.length}/5000
                          </p>
                        </Field>

                        <div>
                          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 transition-colors hover:border-neutral-400 dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/20">
                            <input
                              type="checkbox"
                              name="privacyAccepted"
                              checked={form.privacyAccepted}
                              onChange={handleChange}
                              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 accent-neutral-900 focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:accent-white"
                              aria-invalid={!!errors.privacyAccepted}
                              aria-describedby={
                                errors.privacyAccepted ? "privacy-error" : "privacy-notice"
                              }
                            />
                            <span className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                              I understand that my details will be used to respond
                              to this enquiry.
                              <span className="ml-1 text-neutral-900 dark:text-neutral-100">*</span>
                            </span>
                          </label>

                          {errors.privacyAccepted && (
                            <p
                              id="privacy-error"
                              className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
                              role="alert"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                              {errors.privacyAccepted}
                            </p>
                          )}

                          <p
                            id="privacy-notice"
                            className="mt-3 flex items-start gap-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400"
                          >
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                            Do not include passwords, payment details or other
                            sensitive personal information.
                          </p>
                        </div>

                        {status === "error" && (
                          <div
                            role="alert"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300"
                          >
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <p>{serverMessage}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-700 sm:w-auto sm:min-w-[200px]"
                        >
                          {status === "loading" ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              Sending message…
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              {status === "error" ? "Try again" : "Send message"}
                            </>
                          )}
                        </button>

                        <p className="flex items-center gap-2 text-xs leading-5 text-neutral-500 dark:text-neutral-500">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          Your message is submitted securely to the contact API
                          configured for this portfolio.
                        </p>
                      </form>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3 px-1">
                  <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <p className="text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                    Prefer email? You can also reach me directly at{" "}
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-700 dark:text-neutral-200 dark:decoration-neutral-700 dark:hover:decoration-neutral-300"
                    >
                      {profile.email}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TESTIMONIALS                                              */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 bg-white/60 dark:border-white/[0.08] dark:bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Feedback"
              title="What people say"
              description="A few words from teammates, mentors and peers I've collaborated with."
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 60}>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-white/[0.09] dark:bg-white/[0.025] sm:p-8">
                  <div>
                    <Quote size={28} className="mb-4 text-neutral-300 dark:text-neutral-600" />
                    <p className="text-sm leading-7 text-neutral-700 italic dark:text-neutral-300">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-4 border-t border-neutral-200/80 pt-5 dark:border-white/[0.08]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5">
                      <t.icon size={18} className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {t.author}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FAQ                                                        */}
      {/* ============================================================ */}
      <section className="border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Common questions"
              title="Before you reach out"
              description="A few quick answers that might save you a round-trip email."
            />
          </Reveal>

          <div className="space-y-3">
            {[
              {
                q: "Are you available for freelance projects?",
                a: "Yes — I take on small to mid-sized freelance work involving full-stack web applications, real-time features, or production website work. Share the brief and timeline through the form above.",
              },
              {
                q: "Are you open to internships or junior roles?",
                a: "Yes. I'm interested in internships and junior developer roles where I can contribute meaningfully to a real product while learning from experienced engineers.",
              },
              {
                q: "What's your typical response time?",
                a: "Usually within 24–48 hours on business days. For urgent matters, mention it in the subject line and I'll prioritize.",
              },
              {
                q: "Do you work remotely?",
                a: "Yes, I work remotely from India (IST timezone). I'm comfortable collaborating across timezones with reasonable overlap.",
              },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 50}>
                <details className="group rounded-2xl border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-400 dark:border-white/[0.09] dark:bg-white/[0.025] dark:hover:border-white/25 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-neutral-900 dark:text-white">
                    {item.q}
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-neutral-400 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CTA                                                       */}
      {/* ============================================================ */}
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
                    Ready when you are.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
                    Whether it&apos;s a freelance project, an internship, a
                    junior role, or just a technical question — drop a message
                    and I&apos;ll get back to you soon.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    <Mail size={16} />
                    Email me
                  </a>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/[0.07]"
                  >
                    Explore projects <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200/80 pt-6 text-sm text-neutral-500 dark:border-white/[0.08] dark:text-neutral-400">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <Github size={15} /> GitHub <ExternalLink size={12} />
                </a>
                <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  <ArrowRight size={15} /> About me
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
