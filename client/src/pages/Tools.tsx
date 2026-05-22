import { useLocation } from "wouter";
import DocumentVerifier from "@/components/tools/DocumentVerifier";
import FIRTracker from "@/components/tools/FIRTracker";
import RTIAssistant from "@/components/tools/RTIAssistant";
import BailEligibility from "@/components/tools/BailEligibility";
import SLABreachTracker from "@/components/tools/SLABreachTracker";
import ComplaintDrafter from "@/components/tools/ComplaintDrafter";
import AIChatAssistant from "@/components/tools/AIChatAssistant";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  CheckCircle,
  FileQuestion,
  Scale,
  Clock,
  PenTool,
  Shield,
  LogOut,
} from "lucide-react";

export default function Tools() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const tool = location.split("/").pop();

  const tools = [
    {
      id: "document-verifier",
      name: "Document Verifier",
      icon: FileText,
      description: "Detect forged summons, warrants & court notices",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "fir-tracker",
      name: "FIR Status Tracker",
      icon: CheckCircle,
      description: "Know your rights after filing. Timelines & escalation paths",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "rti-assistant",
      name: "RTI Assistant",
      icon: FileQuestion,
      description: "Generate RTI applications & calculate response deadlines",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "bail-eligibility",
      name: "Bail Eligibility",
      icon: Scale,
      description: "IPC/CrPC rule tree: bailable vs non-bailable offences guide",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "sla-tracker",
      name: "SLA Breach Tracker",
      icon: Clock,
      description: "Know when citizen services are overdue and file complaints",
      color: "from-blue-600 to-blue-700",
    },
    {
      id: "complaint-drafter",
      name: "Complaint Drafter",
      icon: PenTool,
      description: "Auto-generate legal affidavits & consumer complaints as PDF",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "ai-assistant",
      name: "AI Legal Assistant",
      icon: Shield,
      description: "Simulated AI assistance to answer common civic queries",
      color: "from-blue-600 to-blue-700",
    },
  ];

  if (!tool || tool === "tools") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container flex items-center justify-between py-4">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CivicShield</span>
            </button>
            <div className="flex items-center gap-4">
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
                variant="outline"
                onClick={() => setLocation("/")}
                className="text-gray-700 cursor-pointer"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </nav>

        {/* Tools Grid */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Civic Rights Tools
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Choose a tool to get started. All tools work offline and export
                to PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setLocation(`/tools/${t.id}`)}
                    className="group text-left p-8 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t.name}
                    </h3>
                    <p className="text-gray-600 font-light mb-4">
                      {t.description}
                    </p>
                    <div className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Open Tool →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CivicShield</span>
          </button>
          <div className="flex items-center gap-4">
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
              variant="outline"
              onClick={() => setLocation("/tools")}
              className="text-gray-700 cursor-pointer"
            >
              ← All Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="text-gray-700 cursor-pointer"
            >
              Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Tool Content */}
      <div className="container py-12">
        {tool === "document-verifier" && <DocumentVerifier />}
        {tool === "fir-tracker" && <FIRTracker />}
        {tool === "rti-assistant" && <RTIAssistant />}
        {tool === "bail-eligibility" && <BailEligibility />}
        {tool === "sla-tracker" && <SLABreachTracker />}
        {tool === "complaint-drafter" && <ComplaintDrafter />}
        {tool === "ai-assistant" && <AIChatAssistant />}
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
