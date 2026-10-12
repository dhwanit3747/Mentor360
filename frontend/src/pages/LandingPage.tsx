import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen, ClipboardCheck, BarChart3, Users,
  ArrowRight, CheckCircle2, Star, Globe, School,
  ChevronDown, Sparkles, Shield, Zap, MapPin, TrendingUp
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '8+', label: 'Schools per cluster', icon: School },
  { value: '16', label: 'Monthly visit targets', icon: MapPin },
  { value: '100%', label: 'Works offline', icon: Shield },
  { value: '4×', label: 'Faster feedback', icon: Zap },
];

const FEATURES = [
  { icon: ClipboardCheck, title: 'Classroom Observation', desc: 'Structured rubrics aligned with NIPUN Bharat and FLN competency frameworks for Grades 1–3.', color: '#176B5B', bg: '#E6F2EF' },
  { icon: Sparkles, title: 'Feedback & Demonstrations', desc: 'Generate constructive feedback with a library of field-tested teaching demonstrations.', color: '#D97706', bg: '#FEF7E6' },
  { icon: BarChart3, title: 'Insights & Reports', desc: 'Track cluster progress with visual dashboards, trend analysis and exportable reports.', color: '#1D4ED8', bg: '#EFF6FF' },
  { icon: Users, title: 'Teacher Action Plans', desc: 'Co-create development plans with SMART goals, follow-up timelines, and progress tracking.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: TrendingUp, title: 'Priority Scoring', desc: 'Visit prioritization using urgency, need severity, follow-up importance, and overdue levels.', color: '#DC2626', bg: '#FEF2F2' },
  { icon: Globe, title: 'Hindi & English', desc: 'Full bilingual support. Switch seamlessly between English and Hindi for every interaction.', color: '#176B5B', bg: '#E6F2EF' },
];

const ROLES = [
  { title: 'CRP', full: 'Cluster Resource Person', desc: 'Manage up to 8 schools, plan visits, conduct classroom observations and track teacher growth.' },
  { title: 'BRC', full: 'Block Resource Centre', desc: 'Oversee cluster-level data, compile reports, and provide academic support to CRPs.' },
  { title: 'DIET', full: 'District Institute of Education', desc: 'Analyse district-wide teaching trends and guide block-level training interventions.' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Refs for GSAP
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  const nipunRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // ── Hero section: staggered fade-up (formal, measured)
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    heroTl
      .fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(badgeRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
      .fromTo(headlineRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.25')
      .fromTo(subRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(ctaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.25')
      .fromTo(socialRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.2')
      .fromTo(cardRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, '-=0.7');

    // ── Stats: fade up on scroll
    gsap.fromTo(
      statsRef.current?.querySelectorAll('.stat-item') ?? [],
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.1,
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
      }
    );

    // ── Feature cards: subtle slide-up on scroll
    gsap.fromTo(
      featuresRef.current?.querySelectorAll('.feat-card') ?? [],
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.09,
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
      }
    );

    // ── NIPUN banner: fade in
    gsap.fromTo(
      nipunRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65,
        scrollTrigger: { trigger: nipunRef.current, start: 'top 85%' } }
    );

    // ── Roles: stagger
    gsap.fromTo(
      rolesRef.current?.querySelectorAll('.role-card') ?? [],
      { y: 28, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.12,
        scrollTrigger: { trigger: rolesRef.current, start: 'top 80%' }
      }
    );

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a2e28] overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-[#E2ECE8]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
            title="Mentor360 Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#176B5B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm tracking-tighter">
                M<span className="text-[#F4B942]">360</span>
              </span>
            </div>
            <div>
              <span className={`font-bold text-lg leading-none transition-colors ${scrolled ? 'text-[#1a2e28]' : 'text-white'}`}>
                Mentor<span className="text-[#4ade80]">360</span>
              </span>
              <span className={`hidden sm:block text-[10px] font-medium leading-none mt-0.5 transition-colors ${scrolled ? 'text-[#5A6F68]' : 'text-white/70'}`}>
                School Mentor Platform
              </span>
            </div>
          </div>

          {/* Nav links — always white on hero, dark on scroll */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold">
            <a href="#features" className={`transition-colors hover:text-[#4ade80] ${scrolled ? 'text-[#43544E]' : 'text-white'}`}>Features</a>
            <a href="#roles"    className={`transition-colors hover:text-[#4ade80] ${scrolled ? 'text-[#43544E]' : 'text-white'}`}>Who It's For</a>
            <a href="#about"    className={`transition-colors hover:text-[#4ade80] ${scrolled ? 'text-[#43544E]' : 'text-white'}`}>About NIPUN</a>
          </div>

          <button
            onClick={() => navigate('/app')}
            className="bg-[#F4B942] hover:bg-[#e6a830] text-[#1a2e28] font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b3328] via-[#176B5B] to-[#0a2820]" />
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `radial-gradient(circle at 18% 55%, rgba(244,185,66,0.28) 0%, transparent 50%), radial-gradient(circle at 78% 22%, rgba(175,220,209,0.2) 0%, transparent 40%)` }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left */}
            <div className="space-y-7">
              <div ref={badgeRef} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-xs font-semibold text-white">
                <Star className="w-3.5 h-3.5 text-[#F4B942] fill-[#F4B942]" />
                NIPUN Bharat Aligned • FLN Framework
              </div>

              <div ref={headlineRef}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.1] tracking-tight">
                  Empower Every{' '}
                  <span className="text-[#F4B942]">Teacher</span>,<br />
                  Transform Every{' '}
                  <span className="text-[#6DCBBE]">Classroom</span>
                </h1>
              </div>

              <p ref={subRef} className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
                Mentor360 is India's dedicated field-support platform for CRPs, BRCs and academic coordinators — built for government schools, designed for real classrooms.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/app')}
                  className="group bg-[#F4B942] hover:bg-[#e6a830] text-[#1a2e28] font-black px-7 py-3.5 rounded-xl text-base shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Start Mentoring
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="#features" className="bg-white/10 border border-white/25 hover:bg-white/18 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Explore Features
                </a>
              </div>

              <div ref={socialRef} className="flex items-center gap-3 text-sm text-white/55">
                <div className="flex -space-x-2">
                  {['RC','AS','PK','MV'].map((init, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#AFDCD1] to-[#176B5B] border-2 border-[#176B5B] flex items-center justify-center text-[10px] font-bold text-white">
                      {init}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong className="text-white">2,400+</strong> mentors across India</span>
              </div>
            </div>

            {/* Right: Dashboard preview */}
            <div ref={cardRef} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#F4B942]/15 to-[#AFDCD1]/15 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white/55 text-xs font-semibold">MY WORK TODAY</p>
                    <p className="text-white font-bold text-lg">Good morning, Ramesh!</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#176B5B] border-2 border-[#F4B942] flex items-center justify-center text-white font-bold text-sm">RC</div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{label:'Schools',val:'6',c:'text-[#AFDCD1]'},{label:'Visits Due',val:'3',c:'text-[#F4B942]'},{label:'Follow-ups',val:'2',c:'text-orange-300'}].map(k=>(
                    <div key={k.label} className="bg-white/10 rounded-xl p-3 text-center">
                      <p className={`text-2xl font-black ${k.c}`}>{k.val}</p>
                      <p className="text-white/55 text-[10px] font-semibold mt-0.5">{k.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {[
                    {school:'Saraswati Primary School',time:'Today, 10:00 AM',tag:'HIGH',tc:'bg-red-500/80'},
                    {school:'Govt. PS Rampur',time:'Tomorrow, 9:00 AM',tag:'MED',tc:'bg-amber-500/80'},
                    {school:'Shakti Govt PS',time:'Thu, 11:00 AM',tag:'FOLLOW-UP',tc:'bg-purple-500/80'},
                  ].map(t=>(
                    <div key={t.school} className="flex items-center justify-between bg-white/8 hover:bg-white/14 rounded-xl p-3 transition-colors">
                      <div>
                        <p className="text-white text-xs font-bold">{t.school}</p>
                        <p className="text-white/45 text-[10px] mt-0.5">{t.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full ${t.tc}`}>{t.tag}</span>
                        <ArrowRight className="w-3 h-3 text-white/30" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/15">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-white/55 font-semibold">Monthly visits</span>
                    <span className="text-white font-bold">12 / 16</span>
                  </div>
                  <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F4B942] to-[#AFDCD1] rounded-full" style={{width:'75%'}} />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#F4B942] text-[#1a2e28] rounded-2xl px-3 py-1.5 shadow-xl text-xs font-black">✓ NIPUN Aligned</div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-3 py-1.5 shadow-xl text-xs font-bold text-[#176B5B] flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Works Offline
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/35">
            <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-[#F7F9F8] border-y border-[#E2ECE8]">
        <div ref={statsRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-item text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F2EF] flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-[#176B5B]" />
                  </div>
                  <p className="text-3xl font-black text-[#176B5B]">{stat.value}</p>
                  <p className="text-sm text-[#5A6F68] font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="inline-block bg-[#E6F2EF] text-[#176B5B] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a2e28]">Everything a mentor needs,<br className="hidden sm:block" /> built for the field</h2>
            <p className="text-[#5A6F68] max-w-xl mx-auto text-sm">From observation checklists to data-driven insights — Mentor360 covers the full mentoring workflow.</p>
          </div>
          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(feat => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="feat-card group p-6 rounded-2xl border border-[#E2ECE8] hover:border-[#AFDCD1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white" onClick={() => navigate('/app')}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{background: feat.bg}}>
                    <Icon className="w-6 h-6" style={{color: feat.color}} />
                  </div>
                  <h3 className="font-bold text-base text-[#1a2e28] mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#5A6F68] leading-relaxed">{feat.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{color: feat.color}}>
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NIPUN BANNER ── */}
      <section id="about" ref={nipunRef} className="py-20 bg-gradient-to-r from-[#0b3328] to-[#176B5B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',backgroundSize:'40px 40px'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-bold text-white/90">🇮🇳 National Initiative</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Aligned with NIPUN Bharat</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
            Mentor360 is fully aligned with the National Initiative for Proficiency in Reading with Understanding and Numeracy (NIPUN Bharat).
            Our observation rubrics, feedback templates, and activity libraries are designed to support the FLN mission — ensuring every child can read and do basic arithmetic by Grade 3.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['Grades 1–3 Focus','Hindi & English','FLN Competencies','NIPUN Lakshya','SLO Tracking'].map(tag => (
              <span key={tag} className="bg-white/12 border border-white/22 text-white font-semibold text-xs px-4 py-2 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="py-24 bg-[#F7F9F8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#E6F2EF] text-[#176B5B] font-bold text-xs px-4 py-2 rounded-full uppercase tracking-widest mb-4">Roles</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a2e28]">Built for the entire support system</h2>
          </div>
          <div ref={rolesRef} className="grid sm:grid-cols-3 gap-6">
            {ROLES.map(role => (
              <div key={role.title} className="role-card bg-white rounded-3xl p-8 border border-[#E2ECE8] hover:shadow-xl hover:border-[#AFDCD1] transition-all duration-300 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#176B5B] flex items-center justify-center">
                  <span className="text-white font-black text-lg">{role.title}</span>
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#1a2e28]">{role.title}</h3>
                  <p className="text-[#176B5B] font-semibold text-sm">{role.full}</p>
                </div>
                <p className="text-sm text-[#5A6F68] leading-relaxed">{role.desc}</p>
                <div className="flex items-center gap-2 text-xs text-[#176B5B] font-bold">
                  <CheckCircle2 className="w-4 h-4" />Full Access Included
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-7">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a2e28]">Ready to transform your cluster?</h2>
          <p className="text-[#5A6F68] text-base max-w-xl mx-auto">Launch the Mentor360 app — no login required, works offline, your data stays on your device.</p>
          <button
            onClick={() => navigate('/app')}
            className="group bg-[#176B5B] hover:bg-[#125447] text-white font-black px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 inline-flex items-center gap-3"
          >
            Launch Mentor360
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-[#7B928A]">All data stored locally in your browser via IndexedDB · Works offline · No account needed</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a2e28] text-white/55 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#176B5B] flex items-center justify-center">
                <span className="text-white font-black text-xs">M<span className="text-[#F4B942]">360</span></span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Mentor360</p>
                <p className="text-white/35 text-[11px]">School Mentor Support Platform</p>
              </div>
            </div>
            <div className="text-center text-xs space-y-1">
              <p>Built for India's government school system</p>
              <p>Aligned with NIPUN Bharat &amp; NEP 2020</p>
            </div>
            <div className="text-xs text-right">
              <p>© 2026 Mentor360</p>
              <p className="text-white/30">Field Mentor Edition</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
