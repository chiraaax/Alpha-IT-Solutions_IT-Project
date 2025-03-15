import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext"; 
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = await login(email, password);
        setLoading(false);
    
        if (user) {
            user.role === "admin" ? navigate("/AdminDashboard") : navigate("/UserHome");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="flex bg-gray-800 shadow-xl rounded-lg w-3/5 overflow-hidden border border-gray-700">
                
                <div className="w-1/2 p-8">
                    <h2 className="text-3xl font-semibold mb-6 text-blue-400">Welcome Back !</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">USERNAME</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="Enter your username"
                                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">PASSWORD</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={`w-full text-white py-2 rounded-lg transition duration-300 font-semibold ${
                                loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <p className="text-gray-400 text-center mt-4">
                        <Link to="/ForgotPassword" className="hover:underline">Forgot Password?</Link>
                    </p>
                </div>
                
                <div className="w-1/2 bg-gradient-to-r from-blue-700 to-blue-900 text-white flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-3xl font-semibold">Welcome to Alpha IT Solutions</h2>
                    <p className="text-sm mt-2 text-gray-300">Your gateway to the latest in computer hardware & accessories.</p>
                    <p className="mt-4 text-gray-300">Don't have an account?</p>
                    <Link to="/Register" className="mt-2 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;