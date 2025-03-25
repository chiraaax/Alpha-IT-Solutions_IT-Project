import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../styles/Appointmentai.css"; // Import the CSS file

const AIChat = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [step, setStep] = useState(1); // Track the current step in the decision tree
  const [problemCategory, setProblemCategory] = useState(""); // Problem category (hardware/software/virus)
  const [specificIssue, setSpecificIssue] = useState(""); // Specific issue (e.g., slow performance)
  const [errorMessage, setErrorMessage] = useState(""); // Error message (if any)
  const [response, setResponse] = useState(""); // AI's response
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Construct the prompt based on user inputs
      const prompt = `My computer has a ${problemCategory} problem. The specific issue is ${specificIssue}. ${
        errorMessage ? `I also see this error message: ${errorMessage}.` : ""
      } Can you help me fix it?`;

      // Send the prompt to the backend API
      const res = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response); // Set the AI's response
      } else {
        setError(data.error || "Failed to generate response.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle the next step in the decision tree
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Function to handle the previous step in the decision tree
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Function to format the AI's response
  const formatResponse = (text) => {
    // Split the response into lines
    const lines = text.split("\n");

    // Map each line to a paragraph, list item, or subheading
    return lines.map((line, index) => {
      if (line.startsWith("- ")) {
        // Handle list items
        return <li key={index}>{line.substring(2)}</li>;
      } else if (line.startsWith("**") && line.endsWith("**")) {
        // Handle subheadings (remove the ** and render as <h3>)
        const cleanedLine = line.substring(2, line.length - 2); // Remove the **
        return <h3 key={index}>{cleanedLine}</h3>;
      } else {
        // Handle regular paragraphs (remove any remaining **)
        const cleanedLine = line.replace(/\*\*/g, ""); // Remove all instances of **
        return <p key={index}>{cleanedLine}</p>;
      }
    });
  };

  return (
    <div className="ai-chat-container">
      <h1 className="ai-chat-heading">Computer Repair Assistant</h1>

      {step === 1 && (
        <div className="ai-chat-step">
          <h2>What type of problem are you facing?</h2>
          <div className="button-group">
            <button className="btn-primary" onClick={() => { setProblemCategory("hardware"); handleNextStep(); }}>
              Hardware Issue
            </button>
            <button className="btn-primary" onClick={() => { setProblemCategory("software"); handleNextStep(); }}>
              Software Issue
            </button>
            <button className="btn-primary" onClick={() => { setProblemCategory("virus/malware"); handleNextStep(); }}>
              Virus/Malware Issue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ai-chat-step">
          <h2>What is the specific issue?</h2>
          <textarea
            value={specificIssue}
            onChange={(e) => setSpecificIssue(e.target.value)}
            placeholder={
              problemCategory === "hardware"
                ? "Describe the hardware issue (e.g., no display, overheating, etc.)"
                : problemCategory === "software"
                ? "Describe the software issue (e.g., slow performance, app crashes, etc.)"
                : "Describe the virus/malware issue (e.g., pop-ups, system slowdown, etc.)"
            }
            rows={4}
          />
          <div className="button-group">
            <button className="btn-secondary" onClick={handlePreviousStep}>
              Back
            </button>
            <button className="btn-primary" onClick={handleNextStep}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="ai-chat-step">
          <h2>Do you see any error messages?</h2>
          <textarea
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="Enter the error message (if any)"
            rows={4}
          />
          <div className="button-group">
            <button className="btn-secondary" onClick={handlePreviousStep}>
              Back
            </button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Generating..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="ai-chat-error">{error}</p>}

      {response && (
        <div className="ai-chat-response">
          <h2 className="ai-chat-response-heading">AI Response:</h2>
          <div className="ai-chat-response-text">
            {formatResponse(response)}
          </div>
          {/* Add the "Book Appointment" button */}
          <button className="btn-appointment" onClick={() => navigate("/appointment-form")}>
            If you are not satisfied with the answers, book an appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AIChat;