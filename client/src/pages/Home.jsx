import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Binary,
  Boxes,
  Briefcase,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Network,
  Plug,
  Server,
  Sparkles,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";

import { profile } from "../data/profile";
import { projects } from "../data/projects";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const featuredProjectIds = ["webdrop", "bambi", "bambisync", "portfolio"];
const projectIcons = [Layers3, MessageSquare, Briefcase, Code2];

// Official brand logos in their exact brand colours: [simple-icons slug, hex]
const LOGOS = {
  React: ["react", "61DAFB"],
  Vite: ["vite", "646CFF"],
  "Tailwind CSS": ["tailwindcss", "06B6D4"],
  JavaScript: ["javascript", "F7DF1E"],
  TypeScript: ["typescript", "3178C6"],
  "Node.js": ["nodedotjs", "5FA04E"],
  Express: ["express", "000000"],
  PostgreSQL: ["postgresql", "4169E1"],
  MongoDB: ["mongodb", "47A248"],
  Supabase: ["supabase", "3FCF8E"],
  "Socket.IO": ["socketdotio", "010101"],
  WebRTC: ["webrtc", "333333"],
  Git: ["git", "F05032"],
  GitHub: ["github", "181717"],
  Postman: ["postman", "FF6C37"],
  Vercel: ["vercel", "000000"],
  Render: ["render", "46E3B7"],
  "C++": ["cplusplus", "00599C"],
};

// Things without an official logo get a grey icon instead
const FALLBACK_ICONS = {
  SQL: Database,
  "REST APIs": Globe,
  WebSockets: Plug,
  DSA: Binary,
  OOP: Boxes,
  DBMS: Database,
  Networks: Network,
};

const stats = [
  { icon: Layers3, value: "10+", label: "Projects" },
  { icon: Code2, value: "300+", label: "DSA problems" },
  { icon: Trophy, value: "100", label: "Day streak" },
  { icon: Globe, value: "Live", label: "Production site" },
];

const layers = [
  { icon: Monitor, title: "Frontend", items: ["React", "Vite", "Tailwind CSS", "JavaScript"] },
  { icon: Server, title: "Backend", items: ["Node.js", "Express", "REST APIs"] },
  { icon: Database, title: "Database", items: ["PostgreSQL", "MongoDB", "Supabase", "SQL"] },
];

const groups = [
  { icon: Zap, title: "Real-time", items: ["Socket.IO", "WebSockets", "WebRTC"] },
  { icon: Cloud, title: "Deployment", items: ["Vercel", "Render"] },
  { icon: Wrench, title: "Dev tools", items: ["Git", "GitHub", "Postman"] },
  { icon: Cpu, title: "Computer science", items: ["C++", "DSA", "OOP", "DBMS", "Networks"] },
];

const services = [
  { icon: Layers3, title: "Full-stack apps", text: "Interface, API and database." },
  { icon: Zap, title: "Real-time features", text: "Chat, live sync, P2P." },
  { icon: Wrench, title: "Site improvements", text: "Bug fixes and new features." },
  { icon: LayoutDashboard, title: "Landing pages", text: "Fast, responsive, clean." },
];

const journey = [
  {
    icon: GraduationCap,
    when: "Ongoing",
    title: "B.Tech, Computer Science",
    place: "Government Engineering College Vaishali",
    tags: ["C++", "DSA", "DBMS", "Networks"],
  },
  {
    icon: Briefcase,
    when: "Professional",
    title: "Web developer at HappyLamb",
    place: "Live production website",
    tags: ["New features", "Bug fixes", "Reliability"],
  },
  {
    icon: Trophy,
    when: "Every day",
    title: "Problem solving",
    place: "LeetCode and GeeksforGeeks",
    tags: ["300+ problems", "100 day streak"],
  },
];

const jumpLinks = [
  { href: "#stack", icon: Layers3, label: "Stack" },
  { href: "#projects", icon: Code2, label: "Projects" },
  { href: "#services", icon: Briefcase, label: "Services" },
  { href: "#about", icon: GraduationCap, label: "Background" },
  { href: "#contact", icon: Mail, label: "Contact" },
];

const learning = ["TypeScript", "Next.js", "System design", "Testing", "Web security"];

const statusIcon = (status) => {
  const s = String(status ?? "").toLowerCase();
  if (/(complete|done|live|deployed)/.test(s)) return CheckCircle2;
  if (/(progress|ongoing|building|wip)/.test(s)) return Clock;
  return Sparkles;
};

/* ------------------------------------------------------------------ */
/* Shared classes                                                      */
/* ------------------------------------------------------------------ */
const card = "rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.04]";
const iconBox =
  "flex shrink-0 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950";

/* ------------------------------------------------------------------ */
/* Tech logo pieces                                                    */
/* ------------------------------------------------------------------ */
function Logo({ name, size = "h-6 w-6", imgSize = "h-[62%] w-[62%]" }) {
  const logo = LOGOS[name];
  const Fallback = FALLBACK_ICONS[name] ?? Code2;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 dark:ring-white/10 ${size}`}>
      {logo ? (
        <img
          src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
          alt=""
          loading="lazy"
          className={imgSize}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <Fallback size={16} className="text-neutral-500" />
      )}
    </span>
  );
}

function Tech({ name }) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
      <Logo name={name} size="h-5 w-5 !rounded-full" />
      {name}
    </li>
  );
}

function TechTile({ name }) {
  return (
    <li className="flex flex-col items-center gap-2.5 rounded-xl bg-neutral-50 px-2 py-4 text-center dark:bg-white/5">
      <Logo name={name} size="h-11 w-11" />
      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{name}</span>
    </li>
  );
}

function TechGrid({ items }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))]">
      {items.map((t) => <TechTile key={t} name={t} />)}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */
function Section({ id, icon: Icon, title, link, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={`h-12 w-12 rounded-2xl ${iconBox}`}>
            <Icon size={22} />
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        </div>
        {link}
      </div>
      {children}
    </section>
  );
}

function TextLink({ to, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${focus}`}
    >
      {children}
    </Link>
  );
}

function FloatBadge({ name, className }) {
  const logo = LOGOS[name];
  return (
    <div className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-neutral-200 dark:ring-white/10 ${className}`}>
      <img
        src={`https://cdn.simpleicons.org/${logo[0]}/${logo[1]}`}
        alt={name}
        className="h-7 w-7"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */
function GroupLabel({ icon: Icon, children }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
      <Icon size={16} />
      {children}
      <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
    </div>
  );
}

function StackSection() {
  return (
    <div>
      <GroupLabel icon={ArrowLeftRight}>Core stack: how data moves through an app</GroupLabel>
      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {layers.map((layer, i) => (
          <Fragment key={layer.title}>
            <div className={`${card} p-5`}>
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-10 w-10 rounded-xl ${iconBox}`}>
                  <layer.icon size={20} />
                </span>
                <h3 className="text-lg font-semibold">{layer.title}</h3>
              </div>
              <TechGrid items={layer.items} />
            </div>
            {i < layers.length - 1 && (
              <div className="flex items-center justify-center text-neutral-400" aria-hidden="true">
                <ArrowLeftRight size={24} className="hidden md:block" />
                <ArrowUpDown size={22} className="md:hidden" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="mt-8">
        <GroupLabel icon={Wrench}>Around the core</GroupLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title} className={`${card} p-5`}>
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-10 w-10 rounded-xl ${iconBox}`}>
                  <g.icon size={20} />
                </span>
                <h3 className="font-semibold">{g.title}</h3>
              </div>
              <TechGrid items={g.items} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <GroupLabel icon={Sparkles}>Learning next</GroupLabel>
        <ul className="flex flex-wrap gap-2.5">
          {learning.map((t) => (
            <li key={t} className="inline-flex items-center gap-2 rounded-full border border-dashed border-neutral-400 px-4 py-2 text-sm font-medium text-neutral-700 dark:border-white/25 dark:text-neutral-300">
              <Sparkles size={13} /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project card                                                        */
/* ------------------------------------------------------------------ */
function ProjectTile({ project, index }) {
  const Icon = projectIcons[index % projectIcons.length];
  const title = project?.title ?? project?.name ?? "Project";
  const description = project?.shortDescription ?? project?.description ?? "";
  const path = project?.slug ? `/projects/${project.slug}` : "/projects";
  const tech = (Array.isArray(project?.technologies) ? project.technologies : project?.techStack ?? [])
    .map((t) => (typeof t === "string" ? t : t?.name ?? t?.title ?? t?.label))
    .filter(Boolean)
    .slice(0, 4);
  const StatusIcon = statusIcon(project?.status);

  return (
    <Link
      to={path}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white ${focus}`}
    >
      <div className="relative flex h-32 items-center justify-center bg-neutral-900 dark:bg-neutral-800">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]"
        />
        <Icon size={44} strokeWidth={1.5} className="relative text-white" />
        {project?.status && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-800">
            <StatusIcon size={12} /> {project.status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <ArrowUpRight size={20} className="mt-1 shrink-0 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-white" />
        </div>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
        )}
        {tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {tech.map((t) => <Tech key={t} name={t} />)}
          </ul>
        )}
      </div>
    </Link>
  );
}

function Photo({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
      className={`w-full rounded-2xl bg-neutral-200 object-cover dark:bg-white/10 ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Suraj Kumar — Full-stack web developer";
    return () => { document.title = prev; };
  }, []);

  const location = profile?.location || "India";
  const all = Array.isArray(projects) ? projects : [];
  const picked = featuredProjectIds.map((id) => all.find((p) => p?.id === id)).filter(Boolean);
  const featured = (picked.length > 0 ? picked : all.slice(0, 4)).slice(0, 4);

  const facts = [
    { icon: MapPin, text: location },
    { icon: GraduationCap, text: "B.Tech CSE" },
    { icon: Briefcase, text: "HappyLamb" },
  ];

  const primaryBtn = `inline-flex min-h-12 items-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 ${focus}`;
  const outlineBtn = `inline-flex min-h-12 items-center gap-2 rounded-full border border-neutral-300 px-6 text-sm font-semibold transition hover:bg-neutral-100 dark:border-white/15 dark:hover:bg-white/5 ${focus}`;

  return (
    <main className="min-h-screen overflow-x-clip bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium dark:border-white/10 dark:bg-white/5">
            <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
            Open to internships and freelance
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            Suraj Kumar,
            <span className="block text-neutral-400 dark:text-neutral-500">full-stack developer.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            From interface to database to deployment.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {facts.map((f) => (
              <li key={f.text} className="inline-flex items-center gap-2 rounded-full bg-neutral-200/70 px-3.5 py-2 text-sm dark:bg-white/10">
                <f.icon size={15} /> {f.text}
              </li>
            ))}
            <li>
              <a
                href="https://github.com/Suraj1819"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-neutral-200/70 px-3.5 py-2 text-sm hover:bg-neutral-300/70 dark:bg-white/10 dark:hover:bg-white/15 ${focus}`}
              >
                <Github size={15} /> Suraj1819
              </a>
            </li>
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/projects" className={primaryBtn}><Layers3 size={16} /> Projects</Link>
            <Link to="/contact" className={outlineBtn}><Mail size={16} /> Contact</Link>
          </div>
        </div>

        {/* Portrait with stack badges */}
        <div className="relative mx-auto w-full max-w-sm px-4">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-200 shadow-xl dark:bg-white/10">
            <img
              src="/suraj.jpg"
              alt="Suraj Kumar"
              onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
              className="h-full w-full object-cover"
            />
          </div>
          <FloatBadge name="React" className="-left-2 top-10" />
          <FloatBadge name="Node.js" className="-right-2 top-20" />
          <FloatBadge name="PostgreSQL" className="-left-4 top-[52%]" />
          <FloatBadge name="Socket.IO" className="-right-3 top-[60%]" />
          <div className="absolute -bottom-5 left-1/2 flex w-[78%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-white p-3.5 text-neutral-900 shadow-xl ring-1 ring-neutral-200 dark:ring-white/10">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <GraduationCap size={20} />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold">B.Tech CSE</p>
              <p className="truncate text-xs text-neutral-500">GEC Vaishali</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jump nav */}
      <nav aria-label="Page sections" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {jumpLinks.map((l) => (
            <li key={l.href} className="shrink-0">
              <a
                href={l.href}
                className={`inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:border-white ${focus}`}
              >
                <l.icon size={15} /> {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`${card} flex items-center gap-4 p-5`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/10">
                <s.icon size={22} />
              </span>
              <div>
                <dd className="text-2xl font-semibold leading-none">{s.value}</dd>
                <dt className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{s.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Stack */}
      <Section
        id="stack"
        icon={Layers3}
        title="My stack"
        link={<TextLink to="/skills">All skills <ArrowRight size={14} /></TextLink>}
      >
        <StackSection />
      </Section>

      {/* Projects */}
      <div className="border-y border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <Section
          id="projects"
          icon={Code2}
          title="Projects"
          link={<TextLink to="/projects">View all <ArrowRight size={14} /></TextLink>}
        >
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((p, i) => (
              <ProjectTile key={p.id ?? p.slug ?? i} project={p} index={i} />
            ))}
          </div>
        </Section>
      </div>

      {/* Services */}
      <Section id="services" icon={Briefcase} title="What I can build">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((sv) => (
            <div key={sv.title} className={`${card} p-6`}>
              <span className={`mb-5 h-12 w-12 rounded-xl ${iconBox}`}>
                <sv.icon size={22} />
              </span>
              <h3 className="font-semibold">{sv.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{sv.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Background */}
      <div id="about" className="border-t border-neutral-200 dark:border-white/10">
        <Section
          icon={GraduationCap}
          title="Background"
          link={<TextLink to="/about">About me <ArrowRight size={14} /></TextLink>}
        >
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
            <ol>
              {journey.map((j, i) => (
                <li key={j.title} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-8 last:pb-0">
                  {i < journey.length - 1 && (
                    <span aria-hidden="true" className="absolute bottom-0 left-6 top-12 w-px -translate-x-1/2 bg-neutral-300 dark:bg-white/20" />
                  )}
                  <span className={`relative z-10 h-12 w-12 rounded-full ${iconBox}`}>
                    <j.icon size={20} />
                  </span>
                  <div className={`${card} p-5`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{j.title}</h3>
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                        {j.when}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{j.place}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {j.tags.map((t) => (
                        <li key={t} className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:text-neutral-300">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className="grid grid-cols-2 gap-4">
              <Photo src="/suraj-2.jpg" alt="Suraj at work" className="col-span-2 aspect-[16/10]" />
              <Photo src="/suraj-3.jpg" alt="Suraj studying" className="aspect-square" />
              <Photo src="/suraj.jpg" alt="Suraj Kumar" className="aspect-square" />
            </div>
          </div>
        </Section>
      </div>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="rounded-[2rem] bg-neutral-900 px-7 py-14 text-white dark:bg-white dark:text-neutral-900 sm:px-14 sm:py-16">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">Let's build something.</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Briefcase, label: "Open to", value: "Internships, freelance" },
              { icon: MapPin, label: "Based in", value: location },
              { icon: Github, label: "GitHub", value: "Suraj1819" },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 dark:bg-neutral-900/5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
                  <c.icon size={20} />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="text-xs opacity-60">{c.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold">{c.value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-700"
            >
              <Mail size={16} /> Send a message
            </Link>
            <a
              href="https://github.com/Suraj1819"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
            >
              <Github size={16} /> GitHub
            </a>
            <Link
              to="/projects"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:border-neutral-900/30 dark:hover:bg-neutral-900/10"
            >
              <Code2 size={16} /> Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}