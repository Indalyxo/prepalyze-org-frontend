import React, { useState } from "react";
import apiClient from "../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { renderWithLatexAndImages } from "../../utils/render/render";

const CheckingPage = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [params, setParams] = useState(
    null
  );

  const fetchQuestion = async ({ queryKey }) => {
    const [, { start, end }] = queryKey;
    const response = await apiClient.get("/questions", {
      params: { start, end },
    });
    return response.data.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GET_QN", params],
    queryFn: fetchQuestion,
    enabled: false, // 🚀 only fetch when refetch is called
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (start && end) {
      setParams({ start: Number(start), end: Number(end) });
      refetch();
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          placeholder="Start"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
        <input
          type="number"
          placeholder="End"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Fetch
        </button>
      </form>

      {/* Results */}
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 500,
            color: "#4B5563",
          }}
        >
          Loading...
        </div>
      )}

      {data &&
        data.map((question, index) => (
          <div
            key={question._id}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
            }}
          >
            {question.questionId}
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1F2937",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#6366F1", fontWeight: 700 }}>
                {index + 1}.
              </span>
              {renderWithLatexAndImages(question.question)}
            </h3>
            <p>
              {renderWithLatexAndImages(question.correctAnswer)}
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#4B5563",
              }}
            >
              {renderWithLatexAndImages(
                question.explanation || "No explanation provided."
              )}
            </p>
          </div>
        ))}
    </div>
  );
};

export default CheckingPage;
