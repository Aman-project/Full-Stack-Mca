import React, { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Database,
  FileCode2,
  GraduationCap,
  Layers,
  MapPin,
  Send,
  ShieldCheck
} from 'lucide-react';

const CASE_STUDIES = [
  {
    id: 'magic-notes',
    index: '01',
    title: 'Magic Notes & notesNexus',
    sector: 'Academic Cloud Platform',
    year: '2026',
    stack: ['React', 'Tailwind CSS', 'Firebase Storage', 'Web3Forms', 'Vercel', 'Netlify'],
    summary:
      'Academic note repository and search workspace built as an undergraduate capstone at GLA University and deployed across Vercel and Netlify.',
    challenge:
      'Lecture files, reference notes, and study materials were scattered across unstructured folders, making fast retrieval difficult before exams.',
    execution:
      'Structured a React + Tailwind CSS interface integrated with Firebase Storage for asset uploads and search, paired with Web3Forms for inquiries and multi-host deployments.',
    impact:
      'Delivered a fast, organized note hub with cloud file persistence and production deployments on Vercel and Netlify.'
  },
  {
    id: 'air-drawing',
    index: '02',
    title: 'Air Drawing Webcam Canvas',
    sector: 'Browser Vision & Canvas',
    year: '2026',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'MediaPipe Hands', 'Canvas 2D'],
    summary:
      'Lightweight browser-based drawing application using pure HTML, CSS, JavaScript, and MediaPipe Hands for real-time webcam index-finger tracking.',
    challenge:
      'Enabling smooth mid-air drawing from a standard webcam without heavy desktop dependencies or laggy pointer interpolation.',
    execution:
      'Built a lean single-file browser implementation that tracks hand landmarks via MediaPipe Hands and maps index-finger motion onto an HTML5 Canvas.',
    impact:
      'Proved real-time webcam gesture drawing in the browser with zero external framework overhead.'
  },
  {
    id: 'appsketch',
    index: '03',
    title: 'AppSketch Template Builder UI',
    sector: 'Design Systems & Motion',
    year: '2026',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'CSS @container Queries'],
    summary:
      'Modular UI components, scroll-driven animations, and vector logo animations for an AI and drag-and-drop website builder.',
    challenge:
      'Template sections must adapt cleanly to variable container widths inside a drag-and-drop canvas rather than relying solely on viewport breakpoints.',
    execution:
      'Authored modular React/Next.js sections using CSS @container queries, responsive grids, scroll-driven transitions, and animated logo marks.',
    impact:
      'Created adaptable, reusable UI blocks tailored for dynamic template assembly and smooth motion.'
  },
  {
    id: 'ambucare',
    index: '04',
    title: 'AmbuCare Booking Architecture',
    sector: 'Geolocation & System Design',
    year: '2025',
    stack: ['JavaScript', 'Browser Geolocation API', 'OpenStreetMap', 'LocalStorage'],
    summary:
      'Ambulance booking system design featuring Level-0 and Level-1 Data Flow Diagrams alongside Browser Geolocation, OpenStreetMap, and LocalStorage.',
    challenge:
      'Mapping clear data boundaries and real-time location capture for an emergency booking workflow.',
    execution:
      'Modeled Level-0 and Level-1 Data Flow Diagrams while pairing browser geolocation and OpenStreetMap routing with local browser state persistence.',
    impact:
      'Established a clear architectural blueprint and location-aware booking flow.'
  },
  {
    id: 'meesho-collage',
    index: '05',
    title: 'Meesho Product Collage UI',
    sector: 'Commerce Merchandising',
    year: '2026',
    stack: ['React', 'CSS Grid', 'Tailwind CSS', 'Mobile-First UI'],
    summary:
      'Modular UI sections, mobile-first responsive layouts, and structured e-commerce product collages built with CSS Grid and Tailwind CSS.',
    challenge:
      'Presenting multi-item product collages cleanly across small mobile screens and wider layouts without visual clutter.',
    execution:
      'Designed mobile-first CSS Grid collages and modular storefront sections with clear visual hierarchy and predictable spacing.',
    impact:
      'Achieved balanced, scannable product grids across screen sizes.'
  },
  {
    id: 'gd-subway-food',
    index: '06',
    title: 'GdSubwayFood & Frontend PRs',
    sector: 'PostgreSQL & Collaborative UI',
    year: '2026',
    stack: ['Supabase', 'PostgreSQL', 'GitHub', 'React', 'TypeScript'],
    summary:
      'Cloud-hosted PostgreSQL database project named GdSubwayFood on Supabase alongside UI component and page pull requests on aiktech-frontend.',
    challenge:
      'Maintaining structured cloud database records while contributing clean, consistent UI components in a shared codebase.',
    execution:
      'Managed relational PostgreSQL tables on Supabase for GdSubwayFood and submitted modular interface pull requests to aiktech-frontend.',
    impact:
      'Combined cloud database management with collaborative frontend delivery.'
  }
];

const STACK_DOMAINS = [
  {
    category: 'Frontend & Interface',
    icon: Layers,
    entries: [
      {
        title: 'React, Next.js & TypeScript',
        detail: 'Modular component architecture, typed props, stateful UI flows, and full-stack web apps.'
      },
      {
        title: 'Tailwind CSS, CSS Grid & @container Queries',
        detail: 'Mobile-first responsive design prioritizing container queries and structured grid systems.'
      },
      {
        title: 'HTML5, Canvas & Motion',
        detail: 'Semantic markup, scroll-driven animations, logo motion, and MediaPipe webcam drawing.'
      }
    ]
  },
  {
    category: 'Backend, Cloud & Data',
    icon: Database,
    entries: [
      {
        title: 'Firebase & Supabase (PostgreSQL)',
        detail: 'Firebase Storage for files and media alongside cloud-hosted PostgreSQL databases on Supabase.'
      },
      {
        title: 'Node.js & Express.js',
        detail: 'RESTful routing, JSON file persistence, form/API handling, and structured server endpoints.'
      },
      {
        title: 'Vercel, Netlify & Developer APIs',
        detail: 'Cloud deployments, GitHub workflows, OpenStreetMap, Geolocation, GroqCloud, and OpenWeatherMap.'
      }
    ]
  },
  {
    category: 'CS Foundations & Credentials',
    icon: ShieldCheck,
    entries: [
      {
        title: 'MCA @ GLA University, Mathura',
        detail: 'Building on an undergraduate degree from GLA University with graduate studies in computer applications.'
      },
      {
        title: 'Core Java & Data Structures',
        detail: 'Strengthening control flow, logic building, algorithms, and quantitative problem solving.'
      },
      {
        title: 'Google Cloud Skills Boost & WSA',
        detail: 'Hands-on Arcade Facilitator labs/skill badges and MERN Stack internship screening assessments.'
      }
    ]
  }
];

const DISCIPLINES = [
  {
    label: 'Lightweight Single-File Craft',
    note: 'Prefers lean, single-file implementations without unnecessary external dependencies for browser utilities and Dart scripts.'
  },
  {
    label: 'Spoken English & Interview Prep',
    note: 'Practices spoken fluency and clarity by reading newspaper articles aloud on camera and working through mock interviews.'
  },
  {
    label: 'Urdu Script Literacy',
    note: 'Actively building reading and writing fluency in Urdu beyond the Alif-Be alphabet across two- and three-letter words.'
  },
  {
    label: 'Systems & Quantitative Logic',
    note: 'Explores statistical estimation, ML concepts, algorithmic GCD/LCM, linear systems, and workflow automation.'
  }
];

export default function App() {
  const [activeStudyId, setActiveStudyId] = useState('magic-notes');
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleType: 'Frontend / React Engineering',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const currentStudy =
    CASE_STUDIES.find(item => item.id === activeStudyId) || CASE_STUDIES[0];
  const currentDomain = STACK_DOMAINS[activeDomainIdx] || STACK_DOMAINS[0];
  const DomainIcon = currentDomain.icon;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('aman.usmani.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', roleType: 'Frontend / React Engineering', message: '' });
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <div id="top" className="min-h-screen bg-[#14110f] text-[#f5efe6]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#14110f]/90 backdrop-blur-md border-b border-[#d8cbb8]/15">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-baseline gap-3">
            <span className="text-lg font-bold tracking-tight text-[#f5efe6]">Aman Usmani</span>
            <span className="hidden sm:inline text-xs tracking-wide text-[#c59b43]">
              MCA · GLA University
            </span>
          </a>

          <nav className="flex items-center gap-5 sm:gap-7 text-sm text-[#9e9488]">
            <a href="#work" className="hover:text-[#f5efe6] transition-colors">
              Case Studies
            </a>
            <a href="#stack" className="hover:text-[#f5efe6] transition-colors">
              Stack
            </a>
            <a href="#practice" className="hover:text-[#f5efe6] transition-colors">
              Practice
            </a>
            <a
              href="#contact"
              className="px-4 py-1.5 rounded-full border border-[#c59b43]/60 text-[#f5efe6] hover:bg-[#c59b43] hover:text-[#14110f] font-medium transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-24">
        {/* =========================================================
            HERO & EXECUTIVE PROFILE SUMMARY
            ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1916] border border-[#d8cbb8]/15 text-xs text-[#d8cbb8]">
              <MapPin className="w-3.5 h-3.5 text-[#c59b43]" />
              <span>Vrindavan, Uttar Pradesh · MCA @ GLA University, Mathura</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f5efe6] leading-[1.08]">
              Frontend &amp; full-stack engineering with{' '}
              <span className="text-[#c59b43]">measured craft</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#9e9488] max-w-2xl leading-relaxed">
              I am <strong className="text-[#f5efe6] font-semibold">Aman Usmani</strong>, a Master of Computer
              Applications candidate at GLA University focused on React, Next.js, TypeScript, Tailwind CSS, CSS
              @container queries, and cloud-backed applications using Firebase and Supabase.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c59b43] text-[#14110f] font-semibold text-sm hover:bg-[#d8cbb8] transition-colors"
              >
                <span>Inspect Case Studies</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1e1916] border border-[#d8cbb8]/20 text-[#f5efe6] text-sm hover:border-[#c59b43] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#c59b43]" />
                    <span className="text-[#c59b43]">Email Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#9e9488]" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Fact Sheet */}
          <div className="lg:col-span-4 rounded-2xl bg-[#1e1916] border border-[#d8cbb8]/15 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#d8cbb8]/12 pb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#c59b43]">Profile Dossier</div>
                <div className="text-base font-semibold text-[#f5efe6] mt-0.5">Aman Usmani</div>
              </div>
              <GraduationCap className="w-5 h-5 text-[#c59b43]" />
            </div>

            <dl className="space-y-3.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#9e9488]">Program</dt>
                <dd className="text-right font-medium text-[#f5efe6]">MCA (GLA University)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9e9488]">Core Stack</dt>
                <dd className="text-right font-medium text-[#d8cbb8]">React · Next.js · TS</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9e9488]">Persistence</dt>
                <dd className="text-right font-medium text-[#d8cbb8]">Firebase · Supabase</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9e9488]">CS &amp; Cloud</dt>
                <dd className="text-right font-medium text-[#d8cbb8]">Java · DSA · GCP Labs</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* =========================================================
            01. INTERACTIVE PROJECT CASE-STUDY DOSSIER
            ========================================================= */}
        <section id="work" className="space-y-8">
          <div className="border-b border-[#d8cbb8]/15 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c59b43]">01 · Selected Work</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5efe6] mt-1">
                Project Case Studies
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#9e9488]">
              Select a project index to review scope, architecture, and outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Project Selector List */}
            <div className="lg:col-span-5 space-y-2.5">
              {CASE_STUDIES.map(study => {
                const selected = study.id === currentStudy.id;
                return (
                  <button
                    key={study.id}
                    type="button"
                    onClick={() => setActiveStudyId(study.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      selected
                        ? 'bg-[#1e1916] border-[#c59b43] text-[#f5efe6]'
                        : 'bg-[#1e1916]/45 border-[#d8cbb8]/10 text-[#9e9488] hover:text-[#f5efe6] hover:border-[#d8cbb8]/25'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#c59b43] font-semibold">{study.index}</span>
                        <span>·</span>
                        <span className="truncate">{study.sector}</span>
                      </div>
                      <div className="font-semibold text-sm sm:text-base text-[#f5efe6] truncate mt-0.5">
                        {study.title}
                      </div>
                    </div>
                    <span className="text-xs text-[#9e9488] shrink-0">{study.year}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Case Study Detail Panel */}
            <article className="lg:col-span-7 rounded-2xl bg-[#1e1916] border border-[#d8cbb8]/15 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d8cbb8]/12 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c59b43]">
                    Case {currentStudy.index} · {currentStudy.sector}
                  </span>
                  <h3 className="text-2xl font-bold text-[#f5efe6] mt-1">{currentStudy.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#14110f] border border-[#d8cbb8]/15 text-xs text-[#d8cbb8]">
                  {currentStudy.year}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#d8cbb8] leading-relaxed">{currentStudy.summary}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#14110f] border border-[#d8cbb8]/10 p-4 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#c59b43]">
                    Problem Context
                  </div>
                  <p className="text-xs sm:text-sm text-[#9e9488] leading-relaxed">
                    {currentStudy.challenge}
                  </p>
                </div>

                <div className="rounded-xl bg-[#14110f] border border-[#d8cbb8]/10 p-4 space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#d8cbb8]">
                    Implementation
                  </div>
                  <p className="text-xs sm:text-sm text-[#9e9488] leading-relaxed">
                    {currentStudy.execution}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#14110f] border border-[#d8cbb8]/10 p-4 space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#c59b43]">
                  Outcome
                </div>
                <p className="text-xs sm:text-sm text-[#f5efe6]/90 leading-relaxed">{currentStudy.impact}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {currentStudy.stack.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-[#14110f] border border-[#d8cbb8]/15 text-xs text-[#d8cbb8]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* =========================================================
            02. TECHNICAL STACK & CREDENTIALS
            ========================================================= */}
        <section id="stack" className="space-y-8">
          <div className="border-b border-[#d8cbb8]/15 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c59b43]">
                02 · Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5efe6] mt-1">
                Technical Stack &amp; Background
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {STACK_DOMAINS.map((dom, idx) => {
                const active = idx === activeDomainIdx;
                return (
                  <button
                    key={dom.category}
                    type="button"
                    onClick={() => setActiveDomainIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#c59b43] text-[#14110f] font-semibold'
                        : 'bg-[#1e1916] text-[#9e9488] border border-[#d8cbb8]/15 hover:text-[#f5efe6]'
                    }`}
                  >
                    {dom.category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1e1916] border border-[#d8cbb8]/15 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#14110f] border border-[#d8cbb8]/15 text-[#c59b43]">
                <DomainIcon className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold text-[#f5efe6]">{currentDomain.category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {currentDomain.entries.map(entry => (
                <div
                  key={entry.title}
                  className="rounded-xl bg-[#14110f] border border-[#d8cbb8]/10 p-5 space-y-2"
                >
                  <div className="text-sm font-semibold text-[#f5efe6]">{entry.title}</div>
                  <p className="text-xs sm:text-sm text-[#9e9488] leading-relaxed">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            03. PRACTICE, STUDY HABITS & CONTINUOUS LEARNING
            ========================================================= */}
        <section id="practice" className="space-y-8">
          <div className="border-b border-[#d8cbb8]/15 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c59b43]">
                03 · Working Habits
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5efe6] mt-1">
                Engineering &amp; Study Practice
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#9e9488]">
              <BookOpen className="w-4 h-4 text-[#c59b43]" />
              Consistent daily refinement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DISCIPLINES.map(item => (
              <div
                key={item.label}
                className="rounded-2xl bg-[#1e1916] border border-[#d8cbb8]/15 p-5 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c59b43]">
                  <FileCode2 className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#9e9488] leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            04. DIRECT INQUIRY
            ========================================================= */}
        <section id="contact" className="rounded-2xl bg-[#1e1916] border border-[#d8cbb8]/15 p-7 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#c59b43]">04 · Contact</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5efe6]">
                Discuss a Role or Build
              </h2>
              <p className="text-sm text-[#9e9488] leading-relaxed">
                Available for frontend engineering roles, React and Next.js builds, full-stack web projects, and
                internship opportunities.
              </p>
              <div className="pt-2 text-xs text-[#d8cbb8] space-y-1.5">
                <div>Location: Vrindavan, Uttar Pradesh, India</div>
                <div>Academic Base: GLA University, Mathura</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block text-xs text-[#d8cbb8] mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#d8cbb8]/15 text-sm text-[#f5efe6] focus:outline-none focus:border-[#c59b43]"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-xs text-[#d8cbb8] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#d8cbb8]/15 text-sm text-[#f5efe6] focus:outline-none focus:border-[#c59b43]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-role" className="block text-xs text-[#d8cbb8] mb-1.5">
                  Topic
                </label>
                <select
                  id="c-role"
                  value={formData.roleType}
                  onChange={e => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#d8cbb8]/15 text-sm text-[#f5efe6] focus:outline-none focus:border-[#c59b43]"
                >
                  <option value="Frontend / React Engineering">Frontend / React Engineering</option>
                  <option value="Full-Stack Web Application">Full-Stack Web Application</option>
                  <option value="UI & Responsive Architecture">UI &amp; Responsive Architecture</option>
                  <option value="Internship Opportunity">Internship Opportunity</option>
                </select>
              </div>

              <div>
                <label htmlFor="c-msg" className="block text-xs text-[#d8cbb8] mb-1.5">
                  Message
                </label>
                <textarea
                  id="c-msg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your team, project, or inquiry..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14110f] border border-[#d8cbb8]/15 text-sm text-[#f5efe6] focus:outline-none focus:border-[#c59b43]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c59b43] text-[#14110f] font-semibold text-sm hover:bg-[#d8cbb8] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                {submitted && (
                  <span className="text-xs font-medium text-[#c59b43]">
                    Message submitted. Thank you for reaching out.
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8cbb8]/15 py-6 text-xs text-[#9e9488]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Aman Usmani · React &amp; Tailwind CSS</span>
          <span>Vrindavan · GLA University, Mathura</span>
        </div>
      </footer>
    </div>
  );
}