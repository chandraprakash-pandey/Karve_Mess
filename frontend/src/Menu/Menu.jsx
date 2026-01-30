import React, { useEffect, useState } from 'react';
import { ChefHat, UtensilsCrossed, Sparkles, MapPin, Loader } from 'lucide-react';
import axios from "axios";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`${apiUrl}/menu`);
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleMapClick = (address) => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dot-pattern flex items-center justify-center font-display">
                <div className="text-center">
                    <div className="size-20 bg-white neo-border rounded-2xl flex items-center justify-center shadow-neo-lg mx-auto mb-6 spin-slow">
                        <Loader className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-indigo-custom font-black text-xl uppercase tracking-wide">Loading Menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dot-pattern font-display text-indigo-custom py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    
                    <div className="mt-6 inline-block px-6 py-2 bg-yellow-custom neo-border rounded-full shadow-neo">
                        <span className="font-black text-2xl uppercase tracking-wider">Today's <span className="text-primary italic">Menu</span></span>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {menuItems.map((f, index) => (
                        <div 
                            key={index}
                            className="bg-white neo-border rounded-3xl shadow-neo-lg overflow-hidden card-lifted group"
                        >
                            {/* Chef Header */}
                            <div className="bg-primary p-8 text-white relative overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                                
                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="flex items-start flex-1 gap-5">
                                        <div className="bg-white/20 neo-border rounded-2xl p-4 shadow-neo">
                                            <ChefHat className="w-10 h-10" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold opacity-90 mb-2 uppercase tracking-wide">Prepared by</p>
                                            <h3 className="text-3xl font-black mb-4">{f.chefId.messName}</h3>
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                                                <p className="text-white/95 font-medium text-sm leading-relaxed flex-1">
                                                    {f.chefId.messAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMapClick(f.chefId.messAddress)}
                                        className="shrink-0 btn-lifted bg-yellow-custom neo-border rounded-xl p-3 hover:bg-white transition-all shadow-neo group/btn"
                                        title="View on Map"
                                    >
                                        <MapPin className="w-6 h-6 text-indigo-custom group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="size-3 bg-primary rounded-full pulse-scale"></div>
                                    <h4 className="text-2xl font-black text-indigo-custom uppercase tracking-tight">
                                        Today's Specialties
                                    </h4>
                                </div>
                                
                                <ul className="space-y-3">
                                    {Object.entries(f.item).map(([name, price], idx) => (
                                        <li 
                                            key={name}
                                            className="flex justify-between items-center p-4 rounded-xl bg-white neo-border hover:bg-yellow-custom/30 transition-all duration-300 group/item shadow-neo hover:shadow-neo-lg"
                                        >
                                            <span className="text-indigo-custom font-bold group-hover/item:text-primary transition-colors text-lg">
                                                {name}
                                            </span>
                                            <span className="bg-primary text-white px-4 py-2 rounded-lg font-black text-lg neo-border shadow-neo">
                                                ₹{price}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Bottom Stripe */}
                            <div className="h-3 bg-yellow-custom"></div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {menuItems.length === 0 && (
                    <div className="text-center py-32">
                        <div className="bg-white neo-border rounded-3xl shadow-neo-lg p-16 max-w-md mx-auto">
                            <div className="size-24 bg-yellow-custom/20 neo-border rounded-full flex items-center justify-center mx-auto mb-8">
                                <UtensilsCrossed className="w-12 h-12 text-indigo-custom/30" />
                            </div>
                            <p className="text-indigo-custom text-3xl font-black mb-3 uppercase">No Menu Available</p>
                            <p className="text-indigo-custom/60 font-bold">Check back soon for delicious updates!</p>
                        </div>
                    </div>
                )}
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
                .shadow-neo {
                    box-shadow: 4px 4px 0px 0px #312e81;
                }
                .shadow-neo-lg {
                    box-shadow: 8px 8px 0px 0px #312e81;
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
                
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                .pulse-scale {
                    animation: pulse-scale 2s ease-in-out infinite;
                }
                
                .wiggle {
                    animation: wiggle 2s ease-in-out infinite;
                }
                
                .spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default Menu;