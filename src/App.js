import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Formal");

  const handleSubmit = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://guessgame-backend-1.onrender.com",
        { text}
      );

      // ✅ FIXED JSON handling (important)
    let data;

try {
  data =
    typeof res.data === "string"
      ? JSON.parse(res.data)
      : res.data;
} catch (e) {
  console.log("Raw response:", res.data);

  // Extract JSON manually from AI response
  const jsonMatch = res.data.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    data = JSON.parse(jsonMatch[0]);
  } else {
    alert("Invalid AI response");
    return;
  }
}

setResult(data);

      // Save history
      localStorage.setItem("lastEssay", JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("❌ Backend error or not running");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  return (
    <div style={styles.app}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h2>EssayAI</h2>
        <button style={styles.loginBtn}>Login</button>
      </div>

      {/* TITLE */}
      <h1 style={styles.title}>✨ AI Essay Improver</h1>

      {/* INPUT CARD */}
      <div style={styles.card}>
        <textarea
          style={styles.textarea}
          rows="6"
          placeholder="✍️ Paste your essay here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <p style={styles.count}>{text.length} characters</p>

        {/* TONE SELECTOR */}
        <select
          style={styles.select}
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Formal</option>
          <option>Casual</option>
          <option>Professional</option>
        </select>

        {/* BUTTONS */}
        <div style={styles.buttons}>
          <button
            onClick={handleSubmit}
            disabled={!text || loading}
            style={{
              ...styles.primaryBtn,
              opacity: !text || loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = "scale(1)")
            }
          >
            {loading
              ? "⚡ Improving your essay..."
              : "🚀 Improve Essay"}
          </button>

          <button onClick={handleClear} style={styles.secondaryBtn}>
            Clear
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!result && (
        <p style={styles.empty}>
          ✍️ Enter your essay and click improve to see magic!
        </p>
      )}

      {/* RESULTS */}
      {result && (
        <div style={styles.results}>
          <div style={{ ...styles.resultCard, ...styles.green }}>
            <h3>✅ Corrected</h3>
            <p>{result.corrected}</p>
          </div>

          <div style={{ ...styles.resultCard, ...styles.blue }}>
            <h3>🚀 Improved</h3>
            <p>{result.improved}</p>
            <button
              style={styles.copyBtn}
              onClick={() =>
                navigator.clipboard.writeText(result.improved)
              }
            >
              Copy
            </button>
          </div>

          <div style={{ ...styles.resultCard, ...styles.yellow }}>
            <h3>💡 Suggestions</h3>
            <ul>
              {result.suggestions.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...styles.resultCard, ...styles.purple }}>
            <h3>🎯 Score: {result.score}/100</h3>

            {/* PROGRESS BAR */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progress,
                  width: `${result.score}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  app: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
  },
  loginBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: "36px",
    marginBottom: "20px",
  },
  card: {
    maxWidth: "800px",
    margin: "auto",
    background: "rgba(255,255,255,0.95)",
    padding: "20px",
    borderRadius: "15px",
  },
  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  count: {
    fontSize: "12px",
    color: "gray",
  },
  select: {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "8px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  primaryBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
    transition: "0.3s",
  },
  secondaryBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#ddd",
  },
  empty: {
    textAlign: "center",
    color: "white",
    marginTop: "20px",
  },
  results: {
    maxWidth: "800px",
    margin: "20px auto",
  },
  resultCard: {
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px",
  },
  green: { background: "#d4f8e8" },
  blue: { background: "#dbeafe" },
  yellow: { background: "#fef9c3" },
  purple: { background: "#ede9fe" },
  copyBtn: {
    marginTop: "10px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
  },
  progressBar: {
    height: "10px",
    background: "#ddd",
    borderRadius: "10px",
    marginTop: "10px",
  },
  progress: {
    height: "100%",
    background: "green",
    borderRadius: "10px",
  },
};

export default App;