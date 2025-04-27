// src/BuildSuggestor.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaCogs } from "react-icons/fa";
import { FiDownload, FiTrash2, FiCopy, FiLoader, FiSun, FiMoon, FiSearch, FiHardDrive } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";
import { useTheme } from "../ThemeContext";
import { HiCpuChip, HiComputerDesktop, HiBolt, HiDevicePhoneMobile } from "react-icons/hi2";
import { BsGpuCard, BsMemory } from "react-icons/bs";
import { LuHardDrive } from "react-icons/lu";
import './BuildSuggestorAI.css';

const STORAGE_KEY = "buildHistory";

const components = [
  { name: 'PROCESSOR', icon: <HiCpuChip /> },
  { name: 'GPU', icon: <BsGpuCard /> },
  { name: 'Motherboard', icon: <HiComputerDesktop /> },
  { name: 'RAM', icon: <BsMemory /> },
  { name: 'Storage', icon: <LuHardDrive /> },
  { name: 'Power Supply', icon: <HiBolt /> },
  { name: 'Case', icon: <HiDevicePhoneMobile /> },
];

const BuildSuggestor = () => {
  const { isDark, toggleTheme } = useTheme();
  const [requirement, setRequirement] = useState("");
  const [buildData, setBuildData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const historyRefs = useRef({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setHistory(stored);
  }, []);

  const addToHistory = (req, build) => {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      requirement: req,
      build,
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleSubmit = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    setError("");
    setBuildData(null);

    try {
      const res = await fetch("http://localhost:5000/api/suggest-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from server");
      }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setBuildData(data);
      addToHistory(requirement, data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "build_history.json";
    a.click();
  };

  const clearHistory = () => {
    if (window.confirm("Clear all build history?")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const downloadPDF = (id) => {
    const el = historyRefs.current[id];
    if (!el) return;
    html2pdf().from(el).set({ margin: 10, filename: `build_${id}.pdf` }).save();
  };

  const copyJSON = (build) => {
    navigator.clipboard.writeText(JSON.stringify(build, null, 2));
    alert("Build JSON copied!");
  };

  const filteredHistory = history.filter((h) =>
    h.requirement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComponentIcon = (componentName) => {
    const found = components.find((comp) => comp.name.toLowerCase() === componentName.toLowerCase());
    return found ? found.icon : <FaRobot />;
  };

  return (
    <div className="cyberpunk-container">
      {/* 🌟 INLINE STYLES (FULL YOUR CSS INSERTED HERE) */}
      <style>
        {`         
          // if you want to add your CSS styles, you can do it here.
        `}
      </style>

      {/* Animated background with tech circuit pattern */}
      <div className="circuit-background">
        <div className="circuit-lines"></div>
      </div>

      {/* Main Panel */}
      <div className="main-panel">
        <header className="neo-header">
          <h1 className="title-glow">
            <FaCogs className="rotating-icon" /> PC Build AI
          </h1>
          <div className="theme-toggle-container">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <FiMoon className="sun-pulse" /> : <FiSun className="moon-glow" />}
            </button>
          </div>
        </header>

        {/* Input Card */}
        <div className="input-card">
          <div className="card-inner">
            <input
              type="text"
              placeholder="Eg:- Suggest me 11th gen pc build for gaming..."
              maxLength={100}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="neo-input"
            />
            <button
              className="cyber-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span className="cyber-button-text">
                {loading ? <FiLoader className="spin" /> : "Suggest Build"}
              </span>
              <span className="button-glow"></span>
            </button>

            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
        </div>

        {/* Build Results */}
        <AnimatePresence>
          {buildData && (
            <motion.div
              key="build"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="build-grid"
            >
              {Object.entries(buildData).map(([component, model], index) => (
                <motion.div
                  key={component}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="component-card"
                >
                  <div className="hexagon">
                    <div className="hexagon-inner">
                      {getComponentIcon(component)}
                    </div>
                  </div>
                  <h2 className="component-title">{component}</h2>
                  <p className="component-model">{model}</p>
                  <div className="card-highlight"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Panel */}
      <div className="history-panel">
        <div className="history-header">
          <h3 className="history-title">Build History</h3>
          <div className="history-actions">
            <FiDownload onClick={downloadHistory} className="history-icon download" />
            <FiTrash2 onClick={clearHistory} className="history-icon delete" />
          </div>
        </div>

        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredHistory.length === 0 && (
          <div className="empty-history">
            <FiHardDrive className="empty-icon" />
            <p>No builds saved</p>
          </div>
        )}

        <AnimatePresence>
          <div className="history-list">
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                ref={(el) => (historyRefs.current[item.id] = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="history-item"
              >
                <div className="item-header">
                  <small className="timestamp">{item.time}</small>
                  <div className="action-buttons">
                    <FiCopy onClick={() => copyJSON(item.build)} className="action-icon" />
                    <FiDownload onClick={() => downloadPDF(item.id)} className="action-icon" />
                  </div>
                </div>
                <p className="requirement">"{item.requirement}"</p>
                <div className="build-specs">
                  {Object.entries(item.build).map(([comp, mod]) => (
                    <p key={comp} className="spec-item">
                      <span className="spec-name">{comp}:</span> 
                      <span className="spec-value">{mod}</span>
                    </p>
                  ))}
                </div>
                <div className="item-glow"></div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  )
};

export default BuildSuggestor;
