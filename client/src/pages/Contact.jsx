import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Home as HomeIcon,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  BriefcaseBusiness,
  Code2,
  Linkedin,
  Github,
} from "lucide-react";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";

const card =
  "rounded-2xl border border-neutral-200 bg-white transition-colors duration-300 dark:border-white/10 dark:bg-neutral-900/60";

const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

const tones = {
  sky: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  violet:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
  orange:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300",
  neutral:
    "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-white/10 dark:bg-white/[0.07] dark:text-neutral-300",
};

function IconBox({
  icon: Icon,
  tone = "neutral",
  size = "h-11 w-11",
  iconSize = 20,
  className = "",
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border",
        tones[tone] || tones.neutral,
        size,
        className
      )}
    >
      <Icon size={iconSize} strokeWidth={1.7} />
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.17em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function useScrollSpy(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!ids.length) return undefined;

    const handler = () => {
      const position = window.scrollY + 180;

      for (let i = ids.length - 1; i >= 0; i--) {
        const element = document.getElementById(ids[i]);

        if (element && element.offsetTop <= position) {
          setActive(ids[i]);
          return;
        }
      }

      setActive(ids[0]);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, [key]);

  return active;
}

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
  website: "",
};

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const CONTACT_ENDPOINT = `${API_BASE}/api/v1/contact`;

const socialChannels = [
  {
    href: `mailto:${profile.email}`,
    icon: Mail,
    label: "Email",
    value: profile.email,
    note: "Best for detailed briefs",
    tone: "orange",
  },
  {
    href: profile.github || "https://github.com/Suraj1819",
    icon: Github,
    label: "GitHub",
    value: "@Suraj1819",
    note: "Code and open-source work",
    tone: "neutral",
  },
  {
    href: profile.linkedin || "https://www.linkedin.com/in/suraj1819",
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect professionally",
    note: "Career and professional network",
    tone: "sky",
  },
  {
    href: "https://x.com",
    icon: ArrowUpRight,
    label: "X (Twitter)",
    value: "@surajzxrt",
    note: "Quick updates and thoughts",
    tone: "neutral",
  },
  {
    href: "https://happylamb.in",
    icon: BriefcaseBusiness,
    label: "HappyLamb",
    value: "happylamb.in",
    note: "Production website",
    tone: "orange",
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location || "Muzaffarpur, Bihar, India",
    note: "Remote · IST timezone",
    tone: "emerald",
  },
];

const quickFacts = [
  {
    icon: Clock,
    label: "Response time",
    value: "24–48 hours",
    tone: "sky",
  },
  {
    icon: ShieldCheck,
    label: "Privacy",
    value: "Secure and private",
    tone: "emerald",
  },
  {
    icon: Globe,
    label: "Working model",
    value: "Remote · India",
    tone: "violet",
  },
  {
    icon: Sparkles,
    label: "Open to",
    value: "Freelance · Jobs · Internships",
    tone: "amber",
  },
];

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) {
    errors.name = "Name must be 100 characters or less.";
  }

  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Email is too long.";
  }

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length < 3) {
    errors.subject = "Subject is too short.";
  } else if (subject.length > 180) {
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

function Field({
  id,
  label,
  error,
  required = false,
  className = "",
  children,
}) {
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

function SocialChannel({ channel }) {
  const Icon = channel.icon;
  const Tag = channel.href ? "a" : "div";

  const linkProps = channel.href
    ? {
        href: channel.href,
        ...(channel.href.startsWith("mailto:")
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" }),
      }
    : {};

  return (
    <Tag
      {...linkProps}
      className={cn(
        card,
        "group flex items-center gap-4 p-4",
        channel.href &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:hover:border-white/20"
      )}
    >
      <IconBox icon={Icon} tone={channel.tone} />

      <div className="min-w-0 flex-1">
        <p className={cn("text-xs", soft)}>{channel.label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900 dark:text-white">
          {channel.value}
        </p>

        <p className={cn("mt-1 hidden text-xs sm:block", soft)}>
          {channel.note}
        </p>
      </div>

      {channel.href && (
        <ArrowUpRight
          size={16}
          className="shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-800 dark:group-hover:text-white"
        />
      )}
    </Tag>
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [successSecondsLeft, setSuccessSecondsLeft] = useState(5);
  const successTimerRef = useRef(null);

  useEffect(() => {
    document.title = "Contact — Suraj Kumar";

    return () => {
      document.title = "Suraj Kumar — Full-Stack Web Developer";
    };
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearInterval(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, []);

  function startSuccessCountdown() {
    setSuccessSecondsLeft(5);

    if (successTimerRef.current) {
      clearInterval(successTimerRef.current);
    }

    successTimerRef.current = setInterval(() => {
      setSuccessSecondsLeft((previous) => {
        if (previous <= 1) {
          if (successTimerRef.current) {
            clearInterval(successTimerRef.current);
            successTimerRef.current = null;
          }

          setStatus("idle");
          setServerMessage("");
          setErrors({});
          return 0;
        }

        return previous - 1;
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

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

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

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (form.website) {
      setStatus("success");
      setServerMessage(
        "Thank you for reaching out. Your message has been received."
      );
      setForm(initialForm);
      startSuccessCountdown();
      return;
    }

    setStatus("loading");
    setServerMessage("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      if (response.ok && data.success) {
        setStatus("success");
        setServerMessage(
          data.message ||
            "Thank you for reaching out. Your message has been received."
        );
        setForm(initialForm);
        startSuccessCountdown();
      } else {
        setStatus("error");
        setServerMessage(
          data.message ||
            "Your message could not be submitted. Please try again or use the contact links."
        );
      }
    } catch {
      setStatus("error");
      setServerMessage(
        "Unable to connect to the server. Please try again or contact me directly by email."
      );
    }
  }

  const fieldClass = (name, extra = "") =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-white/30 dark:focus:ring-white/5",
      errors[name]
        ? "border-red-400 focus:border-red-500 dark:border-red-800"
        : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20",
      extra
    );

  const sections = useMemo(
    () => [
      { id: "form", label: "Send a message", icon: Send, tone: "sky" },
      { id: "channels", label: "Connect with me", icon: Globe, tone: "violet" },
      { id: "info", label: "What to expect", icon: ShieldCheck, tone: "emerald" },
    ],
    []
  );

  const active = useScrollSpy(sections.map((section) => section.id));

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="relative border-b border-neutral-200 dark:border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14 lg:px-12 lg:pb-16">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <Link
              to="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <HomeIcon size={14} />
              Home
            </Link>

            <ChevronRight size={14} className="shrink-0" />

            <span className="font-medium text-neutral-900 dark:text-white">
              Contact
            </span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
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
                technical to discuss? Fill out the form below — I usually
                respond within 24–48 hours.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#form"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-700"
                >
                  Send a message
                  <ArrowRight size={16} />
                </a>

                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/5"
                >
                  <IconBox icon={Mail} tone="orange" size="h-6 w-6" iconSize={13} />
                  Email directly
                </a>
              </div>
            </div>

            <div className={cn(card, "relative z-10 p-5 sm:p-6")}>
              <div className="mb-4 flex items-center gap-3">
                <IconBox icon={Sparkles} tone="violet" size="h-10 w-10" iconSize={18} />
                <div>
                  <p className="text-sm font-semibold">Quick facts</p>
                  <p className={cn("text-xs", soft)}>At a glance</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-white/5 dark:bg-white/[0.03]"
                  >
                    <dt className={cn("flex items-center gap-1.5 text-[11px]", soft)}>
                      <IconBox
                        icon={fact.icon}
                        tone={fact.tone}
                        size="h-6 w-6"
                        iconSize={12}
                      />
                      <span>{fact.label}</span>
                    </dt>

                    <dd className="mt-2 text-sm font-semibold leading-5 text-neutral-900 dark:text-white">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Contact page sections"
        className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90 lg:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
                    active === section.id
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08]"
                  )}
                >
                  <Icon size={13} />
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">
                    On this page
                  </p>

                  <ul className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;

                      return (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                              active === section.id
                                ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                            )}
                          >
                            <Icon size={15} />
                            {section.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className={cn(card, "p-4")}>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <IconBox icon={Mail} tone="orange" size="h-8 w-8" iconSize={15} />
                    Quick links
                  </p>

                  <ul className="space-y-3 text-sm">
                    <li>
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 text-neutral-700 transition hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-300"
                      >
                        <Mail size={14} />
                        Email
                        <ExternalLink size={11} />
                      </a>
                    </li>

                    <li>
                      <a
                        href={profile.github || "https://github.com/Suraj1819"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <Github size={14} />
                        GitHub
                        <ExternalLink size={11} />
                      </a>
                    </li>

                    <li>
                      <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-neutral-700 transition hover:text-violet-600 dark:text-neutral-300 dark:hover:text-violet-300"
                      >
                        <Code2 size={14} />
                        All projects
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            <div className="min-w-0 max-w-3xl space-y-20">
              <div id="form" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <IconBox icon={Send} tone="sky" />

                  <div>
                    <SectionLabel>Contact form</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                      Send a message
                    </h2>
                  </div>
                </header>

                <div className={cn(card, "overflow-hidden")}>
                  <div className="border-b border-neutral-200 px-5 py-4 dark:border-white/10 sm:px-7 sm:py-5">
                    <div className="flex items-center gap-3">
                      <IconBox
                        icon={MessageSquare}
                        tone="violet"
                        size="h-9 w-9"
                        iconSize={16}
                      />

                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Tell me about your project
                        </p>
                        <p className={cn("text-xs", soft)}>
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
                        <IconBox
                          icon={CheckCircle2}
                          tone="emerald"
                          size="h-16 w-16"
                          iconSize={32}
                          className="rounded-2xl"
                        />

                        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                          Successfully sent
                        </h3>

                        <p className={cn("mt-3 max-w-sm text-sm leading-7", muted)}>
                          {serverMessage}
                        </p>

                        <div className="mt-6 w-full max-w-xs">
                          <div className="mb-2 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={12} />
                              Returning to form
                            </span>

                            <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
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
                          <Field
                            id="name"
                            label="Full name"
                            required
                            error={errors.name}
                          >
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

                          <Field
                            id="email"
                            label="Email address"
                            required
                            error={errors.email}
                          >
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

                        <Field
                          id="subject"
                          label="Subject"
                          required
                          error={errors.subject}
                        >
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

                        <Field
                          id="message"
                          label="Your message"
                          required
                          error={errors.message}
                        >
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            placeholder="Share a little context about your idea, project, or opportunity..."
                            value={form.message}
                            onChange={handleChange}
                            className={fieldClass(
                              "message",
                              "min-h-[150px] resize-y leading-6"
                            )}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            maxLength={5000}
                          />

                          <p className="mt-1.5 text-right text-xs text-neutral-400 dark:text-neutral-500">
                            {form.message.length}/5000
                          </p>
                        </Field>

                        <div>
                          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-emerald-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-500/30">
                            <input
                              type="checkbox"
                              name="privacyAccepted"
                              checked={form.privacyAccepted}
                              onChange={handleChange}
                              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 accent-emerald-600 focus:ring-2 focus:ring-emerald-400 dark:border-neutral-700 dark:accent-emerald-400"
                              aria-invalid={!!errors.privacyAccepted}
                              aria-describedby={
                                errors.privacyAccepted
                                  ? "privacy-error"
                                  : "privacy-notice"
                              }
                            />

                            <span className={cn("text-sm leading-6", muted)}>
                              I understand that my details will be used to respond
                              to this enquiry.
                              <span className="ml-1 text-neutral-900 dark:text-neutral-100">
                                *
                              </span>
                            </span>
                          </label>

                          {errors.privacyAccepted && (
                            <p
                              id="privacy-error"
                              className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400"
                              role="alert"
                            >
                              <AlertCircle size={14} />
                              {errors.privacyAccepted}
                            </p>
                          )}

                          <p
                            id="privacy-notice"
                            className={cn("mt-3 flex items-start gap-2 text-xs leading-5", soft)}
                          >
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
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
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div id="channels" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <IconBox icon={Globe} tone="violet" />

                  <div>
                    <SectionLabel>Or find me on</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                      Connect with me
                    </h2>
                  </div>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialChannels.map((channel) => (
                    <SocialChannel key={channel.label} channel={channel} />
                  ))}
                </div>
              </div>

              <div id="info" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <IconBox icon={ShieldCheck} tone="emerald" />

                  <div>
                    <SectionLabel>What to expect</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                      Quick facts
                    </h2>
                  </div>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={cn(card, "p-5 hover:border-sky-200 dark:hover:border-sky-500/20")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={Clock} tone="sky" size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Response time</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Usually within 24–48 hours on business days. For urgent
                      matters, mention it in the subject line.
                    </p>
                  </div>

                  <div className={cn(card, "p-5 hover:border-violet-200 dark:hover:border-violet-500/20")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={MessageSquare} tone="violet" size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">What to include</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Brief context, scope, timeline, and relevant links. More
                      detail helps me provide a useful response.
                    </p>
                  </div>

                  <div className={cn(card, "p-5 hover:border-emerald-200 dark:hover:border-emerald-500/20")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={ShieldCheck} tone="emerald" size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Privacy</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Your details are used to respond to your enquiry. Avoid
                      sending passwords or other sensitive information.
                    </p>
                  </div>

                  <div className={cn(card, "p-5 hover:border-amber-200 dark:hover:border-amber-500/20")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={Globe} tone="amber" size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Working model</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Remote from India (IST timezone). Comfortable
                      collaborating across timezones with reasonable overlap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className={cn(card, "p-6 sm:p-10 lg:p-12")}>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
              <div className="max-w-2xl">
                <IconBox
                  icon={Sparkles}
                  tone="violet"
                  size="h-12 w-12"
                  iconSize={21}
                  className="mb-5 rounded-2xl"
                />

                <SectionLabel>Let&apos;s connect</SectionLabel>

                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                  Ready when you are.
                </h2>

                <p className={cn("mt-4 max-w-xl text-sm leading-7 sm:text-base", muted)}>
                  Whether it&apos;s a freelance project, an internship, a junior
                  role, or a technical question — drop a message and I&apos;ll
                  get back to you soon.
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:border-white/25 dark:hover:bg-white/5"
                >
                  Explore projects
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              <a
                href={profile.github || "https://github.com/Suraj1819"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <Github size={15} />
                GitHub
                <ExternalLink size={12} />
              </a>

              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />

              <a
                href={profile.linkedin || "https://www.linkedin.com/in/suraj1819"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-sky-600 dark:hover:text-sky-300"
              >
                <Linkedin size={15} />
                LinkedIn
                <ExternalLink size={12} />
              </a>

              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />

              <Link
                to="/about"
                className="inline-flex items-center gap-2 transition-colors hover:text-violet-600 dark:hover:text-violet-300"
              >
                <ArrowRight size={15} />
                About me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}