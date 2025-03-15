import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1 = Verify Email, 2 = Reset Password
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Verify Email
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-email", { email });
            setMessage(response.data.message);
            setTimeout(() => {
                setStep(2); // Move to Reset Password step
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email, newPassword, confirmPassword });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700">
          {step === 1 ? "Forgot Password?" : "Reset Your Password"}
        </h2>
        <p className="text-center text-gray-500 mt-2">
          {step === 1 ? "No worries! Enter your email to get a reset link." : "Create a new password to secure your account."}
        </p>

        {message && <p className="mt-4 text-green-600 text-center font-semibold">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center font-semibold">{error}</p>}

        {step === 1 ? (
          // Email Verification
          <form onSubmit={handleVerifyEmail} className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {loading ? "Checking..." : "Verify Email"}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Remembered your password?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </span>
            </p>
          </form>
        ) : (
          // Reset Password
          <form onSubmit={handleResetPassword} className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="New Password"
            />

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Changed your mind?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
