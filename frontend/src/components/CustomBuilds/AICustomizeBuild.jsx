import React, { useState } from "react";
import axios from "axios";

const AICustomizeBuild = () => {
  const [prompt, setPrompt] = useState("");
  const [components, setComponents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/generate-components", { prompt });
      setComponents(response.data.components);
    } catch (err) {
      setError("Failed to fetch recommendations. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>AI-Powered Custom PC Builds</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Describe your PC needs:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Budget gaming PC"
          />
        </label>
        <button type="submit">Get Recommendations</button>
      </form>

      {loading && <p>Loading recommendations...</p>}
      {error && <p className="error">{error}</p>}

      {components && (
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Recommended Model</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(components).map(([key, value]) => (
              <tr key={key}>
                <td>{key.toUpperCase()}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AICustomizeBuild;
