import { Center, Title, Container, Stack } from "@mantine/core";
import { useState } from "react";

const API_KEY = "AIzaSyBBFifhYMCGJHv4bffGUHBRoUmq8nu_5cE"; // 🔐 Put your Gemini API key here

export default function AIPoweredExam() {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [rawJSON, setRawJSON] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!subject || !chapter || !topic) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setRawJSON("");
    setError("");

    const prompt = `
Generate ${count} JEE PYQ level MCQ questions.

Return ONLY valid JSON array.

Each object format:
{
  "questionId": "Q1",
  "question": "text",
  "options": [{"text":"A"},{"text":"B"},{"text":"C"},{"text":"D"}],
  "correctAnswer": "text",
  "explanation": "text",
  "topic": "${topic}",
  "chapter": "${chapter}",
  "subject": "${subject}",
  "exam": "JEE",
  "type": "MCQ",
  "difficulty": "medium",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}

Rules:
• PYQ level conceptual + numerical mix
• exactly 4 options
• correctAnswer must match option text exactly
• no extra text outside JSON
`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();

      if (!data.candidates) {
        throw new Error(JSON.stringify(data, null, 2));
      }

      const text = data.candidates[0].content.parts[0].text;
      setRawJSON(text);

      const parsed = JSON.parse(text);
      setQuestions(parsed);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      {/* Page Title */}
      <Center mb="lg">
        <Title order={1}>🤖 AI Powered Exam Generator</Title>
      </Center>

      {/* Inputs */}
      <div className="space-y-3 max-w-md">
        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          placeholder="Subject (Maths / Physics / Chemistry)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <select
          className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={15}>15 Questions</option>
          <option value={20}>20 Questions</option>
          <option value={25}>25 Questions (Max)</option>
        </select>

        <button
          onClick={generate}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded"
        >
          {loading ? "⏳ Generating..." : "Generate Questions"}
        </button>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <>
          <h3 className="text-xl mt-8 mb-2">📄 Questions</h3>

          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-700 rounded p-4 my-4 text-white"
            >
              <b>
                Q{i + 1}. {q.question}
              </b>

              <div className="mt-2 space-y-1">
                {q.options.map((o, idx) => (
                  <div key={idx}>• {o.text}</div>
                ))}
              </div>

              <div className="text-green-400 mt-2">
                ✔ Answer: {q.correctAnswer}
              </div>

              <div className="italic text-slate-400">{q.explanation}</div>
            </div>
          ))}
        </>
      )}

      {/* Raw JSON */}
      {rawJSON && (
        <>
          <h3 className="text-xl mt-6 mb-2">🧾 Raw JSON (MongoDB Ready)</h3>
          <pre className="bg-slate-900 border border-slate-700 p-3 overflow-auto text-white">
            {rawJSON}
          </pre>
        </>
      )}

      {/* Error */}
      {error && (
        <>
          <h3 className="text-xl mt-6 mb-2 text-red-400">⚠ Error</h3>
          <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
        </>
      )}
    </Container>
  );
}
