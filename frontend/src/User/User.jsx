import React, { useEffect, useState } from 'react'
import axios from "axios"
import { NavLink, useNavigate } from "react-router-dom"
import { User, Mail, MapPin, Home, ChefHat, Edit3, Package, Crown, Star, Sparkles } from 'lucide-react'

function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subs, setSubs] = useState(false);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        const hasReloaded = sessionStorage.getItem("hasReloaded");
        if (!hasReloaded) {
            sessionStorage.setItem("hasReloaded", "true");
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${apiUrl}/user`, {
                    withCredentials: true
                });
                setUser(res.data);
                setSubs(res.data.subscribed);

            } catch (err) {
                if (err.response?.status === 401) {
                    setUser(null);
                } else {
                    console.error("Unexpected error:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        let intervalId = null;

        axios.get(`${apiUrl}/user`, { withCredentials: true })
            .then(res => {
                if (res.data.date_of_expire == null) return;
                console.log("hi");

                const target = new Date(res.data.date_of_expire);

                const updateOnce = () => {
                    const now = new Date();
                    const diffMs = target - now;

                    if (diffMs <= 0) {
                        setDays(0); setHours(0); setMinutes(0); setSeconds(0);
                        console.log("done in user");

                        clearInterval(intervalId);
                        return;
                    }

                    const totalSec = Math.floor(diffMs / 1000);

                    const d = Math.floor(totalSec / (60 * 60 * 24));
                    const h = Math.floor((totalSec % (60 * 60 * 24)) / (60 * 60));
                    const m = Math.floor((totalSec % (60 * 60)) / 60);
                    const s = totalSec % 60;

                    setDays(d);
                    setHours(h);
                    setMinutes(m);
                    setSeconds(s);
                };

                updateOnce();

                intervalId = setInterval(updateOnce, 1000);
            })
            .catch(err => {
                console.error("Failed to fetch subscription date:", err);
            });

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        axios.get(`${apiUrl}/myItems`, { withCredentials: true })
            .then(res => setFoodItems(res.data))
            .catch(err => {
                if (err.response?.status === 401) {
                    window.location.href = "/Login";
                }
            });
    }, []);




    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dot-pattern flex items-center justify-center">
                <div className={`w-16 h-16 border-4 rounded-full animate-spin ${subs ? 'border-yellow-custom border-t-indigo-custom' : 'border-indigo-custom border-t-primary'}`}></div>
            </div>
        );
    }

    // Premium/Subscribed UI
    if (subs) {
        return (
            <div className="min-h-screen bg-background-light dot-pattern py-8 px-4 font-display">
                <div className="max-w-6xl mx-auto">
                    {/* Premium Header */}
                    <div className="mb-8 relative">
                        <div className="absolute top-0 right-0">
                            <div className="flex items-center bg-yellow-custom neo-border px-4 py-2 rounded-full shadow-neo">
                                <Crown className="w-5 h-5 text-indigo-custom mr-2 stroke-[2.5]" />
                                <span className={`font-black ${minutes <= 0 ? 'text-red-500' : 'text-indigo-custom'}`}>{`${days}d ${hours}h ${minutes}m ${seconds}s`}</span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-indigo-custom mb-2 flex items-center uppercase tracking-tight">
                            Dashboard
                            <Sparkles className="w-10 h-10 text-yellow-custom ml-4 pulse-scale stroke-[2.5]" />
                        </h1>
                        <p className="text-indigo-custom/70 font-bold uppercase tracking-wide">Welcome to your premium experience</p>
                    </div>

                    {/* Premium User Profile Card */}
                    <div className="bg-white neo-border rounded-2xl shadow-neo-lg p-8 mb-8 relative overflow-hidden">
                        <div className="flex items-center mb-6 relative z-10">
                            <div className="w-20 h-20 bg-yellow-custom neo-border rounded-2xl flex items-center justify-center shadow-neo rotate-tilt">
                                <User className="w-10 h-10 text-white stroke-[2.5]" />
                            </div>
                            <div className="ml-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-3xl font-black text-indigo-custom uppercase tracking-tight">{user.fullName}</h2>
                                    <Crown className="w-7 h-7 text-yellow-custom fill-yellow-custom stroke-[2.5]" />
                                </div>
                                <div className="flex items-center mt-1 gap-2">
                                    <p className="text-indigo-custom/70 font-bold uppercase text-sm">Premium Mess Owner</p>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                            <div className="flex items-center p-4 bg-yellow-custom/10 rounded-xl neo-border">
                                <Mail className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                                <div>
                                    <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Email</p>
                                    <p className="text-indigo-custom font-bold">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-yellow-custom/10 rounded-xl neo-border">
                                <Home className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                                <div>
                                    <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Mess Name</p>
                                    <p className="text-indigo-custom font-bold">{user.messName}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-yellow-custom/10 rounded-xl neo-border md:col-span-2">
                                <MapPin className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                                <div>
                                    <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Address</p>
                                    <p className="text-indigo-custom font-bold">{user.messAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Food Items Section */}
                    <div className="bg-white neo-border rounded-2xl shadow-neo-lg p-8">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div className="flex items-center">
                                <Package className="w-7 h-7 text-yellow-custom mr-3 stroke-[2.5]" />
                                <h2 className="text-3xl font-black text-indigo-custom uppercase tracking-tight">Your Premium Menu</h2>
                            </div>
                            <span className="bg-yellow-custom neo-border text-indigo-custom px-6 py-2 rounded-full text-sm font-black shadow-neo uppercase tracking-wide">
                                {foodItems.length} {foodItems.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        {foodItems.length === 0 ? (
                            <div className="text-center py-12">
                                <ChefHat className="w-20 h-20 text-indigo-custom/30 mx-auto mb-4 stroke-[2.5]" />
                                <p className="text-indigo-custom text-lg font-black uppercase">No food items yet</p>
                                <p className="text-indigo-custom/70 text-sm font-medium">Add your first menu item to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {foodItems.map((foodItem) => (
                                    <div
                                        key={foodItem._id}
                                        className="bg-yellow-custom/10 neo-border rounded-xl p-6 hover:shadow-neo-lg transition-all duration-300 card-lifted"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-yellow-custom neo-border rounded-xl flex items-center justify-center shadow-neo">
                                                    <ChefHat className="w-6 h-6 text-white stroke-[2.5]" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-indigo-custom font-black uppercase tracking-wide">{foodItem.day} Menu</p>
                                                </div>
                                            </div>
                                            <NavLink
                                                to={`/editItem/${foodItem._id}`}
                                                className="btn-lifted flex items-center bg-primary hover:bg-yellow-custom hover:text-indigo-custom text-white neo-border px-4 py-2 rounded-lg text-sm font-black transition-all duration-200 shadow-neo uppercase tracking-wide"
                                            >
                                                <Edit3 className="w-4 h-4 mr-2 stroke-[2.5]" />
                                                Edit
                                            </NavLink>
                                        </div>

                                        <div className="space-y-2">
                                            {Object.entries(foodItem.item).map(([name, price]) => (
                                                <div
                                                    key={name}
                                                    className="flex items-center justify-between bg-white neo-border p-3 rounded-lg shadow-neo-sm"
                                                >
                                                    <span className="text-indigo-custom font-bold">{name}</span>
                                                    <span className="text-primary font-black">₹{price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                    .card-lifted {
                        transition: all 0.2s ease;
                    }
                    .card-lifted:hover {
                        transform: translate(-4px, -4px);
                        box-shadow: 12px 12px 0px 0px #312e81;
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
                    .shadow-neo-sm {
                        box-shadow: 2px 2px 0px 0px #312e81;
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
                    
                    @keyframes pulse-scale {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                    }
                    
                    @keyframes rotate-tilt {
                        0%, 100% {
                            transform: rotate(0deg);
                        }
                        50% {
                            transform: rotate(3deg);
                        }
                    }
                    
                    .pulse-scale {
                        animation: pulse-scale 2s ease-in-out infinite;
                    }
                    
                    .rotate-tilt {
                        animation: rotate-tilt 3s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    // Standard/Free UI
    return (
        <div className="min-h-screen bg-background-light dot-pattern py-8 px-4 font-display">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-indigo-custom uppercase tracking-tight">Dashboard</h1>
                    <p className="text-indigo-custom/70 font-bold mt-2">Manage your mess menu</p>
                </div>

                {/* User Profile Card */}
                <div className="bg-white neo-border rounded-2xl shadow-neo-lg p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <div className="w-20 h-20 bg-primary neo-border rounded-2xl flex items-center justify-center shadow-neo rotate-tilt">
                            <User className="w-10 h-10 text-white stroke-[2.5]" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-3xl font-black text-indigo-custom uppercase tracking-tight">{user.fullName}</h2>
                            <p className="text-indigo-custom/70 font-bold uppercase text-sm mt-1">Mess Owner</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-primary/10 rounded-xl neo-border">
                            <Mail className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                            <div>
                                <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Email</p>
                                <p className="text-indigo-custom font-bold">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-primary/10 rounded-xl neo-border">
                            <Home className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                            <div>
                                <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Mess Name</p>
                                <p className="text-indigo-custom font-bold">{user.messName}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-primary/10 rounded-xl neo-border md:col-span-2">
                            <MapPin className="w-6 h-6 text-primary mr-3 stroke-[2.5]" />
                            <div>
                                <p className="text-xs text-indigo-custom/70 font-black uppercase tracking-wide">Address</p>
                                <p className="text-indigo-custom font-bold">{user.messAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Food Items Section */}
                <div className="bg-white neo-border rounded-2xl shadow-neo-lg p-8">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center">
                            <Package className="w-7 h-7 text-primary mr-3 stroke-[2.5]" />
                            <h2 className="text-3xl font-black text-indigo-custom uppercase tracking-tight">Your Food Items</h2>
                        </div>
                        <span className="bg-primary neo-border text-white px-6 py-2 rounded-full text-sm font-black shadow-neo uppercase tracking-wide">
                            {foodItems.length} {foodItems.length === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>

                    {foodItems.length === 0 ? (
                        <div className="text-center py-12">
                            <ChefHat className="w-20 h-20 text-indigo-custom/30 mx-auto mb-4 stroke-[2.5]" />
                            <p className="text-indigo-custom text-lg font-black uppercase">No food items yet</p>
                            <p className="text-indigo-custom/70 text-sm font-medium">Add your first menu item to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {foodItems.map((foodItem) => (
                                <div
                                    key={foodItem._id}
                                    className="bg-primary/10 neo-border rounded-xl p-6 hover:shadow-neo-lg transition-all duration-300 card-lifted"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-primary neo-border rounded-xl flex items-center justify-center shadow-neo">
                                                <ChefHat className="w-6 h-6 text-white stroke-[2.5]" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-indigo-custom font-black uppercase tracking-wide">{foodItem.day} Menu</p>
                                            </div>
                                        </div>
                                        <NavLink
                                            to={`/editItem/${foodItem._id}`}
                                            className="btn-lifted flex items-center bg-primary hover:bg-indigo-custom text-white neo-border px-4 py-2 rounded-lg text-sm font-black transition-all duration-200 shadow-neo uppercase tracking-wide"
                                        >
                                            <Edit3 className="w-4 h-4 mr-2 stroke-[2.5]" />
                                            Edit
                                        </NavLink>
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(foodItem.item).map(([name, price]) => (
                                            <div
                                                key={name}
                                                className="flex items-center justify-between bg-white neo-border p-3 rounded-lg shadow-neo-sm"
                                            >
                                                <span className="text-indigo-custom font-bold">{name}</span>
                                                <span className="text-primary font-black">₹{price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                .card-lifted {
                    transition: all 0.2s ease;
                }
                .card-lifted:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 12px 12px 0px 0px #312e81;
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
                .shadow-neo-sm {
                    box-shadow: 2px 2px 0px 0px #312e81;
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
                
                @keyframes rotate-tilt {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(3deg);
                    }
                }
                
                .rotate-tilt {
                    animation: rotate-tilt 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default UserDashboard