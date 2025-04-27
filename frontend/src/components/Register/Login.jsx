import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import loginImage from "../../assets/login-5.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: ""
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            email: "",
            password: "",
            general: ""
        };

        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        } 

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the form errors before submitting", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        setLoading(true);
        setErrors({ ...errors, general: "" });

        try {
            const user = await login(email, password);
            
            if (user) {
                toast.success("Login successful! Redirecting...", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            // Handle specific error cases based on backend responses
            if (error.response) {
                const { data } = error.response;
                if (data.message === 'Invalid credentials') {
                    toast.error("Invalid email or password", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (data.message === 'Account not verified. Please verify your email first.') {
                    toast.warn("Your account is not verified. Please check your email for verification link.", {
                        position: "top-right",
                        autoClose: 8000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error("Error logging in. Please try again.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else {
                toast.error("Network error. Please check your connection.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen text-white relative"
            style={{
                backgroundImage:`url(${loginImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="flex bg-gray-900 shadow-xl rounded-lg w-3/5 overflow-hidden border border-gray-900">
                <div className="w-1/2 p-8">
                    <h2 className="text-4xl font-semibold mb-6 text-gray-200">
                        <span className="bg-gradient-to-r from-red-900 to-blue-500 bg-clip-text text-transparent">
                            W
                        </span>
                        elcome<span>&nbsp;</span>
                        <span className="bg-gradient-to-r from-red-900 to-blue-500 bg-clip-text text-transparent">
                            B
                        </span>
                        ack!
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-3">EMAIL</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({ ...errors, email: "" });
                                }} 
                                required 
                                placeholder="Enter your email"
                                className={`w-full px-3 py-2 border ${
                                    errors.email ? "border-red-500" : "border-gray-600"
                                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email ? "focus:ring-red-500" : "focus:ring-gray-400"
                                } text-white`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-3">PASSWORD</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors({ ...errors, password: "" });
                                }} 
                                required 
                                placeholder="Enter your password"
                                className={`w-full px-3 py-2 border ${
                                    errors.password ? "border-red-500" : "border-gray-600"
                                } bg-gray-700 rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.password ? "focus:ring-red-500" : "focus:ring-gray-400"
                                } text-white`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className={`w-full text-white py-2 rounded-lg transition duration-300 font-semibold ${
                                loading 
                                ? "bg-gray-500 cursor-not-allowed" 
                                : "bg-gradient-to-r from-blue-900 to-red-900 hover:bg-gray-900 mt-9 cursor-pointer"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <p className="text-gray-400 text-center mt-4">
                        <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
                    </p>
                </div>
                
                <div className="w-1/2 bg-gradient-to-r from-blue-900 to-red-900 text-white flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-3xl font-semibold text-gray-300">Welcome to Alpha IT Solutions</h2>
                    <p className="text-sm mt-2 text-gray-300">Your gateway to the latest in computer hardware & accessories.</p>
                    <p className="mt-4 text-gray-300">Don't have an account?</p>
                    <Link to="/Register" className="mt-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;