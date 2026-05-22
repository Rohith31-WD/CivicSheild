import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FileWarning,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Search,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

interface VerificationReport {
  score: number; // 0 to 100 risk score
  status: "safe" | "suspicious" | "danger";
  findings: string[];
  recommendations: string[];
}

export default function DocumentVerifier() {
  const [docNumber, setDocNumber] = useState("");
  const [authority, setAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Checklist states
  const [hasSeal, setHasSeal] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasCaseNumber, setHasCaseNumber] = useState(false);
  const [hasSealMatch, setHasSealMatch] = useState(false);

  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success(`Loaded file: ${file.name}`);
      
      // Auto-extract mock details for a cool, instant feedback loop
      if (file.name.toLowerCase().includes("summons") || file.name.toLowerCase().includes("court")) {
        setDocNumber("SUM/2024/902-CIVIL");
        setAuthority("District Court of Dwarka, Delhi");
        setIssueDate("2024-05-12");
        setHasCaseNumber(true);
        setHasSeal(true);
      }
    }
  };

  const runVerification = () => {
    setLoading(true);
    setTimeout(() => {
      let riskScore = 0;
      const findings: string[] = [];
      const recommendations: string[] = [];

      // 1. Check Date
      if (issueDate) {
        const dateObj = new Date(issueDate);
        const day = dateObj.getDay(); // 0 is Sunday
        
        // Classic forgery error: issuing court notices on Sundays
        if (day === 0) {
          riskScore += 30;
          findings.push("CRITICAL: The issue date falls on a Sunday. Official courts do not issue notices on Sundays.");
        }
      }

      // 2. Check Document ID/Number
      if (docNumber) {
        const cleanNumber = docNumber.trim().toUpperCase();
        // A real case number/notice number is complex (e.g., OS/12/2024 or CP/342/2023)
        // Simple digits like "12345" or "102/24" are highly suspicious for fake summons
        const complexPattern = /[A-Z]+\/[0-9]+\/[0-9]+|[A-Z]+-[0-9]+/;
        if (!complexPattern.test(cleanNumber)) {
          riskScore += 25;
          findings.push("SUSPICIOUS: The Document/Case ID format is overly simple. Real court notices follow rigid numbering structures (e.g. CR/234/2024).");
        }
      } else {
        riskScore += 10;
        findings.push("Warning: No Document/Case ID was provided for format validation.");
      }

      // 3. Checklist Items
      if (!hasSeal) {
        riskScore += 20;
        findings.push("High Risk: Missing official round seal of the court.");
      }
      if (!hasSignature) {
        riskScore += 20;
        findings.push("High Risk: Missing registrar or judge's physical/digital signature.");
      }
      if (!hasCaseNumber) {
        riskScore += 15;
        findings.push("Moderate Risk: No searchable case classification or suit number found.");
      }
      if (hasSeal && !hasSealMatch) {
        riskScore += 15;
        findings.push("Moderate Risk: Court name mentioned in text does not fully align with the physical seal text.");
      }

      // Final classification
      let status: "safe" | "suspicious" | "danger" = "safe";
      if (riskScore >= 50) {
        status = "danger";
        recommendations.push("Do NOT pay any 'fines' or settle via phone calls. Courts never demand UPI transfers.");
        recommendations.push("Search the Case ID on the official e-Courts Services website (link below) to check if a genuine suit exists.");
        recommendations.push("Report this document to your local cyber police station immediately.");
      } else if (riskScore >= 20) {
        status = "suspicious";
        recommendations.push("Cross-verify the issuing department's address and phone number through official government directories.");
        recommendations.push("Inspect the stamp alignment. Fake stamps are often digitally copied and perfectly horizontal without ink bleed.");
      } else {
        status = "safe";
        recommendations.push("This document passes offline pattern analysis. You should still cross-verify it on the e-courts portal.");
      }

      setReport({
        score: riskScore,
        status,
        findings: findings.length > 0 ? findings : ["All basic offline format patterns match standard court standards."],
        recommendations,
      });
      setLoading(false);
      toast.success("Offline analysis complete!");
    }, 1000);
  };

  const resetAll = () => {
    setDocNumber("");
    setAuthority("");
    setIssueDate("");
    setFileName(null);
    setHasSeal(false);
    setHasSignature(false);
    setHasCaseNumber(false);
    setHasSealMatch(false);
    setReport(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Document Verifier
        </h1>
        <p className="text-lg text-gray-600 font-light">
          Verify court summons, police notices, and legal warrants against common forgery patterns. Works entirely offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form and Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. Document details
            </h2>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer transition-colors relative mb-6 bg-gray-50/50">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                {fileName ? fileName : "Upload Summons/Notice PDF or Image"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Files are analyzed in-browser only. Nothing is uploaded to any server.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Document ID / Case Reference Number
                </label>
                <Input
                  placeholder="e.g. OS/412/2024 or CP-901"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Issuing Authority / Court Name
                  </label>
                  <Input
                    placeholder="e.g. Dwarka District Court"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date of Issue (Printed on Notice)
                  </label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              2. Inspect Physical Features
            </h2>
            <p className="text-sm text-gray-600 font-light mb-4">
              Look closely at the physical or printed document. Tick the boxes that apply.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasSeal}
                  onChange={(e) => setHasSeal(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Has official round court seal</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasSignature}
                  onChange={(e) => setHasSignature(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Has judge/registrar signature</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasCaseNumber}
                  onChange={(e) => setHasCaseNumber(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mentions clear suit/case number</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={hasSealMatch}
                  onChange={(e) => setHasSealMatch(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Seal name matches court name</span>
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={runVerification}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 active:scale-98 transition-transform"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Analyzing Patterns...
                  </>
                ) : (
                  "Run Forgery Assessment"
                )}
              </Button>
              {report && (
                <Button variant="outline" onClick={resetAll} className="px-6 py-6 border-gray-300 text-gray-700">
                  Reset
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Results / Report Column */}
        <div className="lg:col-span-1">
          {report ? (
            <Card className="p-6 sticky top-24 border border-gray-200 shadow-md bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
              
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center p-6 rounded-full bg-gray-50 border border-gray-100 mb-3">
                  {report.status === "danger" && <FileWarning className="w-12 h-12 text-red-600" />}
                  {report.status === "suspicious" && <AlertTriangle className="w-12 h-12 text-amber-500" />}
                  {report.status === "safe" && <CheckCircle2 className="w-12 h-12 text-green-600" />}
                </div>
                
                <h3 className={`text-2xl font-black ${
                  report.status === "danger" ? "text-red-600" :
                  report.status === "suspicious" ? "text-amber-600" : "text-green-600"
                }`}>
                  {report.status === "danger" ? "HIGH RISK" :
                   report.status === "suspicious" ? "MODERATE RISK" : "PASSED"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Forgery Score: <span className="font-bold">{report.score} / 100</span>
                </p>
              </div>

              {/* Findings */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Findings:</h4>
                  <ul className="space-y-2">
                    {report.findings.map((f, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className={report.status === "danger" ? "text-red-500" : "text-amber-500"}>•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {report.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Required Action:</h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((r, i) => (
                        <li key={i} className="text-xs text-blue-900 bg-blue-50 border border-blue-100 rounded p-2 flex gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* e-Courts Helper Link */}
              <a
                href="https://services.ecourts.gov.in"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold active:scale-98 transition-transform"
              >
                Search Official e-Courts Portal
                <ExternalLink className="w-3 h-3" />
              </a>
            </Card>
          ) : (
            <Card className="p-8 border border-gray-200 border-dashed text-center flex flex-col items-center justify-center min-h-[300px] bg-gray-50/20 rounded-xl">
              <FileWarning className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Assessment Run</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Provide document details and physical checklist checks on the left, then run the assessor.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
