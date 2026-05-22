import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Download,
  PenTool,
  User,
  Shield,
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";

type ComplaintType = "consumer" | "police" | "civic";

interface ComplainantInfo {
  name: string;
  age: string;
  parentName: string;
  address: string;
  phone: string;
  email: string;
}

interface RespondentInfo {
  name: string;
  designation: string;
  address: string;
}

interface GrievanceInfo {
  subject: string;
  incidentDate: string;
  facts: string;
  relief: string;
}

export default function ComplaintDrafter() {
  const [step, setStep] = useState(1);
  const [complaintType, setComplaintType] = useState<ComplaintType>("consumer");
  
  const [complainant, setComplainant] = useState<ComplainantInfo>({
    name: "",
    age: "",
    parentName: "",
    address: "",
    phone: "",
    email: "",
  });

  const [respondent, setRespondent] = useState<RespondentInfo>({
    name: "",
    designation: "",
    address: "",
  });

  const [grievance, setGrievance] = useState<GrievanceInfo>({
    subject: "",
    incidentDate: "",
    facts: "",
    relief: "",
  });

  const [finalDraft, setFinalDraft] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 2) {
      if (!complainant.name || !complainant.address || !complainant.phone) {
        toast.error("Please fill in Name, Address, and Phone Number.");
        return;
      }
    }
    if (step === 3) {
      if (!respondent.name || !respondent.address) {
        toast.error("Please fill in Respondent Name/Entity and Address.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const generateDraft = () => {
    if (!grievance.subject || !grievance.facts || !grievance.relief) {
      toast.error("Please fill in Subject, Facts of the Case, and Relief Sought.");
      return;
    }

    let draft = "";
    const today = new Date().toLocaleDateString("en-IN");

    if (complaintType === "consumer") {
      draft = `
BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
AT ________________________________

CONSUMER COMPLAINT NO. ______ OF 2026

IN THE MATTER OF:

${complainant.name.toUpperCase()},
S/o or D/o ${complainant.parentName || "__________"}, Aged about ${complainant.age || "__"} years,
Residing at: ${complainant.address}
Contact: ${complainant.phone} | Email: ${complainant.email || "N/A"}
... COMPLAINANT

VERSUS

${respondent.name.toUpperCase()},
${respondent.designation ? `${respondent.designation},` : ""}
Located at: ${respondent.address}
... OPPOSITE PARTY/RESPONDENT

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE.

MOST RESPECTFULLY SHOWETH:

1. That the Complainant is a resident of ${complainant.address} and is a "Consumer" within the meaning of Section 2(7) of the Consumer Protection Act, 2019.

2. That the Respondent is engaged in the business of providing ${respondent.designation || "services/products"} and has its office at ${respondent.address}.

3. SUBJECT MATTER OF COMPLAINT:
${grievance.subject}

4. FACTS CONSTITUTING THE CAUSE OF ACTION:
- On/about ${grievance.incidentDate || "________"}, the Complainant interacted with/availed services of the Respondent.
- Detailed Facts: ${grievance.facts}

5. That the Complainant suffered immense mental agony, harassment, and financial loss due to the gross deficiency in services and unfair trade practices of the Respondent.

6. RELIEF SOUGHT:
The Complainant respectfully prays that this Hon'ble Commission may be pleased to:
- Direct the Respondent to: ${grievance.relief}
- Award compensation of Rs. ___________ towards mental harassment and litigation costs.
- Pass any other order(s) which this Hon'ble Commission deems fit in the interest of justice.

Dated: ${today}
Place: _______________

COMPLAINANT
(${complainant.name})

VERIFICATION
I, the Complainant above named, do hereby verify that the contents of paragraphs 1 to 6 of the complaint are true and correct to my knowledge, and no part of it is false. Verified at ____________ on this ________ day of ________ 2026.

COMPLAINANT
      `.trim();
    } else if (complaintType === "police") {
      draft = `
REPRESENTATION / COMPLAINT REGARDING POLICE INACTION / PETITION UNDER SECTION 154(3) CrPC

Date: ${today}

To,
The Superintendent of Police / Commissioner of Police,
Office of the Police Commissioner,
${respondent.address}

Subject: Petition under Section 154(3) CrPC regarding failure of Police Station ${respondent.name} to register FIR for Cognizable Offence.

Respected Sir/Madam,

1. DETAILS OF THE COMPLAINANT:
Name: ${complainant.name}
Parent's Name: ${complainant.parentName || "__________"}
Residence: ${complainant.address}
Contact: ${complainant.phone} | Email: ${complainant.email || "N/A"}

2. DETAILS OF ACCUSED/OFFENCE:
Incident Location/Station: ${respondent.name}
Accused Details: ${respondent.designation || "Not Named/Unknown"}
Date of Incident: ${grievance.incidentDate || "________"}

3. SUBJECT:
${grievance.subject}

4. STATEMENT OF FACTS:
- The Complainant originally approached the Officer-in-Charge of ${respondent.name} Police Station on/about the date of the incident to lodge an FIR.
- However, the local police station refused to register the FIR and take action on the cognizable offence.
- Facts of the Incident: ${grievance.facts}

5. RELIEF/PRAYER:
In view of the above facts, it is respectfully prayed that:
- Direct the registration of an FIR under appropriate sections of law based on this complaint.
- Order an impartial investigation into the matter.
- Initiate appropriate action against the defaulting police officers for refusing to register the FIR as mandated in Lalita Kumari v. Govt. of UP.

Yours faithfully,

_______________________
(${complainant.name})
      `.trim();
    } else {
      // Civic grievance
      draft = `
REPRESENTATION CONCERNING CIVIC/MUNICIPAL GRIEVANCE

Date: ${today}

To,
The Municipal Commissioner / Ward Officer,
${respondent.name},
${respondent.address}

Subject: Grievance representation regarding municipal negligence: ${grievance.subject}

Respected Sir/Madam,

1. I, ${complainant.name}, residing at ${complainant.address}, wish to draw your immediate attention to a serious civic issue affecting our locality.

2. GRIEVANCE SUMMARY:
Service/Defect: ${grievance.subject}
Date Observed: ${grievance.incidentDate || "Ongoing"}
Location of Grievance: ${respondent.address}

3. DETAILS OF THE GRIEVANCE & LOCAL IMPACT:
${grievance.facts}

4. The prevailing situation has caused major inconvenience, safety hazards, and health concerns for the residents. Despite previous local representations, no corrective action has been initiated by the civic authorities.

5. RELIEF / ACTION REQUESTED:
I request the municipal authorities to:
- Direct the concerned ward staff to immediately resolve: ${grievance.relief}
- Perform a public audit of the civic infrastructure in the affected area.
- Establish a feedback mechanism for the residents until the issue is fully resolved.

Thanking you.

Yours faithfully,

_______________________
(${complainant.name})
Contact: ${complainant.phone} | Email: ${complainant.email || "N/A"}
      `.trim();
    }

    setFinalDraft(draft);
    setStep(5);
    toast.success("Legal complaint draft generated successfully!");
  };

  const exportPDF = () => {
    if (!finalDraft) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    doc.setFont("Courier", "bold");
    doc.setFontSize(14);
    
    // Title
    const titleText = complaintType === "consumer" 
      ? "CONSUMER COMPLAINT DRAFT" 
      : complaintType === "police" 
        ? "PETITION UNDER SECTION 154(3) CrPC" 
        : "CIVIC GRIEVANCE REPRESENTATION";
        
    doc.text(titleText, pageWidth / 2, yPos, { align: "center" });
    yPos += 12;

    doc.setFont("Courier", "normal");
    doc.setFontSize(10.5);

    // Split text into double spaced lines
    const paragraphs = finalDraft.split("\n");
    
    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === "") {
        yPos += 4;
        return;
      }
      
      const lines = doc.splitTextToSize(paragraph, pageWidth - 40);
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 25) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 6; // Double spacing simulation
      });
    });

    // Footer Page Numbers
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
      doc.text("CivicShield - Legal Complaining Drafter System", 20, pageHeight - 10);
    }

    doc.save(`CivicShield_${complaintType}_complaint.pdf`);
    toast.success("Complaint PDF downloaded!");
  };

  const startOver = () => {
    setStep(1);
    setFinalDraft(null);
    setGrievance({ subject: "", incidentDate: "", facts: "", relief: "" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Complaint Drafter</h1>
        <p className="text-lg text-gray-600 font-light">
          Step-by-step assistant to auto-draft formal consumer court complaints, police grievances, and municipal representations.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
        {[
          { num: 1, label: "Type" },
          { num: 2, label: "Complainant" },
          { num: 3, label: "Respondent" },
          { num: 4, label: "Grievance" },
          { num: 5, label: "Preview" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step === s.num
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : step > s.num
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400 border"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden md:inline ${
                step === s.num ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
            {s.num < 5 && <div className="h-0.5 w-8 md:w-16 bg-gray-200 ml-2 hidden md:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Type Selection */}
        {step === 1 && (
          <Card className="p-8 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PenTool className="w-6 h-6 text-blue-600" />
              Select Complaint Category
            </h2>

            <RadioGroup
              value={complaintType}
              onValueChange={(val) => setComplaintType(val as ComplaintType)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div
                onClick={() => setComplaintType("consumer")}
                className={`border p-6 rounded-xl hover:shadow-md cursor-pointer flex flex-col justify-between transition-all ${
                  complaintType === "consumer" ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20" : "border-gray-200"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Consumer Dispute</h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Under Consumer Protection Act 2019. Defective goods, refund issues, and service deficiencies.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setComplaintType("police")}
                className={`border p-6 rounded-xl hover:shadow-md cursor-pointer flex flex-col justify-between transition-all ${
                  complaintType === "police" ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20" : "border-gray-200"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Police Grievance</h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Petition under Sec 154(3) CrPC. Refusal to file FIR, police inaction, or high-handedness.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setComplaintType("civic")}
                className={`border p-6 rounded-xl hover:shadow-md cursor-pointer flex flex-col justify-between transition-all ${
                  complaintType === "civic" ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20" : "border-gray-200"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Civic & Municipal</h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Representations for street light repairs, sewage, public waste dumping, or road damage.
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-end mt-8 pt-4 border-t">
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6 py-5"
              >
                Configure Parties <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Complainant Info */}
        {step === 2 && (
          <Card className="p-8 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Complainant Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Complainant Full Name *</Label>
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={complainant.name}
                    onChange={(e) => setComplainant({ ...complainant, name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Father's / Spouse's Name</Label>
                  <Input
                    placeholder="e.g. S.K. Sharma"
                    value={complainant.parentName}
                    onChange={(e) => setComplainant({ ...complainant, parentName: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Age</Label>
                  <Input
                    placeholder="e.g. 35"
                    value={complainant.age}
                    onChange={(e) => setComplainant({ ...complainant, age: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</Label>
                  <Input
                    placeholder="e.g. 9812345670"
                    value={complainant.phone}
                    onChange={(e) => setComplainant({ ...complainant, phone: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="e.g. rahul@mail.com"
                    value={complainant.email}
                    onChange={(e) => setComplainant({ ...complainant, email: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">Full Residential Address *</Label>
                <Input
                  placeholder="e.g. Flat 12, Block C, Green Park, New Delhi 110016"
                  value={complainant.address}
                  onChange={(e) => setComplainant({ ...complainant, address: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 text-gray-700">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6"
              >
                Respondent Details <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Respondent Info */}
        {step === 3 && (
          <Card className="p-8 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              {complaintType === "consumer" 
                ? "Opposite Party (Respondent)" 
                : complaintType === "police" 
                  ? "Concerned Police Station" 
                  : "Municipal Authority"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    {complaintType === "consumer" 
                      ? "Respondent/Company Name *" 
                      : complaintType === "police" 
                        ? "Police Station Name *" 
                        : "Municipal Office/Body Name *"}
                  </Label>
                  <Input
                    placeholder={
                      complaintType === "consumer" 
                        ? "e.g. XYZ E-Commerce Private Ltd" 
                        : complaintType === "police" 
                          ? "e.g. Saket Police Station" 
                          : "e.g. Municipal Corporation Ward 4"
                    }
                    value={respondent.name}
                    onChange={(e) => setRespondent({ ...respondent, name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    {complaintType === "consumer" 
                      ? "Responsible Person (Designation)" 
                      : complaintType === "police" 
                        ? "Officer-in-Charge / Accused Officer Name" 
                        : "Concerned Officer Designation"}
                  </Label>
                  <Input
                    placeholder={
                      complaintType === "consumer" 
                        ? "e.g. Grievance Redressal Manager" 
                        : complaintType === "police" 
                          ? "e.g. SHO Amit Kumar" 
                          : "e.g. Executive Engineer"
                    }
                    value={respondent.designation}
                    onChange={(e) => setRespondent({ ...respondent, designation: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">
                  {complaintType === "consumer" ? "Respondent Address *" : "Office/Station Location Address *"}
                </Label>
                <Input
                  placeholder="e.g. Industrial Area Phase-II, South Delhi"
                  value={respondent.address}
                  onChange={(e) => setRespondent({ ...respondent, address: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 text-gray-700">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6"
              >
                Grievance Details <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Grievance Details */}
        {step === 4 && (
          <Card className="p-8 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Grievance Details & Relief
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Subject of Complaint *</Label>
                  <Input
                    placeholder="e.g. Refund refusal for defective laptop / Delay in registering theft FIR"
                    value={grievance.subject}
                    onChange={(e) => setGrievance({ ...grievance, subject: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">Date of Incident / Occurrence</Label>
                  <Input
                    type="date"
                    value={grievance.incidentDate}
                    onChange={(e) => setGrievance({ ...grievance, incidentDate: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">Facts of the Case (What Happened?) *</Label>
                <Textarea
                  placeholder="Provide a step-by-step description of the incident. Mention dates, interactions, invoice numbers, and details of deficiencies or non-cooperation."
                  value={grievance.facts}
                  onChange={(e) => setGrievance({ ...grievance, facts: e.target.value })}
                  className="w-full min-h-32"
                />
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-2">Relief / Remedy Sought *</Label>
                <Textarea
                  placeholder="Specify what you want the authority to order (e.g. refund of Rs. 45,000 with interest, immediate registration of FIR, repairs of the street potholes)."
                  value={grievance.relief}
                  onChange={(e) => setGrievance({ ...grievance, relief: e.target.value })}
                  className="w-full min-h-24"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 text-gray-700">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={generateDraft}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-6"
              >
                Generate Draft <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 5: Draft Preview & Download */}
        {step === 5 && finalDraft && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 bg-white border border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Legal Draft Preview
                </h2>

                <div className="p-6 bg-slate-50 border rounded-lg max-h-[500px] overflow-y-auto font-mono text-xs whitespace-pre-wrap text-slate-800 leading-relaxed shadow-inner">
                  {finalDraft}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 bg-white border border-gray-200 shadow-md sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Export Draft</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Your legal draft has been formatted with standard legal double-spacing spacing. You can download it as a PDF or copy it for your filings.
                </p>

                <div className="space-y-4">
                  <Button
                    onClick={exportPDF}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 py-5"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Draft
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(finalDraft);
                      toast.success("Draft copied to clipboard!");
                    }}
                    className="w-full text-gray-700 border-gray-300"
                  >
                    Copy to Clipboard
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={startOver}
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Start New Draft
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
