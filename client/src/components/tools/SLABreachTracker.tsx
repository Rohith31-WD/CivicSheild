import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Download,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  Building,
} from "lucide-react";
import jsPDF from "jspdf";

interface ServiceConfig {
  name: string;
  days: number;
  department: string;
}

const SERVICES: Record<string, ServiceConfig> = {
  passport: { name: "Passport Issuance", days: 30, department: "Regional Passport Office" },
  license: { name: "Driving License", days: 15, department: "Regional Transport Office (RTO)" },
  birth_cert: { name: "Birth Certificate", days: 7, department: "Municipal Corporation / Local Body" },
  ration: { name: "New Ration Card", days: 20, department: "Food & Civil Supplies Department" },
  caste: { name: "Caste Certificate", days: 21, department: "Revenue Department (Tehsildar Office)" },
  water: { name: "New Water Connection", days: 15, department: "Municipal Water Board" },
};

const STATES: Record<string, { name: string; act: string }> = {
  delhi: { name: "Delhi", act: "Delhi Right to Citizen Services Act, 2011" },
  maharashtra: { name: "Maharashtra", act: "Maharashtra Right to Public Services Act, 2015" },
  karnataka: { name: "Karnataka", act: "Karnataka Sakala Services Act, 2011" },
  up: { name: "Uttar Pradesh", act: "Uttar Pradesh Janhit Guarantee Act, 2011" },
  tamilnadu: { name: "Tamil Nadu", act: "Tamil Nadu Right to Service Act" },
  general: { name: "Other State", act: "Citizen's Charter Guarantee of Service" },
};

export default function SLABreachTracker() {
  const [stateKey, setStateKey] = useState("delhi");
  const [serviceKey, setServiceKey] = useState("passport");
  const [appDate, setAppDate] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [analysis, setAnalysis] = useState<{
    serviceName: string;
    department: string;
    stateAct: string;
    stateName: string;
    slaDays: number;
    dueDate: string;
    daysElapsed: number;
    isBreached: boolean;
    daysRemaining: number;
    daysOverdue: number;
    percentComplete: number;
    letterDraft: string;
  } | null>(null);

  const calculateSLA = () => {
    if (!appDate || !refNumber || !applicantName) {
      toast.error("Please fill in Applicant Name, Ref Number, and Application Date.");
      return;
    }

    const service = SERVICES[serviceKey];
    const stateInfo = STATES[stateKey];
    const startDate = new Date(appDate);
    const today = new Date();
    
    // SLA due date calculation
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + service.days);

    const msDiff = today.getTime() - startDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));
    const isBreached = today.getTime() > dueDate.getTime();
    const daysRemaining = isBreached ? 0 : Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const daysOverdue = isBreached ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const percentComplete = Math.min(100, Math.round((daysElapsed / service.days) * 100));

    const draft = `
REPRESENTATION FOR DELAY IN SERVICE DELIVERY UNDER THE ${stateInfo.act.toUpperCase()}

Date: ${today.toLocaleDateString("en-IN")}

To,
The Designated First Appellate Authority,
Grievance Redressal Cell,
${service.department},
Govt. of ${stateInfo.name}

Subject: Formal Grievance/Representation regarding Delay in delivery of "${service.name}" (Application Ref No: ${refNumber})

Respected Officer,

I, ${applicantName}, am writing to formally submit this representation regarding the delay in delivery of the service "${service.name}" for which I applied under the Citizen's Charter and statutory guarantees of ${stateInfo.name} State.

The timeline details of my application are as follows:
1. Service Applied: ${service.name}
2. Application Reference Number: ${refNumber}
3. Date of Submission: ${startDate.toLocaleDateString("en-IN")}
4. Prescribed SLA Timeframe: ${service.days} Calendar Days
5. Statutory Due Date: ${dueDate.toLocaleDateString("en-IN")}
6. Days Currently Overdue: ${daysOverdue} Days

As per Section 4/5 of the ${stateInfo.act}, every citizen is entitled to public services within the stipulated timeframe. The failure to provide the service on time constitutes a breach of the Citizen's Charter and statutory duties by the department.

I kindly request your intervention to:
1. Issue directions to the concerned public service officer to immediately deliver the service.
2. Initiate a departmental inquiry to fix accountability for the delay.
3. Order compensation/penalty against the defaulting officer as per provisions of the Act.

Applicant Contact Details:
Name: ${applicantName}
Address: ${applicantAddress || "Not Provided"}
Email: ${applicantEmail || "Not Provided"}
Phone: ${applicantPhone || "Not Provided"}

I look forward to a swift resolution of this delay.

Yours faithfully,

_______________________
(${applicantName})
    `.trim();

    setAnalysis({
      serviceName: service.name,
      department: service.department,
      stateAct: stateInfo.act,
      stateName: stateInfo.name,
      slaDays: service.days,
      dueDate: dueDate.toLocaleDateString("en-IN"),
      daysElapsed,
      isBreached,
      daysRemaining,
      daysOverdue,
      percentComplete,
      letterDraft: draft,
    });

    toast.success(isBreached ? "SLA Breach Detected! Escalation letter drafted." : "Service is still within SLA limits.");
  };

  const exportPDF = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Header Band
    doc.setFillColor(30, 58, 138); // Deep Navy
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("CivicShield", 20, 25);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Citizen Empowerment Platform - SLA Escalation Letter", 20, 32);

    yPos = 50;

    // Title of Letter
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175); // Royal Blue
    doc.text(`FORMAL REPRESENTATION UNDER ${analysis.stateAct.toUpperCase()}`, 20, yPos);
    yPos += 10;

    // Date
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 20, yPos);
    yPos += 10;

    // Recipient
    doc.setFont("Helvetica", "bold");
    doc.text("To,", 20, yPos);
    yPos += 5;
    doc.text("The Designated First Appellate Authority,", 20, yPos);
    yPos += 5;
    doc.text("Grievance Redressal Cell,", 20, yPos);
    yPos += 5;
    doc.text(`${analysis.department},`, 20, yPos);
    yPos += 5;
    doc.text(`Govt. of ${analysis.stateName}`, 20, yPos);
    yPos += 10;

    // Subject
    doc.setFont("Helvetica", "bold");
    doc.text(`Subject: Representation regarding delay in delivery of "${analysis.serviceName}"`, 20, yPos);
    doc.text(`         (Application Reference Number: ${refNumber})`, 20, yPos + 5);
    yPos += 15;

    // Salutation
    doc.setFont("Helvetica", "normal");
    doc.text("Respected Officer,", 20, yPos);
    yPos += 10;

    // Body text
    const textBody = `I, ${applicantName}, am writing to formally submit this representation regarding the delay in delivery of the service "${analysis.serviceName}" for which I applied under the Citizen's Charter and statutory guarantees of ${analysis.stateName} State.`;
    const lines1 = doc.splitTextToSize(textBody, pageWidth - 40);
    doc.text(lines1, 20, yPos);
    yPos += lines1.length * 5 + 8;

    // Table of Application Details
    doc.setFont("Helvetica", "bold");
    doc.text("Application Timeline & Details:", 20, yPos);
    yPos += 7;

    doc.setFont("Helvetica", "normal");
    const details = [
      ["Applicant Name", applicantName],
      ["Applied Service", analysis.serviceName],
      ["Ref Number", refNumber],
      ["Application Date", new Date(appDate).toLocaleDateString("en-IN")],
      ["SLA Timeframe limit", `${analysis.slaDays} Days`],
      ["Statutory Due Date", analysis.dueDate],
      ["Days Overdue", `${analysis.daysOverdue} Days`],
    ];

    details.forEach(([lbl, val]) => {
      doc.setFont("Helvetica", "bold");
      doc.text(`• ${lbl}:`, 25, yPos);
      doc.setFont("Helvetica", "normal");
      doc.text(val, 75, yPos);
      yPos += 6;
    });

    yPos += 6;

    // Body section 2
    const body2 = `As per Section 4/5 of the ${analysis.stateAct}, every citizen is entitled to public services within the stipulated timeframe. The failure to provide the service on time constitutes a breach of the Citizen's Charter and statutory duties.`;
    const lines2 = doc.splitTextToSize(body2, pageWidth - 40);
    doc.text(lines2, 20, yPos);
    yPos += lines2.length * 5 + 8;

    // Requests
    doc.setFont("Helvetica", "bold");
    doc.text("Therefore, I kindly request your immediate intervention to:", 20, yPos);
    yPos += 7;
    
    doc.setFont("Helvetica", "normal");
    const requests = [
      "1. Issue directions to the concerned public service officer to immediately deliver the service.",
      "2. Initiate a departmental inquiry to fix accountability for the delay.",
      "3. Order compensation/penalty against the defaulting officer as per provisions of the Act.",
    ];
    requests.forEach((req) => {
      const linesReq = doc.splitTextToSize(req, pageWidth - 45);
      doc.text(linesReq, 25, yPos);
      yPos += linesReq.length * 5 + 2;
    });

    yPos += 15;

    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }

    // Sign off
    doc.text("Yours faithfully,", 20, yPos);
    yPos += 15;
    doc.setFont("Helvetica", "bold");
    doc.text(`(${applicantName})`, 20, yPos);
    yPos += 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Phone: ${applicantPhone || "Not Provided"} | Email: ${applicantEmail || "Not Provided"}`, 20, yPos);
    yPos += 5;
    doc.text(`Address: ${applicantAddress || "Not Provided"}`, 20, yPos);

    // Footer Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("CivicShield SLA Breach Escalation System. Verify application coordinates at local citizen center before filing.", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`CivicShield_SLA_Escalation_${refNumber}.pdf`);
    toast.success("Escalation Complaint PDF downloaded!");
  };

  const resetForm = () => {
    setStateKey("delhi");
    setServiceKey("passport");
    setAppDate("");
    setRefNumber("");
    setApplicantName("");
    setApplicantPhone("");
    setApplicantEmail("");
    setApplicantAddress("");
    setAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">SLA Breach Tracker</h1>
        <p className="text-lg text-gray-600 font-light">
          Track citizen service deadlines under State Right to Service Acts, detect breaches, and file escalation complaints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Service Application Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State / Union Territory
                  </label>
                  <Select value={stateKey} onValueChange={setStateKey}>
                    <SelectTrigger className="w-full h-10 border-gray-300">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.entries(STATES).map(([k, s]) => (
                        <SelectItem key={k} value={k}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Type
                  </label>
                  <Select value={serviceKey} onValueChange={setServiceKey}>
                    <SelectTrigger className="w-full h-10 border-gray-300">
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {Object.entries(SERVICES).map(([k, s]) => (
                        <SelectItem key={k} value={k}>
                          {s.name} ({s.days} Days SLA)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Reference No. *
                  </label>
                  <Input
                    placeholder="e.g. PPT/12345/26"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Date *
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={appDate}
                      onChange={(e) => setAppDate(e.target.value)}
                      className="w-full h-10 pr-10"
                    />
                    <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4 pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Applicant Information (For Complaint Drafting)</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        placeholder="e.g. Amit Patel"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        placeholder="e.g. 9876543210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        placeholder="e.g. amit@mail.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mailing Address
                    </label>
                    <Input
                      placeholder="e.g. Flat 302, Royal Residency, Delhi 110001"
                      value={applicantAddress}
                      onChange={(e) => setApplicantAddress(e.target.value)}
                      className="w-full h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  onClick={calculateSLA}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 active:scale-98 transition-transform"
                >
                  Track SLA Status
                </Button>
                {analysis && (
                  <Button variant="outline" onClick={resetForm} className="px-6 py-6 border-gray-300 text-gray-700">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Status Tracker Panel */}
        <div className="lg:col-span-1">
          {analysis ? (
            <Card className="p-6 sticky top-24 border border-gray-200 shadow-md bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                SLA Status
              </h2>

              <div className={`p-4 rounded-lg mb-6 border text-center ${
                analysis.isBreached ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800"
              }`}>
                <span className="text-xs uppercase font-bold tracking-wider block mb-1">SLA Compliance</span>
                <span className="text-2xl font-black block">
                  {analysis.isBreached ? "BREACHED" : "ON TRACK"}
                </span>
                <span className="text-xs font-semibold block mt-1">
                  {analysis.isBreached 
                    ? `Overdue by ${analysis.daysOverdue} Days` 
                    : `${analysis.daysRemaining} Days remaining`}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Day 0 (Applied)</span>
                  <span>SLA Limit ({analysis.slaDays} Days)</span>
                </div>
                <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      analysis.isBreached ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${analysis.percentComplete}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mt-1">
                  <span>Elapsed: {analysis.daysElapsed} Days</span>
                  <span>Due: {analysis.dueDate}</span>
                </div>
              </div>

              {analysis.isBreached ? (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed font-light">
                      The service delivery deadline has been breached under the <strong>{analysis.stateAct}</strong>. You are entitled to file an appeal.
                    </p>
                  </div>

                  <Button
                    onClick={exportPDF}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 active:scale-98 transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    Download Escalation Letter
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-light">
                    This service application is currently within the mandated SLA limits of {analysis.slaDays} days. If it exceeds {analysis.dueDate}, you can generate an escalation complaint here.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 border border-gray-200 border-dashed text-center flex flex-col items-center justify-center min-h-[300px] bg-gray-50/20 rounded-xl">
              <Clock className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">Not Tracking Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Provide your application date and reference number to calculate SLA deadlines and check for breaches.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
