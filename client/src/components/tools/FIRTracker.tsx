import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, AlertCircle, Download } from "lucide-react";
import jsPDF from "jspdf";

interface FIRData {
  firNumber: string;
  filedDate: string;
  policeStation: string;
  offenceDescription: string;
}

interface Timeline {
  day: number;
  milestone: string;
  status: "completed" | "upcoming" | "overdue";
  action: string;
}

export default function FIRTracker() {
  const [firData, setFirData] = useState<FIRData>({
    firNumber: "",
    filedDate: "",
    policeStation: "",
    offenceDescription: "",
  });
  const [timeline, setTimeline] = useState<Timeline[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generateTimeline = () => {
    if (!firData.filedDate) {
      alert("Please enter FIR filing date");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filedDate = new Date(firData.filedDate);
      const today = new Date();
      const daysSinceFiled = Math.floor(
        (today.getTime() - filedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const milestones: Timeline[] = [
        {
          day: 0,
          milestone: "FIR Registration",
          status: daysSinceFiled >= 0 ? "completed" : "upcoming",
          action: "FIR registered under CrPC Section 154",
        },
        {
          day: 7,
          milestone: "First Report Due",
          status:
            daysSinceFiled >= 7
              ? "completed"
              : daysSinceFiled > 7
                ? "overdue"
                : "upcoming",
          action: "Police should provide initial investigation report",
        },
        {
          day: 30,
          milestone: "Investigation Progress",
          status:
            daysSinceFiled >= 30
              ? "completed"
              : daysSinceFiled > 30
                ? "overdue"
                : "upcoming",
          action: "Police must update on investigation status",
        },
        {
          day: 60,
          milestone: "Chargesheet Due (Bailable Offence)",
          status:
            daysSinceFiled >= 60
              ? "completed"
              : daysSinceFiled > 60
                ? "overdue"
                : "upcoming",
          action: "Chargesheet must be filed under CrPC Section 173",
        },
        {
          day: 90,
          milestone: "Chargesheet Due (Non-Bailable Offence)",
          status:
            daysSinceFiled >= 90
              ? "completed"
              : daysSinceFiled > 90
                ? "overdue"
                : "upcoming",
          action: "Extended chargesheet deadline for serious offences",
        },
      ];

      setTimeline(milestones);
      setLoading(false);
    }, 800);
  };

  const exportPDF = () => {
    if (!timeline) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175);
    doc.text("CivicShield - FIR Status Tracker Report", pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 15;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, {
      align: "center",
    });
    yPos += 15;

    // FIR Details
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text("FIR Details:", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`FIR Number: ${firData.firNumber}`, 20, yPos);
    yPos += 6;
    doc.text(`Filed Date: ${firData.filedDate}`, 20, yPos);
    yPos += 6;
    doc.text(`Police Station: ${firData.policeStation}`, 20, yPos);
    yPos += 10;

    // Timeline
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text("Legal Timeline & Milestones:", 20, yPos);
    yPos += 10;

    doc.setFontSize(9);
    timeline.forEach((item) => {
      const statusColor =
        item.status === "completed"
          ? [34, 197, 94]
          : item.status === "overdue"
            ? [220, 38, 38]
            : [100, 100, 100];

      doc.setTextColor(...statusColor);
      doc.text(`Day ${item.day}: ${item.milestone}`, 20, yPos);
      yPos += 5;

      doc.setTextColor(0, 0, 0);
      const actionLines = doc.splitTextToSize(item.action, pageWidth - 40);
      doc.text(actionLines, 25, yPos);
      yPos += actionLines.length * 4 + 3;

      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }
    });

    yPos += 5;

    // Your Rights
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175);
    doc.text("Your Rights Under CrPC:", 20, yPos);
    yPos += 7;

    const rights = [
      "Right to know FIR status at any time",
      "Right to get certified copy of FIR",
      "Right to file complaint if chargesheet delayed",
      "Right to approach Magistrate under Section 156(3)",
    ];

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    rights.forEach((right) => {
      const lines = doc.splitTextToSize(`• ${right}`, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 4 + 2;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report is based on standard CrPC timelines. Consult with a lawyer for specific advice.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save("CivicShield_FIR_Status_Report.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          FIR Status Tracker
        </h1>
        <p className="text-lg text-gray-600 font-light">
          Know your rights after filing. Timelines, escalation paths, and
          accountability checkpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Enter FIR Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  FIR Number
                </label>
                <Input
                  placeholder="e.g., DLH/2024/12345"
                  value={firData.firNumber}
                  onChange={(e) =>
                    setFirData({ ...firData, firNumber: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date FIR was Filed
                </label>
                <Input
                  type="date"
                  value={firData.filedDate}
                  onChange={(e) =>
                    setFirData({ ...firData, filedDate: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Police Station Name
                </label>
                <Input
                  placeholder="e.g., Delhi Police Station, Mumbai Central"
                  value={firData.policeStation}
                  onChange={(e) =>
                    setFirData({ ...firData, policeStation: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Offence Description
                </label>
                <Textarea
                  placeholder="Brief description of the offence..."
                  value={firData.offenceDescription}
                  onChange={(e) =>
                    setFirData({
                      ...firData,
                      offenceDescription: e.target.value,
                    })
                  }
                  className="w-full min-h-32"
                />
              </div>

              <Button
                onClick={generateTimeline}
                disabled={!firData.filedDate || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
              >
                {loading ? "Generating Timeline..." : "Generate Timeline"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Timeline Results */}
        <div className="lg:col-span-1">
          {timeline && (
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>

              <div className="space-y-4 mb-6">
                {timeline.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-300 pl-4">
                    <div className="flex items-start gap-2 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                          item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "overdue"
                              ? "bg-red-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Day {item.day}
                        </p>
                        <p className="text-xs text-gray-600">{item.milestone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  These are statutory timelines under CrPC. If delayed, you can
                  file a complaint.
                </p>
              </div>

              {/* Export Button */}
              <Button
                onClick={exportPDF}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
