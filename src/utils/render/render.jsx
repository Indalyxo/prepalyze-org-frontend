import { InlineMath } from "react-katex";

const isImageUrl = (text) => {
  const urlRegex =
    /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|bmp|svg|webp)(\?[^\s]*)?$/i;
  const cloudinaryRegex = /^https?:\/\/res\.cloudinary\.com\/[^\s]+/i;
  return urlRegex.test(text) || cloudinaryRegex.test(text);
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
    .replace(/\\\%/g, "%") // ✅ Convert escaped % back to normal %
    .replace(/(?<!\\)%/g, "\\%")
    .replace(/\s*([=<>±×÷])\s*/g, " $1 ");
};


const parseListEnvironment = (text) => {
  // Ensure text is a string
  if (typeof text !== "string") {
    return null;
  }

  // Check for both enumerate and itemize environments
  const enumerateRegex = /\\begin\{enumerate\}(.*?)\\end\{enumerate\}/s;
  const itemizeRegex = /\\begin\{itemize\}(.*?)\\end\{itemize\}/s;

  let match = text.match(enumerateRegex);
  let listType = "enumerate";

  if (!match) {
    match = text.match(itemizeRegex);
    listType = "itemize";
  }

  // NEW: Handle orphan \item blocks (no environment)
  if (!match && /\\item\s+/.test(text)) {
    // Find all items
    const itemRegex = /\\item\s+(.*?)(?=(\\item|$))/gs;
    const items = [];
    let itemMatch;
    let lastIndex = 0;
    while ((itemMatch = itemRegex.exec(text)) !== null) {
      items.push(itemMatch[1].trim());
      lastIndex = itemRegex.lastIndex;
    }
    // Text before first item
    const beforeText = text.slice(0, text.indexOf("\\item")).trim();
    // Text after last item
    const afterText = text.slice(lastIndex).trim();
    return {
      beforeText,
      afterText,
      items,
      fullMatch: null,
      listType: "enumerate", // Default to ordered list
    };
  }

  if (!match) return null;

  const [fullMatch, content] = match;
  const beforeText = text.substring(0, match.index).trim();
  const afterText = text.substring(match.index + fullMatch.length).trim();

  // Extract items from the list content
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

const renderWithLatexAndImages = (text) => {
  // Add type checking at the beginning
  if (!text || typeof text !== "string") {
    return text || null;
  }

  // Check for list environments first (both enumerate and itemize)
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
  // Replace sequences of 3 or more underscores with an underlined blank
  let preprocessedText = text.replace(/\\_{1,}/g, (match) => {
    const length = match.length - 1;
    return `__`;
  });

  // Normal rendering for non-assertion-reason content
  return renderContent(preprocessedText);

  function renderContent(content) {
    // Add type checking for content parameter
    if (!content || typeof content !== "string") {
      return content || null;
    }

    let cleanedText = cleanLatexText(content);

    const patterns = [
      /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g,
      /\$([^$]+)\$/g,
      /\\\(([^\\]*(?:\\[^)]*)*[^\\]*)\\\)/g,
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
          <div key={i} style={{ margin: "10px 0"}}>
            <img
              src={part.value}
              alt="Question content"
              style={{
                maxHeight: "300px",
                maxWidth: "100%",
                borderRadius: "4px",
                objectFit:  "contain",
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onError={(e) => {
                console.error("Image failed to load:", part.value);
                e.target.parentElement.innerHTML = `<span style="color: red; font-style: italic;">[Image failed to load: ${part.value}]</span>`;
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
