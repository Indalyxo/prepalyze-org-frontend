import { InlineMath, BlockMath } from "react-katex"; // Added BlockMath import
import { useState } from "react";
import { Loader } from "@mantine/core";

const isImageUrl = (text) => {
  const urlRegex =
    /^https?:\/\/[^\s]+(\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?[^\s]*)?)?$/i;
  const cloudinaryRegex = /^https?:\/\/res\.cloudinary\.com\/[^\s]+/i;
  const ufsRegex = /^https?:\/\/[a-z0-9.-]+\/[^\s]+/i; // allow ufs.sh etc.

  return urlRegex.test(text) || cloudinaryRegex.test(text) || ufsRegex.test(text);
};

const isLikelyLatex = (content) => {
  const latexPatterns = [
    /\\[a-zA-Z]+/,
    /\^[{]?[^}]*[}]?/,
    /_[{]?[^}]*[}]?/,
    /\\frac|\\sqrt|\\sum|\\int|\\lim|\\text|\\Delta|\\ominus|\\overset|\\underset/,
    /[{}]/,
    /\\[a-zA-Z]+\{/,
    /\[[A-Za-z]\]_\d/,
    /\\left|\\right/,
    /\\\(|\\\)/,
  ];

  const obviousTextPatterns = [
    /^[a-zA-Z\s.,!?]+$/,
    /^[a-zA-Z\s=]+[a-zA-Z\s]+$/,
  ];

  if (
    content.length > 30 &&
    obviousTextPatterns.some((pattern) => pattern.test(content)) &&
    !latexPatterns.some((pattern) => pattern.test(content))
  ) {
    return false;
  }

  return latexPatterns.some((pattern) => pattern.test(content));
};

const cleanLatexText = (text) => {
  return text
    .replace(/\{\[\}\s*([^{}]+?)\s*\{\]\}/g, "[$1]")
    .replace(/([A-Za-z])\{\[\]\}/g, "[$1]")
    .replace(/\{\[\}/g, "[")
    .replace(/\{\]\}/g, "]")
    .replace(/\\textgreater\{\}/g, ">")
    .replace(/\\textless\{\}/g, "<")
    .replace(/\\textdegree\{\}/g, "°")
    .replace(/\s*\\,\s*/g, " ")
    .replace(/\s*\\\s+/g, " ")
    .replace(/\s+\\([a-zA-Z]+)/g, "\\$1")
    .replace(/\\([a-zA-Z]+)\s+/g, "\\$1 ")
    .replace(/\\\$/g, "$")
    .replace(/\\\&/g, "&")
    .replace(/\\\%/g, "%")
    .replace(/(?<!\\)%/g, "\\%")
    .replace(/\s*([=<>±×÷])\s*/g, " $1 ");
};

const parseListEnvironment = (text) => {
  if (typeof text !== "string") {
    return null;
  }

  const enumerateRegex = /\\begin\{enumerate\}(.*?)\\end\{enumerate\}/s;
  const itemizeRegex = /\\begin\{itemize\}(.*?)\\end\{itemize\}/s;

  let match = text.match(enumerateRegex);
  let listType = "enumerate";

  if (!match) {
    match = text.match(itemizeRegex);
    listType = "itemize";
  }

  if (!match && /\\item\s+/.test(text)) {
    const itemRegex = /\\item\s+(.*?)(?=(\\item|$))/gs;
    const items = [];
    let itemMatch;
    let lastIndex = 0;
    while ((itemMatch = itemRegex.exec(text)) !== null) {
      items.push(itemMatch[1].trim());
      lastIndex = itemRegex.lastIndex;
    }
    const beforeText = text.slice(0, text.indexOf("\\item")).trim();
    const afterText = text.slice(lastIndex).trim();
    return {
      beforeText,
      afterText,
      items,
      fullMatch: null,
      listType: "enumerate",
    };
  }

  if (!match) return null;

  const [fullMatch, content] = match;
  const beforeText = text.substring(0, match.index).trim();
  const afterText = text.substring(match.index + fullMatch.length).trim();

  const itemRegex = /\\item\s+(.*?)(?=\\item|$)/gs;
  const items = [];
  let itemMatch;

  while ((itemMatch = itemRegex.exec(content)) !== null) {
    const itemContent = itemMatch[1].trim();
    if (itemContent) {
      items.push(itemContent);
    }
  }

  return {
    beforeText,
    afterText,
    items,
    fullMatch,
    listType,
  };
};

// Component for handling image with error state
const ImageWithError = ({ src, alt, style }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error("Image failed to load:", src);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffebee',
          border: '1px dashed #f44336',
          borderRadius: '4px',
          padding: '20px',
          minHeight: '60px',
        }}
      >
        <span
          style={{
            color: '#d32f2f',
            fontStyle: 'italic',
            fontSize: '0.9em',
            textAlign: 'center',
            wordBreak: 'break-all',
          }}
        >
          [Image failed to load: {src}]
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            minHeight: '60px',
          }}
        >
          <span style={{ color: '#666', fontSize: '0.9em' }}>
            <Loader size={"sm"} /> Loading image...
          </span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{
          ...style,
          display: isLoading ? 'none' : 'block',
        }}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

const renderWithLatexAndImages = (text) => {
  if (!text || typeof text !== "string") {
    return text || null;
  }

  const listData = parseListEnvironment(text);
  if (listData) {
    return (
      <div style={{ lineHeight: "1.6" }}>
        {listData.beforeText && (
          <div style={{ marginBottom: "10px" }}>
            {renderContent(listData.beforeText)}
          </div>
        )}
        {listData.listType === "enumerate" ? (
          <ol
            style={{
              paddingLeft: "20px",
              marginBottom: "10px",
              listStyleType: "decimal",
            }}
          >
            {listData.items.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  lineHeight: "1.6",
                }}
              >
                {renderContent(item)}
              </li>
            ))}
          </ol>
        ) : (
          <ul
            style={{
              paddingLeft: "20px",
              marginBottom: "10px",
              listStyleType: "disc",
            }}
          >
            {listData.items.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  lineHeight: "1.6",
                }}
              >
                {renderContent(item)}
              </li>
            ))}
          </ul>
        )}
        {listData.afterText && (
          <div style={{ marginTop: "10px" }}>
            {renderContent(listData.afterText)}
          </div>
        )}
      </div>
    );
  }

  // Handle LaTeX underline pattern: \_\_\_\_\_\_\_
  let preprocessedText = text.replace(/\\_{1,}/g, (match) => {
    return `__`;
  });

  return renderContent(preprocessedText);

  function renderContent(content) {
    if (!content || typeof content !== "string") {
      return content || null;
    }

    let cleanedText = cleanLatexText(content);

    // Updated regex patterns to better handle includegraphics with whitespace and newlines
    const patterns = [
      /\\includegraphics(?:\[[^\]]*\])?\s*\{([^}]+)\}/gs,
      /\$\$([^$]+)\$\$/g,        // Block math with $$
      /\\\[([^\]]+)\\\]/g,       // Block math with \[ \]
      /\$([^$]+)\$/g,            // Inline math
      /\\\(([^\\]*(?:\\[^)]*)*[^\\]*)\\\)/g, // Inline math with \( \)
      /\|([^|]+)\|/g,
      /\\[a-zA-Z]+(?:\{[^{}]*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}[^{}]*)*\})+/g,
      /[a-zA-Z]+(?:\s*\\?\s*[_^]\s*\{\s*[^}]+\s*\})+/g,
      /\\[a-zA-Z]+(?!\{)/g,
    ];

    const parts = [];
    let lastIndex = 0;
    const matches = [];

    patterns.forEach((pattern) => {
      let match;
      // Reset regex lastIndex to avoid issues with global patterns
      pattern.lastIndex = 0;
      while ((match = pattern.exec(cleanedText)) !== null) {
        matches.push({
          match: match,
          index: match.index,
          length: match[0].length,
          fullMatch: match[0],
          content: match[1] || match[0],
        });
      }
    });

    matches.sort((a, b) => a.index - b.index);

    const nonOverlappingMatches = [];
    let lastEndIndex = -1;
    for (const match of matches) {
      if (match.index >= lastEndIndex) {
        nonOverlappingMatches.push(match);
        lastEndIndex = match.index + match.length;
      }
    }

    for (const matchInfo of nonOverlappingMatches) {
      const { match, index, length, fullMatch, content } = matchInfo;

      if (index > lastIndex) {
        const beforeText = cleanedText.slice(lastIndex, index);
        if (beforeText.trim()) {
          parts.push({ type: "text", value: beforeText });
        }
      }

      if (fullMatch.startsWith("\\includegraphics")) {
        const imageUrl = content.trim();
        let imgUrl = imageUrl;

        const driveMatch = imgUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
        if (driveMatch?.[1]) {
          imgUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }

        parts.push({ type: "image", value: imgUrl });
      } else if (isImageUrl(content.trim())) {
        let imgUrl = content.trim();

        const driveMatch = imgUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
        if (driveMatch?.[1]) {
          imgUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }

        parts.push({ type: "image", value: imgUrl });
      } else if (fullMatch.startsWith("$$") || fullMatch.startsWith("\\[")) {
        parts.push({ type: "block-latex", value: content.trim() });
      } else if (fullMatch.startsWith("$") || fullMatch.startsWith("\\(")) {
        parts.push({ type: "latex", value: content.trim() });
      } else if (fullMatch.startsWith("|") && isLikelyLatex(content.trim())) {
        parts.push({ type: "latex", value: content.trim() });
      } else if (fullMatch.startsWith("|")) {
        parts.push({ type: "text", value: fullMatch });
      } else if (
        fullMatch.match(/[a-zA-Z]+(?:\s*\\?\s*[_^]\s*\{\s*[^}]+\s*\})+/) ||
        fullMatch.startsWith("\\")
      ) {
        const latexContent = fullMatch.replace(/\s+/g, "");
        parts.push({ type: "latex", value: latexContent });
      } else {
        parts.push({ type: "text", value: fullMatch });
      }

      lastIndex = index + length;
    }

    if (lastIndex < cleanedText.length) {
      const remainingText = cleanedText.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({ type: "text", value: remainingText });
      }
    }

    if (parts.length === 0) {
      parts.push({ type: "text", value: cleanedText });
    }

    return parts.map((part, i) => {
      if (part.type === "text") {
        return (
          <span key={i} style={{ fontFamily: "'Noto Sans', sans-serif" }}>
            {part.value}
          </span>
        );
      } else if (part.type === "block-latex") {
        return (
          <div key={i} style={{ margin: "8px 0" }}>
            <BlockMath math={part.value} />
          </div>
        );
      } else if (part.type === "image") {
        return (
          <div key={i} style={{ margin: "10px 0" }}>
            <ImageWithError
              src={part.value}
              alt="Question content"
              style={{
                maxHeight: "300px",
                maxWidth: "100%",
                borderRadius: "4px",
                objectFit: "contain",
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        );
      } else if (part.type === "latex") {
        try {
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                verticalAlign: "baseline",
                margin: "0 2px",
              }}
            >
              <InlineMath math={part.value} />
            </span>
          );
        } catch (error) {
          console.error(
            "LaTeX rendering error:",
            error,
            "Content:",
            part.value
          );
          return (
            <span
              key={i}
              style={{
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                padding: "2px 4px",
                borderRadius: "3px",
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "0.9em",
              }}
            >
              [LaTeX Error: {part.value}]
            </span>
          );
        }
      }
      return null;
    });
  }
};

export { renderWithLatexAndImages };