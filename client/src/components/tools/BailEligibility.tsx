import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Scale, Download, RefreshCw, FileText, HelpCircle, ShieldAlert } from "lucide-react";
import jsPDF from "jspdf";

interface QuestionStep {
  id: string;
  question: string;
  options: { label: string; value: string; next?: string }[];
}

export default function BailEligibility() {
  // Answers states
  const [offenceType, setOffenceType] = useState("");
  const [imprisonmentTerm, setImprisonmentTerm] = useState("");
  const [weaponUsed, setWeaponUsed] = useState("");
  const [fearArrest, setFearArrest] = useState("");
  const [firstOffender, setFirstOffender] = useState("");

  const [result, setResult] = useState<{
    classification: "Bailable" | "Non-Bailable" | "Anticipatory Bail Recommended";
    crpcSection: string;
    details: string;
    steps: string[];
  } | null>(null);

  const calculateEligibility = () => {
    if (!offenceType || !imprisonmentTerm || !weaponUsed || !fearArrest || !firstOffender) {
      toast.error("Please answer all questions");
      return;
    }

    // Rules engine matching CrPC guidelines:
    let classification: "Bailable" | "Non-Bailable" | "Anticipatory Bail Recommended" = "Bailable";
    let crpcSection = "Section 436 of CrPC";
    let details = "";
    const steps: string[] = [];

    const isSeriousSentence = imprisonmentTerm === "3-7" || imprisonmentTerm === "7plus" || imprisonmentTerm === "life";
    const isViolent = weaponUsed === "yes" || offenceType === "violence" || offenceType === "murder";

    if (isSeriousSentence || isViolent) {
      if (fearArrest === "yes") {
        classification = "Anticipatory Bail Recommended";
        crpcSection = "Section 438 of CrPC";
        details = "This offence is classified as Non-Bailable. Since you fear imminent arrest for a non-bailable offense, you can apply for Anticipatory Bail in the Sessions Court or the High Court before arrest occurs.";
        steps.push("Engage a criminal lawyer to draft an Anticipatory Bail Application under Section 438.");
        steps.push("File the application in the Court of Sessions or High Court having jurisdiction.");
        steps.push("Ensure you cooperate with the police investigation if ad-interim protection is granted.");
      } else {
        classification = "Non-Bailable";
        crpcSection = "Sections 437 & 439 of CrPC";
        details = "This offence is classified as Non-Bailable. Release is not a matter of right, but is subject to judicial discretion. The police will arrest the accused and produce them before a Magistrate within 24 hours.";
        steps.push("A regular bail application must be moved under Section 437 (before Magistrate) or Section 439 (before Sessions/High Court).");
        steps.push("Argue that the accused will not flee, will cooperate with trial, and will not tamper with evidence.");
        if (firstOffender === "yes") {
          steps.push("Highlight that the accused is a first-time offender with no prior criminal convictions to improve eligibility.");
        }
      }
    } else {
      // Bailable offence
      classification = "Bailable";
      crpcSection = "Section 436 of CrPC";
      details = "This offence is classified as Bailable. Under Section 436, release on bail is a statutory right. The police officer or court MUST release you upon furnishing a personal bond or surety.";
      steps.push("Prepare a personal bond (Form No. 45) to present at the police station or court.");
      steps.push("Provide solvent sureties if demanded (often a family member or local resident with identity proofs).");
      steps.push("If police refuse bail for a bailable offence, they can be prosecuted for wrongful confinement.");
    }

    setResult({
      classification,
      crpcSection,
      details,
      steps,
    });
    toast.success("Bail eligibility analysis complete!");
  };

  const exportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text("CivicShield - Bail Eligibility & Rights Guide", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 12;

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Offline Legal Report`, pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 15;

    // Input Parameters Summary
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Case Inputs Checked:", 20, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`- Offence Category: ${offenceType}`, 25, yPos);
    yPos += 5;
    doc.text(`- Max Prison Term: ${imprisonmentTerm === "under3" ? "Less than 3 Years" : "3 Years or More"}`, 25, yPos);
    yPos += 5;
    doc.text(`- Weapon/Violence Used: ${weaponUsed === "yes" ? "Yes" : "No"}`, 25, yPos);
    yPos += 5;
    doc.text(`- Fearing Immediate Arrest: ${fearArrest === "yes" ? "Yes" : "No"}`, 25, yPos);
    yPos += 12;

    // Evaluation Result Box
    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text(`Classification: ${result.classification}`, 20, yPos);
    yPos += 7;

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Governing Provision: ${result.crpcSection}`, 20, yPos);
    yPos += 8;

    // Description text wrapping
    doc.setFontSize(9.5);
    const detailLines = doc.splitTextToSize(result.details, pageWidth - 40);
    doc.text(detailLines, 20, yPos);
    yPos += detailLines.length * 4.5 + 12;

    // Steps to Take
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text("Recommended Legal Action Steps:", 20, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    result.steps.forEach((step, idx) => {
      const stepLines = doc.splitTextToSize(`${idx + 1}. ${step}`, pageWidth - 40);
      doc.text(stepLines, 20, yPos);
      yPos += stepLines.length * 4.5 + 3;

      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Important Notice Footer
    yPos += 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerLines = doc.splitTextToSize(
      "DISCLAIMER: This analysis is based on statutory rules of CrPC and is intended as a general civic education guide. It does not constitute formal legal advice. Please consult an advocate for court filings.",
      pageWidth - 40
    );
    doc.text(footerLines, 20, pageHeight - 20);

    doc.save("CivicShield_Bail_Eligibility_Report.pdf");
    toast.success("PDF exported successfully!");
  };

  const resetCalculator = () => {
    setOffenceType("");
    setImprisonmentTerm("");
    setWeaponUsed("");
    setFearArrest("");
    setFirstOffender("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bail Eligibility Assessor</h1>
        <p className="text-lg text-gray-600 font-light">
          Understand bailable vs non-bailable offense categories and evaluate anticipatory bail requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Questionnaire Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border border-gray-200 shadow-sm">
            <div className="space-y-6">
              {/* Question 1 */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">1</span>
                  What is the broad nature of the offence?
                </Label>
                <RadioGroup value={offenceType} onValueChange={setOffenceType} className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="minor" id="q1-minor" />
                    <Label htmlFor="q1-minor" className="cursor-pointer font-light">Minor offence (trespass, defamation, simple dispute)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="theft" id="q1-theft" />
                    <Label htmlFor="q1-theft" className="cursor-pointer font-light">Property offence (theft, burglary, cheating)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="violence" id="q1-violence" />
                    <Label htmlFor="q1-violence" className="cursor-pointer font-light">Physical offence (hurt, assault, brawling)</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="murder" id="q1-murder" />
                    <Label htmlFor="q1-murder" className="cursor-pointer font-light">Serious offence (culpable homicide, extortion, major fraud)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">2</span>
                  What is the maximum prison sentence for the accused offence?
                </Label>
                <RadioGroup value={imprisonmentTerm} onValueChange={setImprisonmentTerm} className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="under3" id="q2-under3" />
                    <Label htmlFor="q2-under3" className="cursor-pointer font-light">Less than 3 years</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="3-7" id="q2-37" />
                    <Label htmlFor="q2-37" className="cursor-pointer font-light">3 to 7 years</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="life" id="q2-life" />
                    <Label htmlFor="q2-life" className="cursor-pointer font-light">More than 7 years / Life</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">3</span>
                  Was any weapon used, or severe violence threatened?
                </Label>
                <RadioGroup value={weaponUsed} onValueChange={setWeaponUsed} className="flex gap-6 pt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q3-yes" />
                    <Label htmlFor="q3-yes" className="cursor-pointer font-light">Yes, weapon/violence involved</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q3-no" />
                    <Label htmlFor="q3-no" className="cursor-pointer font-light">No, completely non-violent</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 4 */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">4</span>
                  Do you fear immediate arrest by the police?
                </Label>
                <RadioGroup value={fearArrest} onValueChange={setFearArrest} className="flex gap-6 pt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q4-yes" />
                    <Label htmlFor="q4-yes" className="cursor-pointer font-light">Yes (Requires Anticipatory evaluation)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q4-no" />
                    <Label htmlFor="q4-no" className="cursor-pointer font-light">No (Evaluation for post-arrest/regular bail)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question 5 */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">5</span>
                  Is the accused a first-time offender?
                </Label>
                <RadioGroup value={firstOffender} onValueChange={setFirstOffender} className="flex gap-6 pt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q5-yes" />
                    <Label htmlFor="q5-yes" className="cursor-pointer font-light">Yes, no prior record</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q5-no" />
                    <Label htmlFor="q5-no" className="cursor-pointer font-light">No, has prior criminal record</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button
                  onClick={calculateEligibility}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 active:scale-98 transition-transform"
                >
                  Analyze Bail Eligibility
                </Button>
                {result && (
                  <Button variant="outline" onClick={resetCalculator} className="px-6 py-6 border-gray-300 text-gray-700">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1">
          {result ? (
            <Card className="p-6 sticky top-24 border border-gray-200 shadow-md bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Bail Report
              </h2>

              <div className={`p-4 rounded-lg mb-6 border text-center ${
                result.classification === "Bailable" ? "bg-green-50 border-green-200 text-green-800" :
                result.classification === "Non-Bailable" ? "bg-red-50 border-red-200 text-red-800" :
                "bg-amber-50 border-amber-200 text-amber-800"
              }`}>
                <span className="text-xs uppercase font-bold tracking-wider block mb-1">Assessed Status</span>
                <span className="text-xl font-black block">{result.classification}</span>
                <span className="text-xs font-semibold block mt-1">Governed by: {result.crpcSection}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-gray-500" />
                    Legal Details:
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">{result.details}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    Recommended Actions:
                  </h4>
                  <ul className="space-y-2">
                    {result.steps.map((step, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={exportPDF}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center justify-center gap-2 active:scale-98 transition-transform"
              >
                <Download className="w-4 h-4" />
                Export Bail Guide PDF
              </Button>
            </Card>
          ) : (
            <Card className="p-8 border border-gray-200 border-dashed text-center flex flex-col items-center justify-center min-h-[300px] bg-gray-50/20 rounded-xl">
              <HelpCircle className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-700">No Assessment Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                Answer the five simple questions on the left about the incident to generate your eligibility analysis report.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
