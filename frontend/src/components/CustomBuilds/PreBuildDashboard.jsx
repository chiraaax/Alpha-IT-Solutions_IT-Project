import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PreBuildDashboard = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuilds();
    }, []);

    const fetchBuilds = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/prebuilds");
            setBuilds(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching builds:", error);
            setError("Failed to load builds.");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this build?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/prebuilds/${id}`); // Corrected URL
            setBuilds(builds.filter(build => build._id !== id));
            alert("Build deleted successfully!");
        } catch (error) {
            console.error("Error deleting build:", error);
            alert("Failed to delete build.");
        }
    };

    if (loading) return <p className="text-center text-white">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    if (builds.length === 0) {
        return <p className="text-center text-white">No builds available.</p>;
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h2 className="text-3xl font-bold mb-4">PreBuild Dashboard - All Builds</h2>
            <table className="w-full text-left border border-gray-700">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-2">Image</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">CPU</th>
                        <th className="p-2">GPU</th>
                        <th className="p-2">RAM</th>
                        <th className="p-2">Storage</th>
                        <th className="p-2">Power Supply</th>
                        <th className="p-2">Casing</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {builds.map((build) => (
                        <tr key={build._id} className="border-b border-gray-700">
                            <td className="p-2">
                                <img src={build.image} alt={build.category} className="w-16 h-16 object-cover rounded" />
                            </td>
                            <td className="p-2">{build.category}</td>
                            <td className="p-2">${build.price.toFixed(2)}</td>
                            <td className="p-2">{build.cpu}</td>
                            <td className="p-2">{build.gpu}</td>
                            <td className="p-2">{build.ram}</td>
                            <td className="p-2">{build.storage}</td>
                            <td className="p-2">{build.psu}</td>
                            <td className="p-2">{build.casing}</td>
                            <td className="p-2">{build.description}</td>
                            <td className="p-2">
                                <Link to={`/edit-custom-pre-build/${build._id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(build._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PreBuildDashboard;
