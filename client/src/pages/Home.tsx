import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle,
  Scale,
  AlertCircle,
  Clock,
  PenTool,
  LogOut,
  User,
  Shield
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * CivicShield Landing Page
 * Design: Swiss Modernism meets Civic Tech Transparency
 * - Clean, institutional aesthetic with deep civic blue and warm orange accents
 * - Asymmetric layout with 3D visualization element
 * - Accessibility-first: high contrast, readable typography
 * - Minimal animations respecting bandwidth constraints
 */

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const sphereRef = useRef<HTMLDivElement>(null);

  // Subtle parallax effect on hero background
  useEffect(() => {
    const handleScroll = () => {
      if (sphereRef.current) {
        const scrollY = window.scrollY;
        sphereRef.current.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tools = [
    {
      id: "document-verifier",
      icon: FileText,
      title: "Document Verifier",
      description:
        "Detect forged summons, warrants & court notices using offline rule-based pattern analysis",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "fir-tracker",
      icon: CheckCircle,
      title: "FIR Status Tracker",
      description:
        "Know your rights after filing. Timelines, escalation paths, and accountability checkpoints",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "rti-assistant",
      icon: FileText,
      title: "RTI Assistant",
      description:
        "Generate RTI applications, calculate response deadlines, and auto-draft First Appeal letters",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "bail-eligibility",
      icon: Scale,
      title: "Bail Eligibility",
      description:
        "IPC/CrPC rule tree: bailable vs non-bailable offences, anticipatory bail eligibility guide",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "sla-tracker",
      icon: Clock,
      title: "SLA Breach Tracker",
      description:
        "Know exactly when government services are legally overdue — then auto-generate a complaint",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "complaint-drafter",
      icon: PenTool,
      title: "Complaint Drafter",
      description:
        "Auto-generate affidavits, consumer complaints & petitions — exports a court-ready PDF instantly",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "ai-assistant",
      icon: Shield,
      title: "AI Legal Assistant",
      description:
        "Instant mock AI assistance to clarify complex legal queries, civic rights, and document procedures",
      color: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CivicShield</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#tools"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Tools
            </a>
            <a
              href="#impact"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Impact
            </a>
            <button
              onClick={() => setLocation("/tools")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              All Tools
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{user.name}</p>
                      <p className="text-xs leading-none text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-900 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 font-medium cursor-pointer"
                size="sm"
                onClick={() => setIsAuthOpen(true)}
              >
                Sign In
              </Button>
            )}
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium cursor-pointer"
              size="sm"
              onClick={() => setLocation("/tools")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide">
                  SDG 16 — Peace, Justice & Strong Institutions
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Justice for Every Citizen.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
                    Everywhere.
                  </span>
                </h1>
                <p className="text-lg text-gray-600 font-light leading-relaxed max-w-lg">
                  Transparent Digital Governance Platform. Six powerful civic
                  rights tools. Zero login. Zero fees. Works offline on any
                  device.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">1.4B</div>
                  <p className="text-sm text-gray-600 mt-1">Citizens who can benefit</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">₹0</div>
                  <p className="text-sm text-gray-600 mt-1">Cost to any citizen</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">6</div>
                  <p className="text-sm text-gray-600 mt-1">Integrated tools</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setLocation("/tools")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-base cursor-pointer"
                >
                  Start Using CivicShield
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 font-semibold px-8 py-6 text-base"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right: 3D Visualization */}
            <div
              ref={sphereRef}
              className="relative h-96 lg:h-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl opacity-50" />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663563463984/fn9KCLb6YMKiDVDjhYRCdH/civic-3d-sphere-5WYK8FTbmy5D65dEZEnnad.webp"
                alt="Civic Justice Network Visualization"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">
              The Problem
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              India's justice system is opaque, inaccessible, and weaponised
              against ordinary citizens. Citizens face forged court summons, RTI
              requests disappear into bureaucratic black holes, and legal access
              costs thousands of rupees.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  num: "1 in 3",
                  text: "summons in Tier-2 cities is fraudulent",
                },
                { num: "3 lakh+", text: "RTI cases pending — zero accountability" },
                {
                  num: "FIR",
                  text: "Black Box — victims can't check status or know their rights",
                },
                {
                  num: "₹2000+",
                  text: "Legal Access Costs — most Indians can't afford basic legal documents",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {item.num}
                  </div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seven Powerful Tools
            </h2>
            <p className="text-lg text-gray-600 font-light">
              A unified, free, offline-first civic rights platform. Zero login.
              Zero fees. Works on any device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={idx}
                  onClick={() => setLocation(`/tools/${tool.id}`)}
                  className="group p-8 hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 cursor-pointer active:scale-98"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {tool.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            How CivicShield Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Visit the Site",
                description:
                  "Open CivicShield on any phone, tablet, or computer. No app download. No login. No data collection.",
                icon: "🌐",
              },
              {
                step: "02",
                title: "Pick Your Problem",
                description:
                  "Choose from 6 tools based on your situation — fake notice, FIR, RTI, bail, SLA breach, or complaint.",
                icon: "🔎",
              },
              {
                step: "03",
                title: "Fill a Simple Form",
                description:
                  "Answer plain-language questions. No legal jargon. The smart rule engine works entirely in your browser.",
                icon: "📝",
              },
              {
                step: "04",
                title: "Get Instant Results",
                description:
                  "Receive your rights, deadlines, escalation paths — or a fully formatted, court-ready PDF document.",
                icon: "⚡",
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                        <div className="text-5xl font-bold text-blue-600 opacity-20">
                  {item.step}
                </div>
                <div className="text-3xl">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Impact & Reach
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Fully Static?
                </h3>
                <ul className="space-y-3 text-gray-700 font-light">
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>Zero data leakage — nothing leaves the browser</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>Instant load — no waiting for server responses</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>
                      Works offline once cached — rural & low-bandwidth ready
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>Free to host forever on any static hosting</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>No attack surface — no backend to breach</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Tech Stack
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Frontend
                  </p>
                  <p className="text-gray-900 font-medium">
                    HTML5 · CSS3 · Vanilla JavaScript
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Rule Engine
                  </p>
                  <p className="text-gray-900 font-medium">
                    JSON rule tables — zero server calls
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    PDF Engine
                  </p>
                  <p className="text-gray-900 font-medium">
                    jsPDF — 100% client-side generation
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Deployment
                  </p>
                  <p className="text-gray-900 font-medium">
                    Static hosting (Vercel, Netlify, GitHub Pages)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Justice Should Not Be a Privilege of the Privileged
          </h2>
          <p className="text-lg text-blue-100 font-light mb-8 max-w-2xl mx-auto">
            CivicShield is a free, offline-first platform that brings transparent
            digital governance to every Indian citizen. No login. No fees. No
            barriers.
          </p>
          <Button 
            onClick={() => setLocation("/tools")}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-base cursor-pointer"
          >
            Start Using CivicShield Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg" />
                <span className="font-bold text-white">CivicShield</span>
              </div>
              <p className="text-sm font-light">
                Transparent Digital Governance for Every Indian Citizen
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm font-light">
                <li>
                  <button onClick={() => setLocation("/tools/document-verifier")} className="hover:text-white transition-colors cursor-pointer text-left">
                    Document Verifier
                  </button>
                </li>
                <li>
                  <button onClick={() => setLocation("/tools/fir-tracker")} className="hover:text-white transition-colors cursor-pointer text-left">
                    FIR Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => setLocation("/tools/rti-assistant")} className="hover:text-white transition-colors cursor-pointer text-left">
                    RTI Assistant
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">More</h4>
              <ul className="space-y-2 text-sm font-light">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">SDG 16</h4>
              <p className="text-sm font-light">
                Peace, Justice & Strong Institutions
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-light">
              © 2025 CivicShield. Built for every citizen.
            </p>
            <p className="text-sm font-light text-gray-500 mt-4 md:mt-0">
              Hackathon Project 2025 · Sapthagiri NPS University · Department of
              CSE
            </p>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
