import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building2, MapPin, ArrowRight, CheckCircle2, UtensilsCrossed } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    messName: "",
    messAddress: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}/user`, { withCredentials: true })
            .then(res => {
              window.location.href = "/User";
            })
  }, [])

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.messName.trim()) newErrors.messName = "Mess name is required";
    if (!formData.messAddress.trim()) newErrors.messAddress = "Mess address is required";

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
      const res = await axios.post(`${apiUrl}/signup`, formData, { withCredentials: true });
      navigate("/Login");
    } catch (error) {
      console.error("Error signing up:", error);
      setErrors({ submit: error.response?.data?.message || "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light font-display text-indigo-custom dot-pattern py-12 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white neo-border rounded-2xl shadow-neo-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary neo-border rounded-2xl mb-4 shadow-neo">
              <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black text-indigo-custom uppercase tracking-tight">Create Account</h2>
            <p className="text-indigo-custom/70 font-bold mt-2">Join us and manage your mess</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-black text-indigo-custom mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-custom/60" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-3 ${errors.fullName ? 'border-red-500' : 'border-indigo-custom'} bg-white rounded-lg focus:ring-0 focus:border-primary transition-all outline-none font-medium`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm font-bold mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-black text-indigo-custom mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-custom/60" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-3 ${errors.email ? 'border-red-500' : 'border-indigo-custom'} bg-white rounded-lg focus:ring-0 focus:border-primary transition-all outline-none font-medium`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm font-bold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-black text-indigo-custom mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-custom/60" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-3 ${errors.password ? 'border-red-500' : 'border-indigo-custom'} bg-white rounded-lg focus:ring-0 focus:border-primary transition-all outline-none font-medium`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm font-bold mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="messName" className="block text-sm font-black text-indigo-custom mb-2 uppercase tracking-wide">
                Mess Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-custom/60" />
                <input
                  type="text"
                  id="messName"
                  name="messName"
                  value={formData.messName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-3 ${errors.messName ? 'border-red-500' : 'border-indigo-custom'} bg-white rounded-lg focus:ring-0 focus:border-primary transition-all outline-none font-medium`}
                  placeholder="Sunshine Mess"
                />
              </div>
              {errors.messName && <p className="text-red-500 text-sm font-bold mt-1">{errors.messName}</p>}
            </div>

            <div>
              <label htmlFor="messAddress" className="block text-sm font-black text-indigo-custom mb-2 uppercase tracking-wide">
                Mess Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-custom/60" />
                <input
                  type="text"
                  id="messAddress"
                  name="messAddress"
                  value={formData.messAddress}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-3 ${errors.messAddress ? 'border-red-500' : 'border-indigo-custom'} bg-white rounded-lg focus:ring-0 focus:border-primary transition-all outline-none font-medium`}
                  placeholder="123 Main Street, City"
                />
              </div>
              {errors.messAddress && <p className="text-red-500 text-sm font-bold mt-1">{errors.messAddress}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 neo-border border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-lifted bg-primary neo-border text-white py-4 rounded-xl font-black hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-lg"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-indigo-custom/70 text-sm font-medium">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/Login")}
                className="text-primary font-black hover:underline transition-all uppercase tracking-wide"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .neo-border {
          border: 3px solid #312e81;
        }
        .border-3 {
          border-width: 3px;
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
        .bg-primary {
          background-color: #f87116;
        }
        .text-primary {
          color: #f87116;
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
        .text-yellow-custom {
          color: #facc15;
        }
        .bg-background-light {
          background-color: #fffdf5;
        }
        .shadow-neo {
          box-shadow: 4px 4px 0px 0px #312e81;
        }
        .shadow-neo-lg {
          box-shadow: 8px 8px 0px 0px #312e81;
        }
        .font-display {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default Signup;