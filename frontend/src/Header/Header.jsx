import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import { 
  Home, LogIn, UserPlus, LogOut, User, Menu, X, 
  Utensils, Crown, Sparkles, Star, AlertCircle 
} from 'lucide-react';

// --- Reusable Nav Item Component for consistency ---
const NavItem = ({ to, icon: Icon, label, onClick, isPremium, className }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 overflow-hidden group
       ${className || ''}
       ${isActive
          ? (isPremium 
              ? 'bg-linear-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
              : 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]')
          : 'text-gray-300 hover:text-white hover:bg-white/10'
       }`
    }
    style={{ textDecoration: 'none' }}
  >
    <Icon size={18} className="relative z-10" />
    <span className="relative z-10">{label}</span>
  </NavLink>
);

function Header() {
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
                const res = await axios.get("https://karve-mess-backend.onrender.com/user", { withCredentials: true });
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
        axios.get("https://karve-mess-backend.onrender.com/subs", { withCredentials: true })
            .then(res => {
                if (res.data.doe == null) return;
                const target = new Date(res.data.doe);

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
            await axios.get("https://karve-mess-backend.onrender.com/logout", { withCredentials: true });
            setUser(null);
            navigate("/login");
            setIsOpen(false);
            
            // Handle reload logic if needed
            const hasReloaded = sessionStorage.getItem("hasReloaded");
            if (hasReloaded) {
                sessionStorage.setItem("hasReloaded", "false");
                window.location.reload();
            }
            sessionStorage.removeItem("hasReloaded");
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    };

    const handleSubscribe = () => {
        navigate("/subscription");
        setIsOpen(false);
    };

    return (
        <div className='flex flex-col relative z-50'>
            <nav className={`
                w-full transition-all duration-300
                ${subs 
                    ? 'bg-slate-900/90 border-b border-yellow-500/20' 
                    : 'bg-slate-900/90 border-b border-white/10'
                } backdrop-blur-md sticky top-0
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        
                        {/* --- Logo --- */}
                        <NavLink to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
                            <div className={`
                                p-2 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg
                                ${subs ? 'bg-linear-to-br from-yellow-400 to-amber-600' : 'bg-linear-to-br from-blue-500 to-purple-600'}
                            `}>
                                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent 
                                    ${subs ? 'bg-linear-to-r from-yellow-400 to-amber-500' : 'bg-linear-to-r from-white to-gray-400'}
                                `}>
                                    KarveMess
                                </h1>
                                {subs && <Crown className="w-4 h-4 text-yellow-400 animate-pulse hidden sm:block" />}
                            </div>
                        </NavLink>

                        {/* --- Desktop Navigation (Hidden on Mobile/Tablet) --- */}
                        <div className="hidden lg:flex items-center gap-2">
                            {!loading && (
                                <>
                                    {!user ? (
                                        <>
                                            <NavItem to="/" icon={Home} label="Home" />
                                            <NavItem to="/Menu" icon={Utensils} label="Menu" />
                                            <div className="h-6 w-px bg-white/10 mx-2"></div>
                                            <NavItem to="/Login" icon={LogIn} label="Login" />
                                            <NavItem to="/Signup" icon={UserPlus} label="Sign Up" />
                                        </>
                                    ) : (
                                        <>
                                            <NavItem to="/Menu" icon={Utensils} label="Menu" />
                                            <NavItem to={`/foodform?day=${dayName}`} icon={Utensils} label="Add Menu" />
                                            
                                            {/* Subscription Button (Desktop) */}
                                            {(!subs || minutes <= 0) && (
                                                <button
                                                    onClick={handleSubscribe}
                                                    className="flex items-center gap-2 px-4 py-2 ml-2 rounded-xl bg-linear-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
                                                >
                                                    <Crown size={16} />
                                                    <span>Go Premium</span>
                                                </button>
                                            )}

                                            {/* User Profile Dropdown/Link (Desktop) */}
                                            <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-4">
                                                <NavLink 
                                                    to='/user' 
                                                    className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full transition-all duration-300 border hover:bg-white/5
                                                        ${subs ? 'border-yellow-500/30' : 'border-transparent'}
                                                    `}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-inner
                                                        ${subs ? 'bg-linear-to-br from-yellow-400 to-amber-600' : 'bg-linear-to-br from-blue-500 to-purple-600'}
                                                    `}>
                                                        {subs ? <Crown size={16} className="text-white" /> : <User size={16} className="text-white" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-white leading-tight flex items-center gap-1">
                                                            {user.fullName}
                                                            {subs && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                                                        </span>
                                                        <span className="text-xs text-gray-400 leading-tight max-w-[100px] truncate">
                                                            {subs ? 'Premium' : 'Standard'}
                                                        </span>
                                                    </div>
                                                </NavLink>
                                                
                                                <button 
                                                    onClick={handleLogout}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    title="Logout"
                                                >
                                                    <LogOut size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* --- Mobile Menu Button --- */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Mobile Navigation Drawer --- */}
                <div className={`
                    lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                    ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                    bg-slate-900 border-t border-white/5
                `}>
                    <div className="px-4 py-4 space-y-2">
                        {!loading && (
                            <>
                                {!user ? (
                                    <>
                                        <NavItem to="/" icon={Home} label="Home" onClick={() => setIsOpen(false)} isMobile />
                                        <NavItem to="/Menu" icon={Utensils} label="Menu" onClick={() => setIsOpen(false)} isMobile />
                                        <div className="my-2 border-t border-white/10"></div>
                                        <NavItem to="/Login" icon={LogIn} label="Login" onClick={() => setIsOpen(false)} isMobile />
                                        <NavItem to="/Signup" icon={UserPlus} label="Sign Up" onClick={() => setIsOpen(false)} isMobile />
                                    </>
                                ) : (
                                    <>
                                        {/* Mobile User Profile Summary */}
                                        <div 
                                            onClick={() => { navigate('/user'); setIsOpen(false); }}
                                            className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                                ${subs ? 'bg-linear-to-br from-yellow-400 to-amber-600' : 'bg-linear-to-br from-blue-500 to-purple-600'}
                                            `}>
                                                {subs ? <Crown size={20} className="text-white" /> : <User size={20} className="text-white" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-white font-medium flex items-center gap-2">
                                                    {user.fullName}
                                                    {subs && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                                                </div>
                                                <div className="text-sm text-gray-400 truncate">{user.email}</div>
                                            </div>
                                        </div>

                                        <NavItem to="/Menu" icon={Utensils} label="Menu" onClick={() => setIsOpen(false)} isMobile />
                                        <NavItem to={`/foodform?day=${dayName}`} icon={Utensils} label="Add Menu" onClick={() => setIsOpen(false)} isMobile />
                                        
                                        <div className="my-3 border-t border-white/10"></div>

                                        {!subs && (
                                            <button
                                                onClick={handleSubscribe}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-yellow-400 to-amber-600 text-white font-bold shadow-lg"
                                            >
                                                <Sparkles size={18} />
                                                <span>Upgrade to Premium</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 mt-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                                        >
                                            <LogOut size={18} />
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
                <div className='w-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg'>
                    <div className='max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8'>
                        <div className='flex items-center justify-center gap-2'>
                            <AlertCircle className='w-5 h-5 text-white shrink-0' />
                            <span className='font-medium text-sm sm:text-base text-white'>
                                Plan expiring soon. Renew now to keep access.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;