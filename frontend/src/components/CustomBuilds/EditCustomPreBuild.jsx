import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // for navigation after update

const EditCustomPreBuild = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Gaming",
    price: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    description: "",
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prebuilds/${id}`);
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching build:", error);
        setError("Failed to fetch the build data.");
        setLoading(false);
      }
    };
    fetchBuild();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (formData.price <= 0) {
      setError("Price must be a positive number!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/prebuilds/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pre-Build updated!");
        navigate("/budget-builds");
      } else {
        alert("Failed to update Pre-Build.");
      }
    } catch (error) {
      console.error("Error updating pre-build:", error);
      setError("Failed to update Pre-Build. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/prebuilds/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Pre-Build deleted!");
        navigate("/budget-builds");
      } else {
        alert("Failed to delete Pre-Build.");
      }
    } catch (error) {
      console.error("Error deleting pre-build:", error);
      setError("Failed to delete Pre-Build. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Edit Pre-Build</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form>
          <input
            type="text"
            name="name"
            placeholder="Build Name"
            value={formData.name}
            onChange={handleChange}
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Gaming">Gaming</option>
            <option value="Budget">Budget</option>
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cpu"
            placeholder="CPU"
            value={formData.cpu}
            onChange={handleChange}
          />
          <input
            type="text"
            name="gpu"
            placeholder="GPU"
            value={formData.gpu}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ram"
            placeholder="RAM"
            value={formData.ram}
            onChange={handleChange}
          />
          <input
            type="text"
            name="storage"
            placeholder="Storage"
            value={formData.storage}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <button type="button" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button type="button" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default EditCustomPreBuild;
