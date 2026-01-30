import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import {
    Home, LogIn, UserPlus, LogOut, User, Menu, X,
    UtensilsCrossed, Crown, Sparkles, Star, AlertCircle
} from 'lucide-react';

// --- Reusable Nav Item Component for consistency ---
const NavItem = ({ to, icon: Icon, label, onClick, isPremium, className }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold uppercase text-xs tracking-wide transition-all duration-200 neo-border whitespace-nowrap
       ${className || ''}
       ${isActive
                ? (isPremium
                    ? 'bg-yellow-custom text-indigo-custom shadow-neo'
                    : 'bg-primary text-white shadow-neo')
                : 'bg-white text-indigo-custom hover:bg-yellow-custom/30 shadow-neo-sm hover:shadow-neo'
            }`
        }
        style={{ textDecoration: 'none' }}
    >
        <Icon size={16} className="relative z-10 stroke-[2.5]" />
        <span className="relative z-10">{label}</span>
    </NavLink>
);

function Header() {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [subs, setSubs] = useState(false);

    // Timer State
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const today = new Date();
    const dayName = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][today.getDay()];

    const toggleMenu = () => setIsOpen(!isOpen);

    // Fetch User Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${apiUrl}/user`, { withCredentials: true });
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

    // Timer Logic
    useEffect(() => {
        let intervalId = null;
        axios.get(`${apiUrl}/user`, { withCredentials: true })
            .then(res => {
                if (res.data.date_of_expire == null) return;
                const target = new Date(res.data.date_of_expire);

                const updateOnce = () => {
                    const now = new Date();
                    const diffMs = target - now;

                    if (diffMs <= 0) {
                        setDays(0); setHours(0); setMinutes(0); setSeconds(0);
                        if (intervalId) clearInterval(intervalId);
                        return;
                    }

                    const totalSec = Math.floor(diffMs / 1000);
                    setDays(Math.floor(totalSec / (60 * 60 * 24)));
                    setHours(Math.floor((totalSec % (60 * 60 * 24)) / (60 * 60)));
                    setMinutes(Math.floor((totalSec % (60 * 60)) / 60));
                    setSeconds(totalSec % 60);
                };

                updateOnce();
                intervalId = setInterval(updateOnce, 1000);
            })
            .catch(err => console.error("Failed to fetch subscription date:", err));

        return () => { if (intervalId) clearInterval(intervalId); };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });
            setUser(null);
            navigate("/login");
            setIsOpen(false);
            sessionStorage.removeItem("hasReloaded");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleSubscribe = () => {
        navigate("/subscription");
        setIsOpen(false);
    };

    return (
        <div className='flex flex-col relative z-50 font-display'>
            <nav className={`
                w-full transition-all duration-300
                ${subs
                    ? 'bg-background-light border-b-4 border-yellow-custom dot-pattern'
                    : 'bg-background-light border-b-4 border-indigo-custom dot-pattern'
                } sticky top-0
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-18">

                        {/* --- Logo --- */}
                        <NavLink to="/" className="flex items-center gap-2 sm:gap-3 group" style={{ textDecoration: 'none' }}>
                            <div className={`
                                p-2 sm:p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110 neo-border shadow-neo
                                ${subs ? 'bg-yellow-custom' : 'bg-primary'}
                            `}>
                                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-indigo-custom">
                                    KarveMess
                                </h1>
                                {subs && <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-custom pulse-scale hidden xs:block stroke-[2.5]" />}
                            </div>
                        </NavLink>

                        {/* --- Desktop Navigation (Hidden on Mobile/Tablet) --- */}
                        <div className="hidden xl:flex items-center gap-2">
                            {!loading && (
                                <>
                                    {!user ? (
                                        <>
                                            <NavItem to="/" icon={Home} label="Home" />
                                            <NavItem to="/Menu" icon={UtensilsCrossed} label="Menu" />
                                            <div className="h-6 w-0.5 bg-indigo-custom/20 mx-1"></div>
                                            <NavItem to="/Login" icon={LogIn} label="Login" />
                                            <NavItem to="/Signup" icon={UserPlus} label="Sign Up" />
                                        </>
                                    ) : (
                                        <>
                                            <NavItem to="/Menu" icon={UtensilsCrossed} label="Menu" />
                                            <NavItem to={`/foodform?day=${dayName}`} icon={UtensilsCrossed} label="Add Menu" />

                                            {/* Subscription Button (Desktop) */}
                                            {(!subs || minutes <= 0) && (
                                                <button
                                                    onClick={handleSubscribe}
                                                    className="btn-lifted flex items-center gap-2 px-4 py-2.5 ml-1 rounded-lg bg-yellow-custom neo-border text-indigo-custom font-bold uppercase text-xs shadow-neo hover:bg-primary hover:text-white transition-all duration-200 whitespace-nowrap"
                                                >
                                                    <Crown size={16} className="stroke-[2.5]" />
                                                    <span>Premium</span>
                                                </button>
                                            )}

                                            {/* User Profile (Desktop) */}
                                            <div className="ml-2 pl-2 border-l-2 border-indigo-custom/20 flex items-center gap-2">
                                                <NavLink
                                                    to='/user'
                                                    className={`btn-lifted flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full transition-all duration-200 neo-border bg-white shadow-neo hover:shadow-neo-lg
                                                        ${subs ? 'border-yellow-custom' : 'border-indigo-custom'}
                                                    `}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center neo-border shadow-neo-sm shrink-0
                                                        ${subs ? 'bg-yellow-custom' : 'bg-primary'}
                                                    `}>
                                                        {subs ? <Crown size={14} className="text-white stroke-[2.5]" /> : <User size={14} className="text-white stroke-[2.5]" />}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-black text-indigo-custom leading-tight flex items-center gap-1 truncate max-w-[120px]">
                                                            <span className="truncate">{user.fullName}</span>
                                                            {subs && <Star size={10} className="text-yellow-custom fill-yellow-custom shrink-0" />}
                                                        </span>
                                                        <span className="text-[10px] text-indigo-custom/60 font-bold leading-tight uppercase">
                                                            {subs ? 'Premium' : 'Standard'}
                                                        </span>
                                                    </div>
                                                </NavLink>

                                                <button
                                                    onClick={handleLogout}
                                                    className="btn-lifted p-2 rounded-lg neo-border bg-white text-indigo-custom hover:bg-primary hover:text-white transition-all shadow-neo"
                                                    title="Logout"
                                                >
                                                    <LogOut size={16} className="stroke-[2.5]" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* --- Mobile Menu Button --- */}
                        <div className="xl:hidden">
                            <button
                                onClick={toggleMenu}
                                className="btn-lifted p-2.5 neo-border bg-white text-indigo-custom hover:bg-primary hover:text-white rounded-lg transition-all shadow-neo"
                            >
                                {isOpen ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Mobile Navigation Drawer --- */}
                <div className={`
                    xl:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
                    bg-background-light border-t-4 border-indigo-custom/20
                `}>
                    <div className="px-4 py-6 space-y-3">
                        {!loading && (
                            <>
                                {!user ? (
                                    <>
                                        <NavItem to="/" icon={Home} label="Home" onClick={() => setIsOpen(false)} className="w-full justify-center" />
                                        <NavItem to="/Menu" icon={UtensilsCrossed} label="Menu" onClick={() => setIsOpen(false)} className="w-full justify-center" />
                                        <div className="my-4 border-t-3 border-indigo-custom/20"></div>
                                        <NavItem to="/Login" icon={LogIn} label="Login" onClick={() => setIsOpen(false)} className="w-full justify-center" />
                                        <NavItem to="/Signup" icon={UserPlus} label="Sign Up" onClick={() => setIsOpen(false)} className="w-full justify-center" />
                                    </>
                                ) : (
                                    <>
                                        {/* Mobile User Profile Summary */}
                                        <div
                                            onClick={() => { navigate('/user'); setIsOpen(false); }}
                                            className="btn-lifted flex items-center gap-3 p-4 mb-4 rounded-xl bg-white neo-border shadow-neo cursor-pointer hover:shadow-neo-lg"
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 neo-border shadow-neo
                                                ${subs ? 'bg-yellow-custom' : 'bg-primary'}
                                            `}>
                                                {subs ? <Crown size={20} className="text-white stroke-[2.5]" /> : <User size={20} className="text-white stroke-[2.5]" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-indigo-custom font-black flex items-center gap-2">
                                                    <span className="truncate">{user.fullName}</span>
                                                    {subs && <Star size={14} className="text-yellow-custom fill-yellow-custom" />}
                                                </div>
                                                <div className="text-sm text-indigo-custom/60 font-bold truncate uppercase">{subs ? 'Premium' : 'Standard'}</div>
                                            </div>
                                        </div>

                                        <NavItem to="/Menu" icon={UtensilsCrossed} label="Menu" onClick={() => setIsOpen(false)} className="w-full justify-center" />
                                        <NavItem to={`/foodform?day=${dayName}`} icon={UtensilsCrossed} label="Add Menu" onClick={() => setIsOpen(false)} className="w-full justify-center" />

                                        <div className="my-4 border-t-3 border-indigo-custom/20"></div>

                                        {(!subs || minutes <= 0) && (
                                            <button
                                                onClick={handleSubscribe}
                                                className="btn-lifted w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-yellow-custom neo-border text-indigo-custom font-black uppercase shadow-neo hover:bg-primary hover:text-white transition-all"
                                            >
                                                <Sparkles size={20} className="stroke-[2.5]" />
                                                <span>Upgrade to Premium</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="btn-lifted w-full flex items-center justify-center gap-2 px-6 py-4 mt-3 rounded-xl neo-border bg-white text-primary hover:bg-primary hover:text-white font-black uppercase transition-all shadow-neo"
                                        >
                                            <LogOut size={20} className="stroke-[2.5]" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Expiring Soon Banner --- */}
            {subs && minutes <= 0 && (
                <div className='w-full bg-primary neo-border-bottom shadow-neo-lg'>
                    <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
                        <div className='flex items-center justify-center gap-2 sm:gap-3'>
                            <div className="size-8 sm:size-10 bg-yellow-custom neo-border rounded-full flex items-center justify-center shadow-neo wiggle shrink-0">
                                <AlertCircle className='w-4 h-4 sm:w-5 sm:h-5 text-indigo-custom stroke-[2.5]' />
                            </div>
                            <span className='font-black text-sm sm:text-base text-white uppercase tracking-wide text-center'>
                                Plan expiring soon. Renew now!
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .neo-border {
                    border: 3px solid #312e81;
                }
                .neo-border-bottom {
                    border-bottom: 4px solid #312e81;
                }
                .border-t-3 {
                    border-top-width: 3px;
                }
                .dot-pattern {
                    background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .btn-lifted {
                    transition: all 0.2s ease;
                }
                .btn-lifted:active {
                    transform: translate(2px, 2px);
                }
                .shadow-neo-sm {
                    box-shadow: 2px 2px 0px 0px #312e81;
                }
                .shadow-neo {
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .shadow-neo-lg {
                    box-shadow: 6px 6px 0px 0px #312e81;
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
                
                @keyframes wiggle {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-5deg);
                    }
                    75% {
                        transform: rotate(5deg);
                    }
                }
                
                .pulse-scale {
                    animation: pulse-scale 2s ease-in-out infinite;
                }
                
                .wiggle {
                    animation: wiggle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Header;