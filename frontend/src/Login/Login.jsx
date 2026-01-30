import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn, Eye, EyeOff, UtensilsCrossed, AlertCircle } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        axios.get(`${apiUrl}/user`, { withCredentials: true })
            .then(res => {
                window.location.href = "/User";
            }).catch(err => console.log(err))
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/login`, {
                email: formData.email,
                password: formData.password,
            }, {
                withCredentials: true,
            });

            navigate("/user");
        } catch (error) {
            console.error("Error logging in:", error);
            setErrors({ 
                submit: error.response?.data?.message || "Login failed. Please check your credentials." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dot-pattern font-display py-12 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white neo-border rounded-3xl shadow-neo-lg p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center size-20 bg-primary neo-border rounded-2xl mb-6 shadow-neo pulse-scale">
                            <LogIn className="w-10 h-10 text-white stroke-[3]" />
                        </div>
                        <h2 className="text-4xl font-black text-indigo-custom mb-3 uppercase tracking-tight">
                            Welcome Back Owner
                        </h2>
                        <p className="text-indigo-custom/70 font-bold text-lg">Login to your account</p>
                        
                        {/* Decorative element */}
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                            <UtensilsCrossed className="w-5 h-5 text-primary" />
                            <div className="h-1 w-12 bg-primary rounded-full"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-black text-indigo-custom mb-3 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 size-10 bg-yellow-custom/20 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-indigo-custom stroke-[2.5]" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-20 pr-4 py-4 neo-border rounded-xl font-bold text-indigo-custom placeholder:text-indigo-custom/40 focus:shadow-neo-lg transition-all outline-none ${
                                        errors.email ? 'border-primary bg-primary/5' : 'bg-white'
                                    }`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center gap-2 mt-2 text-primary text-sm font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-black text-indigo-custom mb-3 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 size-10 bg-yellow-custom/20 rounded-lg flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-indigo-custom stroke-[2.5]" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-20 pr-16 py-4 neo-border rounded-xl font-bold text-indigo-custom placeholder:text-indigo-custom/40 focus:shadow-neo-lg transition-all outline-none ${
                                        errors.password ? 'border-primary bg-primary/5' : 'bg-white'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 size-10 bg-white neo-border rounded-lg flex items-center justify-center hover:bg-yellow-custom transition-all shadow-neo"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-indigo-custom stroke-[2.5]" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-indigo-custom stroke-[2.5]" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="flex items-center gap-2 mt-2 text-primary text-sm font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-indigo-custom hover:text-primary font-black uppercase tracking-wide transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="bg-primary/10 neo-border border-primary rounded-xl px-5 py-4 flex items-start gap-3 shadow-neo">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5 stroke-[2.5]" />
                                <span className="text-primary font-bold text-sm">{errors.submit}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-lifted w-full bg-primary neo-border text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider hover:bg-indigo-custom transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-neo hover:shadow-neo-lg"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-3">
                                    <div className="size-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Logging in...
                                </span>
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="w-6 h-6 stroke-[3]" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center flex justify-center items-center">
                        <div className="flex justify-center items-center gap-2 px-5 py-3 bg-yellow-custom/20 neo-border rounded-full h-full">
                            <p className="text-indigo-custom text-sm font-bold mb-0">
                                Don't have an account?
                            </p>
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-primary font-black hover:underline transition-all text-sm uppercase tracking-wide"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <div className="inline-block px-6 py-3 bg-white neo-border rounded-full shadow-neo">
                        <p className="text-indigo-custom/60 text-xs font-bold uppercase tracking-wide mb-0">
                            Secure Login • Privacy Protected
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .neo-border {
                    border: 3px solid #312e81;
                }
                .dot-pattern {
                    background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .btn-lifted {
                    transition: all 0.2s ease;
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .btn-lifted:hover {
                    transform: translate(2px, 2px);
                    box-shadow: 0px 0px 0px 0px #312e81;
                }
                .btn-lifted:active {
                    transform: translate(3px, 3px);
                    box-shadow: 0px 0px 0px 0px #312e81;
                }
                .shadow-neo {
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .shadow-neo-lg {
                    box-shadow: 8px 8px 0px 0px #312e81;
                }
                .bg-primary {
                    background-color: #f87116;
                }
                .text-primary {
                    color: #f87116;
                }
                .border-primary {
                    border-color: #f87116;
                }
                .bg-indigo-custom {
                    background-color: #312e81;
                }
                .text-indigo-custom {
                    color: #312e81;
                }
                .bg-yellow-custom {
                    background-color: #facc15;
                }
                .bg-background-light {
                    background-color: #fffdf5;
                }
                .border-3 {
                    border-width: 3px;
                }
                .font-display {
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                /* Animations */
                @keyframes pulse-scale {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }
                
                .pulse-scale {
                    animation: pulse-scale 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Login;