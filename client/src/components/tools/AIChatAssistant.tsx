import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  User,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface FAQItem {
  question: string;
  keywords: string[];
  response: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    question: "What to do if the police refuse to register my FIR?",
    keywords: ["fir", "refuse", "police station", "complaint", "refusal"],
    response: `If a police officer refuses to register your FIR for a cognizable offence, you have the following legal remedies:

1. **Approach Senior Police Officers (Section 154(3) CrPC):** Write a written complaint and send it by Registered Post to the Superintendent of Police (SP) or Commissioner of Police. If satisfied, they will investigate or direct an officer to do so.
2. **Magistrate Petition (Section 156(3) CrPC):** You can file a private complaint before the local Judicial Magistrate, who can order the police to register the FIR and investigate.
3. **Zero FIR:** If the incident occurred outside the jurisdiction of that police station, they must still file a "Zero FIR" and transfer it to the appropriate station. Refusing a Zero FIR can lead to disciplinary action against the officer.
4. **Lalita Kumari Landmark Judgment:** The Supreme Court ruled that registration of FIR is mandatory under Section 154 CrPC if the information discloses commission of a cognizable offence.`,
  },
  {
    question: "What are my rights if I am stopped or arrested by the police?",
    keywords: ["arrest", "stopped", "police", "rights", "detained", "custody"],
    response: `Under the Indian Constitution (Article 22) and the Code of Criminal Procedure (CrPC), you possess strong protection:

1. **Right to Know Grounds (Section 50 CrPC):** The police must tell you the exact reason/offence for which you are being arrested.
2. **Right to Consult a Lawyer (Section 41D CrPC):** You have the right to meet and consult an advocate of your choice during interrogation.
3. **Right to Inform a Friend/Relative (Section 50A CrPC):** The police must immediately inform a nominated relative or friend about your arrest and place of custody.
4. **Medical Examination (Section 54 CrPC):** You have a right to be medically examined by a doctor upon arrest to document any pre-existing injuries.
5. **Produced within 24 Hours (Section 57 CrPC):** You cannot be detained in police custody for more than 24 hours without being produced before a Judicial Magistrate.
6. **Arrest Memo:** Ensure the police draft an Arrest Memo containing signatures of at least one witness (family/locality) and the time/date of arrest.`,
  },
  {
    question: "How do I spot a fake court summons or legal notice?",
    keywords: ["fake", "notice", "summons", "forged", "court", "warrant"],
    response: `Fake legal notices and court warrants are frequently sent by fraudsters for extortion. Check these checkpoints:

1. **Verify Case Status Online:** Every legitimate summons has a Case Number or filing detail. Go to the official e-Courts Portal (ecourts.gov.in) and verify the case details.
2. **Official Seal and Signature:** A real court notice always carries a round physical stamp seal of the Court and the signature of the judicial officer/registrar.
3. **Check the QR Code:** Modern court notices/summons carry a digital QR code which, when scanned, redirects to the official e-courts case filing status page.
4. **Delivery Channel:** Official court summons are typically delivered by registered post, speed post, or an authorized court bailiff. They are rarely sent via WhatsApp or personal Gmail accounts.
5. **No Demands for Payment:** Real court summons never ask you to transfer money to a personal bank account or digital wallet to "settle the case."`,
  },
  {
    question: "What is an SLA breach and what is my recourse?",
    keywords: ["sla", "delay", "service", "citizen charter", "breach", "right to service"],
    response: `An SLA (Service Level Agreement) breach occurs when a public utility department (RTO, Passport, Municipal) fails to deliver a guaranteed service within the timeframe set in their Citizen's Charter.

Your remedies under State Right to Service Acts:
1. **Locate the State Act:** Check if your state has a Right to Service Act (e.g. Sakala in Karnataka, RTS in Maharashtra, Right to Citizen Services in Delhi).
2. **Identify the Designated Officer:** The charter lists the officer responsible for your application.
3. **File a First Appeal:** If delayed, submit a formal representation to the First Appellate Authority. They are mandated to hear the case and direct service delivery.
4. **Demand Penalty/Compensation:** Under the Act, if the delay is unjustified, the Appellate Authority can penalize the officer (typically Rs. 250 per day of delay, up to Rs. 5000) and pay it to you as compensation.`,
  },
  {
    question: "How do I file an RTI application?",
    keywords: ["rti", "right to information", "information", "public authority"],
    response: `The Right to Information (RTI) Act, 2005 allows any Indian citizen to request information from government departments:

1. **Identify the Public Authority:** Find which department holds the records (e.g. Municipal Corporation, Ministry, Police).
2. **Address the PIO:** Send your letter to the Public Information Officer (PIO) or Assistant PIO.
3. **Write Specific Questions:** Be clear, objective, and specific. Do not ask for opinions; ask for records, circulars, files, or audit sheets.
4. **Fee Payment:** Attach a Rs. 10 postal order, demand draft, or pay online (if using rtionline.gov.in). Citizens Below Poverty Line (BPL) are exempt from fees.
5. **Timeline:** The PIO must reply within 30 days. If the request concerns a person's life or liberty, they must reply within 48 hours.`,
  },
];

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your CivicShield AI Assistant. I can help answer queries about citizen rights, FIR procedures, court notices, RTI filing, and service deadlines. What is your question?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const responseText = searchFAQ(text);
      const botMsg: Message = {
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const searchFAQ = (query: string): string => {
    const cleanQuery = query.toLowerCase();
    
    // Find best match based on keywords
    let bestMatch: FAQItem | null = null;
    let maxMatches = 0;

    for (const faq of FAQ_DATABASE) {
      let matches = 0;
      for (const keyword of faq.keywords) {
        if (cleanQuery.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = faq;
      }
    }

    if (bestMatch && maxMatches > 0) {
      return bestMatch.response;
    }

    // Default response
    return `I couldn't find a direct match in my offline knowledge database for your query. 

Here are some general recommendations for legal/civic disputes:
1. **Document Everything:** Always keep digital scans of all receipts, reference numbers, emails, and notices.
2. **Citizen Portal Lookup:** Use official state government portals (like e-Courts, Digital India, or State RTI) to query official case coordinates.
3. **Escalate Properly:** Most departments have designated Grievance Officers or appellate layers before you need to file court cases.
4. **Consult Legal Aid:** If you cannot afford a private lawyer, approach the District Legal Services Authority (DLSA) in your local court complex for free legal representation.

Try asking about **"arrest rights"**, **"refused FIR"**, **"fake court summons"**, **"RTI help"**, or **"SLA breach"** for comprehensive guides.`;
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Bot className="w-8 h-8 text-blue-600 animate-pulse" />
          AI Legal & Rights Assistant
        </h1>
        <p className="text-sm text-gray-600 font-light">
          Simulated offline AI query console. Instant replies on constitutional protections, FIR checklists, and consumer redressal.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Sidebar FAQs */}
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-4 overflow-y-auto pr-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Quick Access Guides
          </h3>

          <div className="flex flex-col gap-2">
            {FAQ_DATABASE.map((faq, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(faq.question)}
                className="text-left p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/10 text-xs font-medium text-gray-700 leading-normal hover:shadow-xs transition-all active:scale-98"
              >
                {faq.question}
              </button>
            ))}
          </div>
          
          <Card className="p-3.5 bg-blue-50 border border-blue-200 mt-auto">
            <div className="flex gap-2 text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed">
                This simulated assistant runs 100% locally in your browser. No queries are transmitted to external servers, protecting your privacy.
              </p>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="lg:col-span-3 flex flex-col h-full bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* Top Panel */}
          <div className="bg-slate-50 border-b border-gray-200 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Offline Legal Bot</h3>
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-ping" />
                Active Knowledge Base (2026 Edition)
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isBot ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        isBot
                          ? "bg-slate-50 border text-slate-800 rounded-tl-none font-sans"
                          : "bg-blue-600 text-white rounded-tr-none font-light"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-[9px] text-gray-400 ${!isBot && "text-right"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border text-slate-800 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="border-t border-gray-200 p-4 bg-slate-50 flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about arrest rights, refused FIRs, fake notice markers..."
              disabled={isTyping}
              className="flex-1 bg-white h-11 border-gray-300"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-4 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
