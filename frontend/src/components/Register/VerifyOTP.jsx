import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function VerifyOTP() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to the next box if a digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const enteredOTP = otp.join(""); // Combine OTP digits into a single string

        if (enteredOTP.length !== 6) {
            toast.error("Please enter a 6-digit OTP.", { position: "top-right" });
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                email: localStorage.getItem("email"),
                otp: enteredOTP
            });

            toast.success("OTP Verified Successfully!", { position: "top-right" });
            navigate("/Login");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.", {
                position: "top-right",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-xl shadow-xl w-[450px]">
                <h2 className="text-3xl font-bold text-center text-gray-700">Verify OTP</h2>
                <p className="text-gray-500 text-center mt-2">Enter the 6-digit code sent to your email</p>

                <form onSubmit={handleVerifyOTP} className="mt-6 space-y-6">
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-2xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 focus:scale-110"
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                    >
                        Verify OTP
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        Didn't receive the code? <span className="text-blue-500 cursor-pointer hover:underline">Resend</span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTP;
