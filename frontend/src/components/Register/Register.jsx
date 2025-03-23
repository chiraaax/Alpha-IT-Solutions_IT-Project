import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import { toast } from "react-toastify";
import loginImage from "../../assets/login-5.jpg";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate(); 

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');
    const [addressError, setAddressError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password, contactNumber, address });

        setNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setContactNumberError('');
        setAddressError('');

        let isValid = true; 

        if (!name) {
            setNameError("Name is required");
            isValid = false;
        }

        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError("Invalid email format");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Confirm password is required");
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            isValid = false;
        }

        if (!contactNumber) {
            setContactNumberError("Contact number is required");
            isValid = false;
        } else if (!/^\d{10}$/.test(contactNumber)) {
            setContactNumberError("Invalid contact number. It should be 10 digits.");
            isValid = false;
        }

        if (!address) {
            setAddressError("Address is required");
            isValid = false;
        }

        if (!isValid) return;  

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, contactNumber, address });
            
            localStorage.setItem('email', email);
        
            toast.success("Check your email for OTP verification!", { position: "top-right" });
            
            navigate('/verify-otp');
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage, { position: "top-right" });
        }
    };

    return (
        <div  className="flex items-center justify-center min-h-screen text-white relative"
                    style={{
                        backgroundImage:`url(${loginImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
        >
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-130 text-gray-300">
                <h2 className="text-4xl font-semibold text-center mb-4  text-gray-200">
                    <span className="bg-gradient-to-r from-red-900 to-blue-500 bg-clip-text text-transparent">
                        R
                    </span>
                    egister
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-3">NAME</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-3 mt-5">EMAIL</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-3  mt-5">PASSWORD</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-3  mt-5">CONFIRM PASSWORD</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-3 mt-5">CONTACT NUMBER</label>
                        <input 
                            type="text" 
                            value={contactNumber} 
                            onChange={(e) => setContactNumber(e.target.value)} 
                            required 
                            placeholder="Enter your contact number"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {contactNumberError && <p className="text-red-500 text-sm mt-1">{contactNumberError}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-3  mt-5">ADDRESS</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                            placeholder="Enter your address"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-900 to-red-900 text-white py-2 rounded-lg  transition duration-300 mt-8 cursor-pointer font-bold"
                    >
                        Create Account
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
