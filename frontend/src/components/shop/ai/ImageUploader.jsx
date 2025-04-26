import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { FiUploadCloud } from "react-icons/fi";
import { FaRobot, FaCheckCircle, FaCopy, FaTrash, FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const pdfRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("aiHistory")) || [];
    setHistory(stored);
  }, []);

  const updateHistory = (fileName, desc, imageDataUrl, tags = [], metadata = {}) => {
    const newEntry = {
      id: Date.now(),
      fileName,
      image: imageDataUrl,
      description: desc,
      tags,
      metadata,
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem("aiHistory", JSON.stringify(newHistory));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setDescription("");
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://localhost:5002/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        updateHistory(image.name, data.description, imageBase64, data.tags || [], data.metadata || {});
        setDescription(data.description);
      };
      reader.readAsDataURL(image);
    } catch (error) {
      console.error("Upload failed", error);
      setDescription("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const beautifyDescription = (desc) => {
    return desc.replace(/- *\s+/g, "- ");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Description copied to clipboard!");
  };

  const downloadPDF = (id) => {
    const element = pdfRefs.current[id];
    if (!element) return;

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `AI_Description_${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const downloadHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AI_Description_History.json";
    a.click();
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem("aiHistory");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      minHeight: "100vh",
      background: "linear-gradient(to top right, #0f2027, #203a43, #2c5364)",
      color: "white",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Upload Panel */}
      <div style={{ flex: 1, minWidth: "350px", maxWidth: "700px", marginRight: "2rem" }}>
        <div style={{
          background: "rgba(32, 58, 67, 0.9)",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(64, 224, 208, 0.2)",
        }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h1 style={{
              fontSize: "2rem", fontWeight: "700", color: "#40e0d0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
            }}>
              <FaRobot style={{ color: "#00ced1" }} /> AI Engine Analyzer
            </h1>
            <p style={{ color: "#b0c4de" }}>
              Upload an image of a computer component and let the AI identify it.
            </p>
          </div>

          <label htmlFor="upload" style={{
            cursor: "pointer",
            border: "2px dashed #40e0d0",
            padding: "2rem",
            borderRadius: "10px",
            background: "rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            transition: "all 0.3s",
            display: "block",
          }}>
            <FiUploadCloud style={{ fontSize: "3rem", color: "#40e0d0", marginBottom: "0.5rem" }} />
            <span style={{ color: "#40e0d0", fontSize: "0.85rem" }}>Click to Upload an Image</span>
            <input type="file" id="upload" onChange={handleImageChange} style={{ display: "none" }} />
          </label>

          {image && (
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <img src={URL.createObjectURL(image)} alt="preview" style={{
                width: "200px", borderRadius: "10px", border: "2px solid #40e0d0", marginBottom: "1rem"
              }} />
              <button onClick={handleUpload} style={{
                background: "#40e0d0", padding: "0.75rem 2rem", borderRadius: "25px",
                color: "white", fontWeight: "600", border: "none", transition: "background 0.3s",
              }}>
                {loading ? "Analyzing..." : "Analyze Image"}
              </button>
            </div>
          )}

          {loading && <div style={{ marginTop: "1rem", color: "#40e0d0" }}>
            ⚙️ Thinking hard... The AI is inspecting your component...
          </div>}

          {description && !loading && (
            <div style={{
              marginTop: "2rem", background: "rgba(32, 58, 67, 0.8)", padding: "1.5rem",
              borderRadius: "10px", border: "1px solid #40e0d0",
            }}>
              <h2 style={{
                fontSize: "1.5rem", fontWeight: "700", color: "#40e0d0",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <FaCheckCircle /> AI Description
              </h2>
              <ReactMarkdown>{beautifyDescription(description)}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* History Panel */}
      <div style={{
        flex: 1,
        minWidth: "300px",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.3)",
        borderRadius: "15px",
        border: "1px solid #40e0d0",
        overflowY: "auto",
        maxHeight: "90vh",
        marginTop: "1rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.25rem", color: "#40e0d0" }}>History</h3>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={downloadHistory} title="Download" style={{ background: "none", color: "#40e0d0", border: "none" }}>
              <FaDownload />
            </button>
            <button onClick={clearHistory} title="Clear All" style={{ background: "none", color: "#f87171", border: "none" }}>
              <FaTrash />
            </button>
          </div>
        </div>

        <hr style={{ borderColor: "#40e0d0", margin: "1rem 0" }} />

        {history.length === 0 && (
          <p style={{ color: "#b0c4de", fontStyle: "italic" }}>No uploads yet...</p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            ref={(el) => (pdfRefs.current[item.id] = el)}
            style={{
              background: "rgba(32, 58, 67, 0.8)",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #40e0d0",
              marginBottom: "1rem",
            }}
          >
            <strong style={{ color: "#00ced1" }}>{item.fileName}</strong>
            <img src={item.image} alt={item.fileName} style={{
              width: "100%", maxWidth: "300px", marginTop: "0.5rem",
              borderRadius: "6px", border: "1px solid #40e0d0"
            }} />
            <ReactMarkdown>{beautifyDescription(item.description)}</ReactMarkdown>

            

            {item.tags && item.tags.length > 0 && (
              <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {item.tags.map((tag, index) => (
                  <span key={index} style={{
                    background: "#334155",
                    color: "#40e0d0",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "15px",
                    fontSize: "0.75rem",
                    border: "1px solid #40e0d0"
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={() => copyToClipboard(item.description)}
                style={{
                  padding: "0.4rem 1rem", fontSize: "0.8rem",
                  background: "#40e0d0", color: "white", border: "none",
                  borderRadius: "20px", cursor: "pointer",
                }}
              >
                <FaCopy style={{ marginRight: "0.3rem" }} /> Copy
              </button>
              <button
                onClick={() => downloadPDF(item.id)}
                style={{
                  padding: "0.4rem 1rem", fontSize: "0.8rem",
                  background: "#4ade80", color: "white", border: "none",
                  borderRadius: "20px", cursor: "pointer",
                }}
              >
                <FaDownload style={{ marginRight: "0.3rem" }} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
