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
} from "lucide-react";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared classes — matches ProjectDetail.jsx / Projects.jsx           */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox =
  "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const muted = "text-neutral-600 dark:text-neutral-400";
const soft = "text-neutral-500 dark:text-neutral-400";

/* ------------------------------------------------------------------ */
/*  Brand-colored SVG logos (GitHub, LinkedIn, X, Email, HappyLamb)     */
/* ------------------------------------------------------------------ */

function GitHubLogo({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="#181717"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.69.42.36.79 1.08.79 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedInLogo({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="#0A66C2"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.97 0 1.78-.8 1.78-1.76V1.74C24 .78 23.19 0 22.22 0z" />
    </svg>
  );
}

function XLogo({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="#000000"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function HappyLambLogo({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="#F97316"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9.5c0-.55.45-1 1-1s1 .45 1 1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3zm4 0c0-.55.45-1 1-1s1 .45 1 1v3c0 .55-.45 1-1 1s-1-.45-1-1v-3z" fill="#fff" />
    </svg>
  );
}

function GmailLogo({ size = 20, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M24 5.45v13.1c0 .71-.58 1.29-1.29 1.29H20V9.58L12 15.4 4 9.58v10.26H1.29C.58 19.84 0 19.26 0 18.55V5.45c0-.71.58-1.29 1.29-1.29H2L12 11l10-6.84h.71c.71 0 1.29.58 1.29 1.29z" fill="#EA4335" />
      <path d="M0 6.5L12 15l12-8.5v-.55L12 12 0 5.95z" fill="#fff" opacity="0.2" />
    </svg>
  );
}

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
  website: "",
};

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const CONTACT_ENDPOINT = `${API_BASE}/api/v1/contact`;

const socialChannels = [
  {
    href: `mailto:${profile.email}`,
    logo: GmailLogo,
    label: "Email",
    value: profile.email,
    note: "Best for detailed briefs",
    external: true,
  },
  {
    href: profile.github,
    logo: GitHubLogo,
    label: "GitHub",
    value: "@Suraj1819",
    note: "Code & open source work",
    external: true,
  },
  {
    href: "https://linkedin.com",
    logo: LinkedInLogo,
    label: "LinkedIn",
    value: "Connect professionally",
    note: "Career & professional network",
    external: true,
  },
  {
    href: "https://x.com",
    logo: XLogo,
    label: "X (Twitter)",
    value: "@surajzxrt",
    note: "Quick updates & thoughts",
    external: true,
  },
  {
    href: "https://happylamb.in",
    logo: HappyLambLogo,
    label: "HappyLamb",
    value: "happylamb.in",
    note: "Production website",
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location || "Muzaffarpur, Bihar, India",
    note: "Remote · IST timezone",
  },
];

const quickFacts = [
  { icon: Clock, label: "Response time", value: "24–48 hours" },
  { icon: ShieldCheck, label: "Privacy", value: "Secure & private" },
  { icon: Globe, label: "Working model", value: "Remote · India" },
  { icon: Sparkles, label: "Open to", value: "Freelance · Jobs · Internships" },
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
/*  UI primitives                                                      */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  );
}

function IconBox({ icon: Icon, size = "h-11 w-11", iconSize = 20, className = "" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        iconBox,
        size,
        className
      )}
    >
      <Icon size={iconSize} strokeWidth={1.6} />
    </span>
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

function useScrollSpy(ids) {
  const key = ids.join(",");
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!ids.length) return undefined;
    const handler = () => {
      const pos = window.scrollY + 180;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/* ------------------------------------------------------------------ */
/*  Form components                                                    */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-white/40";

function Field({ id, label, error, required = false, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
        {required && (
          <span className="ml-1 text-neutral-500" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className={cn(
            "mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-red-600 dark:text-red-400"
          )}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* Social channel card with brand-colored logo */
function SocialChannel({ channel }) {
  const Tag = channel.href ? "a" : "div";
  const linkProps = channel.href
    ? {
        href: channel.href,
        ...(channel.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      }
    : {};

  return (
    <Tag
      {...linkProps}
      className={cn(card, "group flex items-center gap-4 p-4")}
    >
      {/* Brand-colored logo container */}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
        {channel.logo ? (
          <channel.logo size={22} />
        ) : (
          <channel.icon size={18} className="text-neutral-600 dark:text-neutral-300" strokeWidth={1.6} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs", soft)}>{channel.label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-neutral-900 dark:text-white">
          {channel.value}
        </p>
        <p className={cn("mt-0.5 hidden text-xs sm:block", soft)}>{channel.note}</p>
      </div>
      {channel.href && (
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
    if (successTimerRef.current) clearInterval(successTimerRef.current);

    successTimerRef.current = setInterval(() => {
      setSuccessSecondsLeft((prev) => {
        if (prev <= 1) {
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
    } catch (err) {
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
        ? "border-red-400 focus:border-red-500 dark:border-red-800 dark:focus:border-red-500"
        : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20",
      extra
    );

  // Sidebar sections — form first, then channels, then info
  const sections = useMemo(
    () => [
      { id: "form", label: "Send a message", icon: Send },
      { id: "channels", label: "Connect with me", icon: Globe },
      { id: "info", label: "What to expect", icon: ShieldCheck },
    ],
    []
  );

  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ============ HERO ============ */}
      <section className="relative border-b border-neutral-200 dark:border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(115,115,115,0.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        {/* Padding matches ProjectDetail.jsx hero — pt-10 sm:pt-14 lg:pt-14 */}
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14 lg:px-12 lg:pb-16 lg:pt-14">
          {/* Breadcrumb — matches ProjectDetail.jsx */}
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

          <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
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
                technical to discuss? Fill out the form below — I usually respond
                within 24–48 hours.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#form"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Send a message <ArrowRight size={16} />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:border-white dark:hover:bg-white/5"
                >
                  <Mail size={16} />
                  Email directly
                </a>
              </div>
            </div>

            {/* Quick facts mini-card */}
            <div className={cn(card, "relative z-10 p-5 sm:p-6")}>
              <div className="mb-4 flex items-center gap-3">
                <IconBox icon={Sparkles} size="h-10 w-10" iconSize={18} />
                <div>
                  <p className="text-sm font-semibold">Quick facts</p>
                  <p className={cn("text-xs", soft)}>At a glance</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                {quickFacts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl bg-neutral-50 p-3 dark:bg-white/5"
                  >
                    <dt className={cn("flex items-center gap-1.5 text-[11px]", soft)}>
                      <f.icon size={12} /> {f.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MOBILE SECTION NAV (sticky) ============ */}
      <nav
        aria-label="Sections"
        className="sticky top-16 z-30 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 lg:hidden"
      >
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  active === s.id
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
                )}
              >
                <s.icon size={13} /> {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ CONTENT ============ */}
      <section className="border-b border-neutral-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[230px_1fr] lg:gap-16">
            {/* Sidebar (desktop only) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                <nav aria-label="On this page" className={cn(card, "p-3")}>
                  <p className="px-3 pb-2 pt-1 text-sm font-semibold">On this page</p>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            active === s.id
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"
                          )}
                        >
                          <s.icon size={14} /> {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Quick links card */}
                <div className={cn(card, "p-4")}>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Mail size={14} /> Quick links
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <Mail size={14} /> Email <ExternalLink size={11} />
                      </a>
                    </li>
                    <li>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <GitHubLogo size={14} /> GitHub <ExternalLink size={11} />
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                      >
                        <ArrowRight size={14} /> All projects
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Content column */}
            <div className="min-w-0 max-w-3xl space-y-20">
              {/* ============ FORM (FIRST) ============ */}
              <div id="form" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <span className={cn(iconBox, "flex h-11 w-11 items-center justify-center rounded-xl")}>
                    <Send size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <SectionLabel>Form</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                      Send a message
                    </h2>
                  </div>
                </header>

                <div className={cn(card, "overflow-hidden")}>
                  <div className="border-b border-neutral-200 px-5 py-4 dark:border-white/10 sm:px-7 sm:py-5">
                    <div className="flex items-center gap-3">
                      <IconBox icon={MessageSquare} size="h-9 w-9" iconSize={16} />
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
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
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
                          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
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
                            <span className={cn("text-sm leading-6", muted)}>
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
                            className={cn("mt-3 flex items-start gap-2 text-xs leading-5", soft)}
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
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* ============ CONNECT WITH ME (brand-colored logos) ============ */}
              <div id="channels" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <span className={cn(iconBox, "flex h-11 w-11 items-center justify-center rounded-xl")}>
                    <Globe size={20} strokeWidth={1.6} />
                  </span>
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

              {/* ============ WHAT TO EXPECT ============ */}
              <div id="info" className="scroll-mt-28">
                <header className="mb-6 flex items-center gap-3.5">
                  <span className={cn(iconBox, "flex h-11 w-11 items-center justify-center rounded-xl")}>
                    <ShieldCheck size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <SectionLabel>What to expect</SectionLabel>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-3xl">
                      Quick facts
                    </h2>
                  </div>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={cn(card, "p-5")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={Clock} size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Response time</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Usually within 24–48 hours on business days. For urgent
                      matters, mention it in the subject line and I&apos;ll
                      prioritize.
                    </p>
                  </div>

                  <div className={cn(card, "p-5")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={MessageSquare} size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">What to include</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Brief context, scope, timeline, and any relevant links.
                      The more detail you share, the better I can respond.
                    </p>
                  </div>

                  <div className={cn(card, "p-5")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={ShieldCheck} size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Privacy</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Your details are used only to respond to your enquiry.
                      No spam, no third-party sharing.
                    </p>
                  </div>

                  <div className={cn(card, "p-5")}>
                    <div className="mb-3 flex items-center gap-3">
                      <IconBox icon={Globe} size="h-9 w-9" iconSize={16} />
                      <p className="text-sm font-semibold">Working model</p>
                    </div>
                    <p className={cn("text-sm leading-7", muted)}>
                      Remote from India (IST timezone). Comfortable collaborating
                      across timezones with reasonable overlap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className={cn(card, "p-6 sm:p-10 lg:p-12")}>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Sparkles size={21} />
                </div>
                <SectionLabel>Let&apos;s connect</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-4xl">
                  Ready when you are.
                </h2>
                <p className={cn("mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base")}>
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:border-white dark:hover:bg-white/5"
                >
                  Explore projects <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <GitHubLogo size={15} /> GitHub <ExternalLink size={12} />
              </a>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
              >
                <LinkedInLogo size={15} /> LinkedIn <ExternalLink size={12} />
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
        </div>
      </section>
    </main>
  );
}
