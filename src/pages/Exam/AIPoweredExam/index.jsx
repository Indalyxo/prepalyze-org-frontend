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
  Download,
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import s from "./AIPoweredExam.module.scss";

import { renderWithLatexAndImages } from "../../../utils/render/render";
import AICreateExamModal from "../../../components/Exam/AICreateExamModal/AICreateExamModal";
import apiClient from "../../../utils/api"

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
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-red-900 dark:text-white mb-4">
          <h2 className="text-lg font-bold mb-1 text-red-600 dark:text-red-400">Math Rendering Error</h2>
          <pre className="whitespace-pre-wrap text-xs text-red-700 dark:text-red-300 overflow-auto">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Reusable animated input component - Updated to handle disabled state and theme
const ModernInput = ({ icon: Icon, label, value, onChange, placeholder, type = "text", options = [], disabled = false, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${s.modernInputContainer} ${disabled ? s.disabled : ''}`}>
      <motion.label
        initial={false}
        animate={{
          y: isFocused || value ? -24 : 12,
          x: isFocused || value ? 0 : 36,
          scale: isFocused || value ? 0.85 : 1,
        }}
        className={`${s.inputLabel} ${isFocused ? s.focused : ''}`}
      >
        {label} {!required && <span className={s.optionalText}>(Optional)</span>}
      </motion.label>
      <div className={s.inputWrapper}>
        <Icon 
          size={18} 
          className={`${s.inputIcon} ${isFocused ? s.focused : ''}`} 
        />
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={s.inputBase}
          >
            <option value="" disabled hidden></option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value || opt} className="bg-white dark:bg-slate-900 text-black dark:text-white">{opt.label || opt}</option>
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
            className={s.inputBase}
          />
        )}
        
        {/* Animated border bottom line */}
        <motion.div
          className={s.animatedBorder}
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
      className={`mb-6 overflow-hidden relative group`}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className={s.questionCard}>
        <div onClick={() => setExpanded(!expanded)} className="p-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-snug">
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
              <div className={s.cardExpanded}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 mt-4">
                  {q.options.map((option, idx) => {
                    const optText = typeof option === 'string' ? option : option?.text || JSON.stringify(option);
                    const isCorrect = optText === q.correctAnswer;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${isCorrect ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-emerald-500 text-slate-950" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={isCorrect ? "text-emerald-600 dark:text-emerald-300 font-medium" : "text-slate-600 dark:text-slate-300"}>
                          {renderWithLatexAndImages(optText)}
                        </span>
                        {isCorrect && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
                <div className={s.explanationBox}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                  <div className="flex items-start gap-3">
                    <BrainCircuit size={20} className="text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-cyan-600 dark:text-cyan-400 font-semibold mb-1">AI Explanation</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
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
  const [grade, setGrade] = useState("10th");
  const [count, setCount] = useState(5);

  // Document Generation State
  const [generationMode, setGenerationMode] = useState("database"); // "database" | "document"
  const [documentFile, setDocumentFile] = useState(null);
  const [documentText, setDocumentText] = useState("");

  const questionsRef = useRef(null);
  const printableRef = useRef(null);
  const fileInputRef = useRef(null);

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
  const [createModalOpened, setCreateModalOpened] = useState(false);

  // Helper to fetch distinct core metadata fields from backend
  const fetchUniqueFilter = async (field, queryObj = {}) => {
    try {
      const res = await apiClient.get(`/api/exam/ai/unique/${field}`, { params: queryObj });
      if (res.data.success) return res.data.data;
      return [];
    } catch (err) {
      console.error(`Failed to fetch ${field}s`, err);
      // toast.error(`Failed to fetch ${field}s`);
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
      fetchUniqueFilter('subject', { exam }).then(subs => {
        if (exam === "JEE-Main" || exam === "NEET-UG") {
          setAvailableSubjects(["Full Mock Exam", ...subs]);
        } else {
          setAvailableSubjects(subs);
        }
      });
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
    if (generationMode === "database" || generationMode === "pyq") {
      const isFullMock = subject === "Full Mock Exam";
      if (!exam || !subject || (!isFullMock && !chapter) || (generationMode === "pyq" && !topic && !isFullMock)) {
        toast.error(`Please select ${generationMode === "pyq" ? "Exam, Subject, Chapter, and Topic" : "Exam, Subject, and Chapter at minimum"}.`, {
          position: "top-right",
        });
        return;
      }
    } else {
      if (!documentFile && !documentText.trim()) {
        toast.error("Please upload a document or paste some text.", {
          position: "top-right",
        });
        return;
      }
    }

    setLoading(true);
    setQuestions([]);
    setRawJSON("");
    setError("");

    try {
      let res;
      if (generationMode === "database") {
        res = await apiClient.post("/api/exam/ai/generate", {
          exam,
          subject,
          chapter,
          topic: topic || undefined, 
          grade,
          count,
        });
      } else if (generationMode === "pyq") {
        res = await apiClient.post("/api/exam/ai/generate-pyq", {
          exam,
          subject,
          chapter,
          topic,
          grade,
          count,
        });
      } else {
        const formData = new FormData();
        formData.append("exam", exam || "Document Upload");
        formData.append("subject", subject || "General");
        formData.append("chapter", chapter || "Various");
        formData.append("topic", topic || "Document Content");
        formData.append("grade", grade || "10th");
        formData.append("count", count);

        if (documentFile) {
          formData.append("document", documentFile);
        } else if (documentText.trim()) {
          formData.append("text", documentText);
        }

        res = await apiClient.post("/api/exam/ai/generate-from-document", formData);
      }

      const data = res.data;

      if (!data.success) {
        throw new Error(data.error || "Failed to generate questions from server");
      }

      setQuestions(data.questions);
      setRawJSON(JSON.stringify(data.questions, null, 2));
      toast.success(`Successfully generated ${data.questions.length} questions!`);

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || String(err);
      setError(errorMessage);
      toast.error(errorMessage.length > 50 ? "Generation failed" : errorMessage);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.pageContainer}>
      
      {/* Background ambient light effects */}
      <div className={s.ambientEmerald} />
      <div className={s.ambientCyan} />
      <div className={s.ambientPurple} />

      <Container size="lg" className="relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className={s.iconWrapper}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-10 dark:opacity-25 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-500" />
            <Sparkles className="w-8 h-8 text-emerald-500 dark:text-emerald-400 relative z-10" />
          </div>
          <h1 className={s.mainTitle}>
            AI Exam Generator
          </h1>
          <p className={s.mainSubtitle}>
            Harness the power of GPT-4o to instantly create high-quality, varied MCQ questions based on your existing database templates or uploaded documents.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className={s.modeToggleContainer}>
            <button
              onClick={() => setGenerationMode("database")}
              className={`${s.modeToggleBtn} ${generationMode === "database" ? `${s.active} ${s.database}` : ''}`}
            >
              Generate from Database
            </button>
            <button
              onClick={() => setGenerationMode("document")}
              className={`${s.modeToggleBtn} ${generationMode === "document" ? `${s.active} ${s.document}` : ''}`}
            >
              Generate from Document
            </button>
            <button
              onClick={() => setGenerationMode("pyq")}
              className={`${s.modeToggleBtn} ${generationMode === "pyq" ? `${s.active} ${s.pyq}` : ''}`}
            >
              Generate PYQs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Configuration Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 sticky top-6"
          >
            <div className={s.configCard}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px]" />
              <h2 className={s.cardTitle}>
                <Layers className="text-emerald-500 dark:text-emerald-400" />
                Configuration
              </h2>

              {generationMode === "document" && (
                <div className={s.docUploadBox}>
                  <ModernInput 
                    type="select"
                    icon={Layers} 
                    label="Target Grade" 
                    required
                    value={grade} 
                    options={["6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
                    onChange={(e) => setGrade(e.target.value)} 
                  />

                  <label className={s.docLabel}>
                    Upload PDF Document
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.txt"
                    onChange={(e) => {
                      setDocumentFile(e.target.files[0]);
                      if (e.target.files[0]) setDocumentText(""); // Clear text if file is uploaded
                    }}
                    className={s.fileInputCustom}
                  />
                  
                  <div className={s.docDivider}>
                    <div className={s.dividerLine}></div>
                    <span className={s.dividerText}>OR</span>
                    <div className={s.dividerLine}></div>
                  </div>

                  <label className={s.docLabel}>
                    Paste Raw Text
                  </label>
                  <textarea
                    value={documentText}
                    onChange={(e) => {
                      setDocumentText(e.target.value);
                      if (e.target.value.trim() && documentFile) {
                        setDocumentFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }
                    }}
                    placeholder="Paste context here..."
                    className={s.docTextarea}
                  />
                </div>
              )}

              {generationMode === "database" && (
                <>
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
                    icon={Layers} 
                    label="Target Grade" 
                    required
                    value={grade} 
                    options={["6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
                    onChange={(e) => setGrade(e.target.value)} 
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

                  {subject === "Full Mock Exam" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <BrainCircuit size={18} className="text-emerald-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Mock Exam Guidance</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {exam === "JEE-Main" 
                              ? "Generates 30 questions (10 per subject: Phys, Chem, Math) targeting overall balance."
                              : "Generates 40 questions (10 per subject: Phys, Chem, Bot, Zoo) for a complete feel."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {subject !== "Full Mock Exam" && (
                    <>
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
                    </>
                  )}
                </>
              )}

              {generationMode === "pyq" && (
                <>
                  <p className={s.configDescription}>
                    AI will generate Previous Year Questions or high-fidelity mimics for the selected topic.
                  </p>
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
                    icon={Layers} 
                    label="Target Grade" 
                    required
                    value={grade} 
                    options={["6th", "7th", "8th", "9th", "10th", "11th", "12th"]}
                    onChange={(e) => setGrade(e.target.value)} 
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

                  {subject !== "Full Mock Exam" && (
                    <>
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
                        required
                        value={topic} 
                        options={availableTopics}
                        onChange={(e) => setTopic(e.target.value)} 
                        disabled={!chapter}
                      />
                    </>
                  )}
                </>
              )}

              {subject !== "Full Mock Exam" && (
                <ModernInput 
                  type="select"
                  icon={Layers} 
                  label="Question Count" 
                  required
                  value={count} 
                  options={[5, 10, 15, 20, 25].map(v => ({ value: v, label: `${v} Questions${v === 25 ? ' (Max)' : ''}` }))}
                  onChange={(e) => setCount(Number(e.target.value))} 
                />
              )}

              <button
                onClick={generate}
                disabled={loading}
                className={s.generateButton}
              >
                {!loading && <div className={s.buttonGlow} />}
                <div className={`${s.buttonInner} ${loading ? s.loading : ''}`}>
                  {loading ? (
                    <>
                      <Loader2 className={s.loadingSpinner} />
                      <span className={s.buttonText}>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className={`w-5 h-5 ${s.btnIcon}`} />
                      <span className={s.buttonText}>Generate via AI</span>
                    </>
                  )}
                </div>
              </button>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" size={20} />
                      <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap font-mono">{error}</p>
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
              <div className={s.emptyState}>
                <BrainCircuit size={64} className="text-slate-300 dark:text-slate-700 opacity-50" />
                <div>
                  <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2">Awaiting Parameters</h3>
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
                    className={s.loadingOverlay}
                  >
                    <div className={s.spinnerContainer}>
                      <div className={`${s.spinnerCircle} ${s.circleOuter}`} />
                      <div className={`${s.spinnerCircle} ${s.circleEmerald}`} />
                      <div className={`${s.spinnerCircle} ${s.circleCyan}`} />
                      <div className={`${s.spinnerCircle} ${s.circlePurple}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    <motion.h3 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className={s.loadingText}
                    >
                      AI is formulating questions...
                    </motion.h3>
                    <p className={s.loadingSubtext}>
                      Fetching database templates and engaging neural network to synthesize completely new, highly relevant questions.
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Results Display */}
            {!loading && questions.length > 0 && (
              <div>
                <div className={s.resultsHeader}>
                  <h2 className={s.resultsTitle}>
                    <span className={s.gradientText}>
                      Generated Arsenal
                    </span>
                    <span className={s.resultsBadge}>
                      {questions.length} Items Saved to DB
                    </span>
                  </h2>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setCreateModalOpened(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all text-sm font-medium shadow-md shadow-emerald-500/20"
                    >
                      <PlusCircle size={18} />
                      Create Exam
                    </button>
                    
                    <button 
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-sm font-medium shadow-md dark:shadow-lg hover:shadow-emerald-500/10"
                    >
                      <Download size={18} />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-2" ref={questionsRef}>
                  {questions.map((q, i) => (
                    <ErrorBoundary key={i}>
                      <QuestionCard q={q} index={i} />
                    </ErrorBoundary>
                  ))}
                </div>

                {/* Raw JSON Accordion */}
                <div className="mt-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <details className="group">
                    <summary className="p-4 cursor-pointer font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors list-none select-none">
                      <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                      View Raw Database Dump
                    </summary>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                      <pre className="text-xs text-emerald-600 dark:text-emerald-400/80 font-mono overflow-auto max-h-96 custom-scrollbar">
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
      
      <AICreateExamModal 
        opened={createModalOpened} 
        onClose={() => setCreateModalOpened(false)} 
        aiQuestions={questions} 
      />

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