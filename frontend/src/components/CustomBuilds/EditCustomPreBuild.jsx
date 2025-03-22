import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated import

const EditCustomPreBuild = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // Use navigate instead of useHistory
    const [preBuild, setPreBuild] = useState({
        image: "",
        category: "Gaming",
        price: "",
        cpu: "",
        gpu: "",
        ram: "",
        storage: "",
        psu: "",
        casing: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    // Fetch data on component mount
    useEffect(() => {
        const fetchPreBuild = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/prebuilds/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch pre-build data");
                }
                const data = await response.json();
                setPreBuild(data);
            } catch (error) {
                console.error("Error fetching pre-build:", error);
                showNotification("Error fetching pre-build data.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchPreBuild();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation check
        if (!preBuild.image || !preBuild.category || !preBuild.price || !preBuild.cpu || !preBuild.gpu || !preBuild.ram || !preBuild.storage || !preBuild.psu || !preBuild.casing || !preBuild.description) {
            showNotification("All fields are required!", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/prebuilds/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preBuild),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Server error!");
            }

            showNotification("Pre-build updated successfully!", "success");
            navigate("/prebuilds"); // Redirect to the pre-build list page after successful update
        } catch (error) {
            console.error("Error:", error);
            showNotification("Error updating pre-build. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreBuild((prevPreBuild) => ({
            ...prevPreBuild,
            [name]: value,
        }));
    };

    // Show notifications
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
            <div className="mb-8 pb-6 border-b border-gray-700">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Edit Custom PC Build
                </h2>
                <p className="text-gray-400 mt-2">Update your pre-build specifications</p>
            </div>

            {/* Notification component */}
            {notification.show && (
                <div className={`mb-6 p-4 rounded-xl flex items-center border ${
                    notification.type === "success" 
                        ? "bg-green-900/20 border-green-500 text-green-400" 
                        : "bg-red-900/20 border-red-500 text-red-400"
                }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        notification.type === "success" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}>
                        {notification.type === "success" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    {notification.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-medium text-blue-400 mb-4">Edit Specifications</h3>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Image URL</label>
                                <input 
                                    type="text" 
                                    name="image"
                                    value={preBuild.image}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="https://example.com/image.jpg" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Category</label>
                                <select 
                                    name="category"
                                    value={preBuild.category}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 appearance-none transition-all"
                                >
                                    <option value="Gaming">Gaming</option>
                                    <option value="Budget">Budget</option>                                    
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Price</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    value={preBuild.price}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="1299.99"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">CPU</label>
                                <input 
                                    type="text" 
                                    name="cpu"
                                    value={preBuild.cpu}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="Intel i9 10900K" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">GPU</label>
                                <input 
                                    type="text" 
                                    name="gpu"
                                    value={preBuild.gpu}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="NVIDIA RTX 3080"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">RAM</label>
                                <input 
                                    type="text" 
                                    name="ram"
                                    value={preBuild.ram}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="32GB Corsair Vengeance"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Storage</label>
                                <input 
                                    type="text" 
                                    name="storage"
                                    value={preBuild.storage}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="1TB SSD"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Power Supply</label>
                                <input 
                                    type="text" 
                                    name="psu"
                                    value={preBuild.psu}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="750W EVGA"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Casing</label>
                                <input 
                                    type="text" 
                                    name="casing"
                                    value={preBuild.casing}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="Corsair 4000D"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Description</label>
                                <textarea 
                                    name="description"
                                    value={preBuild.description}
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all" 
                                    placeholder="Enter build description"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            >
                                {loading ? "Updating..." : "Update Build"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Specifications Display */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
                    <h3 className="text-lg font-medium text-blue-400 mb-4">Current Specifications</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Category</span>
                            <span className="text-sm text-gray-200">{preBuild.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Price</span>
                            <span className="text-sm text-gray-200">{preBuild.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">CPU</span>
                            <span className="text-sm text-gray-200">{preBuild.cpu}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">GPU</span>
                            <span className="text-sm text-gray-200">{preBuild.gpu}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">RAM</span>
                            <span className="text-sm text-gray-200">{preBuild.ram}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Storage</span>
                            <span className="text-sm text-gray-200">{preBuild.storage}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Power Supply</span>
                            <span className="text-sm text-gray-200">{preBuild.psu}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Casing</span>
                            <span className="text-sm text-gray-200">{preBuild.casing}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Description</span>
                            <span className="text-sm text-gray-200">{preBuild.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCustomPreBuild;
