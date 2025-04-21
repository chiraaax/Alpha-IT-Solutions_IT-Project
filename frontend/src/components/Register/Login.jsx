import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import loginImage from "../../assets/login-5.jpg";

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
            // Navigate to home page for both admin and user
            navigate("/");
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
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-3">PASSWORD</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
                            />
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
