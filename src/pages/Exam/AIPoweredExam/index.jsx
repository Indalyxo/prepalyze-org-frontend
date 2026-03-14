import { useState, useEffect, Component, useRef } from "react";
import { Container } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Hash,
  Layers,
  FileQuestion,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  BrainCircuit,
  AlertCircle,
  Download
} from "lucide-react";
import { toast } from "react-toastify";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

import { renderWithLatexAndImages } from "../../../utils/render/render";

// ErrorBoundary to catch KaTeX rendering crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-950/40 border border-red-900 rounded-lg text-white mb-4">
          <h2 className="text-lg font-bold mb-1 text-red-400">Math Rendering Error</h2>
          <pre className="whitespace-pre-wrap text-xs text-red-300 overflow-auto">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Reusable animated input component - Updated to handle disabled state
const ModernInput = ({ icon: Icon, label, value, onChange, placeholder, type = "text", options = [], disabled = false, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative mb-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <motion.label
        initial={false}
        animate={{
          y: isFocused || value ? -24 : 12,
          x: isFocused || value ? 0 : 36,
          scale: isFocused || value ? 0.85 : 1,
          color: isFocused ? "#10B981" : disabled ? "#475569" : "#94A3B8"
        }}
        className="absolute left-0 z-10 origin-left font-medium pointer-events-none transition-colors"
      >
        {label} {!required && <span className="text-slate-500 text-xs font-normal">(Optional)</span>}
      </motion.label>
      <div className="relative flex items-center">
        <Icon 
          size={18} 
          className={`absolute left-3 transition-colors duration-300 ${isFocused ? 'text-emerald-500' : 'text-slate-500'}`} 
        />
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-slate-900/50 border-b-2 border-slate-700/50 pt-3 pb-2 pl-10 pr-4 text-white hover:bg-slate-800/50 focus:bg-slate-800/80 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer rounded-t-lg appearance-none"
          >
            <option value="" disabled hidden></option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ""}
            className="w-full bg-slate-900/50 border-b-2 border-slate-700/50 pt-3 pb-2 pl-10 pr-4 text-white hover:bg-slate-800/50 focus:bg-slate-800/80 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-600 rounded-t-lg"
          />
        )}
        
        {/* Animated border bottom line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500"
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

// Expandable Question Card
const QuestionCard = ({ q, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="mb-6 overflow-hidden relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-[#0B1120] border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
        <div onClick={() => setExpanded(!expanded)} className="p-6 cursor-pointer hover:bg-slate-900/50 transition-colors flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-100 leading-snug">
              {renderWithLatexAndImages(q.question)}
            </h3>
          </div>
          <button className="flex-shrink-0 mt-1 text-slate-400 hover:text-emerald-400 transition-colors">
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 pt-2 border-t border-slate-800/50 bg-slate-900/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 mt-4">
                  {q.options.map((option, idx) => {
                    const optText = typeof option === 'string' ? option : option?.text || JSON.stringify(option);
                    const isCorrect = optText === q.correctAnswer;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${isCorrect ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-slate-950 border-slate-800"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={isCorrect ? "text-emerald-300 font-medium" : "text-slate-300"}>
                          {renderWithLatexAndImages(optText)}
                        </span>
                        {isCorrect && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-cyan-950/20 border border-cyan-900/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                  <div className="flex items-start gap-3">
                    <BrainCircuit size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-1">AI Explanation</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {renderWithLatexAndImages(q.explanation)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


// Printable Layout for PDF Export
const PrintableArsenal = ({ questions, subject, chapter }) => {
  return (
    <div className="p-10 bg-white text-black font-serif">
      <div className="border-b-2 border-black pb-4 mb-8 text-center">
        <h1 className="text-3xl font-bold uppercase mb-2">Exam Arsenal</h1>
        <p className="text-lg italic">{subject} - {chapter}</p>
        <p className="text-sm mt-2 font-sans text-gray-600">Generated by Prepalyze AI</p>
      </div>

      <div className="space-y-10">
        {questions.map((q, i) => (
          <div key={i} className="break-inside-avoid">
            <h3 className="text-xl font-bold mb-4 flex gap-2">
              <span>{i + 1}.</span>
              {renderWithLatexAndImages(q.question)}
            </h3>
            
            <div className="grid grid-cols-1 gap-3 ml-6">
              {q.options.map((option, idx) => {
                const optText = typeof option === 'string' ? option : option?.text || JSON.stringify(option);
                return (
                  <div key={idx} className="flex gap-3">
                    <span className="font-bold">{String.fromCharCode(65 + idx)})</span>
                    {renderWithLatexAndImages(optText)}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-50 border-l-4 border-gray-300">
              <p className="font-bold text-sm mb-1 uppercase tracking-wider text-gray-700 underline">Official Explanation</p>
              <div className="text-gray-800 text-sm leading-relaxed">
                {renderWithLatexAndImages(q.explanation)}
              </div>
              <p className="mt-2 text-sm font-bold">Correct Answer: {q.correctAnswer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 font-sans">
        © 2026 Prepalyze. All rights reserved. Professional AI-Generated Content.
      </div>
    </div>
  );
};

export default function AIPoweredExam() {
  // Cascading Selection State
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);

  const questionsRef = useRef(null);
  const printableRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;
    
    const id = toast.loading("Generating your professional PDF...");
    try {
      // Small delay to ensure any layout shifts are settled
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(printableRef.current, {
        backgroundColor: '#ffffff',
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const contentHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = contentHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, contentHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - contentHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, contentHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Prepalyze_${subject}_${chapter}_Questions.pdf`);
      
      toast.update(id, { 
        render: "Document Downloaded!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (err) {
      console.error("PDF Generation failed:", err);
      toast.update(id, { 
        render: "Download failed. Please try again.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  // Available Data State
  const [availableExams, setAvailableExams] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);

  // UI State
  const [questions, setQuestions] = useState([]);
  const [rawJSON, setRawJSON] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to fetch distinct core metadata fields from backend
  const fetchUniqueFilter = async (field, queryObj = {}) => {
    try {
      const qs = new URLSearchParams(queryObj).toString();
      const res = await fetch(`/api/exam/ai/unique/${field}?${qs}`);
      const result = await res.json();
      if (result.success) return result.data;
      return [];
    } catch (err) {
      console.error(`Failed to fetch ${field}s`, err);
      return [];
    }
  };

  // 1. Fetch Exams on mount
  useEffect(() => {
    fetchUniqueFilter('exam').then(setAvailableExams);
  }, []);

  // 2. Fetch Subjects when Exam changes + reset downward
  useEffect(() => {
    setSubject(""); setChapter(""); setTopic("");
    setAvailableSubjects([]); setAvailableChapters([]); setAvailableTopics([]);
    if (exam) {
      fetchUniqueFilter('subject', { exam }).then(setAvailableSubjects);
    }
  }, [exam]);

  // 3. Fetch Chapters when Subject changes + reset downward
  useEffect(() => {
    setChapter(""); setTopic("");
    setAvailableChapters([]); setAvailableTopics([]);
    if (subject) {
      fetchUniqueFilter('chapter', { exam, subject }).then(setAvailableChapters);
    }
  }, [subject, exam]);

  // 4. Fetch Topics when Chapter changes + reset downward
  useEffect(() => {
    setTopic("");
    setAvailableTopics([]);
    if (chapter) {
      fetchUniqueFilter('topic', { exam, subject, chapter }).then(setAvailableTopics);
    }
  }, [chapter, subject, exam]);


  const generate = async () => {
    if (!exam || !subject || !chapter) {
      toast.error("Please select an Exam, Subject, and Chapter at minimum.", {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    setLoading(true);
    setQuestions([]);
    setRawJSON("");
    setError("");

    try {
      const res = await fetch("/api/exam/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          subject,
          chapter,
          topic: topic || undefined, // Send undefined if empty so the backend query handles it as 'any' topic within chapter
          count,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate questions from server");
      }

      setQuestions(data.questions);
      setRawJSON(JSON.stringify(data.questions, null, 2));
      toast.success(`Successfully generated ${data.questions.length} questions!`, {
        theme: "dark"
      });

    } catch (err) {
      setError(String(err));
      toast.error("An error occurred during generation", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -left-64 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Container size="lg" className="relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 border border-slate-700/50 rounded-2xl mb-6 shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <Sparkles className="w-8 h-8 text-emerald-400 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            AI Exam Generator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Harness the power of GPT-4o to instantly create high-quality, varied MCQ questions based on your existing database templates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Configuration Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 sticky top-6"
          >
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px]" />
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <Layers className="text-emerald-400" />
                Configuration
              </h2>

              <ModernInput 
                type="select"
                icon={BookOpen} 
                label="Exam Category" 
                required
                value={exam} 
                options={availableExams}
                onChange={(e) => setExam(e.target.value)} 
              />
              
              <ModernInput 
                type="select"
                icon={BookOpen} 
                label="Subject" 
                required
                value={subject} 
                options={availableSubjects}
                onChange={(e) => setSubject(e.target.value)} 
                disabled={!exam}
              />

              <ModernInput 
                type="select"
                icon={Hash} 
                label="Chapter" 
                required
                value={chapter} 
                options={availableChapters}
                onChange={(e) => setChapter(e.target.value)} 
                disabled={!subject}
              />

              <ModernInput 
                type="select"
                icon={FileQuestion} 
                label="Topic" 
                value={topic} 
                options={availableTopics}
                onChange={(e) => setTopic(e.target.value)} 
                disabled={!chapter}
              />

              <ModernInput 
                type="select"
                icon={Layers} 
                label="Question Count" 
                required
                value={count} 
                options={[5, 10, 15, 20, 25].map(v => ({ value: v, label: `${v} Questions${v === 25 ? ' (Max)' : ''}` }))}
                onChange={(e) => setCount(Number(e.target.value))} 
              />

              <button
                onClick={generate}
                disabled={loading}
                className={`w-full mt-4 group relative overflow-hidden rounded-xl font-bold text-lg p-[2px] transition-all hover:scale-[1.02] active:scale-95 ${
                  loading ? "cursor-not-allowed opacity-80" : ""
                }`}
              >
                {!loading && <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 animate-pulse" />}
                <div className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-950/80 backdrop-blur-sm transition-all ${!loading && "group-hover:bg-transparent"}`}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-emerald-400" />
                      <span className="text-emerald-400">Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
                      <span className="group-hover:text-slate-900 transition-colors">Generate via AI</span>
                    </>
                  )}
                </div>
              </button>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                    <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                      <p className="text-red-300 text-sm whitespace-pre-wrap font-mono">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column: Loading State / Results */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 relative min-h-[500px]"
          >
            {/* Empty State */}
            {!loading && questions.length === 0 && !error && (
              <div className="absolute inset-0 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-4 p-8 text-center bg-slate-900/20 backdrop-blur-sm">
                <BrainCircuit size={64} className="text-slate-700 opacity-50" />
                <div>
                  <h3 className="text-xl font-medium text-slate-400 mb-2">Awaiting Parameters</h3>
                  <p className="text-slate-500 max-w-sm">
                    Fill in the configuration panel on the left and click Generate to see the AI agent craft unique questions instantly.
                  </p>
                </div>
              </div>
            )}

            {/* Loading Animation */}
            <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center py-20 bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-3xl z-10"
                  >
                    <div className="relative w-32 h-32 mb-8">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-4 border-4 border-cyan-500 rounded-full border-b-transparent animate-spin-reverse" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                      <div className="absolute inset-8 border-4 border-purple-500 rounded-full border-l-transparent animate-spin" style={{ animationDuration: "2s" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    <motion.h3 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2"
                    >
                      AI is formulating questions...
                    </motion.h3>
                    <p className="text-slate-400 text-center max-w-md">
                      Fetching database templates and engaging neural network to synthesize completely new, highly relevant questions.
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Results Display */}
            {!loading && questions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      Generated Arsenal
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full font-mono">
                      {questions.length} Items Saved to DB
                    </span>
                  </h2>

                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition-all text-sm font-medium shadow-lg hover:shadow-emerald-500/10"
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>

                <div className="space-y-2" ref={questionsRef}>
                  {questions.map((q, i) => (
                    <ErrorBoundary key={i}>
                      <QuestionCard q={q} index={i} />
                    </ErrorBoundary>
                  ))}
                </div>

                {/* Raw JSON Accordion */}
                <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                  <details className="group">
                    <summary className="p-4 cursor-pointer font-medium text-slate-400 flex items-center gap-2 hover:bg-slate-800/50 transition-colors list-none">
                      <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                      View Raw Database Dump
                    </summary>
                    <div className="p-4 border-t border-slate-800 bg-slate-950">
                      <pre className="text-xs text-emerald-400/80 font-mono overflow-auto max-h-96 custom-scrollbar">
                        {rawJSON}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Hidden Printable Layout */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={printableRef} style={{ width: '800px' }}>
          <PrintableArsenal 
            questions={questions} 
            subject={subject || "All Subjects"} 
            chapter={chapter || "All Chapters"} 
          />
        </div>
      </div>
    </div>
  );
}